# Fase F — Show (sonidos / animaciones) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sonidos de show en el proyector (spin/correct/incorrect/winner), mute desde host, anuncio de clan + highlight de tabla, fondo ruleta si hay PNG.

**Architecture:** Motor `playSound` + mute en `localStorage`; helper puro `soundsForTransition(prev, next)` testeable; hook `useGameSounds` solo en `PublicScreen`. Animaciones CSS; assets en `app/public/sounds/`.

**Tech Stack:** React, Vite, TypeScript, Vitest, `HTMLAudioElement` nativo (sin libs de audio).

**Spec:** `docs/superpowers/specs/2026-08-06-fase-f-show-sonidos.md`  
**Codebase:** `app/`

## Global Constraints

- Audio solo en `/` (proyector); host no reproduce
- Mute key: `justas-mute-v1` (`"1"` / `"0"`)
- Archivos canónicos: `app/public/sounds/{spin,correct,incorrect,winner}.mp3`
- Stubs `start` / `timer10` / `timerEnd`: mapa sin archivo → `playSound` no-op
- No PDF / pause / offline (G)
- Commits con `git -c user.email="dev@local" -c user.name="Encuentro Rover"` si el usuario/plan pide commit
- Tests C–E siguen verdes (`cd app && npm test`)

## File map

| File | Responsibility |
|------|----------------|
| `app/public/sounds/*.mp3` | Assets renombrados desde `app/dist/sounds/` |
| `app/src/game/sounds.ts` | Eventos, rutas, mute, unlock, `playSound` |
| `app/src/game/sounds.test.ts` | Unit mute / rutas / no-throw |
| `app/src/game/soundTransitions.ts` | `soundsForTransition(prev, next)` |
| `app/src/game/soundTransitions.test.ts` | Transiciones de fase → eventos |
| `app/src/ui/useGameSounds.ts` | Hook: prev ref + play events |
| `app/src/ui/PublicScreen.tsx` | Llama `useGameSounds`; unlock en click; CSS clan |
| `app/src/ui/HostScreen.tsx` | Toggle mute |
| `app/src/ui/PublicScreen.css` | Pulse clan reveal |
| `app/src/ui/ScoreTable` CSS (o archivo existente) | Pulse fila `.highlighted` |
| `app/src/ui/RouletteWheel.css` | Fondo `/ruleta-fondo.png` con fallback |
| `app/public/ruleta-fondo.png` | Solo si el arte existe; si no, skip |

---

### Task 1: Assets + motor `sounds.ts` (TDD)

**Files:**
- Create: `app/public/sounds/spin.mp3`, `correct.mp3`, `incorrect.mp3`, `winner.mp3` (copy/rename from `app/dist/sounds/`)
- Create: `app/src/game/sounds.ts`, `app/src/game/sounds.test.ts`

**Interfaces:**
- Produces:
```ts
export type SoundEvent =
  | "spin"
  | "correct"
  | "incorrect"
  | "winner"
  | "start"
  | "timer10"
  | "timerEnd";

export const MUTE_STORAGE_KEY = "justas-mute-v1";

export function soundUrl(event: SoundEvent): string | null;
export function isMuted(): boolean;
export function setMuted(muted: boolean): void;
export function unlockAudio(): void;
export function playSound(event: SoundEvent): void;
```

**Mapping files (exact):**

| Event | Source in `app/dist/sounds/` | Dest |
|-------|------------------------------|------|
| `spin` | `moviendo la ruleta en preguntados.mp3` | `public/sounds/spin.mp3` |
| `correct` | `Sonido de Victoria de un Juego para tus vídeos - Efecto de Sonido.mp3` | `public/sounds/correct.mp3` |
| `incorrect` | `SUPER MARIO - game over - sound effect.mp3` | `public/sounds/incorrect.mp3` |
| `winner` | `Sonido banderita mario bros.mp3` | `public/sounds/winner.mp3` |

`soundUrl`: returns `/sounds/spin.mp3` etc. for the four; `null` for stubs.

`playSound`: if muted or `soundUrl` null → return; else `new Audio(url).play().catch(() => {})`.

`unlockAudio`: play silent/empty or resume a shared `AudioContext` / play volume-0 of spin once — minimal: set module flag `unlocked=true` and attempt `play()` of a zero-volume buffer; if browsers block, first real `playSound` after user gesture still works when called from click handler that also calls `unlockAudio`.

- [ ] **Step 1: Copy/rename MP3s into `app/public/sounds/`**

PowerShell (from repo root):

