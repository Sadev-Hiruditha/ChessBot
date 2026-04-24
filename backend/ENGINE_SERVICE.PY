from stockfish import Stockfish
class EngineManager:
    def __init__(self):
        # Update path to your local stockfish binary
        self.engine = Stockfish(path="backend\stockfish\stockfish-windows-x86-64-avx2.exe")
        self.engine.set_depth(15)
    def analyze_position(self, fen_string):
        self.engine.set_fen_position(fen_string)
        return {
        "evaluation": self.engine.get_evaluation(),
        "best_move": self.engine.get_best_move()
        }
engine = EngineManager()