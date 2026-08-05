# Fase D Task 2 Report

## Status
- `turnReducer.ts`: updated `initialGameState` and `spinToClan` to use `loadEventConfig().clans` dynamically and `timerSec` instead of hardcoded defaults.
- `spin.ts` / `RouletteWheel.tsx`: made sector degrees dynamic based on clans length.
- `HostScreen.tsx` / `PublicScreen.tsx`: updated to read active questions and clans from `eventConfig`.
- Tests updated to use `saveEventConfig(defaultEventConfig())` and mock `localStorage`. All tests pass.

## Commits
- `feat: drive game clans and timer from event config`

## Tests
- Run with `npm test`, 54/54 tests passed.