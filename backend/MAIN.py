from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from engine_service import engine
from ai_service import get_ai_response

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatPayload(BaseModel):
    message: str
    fen: Optional[str] = None

@app.post("/api/coach")
async def coach_endpoint(payload: ChatPayload):

    # Only analyze with Stockfish if FEN is provided
    engine_data = None
    if payload.fen:
        engine_data = engine.analyze_position(payload.fen)

    ai_reply = get_ai_response(payload.message, payload.fen, engine_data)

    return {
        "reply": ai_reply,
        "data": engine_data
    }