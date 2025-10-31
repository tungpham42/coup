import { Board, Piece, PieceType, Player, Position } from "../types/gameTypes";

// Khởi tạo bàn cờ Tướng Úp chuẩn
export const initializeBoard = (): Board => {
  const board: Board = Array(10)
    .fill(null)
    .map(() => Array(9).fill(null));

  // Vị trí ban đầu của cờ tướng úp
  const setupPositions = [
    // Hàng đầu đen (y=0)
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 3, y: 0 },
    { x: 4, y: 0 },
    { x: 5, y: 0 },
    { x: 6, y: 0 },
    { x: 7, y: 0 },
    { x: 8, y: 0 },

    // Hàng 2 đen (y=2) - vị trí Pháo
    { x: 1, y: 2 },
    { x: 7, y: 2 },

    // Hàng 3 đen (y=3) - vị trí Tốt
    { x: 0, y: 3 },
    { x: 2, y: 3 },
    { x: 4, y: 3 },
    { x: 6, y: 3 },
    { x: 8, y: 3 },

    // Hàng 7 đỏ (y=6) - vị trí Tốt
    { x: 0, y: 6 },
    { x: 2, y: 6 },
    { x: 4, y: 6 },
    { x: 6, y: 6 },
    { x: 8, y: 6 },

    // Hàng 8 đỏ (y=7) - vị trí Pháo
    { x: 1, y: 7 },
    { x: 7, y: 7 },

    // Hàng cuối đỏ (y=9)
    { x: 0, y: 9 },
    { x: 1, y: 9 },
    { x: 2, y: 9 },
    { x: 3, y: 9 },
    { x: 4, y: 9 },
    { x: 5, y: 9 },
    { x: 6, y: 9 },
    { x: 7, y: 9 },
    { x: 8, y: 9 },
  ];

  // Bộ quân cờ đầy đủ cho mỗi bên (theo cờ tướng)
  const pieceSet: PieceType[] = [
    PieceType.Chariot,
    PieceType.Horse,
    PieceType.Elephant,
    PieceType.Advisor,
    PieceType.General,
    PieceType.Advisor,
    PieceType.Elephant,
    PieceType.Horse,
    PieceType.Chariot,
    PieceType.Cannon,
    PieceType.Cannon,
    PieceType.Soldier,
    PieceType.Soldier,
    PieceType.Soldier,
    PieceType.Soldier,
    PieceType.Soldier,
  ];

  // Xáo trộn quân cờ
  const shuffledPieces = [...pieceSet].sort(() => Math.random() - 0.5);

  let pieceIndex = 0;

  // Đặt quân cờ lên bàn
  setupPositions.forEach((pos) => {
    const player = pos.y <= 4 ? Player.Black : Player.Red; // Đen ở trên, Đỏ ở dưới
    board[pos.y][pos.x] = {
      id: `${player}-${pos.x}-${pos.y}`,
      type: shuffledPieces[pieceIndex++],
      player,
      position: pos,
      isRevealed: false,
      isSelected: false,
    };
  });

  return board;
};

// Kiểm tra nước đi hợp lệ theo luật cờ tướng
export const isValidMove = (
  board: Board,
  piece: Piece,
  target: Position
): boolean => {
  if (!piece.isRevealed) return false;

  // Không thể ăn quân cùng màu
  const targetPiece = board[target.y][target.x];
  if (targetPiece && targetPiece.player === piece.player) return false;

  // Kiểm tra theo loại quân cờ tướng
  switch (piece.type) {
    case PieceType.General:
      return isValidGeneralMove(piece, target, board);
    case PieceType.Advisor:
      return isValidAdvisorMove(piece, target, piece.player);
    case PieceType.Elephant:
      return isValidElephantMove(piece, target, piece.player, board);
    case PieceType.Chariot:
      return isValidChariotMove(board, piece.position, target);
    case PieceType.Horse:
      return isValidHorseMove(board, piece.position, target);
    case PieceType.Cannon:
      return isValidCannonMove(board, piece.position, target);
    case PieceType.Soldier:
      return isValidSoldierMove(piece, target, piece.player);
    default:
      return false;
  }
};

