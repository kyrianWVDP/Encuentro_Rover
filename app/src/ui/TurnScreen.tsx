import { useEffect, useReducer, useState } from "react";
import { turnReducer, initialGameState } from "../game/turnReducer";
import { CLANS } from "../game/clans";
import { QUESTIONS } from "../game/questions";
import { SPIN_DURATION_MS } from "../game/spin";
import { getPendingClans } from "../game/round";
import { RouletteWheel } from "./RouletteWheel";

export function TurnScreen() {
  const [state, dispatch] = useReducer(turnReducer, initialGameState());
  const [answerRevealed, setAnswerRevealed] = useState(false);

  useEffect(() => {
    if (state.turn.phase !== "spinning") return;
    const t = window.setTimeout(() => {
      dispatch({ type: "SPIN_FINISHED" });
    }, SPIN_DURATION_MS);
    return () => clearTimeout(t);
  }, [state.turn.phase, state.rotationDeg]);

  useEffect(() => {
    if (state.turn.phase !== "questionRunning" && state.turn.phase !== "revealAnswer" && state.turn.phase !== "showScores") {
      setAnswerRevealed(false);
    }
  }, [state.turn.phase, state.turn.selectedQuestionId]);

  const pendingCount = getPendingClans(CLANS, state.round.playedClanIds).length;
  const selectedQuestion = QUESTIONS.find(
    (q) => q.id === state.turn.selectedQuestionId,
  );

  return (
    <div className="turn-screen">
      <header className="header">
        <h1>Encuentro Rover 2026 / Justas del Saber</h1>
        <h2>
          Ronda {state.round.roundNumber} &middot; {pendingCount} pendientes
        </h2>
      </header>

      <main className="main-content">
        <RouletteWheel
          playedClanIds={state.round.playedClanIds}
          rotationDeg={state.rotationDeg}
          spinning={state.turn.phase === "spinning"}
          selectedClanId={state.turn.selectedClanId}
        />

        {(state.turn.phase === "questionRunning" || state.turn.phase === "awaitingJudgement" || state.turn.phase === "revealAnswer" || state.turn.phase === "showScores") && selectedQuestion && (
          <div className="question-card">
            <p className="question-text">{selectedQuestion.texto}</p>
            {answerRevealed && (
              <div className="answer-block">
                <p className="answer-label">Respuesta correcta</p>
                <p className="answer-text">
                  {selectedQuestion.respuestaCorrecta}
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {state.error && (
        <div className="error-banner" style={{ background: "#fee", color: "#c00", padding: "10px", margin: "10px", borderRadius: "4px", border: "1px solid #c00", fontWeight: "bold" }}>
          Error: {state.error}
        </div>
      )}

      <footer className="host-controls">
        {state.turn.phase === "idle" && (
          <button onClick={() => dispatch({ type: "SPIN" })}>Girar</button>
        )}
        {state.turn.phase === "clanRevealed" && (
          <>
            <button onClick={() => dispatch({ type: "RESPIN" })}>
              Volver a girar
            </button>
            <button onClick={() => dispatch({ type: "START_QUESTION" })}>
              Mostrar pregunta
            </button>
          </>
        )}
        {state.turn.phase === "questionRunning" && !answerRevealed && (
          <button onClick={() => setAnswerRevealed(true)}>
            Mostrar respuesta
          </button>
        )}
        {state.turn.phase === "questionRunning" && answerRevealed && (
          <button onClick={() => dispatch({ type: "NEXT_TURN" })}>
            Siguiente turno
          </button>
        )}
      </footer>
    </div>
  );
}
