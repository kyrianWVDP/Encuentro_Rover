### Task 3 Report: Hook + PublicScreen + Host mute

**Status:** Complete

**Files changed:**
- `app/src/ui/useGameSounds.ts` (new) — `useGameSounds(state)` hook per brief spec: tracks previous `GameState` via `useRef`, diffs on each render with `soundsForTransition`, calls `playSound` for each resulting event. No-op on first mount (no `prev`).
- `app/src/ui/PublicScreen.tsx` — calls `useGameSounds(gameState)`; added `onClick={handleFirstInteraction}` on the root `<main>` which calls `unlockAudio()` once (guarded by a `useRef` flag) on the first click anywhere on the projector screen.
- `app/src/ui/HostScreen.tsx` — added `muted` state initialized from `isMuted()`; toggle button in the header (`Silenciar sonidos` / `Activar sonidos`) calling `setMuted(!muted)` + local state update; added the same first-click `unlockAudio()` guard on the root `<main>` (covers same-machine testing without a public tab gesture). Host does **not** call `playSound` anywhere — confirmed by grep.
- `app/src/ui/HostScreen.css` — added `.mute-toggle-btn` style matching the existing `.public-link` header button look.

**Design notes:**
- Followed the brief's `useGameSounds` implementation verbatim (no deviation).
- Did not add a `storage` event listener on `PublicScreen` — per brief's own note, `isMuted()` already re-reads `localStorage` on every `playSound` call, so a same-origin mute toggle from the host tab takes effect on the very next event without extra wiring.
- `unlockAudio()` guarded with a ref instead of calling on every click, avoiding repeated silent-audio playback attempts.

**Test summary:** `cd app && npm test` → 15 test files, 77 tests, all passed (0 failures). No lint errors on the three touched files (`ReadLints`).

**Manual check:** Not run (no interactive browser session in this environment). Recommend the operator do the `npm run dev` walkthrough from the brief (spin → judge → BEGIN_FINALE → mute-on-host-silences-public) before the live event.

**Concerns:** None blocking. Manual browser verification of audio playback/mute propagation across tabs is still pending and should be done once before the actual event since sound autoplay/gesture-unlock behavior can be browser-specific.

**Commit:** `feat: play show sounds on public screen with host mute` — see git log for hash.
