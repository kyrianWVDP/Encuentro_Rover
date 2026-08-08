import { assetUrl } from "./assetUrl";

export type SoundEvent =
  | "spin"
  | "correct"
  | "incorrect"
  | "winner"
  | "scores"
  | "start"
  | "timer10"
  | "timerEnd";

export const MUTE_STORAGE_KEY = "justas-mute-v1";

const FILE_BY_EVENT: Partial<Record<SoundEvent, string>> = {
  spin: "/sounds/spin.mp3",
  correct: "/sounds/correct.mp3",
  incorrect: "/sounds/incorrect.mp3",
  winner: "/sounds/winner.mp3",
  scores: "/sounds/scores.mp3",
  timer10: "/sounds/timer9.mp3",
};

export function soundUrl(event: SoundEvent): string | null {
  const path = FILE_BY_EVENT[event];
  return path ? assetUrl(path) : null;
}

export function isMuted(): boolean {
  return localStorage.getItem(MUTE_STORAGE_KEY) === "1";
}

export function setMuted(muted: boolean): void {
  localStorage.setItem(MUTE_STORAGE_KEY, muted ? "1" : "0");
}

export function unlockAudio(): void {
  const url = soundUrl("spin");
  if (!url) return;
  try {
    const audio = new Audio(url);
    audio.volume = 0;
    audio.muted = true;
    void audio.play().catch(() => {
      /* autoplay blocked until user gesture */
    });
  } catch {
    /* ignore */
  }
}

export function playSound(event: SoundEvent): void {
  if (isMuted()) return;
  const url = soundUrl(event);
  if (!url) return;
  try {
    const audio = new Audio(url);
    void audio.play().catch(() => {
      /* autoplay blocked until unlock gesture */
    });
  } catch {
    /* ignore */
  }
}

let timerWarningAudio: HTMLAudioElement | null = null;

/** Looping clock for the last seconds of the question timer. */
export function startTimerWarning(): void {
  if (isMuted()) return;
  if (timerWarningAudio) return;
  const url = soundUrl("timer10");
  if (!url) return;
  try {
    const audio = new Audio(url);
    audio.loop = true;
    timerWarningAudio = audio;
    void audio.play().catch(() => {
      timerWarningAudio = null;
    });
  } catch {
    /* ignore */
  }
}

export function stopTimerWarning(): void {
  if (!timerWarningAudio) return;
  timerWarningAudio.pause();
  timerWarningAudio.currentTime = 0;
  timerWarningAudio = null;
}
