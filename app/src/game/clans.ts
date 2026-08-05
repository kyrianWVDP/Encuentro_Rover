import type { Clan } from "./types";

export const CLANS: Clan[] = [
  { id: "guardia-dragones", nombre: "V Guardia de Dragones" },
  { id: "humaita-ps15", nombre: "Humaita PS15" },
  { id: "chaco-boreal", nombre: "Chaco Boreal" },
  { id: "orden-san-jorge", nombre: "La Orden de San Jorge" },
  { id: "kurusu-peregrino", nombre: "Kurusu Peregrino" },
  { id: "humaita-cf1", nombre: "Humaita CF1" },
  { id: "san-jorge-capadocia", nombre: "San Jorge de Capadocia" },
  { id: "yvy-pyta", nombre: "Yvy Pytã" },
];

export function clanSectorIndex(clanId: string): number {
  const index = CLANS.findIndex((c) => c.id === clanId);
  if (index < 0) throw new Error(`Unknown clan: ${clanId}`);
  return index;
}
