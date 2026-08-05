import type { Clan } from "./types";
import { defaultEventConfig } from "./eventConfig";

/** @deprecated Use loadEventConfig().clans instead */
export const CLANS: Clan[] = defaultEventConfig().clans.map(c => ({ id: c.id, nombre: c.nombre }));

export function clanSectorIndex(clanId: string, clans: Clan[] = CLANS): number {
  const index = clans.findIndex((c) => c.id === clanId);
  if (index < 0) throw new Error(`Unknown clan: ${clanId}`);
  return index;
}
