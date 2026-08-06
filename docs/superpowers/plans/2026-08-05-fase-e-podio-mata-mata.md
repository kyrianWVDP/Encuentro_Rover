# Fase E — Podio, mata-mata, CSV — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans.

**Goal:** Tras fase regular, mata-mata automático por empates, pantalla final con podio, export CSV.

**Architecture:** Extender `GameState` con `mode` + `tiebreakClanIds`; helpers de ranking/CSV; UI final; reutilizar flujo de turno C restringido al grupo.

**Tech Stack:** React, Vite, TS, Vitest (sin libs PDF).

**Spec:** `docs/superpowers/specs/2026-08-05-fase-e-podio-mata-mata.md`  
**Codebase:** `app/`

## Global Constraints

- CSV UTF-8 con BOM; columnas `puesto,clan,representante,puntos`
- Preguntas mata-mata no se repiten (mismo `usedQuestionIds`)
- Solo +10/0 en tiebreak
- No PDF / sonidos / pause
- Commits solo si el usuario lo pidió
- Tests C/D siguen verdes

---

### Task 1: ranking + CSV helpers (TDD)

**Files:** Create `src/game/ranking.ts`, `src/game/exportCsv.ts` + tests

```ts
export type RankRow = { clanId: string; puesto: number; puntos: number };

export function rankClans(
  scores: Record<string, number>,
  clanIds: string[],
): RankRow[];

/** Highest-priority tied group still unresolved, or null if ranking unique. */
export function nextTieGroup(rows: RankRow[]): string[] | null;

export function buildResultsCsv(
  titulo: string,
  rows: Array<RankRow & { clan: string; representante: string }>,
): string;
```

Ranking: sort by puntos desc; same score → same `puesto`; next puesto skips (1,1,3).

`nextTieGroup`: find smallest `puesto` where count>1; return those clanIds.

CSV: BOM + header + rows; escape quotes.

- [ ] Tests FAIL → implement → PASS
- [ ] Commit (si aplica): `feat: add ranking and CSV export helpers`

---

### Task 2: Extender GameState + BEGIN_FINALE / tiebreak (TDD)

**Files:** Modify `turnReducer.ts`, types, tests

Add to `GameState`:
```ts
mode: "regular" | "tiebreak" | "final";
tiebreakClanIds: string[] | null;
```

Actions:
- `BEGIN_FINALE` — if `regularComplete`: set tiebreak group or `mode=final`
- After `CONFIRM_JUDGE` in tiebreak: if group resolved (`nextTieGroup` on full ranking is different/null for that block), advance group or `mode=final`
- Override pending clans when `mode===tiebreak` to `tiebreakClanIds` only
- `phase=final` when mode final (idle-like UI for finale)

When `ACK_SCORES` would set `regularComplete`, auto-dispatch path: either leave host to press “Ver final / mata-mata” button that sends `BEGIN_FINALE`, **or** auto-call inside ACK_SCORES. Prefer **explicit host button** “Continuar a resultado” when `regularComplete && mode===regular` to avoid surprise.

- [ ] Tests: no ties → final; ties → tiebreak ids; after scores diverge → next group/final
- [ ] Commit: `feat: add tiebreak mode and finale transition`

---

### Task 3: Final UI + CSV download + mata-mata banner

**Files:**
- Create `src/ui/FinalScreen.tsx` (podio + table + download button)
- Modify HostScreen / PublicScreen for `mode===tiebreak|final`
- Helper `downloadTextFile(filename, content)`

Podio: top 3 from `rankClans`. Banner tiebreak. Host button BEGIN_FINALE when regularComplete.

- [ ] Implement + build
- [ ] Commit: `feat: add podium screen and CSV download`

---

### Task 4: Spec checklist + roadmap

- Mark §8 done; Estado Implementado
- Update roadmap Fase E
- Commit: `docs: mark fase E acceptance criteria`

---

## Self-review

| Spec | Task |
|------|------|
| Mata-mata auto | 2 |
| Ranking helpers | 1 |
| Podio UI | 3 |
| CSV | 1, 3 |
| Tests | 1, 2 |
