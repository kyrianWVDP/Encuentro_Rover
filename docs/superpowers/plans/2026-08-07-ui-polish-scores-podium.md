# UI Polish (Scores / Podium / Background / Roulette) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Projector score table animates (cascade + count-up), final podium looks Olympic with confetti, backgrounds are clearer, projector roulette is larger — all without new npm dependencies.

**Architecture:** CSS keyframes for cascade/podium; small React hooks/components for count-up and canvas confetti; `RouletteWheel` gains a `size` prop; overlay opacity tweaks in public/host CSS.

**Tech Stack:** React 19, Vite, TypeScript, CSS (no animation libraries).

## Global Constraints

- No new npm packages
- No game reducer / scoring rule changes
- Host roulette stays ~320px; projector ~500px
- Confetti is visual-only (ignore mute)
- Spec: `docs/superpowers/specs/2026-08-07-ui-polish-scores-podium.md`

## File map

| File | Role |
|------|------|
| `app/src/ui/ScoreTable.tsx` + `.css` | Cascade rows; count-up cell; `animate` / `fromScores` props |
| `app/src/ui/PublicScreen.tsx` | Pass animation props + `size="projector"` on roulette |
| `app/src/ui/PublicScreen.css` | Lighter overlay |
| `app/src/ui/HostScreen.css` | Lighter overlay |
| `app/src/ui/RouletteWheel.tsx` + `.css` | `size: "default" \| "projector"` |
| `app/src/ui/FinalScreen.tsx` + `.css` | Olympic steps + theme |
| `app/src/ui/ConfettiBurst.tsx` | Canvas confetti helper (new) |

---

### Task 1: Clearer background + larger projector roulette

**Files:**
- Modify: `app/src/ui/PublicScreen.css`
- Modify: `app/src/ui/HostScreen.css`
- Modify: `app/src/ui/RouletteWheel.tsx`
- Modify: `app/src/ui/RouletteWheel.css`
- Modify: `app/src/ui/PublicScreen.tsx`

**Interfaces:**
- Produces: `RouletteWheelProps.size?: "default" | "projector"` (default `"default"`)

- [ ] **Step 1: Lighten overlays**

In `PublicScreen.css`, change `.public-screen::before` background from `rgba(10, 12, 16, 0.72)` to `rgba(10, 12, 16, 0.48)`.

In `HostScreen.css`, change `.host-screen::before` gradient alphas roughly:
- `0.82` → `0.55`
- `0.78` → `0.52`
- `0.88` → `0.60`

- [ ] **Step 2: Add roulette size prop**

Update `RouletteWheel.tsx`:

```tsx
type RouletteWheelProps = {
  clans: Clan[];
  playedClanIds: string[];
  rotationDeg: number;
  spinning: boolean;
  selectedClanId: string | null;
  durationMs?: number;
  size?: "default" | "projector";
};

export const RouletteWheel: React.FC<RouletteWheelProps> = ({
  // ...existing
  size = "default",
}) => {
  const sectorDegrees = 360 / clans.length;
  const isProjector = size === "projector";
  const logoSize = isProjector ? 72 : 48;
  const translateY = isProjector ? -175 : -110;

  return (
    <div className={`roulette-container${isProjector ? " roulette-container--projector" : ""}`}>
      {/* same structure; use logoSize and translateY */}
    </div>
  );
};
```

In `RouletteWheel.css` add:

```css
.roulette-container--projector {
  width: 500px;
  height: 500px;
  margin: 1.5rem auto;
}

.roulette-container--projector .roulette-pointer {
  border-left-width: 20px;
  border-right-width: 20px;
  border-top-width: 40px;
  top: -28px;
}

.roulette-container--projector .roulette-sector {
  width: 96px;
  height: 96px;
  margin-top: -48px;
  margin-left: -48px;
}
```

- [ ] **Step 3: Pass size on PublicScreen**

On both idle and spinning `RouletteWheel` usages in `PublicScreen.tsx`, add `size="projector"`.

- [ ] **Step 4: Visual check**

Open `/` and `/host`. Projector roulette clearly larger; backgrounds brighter; host roulette still ~320px.

