import os
from dotenv import load_dotenv
import google.genai as genai
import chess
import chess.pgn
from io import StringIO

# Load environment variables
load_dotenv()

# Load Gemini API key safely
GEMINI_KEY = os.environ.get("GEMINI_API_KEY")
if not GEMINI_KEY:
    raise RuntimeError("GEMINI_API_KEY is missing from environment variables")

# Create Gemini client once (global)
client = genai.Client(api_key=GEMINI_KEY)

SYSTEM_PROMPT = """
You are an elite chess coach. You strictly answer questions about chess theory, PGN analysis, and 
board evaluation.
If the user asks about anything unrelated to chess, politely refuse.
When provided with a Stockfish evaluation, explain the tactical reasoning behind it in human terms.
"""

def is_pgn(text):
    return any(token.endswith('.') for token in text.split())

def pgn_to_fen(pgn_text):
    game = chess.pgn.read_game(StringIO(pgn_text))
    board = game.end().board()
    return board.fen()

def get_ai_response(user_message, fen, engine_data):

    # 1. If message is empty but FEN exists → treat as chess request
    if (not user_message or user_message.strip() == "") and fen:
        user_message = "Analyze this position."

    # 2. If message is empty AND no FEN → reject
    if not user_message or user_message.strip() == "":
        return "I only answer chess-related questions."

    # 3. PGN detection → convert PGN → override FEN
    if is_pgn(user_message):
        try:
            fen = pgn_to_fen(user_message)
        except Exception:
            return "I could not parse the PGN. Please check the format."

    # 4. If message clearly unrelated to chess → reject
    chess_keywords = ["chess", "fen", "pgn", "move", "opening", "endgame", "middlegame", "position"]
    if fen is None and not any(word in user_message.lower() for word in chess_keywords):
        return "I only answer chess-related questions."

    # 5. If no FEN → Gemini only
    if fen is None or fen.strip() == "":
        prompt = f"""
{SYSTEM_PROMPT}

User message: {user_message}

Respond ONLY about chess.
"""
        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=[prompt]
        )
        return response.text

    # 6. If FEN exists → Stockfish + Gemini
    prompt = f"""
{SYSTEM_PROMPT}

User message: {user_message}
Current FEN: {fen}
Stockfish Evaluation: {engine_data}

Explain this position like a human chess coach.
"""
    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=[prompt]
    )
    return response.text
