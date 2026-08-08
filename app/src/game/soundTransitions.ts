import type { GameState } from "./turnReducer";
import type { SoundEvent } from "./sounds";

export function soundsForTransition(
  prev: GameState,
  next: GameState,
): SoundEvent[] {
  const out: SoundEvent[] = [];
  if (prev.turn.phase !== "spinning" && next.turn.phase === "spinning") {
    out.push("spin");
  }
  if (
    prev.turn.phase !== "revealAnswer" &&
    next.turn.phase === "revealAnswer"
  ) {
    if (next.lastJudgement === "correct") out.push("correct");
    if (next.lastJudgement === "incorrect") out.push("incorrect");
  }
  if (prev.turn.phase !== "showScores" && next.turn.phase === "showScores") {
    out.push("scores");
  }
  if (prev.mode !== "final" && next.mode === "final") {
    out.push("winner");
  }
  return out;
}
