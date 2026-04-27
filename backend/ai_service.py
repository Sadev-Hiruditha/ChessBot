import os
from dotenv import load_dotenv
import google.genai as genai

load_dotenv()

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

SYSTEM_PROMPT = """
You are an elite chess coach. You strictly answer questions about chess theory, PGN analysis, and 
board evaluation.
If the user asks about anything unrelated to chess, politely refuse.
When provided with a Stockfish evaluation, explain the tactical reasoning behind it in human terms.
"""

def get_ai_response(user_message, fen, engine_data):
    prompt = f"""
User message: {user_message}
Current FEN: {fen}
Stockfish Evaluation: {engine_data}

Explain this position like a human chess coach.
"""

    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=[SYSTEM_PROMPT, prompt]
    )

    return response.text
