### Task 6: PublicScreen

**Files:**
- Create: `src/ui/PublicScreen.tsx`
- Reuse: `RouletteWheel`, `ScoreTable`, `TimerDisplay`

**Behavior:**
- `useState` hidratado con `loadGameState() ?? initialGameState()`
- `useEffect` → `subscribeGameState(setState)`
- Render por `phase` según spec §3 columna Público
- Usar `canShowAnswer` antes de mostrar `respuestaCorrecta`
- Link opcional discreto a `/host`

- [ ] Implement
- [ ] Build PASS
- [ ] Commit (si aplica): `feat: add public projector screen`

---

