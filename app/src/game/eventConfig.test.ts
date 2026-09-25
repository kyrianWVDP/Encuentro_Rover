import { beforeEach, describe, expect, it } from "vitest";
import { QUESTIONS } from "./questions";
import {
  EVENT_STORAGE_KEY,
  defaultEventConfig,
  getActiveQuestions,
  getClans,
  loadEventConfig,
  saveEventConfig,
  type EventConfig,
} from "./eventConfig";

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

const EXPECTED_IDS = [
  "aracely-aranda",
  "vania-carreras",
  "micaela-chavez",
  "javier-diaz",
  "maia-martinez",
  "eric-vazquez",
  "kyrian-weiss",
] as const;

describe("eventConfig", () => {
  beforeEach(() => {
    store.clear();
  });

  it("exports EVENT_STORAGE_KEY", () => {
    expect(EVENT_STORAGE_KEY).toBe("cvdg-event-v1");
  });

  it("defaultEventConfig has CVDG title and seven people with photo paths", () => {
    const config = defaultEventConfig();
    expect(config.titulo).toBe("25 años CVDG");
    expect(config.clans).toHaveLength(7);
    expect(config.clans.every((c) => c.representante === "")).toBe(true);
    expect(config.version).toBe(1);
    expect(config.questions).toBeNull();
    for (const clan of config.clans) {
      expect(clan.logoUrl).toBe(`/people/${clan.id}.jpg`);
    }
  });

  it("defaultEventConfig clan ids match CVDG roster", () => {
    const ids = defaultEventConfig().clans.map((c) => c.id);
    expect(ids).toEqual([...EXPECTED_IDS]);
  });

  it("round-trips EventConfig through localStorage", () => {
    const config: EventConfig = {
      ...defaultEventConfig(),
      titulo: "Test Event",
      maxRounds: 5,
      timerSec: 45,
      questions: [{ id: 99, texto: "Q?", respuestaCorrecta: "A" }],
    };
    saveEventConfig(config);
    expect(JSON.parse(store.get(EVENT_STORAGE_KEY)!)).toEqual(config);
    expect(loadEventConfig()).toEqual(config);
  });

  it("loadEventConfig returns default when storage is empty", () => {
    expect(loadEventConfig()).toEqual(defaultEventConfig());
  });

  it("loadEventConfig returns default when storage is invalid JSON", () => {
    store.set(EVENT_STORAGE_KEY, "not json");
    expect(loadEventConfig()).toEqual(defaultEventConfig());
  });

  it("getClans returns config clans", () => {
    const config = defaultEventConfig();
    expect(getClans(config)).toBe(config.clans);
  });

  it("getActiveQuestions uses embedded when questions is null", () => {
    const config = defaultEventConfig();
    expect(getActiveQuestions(config, QUESTIONS)).toBe(QUESTIONS);
  });

  it("getActiveQuestions uses custom when questions is set", () => {
    const custom = [{ id: 1, texto: "Custom?", respuestaCorrecta: "Yes" }];
    const config = { ...defaultEventConfig(), questions: custom };
    expect(getActiveQuestions(config, QUESTIONS)).toBe(custom);
  });
});
