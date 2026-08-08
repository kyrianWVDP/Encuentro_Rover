import { useMemo } from "react";
import { ScoreTable } from "./ScoreTable";
import { ClanAvatar } from "./ClanAvatar";
import { ConfettiBurst } from "./ConfettiBurst";
import { rankClans } from "../game/scoring";
import { buildResultsCsv, downloadTextFile } from "../game/exportCsv";
import type { Clan } from "../game/types";
import "./FinalScreen.css";

type FinalScreenProps = {
  scores: Record<string, number>;
  clans: Clan[];
};

export function FinalScreen({ scores, clans }: FinalScreenProps) {
  const ranking = useMemo(() => rankClans(scores, clans), [scores, clans]);
  
  const top1 = ranking.filter(r => r.puesto === 1).map(r => clans.find(c => c.id === r.clanId)!);
  const top2 = ranking.filter(r => r.puesto === 2).map(r => clans.find(c => c.id === r.clanId)!);
  const top3 = ranking.filter(r => r.puesto === 3).map(r => clans.find(c => c.id === r.clanId)!);

  const handleDownloadCsv = () => {
    const rows = ranking.map(r => {
      const clan = clans.find(c => c.id === r.clanId)!;
      return {
        clanId: r.clanId,
        puesto: r.puesto,
        puntos: r.puntos,
        clan: clan.nombre,
        representante: clan.representante || "",
      };
    });
    const csv = buildResultsCsv("Resultados Finales", rows);
    downloadTextFile("resultados-encuentro-rover.csv", csv);
  };

  const renderPodiumPlace = (placeClans: Clan[], position: number) => {
    if (!placeClans.length) return null;
    return (
      <div className={`podium-place place-${position}`}>
        <div className="podium-avatars">
          {placeClans.map(clan => (
            <div key={clan.id} className="podium-clan">
              <ClanAvatar nombre={clan.nombre} logoUrl={clan.logoUrl} color={clan.color} size={position === 1 ? 80 : 60} />
              <div className="podium-clan-name" style={{ color: clan.color || 'inherit' }}>{clan.nombre}</div>
            </div>
          ))}
        </div>
        <div className="podium-step">
          <span className="podium-number">{position}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="final-screen">
      <ConfettiBurst />
      <h1>¡Resultados Finales!</h1>
      <div className="podium-container">
        {renderPodiumPlace(top2, 2)}
        {renderPodiumPlace(top1, 1)}
        {renderPodiumPlace(top3, 3)}
      </div>
      
      <div className="final-actions">
        <button onClick={handleDownloadCsv} className="download-btn">
          Descargar CSV
        </button>
      </div>

      <div className="final-score-table">
        <ScoreTable scores={scores} clans={clans} topN={3} size="projector" />
      </div>
    </div>
  );
}
