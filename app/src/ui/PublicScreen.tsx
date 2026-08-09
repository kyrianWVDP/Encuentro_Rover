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
import { ClanAvatar } from "./ClanAvatar";
import { useGameSounds } from "./useGameSounds";
import { unlockAudio, isMuted, setMuted } from "../game/sounds";
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
  const enableAudio = () => {
    if (isMuted()) setMuted(false);
    unlockAudio();
    unlockedRef.current = true;
    setAudioReady(true);
  };
  const handleFirstInteraction = () => {
    if (unlockedRef.current && audioReady && !isMuted()) return;
    enableAudio();
  };

  const { turn, round, scores, timer, rotationDeg, regularComplete, mode, tiebreakClanIds, lastJudgement } = gameState;
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
      return <FinalScreen scores={scores} clans={clans} showDownloadCsv={false} />;
    }

    if (regularComplete && mode === "regular") {
      return (
        <div className="public-content scores-layout">
          <h1 className="public-end-title">Fin de la Fase Regular</h1>
          <ScoreTable scores={scores} clans={clans} topN={3} size="projector" />
        </div>
      );
    }

    switch (phase) {
      case "idle":
        return (
          <div className="public-content">
            <RouletteWheel
              clans={activeClans}
              playedClanIds={round.playedClanIds}
              rotationDeg={rotationDeg}
              spinning={false}
              selectedClanId={null}
              size="projector"
            />
          </div>
        );

      case "spinning":
        return (
          <div className="public-content">
            <RouletteWheel
              clans={activeClans}
              playedClanIds={round.playedClanIds}
              rotationDeg={rotationDeg}
              spinning
              selectedClanId={selectedClanId}
              size="projector"
            />
          </div>
        );

      case "clanRevealed": {
        const selectedClan = selectedClanId
          ? clans.find((c) => c.id === selectedClanId)
          : null;
        if (!selectedClan) return null;
        return (
          <div className="public-content clan-reveal-layout">
            <div className="clan-reveal-hero">
              <ClanAvatar
                nombre={selectedClan.nombre}
                logoUrl={selectedClan.logoUrl}
                color={selectedClan.color}
                size={160}
              />
              <h2 className="clan-reveal-name">{selectedClan.nombre}</h2>
              {selectedClan.representante && (
                <p className="clan-representante">{selectedClan.representante}</p>
              )}
            </div>
          </div>
        );
      }

      case "questionRunning":
      case "awaitingJudgement":
      case "revealAnswer": {
        const selectedClan = selectedClanId
          ? clans.find((c) => c.id === selectedClanId)
          : null;
        return (
          <div className="public-content question-layout">
            {selectedClan && (
              <div className="clan-question-header">
                <ClanAvatar
                  nombre={selectedClan.nombre}
                  logoUrl={selectedClan.logoUrl}
                  color={selectedClan.color}
                  size={88}
                />
                <h2 className="clan-reveal-name">{selectedClan.nombre}</h2>
                {selectedClan.representante && (
                  <p className="clan-representante">{selectedClan.representante}</p>
                )}
              </div>
            )}
            {question && (
              <div className="question-scroll">
                <div className="question-scroll-roller question-scroll-roller-top" aria-hidden />
                <div className="question-card">
                  <p className="question-label">Pregunta</p>
                  <h2 className="question-text">{question.texto}</h2>
                  {canShowAnswer(phase) && (
                    <div className="answer-block">
                      <p className="answer-label">Respuesta oficial</p>
                      <p className="answer-text">{question.respuestaCorrecta}</p>
                    </div>
                  )}
                </div>
                <div className="question-scroll-roller question-scroll-roller-bottom" aria-hidden />
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
      }

      case "showScores":
        return (
          <div className="public-content scores-layout">
            <ScoreTable
              scores={scores}
              clans={clans}
              highlightClanId={selectedClanId}
              size="projector"
              animate
              lastJudgement={lastJudgement}
            />
          </div>
        );

      default:
        return null;
    }
  };

  const hidePageTitle =
    phase === "showScores" ||
    mode === "final" ||
    (regularComplete && mode === "regular");

  return (
    <main
      className={`public-screen${mode === "final" ? " public-screen--final" : ""}${hidePageTitle ? " public-screen--scores" : ""}`}
      onPointerDown={handleFirstInteraction}
      onKeyDown={handleFirstInteraction}
    >
      {!hidePageTitle && (
        <header className="public-title-block">
          <p className="public-title-eyebrow">Encuentro Nacional de Rovers · 2026</p>
          <h1 className="public-title">{config.titulo}</h1>
        </header>
      )}
      {!audioReady && (
        <button
          type="button"
          className="audio-unlock-hint audio-unlock-btn"
          onClick={enableAudio}
        >
          Tocá aquí para activar el sonido
        </button>
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