```powershell
New-Item -ItemType Directory -Force -Path "app/public/sounds" | Out-Null
Copy-Item "app/dist/sounds/moviendo la ruleta en preguntados.mp3" "app/public/sounds/spin.mp3"
Copy-Item "app/dist/sounds/Sonido de Victoria de un Juego para tus vídeos - Efecto de Sonido.mp3" "app/public/sounds/correct.mp3"
# If accent fails, use Get-ChildItem + Where-Object Name -like '*Victoria*'
Copy-Item "app/dist/sounds/SUPER MARIO - game over - sound effect.mp3" "app/public/sounds/incorrect.mp3"
Copy-Item "app/dist/sounds/Sonido banderita mario bros.mp3" "app/public/sounds/winner.mp3"
```

Verify four files exist with non-zero size.

- [ ] **Step 2: Write failing tests** in `app/src/game/sounds.test.ts`

```ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  soundUrl,
  isMuted,
  setMuted,
  playSound,
  MUTE_STORAGE_KEY,
} from "./sounds";

describe("sounds", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("soundUrl maps known events and stubs", () => {
    expect(soundUrl("spin")).toBe("/sounds/spin.mp3");
    expect(soundUrl("correct")).toBe("/sounds/correct.mp3");
    expect(soundUrl("incorrect")).toBe("/sounds/incorrect.mp3");
    expect(soundUrl("winner")).toBe("/sounds/winner.mp3");
    expect(soundUrl("start")).toBeNull();
    expect(soundUrl("timer10")).toBeNull();
    expect(soundUrl("timerEnd")).toBeNull();
  });

  it("setMuted persists and isMuted reads it", () => {
    expect(isMuted()).toBe(false);
    setMuted(true);
    expect(localStorage.getItem(MUTE_STORAGE_KEY)).toBe("1");
    expect(isMuted()).toBe(true);
    setMuted(false);
    expect(localStorage.getItem(MUTE_STORAGE_KEY)).toBe("0");
    expect(isMuted()).toBe(false);
  });

  it("playSound does not throw when muted or stub", () => {
    setMuted(true);
    expect(() => playSound("spin")).not.toThrow();
    setMuted(false);
    expect(() => playSound("start")).not.toThrow();
  });
});
```

- [ ] **Step 3: Run tests — expect FAIL** (module missing)

```bash
cd app && npx vitest run src/game/sounds.test.ts
```

Expected: FAIL cannot find module `./sounds`

- [ ] **Step 4: Implement `sounds.ts`**

```ts
export type SoundEvent =
  | "spin"
  | "correct"
  | "incorrect"
  | "winner"
  | "start"
  | "timer10"
  | "timerEnd";

export const MUTE_STORAGE_KEY = "justas-mute-v1";

const FILE_BY_EVENT: Partial<Record<SoundEvent, string>> = {
  spin: "/sounds/spin.mp3",
  correct: "/sounds/correct.mp3",
  incorrect: "/sounds/incorrect.mp3",
  winner: "/sounds/winner.mp3",
};

export function soundUrl(event: SoundEvent): string | null {
  return FILE_BY_EVENT[event] ?? null;
}

export function isMuted(): boolean {
  return localStorage.getItem(MUTE_STORAGE_KEY) === "1";
}

export function setMuted(muted: boolean): void {
  localStorage.setItem(MUTE_STORAGE_KEY, muted ? "1" : "0");
}

let unlocked = false;

export function unlockAudio(): void {
  unlocked = true;
}

export function playSound(event: SoundEvent): void {
  if (isMuted()) return;
  const url = soundUrl(event);
  if (!url) return;
  try {
    const audio = new Audio(url);
    void audio.play().catch(() => {
      /* autoplay blocked until unlock gesture */
    });
  } catch {
    /* ignore */
  }
}

export function isAudioUnlocked(): boolean {
  return unlocked;
}
```

- [ ] **Step 5: Run tests — expect PASS**

```bash
cd app && npx vitest run src/game/sounds.test.ts
```

- [ ] **Step 6: Commit**

```bash
git add app/public/sounds app/src/game/sounds.ts app/src/game/sounds.test.ts
git -c user.email="dev@local" -c user.name="Encuentro Rover" commit -m "feat: add sound assets and playSound engine"
```

---

### Task 2: `soundsForTransition` (TDD)

**Files:**
- Create: `app/src/game/soundTransitions.ts`, `app/src/game/soundTransitions.test.ts`

