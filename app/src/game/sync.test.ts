import { beforeEach, describe, expect, it } from "vitest";
import { initialGameState } from "./turnReducer";
import {
  CHANNEL_NAME,
  STORAGE_KEY,
  loadGameState,
  parseGameState,
  publishGameState,
  saveGameState,
  serializeGameState,
  subscribeGameState,
} from "./sync";

const store = new Map<string, string>();

globalThis.localStorage = {
  getItem: (k) => store.get(k) ?? null,
  setItem: (k, v) => {
    store.set(k, v);
  },
  removeItem: (k) => {
    store.delete(k);
  },
  clear: () => store.clear(),
  key: () => null,
  length: 0,
};

type MessageListener = (event: MessageEvent) => void;
const channelListeners = new Set<MessageListener>();

class MockBroadcastChannel {
  readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  postMessage(data: unknown): void {
    const event = { data } as MessageEvent;
    for (const listener of channelListeners) {
      listener(event);
    }
  }

  addEventListener(_type: string, listener: MessageListener): void {
    channelListeners.add(listener);
  }

  removeEventListener(_type: string, listener: MessageListener): void {
    channelListeners.delete(listener);
  }

  close(): void {}
}

globalThis.BroadcastChannel =
  MockBroadcastChannel as unknown as typeof BroadcastChannel;

describe("sync", () => {
  beforeEach(() => {
    store.clear();
    channelListeners.clear();
  });

  it("exports expected constants", () => {
    expect(STORAGE_KEY).toBe("justas-game-v1");
    expect(CHANNEL_NAME).toBe("justas-del-saber");
  });

  it("round-trips GameState through JSON", () => {
    const state = initialGameState();
    const roundTripped = parseGameState(serializeGameState(state));
    expect(roundTripped).toEqual(state);
  });

  it("parseGameState returns null for invalid JSON", () => {
    expect(parseGameState("not json")).toBeNull();
    expect(parseGameState("")).toBeNull();
    expect(parseGameState("{")).toBeNull();
    expect(parseGameState("null")).toBeNull();
  });

  it("saveGameState and loadGameState persist to localStorage", () => {
    const state = initialGameState();
    saveGameState(state);
    expect(store.get(STORAGE_KEY)).toBe(serializeGameState(state));
    expect(loadGameState()).toEqual(state);
  });

  it("loadGameState returns null when storage is empty", () => {
    expect(loadGameState()).toBeNull();
  });

  it("publishGameState saves and broadcasts via channel", () => {
    const state = initialGameState();
    const received: unknown[] = [];
    subscribeGameState((s) => received.push(s));

    publishGameState(state);

    expect(loadGameState()).toEqual(state);
    expect(received).toEqual([state]);
  });

  it("subscribeGameState unsubscribe stops callbacks", () => {
    const state = initialGameState();
    const received: unknown[] = [];
    const unsubscribe = subscribeGameState((s) => received.push(s));

    publishGameState(state);
    expect(received).toHaveLength(1);

    unsubscribe();
    publishGameState({ ...state, maxRounds: 99 });
    expect(received).toHaveLength(1);
  });
});
