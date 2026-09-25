import type { Question } from "./types";

export type ClanConfig = {
  id: string;
  nombre: string;
  representante: string;
  logoUrl: string | null;
  color?: string;
};

export type EventConfig = {
  version: 1;
  titulo: string;
  maxRounds: number;
  timerSec: number;
  clans: ClanConfig[];
  questions: Question[] | null;
};

export const EVENT_STORAGE_KEY = "cvdg-event-v1";

const DEFAULT_CLANS: ClanConfig[] = [
  {
    id: "aracely-aranda",
    nombre: "Aracely Aranda",
    representante: "",
    logoUrl: "/people/aracely-aranda.jpg",
  },
  {
    id: "vania-carreras",
    nombre: "Vania Carreras",
    representante: "",
    logoUrl: "/people/vania-carreras.jpg",
  },
  {
    id: "micaela-chavez",
    nombre: "Micaela Chavez",
    representante: "",
    logoUrl: "/people/micaela-chavez.jpg",
  },
  {
    id: "javier-diaz",
    nombre: "Javier Diaz",
    representante: "",
    logoUrl: "/people/javier-diaz.jpg",
  },
  {
    id: "maia-martinez",
    nombre: "Maia Martinez",
    representante: "",
    logoUrl: "/people/maia-martinez.jpg",
  },
  {
    id: "eric-vazquez",
    nombre: "Eric Vazquez",
    representante: "",
    logoUrl: "/people/eric-vazquez.jpg",
  },
  {
    id: "kyrian-weiss",
    nombre: "Kyrian Weiss",
    representante: "",
    logoUrl: "/people/kyrian-weiss.jpg",
  },
];

export function defaultEventConfig(): EventConfig {
  return {
    version: 1,
    titulo: "25 años CVDG",
    maxRounds: 10,
    timerSec: 60,
    clans: DEFAULT_CLANS.map((clan) => ({ ...clan })),
    questions: null,
  };
}

function isEventConfig(value: unknown): value is EventConfig {
  if (typeof value !== "object" || value === null) return false;
  const config = value as Record<string, unknown>;
  return (
    config.version === 1 &&
    typeof config.titulo === "string" &&
    typeof config.maxRounds === "number" &&
    typeof config.timerSec === "number" &&
    Array.isArray(config.clans) &&
    (config.questions === null || Array.isArray(config.questions))
  );
}

export function loadEventConfig(): EventConfig {
  const raw = localStorage.getItem(EVENT_STORAGE_KEY);
  if (!raw) return defaultEventConfig();
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isEventConfig(parsed)) return defaultEventConfig();
    return parsed;
  } catch {
    return defaultEventConfig();
  }
}

export function saveEventConfig(config: EventConfig): void {
  localStorage.setItem(EVENT_STORAGE_KEY, JSON.stringify(config));
}

export function getClans(config: EventConfig): ClanConfig[] {
  return config.clans;
}

export function getActiveQuestions(
  config: EventConfig,
  embedded: Question[],
): Question[] {
  return config.questions ?? embedded;
}
