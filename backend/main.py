from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict
import uvicorn
from engine import AuraCheckEngine
from fastapi.middleware.cors import CORSMiddleware
import importlib
import engine

app = FastAPI(title="AuraCheck API")

# Add CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Force reload engine to ensure real-time headlines are used
importlib.reload(engine)
aura_engine = AuraCheckEngine()

class NewsRequest(BaseModel):
    query: str

class FactCheckRequest(BaseModel):
    url: str
    headline: str

class TTSRequest(BaseModel):
    text: str

class AudioRequest(BaseModel):
    headline: str
    summary: str
    fact_check_verdict: Optional[str] = None
    fact_check_score: Optional[int] = None
    fact_check_summary: Optional[str] = None

from fastapi.responses import Response

@app.post("/tts")
async def get_tts(request: TTSRequest):
    """Generate audio from text directly."""
    try:
        audio_bytes = await aura_engine.generate_tts(request.text)
        return Response(content=audio_bytes, media_type="audio/mpeg")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-audio")
async def generate_audio(request: AudioRequest):
    """Generate an AI script and return audio."""
    try:
        audio_bytes = await aura_engine.generate_audio_script(
            headline=request.headline,
            summary=request.summary,
            verdict=request.fact_check_verdict,
            score=request.fact_check_score,
            fc_summary=request.fact_check_summary
        )
        return Response(content=audio_bytes, media_type="audio/mpeg")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/trending")
async def get_trending_news(country: str = "us"):
    """Fetch the most up-to-date, trending news globally."""
    # Re-instantiate engine to force fresh data if needed, but fetch_trending_news is already updated
    return await aura_engine.fetch_trending_news(country)

@app.post("/fact-check")
async def fact_check(request: FactCheckRequest):
    """Deep dive into facts: cross-reference 5-10 sources."""
    try:
        return await aura_engine.verify_claims(request.url, request.headline)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "AuraCheck is cooking...", "ai": "Ready"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
