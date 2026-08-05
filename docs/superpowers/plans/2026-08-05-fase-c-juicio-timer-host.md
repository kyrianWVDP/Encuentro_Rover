# Fase C — Juicio, timer, host y puntaje — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turno completo con timer 60 s, juicio Correcta/Incorrecta con confirmación, puntaje 10/0, revelación post-juicio, y sync `/` + `/host` vía BroadcastChannel + localStorage.

**Architecture:** Ampliar el reducer de B a fases C; helpers puros de scoring/timer/selectors; capa `sync` que publica estado tras cada dispatch del host; UI partida en `PublicScreen` y `HostScreen` con `react-router-dom`.

**Tech Stack:** React 19, Vite 8, TypeScript, Vitest, react-router-dom (añadir).

**Spec:** `docs/superpowers/specs/2026-08-05-fase-c-juicio-timer-host.md`  
**Codebase:** `app/` (paths del plan son relativos a `app/`)

## Global Constraints

- Idioma UI: español
- Solo `/host` escribe estado; `/` es lectura
- Público no ve `respuestaCorrecta` hasta fase `revealAnswer`
- Puntaje: correct +10, incorrect +0 (sin bonus de tiempo)
- Timer default 60 s; sync con `endsAt`
- Offline-friendly (BroadcastChannel + localStorage; sin backend)
- No implementar sonidos finales, CRUD, mata-mata, export, pause (Fases D–G)
- Commits solo si el usuario lo pidió en la sesión; si no, omitir pasos commit
- Mantener tests B en verde; actualizar los que rompan por rename de fases (`question` → nuevas fases)

---

## File map

| File | Responsibility |
|------|----------------|
| `src/game/types.ts` | Ampliar `TurnPhase`, `Judgement`, `TimerState`; mover/`export` `GameState` aquí |
| `src/game/scoring.ts` | `applyJudgement`, `initialScores` |
| `src/game/timer.ts` | `startTimer`, `stopTimer`, `restartTimer`, `remainingFromEndsAt` |
| `src/game/selectors.ts` | `canShowAnswer`, `sortedScores` |
| `src/game/sync.ts` | `publishGameState`, `subscribeGameState`, `loadGameState`, `STORAGE_KEY` |
| `src/game/turnReducer.ts` | Acciones C + estado ampliado (o renombrar a `gameReducer.ts` y reexportar) |
| `src/game/*.test.ts` | TDD por módulo |
| `src/ui/ScoreTable.tsx` | Tabla de puntajes |
| `src/ui/ConfirmModal.tsx` | Modal confirmación juicio |
| `src/ui/TimerDisplay.tsx` | Countdown visual desde `endsAt` |
| `src/ui/PublicScreen.tsx` | Proyector |
| `src/ui/HostScreen.tsx` | Controles host |
| `src/App.tsx` | Router `/` y `/host` |
| `src/ui/TurnScreen.tsx` | Deprecar: reexport Host o eliminar tras migrar |

---

### Task 1: Types + scoring + timer + selectors (TDD)

**Files:**
- Modify: `src/game/types.ts`
- Create: `src/game/scoring.ts`, `src/game/timer.ts`, `src/game/selectors.ts`
- Test: `src/game/scoring.test.ts`, `src/game/timer.test.ts`, `src/game/selectors.test.ts`

**Interfaces:**
- Consumes: `Clan` ids via `CLANS` for `initialScores`
- Produces:
  - `Judgement = "correct" | "incorrect"`
  - `TimerState`, `TurnPhase` extendido (incl. `questionRunning` | `awaitingJudgement` | `revealAnswer` | `showScores`; **eliminar** fase `"question"`)
  - `applyJudgement(scores, clanId, judgement): Record<string, number>`
  - `initialScores(clanIds: string[]): Record<string, number>`
  - `startTimer(durationSec, nowMs): TimerState`
  - `stopTimer(timer, nowMs): TimerState`
  - `restartTimer(durationSec, nowMs): TimerState`
  - `remainingFromEndsAt(endsAt, nowMs): number`
  - `canShowAnswer(phase: TurnPhase): boolean`
  - `POINTS_CORRECT = 10`

