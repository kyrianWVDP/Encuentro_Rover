import { describe, expect, it } from "vitest";
import { nextTieGroup, rankClans } from "./ranking";

describe("rankClans", () => {
  it("sorts by puntos descending with unique puestos", () => {
    const scores = { a: 30, b: 40, c: 10, d: 20 };
    expect(rankClans(scores, ["a", "b", "c", "d"])).toEqual([
      { clanId: "b", puesto: 1, puntos: 40 },
      { clanId: "a", puesto: 2, puntos: 30 },
      { clanId: "d", puesto: 3, puntos: 20 },
      { clanId: "c", puesto: 4, puntos: 10 },
    ]);
  });

  it("assigns same puesto to tied scores and skips the next rank", () => {
    const scores = { a: 30, b: 30, c: 20, d: 10 };
    expect(rankClans(scores, ["a", "b", "c", "d"])).toEqual([
      { clanId: "a", puesto: 1, puntos: 30 },
      { clanId: "b", puesto: 1, puntos: 30 },
      { clanId: "c", puesto: 3, puntos: 20 },
      { clanId: "d", puesto: 4, puntos: 10 },
    ]);
  });

  it("treats missing scores as zero", () => {
    const scores = { a: 10 };
    expect(rankClans(scores, ["a", "b"])).toEqual([
      { clanId: "a", puesto: 1, puntos: 10 },
      { clanId: "b", puesto: 2, puntos: 0 },
    ]);
  });

  it("only ranks clans listed in clanIds", () => {
    const scores = { a: 10, b: 20, extra: 99 };
    expect(rankClans(scores, ["a", "b"])).toEqual([
      { clanId: "b", puesto: 1, puntos: 20 },
      { clanId: "a", puesto: 2, puntos: 10 },
    ]);
  });
});

describe("nextTieGroup", () => {
  it("returns clanIds at the smallest tied puesto", () => {
    const rows = rankClans({ a: 30, b: 30, c: 20, d: 10 }, ["a", "b", "c", "d"]);
    expect(nextTieGroup(rows)).toEqual(["a", "b"]);
  });

  it("returns null when all puestos are unique", () => {
    const rows = rankClans({ a: 40, b: 30, c: 20 }, ["a", "b", "c"]);
    expect(nextTieGroup(rows)).toBeNull();
  });

  it("prioritizes the highest puesto (lowest number) tie", () => {
    const rows = [
      { clanId: "a", puesto: 1, puntos: 40 },
      { clanId: "b", puesto: 2, puntos: 30 },
      { clanId: "c", puesto: 2, puntos: 30 },
      { clanId: "d", puesto: 4, puntos: 10 },
      { clanId: "e", puesto: 4, puntos: 10 },
    ];
    expect(nextTieGroup(rows)).toEqual(["b", "c"]);
  });
});
