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
};

export const RouletteWheel: React.FC<RouletteWheelProps> = ({
  clans,
  playedClanIds,
  rotationDeg,
  spinning,
  selectedClanId,
  durationMs = SPIN_DURATION_MS,
}) => {
  const sectorDegrees = 360 / clans.length;

  return (
    <div className="roulette-container">
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
                transform: `rotate(${i * sectorDegrees}deg) translateY(-110px)`,
              }}
            >
              <div className="roulette-label" style={{ 
                transform: `rotate(${-i * sectorDegrees}deg)`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px'
              }}>
                <ClanAvatar
                  nombre={clan.nombre}
                  logoUrl={clan.logoUrl}
                  color={clan.color}
                  size={32}
                />
                <span>{clan.nombre}</span>
                {clan.representante && (
                  <span className="clan-representante">{clan.representante}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