**Interfaces:**
- Consumes: `GameState` from `turnReducer`, `SoundEvent` from `sounds`
- Produces:
```ts
export function soundsForTransition(
  prev: GameState,
  next: GameState,
): SoundEvent[];
```

**Rules (exact):**
1. `prev.turn.phase !== "spinning" && next.turn.phase === "spinning"` → `"spin"`
2. `prev.turn.phase !== "revealAnswer" && next.turn.phase === "revealAnswer"`:
   - `next.lastJudgement === "correct"` → `"correct"`
   - `next.lastJudgement === "incorrect"` → `"incorrect"`
3. `prev.mode !== "final" && next.mode === "final"` → `"winner"`
4. Same phase re-render → `[]`

- [ ] **Step 1: Write failing tests**

Use `initialGameState()` and minimal patches, or drive with `turnReducer` actions:

```ts
import { describe, it, expect } from "vitest";
import { initialGameState, turnReducer } from "./turnReducer";
import { soundsForTransition } from "./soundTransitions";

const rng0 = () => 0;

describe("soundsForTransition", () => {
  it("emits spin when entering spinning", () => {
    const prev = initialGameState();
    const next = turnReducer(prev, { type: "SPIN", rng: rng0 });
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
```

Imports for that file: `CLANS` from `./clans`, `saveEventConfig` / `defaultEventConfig` from `./eventConfig` (same as `turnReducer.test.ts`).

- [ ] **Step 2: Run — FAIL** (module missing)

```bash
cd app && npx vitest run src/game/soundTransitions.test.ts
```

- [ ] **Step 3: Implement**

```ts
import type { GameState } from "./turnReducer";
import type { SoundEvent } from "./sounds";

export function soundsForTransition(
  prev: GameState,
  next: GameState,
): SoundEvent[] {
  const out: SoundEvent[] = [];
  if (prev.turn.phase !== "spinning" && next.turn.phase === "spinning") {
    out.push("spin");
  }
  if (
    prev.turn.phase !== "revealAnswer" &&
    next.turn.phase === "revealAnswer"
  ) {
    if (next.lastJudgement === "correct") out.push("correct");
    if (next.lastJudgement === "incorrect") out.push("incorrect");
  }
  if (prev.mode !== "final" && next.mode === "final") {
    out.push("winner");
  }
  return out;
}
```

- [ ] **Step 4: Run — PASS**

```bash
cd app && npx vitest run src/game/soundTransitions.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add app/src/game/soundTransitions.ts app/src/game/soundTransitions.test.ts
git -c user.email="dev@local" -c user.name="Encuentro Rover" commit -m "feat: map game transitions to sound events"
```

---

### Task 3: Hook + PublicScreen + Host mute

**Files:**
- Create: `app/src/ui/useGameSounds.ts`
- Modify: `app/src/ui/PublicScreen.tsx`
- Modify: `app/src/ui/HostScreen.tsx`

**Interfaces:**
- Consumes: `soundsForTransition`, `playSound`, `unlockAudio`, `isMuted`, `setMuted`, `MUTE_STORAGE_KEY`
- Produces: `useGameSounds(state: GameState): void`

**Hook:**

```ts
import { useEffect, useRef } from "react";
import type { GameState } from "../game/turnReducer";
import { playSound } from "../game/sounds";
import { soundsForTransition } from "../game/soundTransitions";

export function useGameSounds(state: GameState): void {
  const prevRef = useRef<GameState | null>(null);

  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = state;
    if (!prev) return;
    for (const ev of soundsForTransition(prev, state)) {
      playSound(ev);
    }
  }, [state]);
}
```

**PublicScreen:**
- Call `useGameSounds(gameState)`
- On `main` click / first interaction: `unlockAudio()`
- Subscribe to `window` `storage` for `MUTE_STORAGE_KEY` so mute from host tab updates (optional: force re-read inside `isMuted` already reads localStorage each play — same-origin tabs: `storage` event fires on *other* tabs; `isMuted()` on each `playSound` is enough without React state)

**HostScreen:**
- State `muted` from `isMuted()`
- Button: `Silenciar sonidos` / `Activar sonidos` → `setMuted(!muted)` + setState
- Also call `unlockAudio()` on first host click so if someone tests audio on same machine without projector tab gesture, unlock still happens for public after navigation — unlock is per-tab; document that proyector tab needs one click (link Host/Setup or anywhere on `main`)

- [ ] **Step 1: Implement hook + wire screens**
- [ ] **Step 2: Manual check** — `npm run dev`: open `/` and `/host`; girar → spin; confirmar correcta/incorrecta; BEGIN_FINALE → winner; mute en host → no sound on next event in `/`
- [ ] **Step 3: Full test suite**

