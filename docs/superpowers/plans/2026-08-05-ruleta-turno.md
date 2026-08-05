# Ruleta de clanes + turno (alcance B) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** App React/Vite donde el host gira una ruleta de 8 clanes (sin repetir en la ronda), revela el clan y luego muestra una pregunta al azar no repetida.

**Architecture:** Lógica de juego en funciones puras (`src/game/*`) con RNG inyectable; UI en `RouletteWheel` + `TurnScreen`; estado global del turno/ronda con `useReducer` en `App`. El ganador del spin se elige *antes* de animar; la animación solo aterriza en ese sector.

**Tech Stack:** React 18+, Vite, TypeScript, Vitest, CSS modules o CSS plano (sin UI kit).

**Spec:** `docs/superpowers/specs/2026-08-05-ruleta-turno-design.md`

## Global Constraints

- Idioma UI: español
- Offline-friendly después (sin dependencias de red en runtime del juego)
- No mostrar `respuestaCorrecta` en la pantalla pública del alcance B
- 8 clanes fijos en fixtures; ángulos de sector = `index * 45`
- No implementar timer, puntaje, panel host oculto, sonidos finales, persistencia, CRUD ni mata-mata
- Commits solo si el usuario lo pidió en la sesión de ejecución; si no, omitir pasos `git commit` y dejar el working tree listo

---

## File map

| File | Responsibility |
|------|----------------|
| `package.json` / Vite config | Tooling, scripts `dev` / `test` |
| `index.html` | Entry |
| `src/main.tsx` | React root |
| `src/App.tsx` | `useReducer` + monta `TurnScreen` |
| `src/game/types.ts` | Tipos compartidos |
| `src/game/clans.ts` | Fixtures 8 clanes + `sectorIndex` |
| `src/game/questions.ts` | Fixture preguntas + `pickRandomUnused` |
| `src/game/round.ts` | Pendientes, marcar jugado, avanzar ronda |
| `src/game/spin.ts` | `pickClan`, `angleForClanIndex`, params de animación |
| `src/game/turnReducer.ts` | Transiciones idle/spinning/clanRevealed/question |
| `src/ui/RouletteWheel.tsx` | Disco + labels + dimmed + rotación |
| `src/ui/TurnScreen.tsx` | Controles host + fases |
| `src/ui/RouletteWheel.css` | Layout ruleta |
| `src/assets/ruleta-fondo.png` | Arte Encuentro (copiar desde assets del chat / WhatsApp) |
| `src/game/*.test.ts` | Vitest unit tests |

---

### Task 1: Scaffold Vite + Vitest

**Files:**
- Create: proyecto en raíz `Encuentro_Rover/` (o subcarpeta `app/` si se prefiere no mezclar docs — **usar raíz del repo** y dejar `docs/` intacto)
- Create: `vite.config.ts`, `tsconfig.json`, `src/main.tsx`, `index.html`, `package.json`
- Test: configuración Vitest en `vite.config.ts`

**Interfaces:**
- Consumes: nothing
- Produces: `npm run dev`, `npm test` funcionando

- [ ] **Step 1: Crear app Vite React-TS**

```bash
cd "c:\Users\kyrian\Documents\06-Scout\Scout\Encuentro_Rover"
npm create vite@latest . -- --template react-ts
```

Si Vite se niega porque el directorio no está vacío, crear en `app/`:

```bash
npm create vite@latest app -- --template react-ts
cd app
```

En ese caso, **todas las rutas `src/` de este plan** viven bajo `app/src/`.

- [ ] **Step 2: Instalar deps de test**

```bash
npm install
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom
```

- [ ] **Step 3: Configurar Vitest en `vite.config.ts`**

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
```

Agregar en `package.json`:

```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "preview": "vite preview",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 4: Verificar**

```bash
npm test
npm run build
```

Expected: tests vacíos OK o “no tests”; build OK.

- [ ] **Step 5: Commit (solo si el usuario lo pidió)**

