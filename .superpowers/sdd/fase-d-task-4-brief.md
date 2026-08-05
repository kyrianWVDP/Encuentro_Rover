### Task 4: SetupScreen + route

**Files:**
- Create: `src/ui/SetupScreen.tsx` (+ CSS)
- Modify: `src/App.tsx` — `<Route path="/setup" element={<SetupScreen />} />`
- Links from Host/Public to `/setup`

**SetupScreen behavior:**
- Load config into React state
- Edit titulo, maxRounds, timerSec → Guardar → `saveEventConfig`
- Clan rows: edit fields; logo select = list of known paths + option “Sin logo (iniciales)” (`logoUrl: null`)
- Agregar clan: `id = slug(nombre) + short random`; `logoUrl: null`
- Eliminar clan (min 2 warning)
- Import file → parse → set `questions`; Volver a embebido → `questions: null`
- Reiniciar partida: confirm → `publishGameState(initialGameStateFromConfig(loadEventConfig()))`
- Si <2 clanes, banner de error

- [ ] Implement
- [ ] `npm test && npm run build`
- [ ] Commit (si aplica): `feat: add /setup screen for event configuration`

---

