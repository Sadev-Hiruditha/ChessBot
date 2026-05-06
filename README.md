**Chess AI Coach (ChessBot)**

A modern, full-stack chess web application that combines a fully interactive custom chessboard with the analytical power of Stockfish and the natural language capabilities of Google's Gemini AI. This app acts as a personal grandmaster coach, analyzing your positions and explaining the tactics in human-readable terms.

**Key Features**

Modern Dashboard UI
            A sleek, dark-mode "slate" interface built with CSS Flexbox, floating shadows, and Google Fonts for a premium look.
Strict Rule Enforcement
            Custom drag-and-drop logic using chess.js as an invisible referee. Blocks illegal moves and handles snap-back animations smoothly.
Advanced State Synchronization
            Solves UI race conditions using snap-end listeners, ensuring flawless handling of special moves like Castling and En Passant.
Engine Integration
            A Python/FastAPI backend calculates FEN strings and evaluates positions using the Stockfish (AVX2) engine.
Generative AI Coach
            Integrates with the Google Gemini API to translate raw Stockfish analysis into actionable, strategic coaching advice.
Tech Stack
      Frontend: HTML5, CSS3, Vanilla JavaScript
      Chess Libraries: chessboard-element, chess.js
      Backend: Python, FastAPI, Uvicorn, Pydantic
      Engines & AI: Stockfish 16, Google Gemini (gemini-3-flash-preview)
      Utilities: Marked.js, dotenv

**Getting Started**
**1. Clone the Repository**

git clone https://github.com/Sadev-Hiruditha/ChessBot.git
cd ChessBot

**2. Backend Setup**
Ensure you have Python 3.8+ installed, then install dependencies:

pip install -r requirements.txt

3. Environment Variables & Engine
Create a .env file in the root directory and add:

GEMINI_API_KEY=your_actual_api_key_here

Download the Stockfish executable and place it inside the stockfish_engine/ folder.

4. Run the Application
Start the backend:

uvicorn MAIN:app --reload

Start the frontend:
Open index.html using the Live Server extension in VS Code.


**How to Use**

**Play a Sequence**

Drag and drop pieces on the board. The app strictly enforces standard chess rules.

**Analyze**

Click the Analyze Position button at any time.

**Get Coached**

The app sends the current board state (FEN) to the backend, evaluates it with Stockfish, and generates a response from the Gemini AI coach.

**Custom FENs**

Paste a custom FEN string into the input box and click analyze to load that position.
