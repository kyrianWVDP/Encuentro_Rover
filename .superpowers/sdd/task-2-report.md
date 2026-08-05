# Task 2 Report: Types + clans fixture + spin math (TDD)

## Status

**DONE**

## Summary

Implemented game domain types, 8-clan fixture, and spin selection/angle math under `app/src/game/` using TDD. All 5 tests pass.

## TDD Evidence

### RED (Step 2)

Created `app/src/game/spin.test.ts` only, then:

```text
npm test
→ exit 1
Error: Cannot find module './clans' imported from .../app/src/game/spin.test.ts
Test Files  1 failed (1)
Tests  no tests
```

### GREEN (Step 4)

After implementing `types.ts`, `clans.ts`, `spin.ts`:

```text
npm test
→ exit 0
Test Files  1 passed (1)
Tests  5 passed (5)
Duration  336ms
```

## Files Created

| File | Purpose |
|------|---------|
| `app/src/game/types.ts` | `Clan`, `Question`, `TurnPhase`, `RoundState`, `TurnState`, `Rng` |
| `app/src/game/clans.ts` | `CLANS` (8 entries), `clanSectorIndex()` |
| `app/src/game/spin.ts` | `pickClan`, `angleForClanIndex`, `targetWheelRotationDeg`, constants |
| `app/src/game/spin.test.ts` | 5 tests for `pickClan` and `angleForClanIndex` |

## Commit

| SHA | Subject |
|-----|---------|
| dd00896 | feat: add clan fixtures and spin selection math |

## Self-Review

### Matches spec

- All interfaces and exports from task brief implemented verbatim
- `CLANS` length 8 with exact clan ids/nombres from brief
- `pickClan` uses `Math.floor(rng() * pending.length)` with empty-array guard
- `angleForClanIndex` uses 45° sectors (0, 45, …, 315)
- `SPIN_EXTRA_TURNS = 5`, `SPIN_DURATION_MS = 3500`
- `targetWheelRotationDeg` and `sectorCenterOffset` included for Task 3+ wheel animation
- TDD order followed: failing tests → implementation → green

### Deviations / notes

None. Implementation matches brief exactly.

### Not tested (by design)

- `targetWheelRotationDeg` — exported for future wheel UI; no tests in Task 2 brief
- `clanSectorIndex` error path — only used with valid CLANS ids in current tests

## Concerns

None blocking. `targetWheelRotationDeg` may need visual calibration (`OFFSET_DEG` comment in brief) when wheel UI lands in Task 3+.

## Next Task Handoff

- Import from `app/src/game/types`, `clans`, `spin`
- `CLANS` and `clanSectorIndex` ready for wheel sectors
- `pickClan(pending, rng)` ready for turn logic with played-clan filtering
- `targetWheelRotationDeg(clanIndex)` ready for CSS transform animation
