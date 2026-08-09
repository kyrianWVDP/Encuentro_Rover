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

export type RankedClan = {
  clanId: string;
  puntos: number;
  puesto: number;
};

export function rankClans(scores: Record<string, number>, clans: { id: string }[]): RankedClan[] {
  const sorted = clans
    .map((c) => ({ clanId: c.id, puntos: scores[c.id] ?? 0 }))
    .sort((a, b) => b.puntos - a.puntos);
  
  let puesto = 1;
  return sorted.map((entry, index) => {
    if (index > 0 && entry.puntos < sorted[index - 1].puntos) {
      puesto = index + 1;
    }
    return { ...entry, puesto };
  });
}

export function nextTieGroup(ranking: RankedClan[]): string[] | null {
  // Only break ties that affect the podium (1.º–3.º). Ties for 4.º+ can stay.
  const PODIUM_MAX_PUESTO = 3;
  const groups = new Map<number, string[]>();
  for (const r of ranking) {
    if (r.puesto > PODIUM_MAX_PUESTO) continue;
    if (!groups.has(r.puesto)) {
      groups.set(r.puesto, []);
    }
    groups.get(r.puesto)!.push(r.clanId);
  }

  const puestos = [...groups.keys()].sort((a, b) => a - b);
  for (const puesto of puestos) {
    const group = groups.get(puesto)!;
    if (group.length > 1) {
      return group;
    }
  }
  return null;
}