```bash
git add package.json package-lock.json vite.config.ts tsconfig*.json index.html src
git commit -m "chore: scaffold Vite React TypeScript with Vitest"
```

---

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

### Task 3: Questions + round helpers (TDD)

**Files:**
- Create: `src/game/questions.ts`
- Create: `src/game/round.ts`
- Test: `src/game/questions.test.ts`, `src/game/round.test.ts`

**Interfaces:**
- Consumes: `Clan`, `Question`, `RoundState`, `Rng`
- Produces:
  - `QUESTIONS: Question[]` (mínimo 12 fixtures para demos)
  - `pickRandomUnused(usedIds: number[], questions: Question[], rng: Rng): Question`
  - `getPendingClans(clans: Clan[], playedClanIds: string[]): Clan[]`
  - `markClanPlayed(state: RoundState, clanId: string): RoundState`
  - `advanceRoundIfComplete(state: RoundState, clanCount: number): RoundState`

- [ ] **Step 1: Write failing tests**

`src/game/questions.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { QUESTIONS, pickRandomUnused } from "./questions";

describe("pickRandomUnused", () => {
  it("never returns a used id", () => {
    const used = [QUESTIONS[0].id, QUESTIONS[1].id];
    const q = pickRandomUnused(used, QUESTIONS, () => 0);
    expect(used).not.toContain(q.id);
  });

  it("throws when none left", () => {
    const used = QUESTIONS.map((q) => q.id);
    expect(() => pickRandomUnused(used, QUESTIONS, () => 0)).toThrow();
  });
});
```

`src/game/round.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { CLANS } from "./clans";
import {
  advanceRoundIfComplete,
  getPendingClans,
  markClanPlayed,
} from "./round";
import type { RoundState } from "./types";

const empty: RoundState = {
  roundNumber: 1,
  playedClanIds: [],
  usedQuestionIds: [],
};

describe("round", () => {
  it("lists pending excluding played", () => {
    const state = markClanPlayed(empty, CLANS[0].id);
    const pending = getPendingClans(CLANS, state.playedClanIds);
    expect(pending).toHaveLength(7);
    expect(pending.map((c) => c.id)).not.toContain(CLANS[0].id);
  });

  it("advances round after all clans played", () => {
    let state = empty;
    for (const clan of CLANS) {
      state = markClanPlayed(state, clan.id);
      state = advanceRoundIfComplete(state, CLANS.length);
    }
    expect(state.roundNumber).toBe(2);
    expect(state.playedClanIds).toEqual([]);
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npm test
```

- [ ] **Step 3: Implement**

`src/game/questions.ts`:

```ts
import type { Question, Rng } from "./types";

export const QUESTIONS: Question[] = [
  {
    id: 1,
    texto: "¿Cuál es el lema de los Rovers?",
    respuestaCorrecta: "Servir.",
  },
  {
    id: 2,
    texto: "¿Cómo se denomina la unidad de la Rama Rover?",
    respuestaCorrecta: "Clan de Rovers.",
  },
  {
    id: 3,
    texto: "¿Qué significa “Ich Dien”?",
    respuestaCorrecta: "Yo sirvo.",
  },
  {
    id: 4,
    texto: "¿Quién escribió Roverismo hacia el éxito?",
    respuestaCorrecta: "Robert Baden-Powell.",
  },
  {
    id: 5,
    texto: "¿Qué significa FEPE?",
    respuestaCorrecta: "Federación Paraguaya de Escultismo.",
  },
  {
    id: 6,
    texto: "¿Cuál es la capital de Paraguay?",
    respuestaCorrecta: "Asunción.",
  },
  {
    id: 7,
    texto: "¿Entre qué edades se aplica el método Rover según Roverismo Práctico?",
    respuestaCorrecta: "Entre los 18 y los 22 años.",
  },
  {
    id: 8,
    texto: "¿Qué es el Consejo de Clan?",
    respuestaCorrecta:
      "Es el organismo de deliberación, participación y decisión del Clan.",
  },
  {
    id: 9,
    texto: "¿Quién fundó el Movimiento Scout?",
    respuestaCorrecta: "Lord Robert Stephenson Smyth Baden-Powell.",
  },
  {
    id: 10,
    texto: "¿Qué color tiene el kepí de los Rovers según el manual?",
    respuestaCorrecta: "Rojo, con la insignia oficial correspondiente.",
  },
  {
    id: 11,
    texto: "¿Dónde se realizó el primer Rover Moot Mundial?",
    respuestaCorrecta: "En Kandersteg, Suiza.",
  },
  {
    id: 12,
    texto: "¿Cuáles son los dos idiomas oficiales de Paraguay?",
    respuestaCorrecta: "Español y guaraní.",
  },
];

export function pickRandomUnused(
  usedIds: number[],
  questions: Question[],
  rng: Rng,
): Question {
  const available = questions.filter((q) => !usedIds.includes(q.id));
  if (available.length === 0) throw new Error("No unused questions left");
  const index = Math.min(
    available.length - 1,
    Math.floor(rng() * available.length),
  );
  return available[index];
}
```

