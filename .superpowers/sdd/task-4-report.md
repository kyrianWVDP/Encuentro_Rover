# Task 4 Report: turnReducer (TDD)

## Status

**DONE**

## Summary

Implemented turn state machine reducer under `app/src/game/` using TDD. All 13 tests pass (4 new + 9 existing).

## TDD Evidence

### RED (Step 2)

Created `turnReducer.test.ts` only, then:

```text
npm test
→ exit 1
Error: Cannot find module './turnReducer' imported from .../turnReducer.test.ts
Test Files  1 failed | 3 passed (4)
Tests  9 passed (9)
```

### GREEN (Step 4)

After implementing `turnReducer.ts`:

```text
npm test
→ exit 0
Test Files  4 passed (4)
Tests  13 passed (13)
Duration  694ms
```

## Files Created

| File | Purpose |
|------|---------|
| `app/src/game/turnReducer.ts` | `GameState`, `Action`, `initialGameState`, `turnReducer` |
| `app/src/game/turnReducer.test.ts` | 4 tests for SPIN / RESPIN / SHOW_QUESTION / round advance |

## Commit

| SHA | Subject |
|-----|---------|
| f3f1b17 | feat: add turn state machine reducer |

## Self-Review

### Matches spec

- `GameState` includes `round`, `turn`, `rotationDeg`, `error`
- `Action` union: SPIN, SPIN_FINISHED, RESPIN, SHOW_QUESTION, NEXT_TURN
- SPIN from `idle` only; RESPIN from `clanRevealed` only; illegal actions no-op
- SPIN/RESPIN pick clan via `pickClan` + `targetWheelRotationDeg` without marking played
- SHOW_QUESTION marks clan, picks question, updates `usedQuestionIds`, calls `advanceRoundIfComplete`
- NEXT_TURN clears selection and returns to `idle`
- Default `rng` = `Math.random`; errors from helpers caught and stored in `state.error`
- TDD order followed: failing tests → implementation → green

### Deviations / notes

- `clanSectorIndex` imported from `./clans` (not `./spin`) — matches where Task 2 exports it

### Not tested (by design)

- Illegal action no-ops (wrong phase)
- `error` field population on exhausted clans/questions
- `SPIN_FINISHED` / `NEXT_TURN` in isolation

## Concerns

None blocking. `usedQuestionIds` is not reset on round advance (only `playedClanIds` clears per `advanceRoundIfComplete`); confirm Task 5+ expects question pool to carry across rounds.

## Next Task Handoff

- Import `turnReducer`, `initialGameState`, `Action`, `GameState` from `app/src/game/turnReducer`
- Wire `useReducer(turnReducer, initialGameState())` in UI (Task 5+)
- `SPIN_DURATION_MS` available from `./spin` for animation timing
