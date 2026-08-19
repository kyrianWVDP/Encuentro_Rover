# Final Adjustments Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the post-rehearsal feedback list across projector, host, audio, scoreboard, mata-mata logic, and final podium without breaking sync or existing tests.

**Architecture:** Split work by product surface (fondo, ruleta, audio, scoreboard, mata-mata/game logic, final screen). Prefer CSS/UI changes for layout/copy; keep game-rule changes in `turnReducer` + scoring helpers with tests first.

**Tech Stack:** React + Vite + TypeScript (`app/`), existing `sounds.ts` / BroadcastChannel sync, Vitest.

## Global Constraints

- No new npm dependencies.
- Sounds play on proyector only (existing pattern); mute key still shared.
- Mata-mata only resolves podium places 1–3 (already implemented).
- Deploy via push to `main` only after user asks.
- Confirm open questions below before coding tasks marked **NEEDS CONFIRM**.

---

## Open questions (confirm before coding)

| # | Item | Assumed default if no answer |
|---|------|------------------------------|
| Q1 | “Resultados Finales” | **Confirmed:** keep wording; fix **typography** readability |
| Q2 | Sonido de timer 60s | **Confirmed:** soft clock during full timer + end/warning alert |
| Q3 | Clan + ruleta | **Confirmed:** (1) clear sector highlight when spin stops; (2) clan name/logo must match wheel |
| Q4 | Fondo nuevo | **Confirmed:** proyector **and** Host |
| Q5 | Numeración en tabla final | Columna **Puesto** in final `ScoreTable`; dense ranks OK for 4º+ |
| Q6 | Mata-mata scoreboard | **Confirmed:** projector hides big scoreboard until podium 1–3 unique → final. Host sidebar **keeps** live scores. Ties for 4º+ ignored. |

---

## Part map (your list → program area)

### A. Assets / fondo (externo + wiring)
| Feedback | Area |
|----------|------|
| Cambiar imagen de fondo → pedir a Emilio | Asset + CSS vars |

### B. Proyector — ruleta
| Feedback | Area |
|----------|------|
| Centrar la ruleta | `PublicScreen` / `RouletteWheel` layout |
| [ilegible] clan seleccionado con la ruleta | Highlight / post-spin sync |

### C. Audio
| Feedback | Area |
|----------|------|
| Agregar sonido de timer (60s) | `sounds` + `useGameSounds` + MP3 |

### D. Scoreboard / animaciones
| Feedback | Area |
|----------|------|
| Hacer más lento el conteo de los puntajes | `ScoreTable` count-up duration |
| Hacer que suban y bajen los puestos | `ScoreTable` rank FLIP / reorder motion |

### E. Mata-mata / lógica de juego
| Feedback | Area |
|----------|------|
| El mata-mata solo muestra puntajes cuando ya se desempató | `turnReducer` + Public/Host score phases |
| No debe seguir contando como rondas extras | `roundNumber` / Host header in tiebreak |

### F. Pantalla final / podio
| Feedback | Area |
|----------|------|
| Cambiar texto “Resultados Finales” | `FinalScreen` + CSV |
| Quitar barra de scroll del podio | `FinalScreen` / `PublicScreen` overflow |
| Poner botón descargar CSV abajo | `FinalScreen` layout |
| Agregar numeración a puntajes en ronda final | `ScoreTable` rank column |
| Centrar número en el podio final | `FinalScreen.css` podium number |

---

## File map