- [ ] **Step 5: Commit** (only if user asked to commit)

```bash
git add app/src/ui/PublicScreen.css app/src/ui/HostScreen.css app/src/ui/RouletteWheel.tsx app/src/ui/RouletteWheel.css app/src/ui/PublicScreen.tsx
git commit -m "style: clearer background and larger projector roulette"
```

---

### Task 2: Score table cascade + count-up

**Files:**
- Modify: `app/src/ui/ScoreTable.tsx`
- Modify: `app/src/ui/ScoreTable.css`
- Modify: `app/src/ui/PublicScreen.tsx`

**Interfaces:**
- Consumes: `POINTS_CORRECT` from `app/src/game/scoring.ts` (= 10)
- Produces: `ScoreTableProps.animate?: boolean`, `ScoreTableProps.fromScores?: Record<string, number>`, `ScoreTableProps.lastJudgement?: "correct" | "incorrect" | null`

- [ ] **Step 1: Add cascade CSS**

Append to `ScoreTable.css`:

```css
.score-scroll--animate .score-table tbody tr {
  opacity: 0;
  animation: score-row-in 0.45s ease-out forwards;
}

@keyframes score-row-in {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.score-scroll--animate .score-cell.is-counting {
  color: #a86410;
  filter: brightness(1.15);
}
```

- [ ] **Step 2: Count-up hook inside ScoreTable**

In `ScoreTable.tsx`, add props and a small `useCountUp` helper:

```tsx
import React, { useEffect, useState } from "react";
import { POINTS_CORRECT } from "../game/scoring";
// ...

type ScoreTableProps = {
  scores: Record<string, number>;
  clans: Clan[];
  highlightClanId?: string | null;
  topN?: number;
  size?: "default" | "projector";
  /** When true (projector showScores), cascade + count-up. */
  animate?: boolean;
  lastJudgement?: "correct" | "incorrect" | null;
};

function useAnimatedScore(
  clanId: string,
  target: number,
  enabled: boolean,
  from: number,
): number {
  const [value, setValue] = useState(enabled ? from : target);
  useEffect(() => {
    if (!enabled || from === target) {
      setValue(target);
      return;
    }
    const start = performance.now();
    const duration = 1000;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) * (1 - t);
      setValue(Math.round(from + (target - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [clanId, target, enabled, from]);
  return value;
}
```

For each visible clan, compute:

```tsx
const target = scores[clan.id] || 0;
const shouldCount =
  Boolean(animate) &&
  clan.id === highlightClanId &&
  lastJudgement === "correct";
const from = shouldCount ? Math.max(0, target - POINTS_CORRECT) : target;
const displayScore = useAnimatedScore(clan.id, target, shouldCount, from);
```

Note: hooks cannot be called inside `.map`. Either:
- extract `ScoreRow` child component that calls `useAnimatedScore`, or
- only animate the highlight clan with one hook at the parent.

**Prefer:** extract `ScoreRow` component in the same file.

Apply class `score-scroll--animate` when `animate` is true; set `style={{ animationDelay: `${index * 80}ms` }}` on each row.

- [ ] **Step 3: Wire PublicScreen showScores**

```tsx
case "showScores":
  return (
    <div className="public-content">
      <ScoreTable
        scores={scores}
        clans={clans}
        highlightClanId={selectedClanId}
        size="projector"
        animate
        lastJudgement={gameState.lastJudgement}
      />
    </div>
  );
```

Destructure `lastJudgement` from `gameState` at top if cleaner.

- [ ] **Step 4: Manual test**

Complete a full round → score table: rows cascade; if last answer correct, highlighted points count up by 10.

- [ ] **Step 5: Commit** (only if user asked)

```bash
git add app/src/ui/ScoreTable.tsx app/src/ui/ScoreTable.css app/src/ui/PublicScreen.tsx
git commit -m "feat: animate projector score table cascade and count-up"
```

---

### Task 3: Olympic podium + confetti

**Files:**
- Create: `app/src/ui/ConfettiBurst.tsx`
- Modify: `app/src/ui/FinalScreen.tsx`
- Modify: `app/src/ui/FinalScreen.css`

