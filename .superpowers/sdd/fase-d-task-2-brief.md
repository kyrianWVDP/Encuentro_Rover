### Task 2: Wire game to EventConfig

**Files:**
- Modify: `src/game/turnReducer.ts` — `initialGameStateFromConfig(config)`, use `config.maxRounds` / clans length; accept clans list for pick/pending (pass via closure or store `clanIds` on state)
- Modify: HostScreen / PublicScreen — `loadEventConfig()`; questions from `getActiveQuestions`; pass clans to wheel/table
- Keep `CLANS` export as deprecated alias: `export const CLANS = defaultEventConfig().clans.map(...)` for tests OR update tests to use config

**Recommended GameState addition:**

```ts
// optional: snapshot clan ids at game start
clanIds: string[];
timerSec: number;
titulo: string;
```

Or read config live on each render (simpler for D): screens call `loadEventConfig()` and pass into reducer actions that need clan list.

**Cleaner for D:**  
`turnReducer` functions that need clans take them from a module-level `getRuntimeClans(): ClanConfig[]` set by `setRuntimeConfig(config)` when screens mount / setup saves — **avoid**. Prefer:

```ts
export function initialGameStateFromConfig(config: EventConfig): GameState {
  return {
    ...initialGameState(config.clans.map(c => c.id)),
    maxRounds: config.maxRounds,
    // store timerSec on state
    timerSec: config.timerSec,
  };
}
```

Add `timerSec` to `GameState`; `START_QUESTION` / `RESTART_TIMER` use `state.timerSec` instead of hardcoded 60.

For `pickClan` / `getPendingClans`, HostScreen passes clans from config into helpers already using `CLANS` — **change call sites** to `config.clans` mapped to `{id,nombre}`.

- [ ] Update `spinToClan` etc. to accept `clans: {id,nombre}[]` parameter via action context or read from `loadEventConfig()` inside reducer (acceptable for offline single-notebook app):

```ts
function activeClans() {
  return loadEventConfig().clans;
}
```

Use that instead of `CLANS` inside reducer. Update tests to `saveEventConfig(defaultEventConfig())` in beforeEach.

- [ ] `npm test` green
- [ ] Commit (si aplica): `feat: drive game clans and timer from event config`

---

