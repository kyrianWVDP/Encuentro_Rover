# Final review fix report (25 años CVDG)

## Changes

1. **`app/index.html`** — `<title>` set to `25 años CVDG` (committed title only; local self-hosted fonts hunk left unstaged).
2. **`app/src/ui/SetupScreen.tsx`** — `KNOWN_LOGOS` replaced with seven `/people/*.jpg` portraits; option labels strip `/people/`.
3. **Question id 7** — Full answer in `app/src/game/questions.ts` and `app/public/questions-revisadas.json`; post-parse override in `scripts/import-justas-pdf.py`.
4. **`app/src/ui/PublicScreen.tsx`** — Removed perpetual `requestAnimationFrame` / `now` state; schedule `STOP_TIMER` via `setTimeout` when `endsAt` is reached.

## Commands

### `npx tsc --noEmit` (from `app/`)

Pass (exit 0). No errors or warnings printed.

### `npm test` (from `app/`)

```
Test Files  16 passed (16)
Tests  91 passed (91)
```

Pass (exit 0).
