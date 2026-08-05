### Task 1: Types + scoring + timer + selectors (TDD)

**Files:**
- Modify: `src/game/types.ts`
- Create: `src/game/scoring.ts`, `src/game/timer.ts`, `src/game/selectors.ts`
- Test: `src/game/scoring.test.ts`, `src/game/timer.test.ts`, `src/game/selectors.test.ts`

**Interfaces:**
- Consumes: `Clan` ids via `CLANS` for `initialScores`
- Produces:
  - `Judgement = "correct" | "incorrect"`
  - `TimerState`, `TurnPhase` extendido (incl. `questionRunning` | `awaitingJudgement` | `revealAnswer` | `showScores`; **eliminar** fase `"question"`)
  - `applyJudgement(scores, clanId, judgement): Record<string, number>`
  - `initialScores(clanIds: string[]): Record<string, number>`
  - `startTimer(durationSec, nowMs): TimerState`
  - `stopTimer(timer, nowMs): TimerState`
  - `restartTimer(durationSec, nowMs): TimerState`
  - `remainingFromEndsAt(endsAt, nowMs): number`
  - `canShowAnswer(phase: TurnPhase): boolean`
  - `POINTS_CORRECT = 10`

- [ ] **Step 1: Write failing tests**

```ts
// scoring.test.ts
import { describe, expect, it } from "vitest";
import { applyJudgement, initialScores } from "./scoring";

describe("scoring", () => {
  it("initializes zeros", () => {
    expect(initialScores(["a", "b"])).toEqual({ a: 0, b: 0 });
  });
  it("adds 10 on correct", () => {
    expect(applyJudgement({ a: 0 }, "a", "correct").a).toBe(10);
  });
  it("adds 0 on incorrect", () => {
    expect(applyJudgement({ a: 5 }, "a", "incorrect").a).toBe(5);
  });
});
```

```ts
// timer.test.ts
import { describe, expect, it } from "vitest";
import { remainingFromEndsAt, restartTimer, startTimer, stopTimer } from "./timer";

describe("timer", () => {
  it("startTimer sets endsAt ~ now+duration", () => {
    const t = startTimer(60, 1_000_000);
    expect(t.running).toBe(true);
    expect(t.endsAt).toBe(1_000_000 + 60_000);
    expect(t.remainingMs).toBe(60_000);
  });
  it("stopTimer freezes remaining", () => {
    const t = stopTimer(startTimer(60, 0), 10_000);
    expect(t.running).toBe(false);
    expect(t.remainingMs).toBe(50_000);
    expect(t.endsAt).toBeNull();
  });
  it("restartTimer resets to full duration", () => {
    const t = restartTimer(60, 5_000);
    expect(t.endsAt).toBe(5_000 + 60_000);
  });
  it("remainingFromEndsAt floors at 0", () => {
    expect(remainingFromEndsAt(100, 200)).toBe(0);
  });
});
```

```ts
// selectors.test.ts
import { describe, expect, it } from "vitest";
import { canShowAnswer } from "./selectors";

describe("canShowAnswer", () => {
  it("false until revealAnswer", () => {
    expect(canShowAnswer("questionRunning")).toBe(false);
    expect(canShowAnswer("awaitingJudgement")).toBe(false);
    expect(canShowAnswer("revealAnswer")).toBe(true);
    expect(canShowAnswer("showScores")).toBe(true);
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
cd app && npm test
```

- [ ] **Step 3: Implement types + modules**

Update `types.ts` phases; implement scoring/timer/selectors as above.

- [ ] **Step 4: Run — PASS** (pueden fallar tests de turnReducer por fase `question` — se arreglan en Task 2; si hace falta, marcar temporalmente o actualizar en la misma sesión antes de commit)

- [ ] **Step 5: Commit (si aplica)**

```bash
git add app/src/game
git commit -m "feat: add scoring, timer, and answer visibility helpers"
```

---

