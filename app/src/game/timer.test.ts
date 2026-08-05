import { describe, expect, it } from "vitest";
import { remainingFromEndsAt, restartTimer, startTimer, stopTimer } from "./timer";

describe("timer", () => {
  it("startTimer sets endsAt ~ now+duration", () => {
    const t = startTimer(60, 1_000_000);
    expect(t.running).toBe(true);
    expect(t.endsAt).toBe(1_000_000 + 60_000);
    expect(t.remainingMs).toBe(60_000);
  });
  it("stopTimer freezes remaining", () => {
    const t = stopTimer(startTimer(60, 0), 10_000);
    expect(t.running).toBe(false);
    expect(t.remainingMs).toBe(50_000);
    expect(t.endsAt).toBeNull();
  });
  it("restartTimer resets to full duration", () => {
    const t = restartTimer(60, 5_000);
    expect(t.endsAt).toBe(5_000 + 60_000);
  });
  it("remainingFromEndsAt floors at 0", () => {
    expect(remainingFromEndsAt(100, 200)).toBe(0);
  });
});
