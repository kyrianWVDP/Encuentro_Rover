export type RankRow = { clanId: string; puesto: number; puntos: number };

export function rankClans(
  scores: Record<string, number>,
  clanIds: string[],
): RankRow[] {
  const sorted = [...clanIds].sort(
    (a, b) => (scores[b] ?? 0) - (scores[a] ?? 0),
  );

  const rows: RankRow[] = [];
  let puesto = 0;

  for (let i = 0; i < sorted.length; i++) {
    const puntos = scores[sorted[i]] ?? 0;
    if (i === 0 || puntos !== rows[i - 1].puntos) {
      puesto = i + 1;
    }
    rows.push({ clanId: sorted[i], puesto, puntos });
  }

  return rows;
}

/** Highest-priority tied group on the podium (1.º–3.º), or null if podium is unique. */
export function nextTieGroup(rows: RankRow[]): string[] | null {
  const PODIUM_MAX_PUESTO = 3;
  const byPuesto = new Map<number, string[]>();

  for (const row of rows) {
    if (row.puesto > PODIUM_MAX_PUESTO) continue;
    const group = byPuesto.get(row.puesto) ?? [];
    group.push(row.clanId);
    byPuesto.set(row.puesto, group);
  }

  const tiedPuestos = [...byPuesto.keys()].sort((a, b) => a - b);
  for (const puesto of tiedPuestos) {
    const group = byPuesto.get(puesto)!;
    if (group.length > 1) {
      return group;
    }
  }

  return null;
}
