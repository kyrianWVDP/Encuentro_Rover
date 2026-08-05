import type { Judgement } from "./types";

export const POINTS_CORRECT = 10;

export function initialScores(clanIds: string[]): Record<string, number> {
  return Object.fromEntries(clanIds.map((id) => [id, 0]));
}

export function applyJudgement(
  scores: Record<string, number>,
  clanId: string,
  judgement: Judgement,
): Record<string, number> {
  const delta = judgement === "correct" ? POINTS_CORRECT : 0;
  return { ...scores, [clanId]: (scores[clanId] ?? 0) + delta };
}
