export type Clan = {
  id: string;
  nombre: string;
  color?: string;
  logoUrl?: string;
};

export type Question = {
  id: number;
  texto: string;
  respuestaCorrecta: string;
};

export type TurnPhase = "idle" | "spinning" | "clanRevealed" | "question";

export type RoundState = {
  roundNumber: number;
  playedClanIds: string[];
  usedQuestionIds: number[];
};

export type TurnState = {
  phase: TurnPhase;
  selectedClanId: string | null;
  selectedQuestionId: number | null;
};

export type Rng = () => number;
