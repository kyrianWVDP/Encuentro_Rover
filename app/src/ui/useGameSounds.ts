import { useEffect, useRef } from "react";
import type { GameState } from "../game/turnReducer";
import { playSound, startTimerWarning, stopTimerWarning } from "../game/sounds";
import { soundsForTransition } from "../game/soundTransitions";

const TIMER_WARNING_SEC = 9;

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

  // Clock SFX on the projector for the last 9 seconds of a running question timer.
  useEffect(() => {
    const { timer, turn } = state;
    const inQuestion =
      turn.phase === "questionRunning" || turn.phase === "awaitingJudgement";

    if (!timer?.running || !timer.endsAt || !inQuestion) {
      stopTimerWarning();
      return;
    }

    const endsAt = timer.endsAt;
    const tick = () => {
      const leftSec = Math.ceil(Math.max(0, endsAt - Date.now()) / 1000);
      if (leftSec > 0 && leftSec <= TIMER_WARNING_SEC) {
        startTimerWarning();
      } else {
        stopTimerWarning();
      }
    };

    tick();
    const id = window.setInterval(tick, 200);
    return () => {
      window.clearInterval(id);
      stopTimerWarning();
    };
  }, [state.timer?.running, state.timer?.endsAt, state.turn.phase]);
}