- [ ] **Step 1: Write failing tests**

```ts
// scoring.test.ts
import { describe, expect, it } from "vitest";
import { applyJudgement, initialScores } from "./scoring";

describe("scoring", () => {
  it("initializes zeros", () => {
    expect(initialScores(["a", "b"])).toEqual({ a: 0, b: 0 });
  });
  it("adds 10 on correct", () => {
    expect(applyJudgement({ a: 0 }, "a", "correct").a).toBe(10);
  });
  it("adds 0 on incorrect", () => {
    expect(applyJudgement({ a: 5 }, "a", "incorrect").a).toBe(5);
  });
});
```

```ts
// timer.test.ts
import { describe, expect, it } from "vitest";
import { remainingFromEndsAt, restartTimer, startTimer, stopTimer } from "./timer";

describe("timer", () => {
  it("startTimer sets endsAt ~ now+duration", () => {
    const t = startTimer(60, 1_000_000);
    expect(t.running).toBe(true);
    expect(t.endsAt).toBe(1_000_000 + 60_000);
    expect(t.remainingMs).toBe(60_000);
  });
  it("stopTimer freezes remaining", () => {
    const t = stopTimer(startTimer(60, 0), 10_000);
    expect(t.running).toBe(false);
    expect(t.remainingMs).toBe(50_000);
    expect(t.endsAt).toBeNull();
  });
  it("restartTimer resets to full duration", () => {
    const t = restartTimer(60, 5_000);
    expect(t.endsAt).toBe(5_000 + 60_000);
  });
  it("remainingFromEndsAt floors at 0", () => {
    expect(remainingFromEndsAt(100, 200)).toBe(0);
  });
});
```

```ts
// selectors.test.ts
import { describe, expect, it } from "vitest";
import { canShowAnswer } from "./selectors";

describe("canShowAnswer", () => {
  it("false until revealAnswer", () => {
    expect(canShowAnswer("questionRunning")).toBe(false);
    expect(canShowAnswer("awaitingJudgement")).toBe(false);
    expect(canShowAnswer("revealAnswer")).toBe(true);
    expect(canShowAnswer("showScores")).toBe(true);
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
cd app && npm test
```

- [ ] **Step 3: Implement types + modules**

Update `types.ts` phases; implement scoring/timer/selectors as above.

- [ ] **Step 4: Run — PASS** (pueden fallar tests de turnReducer por fase `question` — se arreglan en Task 2; si hace falta, marcar temporalmente o actualizar en la misma sesión antes de commit)

- [ ] **Step 5: Commit (si aplica)**

```bash
git add app/src/game
git commit -m "feat: add scoring, timer, and answer visibility helpers"
```

---

### Task 2: Ampliar `turnReducer` / `GameState` (TDD)

**Files:**
- Modify: `src/game/turnReducer.ts`, `src/game/turnReducer.test.ts`, `src/game/types.ts` si `GameState` vive ahí
- Optionally rename exports but keep `turnReducer` name for less churn

**Interfaces:**
- Consumes: Task 1 helpers, B helpers (`pickClan`, `pickRandomUnused`, `markClanPlayed`, `advanceRoundIfComplete`)
- Produces: `GameState` con `scores`, `timer`, `lastJudgement`, `pendingJudgement`, `maxRounds: 10`
- Actions: las de B **más**  
  `START_QUESTION` (reemplaza efecto de `SHOW_QUESTION`),  
  `STOP_TIMER`, `RESTART_TIMER`, `ABORT_TURN_RESPIN`,  
  `REQUEST_JUDGE`, `CANCEL_JUDGE`, `CONFIRM_JUDGE`,  
  `ACK_REVEAL`, `ACK_SCORES`  
