import { useEffect, useRef } from "react";
import type { GameState } from "../game/turnReducer";
import { playSound } from "../game/sounds";
import { soundsForTransition } from "../game/soundTransitions";

export function useGameSounds(state: GameState): void {
  const prevRef = useRef<GameState | null>(null);

  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = state;
    if (!prev) return;
    for (const ev of soundsForTransition(prev, state)) {
      playSound(ev);
    }
  }, [state]);
}
