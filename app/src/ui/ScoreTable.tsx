import React from "react";
import type { Clan } from "../game/types";
import { ClanAvatar } from "./ClanAvatar";
import "./ScoreTable.css";

type ScoreTableProps = {
  scores: Record<string, number>;
  clans: Clan[];
  highlightClanId?: string | null;
  /** If set, only the top N clans by score are shown. */
  topN?: number;
};

export const ScoreTable: React.FC<ScoreTableProps> = ({
  scores,
  clans,
  highlightClanId,
  topN,
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

  return (
    <div className="score-scroll">
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
            {visibleClans.map((clan) => {
              const isHighlighted = clan.id === highlightClanId;
              return (
                <tr
                  key={clan.id}
                  className={isHighlighted ? "highlighted" : ""}
                  style={
                    isHighlighted && clan.color
                      ? { backgroundColor: `${clan.color}33` }
                      : undefined
                  }
                >
                  <td>
                    <div className="clan-cell">
                      <ClanAvatar
                        nombre={clan.nombre}
                        logoUrl={clan.logoUrl}
                        color={clan.color}
                        size={28}
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
                        {clan.representante && (
                          <span className="clan-representante">
                            {clan.representante}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="score-cell">{scores[clan.id] || 0}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="score-scroll-roller score-scroll-roller-bottom" aria-hidden />
    </div>
  );
};
