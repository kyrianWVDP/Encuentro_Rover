/** @vitest-environment jsdom */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  soundUrl,
  isMuted,
  setMuted,
  playSound,
  unlockAudio,
  isAudioUnlocked,
  MUTE_STORAGE_KEY,
  __resetAudioForTests,
} from "./sounds";
import { assetUrl } from "./assetUrl";

function stubMockAudio() {
  const play = vi.fn().mockResolvedValue(undefined);
  const MockAudio = vi.fn(function (
    this: {
      volume: number;
      muted: boolean;
      preload: string;
      currentTime: number;
      play: typeof play;
      pause: ReturnType<typeof vi.fn>;
      load: ReturnType<typeof vi.fn>;
      cloneNode: (deep?: boolean) => unknown;
    },
    _url: string,
  ) {
    this.volume = 1;
    this.muted = false;
    this.preload = "";
    this.currentTime = 0;
    this.play = play;
    this.pause = vi.fn();
    this.load = vi.fn();
    this.cloneNode = () => {
      const clone = new (MockAudio as unknown as new (u: string) => object)(_url);
      return clone;
    };
    return this;
  });
  vi.stubGlobal("Audio", MockAudio);
  return { MockAudio, play };
}

describe("sounds", () => {
  beforeEach(() => {
    localStorage.clear();
    __resetAudioForTests();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    __resetAudioForTests();
  });

  it("soundUrl maps known events and stubs", () => {
    expect(soundUrl("spin")).toBe(assetUrl("/sounds/spin.mp3"));
    expect(soundUrl("correct")).toBe(assetUrl("/sounds/correct.mp3"));
    expect(soundUrl("incorrect")).toBe(assetUrl("/sounds/incorrect.mp3"));
    expect(soundUrl("winner")).toBe(assetUrl("/sounds/winner.mp3"));
    expect(soundUrl("scores")).toBe(assetUrl("/sounds/scores.mp3"));
    expect(soundUrl("timer10")).toBe(assetUrl("/sounds/timer9.mp3"));
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
    unlockAudio();
    MockAudio.mockClear();
    setMuted(true);
    expect(() => playSound("spin")).not.toThrow();
    expect(MockAudio).not.toHaveBeenCalled();
  });

  it("playSound does not throw for stub events without a file", () => {
    setMuted(false);
    unlockAudio();
    expect(() => playSound("start")).not.toThrow();
  });

  it("playSound before unlock queues until unlockAudio", () => {
    const { MockAudio, play } = stubMockAudio();
    playSound("correct");
    expect(isAudioUnlocked()).toBe(false);
    // No audible play yet (only queue)
    const playsBeforeUnlock = play.mock.calls.length;
    unlockAudio();
    expect(isAudioUnlocked()).toBe(true);
    expect(MockAudio).toHaveBeenCalled();
    expect(play.mock.calls.length).toBeGreaterThan(playsBeforeUnlock);
  });

  it("unlockAudio plays spin at volume 0 and muted", () => {
    const { MockAudio, play } = stubMockAudio();

    unlockAudio();

    expect(MockAudio).toHaveBeenCalledWith(assetUrl("/sounds/spin.mp3"));
    const gate = MockAudio.mock.instances.find((i) => i.muted === true && i.volume === 0);
    expect(gate).toBeTruthy();
    expect(play).toHaveBeenCalled();
  });
});
