# UI polish — tabla de puntajes, podio, fondo, ruleta

**Date:** 2026-08-07  
**Status:** approved (approach 1 — CSS + React ligero, sin dependencias nuevas)

## Goals

1. When the score table appears (`showScores`), animate as an “update board”: staggered row cascade + count-up on the highlighted clan.
2. Final podium: Olympic-style steps (order 2 | 1 | 3) with gold / silver / bronze; confetti on mount.
3. Background image clearer (less dark overlay) on projector (and host if same asset).
4. Roulette larger on projector only; host keeps compact size.

## Non-goals

- No new npm packages (`canvas-confetti`, Framer Motion, GSAP).
- No changes to game reducer / scoring rules.
- Host score sidebar need not run the full projector cascade (optional light flash only if trivial).

## Design

### Score table animation (option C)

- **Trigger:** mount / enter `showScores` on projector `ScoreTable` (`size="projector"`).
- **Cascade:** each `<tr>` fades/slides in with stagger ~80ms (`animation-delay: index * 80ms`).
- **Count-up:** for `highlightClanId`, animate displayed points from previous score to current over ~800–1200ms (`requestAnimationFrame`). Previous score = `current - 10` if last judgement was correct and highlight matches, else skip count-up and only flash. Prefer passing `fromScore` / `animateFrom` prop when easy; otherwise derive from highlight + `lastJudgement` on public screen.
- **Flash:** keep / strengthen existing highlight flash on that row.
- Host compact table: no cascade required.

### Olympic podium + confetti

- Restyle `.podium-step` heights clearly stepped (e.g. 2nd ~140px, 1st ~200px, 3rd ~100px), metal gradients (oro/plata/bronce), slight 3D bevel.
- Order remains visual left→right: 2, 1, 3 (`align-items: flex-end`).
- On `FinalScreen` mount: lightweight canvas confetti (~3–4s burst), pure CSS/JS in-repo (small helper component). Respect mute? Visual only — always play confetti (no audio).
- Theme FinalScreen title/colors to match medieval projector palette (avoid plain `#2c3e50` clash).

### Clearer background

- Reduce dark overlay opacity on `.public-screen` (and `.host-screen` if shared), e.g. from ~0.72 toward ~0.45–0.55 so `encuentro-fondo.jpg` reads brighter.
- Keep text readable (do not remove overlay entirely).

### Larger projector roulette

- Add size variant to `RouletteWheel` (e.g. `size="projector" | "default"`) or CSS modifier on public idle/spin phases.
- Projector: container ~480–520px; scale sector logos accordingly.
- Host / default: keep ~320px.

## Files likely touched

- `app/src/ui/ScoreTable.tsx` + `ScoreTable.css`
- `app/src/ui/PublicScreen.tsx` (+ css) — pass animation props, overlay, roulette size
- `app/src/ui/FinalScreen.tsx` + `FinalScreen.css` (+ optional `Confetti.tsx`)
- `app/src/ui/RouletteWheel.tsx` + `RouletteWheel.css`
- `app/src/ui/HostScreen.css` — background clarity only

## Acceptance

- [ ] Entering score table on projector: rows cascade; highlighted clan count-up + flash.
- [ ] Final screen: stepped olympic podium + confetti burst.
- [ ] Background visibly brighter; UI still readable.
- [ ] Projector roulette clearly larger than host; host unchanged size.
- [ ] No new dependencies; existing tests still pass.