// TƯỚNG - Đi ngang/dọc 1 ô, trong cung
const isValidGeneralMove = (
  piece: Piece,
  target: Position,
  board: Board
): boolean => {
  const dx = Math.abs(target.x - piece.position.x);
  const dy = Math.abs(target.y - piece.position.y);

  // Chỉ đi 1 ô ngang/dọc
  if (!((dx === 1 && dy === 0) || (dx === 0 && dy === 1))) return false;

  // Phải ở trong cung (3x3)
  if (piece.player === Player.Red) {
    // Cung đỏ: x=3-5, y=7-9
    if (target.x < 3 || target.x > 5 || target.y < 7 || target.y > 9)
      return false;
  } else {
    // Cung đen: x=3-5, y=0-2
    if (target.x < 3 || target.x > 5 || target.y < 0 || target.y > 2)
      return false;
  }

  return true;
};

// SĨ - Đi chéo 1 ô, trong cung
const isValidAdvisorMove = (
  piece: Piece,
  target: Position,
  player: Player
): boolean => {
  const dx = Math.abs(target.x - piece.position.x);
  const dy = Math.abs(target.y - piece.position.y);

  // Chỉ đi chéo 1 ô
  if (dx !== 1 || dy !== 1) return false;

  // Phải ở trong cung
  if (player === Player.Red) {
    if (target.x < 3 || target.x > 5 || target.y < 7 || target.y > 9)
      return false;
  } else {
    if (target.x < 3 || target.x > 5 || target.y < 0 || target.y > 2)
      return false;
  }

  return true;
};

// TƯỢNG - Đi chéo 2 ô, không qua sông
const isValidElephantMove = (
  piece: Piece,
  target: Position,
  player: Player,
  board: Board
): boolean => {
  const dx = Math.abs(target.x - piece.position.x);
  const dy = Math.abs(target.y - piece.position.y);

  // Phải đi chéo 2 ô
  if (dx !== 2 || dy !== 2) return false;

  // Kiểm tra chân tượng bị cản
  const blockX = (piece.position.x + target.x) / 2;
  const blockY = (piece.position.y + target.y) / 2;
  if (board[blockY][blockX]) return false;

  // Không được qua sông
  if (player === Player.Red && target.y < 5) return false; // Đỏ không qua sông lên
  if (player === Player.Black && target.y > 4) return false; // Đen không qua sông xuống

  return true;
};

// XE - Đi ngang/dọc bao nhiêu ô cũng được, không nhảy qua quân
const isValidChariotMove = (
  board: Board,
  from: Position,
  to: Position
): boolean => {
  if (from.x !== to.x && from.y !== to.y) return false;

  return !hasPiecesBetween(board, from, to);
};

// MÃ - Đi hình chữ L (ngang 2 dọc 1 hoặc ngang 1 dọc 2), không bị cản chân
const isValidHorseMove = (
  board: Board,
  from: Position,
  to: Position
): boolean => {
  const dx = Math.abs(to.x - from.x);
  const dy = Math.abs(to.y - from.y);

  if (!((dx === 1 && dy === 2) || (dx === 2 && dy === 1))) return false;

  // Kiểm tra chân mã bị cản
  let blockX, blockY;
  if (dx === 1) {
    // Đi ngang 1, dọc 2
    blockX = from.x;
    blockY = from.y + (to.y - from.y > 0 ? 1 : -1);
  } else {
    // Đi ngang 2, dọc 1
    blockX = from.x + (to.x - from.x > 0 ? 1 : -1);
    blockY = from.y;
  }

  return !board[blockY][blockX];
};

// PHÁO - Đi ngang/dọc như Xe, nhưng ăn quân phải có đích nhảy
const isValidCannonMove = (
  board: Board,
  from: Position,
  to: Position
): boolean => {
  if (from.x !== to.x && from.y !== to.y) return false;

  const targetPiece = board[to.y][to.x];
  const piecesBetween = countPiecesBetween(board, from, to);

  if (!targetPiece) {
    // Di chuyển: không được có quân cản
    return piecesBetween === 0;
  } else {
    // Ăn quân: phải có đúng 1 quân ở giữa làm đích nhảy
    return piecesBetween === 1;
  }
};

