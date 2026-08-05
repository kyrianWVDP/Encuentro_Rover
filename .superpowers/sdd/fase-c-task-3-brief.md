### Task 3: Sync layer (TDD)

**Files:**
- Create: `src/game/sync.ts`, `src/game/sync.test.ts`

**Interfaces:**
- `STORAGE_KEY = "justas-game-v1"`
- `CHANNEL_NAME = "justas-del-saber"`
- `serializeGameState(state) / parseGameState(raw): GameState | null`
- `loadGameState(): GameState | null`
- `saveGameState(state): void`
- `publishGameState(state): void` // save + broadcast
- `subscribeGameState(cb: (s: GameState) => void): () => void` // channel + storage

**Tests:** round-trip JSON; parse invalid → null. Mock `localStorage` in vitest (`environment` puede seguir `node` con mock manual, o `jsdom` solo para este archivo).

Si Vitest está en `environment: "node"`, mock:

```ts
const store = new Map<string, string>();
globalThis.localStorage = {
  getItem: (k) => store.get(k) ?? null,
  setItem: (k, v) => { store.set(k, v); },
  removeItem: (k) => { store.delete(k); },
  clear: () => store.clear(),
  key: () => null,
  length: 0,
};
```

- [ ] Implement + tests PASS
- [ ] Commit (si aplica): `feat: add BroadcastChannel and localStorage game sync`

---

