import React from 'react';
import type { Clan } from '../game/types';
import { SPIN_DURATION_MS } from '../game/spin';
import { ClanAvatar } from './ClanAvatar';
import './RouletteWheel.css';

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
  clans,
  playedClanIds,
  rotationDeg,
  spinning,
  selectedClanId,
  durationMs = SPIN_DURATION_MS,
  size = "default",
}) => {
  const sectorDegrees = 360 / clans.length;
  const isProjector = size === "projector";
  const logoSize = isProjector ? 72 : 48;
  const translateY = isProjector ? -175 : -110;

  return (
    <div className={`roulette-container${isProjector ? " roulette-container--projector" : ""}`}>
      <div className="roulette-pointer"></div>
      <div
        className="roulette-wheel"
        style={{
          transform: `rotate(${rotationDeg}deg)`,
          transition: spinning ? `transform ${durationMs}ms cubic-bezier(0.12, 0.8, 0.2, 1)` : 'none'
        }}
      >
        {clans.map((clan, i) => {
          const isPlayed = playedClanIds.includes(clan.id);
          const isSelected = clan.id === selectedClanId && !spinning;
          
          return (
            <div
              key={clan.id}
              className={`roulette-sector ${isPlayed ? 'played' : ''} ${isSelected ? 'selected' : ''}`}
              style={{
                transform: `rotate(${i * sectorDegrees}deg) translateY(${translateY}px)`,
              }}
            >
              <div
                className="roulette-label"
                style={{ transform: `rotate(${-i * sectorDegrees}deg)` }}
                title={clan.nombre}
              >
                <ClanAvatar
                  nombre={clan.nombre}
                  logoUrl={clan.logoUrl}
                  color={clan.color}
                  size={logoSize}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
