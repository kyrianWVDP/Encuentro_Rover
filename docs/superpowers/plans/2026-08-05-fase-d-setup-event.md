# Fase D — Setup evento — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ruta `/setup` para configurar evento, CRUD de clanes (con o sin logo → iniciales), representantes, import de preguntas, y reinicio de partida sin borrar config.

**Architecture:** `EventConfig` en `localStorage` (`justas-event-v1`) separado del `GameState`. El juego lee clanes/preguntas/rondas/timer desde config. Logos en `public/logos/`; `logoUrl: null` → badge de iniciales.

**Tech Stack:** React, Vite, TypeScript, Vitest (sin libs nuevas).

**Spec:** `docs/superpowers/specs/2026-08-05-fase-d-setup-event.md`  
**Codebase:** `app/`

## Global Constraints

- Idioma UI: español
- Reiniciar partida **no** borra `EventConfig`
- Clan sin logo permitido (iniciales)
- Mínimo 2 clanes para Girar
- Offline: solo localStorage + `/logos/`
- No podio/mata-mata/sonidos/pause (E–G)
- Commits solo si el usuario lo pidió; si no, omitir
- Mantener tests C en verde

---

## File map

| File | Responsibility |
|------|----------------|
| `src/game/eventConfig.ts` | types config, default, load/save, getters |
| `src/game/clanDisplay.ts` | `clanInitials` |
| `src/game/questionImport.ts` | parse JSON/CSV |
| `src/ui/ClanAvatar.tsx` | img o iniciales |
| `src/ui/SetupScreen.tsx` | `/setup` |
| `src/App.tsx` | ruta `/setup` |
| Modify | `types.ts`/`clans.ts`, `turnReducer`, Host/Public/RouletteWheel |

Logos ya presentes: `public/logos/*.png` (8 archivos).

---

### Task 1: eventConfig + clanDisplay + questionImport (TDD)

**Files:**
- Create: `src/game/eventConfig.ts`, `clanDisplay.ts`, `questionImport.ts` + tests
- Modify: `src/game/types.ts` si hace falta exportar `ClanConfig` / `EventConfig`

**Interfaces:**

```ts
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

export function defaultEventConfig(): EventConfig;
export function loadEventConfig(): EventConfig;
export function saveEventConfig(config: EventConfig): void;
export function getClans(config: EventConfig): ClanConfig[];
export function getActiveQuestions(config: EventConfig, embedded: Question[]): Question[];
export function clanInitials(nombre: string): string; // 1–3 letras
export function parseQuestionsJson(text: string): Question[];
export function parseQuestionsCsv(text: string): Question[]; // header: id,texto,respuestaCorrecta
```

`defaultEventConfig` clanes (ids alineados a logos + reducer):

| id | nombre | logoUrl |
|----|--------|---------|
| guardia-dragones | V Guardia de Dragones | /logos/guardia-dragones.png |
| humaita-ps15 | Humaita PS15 | /logos/humaita-ps15.png |
| chaco-boreal | Chaco Boreal | /logos/chaco-boreal.png |
| orden-san-jorge | La Orden de San Jorge | /logos/orden-san-jorge.png |
| kurusu-peregrino | Kurusu Peregrino | /logos/kurusu-peregrino.png |
| humaita-cf1 | Humaita CF1 | /logos/humaita-cf1.png |
| san-jorge-capadocia | San Jorge de Capadocia | /logos/san-jorge-capadocia.png |
| yvy-pyta | Yvy Pytã | /logos/yvy-pyta.png |

`representante: ""` en todos.

- [ ] **Step 1: Write failing tests** (round-trip, default 8 logos, getActiveQuestions null→embedded, initials, parse json/csv)
- [ ] **Step 2: FAIL → implement → PASS**
- [ ] **Step 3: Commit (si aplica)** `feat: add event config, clan initials, and question import`

---

### Task 2: Wire game to EventConfig

**Files:**
- Modify: `src/game/turnReducer.ts` — `initialGameStateFromConfig(config)`, use `config.maxRounds` / clans length; accept clans list for pick/pending (pass via closure or store `clanIds` on state)
- Modify: HostScreen / PublicScreen — `loadEventConfig()`; questions from `getActiveQuestions`; pass clans to wheel/table
- Keep `CLANS` export as deprecated alias: `export const CLANS = defaultEventConfig().clans.map(...)` for tests OR update tests to use config