// TỐT - Đi thẳng 1 ô, qua sông được đi ngang
const isValidSoldierMove = (
  piece: Piece,
  target: Position,
  player: Player
): boolean => {
  const dx = Math.abs(target.x - piece.position.x);
  const dy = target.y - piece.position.y;

  if (player === Player.Red) {
    // Tốt đỏ chỉ được đi lên (giảm y)
    if (dy >= 0) return false;

    if (piece.position.y > 4) {
      // Chưa qua sông: chỉ đi thẳng
      return dx === 0 && Math.abs(dy) === 1;
    } else {
      // Đã qua sông: được đi thẳng hoặc ngang
      return (dx === 0 && Math.abs(dy) === 1) || (dx === 1 && dy === 0);
    }
  } else {
    // Tốt đen chỉ được đi xuống (tăng y)
    if (dy <= 0) return false;

    if (piece.position.y < 5) {
      // Chưa qua sông: chỉ đi thẳng
      return dx === 0 && Math.abs(dy) === 1;
    } else {
      // Đã qua sông: được đi thẳng hoặc ngang
      return (dx === 0 && Math.abs(dy) === 1) || (dx === 1 && dy === 0);
    }
  }
};

// Hàm hỗ trợ đếm quân cờ giữa hai điểm
const hasPiecesBetween = (
  board: Board,
  from: Position,
  to: Position
): boolean => {
  return countPiecesBetween(board, from, to) > 0;
};

const countPiecesBetween = (
  board: Board,
  from: Position,
  to: Position
): number => {
  let count = 0;

  if (from.x === to.x) {
    // Di chuyển dọc
    const start = Math.min(from.y, to.y) + 1;
    const end = Math.max(from.y, to.y);
    for (let y = start; y < end; y++) {
      if (board[y][from.x]) count++;
    }
  } else if (from.y === to.y) {
    // Di chuyển ngang
    const start = Math.min(from.x, to.x) + 1;
    const end = Math.max(from.x, to.x);
    for (let x = start; x < end; x++) {
      if (board[from.y][x]) count++;
    }
  }

  return count;
};

// Kiểm tra kết thúc game
export const checkGameOver = (
  board: Board
): { isOver: boolean; winner: Player | null } => {
  // Kiểm tra nếu một trong hai tướng bị bắt
  const redGeneral = findGeneral(board, Player.Red);
  const blackGeneral = findGeneral(board, Player.Black);

  if (!redGeneral) return { isOver: true, winner: Player.Black };
  if (!blackGeneral) return { isOver: true, winner: Player.Red };

  return { isOver: false, winner: null };
};

export const getAllPossibleMoves = (board: Board, piece: Piece): Position[] => {
  const moves: Position[] = [];

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 9; x++) {
      const target: Position = { x, y };
      if (isValidMove(board, piece, target)) {
        moves.push(target);
      }
    }
  }

  return moves;
};

export const isInCheck = (board: Board, player: Player): boolean => {
  const general = findGeneral(board, player);
  if (!general) return false;

  // Kiểm tra xem có quân đối phương nào có thể ăn tướng không
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 9; x++) {
      const piece = board[y][x];
      if (piece && piece.player !== player && piece.isRevealed) {
        if (isValidMove(board, piece, general.position)) {
          return true;
        }
      }
    }
  }

  return false;
};

const findGeneral = (board: Board, player: Player): Piece | null => {
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 9; x++) {
      const piece = board[y][x];
      if (
        piece &&
        piece.isRevealed &&
        piece.type === PieceType.General &&
        piece.player === player
      ) {
        return piece;
      }
    }
  }
  return null;
};

export const isCheckmate = (board: Board, player: Player): boolean => {
  if (!isInCheck(board, player)) return false;

  // Kiểm tra xem có nước đi nào thoát chiếu không
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 9; x++) {
      const piece = board[y][x];
      if (piece && piece.player === player && piece.isRevealed) {
        const possibleMoves = getAllPossibleMoves(board, piece);
        for (const move of possibleMoves) {
          const newBoard = makeTestMove(board, piece, move);
          if (!isInCheck(newBoard, player)) {
            return false; // Có nước đi thoát chiếu
          }
        }
      }
    }
  }

  return true; // Hết nước đi, chiếu bí
};

const makeTestMove = (board: Board, piece: Piece, to: Position): Board => {
  const newBoard = JSON.parse(JSON.stringify(board)) as Board;

  newBoard[piece.position.y][piece.position.x] = null;
  newBoard[to.y][to.x] = {
    ...piece,
    position: to,
  };

  return newBoard;
};
