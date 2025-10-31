import React, { useState } from "react";
import { GameMode, Difficulty } from "../types/gameTypes";

interface GameMenuProps {
  onStartGame: (gameMode: GameMode, difficulty: Difficulty) => void;
  onLoadGame: () => void;
  hasSavedGame: boolean;
}

const GameMenu: React.FC<GameMenuProps> = ({
  onStartGame,
  onLoadGame,
  hasSavedGame,
}) => {
  const [selectedMode, setSelectedMode] = useState<GameMode>(
    GameMode.TwoPlayers
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(
    Difficulty.Medium
  );

  return (
    <div className="game-menu">
      <h1>Cờ Tướng Úp</h1>

      <div className="menu-section">
        <h2>Chế độ chơi</h2>
        <div className="mode-selector">
          <button
            className={`mode-btn ${
              selectedMode === GameMode.TwoPlayers ? "active" : ""
            }`}
            onClick={() => setSelectedMode(GameMode.TwoPlayers)}
          >
            ️ Hai người
          </button>
          <button
            className={`mode-btn ${
              selectedMode === GameMode.VsAI ? "active" : ""
            }`}
            onClick={() => setSelectedMode(GameMode.VsAI)}
          >
            🤖 Đấu với AI
          </button>
        </div>
      </div>

      {selectedMode === GameMode.VsAI && (
        <div className="menu-section">
          <h2>Độ khó</h2>
          <div className="difficulty-selector">
            <button
              className={`difficulty-btn ${
                selectedDifficulty === Difficulty.Easy ? "active" : ""
              }`}
              onClick={() => setSelectedDifficulty(Difficulty.Easy)}
            >
              Dễ
            </button>
            <button
              className={`difficulty-btn ${
                selectedDifficulty === Difficulty.Medium ? "active" : ""
              }`}
              onClick={() => setSelectedDifficulty(Difficulty.Medium)}
            >
              Trung bình
            </button>
            <button
              className={`difficulty-btn ${
                selectedDifficulty === Difficulty.Hard ? "active" : ""
              }`}
              onClick={() => setSelectedDifficulty(Difficulty.Hard)}
            >
              Khó
            </button>
          </div>
        </div>
      )}

      <div className="menu-actions">
        <button
          className="start-btn"
          onClick={() => onStartGame(selectedMode, selectedDifficulty)}
        >
          Bắt đầu game mới
        </button>

        {hasSavedGame && (
          <button className="load-btn" onClick={onLoadGame}>
            Tiếp tục game đã lưu
          </button>
        )}
      </div>

      <div className="game-instructions">
        <h3>Hướng dẫn chơi:</h3>
        <ul>
          <li>Click vào quân cờ úp để lật mặt</li>
          <li>Chọn quân cờ đã lật rồi click vào ô trống để di chuyển</li>
          <li>Click vào quân đối phương để ăn quân</li>
          <li>Mục tiêu: ăn tướng của đối phương</li>
        </ul>
      </div>
    </div>
  );
};

export default GameMenu;
