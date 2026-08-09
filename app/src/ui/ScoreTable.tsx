import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Clan } from "../game/types";
import { POINTS_CORRECT } from "../game/scoring";
import { ClanAvatar } from "./ClanAvatar";
import "./ScoreTable.css";

type ScoreTableProps = {
  scores: Record<string, number>;
  clans: Clan[];
  highlightClanId?: string | null;
  /** If set, only the top N clans by score are shown. */
  topN?: number;
  /** Larger parchment for projector / public screen. */
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

type ScoreRowProps = {
  clan: Clan;
  index: number;
  target: number;
  animate: boolean;
  isHighlighted: boolean;
  highlightClanId?: string | null;
  lastJudgement?: "correct" | "incorrect" | null;
  avatarSize: number;
  showRepresentante: boolean;
};

function ScoreRow({
  clan,
  index,
  target,
  animate,
  isHighlighted,
  highlightClanId,
  lastJudgement,
  avatarSize,
  showRepresentante,
}: ScoreRowProps) {
  const shouldCount =
    animate &&
    clan.id === highlightClanId &&
    lastJudgement === "correct";
  const from = shouldCount ? Math.max(0, target - POINTS_CORRECT) : target;
  const displayScore = useAnimatedScore(clan.id, target, shouldCount, from);

  return (
    <tr
      className={isHighlighted ? "highlighted" : ""}
      style={{
        ...(animate ? { animationDelay: `${index * 80}ms` } : undefined),
        ...(isHighlighted && clan.color
          ? { backgroundColor: `${clan.color}33` }
          : undefined),
      }}
    >
      <td>
        <div className="clan-cell">
          <ClanAvatar
            nombre={clan.nombre}
            logoUrl={clan.logoUrl}
            color={clan.color}
            size={avatarSize}
          />
          <div className="clan-text">
            <span
              className={`clan-name${isHighlighted ? " is-highlighted" : ""}`}
              style={
                isHighlighted && clan.color
                  ? { color: clan.color }
                  : undefined
              }
            >
              {clan.nombre}
            </span>
            {showRepresentante && clan.representante && (
              <span className="clan-representante">
                {clan.representante}
              </span>
            )}
          </div>
        </div>
      </td>
      <td
        className={`score-cell${shouldCount ? " is-counting" : ""}`}
      >
        {displayScore}
      </td>
    </tr>
  );
}

/** Scale the parchment so the full board fits inside its parent (projector). */
function useFitScale(
  enabled: boolean,
  token: string,
): { ref: React.RefObject<HTMLDivElement | null>; scale: number } {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    if (!enabled) {
      setScale(1);
      return;
    }
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;

    const fit = () => {
      el.style.transform = "scale(1)";
      const availW = Math.max(0, parent.clientWidth - 8);
      const availH = Math.max(0, parent.clientHeight - 8);
      const needW = el.offsetWidth;
      const needH = el.offsetHeight;
      if (needW <= 0 || needH <= 0 || availW <= 0 || availH <= 0) {
        setScale(1);
        return;
      }
      const next = Math.min(1, availW / needW, availH / needH);
      setScale(Math.max(0.55, Number(next.toFixed(3))));
    };

    fit();
    const ro = new ResizeObserver(() => {
      requestAnimationFrame(fit);
    });
    ro.observe(parent);
    return () => ro.disconnect();
  }, [enabled, token]);

  return { ref, scale };
}

export const ScoreTable: React.FC<ScoreTableProps> = ({
  scores,
  clans,
  highlightClanId,
  topN,
  size = "default",
  animate = false,
  lastJudgement,
}) => {
  const sortedClans = [...clans].sort((a, b) => {
    const scoreA = scores[a.id] || 0;
    const scoreB = scores[b.id] || 0;
    return scoreB - scoreA;
  });
  const visibleClans =
    typeof topN === "number" && topN > 0
      ? sortedClans.slice(0, topN)
      : sortedClans;
  const isProjector = size === "projector";
  const avatarSize = isProjector ? 34 : 28;
  const fitToken = `${visibleClans.length}:${animate}:${highlightClanId ?? ""}:${visibleClans.map((c) => `${c.id}=${scores[c.id] || 0}`).join(",")}`;
  const { ref, scale } = useFitScale(isProjector, fitToken);
  const scrollClass = [
    "score-scroll",
    isProjector ? "score-scroll--projector" : "",
    animate ? "score-scroll--animate" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={ref}
      className={scrollClass}
      style={
        isProjector
          ? { transform: `scale(${scale})`, transformOrigin: "center center" }
          : undefined
      }
    >
      <div className="score-scroll-roller score-scroll-roller-top" aria-hidden />
      <div className="score-table-container">
        <h3 className="score-scroll-title">
          {topN === 3 ? "Podio" : "Puntajes"}
        </h3>
        <table className="score-table">
          <thead>
            <tr>
              <th>Clan</th>
              <th>Puntos</th>
            </tr>
          </thead>
          <tbody>
            {visibleClans.map((clan, index) => (
              <ScoreRow
                key={clan.id}
                clan={clan}
                index={index}
                target={scores[clan.id] || 0}
                animate={animate}
                isHighlighted={clan.id === highlightClanId}
                highlightClanId={highlightClanId}
                lastJudgement={lastJudgement}
                avatarSize={avatarSize}
                showRepresentante={!isProjector}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="score-scroll-roller score-scroll-roller-bottom" aria-hidden />
    </div>
  );
};
