import { describe, it, expect, beforeEach } from "vitest";
import { CLANS } from "./clans";
import { defaultEventConfig, saveEventConfig } from "./eventConfig";
import { initialGameState, turnReducer } from "./turnReducer";
import { soundsForTransition } from "./soundTransitions";

const rng0 = () => 0;

describe("soundsForTransition", () => {
  beforeEach(() => {
    const store = new Map<string, string>();
    globalThis.localStorage = {
      getItem: (key: string) => store.get(key) || null,
      setItem: (key: string, value: string) => store.set(key, value),
      removeItem: (key: string) => store.delete(key),
      clear: () => store.clear(),
      key: (n: number) => Array.from(store.keys())[n] ?? null,
      length: 0,
    } as Storage;
    saveEventConfig(defaultEventConfig());
  });

  it("emits spin when entering spinning", () => {
    const prev = initialGameState();
    const next = turnReducer(prev, { type: "SPIN", rng: rng0 });
    expect(soundsForTransition(prev, next)).toEqual(["spin"]);
  });

  it("emits spin again on RESPIN → spinning", () => {
    let s = turnReducer(initialGameState(), { type: "SPIN", rng: rng0 });
    s = turnReducer(s, { type: "SPIN_FINISHED" });
    const prev = s;
    const next = turnReducer(s, { type: "RESPIN", rng: () => 0.9 });
    expect(next.turn.phase).toBe("spinning");
    expect(soundsForTransition(prev, next)).toEqual(["spin"]);
  });

  it("emits correct on CONFIRM_JUDGE correct", () => {
    let s = initialGameState();
    s = turnReducer(s, { type: "SPIN", rng: rng0 });
    s = turnReducer(s, { type: "SPIN_FINISHED" });
    s = turnReducer(s, { type: "START_QUESTION", nowMs: 0 });
    s = turnReducer(s, { type: "STOP_TIMER", nowMs: 0 });
    s = turnReducer(s, { type: "REQUEST_JUDGE", judgement: "correct" });
    const prev = s;
    const next = turnReducer(s, { type: "CONFIRM_JUDGE" });
    expect(soundsForTransition(prev, next)).toEqual(["correct"]);
  });

  it("emits incorrect on CONFIRM_JUDGE incorrect", () => {
    let s = initialGameState();
    s = turnReducer(s, { type: "SPIN", rng: rng0 });
    s = turnReducer(s, { type: "SPIN_FINISHED" });
    s = turnReducer(s, { type: "START_QUESTION", nowMs: 0 });
    s = turnReducer(s, { type: "STOP_TIMER", nowMs: 0 });
    s = turnReducer(s, { type: "REQUEST_JUDGE", judgement: "incorrect" });
    const prev = s;
    const next = turnReducer(s, { type: "CONFIRM_JUDGE" });
    expect(soundsForTransition(prev, next)).toEqual(["incorrect"]);
  });

  it("emits winner when mode becomes final", () => {
    saveEventConfig({ ...defaultEventConfig(), clans: CLANS.slice(0, 3) as any });
    let s = initialGameState(CLANS.slice(0, 3).map((c) => c.id));
    s.regularComplete = true;
    s.scores = {
      [CLANS[0].id]: 30,
      [CLANS[1].id]: 20,
      [CLANS[2].id]: 10,
    };
    const prev = s;
    const next = turnReducer(s, { type: "BEGIN_FINALE" });
    expect(next.mode).toBe("final");
    expect(soundsForTransition(prev, next)).toEqual(["winner"]);
  });

  it("emits nothing when state unchanged", () => {
    const s = initialGameState();
    expect(soundsForTransition(s, s)).toEqual([]);
  });
});
