### Task 2: Ampliar `turnReducer` / `GameState` (TDD)

**Files:**
- Modify: `src/game/turnReducer.ts`, `src/game/turnReducer.test.ts`, `src/game/types.ts` si `GameState` vive ahí
- Optionally rename exports but keep `turnReducer` name for less churn

**Interfaces:**
- Consumes: Task 1 helpers, B helpers (`pickClan`, `pickRandomUnused`, `markClanPlayed`, `advanceRoundIfComplete`)
- Produces: `GameState` con `scores`, `timer`, `lastJudgement`, `pendingJudgement`, `maxRounds: 10`
- Actions: las de B **más**  
  `START_QUESTION` (reemplaza efecto de `SHOW_QUESTION`),  
  `STOP_TIMER`, `RESTART_TIMER`, `ABORT_TURN_RESPIN`,  
  `REQUEST_JUDGE`, `CANCEL_JUDGE`, `CONFIRM_JUDGE`,  
  `ACK_REVEAL`, `ACK_SCORES`  
- Mantener alias `SHOW_QUESTION` → mismo que `START_QUESTION` **o** actualizar todos los call sites (preferir renombrar a `START_QUESTION` y migrar tests/UI)

**Reglas clave:**
- `START_QUESTION`: desde `clanRevealed`; pick question; append used; `phase=questionRunning`; `timer=startTimer(60, now)` (inyectar `nowMs` en action opcional para tests)
- `CONFIRM_JUDGE`: requiere `pendingJudgement`; `applyJudgement`; `markClanPlayed`; `advanceRoundIfComplete`; `phase=revealAnswer`; clear pending
- `ABORT_TURN_RESPIN`: quitar `selectedQuestionId` de `usedQuestionIds` si estaba; clear selection; `spinToClan` sin marcar played
- `ACK_SCORES`: si `roundNumber > maxRounds` tras advance, set flag o phase idle con `error`/`regularFinished` — mínimo: no permitir SPIN y set `error` o `turn.phase` stay + `regularComplete: true` en state. Spec: mensaje fin. Añadir `regularComplete: boolean` al state.

- [ ] **Step 1: Write/extend failing tests** covering spec §8 items 1–4

```ts
it("CONFIRM_JUDGE correct adds 10", () => { /* spin→finish→startQ→request→confirm */ });
it("REQUEST_JUDGE alone does not change scores", () => { /* ... */ });
it("RESTART_TIMER sets endsAt ~60s ahead", () => { /* action.nowMs */ });
it("ABORT_TURN_RESPIN restores question to unused", () => { /* ... */ });
```

Inject `nowMs` / `rng` on actions for determinism:

```ts
| { type: "START_QUESTION"; rng?: Rng; nowMs?: number }
| { type: "RESTART_TIMER"; nowMs?: number }
| { type: "STOP_TIMER"; nowMs?: number }
```

- [ ] **Step 2: FAIL → implement → PASS**

- [ ] **Step 3: Update existing B tests** that used phase `"question"` / `SHOW_QUESTION` / `NEXT_TURN` to new flow (`START_QUESTION` → … → `ACK_SCORES`)

- [ ] **Step 4: `npm test` all green**

- [ ] **Step 5: Commit (si aplica)**

```bash
git commit -m "feat: extend game reducer for judgement, timer, and scores"
```

---

