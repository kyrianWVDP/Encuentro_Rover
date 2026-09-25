import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Clan } from "../game/types";
import { POINTS_CORRECT, rankClans } from "../game/scoring";
import { ClanAvatar } from "./ClanAvatar";
import { FitToStage } from "./FitToStage";
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
  /** Show dense ranking puesto column (final table). */
  showRank?: boolean;
};

const COUNT_UP_MS = 2400;
const RANK_MOVE_MS = 650;

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
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / COUNT_UP_MS);
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
  puesto?: number;
  showRank: boolean;
  target: number;
  animate: boolean;
  isHighlighted: boolean;
  highlightClanId?: string | null;
  lastJudgement?: "correct" | "incorrect" | null;
  avatarSize: number;
  showRepresentante: boolean;
  rowRef: (el: HTMLTableRowElement | null) => void;
};

function ScoreRow({
  clan,
  index,
  puesto,
  showRank,
  target,
  animate,
  isHighlighted,
  highlightClanId,
  lastJudgement,
  avatarSize,
  showRepresentante,
  rowRef,
}: ScoreRowProps) {
  const shouldCount =
    animate &&
    clan.id === highlightClanId &&
    lastJudgement === "correct";
  const from = shouldCount ? Math.max(0, target - POINTS_CORRECT) : target;
  const displayScore = useAnimatedScore(clan.id, target, shouldCount, from);

  return (
    <tr
      ref={rowRef}
      className={isHighlighted ? "highlighted" : ""}
      style={{
        ...(animate ? { animationDelay: `${index * 80}ms` } : undefined),
        ...(isHighlighted && clan.color
          ? { backgroundColor: `${clan.color}33` }
          : undefined),
      }}
    >
      {showRank && <td className="rank-cell">{puesto ?? index + 1}</td>}
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
      <td className={`score-cell${shouldCount ? " is-counting" : ""}`}>
        {displayScore}
      </td>
    </tr>
  );
}

export const ScoreTable: React.FC<ScoreTableProps> = ({
  scores,
  clans,
  highlightClanId,
  topN,
  size = "default",
  animate = false,
  lastJudgement,
  showRank = false,
}) => {
  const ranking = rankClans(scores, clans);
  const puestoById = new Map(ranking.map((r) => [r.clanId, r.puesto]));
  const sortedClans = ranking
    .map((r) => clans.find((c) => c.id === r.clanId)!)
    .filter(Boolean);
  const visibleClans =
    typeof topN === "number" && topN > 0
      ? sortedClans.slice(0, topN)
      : sortedClans;
  const isProjector = size === "projector";
  const avatarSize = isProjector ? 34 : 28;
  const fitToken = `${visibleClans.length}:${animate}:${showRank}:${highlightClanId ?? ""}:${visibleClans.map((c) => `${c.id}=${scores[c.id] || 0}`).join(",")}`;
  const scrollClass = [
    "score-scroll",
    isProjector ? "score-scroll--projector" : "",
    animate ? "score-scroll--animate" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const rowRefs = useRef(new Map<string, HTMLTableRowElement>());
  const prevTops = useRef(new Map<string, number>());
  const firstPaint = useRef(true);

  useLayoutEffect(() => {
    const nextTops = new Map<string, number>();
    for (const clan of visibleClans) {
      const el = rowRefs.current.get(clan.id);
      if (!el) continue;
      const top = el.getBoundingClientRect().top;
      nextTops.set(clan.id, top);
      if (!animate || firstPaint.current) continue;
      const prev = prevTops.current.get(clan.id);
      if (prev === undefined) continue;
      const dy = prev - top;
      if (Math.abs(dy) < 1) continue;
      el.style.transition = "none";
      el.style.transform = `translateY(${dy}px)`;
      // Force reflow so the FLIP invert sticks before playing.
      void el.offsetHeight;
      el.style.transition = `transform ${RANK_MOVE_MS}ms ease`;
      el.style.transform = "";
    }
    prevTops.current = nextTops;
    firstPaint.current = false;
  }, [fitToken, animate, visibleClans]);

  const table = (
    <div className={scrollClass}>
      <div className="score-scroll-roller score-scroll-roller-top" aria-hidden />
      <div className="score-table-container">
        <h3 className="score-scroll-title">
          {topN === 3 && !showRank ? "Podio" : "Puntajes"}
        </h3>
        <table className="score-table">
          <thead>
            <tr>
              {showRank && <th className="rank-cell">#</th>}
              <th>Persona</th>
              <th>Puntos</th>
            </tr>
          </thead>
          <tbody>
            {visibleClans.map((clan, index) => (
              <ScoreRow
                key={clan.id}
                clan={clan}
                index={index}
                puesto={puestoById.get(clan.id)}
                showRank={showRank}
                target={scores[clan.id] || 0}
                animate={animate}
                isHighlighted={clan.id === highlightClanId}
                highlightClanId={highlightClanId}
                lastJudgement={lastJudgement}
                avatarSize={avatarSize}
                showRepresentante={!isProjector}
                rowRef={(el) => {
                  if (el) rowRefs.current.set(clan.id, el);
                  else rowRefs.current.delete(clan.id);
                }}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="score-scroll-roller score-scroll-roller-bottom" aria-hidden />
    </div>
  );

  if (isProjector) {
    return <FitToStage token={fitToken}>{table}</FitToStage>;
  }
  return table;
};
