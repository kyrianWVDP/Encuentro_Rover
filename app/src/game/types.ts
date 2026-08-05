export type Clan = {
  id: string;
  nombre: string;
  color?: string;
  logoUrl?: string | null;
};

export type Question = {
  id: number;
  texto: string;
  respuestaCorrecta: string;
};

export type Judgement = "correct" | "incorrect";

export type TurnPhase =
  | "idle"
  | "spinning"
  | "clanRevealed"
  | "questionRunning"
  | "awaitingJudgement"
  | "revealAnswer"
  | "showScores";

export type TimerState = {
  running: boolean;
  endsAt: number | null;
  remainingMs: number;
};

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
