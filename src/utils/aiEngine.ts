import {
  Board,
  Piece,
  PieceType,
  Player,
  Position,
  Difficulty,
} from "../types/gameTypes";
import { isValidMove, getAllPossibleMoves } from "./gameRules";

interface ScoredMove {
  move: {
    piece: Piece;
    to: Position;
  };
  score: number;
}

export class AIEngine {
  private difficulty: Difficulty;
  private player: Player;

  constructor(difficulty: Difficulty, player: Player = Player.Black) {
    this.difficulty = difficulty;
    this.player = player;
  }

  public getBestMove(board: Board): { piece: Piece; to: Position } | null {
    const possibleMoves = this.getAllValidMoves(board);

    if (possibleMoves.length === 0) return null;

    // Độ sâu tìm kiếm theo độ khó
    const depth = this.getSearchDepth();

    let bestMove: ScoredMove | null = null;

    for (const move of possibleMoves) {
      const newBoard = this.makeMove(board, move.piece, move.to);
      const score = this.minimax(
        newBoard,
        depth - 1,
        -Infinity,
        Infinity,
        false
      );

      if (!bestMove || score > bestMove.score) {
        bestMove = { move, score };
      }
    }

    return bestMove ? bestMove.move : possibleMoves[0];
  }

  private minimax(
    board: Board,
    depth: number,
    alpha: number,
    beta: number,
    isMaximizing: boolean
  ): number {
    if (depth === 0) {
      return this.evaluateBoard(board);
    }

    const possibleMoves = this.getAllValidMoves(
      board,
      isMaximizing ? this.player : this.getOpponent()
    );

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of possibleMoves) {
        const newBoard = this.makeMove(board, move.piece, move.to);
        const evaluation = this.minimax(
          newBoard,
          depth - 1,
          alpha,
          beta,
          false
        );
        maxEval = Math.max(maxEval, evaluation);
        alpha = Math.max(alpha, evaluation);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of possibleMoves) {
        const newBoard = this.makeMove(board, move.piece, move.to);
        const evaluation = this.minimax(newBoard, depth - 1, alpha, beta, true);
        minEval = Math.min(minEval, evaluation);
        beta = Math.min(beta, evaluation);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }

  private evaluateBoard(board: Board): number {
    let score = 0;

    // Đánh giá dựa trên giá trị quân cờ
    const pieceValues: Record<PieceType, number> = {
      [PieceType.General]: 1000,
      [PieceType.Advisor]: 20,
      [PieceType.Elephant]: 25,
      [PieceType.Chariot]: 90,
      [PieceType.Horse]: 40,
      [PieceType.Cannon]: 45,
      [PieceType.Soldier]: 10,
    };

    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 9; x++) {
        const piece = board[y][x];
        if (piece && piece.isRevealed) {
          const value = pieceValues[piece.type];
          const multiplier = piece.player === this.player ? 1 : -1;
          score += value * multiplier;
        }
      }
    }

    // Thêm điểm chiến lược cho các vị trí tốt
    score += this.evaluatePosition(board);

    return score;
  }

  private evaluatePosition(board: Board): number {
    let positionScore = 0;

    // Đánh giá cao các quân cờ ở vị trí tấn công
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 9; x++) {
        const piece = board[y][x];
        if (piece && piece.isRevealed && piece.player === this.player) {
          // Ưu tiên quân cờ ở phần sân đối phương
          if (this.player === Player.Red && y < 5) {
            positionScore += 5;
          } else if (this.player === Player.Black && y >= 5) {
            positionScore += 5;
          }

          // Đánh giá cao các nước tấn công vào tướng
          if (this.isAttackingGeneral(board, piece)) {
            positionScore += 50;
          }
        }
      }
    }

    return positionScore;
  }

  private isAttackingGeneral(board: Board, piece: Piece): boolean {
    // Kiểm tra nếu quân cờ có thể tấn công tướng đối phương
    const opponentGeneral = this.findGeneral(board, this.getOpponent());
    if (!opponentGeneral) return false;

    return isValidMove(board, piece, opponentGeneral.position);
  }

  private findGeneral(board: Board, player: Player): Piece | null {
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
  }

  private getAllValidMoves(
    board: Board,
    player?: Player
  ): { piece: Piece; to: Position }[] {
    const targetPlayer = player || this.player;
    const moves: { piece: Piece; to: Position }[] = [];

    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 9; x++) {
        const piece = board[y][x];
        if (piece && piece.player === targetPlayer && piece.isRevealed) {
          const possibleMoves = getAllPossibleMoves(board, piece);
          for (const move of possibleMoves) {
            moves.push({ piece, to: move });
          }
        }
      }
    }

    return moves;
  }

  private makeMove(board: Board, piece: Piece, to: Position): Board {
    const newBoard = JSON.parse(JSON.stringify(board)) as Board;

    // Di chuyển quân cờ
    newBoard[piece.position.y][piece.position.x] = null;
    newBoard[to.y][to.x] = {
      ...piece,
      position: to,
    };

    return newBoard;
  }

  private getOpponent(): Player {
    return this.player === Player.Red ? Player.Black : Player.Red;
  }

  private getSearchDepth(): number {
    switch (this.difficulty) {
      case Difficulty.Easy:
        return 1;
      case Difficulty.Medium:
        return 2;
      case Difficulty.Hard:
        return 3;
      default:
        return 2;
    }
  }
}
