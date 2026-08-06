import { describe, expect, it } from "vitest";
import { applyJudgement, initialScores, rankClans, nextTieGroup } from "./scoring";

describe("scoring", () => {
  it("initializes zeros", () => {
    expect(initialScores(["a", "b"])).toEqual({ a: 0, b: 0 });
  });
  it("adds 10 on correct", () => {
    expect(applyJudgement({ a: 0 }, "a", "correct").a).toBe(10);
  });
  it("adds 0 on incorrect", () => {
    expect(applyJudgement({ a: 5 }, "a", "incorrect").a).toBe(5);
  });
  
  it("rankClans ranks correctly and handles ties", () => {
    const clans = [{ id: "A" }, { id: "B" }, { id: "C" }, { id: "D" }];
    const scores = { A: 20, B: 30, C: 20, D: 10 };
    const ranking = rankClans(scores, clans);
    
    expect(ranking).toEqual([
      { clanId: "B", puntos: 30, puesto: 1 },
      { clanId: "A", puntos: 20, puesto: 2 },
      { clanId: "C", puntos: 20, puesto: 2 },
      { clanId: "D", puntos: 10, puesto: 4 },
    ]);
  });
  
  it("nextTieGroup returns the highest priority tie group", () => {
    const clans = [{ id: "A" }, { id: "B" }, { id: "C" }, { id: "D" }, { id: "E" }];
    const scores = { A: 20, B: 30, C: 20, D: 30, E: 10 };
    const ranking = rankClans(scores, clans);
    
    expect(nextTieGroup(ranking)).toEqual(["B", "D"]);
    
    // After B and D tie is broken:
    const scores2 = { A: 20, B: 40, C: 20, D: 30, E: 10 };
    const ranking2 = rankClans(scores2, clans);
    
    expect(nextTieGroup(ranking2)).toEqual(["A", "C"]);
    
    // No ties
    const scores3 = { A: 25, B: 40, C: 20, D: 30, E: 10 };
    const ranking3 = rankClans(scores3, clans);
    expect(nextTieGroup(ranking3)).toBeNull();
  });
});