`src/game/round.ts`:

```ts
import type { Clan, RoundState } from "./types";

export function getPendingClans(
  clans: Clan[],
  playedClanIds: string[],
): Clan[] {
  const played = new Set(playedClanIds);
  return clans.filter((c) => !played.has(c.id));
}

export function markClanPlayed(
  state: RoundState,
  clanId: string,
): RoundState {
  if (state.playedClanIds.includes(clanId)) return state;
  return {
    ...state,
    playedClanIds: [...state.playedClanIds, clanId],
  };
}

export function advanceRoundIfComplete(
  state: RoundState,
  clanCount: number,
): RoundState {
  if (state.playedClanIds.length < clanCount) return state;
  return {
    ...state,
    roundNumber: state.roundNumber + 1,
    playedClanIds: [],
  };
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
npm test
```

- [ ] **Step 5: Commit (si aplica)**

```bash
git add src/game
git commit -m "feat: add question pool and round progression helpers"
```

---

### Task 4: `turnReducer` (TDD)

**Files:**
- Create: `src/game/turnReducer.ts`
- Test: `src/game/turnReducer.test.ts`

**Interfaces:**
- Consumes: helpers de Tasks 2–3, `CLANS`, `QUESTIONS`
- Produces:
  - `GameState = { round: RoundState; turn: TurnState; rotationDeg: number }`
  - `initialGameState(): GameState`
  - `type Action =`
    - `{ type: "SPIN"; rng?: Rng }`
    - `{ type: "SPIN_FINISHED" }`
    - `{ type: "RESPIN"; rng?: Rng }`
    - `{ type: "SHOW_QUESTION"; rng?: Rng }`
    - `{ type: "NEXT_TURN" }` // from question → idle (prep next spin)
  - `turnReducer(state: GameState, action: Action): GameState`

**Reglas:**
- `SPIN` / `RESPIN`: solo desde `idle` / `clanRevealed` respectivamente; set `selectedClanId`, `phase: spinning`, update `rotationDeg` con `targetWheelRotationDeg`; **no** tocar `playedClanIds` ni `usedQuestionIds` en RESPIN
- `SPIN_FINISHED`: `spinning` → `clanRevealed`
- `SHOW_QUESTION`: marca clan jugado, pick question, `usedQuestionIds`, `phase: question`; luego `advanceRoundIfComplete`
- `NEXT_TURN`: `question` → `idle`, clear `selectedClanId` / `selectedQuestionId`

- [ ] **Step 1: Write failing tests**

