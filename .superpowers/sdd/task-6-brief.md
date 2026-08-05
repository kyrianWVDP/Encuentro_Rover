### Task 6: `TurnScreen` + wire `App`

**Files:**
- Create: `src/ui/TurnScreen.tsx`
- Modify: `src/App.tsx`
- Modify: `src/App.css` (layout proyector: tipografía grande, botones host abajo)

**Interfaces:**
- Consumes: `turnReducer`, `initialGameState`, `CLANS`, `QUESTIONS`, `SPIN_DURATION_MS`
- Produces: flujo completo alcance B

- [ ] **Step 1: Implement `TurnScreen`**

```tsx
// Pseudocode structure
function TurnScreen() {
  const [state, dispatch] = useReducer(turnReducer, initialGameState());

  useEffect(() => {
    if (state.turn.phase !== "spinning") return;
    const t = window.setTimeout(() => {
      dispatch({ type: "SPIN_FINISHED" });
    }, SPIN_DURATION_MS);
    return () => clearTimeout(t);
  }, [state.turn.phase, state.rotationDeg]);

  const pendingCount = getPendingClans(CLANS, state.round.playedClanIds).length;
  const selectedClan = CLANS.find((c) => c.id === state.turn.selectedClanId);
  const selectedQuestion = QUESTIONS.find(
    (q) => q.id === state.turn.selectedQuestionId,
  );

  return (
    // header: Encuentro Rover 2026 / Justas del Saber
    // Ronda N · pendientes
    // <RouletteWheel ... />
    // phase question: show selectedQuestion.texto only
    // buttons:
    //   idle: Girar
    //   clanRevealed: Volver a girar | Mostrar pregunta
    //   question: Siguiente turno
  );
}
```

- [ ] **Step 2: `App.tsx` solo renderiza `<TurnScreen />`**

- [ ] **Step 3: Manual checklist**

1. Girar → anima → revela clan  
2. Volver a girar → otro/mismo posible; tabla de jugados intacta  
3. Mostrar pregunta → texto; sin respuesta  
4. Siguiente turno → clan queda dimmed  
5. Tras 8 → ronda 2, todos activos  

- [ ] **Step 4: Run unit tests + build**

```bash
npm test
npm run build
```

Expected: all PASS, build OK

- [ ] **Step 5: Commit (si aplica)**

```bash
git add src
git commit -m "feat: wire turn screen flow for clan roulette and questions"
```

---

