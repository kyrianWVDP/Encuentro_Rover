import { describe, expect, it } from "vitest";
import { canShowAnswer } from "./selectors";

describe("canShowAnswer", () => {
  it("false until revealAnswer", () => {
    expect(canShowAnswer("questionRunning")).toBe(false);
    expect(canShowAnswer("awaitingJudgement")).toBe(false);
    expect(canShowAnswer("revealAnswer")).toBe(true);
    expect(canShowAnswer("showScores")).toBe(true);
  });
});