**Interfaces:**
- Produces: `function ConfettiBurst(props: { durationMs?: number }): JSX.Element | null`

- [ ] **Step 1: Create ConfettiBurst**

```tsx
import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  w: number;
  h: number;
  rot: number;
  vr: number;
};

const COLORS = ["#f1c40f", "#e74c3c", "#3498db", "#2ecc71", "#e67e22", "#ecf0f1"];

export function ConfettiBurst({ durationMs = 4000 }: { durationMs?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: Particle[] = Array.from({ length: 140 }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.3,
      vx: (Math.random() - 0.5) * 6,
      vy: 2 + Math.random() * 5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      w: 6 + Math.random() * 6,
      h: 8 + Math.random() * 10,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
    }));

    const start = performance.now();
    let raf = 0;
    const frame = (now: number) => {
      const elapsed = now - start;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, 1 - elapsed / durationMs);
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      if (elapsed < durationMs) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [durationMs]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 50,
      }}
    />
  );
}
```

- [ ] **Step 2: Restyle FinalScreen podium (Olympic steps)**

Replace podium CSS in `FinalScreen.css` with stepped metal look, medieval-friendly title colors (cream/gold on dark context). Example heights:

```css
.final-screen h1 {
  font-family: "UnifrakturCook", "Cinzel Decorative", serif;
  font-size: clamp(2.2rem, 5vw, 3.25rem);
  color: #f1c40f;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.55);
}

.podium-container {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 0.75rem;
  min-height: 340px;
  margin-bottom: 2rem;
  width: 100%;
}

.podium-step {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 1rem;
  border-radius: 6px 6px 0 0;
  box-shadow:
    inset 0 2px 0 rgba(255, 255, 255, 0.35),
    inset 0 -8px 16px rgba(0, 0, 0, 0.25),
    0 8px 20px rgba(0, 0, 0, 0.35);
  animation: podium-rise 0.7s ease-out both;
}

.place-1 .podium-step {
  height: 200px;
  background: linear-gradient(180deg, #ffe566 0%, #f1c40f 40%, #c9970a 100%);
}
.place-2 .podium-step {
  height: 140px;
  background: linear-gradient(180deg, #f5f7fa 0%, #c0c6ce 45%, #8e959e 100%);
  animation-delay: 0.1s;
}
.place-3 .podium-step {
  height: 100px;
  background: linear-gradient(180deg, #e8a06a 0%, #cd7f32 45%, #a05a20 100%);
  animation-delay: 0.2s;
}

.podium-number {
  font-family: "Cinzel", serif;
  font-size: 3rem;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.45);
}

@keyframes podium-rise {
  from {
    transform: translateY(40px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.podium-clan-name {
  color: #f4f1ea;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.7);
}
```

Keep layout order: `{renderPodiumPlace(top2, 2)}` then `top1` then `top3`.

- [ ] **Step 3: Mount confetti in FinalScreen**

```tsx
import { ConfettiBurst } from "./ConfettiBurst";

return (
  <div className="final-screen">
    <ConfettiBurst />
    <h1>¡Resultados Finales!</h1>
    {/* existing podium / actions / table */}
  </div>
);
```

- [ ] **Step 4: Visual check**

Reach final mode (or temporarily force `mode: "final"` in storage). Podium stepped oro/plata/bronce; confetti ~4s; title readable.

- [ ] **Step 5: Run tests**

```bash
cd app
npx vitest run
```

Expected: all tests pass.

- [ ] **Step 6: Commit** (only if user asked)

```bash
git add app/src/ui/ConfettiBurst.tsx app/src/ui/FinalScreen.tsx app/src/ui/FinalScreen.css
git commit -m "feat: olympic podium steps and confetti on final screen"
```

---

## Spec coverage checklist

| Spec item | Task |
|-----------|------|
| Cascade + count-up (C) | Task 2 |
| Olympic podium | Task 3 |
| Confetti on mount | Task 3 |
| Clearer background | Task 1 |
| Larger projector roulette | Task 1 |
| No new deps | Global |
| Host roulette unchanged | Task 1 |
