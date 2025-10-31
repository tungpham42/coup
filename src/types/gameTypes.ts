export enum PieceType {
  General = "General",
  Advisor = "Advisor",
  Elephant = "Elephant",
  Chariot = "Chariot",
  Horse = "Horse",
  Cannon = "Cannon",
  Soldier = "Soldier",
}

export enum Player {
  Red = "Red",
  Black = "Black",
}

export enum GameMode {
  TwoPlayers = "twoPlayers",
  VsAI = "vsAI",
}

export enum Difficulty {
  Easy = "easy",
  Medium = "medium",
  Hard = "hard",
}

export interface Position {
  x: number;
  y: number;
}

export interface Piece {
  id: string;
  type: PieceType;
  player: Player;
  position: Position;
  isRevealed: boolean;
  isSelected: boolean;
}

export interface Move {
  piece: Piece;
  from: Position;
  to: Position;
  capturedPiece?: Piece;
  timestamp: number;
}

export interface GameState {
  board: (Piece | null)[][];
  currentPlayer: Player;
  selectedPiece: Piece | null;
  gameOver: boolean;
  winner: Player | null;
  capturedPieces: {
    red: PieceType[];
    black: PieceType[];
  };
  moves: Move[];
  gameMode: GameMode;
  difficulty: Difficulty;
  timers: {
    red: number;
    black: number;
  };
}

export type Board = (Piece | null)[][];
