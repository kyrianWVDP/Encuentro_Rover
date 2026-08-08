/** @vitest-environment jsdom */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  soundUrl,
  isMuted,
  setMuted,
  playSound,
  unlockAudio,
  MUTE_STORAGE_KEY,
} from "./sounds";

function stubMockAudio() {
  const play = vi.fn().mockResolvedValue(undefined);
  const MockAudio = vi.fn(function (
    this: { volume: number; muted: boolean; play: typeof play },
    _url: string,
  ) {
    this.volume = 1;
    this.muted = false;
    this.play = play;
    return this;
  });
  vi.stubGlobal("Audio", MockAudio);
  return { MockAudio, play };
}

describe("sounds", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("soundUrl maps known events and stubs", () => {
    expect(soundUrl("spin")).toBe("/sounds/spin.mp3");
    expect(soundUrl("correct")).toBe("/sounds/correct.mp3");
    expect(soundUrl("incorrect")).toBe("/sounds/incorrect.mp3");
    expect(soundUrl("winner")).toBe("/sounds/winner.mp3");
    expect(soundUrl("scores")).toBe("/sounds/scores.mp3");
    expect(soundUrl("timer10")).toBe("/sounds/timer9.mp3");
    expect(soundUrl("start")).toBeNull();
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

  it("playSound with mute=true does not construct Audio", () => {
    const { MockAudio } = stubMockAudio();
    setMuted(true);
    expect(() => playSound("spin")).not.toThrow();
    expect(MockAudio).not.toHaveBeenCalled();
  });

  it("playSound does not throw for stub events without a file", () => {
    setMuted(false);
    expect(() => playSound("start")).not.toThrow();
  });

  it("unlockAudio plays spin at volume 0 and muted", () => {
    const { MockAudio, play } = stubMockAudio();

    unlockAudio();

    expect(MockAudio).toHaveBeenCalledWith("/sounds/spin.mp3");
    expect(MockAudio.mock.instances[0].volume).toBe(0);
    expect(MockAudio.mock.instances[0].muted).toBe(true);
    expect(play).toHaveBeenCalled();
  });
});
