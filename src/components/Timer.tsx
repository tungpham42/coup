import React from "react";
import { Player } from "../types/gameTypes";

interface TimerProps {
  player: Player;
  time: number;
  isActive: boolean;
}

const Timer: React.FC<TimerProps> = ({ player, time, isActive }) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div
      className={`timer ${player.toLowerCase()} ${isActive ? "active" : ""}`}
    >
      <div className="timer-label">{player === Player.Red ? "Đỏ" : "Đen"}</div>
      <div className="timer-display">{formatTime(time)}</div>
    </div>
  );
};

export default Timer;
