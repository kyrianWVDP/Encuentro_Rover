### Task 3: Questions + round helpers (TDD)

**Files:**
- Create: `src/game/questions.ts`
- Create: `src/game/round.ts`
- Test: `src/game/questions.test.ts`, `src/game/round.test.ts`

**Interfaces:**
- Consumes: `Clan`, `Question`, `RoundState`, `Rng`
- Produces:
  - `QUESTIONS: Question[]` (mínimo 12 fixtures para demos)
  - `pickRandomUnused(usedIds: number[], questions: Question[], rng: Rng): Question`
  - `getPendingClans(clans: Clan[], playedClanIds: string[]): Clan[]`
  - `markClanPlayed(state: RoundState, clanId: string): RoundState`
  - `advanceRoundIfComplete(state: RoundState, clanCount: number): RoundState`

- [ ] **Step 1: Write failing tests**

`src/game/questions.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { QUESTIONS, pickRandomUnused } from "./questions";

describe("pickRandomUnused", () => {
  it("never returns a used id", () => {
    const used = [QUESTIONS[0].id, QUESTIONS[1].id];
    const q = pickRandomUnused(used, QUESTIONS, () => 0);
    expect(used).not.toContain(q.id);
  });

  it("throws when none left", () => {
    const used = QUESTIONS.map((q) => q.id);
    expect(() => pickRandomUnused(used, QUESTIONS, () => 0)).toThrow();
  });
});
```

`src/game/round.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { CLANS } from "./clans";
import {
  advanceRoundIfComplete,
  getPendingClans,
  markClanPlayed,
} from "./round";
import type { RoundState } from "./types";

const empty: RoundState = {
  roundNumber: 1,
  playedClanIds: [],
  usedQuestionIds: [],
};

describe("round", () => {
  it("lists pending excluding played", () => {
    const state = markClanPlayed(empty, CLANS[0].id);
    const pending = getPendingClans(CLANS, state.playedClanIds);
    expect(pending).toHaveLength(7);
    expect(pending.map((c) => c.id)).not.toContain(CLANS[0].id);
  });

  it("advances round after all clans played", () => {
    let state = empty;
    for (const clan of CLANS) {
      state = markClanPlayed(state, clan.id);
      state = advanceRoundIfComplete(state, CLANS.length);
    }
    expect(state.roundNumber).toBe(2);
    expect(state.playedClanIds).toEqual([]);
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npm test
```

- [ ] **Step 3: Implement**

`src/game/questions.ts`:

```ts
import type { Question, Rng } from "./types";

export const QUESTIONS: Question[] = [
  {
    id: 1,
    texto: "¿Cuál es el lema de los Rovers?",
    respuestaCorrecta: "Servir.",
  },
  {
    id: 2,
    texto: "¿Cómo se denomina la unidad de la Rama Rover?",
    respuestaCorrecta: "Clan de Rovers.",
  },
  {
    id: 3,
    texto: "¿Qué significa “Ich Dien”?",
    respuestaCorrecta: "Yo sirvo.",
  },
  {
    id: 4,
    texto: "¿Quién escribió Roverismo hacia el éxito?",
    respuestaCorrecta: "Robert Baden-Powell.",
  },
  {
    id: 5,
    texto: "¿Qué significa FEPE?",
    respuestaCorrecta: "Federación Paraguaya de Escultismo.",
  },
  {
    id: 6,
    texto: "¿Cuál es la capital de Paraguay?",
    respuestaCorrecta: "Asunción.",
  },
  {
    id: 7,
    texto: "¿Entre qué edades se aplica el método Rover según Roverismo Práctico?",
    respuestaCorrecta: "Entre los 18 y los 22 años.",
  },
  {
    id: 8,
    texto: "¿Qué es el Consejo de Clan?",
    respuestaCorrecta:
      "Es el organismo de deliberación, participación y decisión del Clan.",
  },
  {
    id: 9,
    texto: "¿Quién fundó el Movimiento Scout?",
    respuestaCorrecta: "Lord Robert Stephenson Smyth Baden-Powell.",
  },
  {
    id: 10,
    texto: "¿Qué color tiene el kepí de los Rovers según el manual?",
    respuestaCorrecta: "Rojo, con la insignia oficial correspondiente.",
  },
  {
    id: 11,
    texto: "¿Dónde se realizó el primer Rover Moot Mundial?",
    respuestaCorrecta: "En Kandersteg, Suiza.",
  },
  {
    id: 12,
    texto: "¿Cuáles son los dos idiomas oficiales de Paraguay?",
    respuestaCorrecta: "Español y guaraní.",
  },
];

export function pickRandomUnused(
  usedIds: number[],
  questions: Question[],
  rng: Rng,
): Question {
  const available = questions.filter((q) => !usedIds.includes(q.id));
  if (available.length === 0) throw new Error("No unused questions left");
  const index = Math.min(
    available.length - 1,
    Math.floor(rng() * available.length),
  );
  return available[index];
}
```

`src/game/round.ts`:

```ts
import type { Clan, RoundState } from "./types";

export function getPendingClans(
  clans: Clan[],
  playedClanIds: string[],
): Clan[] {
  const played = new Set(playedClanIds);
  return clans.filter((c) => !played.has(c.id));
}

export function markClanPlayed(
  state: RoundState,
  clanId: string,
): RoundState {
  if (state.playedClanIds.includes(clanId)) return state;
  return {
    ...state,
    playedClanIds: [...state.playedClanIds, clanId],
  };
}

export function advanceRoundIfComplete(
  state: RoundState,
  clanCount: number,
): RoundState {
  if (state.playedClanIds.length < clanCount) return state;
  return {
    ...state,
    roundNumber: state.roundNumber + 1,
    playedClanIds: [],
  };
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
npm test
```

- [ ] **Step 5: Commit (si aplica)**

```bash
git add src/game
git commit -m "feat: add question pool and round progression helpers"
```

---

