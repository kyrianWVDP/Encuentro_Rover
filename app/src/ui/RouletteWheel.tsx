import React from 'react';
import { CLANS } from '../game/clans';
import { SPIN_DURATION_MS } from '../game/spin';
import './RouletteWheel.css';

type RouletteWheelProps = {
  playedClanIds: string[];
  rotationDeg: number;
  spinning: boolean;
  selectedClanId: string | null;
  durationMs?: number;
};

export const RouletteWheel: React.FC<RouletteWheelProps> = ({
  playedClanIds,
  rotationDeg,
  spinning,
  selectedClanId,
  durationMs = SPIN_DURATION_MS,
}) => {
  return (
    <div className="roulette-container">
      <div className="roulette-pointer"></div>
      <div
        className="roulette-wheel"
        style={{
          transform: `rotate(${rotationDeg}deg)`,
          transition: spinning || rotationDeg > 0 ? `transform ${durationMs}ms cubic-bezier(0.12, 0.8, 0.2, 1)` : 'none'
        }}
      >
        {CLANS.map((clan, i) => {
          const isPlayed = playedClanIds.includes(clan.id);
          const isSelected = clan.id === selectedClanId && !spinning;
          
          return (
            <div
              key={clan.id}
              className={`roulette-sector ${isPlayed ? 'played' : ''} ${isSelected ? 'selected' : ''}`}
              style={{
                transform: `rotate(${i * 45}deg) translateY(-110px)`,
              }}
            >
              <div className="roulette-label" style={{ transform: `rotate(${-i * 45}deg)` }}>
                {clan.nombre}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
