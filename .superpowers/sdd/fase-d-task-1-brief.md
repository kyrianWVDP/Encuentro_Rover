### Task 1: eventConfig + clanDisplay + questionImport (TDD)

**Files:**
- Create: `src/game/eventConfig.ts`, `clanDisplay.ts`, `questionImport.ts` + tests
- Modify: `src/game/types.ts` si hace falta exportar `ClanConfig` / `EventConfig`

**Interfaces:**

```ts
export type ClanConfig = {
  id: string;
  nombre: string;
  representante: string;
  logoUrl: string | null;
  color?: string;
};

export type EventConfig = {
  version: 1;
  titulo: string;
  maxRounds: number;
  timerSec: number;
  clans: ClanConfig[];
  questions: Question[] | null;
};

export const EVENT_STORAGE_KEY = "justas-event-v1";

export function defaultEventConfig(): EventConfig;
export function loadEventConfig(): EventConfig;
export function saveEventConfig(config: EventConfig): void;
export function getClans(config: EventConfig): ClanConfig[];
export function getActiveQuestions(config: EventConfig, embedded: Question[]): Question[];
export function clanInitials(nombre: string): string; // 1–3 letras
export function parseQuestionsJson(text: string): Question[];
export function parseQuestionsCsv(text: string): Question[]; // header: id,texto,respuestaCorrecta
```

`defaultEventConfig` clanes (ids alineados a logos + reducer):

| id | nombre | logoUrl |
|----|--------|---------|
| guardia-dragones | V Guardia de Dragones | /logos/guardia-dragones.png |
| humaita-ps15 | Humaita PS15 | /logos/humaita-ps15.png |
| chaco-boreal | Chaco Boreal | /logos/chaco-boreal.png |
| orden-san-jorge | La Orden de San Jorge | /logos/orden-san-jorge.png |
| kurusu-peregrino | Kurusu Peregrino | /logos/kurusu-peregrino.png |
| humaita-cf1 | Humaita CF1 | /logos/humaita-cf1.png |
| san-jorge-capadocia | San Jorge de Capadocia | /logos/san-jorge-capadocia.png |
| yvy-pyta | Yvy Pytã | /logos/yvy-pyta.png |

`representante: ""` en todos.

- [ ] **Step 1: Write failing tests** (round-trip, default 8 logos, getActiveQuestions null→embedded, initials, parse json/csv)
- [ ] **Step 2: FAIL → implement → PASS**
- [ ] **Step 3: Commit (si aplica)** `feat: add event config, clan initials, and question import`

---

