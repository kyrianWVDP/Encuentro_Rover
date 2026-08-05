### Task 4: `turnReducer` (TDD)

**Files:**
- Create: `src/game/turnReducer.ts`
- Test: `src/game/turnReducer.test.ts`

**Interfaces:**
- Consumes: helpers de Tasks 2–3, `CLANS`, `QUESTIONS`
- Produces:
  - `GameState = { round: RoundState; turn: TurnState; rotationDeg: number }`
  - `initialGameState(): GameState`
  - `type Action =`
    - `{ type: "SPIN"; rng?: Rng }`
    - `{ type: "SPIN_FINISHED" }`
    - `{ type: "RESPIN"; rng?: Rng }`
    - `{ type: "SHOW_QUESTION"; rng?: Rng }`
    - `{ type: "NEXT_TURN" }` // from question → idle (prep next spin)
  - `turnReducer(state: GameState, action: Action): GameState`

**Reglas:**
- `SPIN` / `RESPIN`: solo desde `idle` / `clanRevealed` respectivamente; set `selectedClanId`, `phase: spinning`, update `rotationDeg` con `targetWheelRotationDeg`; **no** tocar `playedClanIds` ni `usedQuestionIds` en RESPIN
- `SPIN_FINISHED`: `spinning` → `clanRevealed`
- `SHOW_QUESTION`: marca clan jugado, pick question, `usedQuestionIds`, `phase: question`; luego `advanceRoundIfComplete`
- `NEXT_TURN`: `question` → `idle`, clear `selectedClanId` / `selectedQuestionId`

- [ ] **Step 1: Write failing tests**

```ts
import { describe, expect, it } from "vitest";
import { CLANS } from "./clans";
import { QUESTIONS } from "./questions";
import { initialGameState, turnReducer } from "./turnReducer";

const rng0 = () => 0;

describe("turnReducer", () => {
  it("SPIN selects a pending clan without marking played", () => {
    const s1 = turnReducer(initialGameState(), { type: "SPIN", rng: rng0 });
    expect(s1.turn.phase).toBe("spinning");
    expect(s1.turn.selectedClanId).toBe(CLANS[0].id);
    expect(s1.round.playedClanIds).toEqual([]);
  });

  it("RESPIN does not consume clan or question", () => {
    let s = turnReducer(initialGameState(), { type: "SPIN", rng: rng0 });
    s = turnReducer(s, { type: "SPIN_FINISHED" });
    const before = structuredClone(s.round);
    s = turnReducer(s, { type: "RESPIN", rng: () => 0.9 });
    expect(s.round).toEqual(before);
    expect(s.turn.phase).toBe("spinning");
  });

  it("SHOW_QUESTION marks clan and uses a question", () => {
    let s = turnReducer(initialGameState(), { type: "SPIN", rng: rng0 });
    s = turnReducer(s, { type: "SPIN_FINISHED" });
    s = turnReducer(s, { type: "SHOW_QUESTION", rng: rng0 });
    expect(s.turn.phase).toBe("question");
    expect(s.round.playedClanIds).toContain(CLANS[0].id);
    expect(s.round.usedQuestionIds).toContain(QUESTIONS[0].id);
  });

  it("advances round after 8 SHOW_QUESTION cycles", () => {
    let s = initialGameState();
    for (let i = 0; i < 8; i++) {
      s = turnReducer(s, { type: "SPIN", rng: () => 0 });
      s = turnReducer(s, { type: "SPIN_FINISHED" });
      s = turnReducer(s, { type: "SHOW_QUESTION", rng: () => 0 });
      s = turnReducer(s, { type: "NEXT_TURN" });
    }
    expect(s.round.roundNumber).toBe(2);
    expect(s.round.playedClanIds).toEqual([]);
  });
});
```

- [ ] **Step 2: Run — FAIL**

```bash
npm test
```

- [ ] **Step 3: Implement `turnReducer.ts`**

Implement according to Interfaces above. Default `rng` = `Math.random` when omitted. Ignore illegal actions (return same state) rather than throw, except empty pending/questions on SHOW_QUESTION/SPIN where host messaging will read an optional `error` field — keep it simple: throw only in pure helpers; reducer catches and sets `state.error: string | null` if desired.

Minimal `GameState`:

```ts
export type GameState = {
  round: RoundState;
  turn: TurnState;
  rotationDeg: number;
  error: string | null;
};
```

- [ ] **Step 4: Run — PASS**

```bash
npm test
```

- [ ] **Step 5: Commit (si aplica)**

```bash
git add src/game/turnReducer.ts src/game/turnReducer.test.ts
git commit -m "feat: add turn state machine reducer"
```

---

