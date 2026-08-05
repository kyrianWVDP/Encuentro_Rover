import { describe, expect, it } from "vitest";
import { CLANS } from "./clans";
import { QUESTIONS } from "./questions";
import { initialGameState, turnReducer } from "./turnReducer";
import { SPIN_EXTRA_TURNS } from "./spin";

const rng0 = () => 0;

describe("turnReducer", () => {
  it("SPIN selects a pending clan without marking played", () => {
    const s1 = turnReducer(initialGameState(), { type: "SPIN", rng: rng0 });
    expect(s1.turn.phase).toBe("spinning");
    expect(s1.turn.selectedClanId).toBe(CLANS[0].id);
    expect(s1.round.playedClanIds).toEqual([]);
  });

  it("RESPIN does not consume clan or question", () => {
    let s = turnReducer(initialGameState(), { type: "SPIN", rng: rng0 });
    s = turnReducer(s, { type: "SPIN_FINISHED" });
    const before = structuredClone(s.round);
    s = turnReducer(s, { type: "RESPIN", rng: () => 0.9 });
    expect(s.round).toEqual(before);
    expect(s.turn.phase).toBe("spinning");
  });

  it("SHOW_QUESTION marks clan and uses a question", () => {
    let s = turnReducer(initialGameState(), { type: "SPIN", rng: rng0 });
    s = turnReducer(s, { type: "SPIN_FINISHED" });
    s = turnReducer(s, { type: "SHOW_QUESTION", rng: rng0 });
    expect(s.turn.phase).toBe("questionRunning");
    expect(s.round.playedClanIds).toContain(CLANS[0].id);
    expect(s.round.usedQuestionIds).toContain(QUESTIONS[0].id);
  });

  it("advances round after 8 SHOW_QUESTION cycles", () => {
    let s = initialGameState();
    for (let i = 0; i < 8; i++) {
      s = turnReducer(s, { type: "SPIN", rng: () => 0 });
      s = turnReducer(s, { type: "SPIN_FINISHED" });
      s = turnReducer(s, { type: "SHOW_QUESTION", rng: () => 0 });
      s = turnReducer(s, { type: "NEXT_TURN" });
    }
    expect(s.round.roundNumber).toBe(2);
    expect(s.round.playedClanIds).toEqual([]);
  });

  it("successive spins produce a rotation delta >= SPIN_EXTRA_TURNS * 360 - small tolerance", () => {
    let s = initialGameState();
    s = turnReducer(s, { type: "SPIN", rng: () => 0 });
    const rot1 = s.rotationDeg;
    
    s = turnReducer(s, { type: "SPIN_FINISHED" });
    s = turnReducer(s, { type: "SHOW_QUESTION", rng: () => 0 });
    s = turnReducer(s, { type: "NEXT_TURN" });

    s = turnReducer(s, { type: "SPIN", rng: () => 0.5 });
    const rot2 = s.rotationDeg;
    
    expect(rot2 - rot1).toBeGreaterThanOrEqual(SPIN_EXTRA_TURNS * 360 - 720);
  });
});
