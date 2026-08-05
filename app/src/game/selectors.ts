import type { TurnPhase } from "./types";

export function canShowAnswer(phase: TurnPhase): boolean {
  return phase === "revealAnswer" || phase === "showScores";
}
