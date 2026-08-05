import type { GameState } from "./turnReducer";

export const STORAGE_KEY = "justas-game-v1";
export const CHANNEL_NAME = "justas-del-saber";

let channel: BroadcastChannel | null = null;

function getOrCreateChannel(): BroadcastChannel | null {
  if (typeof BroadcastChannel === "undefined") {
    return null;
  }
  channel ??= new BroadcastChannel(CHANNEL_NAME);
  return channel;
}

export function serializeGameState(state: GameState): string {
  return JSON.stringify(state);
}

export function parseGameState(raw: string): GameState | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }
    return parsed as GameState;
  } catch {
    return null;
  }
}

export function loadGameState(): GameState | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null) {
    return null;
  }
  return parseGameState(raw);
}

export function saveGameState(state: GameState): void {
  localStorage.setItem(STORAGE_KEY, serializeGameState(state));
}

export function publishGameState(state: GameState): void {
  saveGameState(state);
  getOrCreateChannel()?.postMessage(state);
}

export function subscribeGameState(cb: (state: GameState) => void): () => void {
  const ch = getOrCreateChannel();

  const onMessage = (event: MessageEvent): void => {
    cb(event.data as GameState);
  };

  const onStorage = (event: StorageEvent): void => {
    if (event.key !== STORAGE_KEY || event.newValue === null) {
      return;
    }
    const state = parseGameState(event.newValue);
    if (state !== null) {
      cb(state);
    }
  };

  ch?.addEventListener("message", onMessage);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }

  return () => {
    ch?.removeEventListener("message", onMessage);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
  };
}