**Recommended GameState addition:**

```ts
// optional: snapshot clan ids at game start
clanIds: string[];
timerSec: number;
titulo: string;
```

Or read config live on each render (simpler for D): screens call `loadEventConfig()` and pass into reducer actions that need clan list.

**Cleaner for D:**  
`turnReducer` functions that need clans take them from a module-level `getRuntimeClans(): ClanConfig[]` set by `setRuntimeConfig(config)` when screens mount / setup saves — **avoid**. Prefer:

```ts
export function initialGameStateFromConfig(config: EventConfig): GameState {
  return {
    ...initialGameState(config.clans.map(c => c.id)),
    maxRounds: config.maxRounds,
    // store timerSec on state
    timerSec: config.timerSec,
  };
}
```

Add `timerSec` to `GameState`; `START_QUESTION` / `RESTART_TIMER` use `state.timerSec` instead of hardcoded 60.

For `pickClan` / `getPendingClans`, HostScreen passes clans from config into helpers already using `CLANS` — **change call sites** to `config.clans` mapped to `{id,nombre}`.

- [ ] Update `spinToClan` etc. to accept `clans: {id,nombre}[]` parameter via action context or read from `loadEventConfig()` inside reducer (acceptable for offline single-notebook app):

```ts
function activeClans() {
  return loadEventConfig().clans;
}
```

Use that instead of `CLANS` inside reducer. Update tests to `saveEventConfig(defaultEventConfig())` in beforeEach.

- [ ] `npm test` green
- [ ] Commit (si aplica): `feat: drive game clans and timer from event config`

---

### Task 3: ClanAvatar + RouletteWheel logos/initials

**Files:**
- Create: `src/ui/ClanAvatar.tsx`
- Modify: `src/ui/RouletteWheel.tsx` (and ScoreTable if useful)

```tsx
type ClanAvatarProps = {
  nombre: string;
  logoUrl: string | null;
  color?: string;
  size?: number;
};
// if logoUrl: <img src={logoUrl} onError→fallback initials />
// else: div with clanInitials(nombre)
```

Roulette: show small avatar per sector or under selected clan; keep labels.

- [ ] Implement + build
- [ ] Commit (si aplica): `feat: show clan logos or initials on wheel`

---

### Task 4: SetupScreen + route

**Files:**
- Create: `src/ui/SetupScreen.tsx` (+ CSS)
- Modify: `src/App.tsx` — `<Route path="/setup" element={<SetupScreen />} />`
- Links from Host/Public to `/setup`

**SetupScreen behavior:**
- Load config into React state
- Edit titulo, maxRounds, timerSec → Guardar → `saveEventConfig`
- Clan rows: edit fields; logo select = list of known paths + option “Sin logo (iniciales)” (`logoUrl: null`)
- Agregar clan: `id = slug(nombre) + short random`; `logoUrl: null`
- Eliminar clan (min 2 warning)
- Import file → parse → set `questions`; Volver a embebido → `questions: null`
- Reiniciar partida: confirm → `publishGameState(initialGameStateFromConfig(loadEventConfig()))`
- Si <2 clanes, banner de error

- [ ] Implement
- [ ] `npm test && npm run build`
- [ ] Commit (si aplica): `feat: add /setup screen for event configuration`

---

### Task 5: Representante en Host/Public + guard Girar

**Files:**
- Modify: HostScreen, PublicScreen — show `representante` under clan name when non-empty
- Host: disable Girar if `config.clans.length < 2` with message

- [ ] Implement
- [ ] Commit (si aplica): `feat: show representatives and enforce min clan count`

---

### Task 6: Spec checklist

- Mark §9 in `2026-08-05-fase-d-setup-event.md`
- Update roadmap Fase D → Implementado
- Commit (si aplica): `docs: mark fase D acceptance criteria`

---

## Self-review

| Spec | Task |
|------|------|
| `/setup` | 4 |
| EventConfig storage | 1, 2 |
| CRUD + sin logo/iniciales | 3, 4 |
| Logos public/ | 1, 3 |
| Reiniciar partida only | 4 |
| Import questions | 1, 4 |
| Wire game to config | 2, 5 |
| Tests | 1 |

No TBD. Logos already on disk under `app/public/logos/`.
