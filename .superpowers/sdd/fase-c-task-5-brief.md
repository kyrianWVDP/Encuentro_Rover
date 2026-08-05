### Task 5: UI primitives — ScoreTable, ConfirmModal, TimerDisplay

**Files:**
- Create: `src/ui/ScoreTable.tsx`, `ConfirmModal.tsx`, `TimerDisplay.tsx`
- Styles in `App.css` or co-located CSS

**Props:**

```ts
// ScoreTable
{ scores: Record<string, number>; clans: Clan[]; highlightClanId?: string | null }

// ConfirmModal
{ open: boolean; title: string; message: string; onConfirm: () => void; onCancel: () => void }

// TimerDisplay
{ endsAt: number | null; running: boolean; remainingMs: number; // prefer computing from endsAt when running
  size?: "hero" | "compact" }
```

`TimerDisplay` usa `requestAnimationFrame` o `setInterval(100)` local para re-render; **no** despacha reducer.

- [ ] Implement + smoke build
- [ ] Commit (si aplica): `feat: add score table, confirm modal, and timer display`

---

