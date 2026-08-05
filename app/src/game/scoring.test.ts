import { describe, expect, it } from "vitest";
import { applyJudgement, initialScores } from "./scoring";

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
});
