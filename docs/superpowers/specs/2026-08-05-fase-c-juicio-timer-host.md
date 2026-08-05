# Design: Fase C — Juicio, timer, panel host y puntaje

**Fecha:** 2026-08-05  
**Proyecto:** Justas del Saber — Encuentro Rover 2026  
**Estado:** Implementado — Fase C (2026-08-05)  
**Stack:** React + Vite + TypeScript (app en `app/`)  
**Depende de:** alcance B (ruleta + preguntas) + roadmap `2026-08-05-roadmap-post-b.md`  
**Fuente producto:** cuestionario Emilio Agüero

## 1. Objetivo

Completar el turno en vivo según Emilio:

1. Pregunta + timer 60 s en proyector (sin respuesta)
2. Host ve la respuesta y controla timer / re-giro
3. Host marca Correcta / Incorrecta **con confirmación**
4. Recién entonces se revela la respuesta al público
5. Se actualizan puntajes (10 / 0) y la tabla
6. Dos URLs sincronizadas: `/` público y `/host` operador

## 2. Decisiones acordadas

| Tema | Decisión |
|------|----------|
| Pantallas | **A** — `/` proyector + `/host` operador |
| Sync | **B** — `BroadcastChannel` + fallback `localStorage` |
| Arquitectura | Estado único; **solo el host escribe** |
| Puntaje | Correcta +10; Incorrecta o timeout sin prórroga +0 |
| Timer | 60 s; cortar; reiniciar (prórroga); sync vía `endsAt` |
| Revelación | Después del juicio confirmado (no botón suelto “Mostrar respuesta”) |
| Re-giro / re-timer | Antes de confirmar juicio; no consume puntaje |

## 3. Flujo de fases

```text
idle → spinning → clanRevealed → questionRunning → awaitingJudgement
                                                      │ CONFIRM_JUDGE
                                                      ▼
                                              revealAnswer → showScores → idle
```

| Fase | Público `/` | Host `/host` |
|------|-------------|--------------|
| `idle` | Ruleta + tabla | Girar |
| `spinning` / `clanRevealed` | Ruleta | Re-girar / Mostrar pregunta |
| `questionRunning` | Pregunta + timer (sin respuesta) | + respuesta visible; Cortar / Reiniciar timer / Re-girar |
| `awaitingJudgement` | Pregunta (timer parado) | Correcta / Incorrecta → modal confirmación |
| `revealAnswer` | Pregunta + respuesta oficial | Continuar |
| `showScores` | Tabla actualizada | Siguiente turno |

Al completar **10 rondas**: en C mostrar mensaje de fin de fase regular + tabla (podio/mata-mata = Fase E).

## 4. Modelo de datos

Extiende el estado de B:

```ts
type Judgement = "correct" | "incorrect";

type TimerState = {
  durationSec: number; // default 60
  remainingMs: number;
  running: boolean;
  endsAt: number | null; // epoch ms; fuente de verdad mientras running
};

type TurnPhase =
  | "idle"
  | "spinning"
  | "clanRevealed"
  | "questionRunning"
  | "awaitingJudgement"
  | "revealAnswer"
  | "showScores";

type GameState = {
  round: {
    roundNumber: number;
    playedClanIds: string[];
    usedQuestionIds: number[];
  };
  turn: {
    phase: TurnPhase;
    selectedClanId: string | null;
    selectedQuestionId: number | null;
  };
  scores: Record<string, number>; // clanId → puntos
  timer: TimerState;
  lastJudgement: Judgement | null;
  pendingJudgement: Judgement | null; // elegido, aún no confirmado
  rotationDeg: number;
  maxRounds: number; // 10
  error: string | null;
};
```

### Acciones (host)

| Acción | Efecto |
|--------|--------|
| `SPIN` / `SPIN_FINISHED` / `RESPIN` | Como B |
| `START_QUESTION` | Elige pregunta no usada; `phase=questionRunning`; inicia timer (`endsAt`) |
| `STOP_TIMER` | `running=false`; `phase=awaitingJudgement` |
| `RESTART_TIMER` | Reinicia 60 s; `phase=questionRunning` |
| `ABORT_TURN_RESPIN` | Revierte pregunta a no usada; clan no jugado; vuelve a spin entre pendientes |
| `REQUEST_JUDGE { judgement }` | Set `pendingJudgement` (UI modal) |
| `CANCEL_JUDGE` | Limpia `pendingJudgement` |
| `CONFIRM_JUDGE` | Aplica +10/0; marca clan jugado; `lastJudgement`; `phase=revealAnswer` |
| `ACK_REVEAL` | `phase=showScores` |
| `ACK_SCORES` / `NEXT_TURN` | Avanza ronda si corresponde; `phase=idle` |

