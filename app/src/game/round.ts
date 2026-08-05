import type { Clan, RoundState } from "./types";

export function getPendingClans(
  clans: Clan[],
  playedClanIds: string[],
): Clan[] {
  const played = new Set(playedClanIds);
  return clans.filter((c) => !played.has(c.id));
}

export function markClanPlayed(
  state: RoundState,
  clanId: string,
): RoundState {
  if (state.playedClanIds.includes(clanId)) return state;
  return {
    ...state,
    playedClanIds: [...state.playedClanIds, clanId],
  };
}

export function advanceRoundIfComplete(
  state: RoundState,
  clanCount: number,
): RoundState {
  if (state.playedClanIds.length < clanCount) return state;
  return {
    ...state,
    roundNumber: state.roundNumber + 1,
    playedClanIds: [],
  };
}
