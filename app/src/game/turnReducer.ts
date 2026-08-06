import { clanSectorIndex } from "./clans";
import { QUESTIONS, pickRandomUnused } from "./questions";
import {
  advanceRoundIfComplete,
  getPendingClans,
  markClanPlayed,
} from "./round";
import { pickClan, targetWheelRotationDeg } from "./spin";
import { applyJudgement, initialScores, rankClans, nextTieGroup } from "./scoring";
import { startTimer, stopTimer, restartTimer } from "./timer";
import { loadEventConfig, getActiveQuestions, type EventConfig } from "./eventConfig";
import type { Rng, RoundState, TurnState, Judgement, TimerState, GameMode } from "./types";

export type Action =
  | { type: "SPIN"; rng?: Rng }
  | { type: "SPIN_FINISHED" }
  | { type: "RESPIN"; rng?: Rng }
  | { type: "START_QUESTION"; rng?: Rng; nowMs?: number }
  | { type: "SHOW_QUESTION"; rng?: Rng; nowMs?: number }
  | { type: "STOP_TIMER"; nowMs?: number }
  | { type: "RESTART_TIMER"; nowMs?: number }
  | { type: "ABORT_TURN_RESPIN"; rng?: Rng }
  | { type: "REQUEST_JUDGE"; judgement: Judgement; nowMs?: number }
  | { type: "CANCEL_JUDGE" }
  | { type: "CONFIRM_JUDGE" }
  | { type: "ACK_REVEAL" }
  | { type: "ACK_SCORES" }
  | { type: "NEXT_TURN" }
  | { type: "BEGIN_FINALE" };

export type GameState = {
  round: RoundState;
  turn: TurnState;
  rotationDeg: number;
  error: string | null;
  scores: Record<string, number>;
  timer: TimerState | null;
  lastJudgement: Judgement | null;
  pendingJudgement: Judgement | null;
  maxRounds: number;
  timerSec: number;
  regularComplete: boolean;
  mode: GameMode;
  tiebreakClanIds: string[] | null;
};

export function initialGameState(clanIds: string[] = loadEventConfig().clans.map(c => c.id)): GameState {
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
    scores: initialScores(clanIds),
    timer: null,
    lastJudgement: null,
    pendingJudgement: null,
    maxRounds: 10,
    timerSec: 60,
    regularComplete: false,
    mode: "regular",
    tiebreakClanIds: null,
  };
}

export function initialGameStateFromConfig(config: EventConfig): GameState {
  return {
    ...initialGameState(config.clans.map(c => c.id)),
    maxRounds: config.maxRounds,
    timerSec: config.timerSec,
  };
}

function activeClans(state: GameState) {
  let clans = loadEventConfig().clans;
  if (state.mode === "tiebreak" && state.tiebreakClanIds) {
    clans = clans.filter(c => state.tiebreakClanIds!.includes(c.id));
  }
  return clans;
}

