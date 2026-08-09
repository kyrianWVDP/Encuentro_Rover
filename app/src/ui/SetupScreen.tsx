import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  loadEventConfig,
  saveEventConfig,
} from "../game/eventConfig";
import type { EventConfig, ClanConfig } from "../game/eventConfig";
import { parseQuestionsJson, parseQuestionsCsv } from "../game/questionImport";
import { initialGameStateFromConfig } from "../game/turnReducer";
import { publishGameState, loadGameState } from "../game/sync";
import { ClanAvatar } from "./ClanAvatar";
import { ConfirmModal } from "./ConfirmModal";
import "./SetupScreen.css";

const KNOWN_LOGOS = [
  "/logos/guardia-dragones.png",
  "/logos/humaita-ps15.png",
  "/logos/chaco-boreal.png",
  "/logos/orden-san-jorge.png",
  "/logos/kurusu-peregrino.png",
  "/logos/humaita-cf1.png",
  "/logos/san-jorge-capadocia.png",
  "/logos/yvy-pyta.png",
];

export function SetupScreen() {
  const [config, setConfig] = useState<EventConfig>(() => loadEventConfig());
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleSave = () => {
    saveEventConfig(config);
    const current = loadGameState();
    if (current) {
      publishGameState({
        ...current,
        maxRounds: config.maxRounds,
        timerSec: config.timerSec,
      });
    }
    alert(
      "Configuración guardada. Rondas y timer se aplican a la partida actual. Para empezar de cero usá «Reiniciar Partida».",
    );
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ ...config, titulo: e.target.value });
  };
  const handleRoundsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ ...config, maxRounds: Number(e.target.value) || 1 });
  };
  const handleTimerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ ...config, timerSec: Number(e.target.value) || 10 });
  };

  // Clan actions
  const handleClanChange = (id: string, field: keyof ClanConfig, value: string | null) => {
    setConfig({
      ...config,
      clans: config.clans.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    });
  };

  const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

  const handleAddClan = () => {
    const baseNombre = "Nuevo Clan";
    const randomShort = Math.random().toString(36).substring(2, 6);
    const newClan: ClanConfig = {
      id: `${slugify(baseNombre)}-${randomShort}`,
      nombre: baseNombre,
      representante: "",
      logoUrl: null,
    };
    setConfig({ ...config, clans: [...config.clans, newClan] });
  };

  const handleRemoveClan = (id: string) => {
    if (config.clans.length <= 2) {
      alert("No se pueden tener menos de 2 clanes.");
      return;
    }
    setConfig({
      ...config,
      clans: config.clans.filter((c) => c.id !== id),
    });
  };

  // Questions actions
  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      let parsed;
      if (file.name.endsWith(".json")) {
        parsed = parseQuestionsJson(text);
      } else if (file.name.endsWith(".csv")) {
        parsed = parseQuestionsCsv(text);
      } else {
        throw new Error("Formato no soportado. Usa JSON o CSV.");
      }
      setConfig({ ...config, questions: parsed });
      alert(`Importadas ${parsed.length} preguntas correctamente.`);
    } catch (err) {
      alert(`Error al importar: ${err instanceof Error ? err.message : String(err)}`);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRevertQuestions = () => {
    setConfig({ ...config, questions: null });
  };

  // Game state actions
  const confirmResetGame = () => {
    saveEventConfig(config); // Always save latest changes first
    publishGameState(initialGameStateFromConfig(config));
    setResetConfirmOpen(false);
    navigate("/host");
  };

  return (
    <main className="setup-screen">
      <header className="setup-header">
        <h1>Configuración del Evento</h1>
        <div className="setup-nav">
          <Link to="/host" className="nav-btn">Ir al Host</Link>
          <Link to="/" className="nav-btn">Ir al Público</Link>
        </div>
      </header>

      {config.clans.length < 2 && (
        <div className="error-banner">
          Error: Se necesitan al menos 2 clanes para jugar.
        </div>
      )}

      <div className="setup-grid">
        <section className="setup-section config-section">
          <h2>Evento</h2>
          <div className="form-group">
            <label>Título:</label>
            <input type="text" value={config.titulo} onChange={handleTitleChange} />
          </div>
          <div className="form-group">
            <label>Rondas Máximas:</label>
            <input type="number" min="1" value={config.maxRounds} onChange={handleRoundsChange} />
          </div>
          <div className="form-group">
            <label>Segundos por Turno:</label>
            <input type="number" min="10" value={config.timerSec} onChange={handleTimerChange} />
          </div>
          <button className="primary-btn" onClick={handleSave}>Guardar Evento</button>
        </section>

        <section className="setup-section file-section">
          <h2>Banco de Preguntas</h2>
          <p>Estado actual: {config.questions === null ? "Embebido por defecto" : `Personalizado (${config.questions.length} preguntas)`}</p>
          
          <div className="file-actions">
            <input
              type="file"
              accept=".json,.csv"
              ref={fileInputRef}
              onChange={handleImportFile}
              id="file-upload"
              className="hidden-input"
            />
            <label htmlFor="file-upload" className="action-btn">Importar CSV/JSON</label>
            <button className="action-btn danger-text" onClick={handleRevertQuestions} disabled={config.questions === null}>
              Volver a Embebidas
            </button>
          </div>
        </section>

        <section className="setup-section game-section">
          <h2>Partida</h2>
          <p>Para aplicar estos cambios (excepto título) a una partida en curso, es necesario reiniciarla.</p>
          <button className="danger-btn" onClick={() => setResetConfirmOpen(true)}>
            Reiniciar Partida
          </button>
        </section>

        <section className="setup-section clans-section">
          <div className="clans-header">
            <h2>Clanes ({config.clans.length})</h2>
            <button className="add-btn" onClick={handleAddClan}>+ Agregar Clan</button>
          </div>
          
          <div className="clans-list">
            {config.clans.map((clan) => (
              <div key={clan.id} className="clan-row">
                <ClanAvatar nombre={clan.nombre} logoUrl={clan.logoUrl} color={clan.color} size={48} />
                
                <div className="clan-inputs">
                  <input
                    type="text"
                    placeholder="Nombre del Clan"
                    value={clan.nombre}
                    onChange={(e) => handleClanChange(clan.id, "nombre", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Representante (opcional)"
                    value={clan.representante}
                    onChange={(e) => handleClanChange(clan.id, "representante", e.target.value)}
                  />
                  <select
                    value={clan.logoUrl ?? ""}
                    onChange={(e) => handleClanChange(clan.id, "logoUrl", e.target.value === "" ? null : e.target.value)}
                  >
                    <option value="">Sin logo (iniciales)</option>
                    {KNOWN_LOGOS.map((path) => (
                      <option key={path} value={path}>{path.replace("/logos/", "")}</option>
                    ))}
                  </select>
                </div>
                
                <button className="remove-btn" onClick={() => handleRemoveClan(clan.id)} title="Eliminar Clan">✕</button>
              </div>
            ))}
          </div>
        </section>
      </div>

      <ConfirmModal
        open={resetConfirmOpen}
        title="Reiniciar Partida"
        message="¿Estás seguro? Esto borrará los puntajes actuales, historial de rondas y preguntas usadas."
        onConfirm={confirmResetGame}
        onCancel={() => setResetConfirmOpen(false)}
      />
    </main>
  );
}
