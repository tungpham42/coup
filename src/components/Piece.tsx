import React from "react";
import { Piece as PieceType, Player } from "../types/gameTypes";

interface PieceProps {
  piece: PieceType;
  onClick: () => void;
}

const Piece: React.FC<PieceProps> = ({ piece, onClick }) => {
  const getPieceSymbol = () => {
    if (!piece.isRevealed) return "?";

    // Ký tự cờ tướng chuẩn
    const symbols: Record<string, string> = {
      // Đỏ - chữ Hán
      Red_General: "帥",
      Red_Advisor: "仕",
      Red_Elephant: "相",
      Red_Chariot: "俥",
      Red_Horse: "傌",
      Red_Cannon: "炮",
      Red_Soldier: "兵",
      // Đen - chữ Hán
      Black_General: "將",
      Black_Advisor: "士",
      Black_Elephant: "象",
      Black_Chariot: "車",
      Black_Horse: "馬",
      Black_Cannon: "砲",
      Black_Soldier: "卒",
    };

    return symbols[`${piece.player}_${piece.type}`] || "?";
  };

  const getPieceColor = () => {
    return piece.player === Player.Red ? "#c00" : "#000";
  };

  return (
    <div
      className={`piece ${piece.player.toLowerCase()} ${
        piece.isSelected ? "selected" : ""
      } ${piece.isRevealed ? "revealed" : "hidden"}`}
      onClick={onClick}
      style={{
        color: piece.isRevealed ? getPieceColor() : "#333",
        backgroundColor: piece.isRevealed
          ? piece.player === Player.Red
            ? "#ffe0e0"
            : "#e0e0ff"
          : "#aaa",
        borderColor: piece.isRevealed ? getPieceColor() : "#666",
      }}
    >
      {getPieceSymbol()}
    </div>
  );
};

export default Piece;
