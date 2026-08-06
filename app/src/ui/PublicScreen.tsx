import { useEffect, useState, useMemo, useRef } from "react";
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
import { FinalScreen } from "./FinalScreen";
import { useGameSounds } from "./useGameSounds";
import { unlockAudio } from "../game/sounds";
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

  useGameSounds(gameState);

  const [audioReady, setAudioReady] = useState(false);
  const unlockedRef = useRef(false);
  const handleFirstInteraction = () => {
    if (unlockedRef.current) return;
    unlockedRef.current = true;
    unlockAudio();
    setAudioReady(true);
  };

  const { turn, round, scores, timer, rotationDeg, regularComplete, mode, tiebreakClanIds } = gameState;
  const { phase, selectedClanId, selectedQuestionId } = turn;

  const activeClans = useMemo(() => {
    if (mode === "tiebreak" && tiebreakClanIds) {
      return clans.filter(c => tiebreakClanIds.includes(c.id));
    }
    return clans;
  }, [mode, tiebreakClanIds, clans]);

  const question = selectedQuestionId
    ? activeQuestions.find((q) => q.id === selectedQuestionId)
    : null;

  const renderContent = () => {
    if (mode === "final") {
      return <FinalScreen scores={scores} clans={clans} />;
    }

    if (regularComplete && mode === "regular") {
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
              clans={activeClans}
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
      case "clanRevealed": {
        const selectedClan = selectedClanId
          ? clans.find((c) => c.id === selectedClanId)
          : null;
        return (
          <div className="public-content">
            <RouletteWheel
              clans={activeClans}
              playedClanIds={round.playedClanIds}
              rotationDeg={rotationDeg}
              spinning={phase === "spinning"}
              selectedClanId={selectedClanId}
            />
            {phase === "clanRevealed" && selectedClan && (
              <div className="clan-reveal-info">
                <h2>{selectedClan.nombre}</h2>
                {selectedClan.representante && (
                  <p className="clan-representante">{selectedClan.representante}</p>
                )}
              </div>
            )}
          </div>
        );
      }

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
    <main className="public-screen" onClick={handleFirstInteraction}>
      {!audioReady && (
        <p className="audio-unlock-hint">Tocá la pantalla para activar el sonido</p>
      )}
      {mode === "tiebreak" && (
        <div className="tiebreak-banner public-banner">
          <h1>MATA-MATA (Desempate)</h1>
        </div>
      )}
      {renderContent()}
      <div className="bottom-links">
        <Link to="/host" className="host-link-discrete">
          Host
        </Link>
        <Link to="/setup" className="host-link-discrete">
          Setup
        </Link>
      </div>
    </main>
  );
}
