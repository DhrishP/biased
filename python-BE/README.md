# Bias Analysis API (Python FastAPI Version)

This is a FastAPI-based backend service for analyzing cognitive biases in text using Google's Gemini AI model.

## Setup

1. Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

4. Add your Google API key to the `.env` file:

```
GOOGLE_API_KEY=your_google_api_key_here
DATABASE_URL=sqlite:///./bias_analysis.db
```

## Running the Application

Start the development server:

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

## API Endpoints

- `GET /`: Health check endpoint
- `POST /preview`: Get feedback on how to improve a scenario description
- `POST /analyse`: Analyze cognitive biases in a text
- `GET /history`: Get history of previous analyses

## API Documentation

Once the server is running, you can access the interactive API documentation at:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
