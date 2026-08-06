/** @vitest-environment jsdom */
import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  soundUrl,
  isMuted,
  setMuted,
  playSound,
  unlockAudio,
  isAudioUnlocked,
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

  it("unlockAudio plays spin at volume 0 and sets unlocked", () => {
    const play = vi.fn().mockResolvedValue(undefined);
    const MockAudio = vi.fn(function (
      this: { volume: number; play: typeof play },
      _url: string,
    ) {
      this.volume = 1;
      this.play = play;
      return this;
    });
    vi.stubGlobal("Audio", MockAudio);

    expect(isAudioUnlocked()).toBe(false);
    unlockAudio();

    expect(MockAudio).toHaveBeenCalledWith("/sounds/spin.mp3");
    expect(MockAudio.mock.instances[0].volume).toBe(0);
    expect(play).toHaveBeenCalled();
    expect(isAudioUnlocked()).toBe(true);
  });
});
