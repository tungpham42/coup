import React from "react";
import { Player, PieceType } from "../types/gameTypes";

interface GameStatusProps {
  currentPlayer: Player;
  gameOver: boolean;
  winner: Player | null;
  capturedPieces: {
    red: PieceType[];
    black: PieceType[];
  };
}

const GameStatus: React.FC<GameStatusProps> = ({
  currentPlayer,
  gameOver,
  winner,
  capturedPieces,
}) => {
  return (
    <div className="game-status">
      <div className="status-info">
        {gameOver ? (
          <div className="game-over">
            Game Over! Winner: {winner === Player.Red ? "Red" : "Black"}
          </div>
        ) : (
          <div className="current-player">
            Current Player: {currentPlayer === Player.Red ? "Red" : "Black"}
          </div>
        )}
      </div>

      <div className="captured-pieces">
        <div className="captured-red">
          <strong>Red Captured:</strong> {capturedPieces.red.join(", ")}
        </div>
        <div className="captured-black">
          <strong>Black Captured:</strong> {capturedPieces.black.join(", ")}
        </div>
      </div>
    </div>
  );
};

export default GameStatus;
