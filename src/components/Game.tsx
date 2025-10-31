import React, { useState, useEffect, useCallback } from "react";
import {
  Board as BoardType,
  Piece,
  PieceType,
  Player,
  Position,
  GameState,
  GameMode,
  Difficulty,
} from "../types/gameTypes";
import Board from "./Board";
import GameStatus from "./GameStatus";
import Timer from "./Timer";
import GameMenu from "./GameMenu";
import {
  initializeBoard,
  isValidMove,
  checkGameOver,
  isInCheck,
} from "../utils/gameRules";
import { AIEngine } from "../utils/aiEngine";
import { useTimer } from "../hooks/useTimer";
import { useSound } from "../hooks/useSound";
import {
  saveGame,
  loadGame,
  hasSavedGame,
  clearSavedGame,
} from "../utils/storage";

const INITIAL_TIME = 300; // 5 phút

const Game: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: [],
    currentPlayer: Player.Red,
    selectedPiece: null,
    gameOver: false,
    winner: null,
    capturedPieces: { red: [], black: [] },
    moves: [],
    gameMode: GameMode.TwoPlayers,
    difficulty: Difficulty.Medium,
    timers: { red: INITIAL_TIME, black: INITIAL_TIME },
  });

  const [showMenu, setShowMenu] = useState(true);
  const [aiThinking, setAiThinking] = useState(false);

  const { timers, activePlayer, startTimer, pauseTimer, resetTimers, addTime } =
    useTimer({
      initialTime: INITIAL_TIME,
      onTimeUp: (player) => handleTimeUp(player),
    });

  const sound = useSound(true);

  // Kiểm tra game đã lưu
  useEffect(() => {
    if (hasSavedGame() && showMenu) {
      // Có game đã lưu, giữ menu hiển thị
    }
  }, [showMenu]);

  const handleTimeUp = (player: Player) => {
    const winner = player === Player.Red ? Player.Black : Player.Red;
    setGameState((prev) => ({
      ...prev,
      gameOver: true,
      winner,
    }));
    sound.playLose();
  };

  const startNewGame = (gameMode: GameMode, difficulty: Difficulty) => {
    const newBoard = initializeBoard();
    setGameState({
      board: newBoard,
      currentPlayer: Player.Red,
      selectedPiece: null,
      gameOver: false,
      winner: null,
      capturedPieces: { red: [], black: [] },
      moves: [],
      gameMode,
      difficulty,
      timers: { red: INITIAL_TIME, black: INITIAL_TIME },
    });
    resetTimers();
    startTimer(Player.Red);
    setShowMenu(false);
    clearSavedGame();
  };

  const loadSavedGame = () => {
    const savedGame = loadGame();
    if (savedGame) {
      setGameState(savedGame);
      setShowMenu(false);
      // Khởi động lại đồng hồ
      startTimer(savedGame.currentPlayer);
    }
  };

  const handlePieceClick = useCallback(
    (piece: Piece) => {
      if (gameState.gameOver || piece.player !== gameState.currentPlayer)
        return;

      // Nếu là chế độ AI và đến lượt AI, không cho phép di chuyển
      if (
        gameState.gameMode === GameMode.VsAI &&
        gameState.currentPlayer === Player.Black &&
        !aiThinking
      ) {
        return;
      }

      // Nếu quân cờ chưa lật, lật nó lên
      if (!piece.isRevealed) {
        const newBoard = gameState.board.map((row) => [...row]);
        newBoard[piece.position.y][piece.position.x] = {
          ...piece,
          isRevealed: true,
        };

        setGameState((prev) => ({
          ...prev,
          board: newBoard,
          selectedPiece: null,
        }));

        sound.playReveal();
        return;
      }

      // Chọn quân cờ
      setGameState((prev) => ({
        ...prev,
        selectedPiece: piece,
      }));
    },
    [gameState, aiThinking, sound]
  );

  const handleCellClick = useCallback(
    (position: Position) => {
      if (gameState.gameOver || !gameState.selectedPiece) return;

      // Nếu là chế độ AI và đến lượt AI, không cho phép di chuyển
      if (
        gameState.gameMode === GameMode.VsAI &&
        gameState.currentPlayer === Player.Black
      ) {
        return;
      }

      const targetPiece = gameState.board[position.y][position.x];

      // Kiểm tra nước đi hợp lệ
      if (isValidMove(gameState.board, gameState.selectedPiece, position)) {
        const newBoard = gameState.board.map((row) => [...row]);
        const newCapturedPieces = { ...gameState.capturedPieces };

        // Xử lý ăn quân
        if (
          targetPiece &&
          targetPiece.player !== gameState.selectedPiece.player
        ) {
          if (targetPiece.player === Player.Red) {
            newCapturedPieces.red.push(targetPiece.type);
          } else {
            newCapturedPieces.black.push(targetPiece.type);
          }
          sound.playCapture();
        } else {
          sound.playMove();
        }

        // Di chuyển quân cờ
        newBoard[gameState.selectedPiece.position.y][
          gameState.selectedPiece.position.x
        ] = null;
        newBoard[position.y][position.x] = {
          ...gameState.selectedPiece,
          position,
          isSelected: false,
        };

        const newMoves = [
          ...gameState.moves,
          {
            piece: gameState.selectedPiece,
            from: gameState.selectedPiece.position,
            to: position,
            capturedPiece: targetPiece || undefined,
            timestamp: Date.now(),
          },
        ];

        const newGameState = {
          ...gameState,
          board: newBoard,
          selectedPiece: null,
          capturedPieces: newCapturedPieces,
          moves: newMoves,
        };

        // Kiểm tra chiếu tướng
        if (
          isInCheck(
            newBoard,
            gameState.currentPlayer === Player.Red ? Player.Black : Player.Red
          )
        ) {
          sound.playCheck();
        }

        // Kiểm tra kết thúc game
        const gameOverResult = checkGameOver(newBoard);
        if (gameOverResult.isOver) {
          newGameState.gameOver = true;
          newGameState.winner = gameOverResult.winner;
          pauseTimer();
          sound.playWin();
        } else {
          // Chuyển lượt
          const nextPlayer =
            gameState.currentPlayer === Player.Red ? Player.Black : Player.Red;
          newGameState.currentPlayer = nextPlayer;

          // Chuyển đồng hồ
          pauseTimer();
          startTimer(nextPlayer);

          // Thêm thời gian sau mỗi nước đi (tuỳ chọn)
          addTime(gameState.currentPlayer, 5);
        }

        setGameState(newGameState);

        // Lưu game
        saveGame(newGameState);

        // Nếu là chế độ AI và chưa kết thúc game, cho AI di chuyển
        if (
          gameState.gameMode === GameMode.VsAI &&
          !newGameState.gameOver &&
          newGameState.currentPlayer === Player.Black
        ) {
          setAiThinking(true);

          // Delay để tạo cảm giác AI đang suy nghĩ
          setTimeout(() => {
            makeAIMove(newBoard, newCapturedPieces);
          }, 1000);
        }
      }
    },
    [gameState, sound, pauseTimer, startTimer, addTime] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const makeAIMove = useCallback(
    (
      board: BoardType,
      capturedPieces: { red: PieceType[]; black: PieceType[] }
    ) => {
      const ai = new AIEngine(gameState.difficulty, Player.Black);
      const bestMove = ai.getBestMove(board);

      if (bestMove) {
        const { piece, to } = bestMove;
        const targetPiece = board[to.y][to.x];

        const newBoard = board.map((row) => [...row]);
        const newCapturedPieces = { ...capturedPieces };

        // Xử lý ăn quân
        if (targetPiece && targetPiece.player !== piece.player) {
          if (targetPiece.player === Player.Red) {
            newCapturedPieces.red.push(targetPiece.type);
          } else {
            newCapturedPieces.black.push(targetPiece.type);
          }
          sound.playCapture();
        } else {
          sound.playMove();
        }

        // Di chuyển quân cờ
        newBoard[piece.position.y][piece.position.x] = null;
        newBoard[to.y][to.x] = {
          ...piece,
          position: to,
          isSelected: false,
        };

        const newMoves = [
          ...gameState.moves,
          {
            piece,
            from: piece.position,
            to,
            capturedPiece: targetPiece || undefined,
            timestamp: Date.now(),
          },
        ];

        const newGameState = {
          ...gameState,
          board: newBoard,
          selectedPiece: null,
          capturedPieces: newCapturedPieces,
          moves: newMoves,
        };

        // Kiểm tra chiếu tướng
        if (isInCheck(newBoard, Player.Red)) {
          sound.playCheck();
        }

        // Kiểm tra kết thúc game
        const gameOverResult = checkGameOver(newBoard);
        if (gameOverResult.isOver) {
          newGameState.gameOver = true;
          newGameState.winner = gameOverResult.winner;
          pauseTimer();
          sound.playWin();
        } else {
          // Chuyển lượt về người chơi
          newGameState.currentPlayer = Player.Red;

          // Chuyển đồng hồ
          pauseTimer();
          startTimer(Player.Red);
        }

        setGameState(newGameState);
        setAiThinking(false);

        // Lưu game
        saveGame(newGameState);
      } else {
        setAiThinking(false);
      }
    },
    [gameState, sound, pauseTimer, startTimer]
  );

  const resetGame = () => {
    setShowMenu(true);
    pauseTimer();
    clearSavedGame();
  };

  const saveCurrentGame = () => {
    if (saveGame(gameState)) {
      alert("Game đã được lưu!");
    } else {
      alert("Lỗi khi lưu game!");
    }
  };

  if (showMenu) {
    return (
      <GameMenu
        onStartGame={startNewGame}
        onLoadGame={loadSavedGame}
        hasSavedGame={hasSavedGame()}
      />
    );
  }

  return (
    <div className="game">
      <div className="game-header">
        <h1>Cờ Tướng Úp</h1>
        <div className="game-controls">
          <button className="control-btn" onClick={saveCurrentGame}>
            💾 Lưu game
          </button>
          <button className="control-btn" onClick={resetGame}>
            🏠 Về menu
          </button>
        </div>
      </div>

      <div className="timers-container">
        <Timer
          player={Player.Red}
          time={timers[Player.Red]}
          isActive={activePlayer === Player.Red}
        />
        <div className="game-info">
          {aiThinking && <div className="ai-thinking">AI đang suy nghĩ...</div>}
        </div>
        <Timer
          player={Player.Black}
          time={timers[Player.Black]}
          isActive={activePlayer === Player.Black}
        />
      </div>

      <GameStatus
        currentPlayer={gameState.currentPlayer}
        gameOver={gameState.gameOver}
        winner={gameState.winner}
        capturedPieces={gameState.capturedPieces}
      />

      <Board
        board={gameState.board}
        onPieceClick={handlePieceClick}
        onCellClick={handleCellClick}
        selectedPiece={gameState.selectedPiece}
      />

      {gameState.gameOver && (
        <div className="game-over-panel">
          <h2>Game Over!</h2>
          <p>Người thắng: {gameState.winner === Player.Red ? "ĐỎ" : "ĐEN"}</p>
          <button className="reset-button" onClick={resetGame}>
            Chơi lại
          </button>
        </div>
      )}
    </div>
  );
};

export default Game;
