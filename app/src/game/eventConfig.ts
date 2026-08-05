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

export const EVENT_STORAGE_KEY = "justas-event-v1";

const DEFAULT_CLANS: ClanConfig[] = [
  {
    id: "guardia-dragones",
    nombre: "V Guardia de Dragones",
    representante: "",
    logoUrl: "/logos/guardia-dragones.png",
  },
  {
    id: "humaita-ps15",
    nombre: "Humaita PS15",
    representante: "",
    logoUrl: "/logos/humaita-ps15.png",
  },
  {
    id: "chaco-boreal",
    nombre: "Chaco Boreal",
    representante: "",
    logoUrl: "/logos/chaco-boreal.png",
  },
  {
    id: "orden-san-jorge",
    nombre: "La Orden de San Jorge",
    representante: "",
    logoUrl: "/logos/orden-san-jorge.png",
  },
  {
    id: "kurusu-peregrino",
    nombre: "Kurusu Peregrino",
    representante: "",
    logoUrl: "/logos/kurusu-peregrino.png",
  },
  {
    id: "humaita-cf1",
    nombre: "Humaita CF1",
    representante: "",
    logoUrl: "/logos/humaita-cf1.png",
  },
  {
    id: "san-jorge-capadocia",
    nombre: "San Jorge de Capadocia",
    representante: "",
    logoUrl: "/logos/san-jorge-capadocia.png",
  },
  {
    id: "yvy-pyta",
    nombre: "Yvy Pytã",
    representante: "",
    logoUrl: "/logos/yvy-pyta.png",
  },
];

export function defaultEventConfig(): EventConfig {
  return {
    version: 1,
    titulo: "Justas del Saber",
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
