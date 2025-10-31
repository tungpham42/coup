import React from "react";
import { Board as BoardType, Piece, Position } from "../types/gameTypes";
import PieceComponent from "./Piece";

interface BoardProps {
  board: BoardType;
  onPieceClick: (piece: Piece) => void;
  onCellClick: (position: Position) => void;
  selectedPiece: Piece | null;
}

const Board: React.FC<BoardProps> = ({
  board,
  onPieceClick,
  onCellClick,
  selectedPiece,
}) => {
  const renderBoard = () => {
    const cells = [];

    // Vẽ bàn cờ 9x10 theo cờ tướng
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 9; x++) {
        const piece = board[y][x];
        const position = { x, y };

        // Xác định loại ô (có sông, cung, v.v.)
        let cellClass = "cell";

        // Ô sáng/tối
        cellClass += (x + y) % 2 === 0 ? " light" : " dark";

        // Sông (giữa bàn cờ)
        if (y === 4 || y === 5) {
          cellClass += " river";
        }

        // Cung (cung tướng)
        if (x >= 3 && x <= 5 && ((y >= 0 && y <= 2) || (y >= 7 && y <= 9))) {
          cellClass += " palace";
        }

        // Ô được chọn
        if (
          selectedPiece &&
          selectedPiece.position.x === x &&
          selectedPiece.position.y === y
        ) {
          cellClass += " selected";
        }

        cells.push(
          <div
            key={`${x}-${y}`}
            className={cellClass}
            onClick={() => onCellClick(position)}
          >
            {piece && (
              <PieceComponent
                piece={piece}
                onClick={() => onPieceClick(piece)}
              />
            )}
            {/* Vẽ các điểm đánh dấu trên bàn cờ */}
            {renderBoardMarks(x, y)}
          </div>
        );
      }
    }

    return cells;
  };

  // Vẽ các điểm đánh dấu trên bàn cờ cờ tướng
  const renderBoardMarks = (x: number, y: number) => {
    // Các vị trí cần đánh dấu (góc cung, vị trí pháo, tốt)
    const marks = [
      // Góc cung đen
      { x: 3, y: 0 },
      { x: 5, y: 0 },
      { x: 3, y: 2 },
      { x: 5, y: 2 },
      // Góc cung đỏ
      { x: 3, y: 7 },
      { x: 5, y: 7 },
      { x: 3, y: 9 },
      { x: 5, y: 9 },
      // Vị trí pháo
      { x: 1, y: 2 },
      { x: 7, y: 2 },
      { x: 1, y: 7 },
      { x: 7, y: 7 },
      // Vị trí tốt
      { x: 0, y: 3 },
      { x: 2, y: 3 },
      { x: 4, y: 3 },
      { x: 6, y: 3 },
      { x: 8, y: 3 },
      { x: 0, y: 6 },
      { x: 2, y: 6 },
      { x: 4, y: 6 },
      { x: 6, y: 6 },
      { x: 8, y: 6 },
    ];

    const isMark = marks.some((mark) => mark.x === x && mark.y === y);

    if (isMark) {
      return <div className="board-mark"></div>;
    }

    return null;
  };

  return (
    <div className="xiangqi-board">
      {/* Vẽ sông */}
      <div className="river-text">SÔNG</div>
      <div className="board">{renderBoard()}</div>
    </div>
  );
};

export default Board;
