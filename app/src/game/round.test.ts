import { describe, expect, it } from "vitest";
import { CLANS } from "./clans";
import {
  advanceRoundIfComplete,
  getPendingClans,
  markClanPlayed,
} from "./round";
import type { RoundState } from "./types";

const empty: RoundState = {
  roundNumber: 1,
  playedClanIds: [],
  usedQuestionIds: [],
};

describe("round", () => {
  it("lists pending excluding played", () => {
    const state = markClanPlayed(empty, CLANS[0].id);
    const pending = getPendingClans(CLANS, state.playedClanIds);
    expect(pending).toHaveLength(7);
    expect(pending.map((c) => c.id)).not.toContain(CLANS[0].id);
  });

  it("advances round after all clans played", () => {
    let state = empty;
    for (const clan of CLANS) {
      state = markClanPlayed(state, clan.id);
      state = advanceRoundIfComplete(state, CLANS.length);
    }
    expect(state.roundNumber).toBe(2);
    expect(state.playedClanIds).toEqual([]);
  });
});
