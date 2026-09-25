# Task 4 Report: One screen

**Status:** DONE  
**Commit:** `dec6e09` — feat: play the quiz on one screen  
**HEAD before start:** `34cb25b`

## What was done

1. **Host controls on `PublicScreen`**
   - `PublicScreen` now owns dispatch + `publishGameState` (same actions as HostScreen).
   - Added spin-finished and timer-expiry effects so the show advances without `/host`.
   - Host bar by phase (spec §3 labels):
     - idle → Girar (disabled when roster &lt; 2)
     - clanRevealed → Volver a girar, Empezar pregunta
     - questionRunning → Parar timer, Reiniciar timer, Anular y girar, Correcto, Incorrecto
     - awaitingJudgement → Reiniciar timer, Anular y girar, Correcto, Incorrecto
     - revealAnswer → Continuar
     - showScores → Siguiente
     - regularComplete → Continuar (`BEGIN_FINALE`)
   - Confirm modal still gates Correcto/Incorrecto before `CONFIRM_JUDGE`.
   - `question.respuestaCorrecta` renders only when `phase === "revealAnswer"` (not on showScores).

2. **Eyebrow / persona copy**
   - Removed “Encuentro Nacional de Rovers · 2026”; title is `config.titulo`.
   - Removed representante line from the reveal caption.
   - Setup: “Nueva persona”, alerts/section say persona, nav goes to `/` as “Ir al juego”.

3. **`/host` redirect**
   - `App.tsx`: `/host` → `<Navigate to="/" replace />`; HostScreen import removed (file left unused).

4. **Styles**
   - Host bar + error banner styles in `PublicScreen.css`.

## Files committed

| Path | Change |
|------|--------|
| `app/src/ui/PublicScreen.tsx` | Dispatch, host bar, confirm modal, answer gate, no eyebrow |
| `app/src/ui/PublicScreen.css` | Host bar / error banner |
| `app/src/App.tsx` | `/host` redirects to `/` |
| `app/src/ui/SetupScreen.tsx` | Persona labels; navigate to `/` after reset |

## Tests

```
Test Files  16 passed (16)
Tests       91 passed (91)
```

`npx tsc --noEmit`: exit 0

Commands run from `app/`.

## Concerns

None.

---

## Review fix: ScoreTable column header "Persona"

**Finding:** ScoreTable still rendered column header "Clan" on showScores / final podium. Spec requires audience-visible words to say persona, not clan.

**What changed:**
- `app/src/ui/ScoreTable.tsx`: `<th>Clan</th>` → `<th>Persona</th>`
- Checked PublicScreen, FinalScreen, SetupScreen: no other audience-visible "Clan"/"clan" labels remained (Setup already uses "Personas" / "persona"; internal types/vars left unchanged).

**Commands:**

```
cd app
npx tsc --noEmit
# TSC_EXIT=0

npm test
# Test Files  16 passed (16)
# Tests       91 passed (91)
```

No component test asserts the header word; full suite re-run for safety.