```ts
import { describe, expect, it } from "vitest";
import { CLANS } from "./clans";
import { QUESTIONS } from "./questions";
import { initialGameState, turnReducer } from "./turnReducer";

const rng0 = () => 0;

describe("turnReducer", () => {
  it("SPIN selects a pending clan without marking played", () => {
    const s1 = turnReducer(initialGameState(), { type: "SPIN", rng: rng0 });
    expect(s1.turn.phase).toBe("spinning");
    expect(s1.turn.selectedClanId).toBe(CLANS[0].id);
    expect(s1.round.playedClanIds).toEqual([]);
  });

  it("RESPIN does not consume clan or question", () => {
    let s = turnReducer(initialGameState(), { type: "SPIN", rng: rng0 });
    s = turnReducer(s, { type: "SPIN_FINISHED" });
    const before = structuredClone(s.round);
    s = turnReducer(s, { type: "RESPIN", rng: () => 0.9 });
    expect(s.round).toEqual(before);
    expect(s.turn.phase).toBe("spinning");
  });

  it("SHOW_QUESTION marks clan and uses a question", () => {
    let s = turnReducer(initialGameState(), { type: "SPIN", rng: rng0 });
    s = turnReducer(s, { type: "SPIN_FINISHED" });
    s = turnReducer(s, { type: "SHOW_QUESTION", rng: rng0 });
    expect(s.turn.phase).toBe("question");
    expect(s.round.playedClanIds).toContain(CLANS[0].id);
    expect(s.round.usedQuestionIds).toContain(QUESTIONS[0].id);
  });

  it("advances round after 8 SHOW_QUESTION cycles", () => {
    let s = initialGameState();
    for (let i = 0; i < 8; i++) {
      s = turnReducer(s, { type: "SPIN", rng: () => 0 });
      s = turnReducer(s, { type: "SPIN_FINISHED" });
      s = turnReducer(s, { type: "SHOW_QUESTION", rng: () => 0 });
      s = turnReducer(s, { type: "NEXT_TURN" });
    }
    expect(s.round.roundNumber).toBe(2);
    expect(s.round.playedClanIds).toEqual([]);
  });
});
```

- [ ] **Step 2: Run — FAIL**

```bash
npm test
```

- [ ] **Step 3: Implement `turnReducer.ts`**

Implement according to Interfaces above. Default `rng` = `Math.random` when omitted. Ignore illegal actions (return same state) rather than throw, except empty pending/questions on SHOW_QUESTION/SPIN where host messaging will read an optional `error` field — keep it simple: throw only in pure helpers; reducer catches and sets `state.error: string | null` if desired.

Minimal `GameState`:

```ts
export type GameState = {
  round: RoundState;
  turn: TurnState;
  rotationDeg: number;
  error: string | null;
};
```

- [ ] **Step 4: Run — PASS**

```bash
npm test
```

- [ ] **Step 5: Commit (si aplica)**

```bash
git add src/game/turnReducer.ts src/game/turnReducer.test.ts
git commit -m "feat: add turn state machine reducer"
```

---

### Task 5: `RouletteWheel` UI

**Files:**
- Create: `src/ui/RouletteWheel.tsx`
- Create: `src/ui/RouletteWheel.css`
- Create: `src/assets/ruleta-fondo.png` (copiar imagen del Encuentro; si falta, placeholder CSS)

**Interfaces:**
- Consumes: `CLANS`, `playedClanIds`, `rotationDeg`, `spinning`, `selectedClanId`
- Produces: presentational component

Props:

```ts
type RouletteWheelProps = {
  playedClanIds: string[];
  rotationDeg: number;
  spinning: boolean;
  selectedClanId: string | null;
  durationMs?: number;
};
```

- [ ] **Step 1: Copiar arte**

Buscar la imagen WhatsApp del encuentro y copiarla a `src/assets/ruleta-fondo.png`. Si no está, usar fondo sólido `#4a4a4a` en CSS.

- [ ] **Step 2: Implementar rueda**

- Contenedor relativo con pointer absoluto arriba al centro
- Capa que rota: `transform: rotate(${rotationDeg}deg)`; `transition` solo cuando `spinning` o al aterrizar (`transition: transform ${durationMs}ms cubic-bezier(0.12, 0.8, 0.2, 1)`)
- 8 labels posicionadas con `rotate(i*45deg) translateY(-radius)` + counter-rotate del texto para legibilidad **o** texto radial simple
- `opacity: 0.35` si `playedClanIds.includes(id)`
- Highlight borde si `id === selectedClanId` y no spinning

