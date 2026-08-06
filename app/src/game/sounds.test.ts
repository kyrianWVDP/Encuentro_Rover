/** @vitest-environment jsdom */
import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  soundUrl,
  isMuted,
  setMuted,
  playSound,
  MUTE_STORAGE_KEY,
} from "./sounds";

describe("sounds", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("soundUrl maps known events and stubs", () => {
    expect(soundUrl("spin")).toBe("/sounds/spin.mp3");
    expect(soundUrl("correct")).toBe("/sounds/correct.mp3");
    expect(soundUrl("incorrect")).toBe("/sounds/incorrect.mp3");
    expect(soundUrl("winner")).toBe("/sounds/winner.mp3");
    expect(soundUrl("start")).toBeNull();
    expect(soundUrl("timer10")).toBeNull();
    expect(soundUrl("timerEnd")).toBeNull();
  });

  it("setMuted persists and isMuted reads it", () => {
    expect(isMuted()).toBe(false);
    setMuted(true);
    expect(localStorage.getItem(MUTE_STORAGE_KEY)).toBe("1");
    expect(isMuted()).toBe(true);
    setMuted(false);
    expect(localStorage.getItem(MUTE_STORAGE_KEY)).toBe("0");
    expect(isMuted()).toBe(false);
  });

  it("playSound does not throw when muted or stub", () => {
    setMuted(true);
    expect(() => playSound("spin")).not.toThrow();
    setMuted(false);
    expect(() => playSound("start")).not.toThrow();
  });
});