Timeout natural: cuando `now >= endsAt` → equivalente a `STOP_TIMER` (host o efecto en host).

## 5. Sync entre pestañas

- Canal: `BroadcastChannel("justas-del-saber")`
- Persistencia: `localStorage["justas-game-v1"]` = JSON del `GameState`
- Tras cada reduce en host: `postMessage(state)` + `setItem`
- Al montar cualquier ruta: hidratar desde `localStorage`
- Escuchar canal (+ `storage` como fallback)
- **Solo `/host` despacha**; `/` es vista derivada

Timer: ambas UIs calculan `remaining = max(0, endsAt - Date.now())` con `requestAnimationFrame` o intervalo local de presentación (no mutan estado en público).

## 6. UI

### Público
- Tipografía grande; timer dominante
- Sin `respuestaCorrecta` hasta `revealAnswer`
- Tabla en `showScores` (y opcionalmente compacta en idle)

### Host
- Respuesta correcta visible desde `questionRunning`
- Controles de timer y juicio
- Modal de confirmación obligatorio antes de puntuar
- Mini-tabla de scores siempre visible
- Banner `error` si aplica

### Migración desde B
- Eliminar flujo “Mostrar respuesta” suelto en `TurnScreen`
- Separar en `PublicScreen` + `HostScreen` + router (`react-router` o rutas Vite simples)

## 7. Bordes

- Confirmación cancelada → no cambia scores
- Re-giro / abort turn antes de confirmar → pregunta no queda en `usedQuestionIds`; clan no en `played`
- Timer 0 → `awaitingJudgement` (Incorrecta o Reiniciar = prórroga)
- 10 rondas completas → fin de fase regular (sin mata-mata en C)
- Abrir solo `/` sin host → último estado guardado o idle

## 8. Pruebas (Vitest)

1. Correcta → +10 al clan; Incorrecta → +0  
2. Sin `CONFIRM_JUDGE` no cambian `scores`  
3. `RESTART_TIMER` deja `endsAt` ~60 s en el futuro  
4. `ABORT_TURN_RESPIN` no deja pregunta usada ni clan jugado  
5. `canShowAnswer(phase)` false hasta `revealAnswer`  
6. Round-trip JSON de `GameState` estable  

## 9. Fuera de alcance C

- Sonidos definitivos (F) — stubs silenciosos OK  
- CRUD / logos / representantes (D)  
- Podio animado + mata-mata + export (E)  
- Pause / offline hardening / recover (G) — `localStorage` sync es base, no es G completo  
- Arte PNG ruleta (F)

## 10. Criterio de hecho

- [x] `/` y `/host` abren y se sincronizan en la misma notebook  
- [x] Público no ve respuesta durante timer  
- [x] Host ve respuesta y puede cortar / reiniciar timer  
- [x] Correcta/Incorrecta exigen confirmación y actualizan puntaje 10/0  
- [x] Tras confirmar, público ve respuesta y luego tabla  
- [x] Re-giro antes de confirmar no consume pregunta ni puntos  
- [x] 10 rondas respetadas al cierre de fase regular  
- [x] Tests unitarios de juicio/timer/abort en verde  

## 11. Módulos previstos

| Módulo | Rol |
|--------|-----|
| `src/game/turnReducer.ts` (ampliar) o `gameReducer.ts` | Transiciones C |
| `src/game/scoring.ts` | `applyJudgement(scores, clanId, judgement)` |
| `src/game/timer.ts` | helpers `startTimer`, `remainingFromEndsAt` |
| `src/game/sync.ts` | BroadcastChannel + localStorage |
| `src/game/selectors.ts` | `canShowAnswer`, scores sorted |
| `src/ui/PublicScreen.tsx` | Vista proyector |
| `src/ui/HostScreen.tsx` | Controles + modal |
| `src/ui/ScoreTable.tsx` | Tabla compartida |
| `src/ui/ConfirmModal.tsx` | Confirmación juicio |
| `src/App.tsx` | Router `/` \| `/host` |
