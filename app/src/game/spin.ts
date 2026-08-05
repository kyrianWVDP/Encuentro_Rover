import type { Clan, Rng } from "./types";

export const SPIN_EXTRA_TURNS = 5;
export const SPIN_DURATION_MS = 3500;

export function pickClan(pending: Clan[], rng: Rng): Clan {
  if (pending.length === 0) throw new Error("No pending clans");
  const index = Math.min(pending.length - 1, Math.floor(rng() * pending.length));
  return pending[index];
}

/** Degrees to rotate the wheel so sector `index` lands under the top pointer. */
export function angleForClanIndex(
  index: number,
  sectorDegrees: number,
): number {
  return index * sectorDegrees;
}

export function targetWheelRotationDeg(
  clanIndex: number,
  currentRotationDeg: number,
  sectorDegrees: number,
  extraTurns = SPIN_EXTRA_TURNS,
): number {
  const OFFSET_DEG = sectorCenterOffset(clanIndex, sectorDegrees);
  return currentRotationDeg - (currentRotationDeg % 360) + extraTurns * 360 + OFFSET_DEG;
}

function sectorCenterOffset(clanIndex: number, sectorDegrees: number): number {
  // Center of sector under pointer: negative rotation brings sector to top
  return -(angleForClanIndex(clanIndex, sectorDegrees) + sectorDegrees / 2);
}
