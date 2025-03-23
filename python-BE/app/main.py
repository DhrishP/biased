from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
import google.generativeai as genai
from uuid import uuid4
import os
from dotenv import load_dotenv
from typing import List
import json

from .database import get_db, init_db
from .schemas import BiasAnalysisRequest, BiasAnalysisResponse, PreviewResponse, BiasResult
from .models import BiasAnalysis

load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Google AI
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY environment variable is not set")

genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-pro')

@app.on_event("startup")
async def startup_event():
    await init_db()

@app.get("/")
async def root():
    return {"message": "Bias Analysis API"}

@app.post("/preview", response_model=PreviewResponse)
async def preview(request: BiasAnalysisRequest):
    try:
        system_prompt = """You are an AI assistant that helps users improve their scenario descriptions for bias analysis.
        Provide constructive feedback on how to make the scenario more detailed and clear for better bias analysis.
        Suggest specific elements that could be added to provide more context."""

        response = model.generate_content([
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": request.text}
        ])
        
        return PreviewResponse(text=response.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyse", response_model=BiasAnalysisResponse)
async def analyse(
    request: BiasAnalysisRequest,
    db: AsyncSession = Depends(get_db)
):
    try:
        system_prompt = """You are an expert in cognitive biases and psychology. 
        Analyze the given scenario and identify cognitive biases present.
        For each bias, provide a percentage indicating how strongly the bias is present (0-100%).
        Only use these bias types: confirmation, anchoring, availability, survivorship, bandwagon, 
        dunning_kruger, negativity, sunk_cost.
        Ensure the percentages sum to 100%.
        Return the result in JSON format with 'biases' array containing objects with 'id' and 'percentage'."""

        # Get bias analysis
        response = model.generate_content([
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": request.text}
        ])
        
        # Parse the response to get biases
        bias_data = json.loads(response.text)
        bias_results = [BiasResult(**bias) for bias in bias_data["biases"]]
        
        # Get summary
        summary_prompt = """Create a concise summary analysis of the cognitive biases identified in the scenario.
        Explain how these biases interact and their potential impact on decision-making."""
        
        summary_response = model.generate_content([
            {"role": "system", "content": summary_prompt},
            {"role": "user", "content": f"Scenario: {request.text}\n\nIdentified biases: {response.text}"}
        ])

        # Create database entry
        analysis_id = str(uuid4())
        db_analysis = BiasAnalysis(
            id=analysis_id,
            text=request.text,
            results=bias_data["biases"],
            summary=summary_response.text
        )
        
        db.add(db_analysis)
        await db.commit()
        
        return BiasAnalysisResponse(
            id=analysis_id,
            text=request.text,
            results=bias_results,
            summary=summary_response.text,
            timestamp=db_analysis.timestamp
        )
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history", response_model=List[BiasAnalysisResponse])
async def get_history(db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(
            "SELECT * FROM bias_analyses ORDER BY timestamp DESC"
        )
        analyses = result.all()
        
        return [
            BiasAnalysisResponse(
                id=analysis.id,
                text=analysis.text,
                results=[BiasResult(**bias) for bias in analysis.results],
                summary=analysis.summary,
                timestamp=analysis.timestamp
            )
            for analysis in analyses
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 