# Design: Fase D — Setup del evento (clanes, config, reinicio)

**Fecha:** 2026-08-05  
**Proyecto:** Justas del Saber — Encuentro Rover 2026  
**Estado:** Implementado — Fase D (2026-08-05)  
**Stack:** React + Vite + TypeScript (`app/`)  
**Depende de:** Fase C + roadmap `2026-08-05-roadmap-post-b.md`  
**Fuente producto:** cuestionario Emilio Agüero

## 1. Objetivo

Pantalla `/setup` para preparar el evento sin tocar código:

- Título, rondas, duración del timer
- CRUD de clanes + **representante** (editable hasta el último momento)
- Logos desde `/logos/*.png` **o sin logo** (mostrar **iniciales**)
- Import opcional de preguntas CSV/JSON; default = banco embebido 200
- Reiniciar **solo la partida** (no borra config/clanes)

## 2. Decisiones acordadas

| Tema | Decisión |
|------|----------|
| Ruta setup | **A** — `/setup` |
| Logos | Archivos en `app/public/logos/` (extraídos del Word); path en config |
| Clan sin logo | Permitido; UI usa **iniciales** + color opcional |
| Reinicio | **A** — solo partida (`GameState`); config intacta |
| Arquitectura | `EventConfig` en `localStorage` (`justas-event-v1`) separado de `justas-game-v1` |

## 3. Alcance

### Incluye
- Ruta `/setup` con formularios de evento / clanes / preguntas / reiniciar partida
- Links entre `/setup`, `/host`, `/`
- `ClanConfig.representante` visible en host/público cuando no vacío
- Logos en ruleta cuando hay `logoUrl`; si vacío/`null` → badge con iniciales
- Agregar N clanes sin límite artificial (mínimo 2 para jugar)
- Import preguntas; volver al banco embebido
- `maxRounds` / `timerSec` / `titulo` desde config hacia el reducer/UI

### No incluye
- Upload de logo a base64 (usar archivos en `/logos/` o iniciales)
- Podio / mata-mata / export (E)
- Sonidos / arte ruleta FEPE (F)
- Pause / IndexedDB hardening (G)

## 4. Modelo de datos

```ts
type ClanConfig = {
  id: string;
  nombre: string;
  representante: string; // "" OK
  logoUrl: string | null; // null | "" → iniciales
  color?: string; // para badge de iniciales
};

type EventConfig = {
  version: 1;
  titulo: string;
  maxRounds: number;
  timerSec: number;
  clans: ClanConfig[];
  questions: Question[] | null; // null → QUESTIONS embebidas
};
```

**Defaults:** 8 clanes actuales con `logoUrl` apuntando a `/logos/{slug}.png` ya en el repo.

**Keys**
- Config: `justas-event-v1`
- Partida: `justas-game-v1` (sin cambios de contrato salvo consumir config)

## 5. Integración con el juego

- `loadEventConfig()` al montar setup/host/público
- `initialGameStateFromConfig(config)` usa `clans`, `maxRounds`, `timerSec`, scores en 0
- Reducer/UI dejan de depender solo de `CLANS` hardcode: `getClans(config)`
- `getActiveQuestions(config)` → `config.questions ?? QUESTIONS`
- **Reiniciar partida:** regenera game state desde config; `publishGameState`
- Guardar clanes con partida en curso: confirmar y ofrecer reinicio (recomendado forzar reinicio al cambiar lista de clanes)

## 6. UI `/setup`

1. **Evento** — título, rondas, segundos → Guardar  
2. **Clanes** — filas: nombre, representante, logo (select de logos conocidos **o** “Sin logo / iniciales”), color opcional, Eliminar; **Agregar clan** (id generado; logo null por defecto)  
3. **Preguntas** — estado banco; file input JSON/CSV; Volver a embebido  
4. **Partida** — Reiniciar partida (confirmación); links a Host / Público  

**Iniciales:** 1–3 letras del `nombre` (ignorar “Clan”, “V”, artículos); fondo `color` o gris.

## 7. Bordes

- < 2 clanes → no Girar en host; aviso en setup  
- Ids únicos  
- Import inválido no pisa banco  
- Logo path roto → tratar como sin logo (iniciales)  
- Representante vacío OK  

## 8. Pruebas (Vitest)

1. Round-trip `EventConfig`  
2. `defaultEventConfig` 8 clanes con logos  
3. `resetGameFromConfig` no muta config  
4. `getActiveQuestions(null questions)` → embebidas  
5. Parse CSV/JSON mínimo válido  
6. Helper `clanInitials(nombre)` estable  

## 9. Criterio de hecho

- [x] `/setup` edita título, rondas, timer y persiste  
- [x] Agregar/editar/borrar clanes; representante editable  
- [x] Clan sin logo muestra iniciales en ruleta/UI  
- [x] Logos existentes se ven desde `/logos/`  
- [x] Reiniciar partida limpia scores/rondas/usadas sin borrar clanes  
- [x] Import preguntas opcional + volver a embebido  
- [x] Host/público usan config (no solo hardcode)  
- [x] Tests D en verde  

## 10. Módulos previstos

| Módulo | Rol |
|--------|-----|
| `src/game/eventConfig.ts` | default, load/save, getClans, getActiveQuestions |
| `src/game/questionImport.ts` | parse CSV/JSON |
| `src/game/clanDisplay.ts` | `clanInitials`, logo-or-initials helpers |
| `src/ui/SetupScreen.tsx` | pantalla `/setup` |
| `src/ui/ClanAvatar.tsx` | img o iniciales |
| `src/App.tsx` | ruta `/setup` |
| Ajustes | `RouletteWheel`, `HostScreen`, `PublicScreen`, `turnReducer`/`initialGameState` |

## 11. Logos ya en repo

Extraídos de `Cuestionario-Emilio-Aguero completo.docx` → `app/public/logos/`:

- `humaita-ps15.png`, `guardia-dragones.png`, `chaco-boreal.png`, `kurusu-peregrino.png`
- `yvy-pyta.png`, `humaita-cf1.png`, `orden-san-jorge.png`, `san-jorge-capadocia.png`
