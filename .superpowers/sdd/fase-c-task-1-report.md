# Fase C Task 1 Report — Types + scoring + timer + selectors

## Status
**COMPLETE** — TDD green, committed.

## Commits
- `e9961a0` feat: add scoring, timer, and answer visibility helpers

## Tests
```
Test Files  7 passed (7)
Tests       22 passed (22)
```
New suites: `scoring.test.ts` (3), `timer.test.ts` (4), `selectors.test.ts` (1). Existing suites unchanged and passing.

## Deliverables
| File | Action |
|------|--------|
| `types.ts` | Added `Judgement`, `TimerState`; extended `TurnPhase` (removed `"question"`, added `questionRunning` \| `awaitingJudgement` \| `revealAnswer` \| `showScores`) |
| `scoring.ts` | `POINTS_CORRECT=10`, `initialScores`, `applyJudgement` |
| `timer.ts` | `startTimer`, `stopTimer`, `restartTimer`, `remainingFromEndsAt` |
| `selectors.ts` | `canShowAnswer` |

## Temporary breakage (Task 2 scope)
- `turnReducer.ts` / test: `"question"` → `"questionRunning"` (minimal compile/test fix only; full flow rewrite is Task 2).
- `TurnScreen.tsx` still references phase `"question"` — will fail `tsc -b` until Task 2 updates UI. Vitest passes (UI not in test graph).

## Concerns
- None blocking. `TurnScreen` type mismatch is expected and documented above.
