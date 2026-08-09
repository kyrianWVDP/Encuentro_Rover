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

let audioUnlocked = false;
const pendingEvents: SoundEvent[] = [];
const preloaded = new Map<string, HTMLAudioElement>();

export function soundUrl(event: SoundEvent): string | null {
  const path = FILE_BY_EVENT[event];
  return path ? assetUrl(path) : null;
}

export function isMuted(): boolean {
  return localStorage.getItem(MUTE_STORAGE_KEY) === "1";
}

export function setMuted(muted: boolean): void {
  localStorage.setItem(MUTE_STORAGE_KEY, muted ? "1" : "0");
  if (muted) stopTimerWarning();
}

export function isAudioUnlocked(): boolean {
  return audioUnlocked;
}

function getAudio(url: string): HTMLAudioElement {
  const cached = preloaded.get(url);
  if (cached) {
    const clone = cached.cloneNode(true) as HTMLAudioElement;
    return clone;
  }
  return new Audio(url);
}

function actuallyPlay(event: SoundEvent): void {
  const url = soundUrl(event);
  if (!url) return;
  try {
    const audio = getAudio(url);
    audio.currentTime = 0;
    void audio.play().catch(() => {
      /* still blocked — wait for unlock */
      if (!pendingEvents.includes(event)) pendingEvents.push(event);
    });
  } catch {
    /* ignore */
  }
}

function flushPending(): void {
  if (isMuted() || !audioUnlocked) return;
  const queued = pendingEvents.splice(0, pendingEvents.length);
  for (const event of queued) actuallyPlay(event);
}

/** Call from a user gesture on the proyector tab so the browser allows SFX. */
export function unlockAudio(): void {
  audioUnlocked = true;

  try {
    for (const event of Object.keys(FILE_BY_EVENT) as SoundEvent[]) {
      const url = soundUrl(event);
      if (!url || preloaded.has(url)) continue;
      const audio = new Audio(url);
      audio.preload = "auto";
      preloaded.set(url, audio);
      void audio.load();
    }

    // Silent play under the user gesture unlocks subsequent Audio.play() calls.
    const unlockUrl = soundUrl("spin");
    if (unlockUrl) {
      const gate = new Audio(unlockUrl);
      gate.volume = 0;
      gate.muted = true;
      void gate.play()
        .then(() => {
          gate.pause();
          gate.currentTime = 0;
        })
        .catch(() => {
          /* ignore */
        });
    }
  } catch {
    /* ignore */
  }

  flushPending();
}

export function playSound(event: SoundEvent): void {
  if (isMuted()) return;
  if (!soundUrl(event)) return;
  if (!audioUnlocked) {
    if (!pendingEvents.includes(event)) pendingEvents.push(event);
    return;
  }
  actuallyPlay(event);
}

let timerWarningAudio: HTMLAudioElement | null = null;

/** Looping clock for the last seconds of the question timer. */
export function startTimerWarning(): void {
  if (isMuted()) return;
  if (!audioUnlocked) return;
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

/** Test helper — reset module singletons between cases. */
export function __resetAudioForTests(): void {
  audioUnlocked = false;
  pendingEvents.length = 0;
  preloaded.clear();
  stopTimerWarning();
}
