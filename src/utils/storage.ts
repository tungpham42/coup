import { GameState } from "../types/gameTypes";

const SAVE_KEY = "co_tuong_up_save";

export const saveGame = (gameState: GameState): boolean => {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
    return true;
  } catch (error) {
    console.error("Lỗi khi lưu game:", error);
    return false;
  }
};

export const loadGame = (): GameState | null => {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (!saved) return null;

    return JSON.parse(saved) as GameState;
  } catch (error) {
    console.error("Lỗi khi tải game:", error);
    return null;
  }
};

export const hasSavedGame = (): boolean => {
  return localStorage.getItem(SAVE_KEY) !== null;
};

export const clearSavedGame = (): void => {
  localStorage.removeItem(SAVE_KEY);
};
