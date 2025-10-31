import { useState, useEffect, useRef } from "react";
import { Player } from "../types/gameTypes";

interface UseTimerProps {
  initialTime: number;
  onTimeUp: (player: Player) => void;
}

export const useTimer = ({ initialTime, onTimeUp }: UseTimerProps) => {
  const [timers, setTimers] = useState({
    [Player.Red]: initialTime,
    [Player.Black]: initialTime,
  });
  const [activePlayer, setActivePlayer] = useState<Player | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (activePlayer !== null) {
      intervalRef.current = setInterval(() => {
        setTimers((prev) => {
          const newTime = prev[activePlayer] - 1;

          if (newTime <= 0) {
            clearInterval(intervalRef.current!);
            onTimeUp(activePlayer);
            return prev;
          }

          return {
            ...prev,
            [activePlayer]: newTime,
          };
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [activePlayer, onTimeUp]);

  const startTimer = (player: Player) => {
    setActivePlayer(player);
  };

  const pauseTimer = () => {
    setActivePlayer(null);
  };

  const resetTimers = () => {
    setTimers({
      [Player.Red]: initialTime,
      [Player.Black]: initialTime,
    });
    setActivePlayer(null);
  };

  const addTime = (player: Player, seconds: number) => {
    setTimers((prev) => ({
      ...prev,
      [player]: prev[player] + seconds,
    }));
  };

  return {
    timers,
    activePlayer,
    startTimer,
    pauseTimer,
    resetTimers,
    addTime,
  };
};
