# Task 1 Report: Scaffold Vite + Vitest

## Status

**DONE**

## Summary

Scaffolded a Vite React TypeScript app under `app/` (repo root is non-empty). Configured Vitest per task brief. Verified `npm test` and `npm run build` from `app/`.

## Implementation Details

### Step 1: Create Vite React-TS app

Root scaffold was skipped because the repo already contains `docs/`, `.specstory/`, etc.

```bash
npx create-vite@latest app --template react-ts
```

All plan `src/` paths live under `app/src/`.

### Step 2: Install test dependencies

```bash
cd app
npm install
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom
```

### Step 3: Vitest configuration

`app/vite.config.ts` matches the task spec:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
```

`app/package.json` scripts:

| Script | Command |
|--------|---------|
| dev | vite |
| build | tsc -b && vite build |
| preview | vite preview |
| test | vitest run --passWithNoTests |
| test:watch | vitest |

### Step 4: Verification

Run from `app/`:

```text
npm test   → exit 0, "No test files found, exiting with code 0"
npm run build → exit 0, dist/ produced
```

## Commit

| SHA | Subject |
|-----|---------|
| 22306d8 | chore: scaffold Vite React TypeScript with Vitest |

Files committed: `app/package.json`, `app/package-lock.json`, `app/vite.config.ts`, `app/tsconfig*.json`, `app/index.html`, `app/src/`, `app/public/`, `app/.gitignore`.

## Self-Review

### Matches spec

- React-TS Vite scaffold with `src/main.tsx`, `index.html`, `vite.config.ts`, `tsconfig.json`
- Vitest devDependencies installed
- Vitest block in `vite.config.ts` uses `environment: "node"` and `include: ["src/**/*.test.ts"]`
- `npm run dev`, `npm test`, `npm run build` all functional from `app/`
- `docs/` and other root files untouched

### Deviations / notes

1. **`app/` subfolder** — Required because root is non-empty; aligns with task fallback and user context.
2. **`--passWithNoTests` on test script** — Vitest 4 exits code 1 with zero test files; flag added so empty suite passes verification. Brief expected "tests vacíos OK".
3. **`tsconfig.node.json` types** — Added `"vitest/config"` so `tsc -b` recognizes the `test` key in `vite.config.ts`.
4. **Removed Vite default `lint` script** — Task spec scripts block does not include it.
5. **Testing libs not wired yet** — `jsdom`, `@testing-library/react`, `@testing-library/jest-dom` are installed but unused until Task 2+ adds component tests.

### Not committed (intentionally)

- `app/README.md`, `app/.oxlintrc.json` — Vite template extras, not in task file list
- `app/node_modules/`, `app/dist/` — gitignored

## Concerns

None blocking. Future tasks should run npm commands from `app/` or add a root-level wrapper if desired.

## Next Task Handoff

- App root: `app/`
- Source: `app/src/`
- Test pattern: `app/src/**/*.test.ts`
- Test env: `node` (switch to `jsdom` when adding React component tests)
