import { useEffect, useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { publishGameState, loadGameState, subscribeGameState } from "../game/sync";
import { turnReducer, initialGameState } from "../game/turnReducer";
import type { Action, GameState } from "../game/turnReducer";
import { RouletteWheel } from "./RouletteWheel";
import { ScoreTable } from "./ScoreTable";
import { TimerDisplay } from "./TimerDisplay";
import { loadEventConfig, saveEventConfig, getActiveQuestions } from "../game/eventConfig";
import { QUESTIONS } from "../game/questions";
import { FinalScreen } from "./FinalScreen";
import { ClanAvatar } from "./ClanAvatar";
import { FitToStage } from "./FitToStage";
import { ConfirmModal } from "./ConfirmModal";
import { useGameSounds } from "./useGameSounds";
import { unlockAudio, isMuted, setMuted } from "../game/sounds";
import { SPIN_DURATION_MS } from "../game/spin";
import "./PublicScreen.css";

export function PublicScreen() {
  const [gameState, setGameState] = useState<GameState>(() => {
    return loadGameState() ?? initialGameState();
  });

  const config = useMemo(() => loadEventConfig(), []);
  const clans = config.clans;
  const activeQuestions = useMemo(() => getActiveQuestions(config, QUESTIONS), [config]);

  const dispatch = (action: Action) => {
    setGameState((prev) => {
      const next = turnReducer(prev, action);
      publishGameState(next);
      return next;
    });
  };

  useEffect(() => {
    return subscribeGameState(setGameState);
  }, []);

  // Apply event maxRounds / timerSec to the live game (config is source of truth).
  useEffect(() => {
    const eventConfig = loadEventConfig();
    setGameState((prev) => {
      if (
        prev.maxRounds === eventConfig.maxRounds &&
        prev.timerSec === eventConfig.timerSec
      ) {
        return prev;
      }
      const next = {
        ...prev,
        maxRounds: eventConfig.maxRounds,
        timerSec: eventConfig.timerSec,
      };
      publishGameState(next);
      return next;
    });
  }, []);

  useEffect(() => {
    if (gameState.turn.phase === "spinning") {
      const t = window.setTimeout(() => {
        dispatch({ type: "SPIN_FINISHED" });
      }, SPIN_DURATION_MS);
      return () => clearTimeout(t);
    }
  }, [gameState.turn.phase, gameState.rotationDeg]);

  useEffect(() => {
    if (!gameState.timer?.running || !gameState.timer.endsAt) {
      return;
    }
    const endsAt = gameState.timer.endsAt;
    const delay = Math.max(0, endsAt - Date.now());
    const t = window.setTimeout(() => {
      dispatch({ type: "STOP_TIMER", nowMs: Date.now() });
    }, delay);
    return () => clearTimeout(t);
  }, [gameState.timer?.running, gameState.timer?.endsAt]);

  useGameSounds(gameState);

  const [audioReady, setAudioReady] = useState(false);
  const [muted, setMutedState] = useState(() => isMuted());
  const unlockedRef = useRef(false);
  const enableAudio = () => {
    if (isMuted()) setMuted(false);
    setMutedState(false);
    unlockAudio();
    unlockedRef.current = true;
    setAudioReady(true);
  };
  const handleFirstInteraction = () => {
    // After unlock, do not force-unmute — mute toggle must stick.
    if (unlockedRef.current && audioReady) return;
    enableAudio();
  };
  const handleToggleMute = () => {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
  };

  const {
    turn,
    round,
    scores,
    timer,
    rotationDeg,
    regularComplete,
    mode,
    tiebreakClanIds,
    lastJudgement,
    pendingJudgement,
    error,
  } = gameState;
  const { phase, selectedClanId, selectedQuestionId } = turn;
  const canSpin = clans.length >= 2;

  const activeClans = useMemo(() => {
    if (mode === "tiebreak" && tiebreakClanIds) {
      return clans.filter((c) => tiebreakClanIds.includes(c.id));
    }
    return clans;
  }, [mode, tiebreakClanIds, clans]);

  const question = selectedQuestionId
    ? activeQuestions.find((q) => q.id === selectedQuestionId)
    : null;

  const showAnswer = phase === "revealAnswer";

  const handleConfirmJudge = () => {
    dispatch({ type: "CONFIRM_JUDGE" });
  };

  const handleCancelJudge = () => {
    dispatch({ type: "CANCEL_JUDGE" });
  };

  const muteToggle = (
    <button
      type="button"
      className={`mute-toggle-btn${muted ? " is-muted" : ""}`}
      onClick={handleToggleMute}
    >
      {muted ? "Activar sonidos" : "Silenciar sonidos"}
    </button>
  );

  const renderHostBar = () => {
    if (mode === "final") return null;

    if (regularComplete && mode === "regular") {
      return (
        <div className="host-bar">
          <button type="button" onClick={() => dispatch({ type: "BEGIN_FINALE" })}>
            Continuar
          </button>
          {muteToggle}
        </div>
      );
    }

    return (
      <div className="host-bar">
        {phase === "idle" && round.roundNumber === 1 && round.playedClanIds.length === 0 && (
          <label className="rounds-field">
            Rondas
            <input
              type="number"
              min={1}
              value={gameState.maxRounds}
              onChange={(e) => {
                const rounds = Math.max(1, Number(e.target.value) || 1);
                saveEventConfig({ ...loadEventConfig(), maxRounds: rounds });
                setGameState((prev) => {
                  const next = { ...prev, maxRounds: rounds };
                  publishGameState(next);
                  return next;
                });
              }}
            />
          </label>
        )}
        {phase === "idle" && (
          <button
            type="button"
            onClick={() => dispatch({ type: "SPIN" })}
            disabled={!canSpin}
          >
            Girar
          </button>
        )}
        {phase === "clanRevealed" && (
          <>
            <button type="button" onClick={() => dispatch({ type: "RESPIN" })}>
              Volver a girar
            </button>
            <button
              type="button"
              onClick={() => dispatch({ type: "START_QUESTION", nowMs: Date.now() })}
            >
              Empezar pregunta
            </button>
          </>
        )}
        {(phase === "questionRunning" || phase === "awaitingJudgement") && (
          <>
            {phase === "questionRunning" && (
              <button
                type="button"
                onClick={() => dispatch({ type: "STOP_TIMER", nowMs: Date.now() })}
              >
                Parar timer
              </button>
            )}
            <button
              type="button"
              onClick={() => dispatch({ type: "RESTART_TIMER", nowMs: Date.now() })}
            >
              Reiniciar timer
            </button>
            <button type="button" onClick={() => dispatch({ type: "ABORT_TURN_RESPIN" })}>
              Anular y girar
            </button>
            <button
              type="button"
              className="correct-btn"
              onClick={() =>
                dispatch({ type: "REQUEST_JUDGE", judgement: "correct", nowMs: Date.now() })
              }
            >
              Correcto
            </button>
            <button
              type="button"
              className="incorrect-btn"
              onClick={() =>
                dispatch({ type: "REQUEST_JUDGE", judgement: "incorrect", nowMs: Date.now() })
              }
            >
              Incorrecto
            </button>
          </>
        )}
        {phase === "revealAnswer" && (
          <button type="button" onClick={() => dispatch({ type: "ACK_REVEAL" })}>
            Continuar
          </button>
        )}
        {phase === "showScores" && (
          <button type="button" onClick={() => dispatch({ type: "ACK_SCORES" })}>
            Siguiente
          </button>
        )}
        {muteToggle}
      </div>
    );
  };

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
          <div className="public-content public-content--wheel">
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
          <div className="public-content public-content--wheel">
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
          <div className="public-content public-content--wheel clan-reveal-layout">
            <RouletteWheel
              clans={activeClans}
              playedClanIds={round.playedClanIds}
              rotationDeg={rotationDeg}
              spinning={false}
              selectedClanId={selectedClanId}
              size="projector"
            />
            <div className="clan-reveal-caption">
              <ClanAvatar
                nombre={selectedClan.nombre}
                logoUrl={selectedClan.logoUrl}
                color={selectedClan.color}
                size={160}
              />
              <h2 className="clan-reveal-name">{selectedClan.nombre}</h2>
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
            <FitToStage
              token={`q:${phase}:${selectedQuestionId ?? ""}:${showAnswer}:${selectedClanId ?? ""}`}
            >
              {selectedClan && (
                <div className="clan-question-header">
                  <ClanAvatar
                    nombre={selectedClan.nombre}
                    logoUrl={selectedClan.logoUrl}
                    color={selectedClan.color}
                    size={72}
                  />
                  <h2 className="clan-reveal-name">{selectedClan.nombre}</h2>
                </div>
              )}
              {question && (
                <div className="question-scroll">
                  <div className="question-scroll-roller question-scroll-roller-top" aria-hidden />
                  <div className="question-card">
                    <p className="question-label">Pregunta</p>
                    <h2 className="question-text">{question.texto}</h2>
                    {showAnswer && (
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
            </FitToStage>
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
    phase === "questionRunning" ||
    phase === "awaitingJudgement" ||
    phase === "revealAnswer" ||
    phase === "clanRevealed" ||
    mode === "final" ||
    (regularComplete && mode === "regular");

  const showEventTitle = !hidePageTitle && mode !== "tiebreak";
  const showTiebreakTitle = mode === "tiebreak";

  return (
    <main
      className={`public-screen${mode === "final" ? " public-screen--final" : ""}${phase === "clanRevealed" ? " public-screen--picked" : ""}${phase === "questionRunning" || phase === "awaitingJudgement" || phase === "revealAnswer" ? " public-screen--question" : ""}${hidePageTitle && mode !== "tiebreak" ? " public-screen--scores" : ""}${mode === "tiebreak" ? " public-screen--tiebreak" : ""}`}
      onPointerDown={handleFirstInteraction}
      onKeyDown={handleFirstInteraction}
    >
      {showEventTitle && (
        <header className="public-title-block">
          <h1 className="public-title">{config.titulo}</h1>
        </header>
      )}
      {showTiebreakTitle && (
        <header className="public-title-block public-title-block--tiebreak">
          <p className="public-title-eyebrow">Desempate</p>
          <h1 className="public-title public-title--tiebreak">Mata-mata</h1>
        </header>
      )}
      {error && (
        <div className="public-error-banner" role="alert">
          Error: {error}
        </div>
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
      {renderContent()}
      {renderHostBar()}
      <div className="bottom-links">
        <Link to="/setup" className="host-link-discrete">
          Setup
        </Link>
      </div>
      <ConfirmModal
        open={pendingJudgement !== null}
        title="Confirmar Juicio"
        message={`¿Estás seguro de marcar la respuesta como ${
          pendingJudgement === "correct" ? "CORRECTA (+10 pts)" : "INCORRECTA (0 pts)"
        }?`}
        onConfirm={handleConfirmJudge}
        onCancel={handleCancelJudge}
      />
    </main>
  );
}