- Mantener alias `SHOW_QUESTION` → mismo que `START_QUESTION` **o** actualizar todos los call sites (preferir renombrar a `START_QUESTION` y migrar tests/UI)

**Reglas clave:**
- `START_QUESTION`: desde `clanRevealed`; pick question; append used; `phase=questionRunning`; `timer=startTimer(60, now)` (inyectar `nowMs` en action opcional para tests)
- `CONFIRM_JUDGE`: requiere `pendingJudgement`; `applyJudgement`; `markClanPlayed`; `advanceRoundIfComplete`; `phase=revealAnswer`; clear pending
- `ABORT_TURN_RESPIN`: quitar `selectedQuestionId` de `usedQuestionIds` si estaba; clear selection; `spinToClan` sin marcar played
- `ACK_SCORES`: si `roundNumber > maxRounds` tras advance, set flag o phase idle con `error`/`regularFinished` — mínimo: no permitir SPIN y set `error` o `turn.phase` stay + `regularComplete: true` en state. Spec: mensaje fin. Añadir `regularComplete: boolean` al state.

- [ ] **Step 1: Write/extend failing tests** covering spec §8 items 1–4

```ts
it("CONFIRM_JUDGE correct adds 10", () => { /* spin→finish→startQ→request→confirm */ });
it("REQUEST_JUDGE alone does not change scores", () => { /* ... */ });
it("RESTART_TIMER sets endsAt ~60s ahead", () => { /* action.nowMs */ });
it("ABORT_TURN_RESPIN restores question to unused", () => { /* ... */ });
```

Inject `nowMs` / `rng` on actions for determinism:

```ts
| { type: "START_QUESTION"; rng?: Rng; nowMs?: number }
| { type: "RESTART_TIMER"; nowMs?: number }
| { type: "STOP_TIMER"; nowMs?: number }
```

- [ ] **Step 2: FAIL → implement → PASS**

- [ ] **Step 3: Update existing B tests** that used phase `"question"` / `SHOW_QUESTION` / `NEXT_TURN` to new flow (`START_QUESTION` → … → `ACK_SCORES`)

- [ ] **Step 4: `npm test` all green**

- [ ] **Step 5: Commit (si aplica)**

```bash
git commit -m "feat: extend game reducer for judgement, timer, and scores"
```

---

### Task 3: Sync layer (TDD)

**Files:**
- Create: `src/game/sync.ts`, `src/game/sync.test.ts`

**Interfaces:**
- `STORAGE_KEY = "justas-game-v1"`
- `CHANNEL_NAME = "justas-del-saber"`
- `serializeGameState(state) / parseGameState(raw): GameState | null`
- `loadGameState(): GameState | null`
- `saveGameState(state): void`
- `publishGameState(state): void` // save + broadcast
- `subscribeGameState(cb: (s: GameState) => void): () => void` // channel + storage

**Tests:** round-trip JSON; parse invalid → null. Mock `localStorage` in vitest (`environment` puede seguir `node` con mock manual, o `jsdom` solo para este archivo).

Si Vitest está en `environment: "node"`, mock:

```ts
const store = new Map<string, string>();
globalThis.localStorage = {
  getItem: (k) => store.get(k) ?? null,
  setItem: (k, v) => { store.set(k, v); },
  removeItem: (k) => { store.delete(k); },
  clear: () => store.clear(),
  key: () => null,
  length: 0,
};
```

- [ ] Implement + tests PASS
- [ ] Commit (si aplica): `feat: add BroadcastChannel and localStorage game sync`

---

### Task 4: Router + shell

**Files:**
- Modify: `package.json` — add `react-router-dom`
- Modify: `src/main.tsx` / `src/App.tsx`
- Create stub screens if needed

- [ ] `npm install react-router-dom`
- [ ] App:

```tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PublicScreen } from "./ui/PublicScreen";
import { HostScreen } from "./ui/HostScreen";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicScreen />} />
        <Route path="/host" element={<HostScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
```

