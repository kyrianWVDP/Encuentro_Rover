import { describe, expect, it } from "vitest";
import { QUESTIONS, pickRandomUnused } from "./questions";

describe("pickRandomUnused", () => {
  it("never returns a used id", () => {
    const used = [QUESTIONS[0].id, QUESTIONS[1].id];
    const q = pickRandomUnused(used, QUESTIONS, () => 0);
    expect(used).not.toContain(q.id);
  });

  it("throws when none left", () => {
    const used = QUESTIONS.map((q) => q.id);
    expect(() => pickRandomUnused(used, QUESTIONS, () => 0)).toThrow();
  });
});
