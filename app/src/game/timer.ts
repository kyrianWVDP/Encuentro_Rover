import type { TimerState } from "./types";

export function remainingFromEndsAt(endsAt: number, nowMs: number): number {
  return Math.max(0, endsAt - nowMs);
}

export function startTimer(durationSec: number, nowMs: number): TimerState {
  const durationMs = durationSec * 1_000;
  const endsAt = nowMs + durationMs;
  return {
    running: true,
    endsAt,
    remainingMs: durationMs,
  };
}

export function stopTimer(timer: TimerState, nowMs: number): TimerState {
  const remainingMs =
    timer.endsAt !== null ? remainingFromEndsAt(timer.endsAt, nowMs) : timer.remainingMs;
  return {
    running: false,
    endsAt: null,
    remainingMs,
  };
}

export function restartTimer(durationSec: number, nowMs: number): TimerState {
  return startTimer(durationSec, nowMs);
}
