# Task 3 Report: Questions + round helpers (TDD)

## Status

**DONE**

## Summary

Implemented question pool (12 fixtures) and round progression helpers under `app/src/game/` using TDD. All 9 tests pass (4 new + 5 existing).

## TDD Evidence

### RED (Step 2)

Created `questions.test.ts` and `round.test.ts` only, then:

```text
npm test
→ exit 1
Error: Cannot find module './questions' imported from .../questions.test.ts
Error: Cannot find module './round' imported from .../round.test.ts
Test Files  2 failed | 1 passed (3)
Tests  5 passed (5)
```

### GREEN (Step 4)

After implementing `questions.ts` and `round.ts`:

```text
npm test
→ exit 0
Test Files  3 passed (3)
Tests  9 passed (9)
Duration  430ms
```

## Files Created

| File | Purpose |
|------|---------|
| `app/src/game/questions.ts` | `QUESTIONS` (12 entries), `pickRandomUnused()` |
| `app/src/game/round.ts` | `getPendingClans`, `markClanPlayed`, `advanceRoundIfComplete` |
| `app/src/game/questions.test.ts` | 2 tests for `pickRandomUnused` |
| `app/src/game/round.test.ts` | 2 tests for round progression |

## Commit

| SHA | Subject |
|-----|---------|
| f99cc18 | feat: add question pool and round progression helpers |

## Self-Review

### Matches spec

- All interfaces and exports from task brief implemented verbatim
- `QUESTIONS` has 12 fixtures with Scout/Rover content from brief
- `pickRandomUnused` filters used ids, throws when exhausted, uses `Rng`
- `getPendingClans` excludes played clan ids
- `markClanPlayed` is idempotent (duplicate clan id returns same state)
- `advanceRoundIfComplete` increments round and clears `playedClanIds` when all clans played
- TDD order followed: failing tests → implementation → green
- Existing `types.ts`, `clans.ts`, `spin.ts` unchanged

### Deviations / notes

None. Implementation matches brief exactly.

### Not tested (by design)

- `markClanPlayed` duplicate-id idempotency — implied by implementation, no explicit test in brief
- `advanceRoundIfComplete` partial-round no-op — no test when not all clans played
- `QUESTIONS` content correctness — fixtures only, not answer validation

## Concerns

None blocking. `usedQuestionIds` on `RoundState` is not mutated by round helpers yet; question usage tracking will likely wire in Task 4+ turn flow.

## Next Task Handoff

- Import from `app/src/game/questions`, `round`
- `QUESTIONS` and `pickRandomUnused(usedIds, QUESTIONS, rng)` ready for turn question selection
- `getPendingClans(CLANS, playedClanIds)` pairs with `pickClan` from spin module
- `markClanPlayed` + `advanceRoundIfComplete` ready for turn/round state machine