```bash
cd app && npm test
```

Expected: all green (incl. previous 68+)

- [ ] **Step 4: Commit**

```bash
git add app/src/ui/useGameSounds.ts app/src/ui/PublicScreen.tsx app/src/ui/HostScreen.tsx
git -c user.email="dev@local" -c user.name="Encuentro Rover" commit -m "feat: play show sounds on public screen with host mute"
```

---

### Task 4: Visual polish (clan pulse, score highlight, ruleta fondo)

**Files:**
- Modify: `app/src/ui/PublicScreen.css` (`.clan-reveal-info`)
- Modify: CSS used by `ScoreTable` (add `@keyframes` for `tr.highlighted` if not present — check `PublicScreen.css` / create `ScoreTable.css` imported from `ScoreTable.tsx`)
- Modify: `app/src/ui/RouletteWheel.css`
- Optional: add `app/public/ruleta-fondo.png` **only if file is provided**; otherwise leave comment + `background-image: url("/ruleta-fondo.png")` with color fallback (broken image URL is OK if file missing — prefer feature-detect: keep fallback color; set `background-image` only when asset exists)

**Preferred ruleta approach:** In CSS always:

```css
.roulette-wheel {
  background-color: #4a4a4a;
  background-image: url("/ruleta-fondo.png");
  background-size: cover;
}
```

If PNG absent, browser shows color underneath (image 404 — acceptable for F until FEPE delivers art). Do **not** invent artwork.

**Clan reveal:**

```css
.clan-reveal-info {
  animation: clan-pulse 1.2s ease-out;
}
@keyframes clan-pulse {
  0% { transform: scale(0.85); opacity: 0.5; }
  40% { transform: scale(1.08); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
```

**Score highlight:**

```css
tr.highlighted {
  animation: score-flash 1s ease-out;
}
@keyframes score-flash {
  0% { filter: brightness(1.4); }
  100% { filter: brightness(1); }
}
```

Ensure `ScoreTable` imports the CSS file that defines `.highlighted`.

`PublicScreen` already passes `highlightClanId={selectedClanId}` on `showScores` — no logic change required beyond CSS.

Enhance `clan-reveal-info` to show `ClanAvatar` if easy (optional, YAGNI if already has name).

- [ ] **Step 1: CSS + import**
- [ ] **Step 2: Visual check** in browser (clan reveal + showScores)
- [ ] **Step 3: Commit**

```bash
git add app/src/ui/PublicScreen.css app/src/ui/ScoreTable.tsx app/src/ui/ScoreTable.css app/src/ui/RouletteWheel.css
git -c user.email="dev@local" -c user.name="Encuentro Rover" commit -m "feat: add clan and score show animations"
```

---

### Task 5: Spec checklist + roadmap

**Files:**
- Modify: `docs/superpowers/specs/2026-08-06-fase-f-show-sonidos.md` — mark §8 checkboxes; Estado → Implementado
- Modify: `docs/superpowers/specs/2026-08-05-roadmap-post-b.md` — Fase F implementada; table sonidos/arte

- [ ] **Step 1: Update docs**
- [ ] **Step 2: `cd app && npm test`** — all green
- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/specs/2026-08-06-fase-f-show-sonidos.md docs/superpowers/specs/2026-08-05-roadmap-post-b.md
git -c user.email="dev@local" -c user.name="Encuentro Rover" commit -m "docs: mark fase F acceptance criteria"
```

---

## Self-review (plan vs spec)

| Spec requirement | Task |
|------------------|------|
| 4 MP3 in `public/sounds` | T1 |
| `playSound` + stubs no-op | T1 |
| Transitions spin/correct/incorrect/winner | T2 |
| Hook only on public | T3 |
| Host mute `justas-mute-v1` | T3 |
| Unlock gesture | T3 |
| Clan announce animation | T4 |
| Score row highlight polish | T4 |
| ruleta-fondo if/when PNG | T4 |
| Criterios §8 + roadmap | T5 |
| No start/timer10/timerEnd files | T1 stubs |
| No PDF / G | Out of plan |

---

## Execution handoff

Plan saved to `docs/superpowers/plans/2026-08-06-fase-f-show-sonidos.md`.

**Two execution options:**

1. **Subagent-Driven (recommended)** — fresh subagent per task, review between tasks  
2. **Inline Execution** — same session with executing-plans checkpoints  

Which approach?
