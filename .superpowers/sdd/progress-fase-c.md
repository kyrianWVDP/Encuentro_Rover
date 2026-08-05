# SDD Progress Ledger — Fase C

Branch: `feature/ruleta-turno`
Plan: `docs/superpowers/plans/2026-08-05-fase-c-juicio-timer-host.md`

## Complete

- Task 1: e9961a0 (scoring/timer/selectors)
- Task 2: 6d2e3ee (reducer)
- Task 3: bd52506 (sync)
- Task 4: 7246eca (router)
- Task 5: 82585e9 (UI primitives)
- Task 6: 3a28036 (PublicScreen)
- Task 7: 7622c7f (HostScreen)
- Task 8: 857caa3 (docs checklist)
- Final fix: 956cf36 — STOP_TIMER→awaitingJudgement; judge buttons; RESTART/ABORT guards (36 tests)

## Notes / Minor findings (deferred)

- sync payload shape validation / version field
- dead SHOW_QUESTION / NEXT_TURN aliases cleanup
- skip publish when reducer returns same ref
- ScoreTable tiebreak by name
