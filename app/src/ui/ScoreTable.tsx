import React from "react";
import type { Clan } from "../game/types";
import { ClanAvatar } from "./ClanAvatar";

type ScoreTableProps = {
  scores: Record<string, number>;
  clans: Clan[];
  highlightClanId?: string | null;
};

export const ScoreTable: React.FC<ScoreTableProps> = ({
  scores,
  clans,
  highlightClanId,
}) => {
  const sortedClans = [...clans].sort((a, b) => {
    const scoreA = scores[a.id] || 0;
    const scoreB = scores[b.id] || 0;
    return scoreB - scoreA;
  });

  return (
    <div className="score-table-container">
      <table className="score-table">
        <thead>
          <tr>
            <th>Posición</th>
            <th>Clan</th>
            <th>Puntos</th>
          </tr>
        </thead>
        <tbody>
          {sortedClans.map((clan, index) => {
            const isHighlighted = clan.id === highlightClanId;
            return (
              <tr
                key={clan.id}
                className={isHighlighted ? "highlighted" : ""}
                style={
                  isHighlighted && clan.color
                    ? { backgroundColor: `${clan.color}33` }
                    : {}
                }
              >
                <td>{index + 1}</td>
                <td>
                  <div className="clan-cell" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ClanAvatar
                      nombre={clan.nombre}
                      logoUrl={clan.logoUrl}
                      color={clan.color}
                      size={24}
                    />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <span
                        style={{
                          color: isHighlighted ? clan.color : "inherit",
                          fontWeight: isHighlighted ? "bold" : "normal",
                        }}
                      >
                        {clan.nombre}
                      </span>
                      {clan.representante && (
                        <span className="clan-representante">{clan.representante}</span>
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
  );
};
