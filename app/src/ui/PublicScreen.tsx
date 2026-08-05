import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { loadGameState, subscribeGameState } from "../game/sync";
import { initialGameState } from "../game/turnReducer";
import type { GameState } from "../game/turnReducer";
import { RouletteWheel } from "./RouletteWheel";
import { ScoreTable } from "./ScoreTable";
import { TimerDisplay } from "./TimerDisplay";
import { canShowAnswer } from "../game/selectors";
import { loadEventConfig, getActiveQuestions } from "../game/eventConfig";
import { QUESTIONS } from "../game/questions";
import "./PublicScreen.css";

export function PublicScreen() {
  const [gameState, setGameState] = useState<GameState>(() => {
    return loadGameState() ?? initialGameState();
  });

  const config = useMemo(() => loadEventConfig(), []);
  const clans = config.clans;
  const activeQuestions = useMemo(() => getActiveQuestions(config, QUESTIONS), [config]);

  useEffect(() => {
    return subscribeGameState(setGameState);
  }, []);

  const { turn, round, scores, timer, rotationDeg, regularComplete } = gameState;
  const { phase, selectedClanId, selectedQuestionId } = turn;

  const question = selectedQuestionId
    ? activeQuestions.find((q) => q.id === selectedQuestionId)
    : null;

  const renderContent = () => {
    if (regularComplete) {
      return (
        <div className="public-content">
          <h1>Fin de la Fase Regular</h1>
          <ScoreTable scores={scores} clans={clans} />
        </div>
      );
    }

    switch (phase) {
      case "idle":
        return (
          <div className="public-content idle-layout">
            <RouletteWheel
              clans={clans}
              playedClanIds={round.playedClanIds}
              rotationDeg={rotationDeg}
              spinning={false}
              selectedClanId={null}
            />
            <div className="idle-scores">
              <ScoreTable scores={scores} clans={clans} />
            </div>
          </div>
        );

      case "spinning":
      case "clanRevealed":
        return (
          <div className="public-content">
            <RouletteWheel
              clans={clans}
              playedClanIds={round.playedClanIds}
              rotationDeg={rotationDeg}
              spinning={phase === "spinning"}
              selectedClanId={selectedClanId}
            />
          </div>
        );

      case "questionRunning":
      case "awaitingJudgement":
      case "revealAnswer":
        return (
          <div className="public-content question-layout">
            {question && (
              <div className="question-card">
                <h2 className="question-text">{question.texto}</h2>
                {canShowAnswer(phase) && (
                  <div className="answer-text">
                    <strong>Respuesta oficial:</strong> {question.respuestaCorrecta}
                  </div>
                )}
              </div>
            )}
            {timer && phase !== "revealAnswer" && (
              <TimerDisplay
                endsAt={timer.endsAt}
                running={timer.running}
                remainingMs={timer.remainingMs}
                size="hero"
              />
            )}
          </div>
        );

      case "showScores":
        return (
          <div className="public-content">
            <ScoreTable
              scores={scores}
              clans={clans}
              highlightClanId={selectedClanId}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="public-screen">
      {renderContent()}
      <Link to="/host" className="host-link-discrete">
        Host
      </Link>
    </main>
  );
}