- [ ] Temporary stubs that render “Público” / “Host” until Tasks 5–6
- [ ] `npm run build` PASS
- [ ] Commit (si aplica): `feat: add public and host routes`

---

### Task 5: UI primitives — ScoreTable, ConfirmModal, TimerDisplay

**Files:**
- Create: `src/ui/ScoreTable.tsx`, `ConfirmModal.tsx`, `TimerDisplay.tsx`
- Styles in `App.css` or co-located CSS

**Props:**

```ts
// ScoreTable
{ scores: Record<string, number>; clans: Clan[]; highlightClanId?: string | null }

// ConfirmModal
{ open: boolean; title: string; message: string; onConfirm: () => void; onCancel: () => void }

// TimerDisplay
{ endsAt: number | null; running: boolean; remainingMs: number; // prefer computing from endsAt when running
  size?: "hero" | "compact" }
```

`TimerDisplay` usa `requestAnimationFrame` o `setInterval(100)` local para re-render; **no** despacha reducer.

- [ ] Implement + smoke build
- [ ] Commit (si aplica): `feat: add score table, confirm modal, and timer display`

---

### Task 6: PublicScreen

**Files:**
- Create: `src/ui/PublicScreen.tsx`
- Reuse: `RouletteWheel`, `ScoreTable`, `TimerDisplay`

**Behavior:**
- `useState` hidratado con `loadGameState() ?? initialGameState()`
- `useEffect` → `subscribeGameState(setState)`
- Render por `phase` según spec §3 columna Público
- Usar `canShowAnswer` antes de mostrar `respuestaCorrecta`
- Link opcional discreto a `/host`

- [ ] Implement
- [ ] Build PASS
- [ ] Commit (si aplica): `feat: add public projector screen`

---

### Task 7: HostScreen

**Files:**
- Create: `src/ui/HostScreen.tsx`
- Remove or slim: `src/ui/TurnScreen.tsx`

**Behavior:**
- Estado local + al dispatch: `const next = turnReducer(state, action); setState(next); publishGameState(next);`
- Efecto: si `phase===spinning` → timeout `SPIN_FINISHED` + publish
- Efecto: si `timer.running && endsAt && now>=endsAt` → `STOP_TIMER` + publish
- Botones según fase (spec §3)
- Modal cuando `pendingJudgement !== null`
- Mostrar respuesta del banco siempre que haya `selectedQuestionId` y phase ≥ `questionRunning`
- Mini `ScoreTable`
- Si `regularComplete` → mensaje “Fase regular terminada” (sin SPIN)

- [ ] Implement
- [ ] Manual checklist: dos pestañas `/` y `/host` sincronizan
- [ ] `npm test && npm run build`
- [ ] Commit (si aplica): `feat: add host control screen with judgement flow`

---

### Task 8: Spec checklist + docs

**Files:**
- Modify: `docs/superpowers/specs/2026-08-05-fase-c-juicio-timer-host.md` (marcar §10)
- Update roadmap status for Fase C if desired

- [ ] Verificar criterios de hecho §10
- [ ] Marcar checkboxes
- [ ] Commit (si aplica): `docs: mark fase C acceptance criteria`

---

## Self-review (plan vs spec)

| Spec item | Task |
|-----------|------|
| `/` + `/host` | 4, 6, 7 |
| BroadcastChannel + localStorage | 3, 7 |
| Timer 60 / stop / restart / endsAt | 1, 2, 5, 7 |
| Confirm judgement + 10/0 | 1, 2, 5, 7 |
| Reveal after confirm | 2, 6 |
| Abort respin restores question | 2 |
| canShowAnswer | 1, 6 |
| maxRounds 10 / fin regular | 2, 7 |
| Tests §8 | 1, 2, 3 |

No TBD placeholders. Tipos alineados con actions que incluyen `nowMs` para TDD.