function spinToClan(
  state: GameState,
  rng: Rng,
): GameState {
  const clans = activeClans(state);
  const pending = getPendingClans(clans, state.round.playedClanIds);
  const clan = pickClan(pending, rng);
  const sectorDegrees = 360 / clans.length;
  const rotationDeg = targetWheelRotationDeg(clanSectorIndex(clan.id, clans), state.rotationDeg, sectorDegrees);
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
  const rng = action.type === "SPIN" || action.type === "RESPIN" || action.type === "SHOW_QUESTION" || action.type === "START_QUESTION" || action.type === "ABORT_TURN_RESPIN"
    ? (action.rng ?? Math.random)
    : Math.random;

  try {
    switch (action.type) {
      case "SPIN": {
        if (state.turn.phase !== "idle") return state;
        if (state.regularComplete && state.mode !== "tiebreak") return withError(state, "Juego terminado.");
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

      case "START_QUESTION":
      case "SHOW_QUESTION": {
        if (state.turn.phase !== "clanRevealed" || !state.turn.selectedClanId) {
          return state;
        }
        const config = loadEventConfig();
        const activeQs = getActiveQuestions(config, QUESTIONS);
        const question = pickRandomUnused(
          state.round.usedQuestionIds,
          activeQs,
          rng,
        );
        return {
          ...state,
          round: {
            ...state.round,
            usedQuestionIds: [...state.round.usedQuestionIds, question.id],
          },
          turn: {
            ...state.turn,
            phase: "questionRunning",
            selectedQuestionId: question.id,
          },
          timer: startTimer(state.timerSec, action.nowMs ?? Date.now()),
          error: null,
        };
      }

      case "STOP_TIMER": {
        if (state.turn.phase !== "questionRunning") return state;
        if (!state.timer || !state.timer.running) return state;
        return {
          ...state,
          turn: { ...state.turn, phase: "awaitingJudgement" },
          timer: stopTimer(state.timer, action.nowMs ?? Date.now()),
        };
      }

      case "RESTART_TIMER": {
        if (state.turn.phase !== "questionRunning" && state.turn.phase !== "awaitingJudgement") return state;
        return {
          ...state,
          turn: { ...state.turn, phase: "questionRunning" },
          timer: restartTimer(state.timerSec, action.nowMs ?? Date.now()),
        };
      }

      case "ABORT_TURN_RESPIN": {
        if (state.turn.phase !== "questionRunning" && state.turn.phase !== "awaitingJudgement") return state;
        
        let round = state.round;
        if (state.turn.selectedQuestionId !== null) {
          round = {
            ...round,
            usedQuestionIds: round.usedQuestionIds.filter(id => id !== state.turn.selectedQuestionId),
          };
        }

        const nextState = spinToClan({ ...state, round }, rng);
        return {
          ...nextState,
          timer: null,
          pendingJudgement: null,
          turn: {
            ...nextState.turn,
            selectedQuestionId: null,
          }
        };
      }

      case "REQUEST_JUDGE": {
        if (state.turn.phase !== "questionRunning" && state.turn.phase !== "awaitingJudgement") return state;
        return {
          ...state,
          turn: { ...state.turn, phase: "awaitingJudgement" },
          pendingJudgement: action.judgement,
          timer: state.timer && state.timer.running 
            ? stopTimer(state.timer, action.nowMs ?? Date.now()) 
            : state.timer,
        };
      }

      case "CANCEL_JUDGE": {
        if (state.turn.phase !== "awaitingJudgement") return state;
        return {
          ...state,
          turn: { ...state.turn, phase: "questionRunning" },
          pendingJudgement: null,
        };
      }

      case "CONFIRM_JUDGE": {
        if (state.turn.phase !== "awaitingJudgement" || !state.pendingJudgement || !state.turn.selectedClanId) {
          return state;
        }
        
        const clans = activeClans(state);
        let round = markClanPlayed(state.round, state.turn.selectedClanId);
        const newScores = applyJudgement(state.scores, state.turn.selectedClanId, state.pendingJudgement);
        
        let nextMode = state.mode;
        let nextTiebreakClanIds = state.tiebreakClanIds;
        
        const isRoundComplete = round.playedClanIds.length >= clans.length;
        if (isRoundComplete) {
          round = advanceRoundIfComplete(round, clans.length);
          
          if (state.mode === "tiebreak") {
            const allClans = loadEventConfig().clans;
            const ranking = rankClans(newScores, allClans);
            const nextGroup = nextTieGroup(ranking);
            
            if (!nextGroup) {
              nextMode = "final";
              nextTiebreakClanIds = null;
            } else {
              nextTiebreakClanIds = nextGroup;
            }
          }
        }
        
        return {
          ...state,
          round,
          scores: newScores,
          mode: nextMode,
          tiebreakClanIds: nextTiebreakClanIds,
          lastJudgement: state.pendingJudgement,
          pendingJudgement: null,
          turn: { ...state.turn, phase: "revealAnswer" },
        };
      }

      case "ACK_REVEAL": {
        if (state.turn.phase !== "revealAnswer") return state;
        return {
          ...state,
          turn: { ...state.turn, phase: "showScores" },
        };
      }

      case "ACK_SCORES":
      case "NEXT_TURN": {
        if (state.turn.phase !== "showScores" && state.turn.phase !== "questionRunning") {
            // For backward compatibility NEXT_TURN allowed from questionRunning
            if (action.type !== "NEXT_TURN") return state;
        }

        if (state.mode === "final") {
          return {
            ...state,
            turn: {
              ...state.turn,
              phase: "final",
              selectedClanId: null,
              selectedQuestionId: null,
            },
            timer: null,
            error: null,
          };
        }

        if (state.mode === "regular" && state.round.roundNumber > state.maxRounds) {
          return {
            ...state,
            turn: {
              ...state.turn,
              phase: "idle",
              selectedClanId: null,
              selectedQuestionId: null,
            },
            regularComplete: true,
            timer: null,
            error: null,
          };
        }

        return {
          ...state,
          turn: {
            phase: "idle",
            selectedClanId: null,
            selectedQuestionId: null,
          },
          timer: null,
          error: null,
        };
      }

      case "BEGIN_FINALE": {
        if (!state.regularComplete) return state;
        
        const allClans = loadEventConfig().clans;
        const ranking = rankClans(state.scores, allClans);
        const nextGroup = nextTieGroup(ranking);
        
        if (nextGroup) {
          return {
            ...state,
            mode: "tiebreak",
            tiebreakClanIds: nextGroup,
          };
        } else {
          return {
            ...state,
            mode: "final",
            turn: {
              ...state.turn,
              phase: "final",
            }
          };
        }
      }

      default:
        return state;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return withError(state, message);
  }
}
