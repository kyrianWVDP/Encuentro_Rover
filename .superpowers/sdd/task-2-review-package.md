# Review package Task 2
BASE: 22306d8
HEAD: dd008960c58ecb917125ff6e0cbf5e66c86699a9

## Commits
dd00896 feat: add clan fixtures and spin selection math

## Stat
 app/src/game/clans.ts     | 18 ++++++++++++++++++
 app/src/game/spin.test.ts | 34 ++++++++++++++++++++++++++++++++++
 app/src/game/spin.ts      | 30 ++++++++++++++++++++++++++++++
 app/src/game/types.ts     | 28 ++++++++++++++++++++++++++++
 4 files changed, 110 insertions(+)

## Diff
`diff
diff --git a/app/src/game/clans.ts b/app/src/game/clans.ts
new file mode 100644
index 0000000..860f93e
--- /dev/null
+++ b/app/src/game/clans.ts
@@ -0,0 +1,18 @@
+import type { Clan } from "./types";
+
+export const CLANS: Clan[] = [
+  { id: "guardia-dragones", nombre: "V Guardia de Dragones" },
+  { id: "humaita-ps15", nombre: "Humaita PS15" },
+  { id: "chaco-boreal", nombre: "Chaco Boreal" },
+  { id: "orden-san-jorge", nombre: "La Orden de San Jorge" },
+  { id: "kurusu-peregrino", nombre: "Kurusu Peregrino" },
+  { id: "humaita-cf1", nombre: "Humaita CF1" },
+  { id: "san-jorge-capadocia", nombre: "San Jorge de Capadocia" },
+  { id: "yvy-pyta", nombre: "Yvy PytÃ£" },
+];
+
+export function clanSectorIndex(clanId: string): number {
+  const index = CLANS.findIndex((c) => c.id === clanId);
+  if (index < 0) throw new Error(`Unknown clan: ${clanId}`);
+  return index;
+}
diff --git a/app/src/game/spin.test.ts b/app/src/game/spin.test.ts
new file mode 100644
index 0000000..84d42a6
--- /dev/null
+++ b/app/src/game/spin.test.ts
@@ -0,0 +1,34 @@
+import { describe, expect, it } from "vitest";
+import { CLANS, clanSectorIndex } from "./clans";
+import { angleForClanIndex, pickClan } from "./spin";
+
+describe("pickClan", () => {
+  it("picks only from pending", () => {
+    const pending = CLANS.slice(0, 3);
+    const picked = pickClan(pending, () => 0.99);
+    expect(pending.map((c) => c.id)).toContain(picked.id);
+  });
+
+  it("uses rng to select index", () => {
+    const pending = CLANS.slice(0, 4);
+    // 0.5 * 4 = 2
+    expect(pickClan(pending, () => 0.5).id).toBe(pending[2].id);
+  });
+
+  it("throws when pending is empty", () => {
+    expect(() => pickClan([], () => 0)).toThrow();
+  });
+});
+
+describe("angleForClanIndex", () => {
+  it("uses 45Â° sectors", () => {
+    expect(angleForClanIndex(0)).toBe(0);
+    expect(angleForClanIndex(1)).toBe(45);
+    expect(angleForClanIndex(7)).toBe(315);
+  });
+
+  it("maps each clan to a distinct sector", () => {
+    const angles = CLANS.map((c) => angleForClanIndex(clanSectorIndex(c.id)));
+    expect(new Set(angles).size).toBe(8);
+  });
+});
diff --git a/app/src/game/spin.ts b/app/src/game/spin.ts
new file mode 100644
index 0000000..7ee8b2a
--- /dev/null
+++ b/app/src/game/spin.ts
@@ -0,0 +1,30 @@
+import type { Clan, Rng } from "./types";
+
+export const SPIN_EXTRA_TURNS = 5;
+export const SPIN_DURATION_MS = 3500;
+export const SECTOR_DEGREES = 45;
+
+export function pickClan(pending: Clan[], rng: Rng): Clan {
+  if (pending.length === 0) throw new Error("No pending clans");
+  const index = Math.min(pending.length - 1, Math.floor(rng() * pending.length));
+  return pending[index];
+}
+
+/** Degrees to rotate the wheel so sector `index` lands under the top pointer. */
+export function angleForClanIndex(
+  index: number,
+  sectorDegrees: number = SECTOR_DEGREES,
+): number {
+  return index * sectorDegrees;
+}
+
+export function targetWheelRotationDeg(clanIndex: number, extraTurns = SPIN_EXTRA_TURNS): number {
+  // Pointer at top: rotate so sector center is at 0Â° (calibrate later with OFFSET_DEG if needed)
+  const OFFSET_DEG = sectorCenterOffset(clanIndex);
+  return extraTurns * 360 + OFFSET_DEG;
+}
+
+function sectorCenterOffset(clanIndex: number): number {
+  // Center of sector under pointer: negative rotation brings sector to top
+  return -(angleForClanIndex(clanIndex) + SECTOR_DEGREES / 2);
+}
diff --git a/app/src/game/types.ts b/app/src/game/types.ts
new file mode 100644
index 0000000..afad763
--- /dev/null
+++ b/app/src/game/types.ts
@@ -0,0 +1,28 @@
+export type Clan = {
+  id: string;
+  nombre: string;
+  color?: string;
+  logoUrl?: string;
+};
+
+export type Question = {
+  id: number;
+  texto: string;
+  respuestaCorrecta: string;
+};
+
+export type TurnPhase = "idle" | "spinning" | "clanRevealed" | "question";
+
+export type RoundState = {
+  roundNumber: number;
+  playedClanIds: string[];
+  usedQuestionIds: number[];
+};
+
+export type TurnState = {
+  phase: TurnPhase;
+  selectedClanId: string | null;
+  selectedQuestionId: number | null;
+};
+
+export type Rng = () => number;

`
