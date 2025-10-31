import { useRef, useEffect, useState } from "react";
import { ToneSoundManager } from "../utils/toneSoundManager";

interface SoundManager {
  playMove: () => void;
  playCapture: () => void;
  playReveal: () => void;
  playCheck: () => void;
  playWin: () => void;
  playLose: () => void;
  setVolume: (volume: number) => void;
}

export const useSound = (enabled: boolean = true): SoundManager => {
  const soundManagerRef = useRef<ToneSoundManager | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (enabled) {
      soundManagerRef.current = new ToneSoundManager();

      soundManagerRef.current
        .initialize()
        .then(() => {
          setIsReady(true);
        })
        .catch((error) => {
          console.warn("Không thể khởi tạo âm thanh:", error);
          setIsReady(true); // Vẫn cho phép chơi không có âm thanh
        });
    } else {
      setIsReady(true);
    }

    return () => {
      // Cleanup
      soundManagerRef.current = null;
    };
  }, [enabled]);

  const playSound = (playFunction: () => void) => {
    if (!enabled || !isReady || !soundManagerRef.current) return;
    playFunction();
  };

  return {
    playMove: () => playSound(() => soundManagerRef.current?.playMove()),
    playCapture: () => playSound(() => soundManagerRef.current?.playCapture()),
    playReveal: () => playSound(() => soundManagerRef.current?.playReveal()),
    playCheck: () => playSound(() => soundManagerRef.current?.playCheck()),
    playWin: () => playSound(() => soundManagerRef.current?.playWin()),
    playLose: () => playSound(() => soundManagerRef.current?.playLose()),
    setVolume: (volume: number) => soundManagerRef.current?.setVolume(volume),
  };
};