| File | Responsibility |
|------|----------------|
| `app/public/` (fondo JPG from Emilio) | New background asset |
| `app/src/main.tsx` / `assetUrl.ts` | Wire `--asset-encuentro-fondo` |
| `app/src/ui/PublicScreen.css` / `.tsx` | Center wheel; tiebreak/final layout |
| `app/src/ui/RouletteWheel.tsx` / `.css` | Selected-clan highlight after spin |
| `app/src/game/sounds.ts` | Register timer loop SFX |
| `app/src/ui/useGameSounds.ts` | Start/stop timer sound with phase |
| `app/public/sounds/` | Clock MP3 (existing untracked file) |
| `app/src/ui/ScoreTable.tsx` / `.css` | Slower count-up; rank motion; puesto column |
| `app/src/game/turnReducer.ts` | Mata-mata score table gating; no fake rounds |
| `app/src/ui/HostScreen.tsx` | Round label in tiebreak; score visibility |
| `app/src/ui/FinalScreen.tsx` / `.css` | Copy, CSV position, overflow, podium number, full table ranks |
| `app/src/game/*.test.ts` | Cover logic/animation contracts |

---

## Suggested implementation order

1. **F — Final screen polish** ✅ (typography, CSV bottom, no scroll, ranks, centered podium #)
2. **D — Scoreboard animations** ✅ (slower count-up ~2.4s + FLIP reorder)
3. **B — Roulette layout/highlight** ✅ (centered; keep wheel + highlight + caption on reveal)
4. **C — Timer sound** ✅ (soft `timer-clock.mp3` + last-9s warning)
5. **E — Mata-mata logic** ✅ (no mid scoreboard; freeze round counter; Host “Desempate”)
6. **A — Background swap** ⏸ skipped for now (per user)

---

## Task 1: Final screen layout + copy

**Files:** `FinalScreen.tsx`, `FinalScreen.css`, `PublicScreen.css` (final overflow), optionally `exportCsv` title string

- [ ] **Step 1:** Keep “¡Resultados Finales!” copy; change font/weight/size/contrast so it is readable on the medieval background (avoid Unifraktur / overly ornate display if that is the culprit).
- [ ] **Step 2:** Apply the same readable treatment to any matching subtitle if needed; CSV title can stay plain text.
- [ ] **Step 3:** Reorder DOM: title → podium → score table → CSV button (`.final-actions` last).
- [ ] **Step 4:** Remove / avoid vertical scrollbar: prefer `overflow: hidden` + fit content (`max-height`/`scale` or reduce gaps) on projector final; Host may keep mild scroll only if needed.
- [ ] **Step 5:** Center podium place numbers vertically/horizontally in `.podium-step` (flex center; keep 2\|1\|3 order).
- [ ] **Step 6:** On final `ScoreTable`, pass `showRank` and show full ranking (not only `topN={3}` if numeración is for the table).
- [ ] **Step 7:** Manual check Host + Proyector final; commit.

**Commit:** `fix(final): polish podium layout, copy, and CSV placement`

---

## Task 2: ScoreTable — slower count-up + rank column

**Files:** `ScoreTable.tsx`, `ScoreTable.css`, callers in `FinalScreen` / `PublicScreen`

- [ ] **Step 1:** Increase count-up `duration` from `1000` → **~2200–2500ms** (eased).
- [ ] **Step 2:** Add optional prop `showRank?: boolean`; when true, first column = `puesto` from `rankClans`.
- [ ] **Step 3:** Enable `showRank` on final table only (unless user wants everywhere).
- [ ] **Step 4:** Visual check projector `showScores` count-up feels slower; commit.

**Commit:** `feat(scores): slower count-up and optional rank column`

---

## Task 3: ScoreTable — puestos subir/bajar (reorder animation)

**Files:** `ScoreTable.tsx`, `ScoreTable.css`

- [ ] **Step 1:** On projector animated table, keep previous order keyed by `clanId`.
- [ ] **Step 2:** After scores update, compute new order; animate row movement (CSS FLIP or `transform` transition ~500–800ms) so rows visibly rise/fall.
- [ ] **Step 3:** Ensure cascade-in on first mount still works; don’t fight FLIP.
- [ ] **Step 4:** Manual check after a correct judgement round; commit.

**Commit:** `feat(scores): animate rank row reordering`

---

## Task 4: Center roulette + selected clan highlight

**Files:** `PublicScreen.tsx/.css`, `RouletteWheel.tsx/.css`

- [ ] **Step 1:** Adjust projector layout so wheel is optically centered in the stage (account for absolute title; use safe padding / flex centering).
- [ ] **Step 2 (Q3):** After spin finishes (`clanRevealed`), either keep wheel visible with `.selected` highlight briefly, or ensure highlight is visible at end of spin before switching to avatar card — match confirmed UX.
- [ ] **Step 3:** Verify host selected-clan panel still matches `selectedClanId`.
- [ ] **Step 4:** Manual check idle + spin + reveal; commit.

**Commit:** `fix(projector): center wheel and clarify selected clan`

---

## Task 5: Timer sound (60s)

**Files:** `sounds.ts`, `useGameSounds.ts`, `public/sounds/…mp3`, optional `soundTransitions`

- [ ] **Step 1:** Confirmed Q2 — soft clock loop for full `timerSec` while question running + stronger end/last-seconds alert (existing warning can become the alert layer).
- [ ] **Step 2:** Add/register clock asset (rename to stable ASCII filename if needed, e.g. `timer-clock.mp3`).
- [ ] **Step 3:** While `phase === "questionRunning"` and timer running, play soft loop; ramp or switch to warning in last ~9s; stop on STOP_TIMER / judgement / abort / mute.
- [ ] **Step 4:** Avoid double-blasting soft loop + warning; duck or stop soft loop when warning starts if needed.
- [ ] **Step 5:** Manual check with audio unlock on proyector; commit.

**Commit:** `feat(audio): play timer clock sound during question`

---

## Task 6: Mata-mata — scores only when resolved + no extra rounds

**Files:** `turnReducer.ts`, `turnReducer.test.ts`, `HostScreen.tsx`, maybe `PublicScreen.tsx`

- [ ] **Step 1:** Write failing tests:
  - During unresolved mata-mata (podium 1–3 still tied) → never enter projector `showScores`; continue spins / go idle after reveal.
  - When puestos 1–3 are unique → `mode=final` immediately (ties for 4º+ ignored — already in `nextTieGroup`).
  - In `mode === "tiebreak"`, Host must **not** show advancing `roundNumber / maxRounds` as extra regular rounds (show Desempate / freeze counter).
- [ ] **Step 2:** Implement: skip `roundScoresPending` while still in unresolved tiebreak; only surface scores on final podium screen.
- [ ] **Step 3:** Host header in tiebreak: show **Desempate** (or “Mata-mata”) instead of `roundNumber / maxRounds`.
- [ ] **Step 4:** Run full vitest; commit.

**Commit:** `fix(game): mata-mata score gating and freeze round counter`

---

## Task 7: Background image (blocked on Emilio)

**Files:** `app/public/` (or assets), `main.tsx` / `assetUrl.ts`, `PublicScreen.css`, `HostScreen.css`

- [ ] **Step 1:** Ask Emilio for final fondo; drop into `app/public/` with stable name (e.g. `encuentro-fondo.jpg`).
- [ ] **Step 2:** Point `--asset-encuentro-fondo` at new file; keep overlay readable.
- [ ] **Step 3:** Verify proyector + host; commit.

**Commit:** `chore(assets): update encuentro background image`

---

## Verification checklist (end-to-end)

- [ ] Proyector: wheel centered; selected clan readable after spin.
- [ ] Timer sound during question; mute works; no stuck loop.
- [ ] Score table: slower count-up; rows move up/down on rank change.
- [ ] Mata-mata: no mid-unresolved scoreboard; Host doesn’t show fake extra rounds.
- [ ] Final: new title; no scrollbar; CSV at bottom; ranks numbered; podium numbers centered.
- [ ] `npm test` green; optional deploy to Pages when user requests.

---

## Out of scope

- Redesigning Setup CRUD / question import.
- New animation libraries.
- Changing +10/0 scoring rules.
- Waiting indefinitely on Emilio before shipping Tasks 1–6.
