from pydantic import BaseModel, Field
from typing import List, Literal
from datetime import datetime

BiasType = Literal[
    "confirmation",
    "anchoring",
    "availability",
    "survivorship",
    "bandwagon",
    "dunning_kruger",
    "negativity",
    "sunk_cost"
]

class BiasResult(BaseModel):
    id: BiasType
    percentage: float = Field(..., ge=0, le=100)

class BiasAnalysisRequest(BaseModel):
    text: str

class BiasAnalysisResponse(BaseModel):
    id: str
    text: str
    results: List[BiasResult]
    summary: str
    timestamp: datetime

class PreviewResponse(BaseModel):
    text: str 