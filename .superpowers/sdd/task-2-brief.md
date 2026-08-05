### Task 2: Types + clans fixture + spin math (TDD)

**Files:**
- Create: `src/game/types.ts`
- Create: `src/game/clans.ts`
- Create: `src/game/spin.ts`
- Test: `src/game/spin.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `Clan`, `Question`, `TurnPhase`, `RoundState`, `TurnState` in `types.ts`
  - `CLANS: Clan[]` (length 8), `clanSectorIndex(id: string): number`
  - `type Rng = () => number` // [0, 1)
  - `pickClan(pending: Clan[], rng: Rng): Clan`
  - `angleForClanIndex(index: number, sectorDegrees?: number): number`
  - `SPIN_EXTRA_TURNS = 5`, `SPIN_DURATION_MS = 3500`

- [ ] **Step 1: Write failing tests**

Create `src/game/spin.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { CLANS, clanSectorIndex } from "./clans";
import { angleForClanIndex, pickClan } from "./spin";

describe("pickClan", () => {
  it("picks only from pending", () => {
    const pending = CLANS.slice(0, 3);
    const picked = pickClan(pending, () => 0.99);
    expect(pending.map((c) => c.id)).toContain(picked.id);
  });

  it("uses rng to select index", () => {
    const pending = CLANS.slice(0, 4);
    // 0.5 * 4 = 2
    expect(pickClan(pending, () => 0.5).id).toBe(pending[2].id);
  });

  it("throws when pending is empty", () => {
    expect(() => pickClan([], () => 0)).toThrow();
  });
});

describe("angleForClanIndex", () => {
  it("uses 45° sectors", () => {
    expect(angleForClanIndex(0)).toBe(0);
    expect(angleForClanIndex(1)).toBe(45);
    expect(angleForClanIndex(7)).toBe(315);
  });

  it("maps each clan to a distinct sector", () => {
    const angles = CLANS.map((c) => angleForClanIndex(clanSectorIndex(c.id)));
    expect(new Set(angles).size).toBe(8);
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npm test
```

Expected: FAIL (modules missing)

- [ ] **Step 3: Implement types, clans, spin**

`src/game/types.ts`:

```ts
export type Clan = {
  id: string;
  nombre: string;
  color?: string;
  logoUrl?: string;
};

export type Question = {
  id: number;
  texto: string;
  respuestaCorrecta: string;
};

export type TurnPhase = "idle" | "spinning" | "clanRevealed" | "question";

export type RoundState = {
  roundNumber: number;
  playedClanIds: string[];
  usedQuestionIds: number[];
};

export type TurnState = {
  phase: TurnPhase;
  selectedClanId: string | null;
  selectedQuestionId: number | null;
};

export type Rng = () => number;
```

`src/game/clans.ts`:

```ts
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
```

`src/game/spin.ts`:

```ts
import type { Clan, Rng } from "./types";

export const SPIN_EXTRA_TURNS = 5;
export const SPIN_DURATION_MS = 3500;
export const SECTOR_DEGREES = 45;

export function pickClan(pending: Clan[], rng: Rng): Clan {
  if (pending.length === 0) throw new Error("No pending clans");
  const index = Math.min(pending.length - 1, Math.floor(rng() * pending.length));
  return pending[index];
}

/** Degrees to rotate the wheel so sector `index` lands under the top pointer. */
export function angleForClanIndex(
  index: number,
  sectorDegrees: number = SECTOR_DEGREES,
): number {
  return index * sectorDegrees;
}

export function targetWheelRotationDeg(clanIndex: number, extraTurns = SPIN_EXTRA_TURNS): number {
  // Pointer at top: rotate so sector center is at 0° (calibrate later with OFFSET_DEG if needed)
  const OFFSET_DEG = sectorCenterOffset(clanIndex);
  return extraTurns * 360 + OFFSET_DEG;
}

function sectorCenterOffset(clanIndex: number): number {
  // Center of sector under pointer: negative rotation brings sector to top
  return -(angleForClanIndex(clanIndex) + SECTOR_DEGREES / 2);
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npm test
```

Expected: PASS

- [ ] **Step 5: Commit (si aplica)**

```bash
git add src/game
git commit -m "feat: add clan fixtures and spin selection math"
```

---

