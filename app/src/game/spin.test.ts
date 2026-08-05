import { describe, expect, it } from "vitest";
import { CLANS, clanSectorIndex } from "./clans";
import { angleForClanIndex, pickClan } from "./spin";

describe("pickClan", () => {
  it("picks only from pending", () => {
    const pending = CLANS.slice(0, 3);
    const picked = pickClan(pending, () => 0.99);
    expect(pending.map((c) => c.id)).toContain(picked.id);
  });

  it("uses rng to select index", () => {
    const pending = CLANS.slice(0, 4);
    // 0.5 * 4 = 2
    expect(pickClan(pending, () => 0.5).id).toBe(pending[2].id);
  });

  it("throws when pending is empty", () => {
    expect(() => pickClan([], () => 0)).toThrow();
  });
});

describe("angleForClanIndex", () => {
  it("uses 45° sectors", () => {
    expect(angleForClanIndex(0, 45)).toBe(0);
    expect(angleForClanIndex(1, 45)).toBe(45);
    expect(angleForClanIndex(7, 45)).toBe(315);
  });

  it("maps each clan to a distinct sector", () => {
    const angles = CLANS.map((c) => angleForClanIndex(clanSectorIndex(c.id), 45));
    expect(new Set(angles).size).toBe(8);
  });
});
