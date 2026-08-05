# Fase C Task 2 Report

**Status:** Completed.

**Commits:**
- `feat: extend game reducer for judgement, timer, and scores`

**Tests:**
- Updated `turnReducer.test.ts` to include tests for all new flow (`START_QUESTION`, `REQUEST_JUDGE`, `CONFIRM_JUDGE`, `ACK_REVEAL`, `ACK_SCORES`, `STOP_TIMER`, `RESTART_TIMER`, `ABORT_TURN_RESPIN`).
- All 27 tests in the suite run and pass locally with `npm test`.

**Concerns:**
- `TurnScreen` was minimally patched to avoid TypeScript errors (`START_QUESTION` and updating `questionRunning`), but UI for full judgement flow needs to be implemented properly (planned for Task 7).
- Timer functions require injecting `nowMs` appropriately from the UI layer to maintain purity.