- [ ] **Step 3: Smoke visual**

```bash
npm run dev
```

Montar temporalmente en `App` con props fijas; verificar 8 nombres y dimmed.

- [ ] **Step 4: Commit (si aplica)**

```bash
git add src/ui src/assets
git commit -m "feat: add roulette wheel UI with clan labels"
```

---

### Task 6: `TurnScreen` + wire `App`

**Files:**
- Create: `src/ui/TurnScreen.tsx`
- Modify: `src/App.tsx`
- Modify: `src/App.css` (layout proyector: tipografía grande, botones host abajo)

**Interfaces:**
- Consumes: `turnReducer`, `initialGameState`, `CLANS`, `QUESTIONS`, `SPIN_DURATION_MS`
- Produces: flujo completo alcance B

- [ ] **Step 1: Implement `TurnScreen`**

```tsx
// Pseudocode structure
function TurnScreen() {
  const [state, dispatch] = useReducer(turnReducer, initialGameState());

  useEffect(() => {
    if (state.turn.phase !== "spinning") return;
    const t = window.setTimeout(() => {
      dispatch({ type: "SPIN_FINISHED" });
    }, SPIN_DURATION_MS);
    return () => clearTimeout(t);
  }, [state.turn.phase, state.rotationDeg]);

  const pendingCount = getPendingClans(CLANS, state.round.playedClanIds).length;
  const selectedClan = CLANS.find((c) => c.id === state.turn.selectedClanId);
  const selectedQuestion = QUESTIONS.find(
    (q) => q.id === state.turn.selectedQuestionId,
  );

  return (
    // header: Encuentro Rover 2026 / Justas del Saber
    // Ronda N · pendientes
    // <RouletteWheel ... />
    // phase question: show selectedQuestion.texto only
    // buttons:
    //   idle: Girar
    //   clanRevealed: Volver a girar | Mostrar pregunta
    //   question: Siguiente turno
  );
}
```

- [ ] **Step 2: `App.tsx` solo renderiza `<TurnScreen />`**

- [ ] **Step 3: Manual checklist**

1. Girar → anima → revela clan  
2. Volver a girar → otro/mismo posible; tabla de jugados intacta  
3. Mostrar pregunta → texto; sin respuesta  
4. Siguiente turno → clan queda dimmed  
5. Tras 8 → ronda 2, todos activos  

- [ ] **Step 4: Run unit tests + build**

```bash
npm test
npm run build
```

Expected: all PASS, build OK

- [ ] **Step 5: Commit (si aplica)**

```bash
git add src
git commit -m "feat: wire turn screen flow for clan roulette and questions"
```

---

### Task 7: Spec checklist + polish design status

**Files:**
- Modify: `docs/superpowers/specs/2026-08-05-ruleta-turno-design.md` (marcar criterios de hecho)

- [ ] **Step 1: Verificar criterios de hecho del spec §10**

- [ ] **Step 2: Anotar en el spec** que el banco completo PDF queda para una tarea posterior de import

- [ ] **Step 3: Commit docs (si aplica)**

```bash
git add docs/superpowers
git commit -m "docs: mark ruleta turno scope B acceptance criteria"
```

---

## Self-review (plan vs spec)

| Spec requirement | Task |
|------------------|------|
| Ruleta de clanes, no de preguntas | 5, 6 |
| Sorteo real entre pendientes | 2, 4 |
| 8 visibles; jugados dimmed | 5 |
| Re-giro sin consumir | 4 |
| Pregunta al azar no repetida | 3, 4, 6 |
| Avance de ronda tras 8 | 3, 4 |
| React+Vite+TS | 1 |
| Tests Vitest listados | 2, 3, 4 |
| Sin timer/puntaje/host panel | Global constraints |

No placeholders TBD. Tipos alineados entre tasks (`Rng`, `RoundState`, `GameState`).
