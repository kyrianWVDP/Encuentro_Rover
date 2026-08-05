### Task 7: HostScreen

**Files:**
- Create: `src/ui/HostScreen.tsx`
- Remove or slim: `src/ui/TurnScreen.tsx`

**Behavior:**
- Estado local + al dispatch: `const next = turnReducer(state, action); setState(next); publishGameState(next);`
- Efecto: si `phase===spinning` → timeout `SPIN_FINISHED` + publish
- Efecto: si `timer.running && endsAt && now>=endsAt` → `STOP_TIMER` + publish
- Botones según fase (spec §3)
- Modal cuando `pendingJudgement !== null`
- Mostrar respuesta del banco siempre que haya `selectedQuestionId` y phase ≥ `questionRunning`
- Mini `ScoreTable`
- Si `regularComplete` → mensaje “Fase regular terminada” (sin SPIN)

- [ ] Implement
- [ ] Manual checklist: dos pestañas `/` y `/host` sincronizan
- [ ] `npm test && npm run build`
- [ ] Commit (si aplica): `feat: add host control screen with judgement flow`

---

