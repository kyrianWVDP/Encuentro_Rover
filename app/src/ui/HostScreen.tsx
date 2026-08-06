import { useEffect, useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { turnReducer, initialGameState } from "../game/turnReducer";
import type { Action, GameState } from "../game/turnReducer";
import { publishGameState, loadGameState } from "../game/sync";
import { loadEventConfig, getActiveQuestions } from "../game/eventConfig";
import { QUESTIONS } from "../game/questions";
import { SPIN_DURATION_MS } from "../game/spin";
import { ScoreTable } from "./ScoreTable";
import { TimerDisplay } from "./TimerDisplay";
import { ConfirmModal } from "./ConfirmModal";
import { FinalScreen } from "./FinalScreen";
import { isMuted, setMuted, unlockAudio } from "../game/sounds";
import "./HostScreen.css";

export function HostScreen() {
  const [state, setState] = useState<GameState>(() => loadGameState() ?? initialGameState());
  const [now, setNow] = useState(Date.now());
  const [muted, setMutedState] = useState(() => isMuted());
  const config = useMemo(() => loadEventConfig(), []);
  const clans = config.clans;
  const activeQuestions = useMemo(() => getActiveQuestions(config, QUESTIONS), [config]);

  const unlockedRef = useRef(false);
  const handleFirstInteraction = () => {
    if (unlockedRef.current) return;
    unlockedRef.current = true;
    unlockAudio();
  };

  const handleToggleMute = () => {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
  };

  const dispatch = (action: Action) => {
    setState((prev) => {
      const next = turnReducer(prev, action);
      publishGameState(next);
      return next;
    });
  };

  // Timer tick
  useEffect(() => {
    let frame: number;
    const tick = () => {
      setNow(Date.now());
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Effect for SPIN_FINISHED
  useEffect(() => {
    if (state.turn.phase === "spinning") {
      const t = window.setTimeout(() => {
        dispatch({ type: "SPIN_FINISHED" });
      }, SPIN_DURATION_MS);
      return () => clearTimeout(t);
    }
  }, [state.turn.phase, state.rotationDeg]);

  // Effect for STOP_TIMER when time is up
  useEffect(() => {
    if (state.timer?.running && state.timer.endsAt) {
      if (now >= state.timer.endsAt) {
        dispatch({ type: "STOP_TIMER", nowMs: now });
      }
    }
  }, [state.timer?.running, state.timer?.endsAt, now]);

  const { turn, round, scores, timer, regularComplete, error, pendingJudgement, mode } = state;
  const { phase, selectedClanId, selectedQuestionId } = turn;
  const canSpin = clans.length >= 2;
  const selectedClan = selectedClanId
    ? clans.find((c) => c.id === selectedClanId)
    : null;

  const question = selectedQuestionId
    ? activeQuestions.find((q) => q.id === selectedQuestionId)
    : null;

  const showAnswerForHost =
    question &&
    (phase === "questionRunning" ||
      phase === "awaitingJudgement" ||
      phase === "revealAnswer" ||
      phase === "showScores");

  const handleConfirmJudge = () => {
    dispatch({ type: "CONFIRM_JUDGE" });
  };

  const handleCancelJudge = () => {
    dispatch({ type: "CANCEL_JUDGE" });
  };

  return (
    <main className="host-screen" onClick={handleFirstInteraction}>
      <header className="host-header">
        <div className="header-left">
          <h1>Panel de Control (Host)</h1>
          <Link to="/" target="_blank" className="public-link">
            Abrir Proyector
          </Link>
          <Link to="/setup" className="public-link" style={{ marginLeft: '1rem' }}>
            Setup
          </Link>
          <button type="button" className="mute-toggle-btn" onClick={handleToggleMute}>
            {muted ? "Activar sonidos" : "Silenciar sonidos"}
          </button>
        </div>
        <div className="header-right">
          <h2>Ronda {round.roundNumber}</h2>
        </div>
      </header>

      {error && (
        <div className="error-banner">
          Error: {error}
        </div>
      )}

      {mode === "final" ? (
        <FinalScreen scores={scores} clans={clans} />
      ) : regularComplete && mode === "regular" ? (
        <div className="host-content">
          <h2>Fase regular terminada</h2>
          <ScoreTable scores={scores} clans={clans} />
          <button
            onClick={() => dispatch({ type: "BEGIN_FINALE" })}
            className="download-btn"
            style={{ marginTop: '2rem' }}
          >
            Continuar a resultado
          </button>
        </div>
      ) : (
        <div className="host-content">
          {mode === "tiebreak" && (
            <div className="tiebreak-banner">
              <h2>MATA-MATA (Desempate)</h2>
            </div>
          )}
          <div className="host-main-panel">
            <div className="status-panel">
              <h3>Estado: {phase}</h3>
              {selectedClan && (
                <div className="selected-clan-info">
                  <p>
                    <strong>Clan seleccionado:</strong> {selectedClan.nombre}
                  </p>
                  {selectedClan.representante && (
                    <p className="clan-representante">{selectedClan.representante}</p>
                  )}
                </div>
              )}
            </div>

            {question && (
              <div className="question-panel">
                <h3>Pregunta</h3>
                <p className="question-text">{question.texto}</p>
                {showAnswerForHost && (
                  <div className="answer-block">
                    <h4>Respuesta correcta:</h4>
                    <p className="answer-text">{question.respuestaCorrecta}</p>
                  </div>
                )}
              </div>
            )}

            {timer && (
              <div className="timer-panel">
                <TimerDisplay
                  endsAt={timer.endsAt}
                  running={timer.running}
                  remainingMs={timer.remainingMs}
                />
              </div>
            )}

            <div className="controls-panel">
              {phase === "idle" && (
                <>
                  <button
                    onClick={() => dispatch({ type: "SPIN" })}
                    disabled={!canSpin}
                  >
                    Girar
                  </button>
                  {!canSpin && (
                    <p className="min-clans-warning">
                      Se necesitan al menos 2 clanes para jugar.
                    </p>
                  )}
                </>
              )}
              {phase === "clanRevealed" && (
                <>
                  <button onClick={() => dispatch({ type: "RESPIN" })}>
                    Volver a girar
                  </button>
                  <button onClick={() => dispatch({ type: "START_QUESTION", nowMs: Date.now() })}>
                    Mostrar pregunta
                  </button>
                </>
              )}
              {(phase === "questionRunning" || phase === "awaitingJudgement") && (
                <>
                  {phase === "questionRunning" && (
                    <button onClick={() => dispatch({ type: "STOP_TIMER", nowMs: Date.now() })}>
                      Cortar tiempo
                    </button>
                  )}
                  <button onClick={() => dispatch({ type: "RESTART_TIMER", nowMs: Date.now() })}>
                    Reiniciar timer
                  </button>
                  <button onClick={() => dispatch({ type: "ABORT_TURN_RESPIN" })}>
                    Re-girar
                  </button>
                  <button
                    className="correct-btn"
                    onClick={() => dispatch({ type: "REQUEST_JUDGE", judgement: "correct", nowMs: Date.now() })}
                  >
                    Correcta
                  </button>
                  <button
                    className="incorrect-btn"
                    onClick={() => dispatch({ type: "REQUEST_JUDGE", judgement: "incorrect", nowMs: Date.now() })}
                  >
                    Incorrecta
                  </button>
                </>
              )}
              {phase === "revealAnswer" && (
                <button onClick={() => dispatch({ type: "ACK_REVEAL" })}>Continuar</button>
              )}
              {phase === "showScores" && (
                <button onClick={() => dispatch({ type: "ACK_SCORES" })}>Siguiente turno</button>
              )}
            </div>
          </div>

          <aside className="host-sidebar">
            <h3>Puntajes</h3>
            <ScoreTable scores={scores} clans={clans} highlightClanId={selectedClanId} />
          </aside>
        </div>
      )}

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
