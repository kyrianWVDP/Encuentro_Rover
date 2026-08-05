import { CLANS, clanSectorIndex } from "./clans";
import { QUESTIONS, pickRandomUnused } from "./questions";
import {
  advanceRoundIfComplete,
  getPendingClans,
  markClanPlayed,
} from "./round";
import { pickClan, targetWheelRotationDeg } from "./spin";
import type { Rng, RoundState, TurnState } from "./types";

export type Action =
  | { type: "SPIN"; rng?: Rng }
  | { type: "SPIN_FINISHED" }
  | { type: "RESPIN"; rng?: Rng }
  | { type: "SHOW_QUESTION"; rng?: Rng }
  | { type: "NEXT_TURN" };

export type GameState = {
  round: RoundState;
  turn: TurnState;
  rotationDeg: number;
  error: string | null;
};

export function initialGameState(): GameState {
  return {
    round: {
      roundNumber: 1,
      playedClanIds: [],
      usedQuestionIds: [],
    },
    turn: {
      phase: "idle",
      selectedClanId: null,
      selectedQuestionId: null,
    },
    rotationDeg: 0,
    error: null,
  };
}

function spinToClan(
  state: GameState,
  rng: Rng,
): GameState {
  const pending = getPendingClans(CLANS, state.round.playedClanIds);
  const clan = pickClan(pending, rng);
  const rotationDeg = targetWheelRotationDeg(clanSectorIndex(clan.id), state.rotationDeg);
  return {
    ...state,
    turn: {
      ...state.turn,
      phase: "spinning",
      selectedClanId: clan.id,
    },
    rotationDeg,
    error: null,
  };
}

function withError(state: GameState, message: string): GameState {
  return { ...state, error: message };
}

export function turnReducer(state: GameState, action: Action): GameState {
  const rng = action.type === "SPIN" || action.type === "RESPIN" || action.type === "SHOW_QUESTION"
    ? (action.rng ?? Math.random)
    : Math.random;

  try {
    switch (action.type) {
      case "SPIN": {
        if (state.turn.phase !== "idle") return state;
        return spinToClan(state, rng);
      }

      case "SPIN_FINISHED": {
        if (state.turn.phase !== "spinning") return state;
        return {
          ...state,
          turn: { ...state.turn, phase: "clanRevealed" },
          error: null,
        };
      }

      case "RESPIN": {
        if (state.turn.phase !== "clanRevealed") return state;
        return spinToClan(state, rng);
      }

      case "SHOW_QUESTION": {
        if (state.turn.phase !== "clanRevealed" || !state.turn.selectedClanId) {
          return state;
        }
        const question = pickRandomUnused(
          state.round.usedQuestionIds,
          QUESTIONS,
          rng,
        );
        let round = markClanPlayed(state.round, state.turn.selectedClanId);
        round = {
          ...round,
          usedQuestionIds: [...round.usedQuestionIds, question.id],
        };
        round = advanceRoundIfComplete(round, CLANS.length);
        return {
          ...state,
          round,
          turn: {
            ...state.turn,
            phase: "question",
            selectedQuestionId: question.id,
          },
          error: null,
        };
      }

      case "NEXT_TURN": {
        if (state.turn.phase !== "question") return state;
        return {
          ...state,
          turn: {
            phase: "idle",
            selectedClanId: null,
            selectedQuestionId: null,
          },
          error: null,
        };
      }

      default:
        return state;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return withError(state, message);
  }
}
