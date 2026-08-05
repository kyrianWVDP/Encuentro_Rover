# Design: Ruleta de clanes + turno (alcance B)

**Fecha:** 2026-08-05  
**Proyecto:** Justas del Saber — Encuentro Rover 2026  
**Estado:** Implementado — alcance B (2026-08-05)  
**Stack:** React + Vite + TypeScript  

## 1. Objetivo

Entregar el flujo de turno jugable en proyector:

1. Ruleta con **nombres de clanes**
2. Sorteo real del clan (sin repetir dentro de la ronda)
3. Revelación del clan
4. Aparición de una **pregunta al azar** (sin ruleta de preguntas)

Queda fuera de este alcance: timer 60 s, puntaje, panel host oculto, sonidos definitivos, CRUD, offline persistente, mata-mata, export.

## 2. Decisiones de producto (acordadas)

| Tema | Decisión |
|------|----------|
| Alcance | B — anuncio/ruleta de clan → pregunta abierta (listo para timer) |
| Qué gira | Clanes (no números de pregunta) |
| Pregunta | Aparece al azar después; no hay ruleta de preguntas |
| Sorteo de clan | Azar real entre pendientes de la ronda (opción A) |
| Disco visual | Siempre 8 clanes; ya jugados apagados y no elegibles (opción B) |
| Arte | Fondo heráldico Encuentro Rover / FEPE 2026 como base del disco |
| Implementación | CSS/SVG + estado React; ganador elegido *antes* de animar |
| Stack | React + Vite + TypeScript |

### Desvío respecto al cuestionario de Emilio

Emilio pidió ruleta de **números de pregunta** y anuncio previo del clan. Este diseño prioriza ruleta de **clanes** y pregunta aleatoria sin ruleta. Mantener alineado con el equipo antes del evento si hace falta validar el cambio.

## 3. Flujo de estados

```text
idle → spinning → clanRevealed → question
         ↑            │
         └────────────┘  “Volver a girar”
```

| Fase | UI | Acciones host |
|------|----|----------------|
| `idle` | Ruleta visible; pendientes activos; jugados dimmed | **Girar** |
| `spinning` | Animación 3–4 s; controles bloqueados | — |
| `clanRevealed` | Clan ganador destacado | **Volver a girar** / **Mostrar pregunta** |
| `question` | Texto de pregunta (sin respuesta al público) | Fin de alcance B |

### Reglas de transición

- **Girar:** elige uniformemente un `clanId` en pendientes → calcula ángulo → anima → `clanRevealed`.
- **Volver a girar:** vuelve a `spinning` con nuevo sorteo entre pendientes. **No** marca clan jugado. **No** consume pregunta.
- **Mostrar pregunta:** marca clan como jugado; elige pregunta no usada; agrega a usadas; pasa a `question`.
- **Fin de ronda:** cuando `playedClanIds.length === clans.length`, vaciar `playedClanIds` e incrementar `roundNumber` al volver a `idle` (o automáticamente al completar el 8.º “Mostrar pregunta”, dejando listo el siguiente giro).

## 4. Modelo de datos

```ts
type Clan = {
  id: string;
  nombre: string;
  color?: string;
  logoUrl?: string;
};

type Question = {
  id: number;
  texto: string;
  respuestaCorrecta: string; // no mostrar en alcance B (público)
};

type TurnPhase = "idle" | "spinning" | "clanRevealed" | "question";

type RoundState = {
  roundNumber: number; // 1..10 (UI); lógica de tope 10 fuera de B si no hace falta cortar
  playedClanIds: string[];
  usedQuestionIds: number[];
};

type TurnState = {
  phase: TurnPhase;
  selectedClanId: string | null;
  selectedQuestionId: number | null;
};
```

Fixtures iniciales: 8 clanes del cuestionario; subset o banco completo de preguntas (mínimo suficiente para demos; ideal parsear el PDF después).

**Nota de implementación (2026-08-05):** El banco completo del PDF del cuestionario queda **diferido** a una tarea posterior de import. Alcance B usa **12 preguntas fixture** en `app/src/game/questions.ts`. El arte `ruleta-fondo.png` aún no está cableado; la ruleta usa disco sólido + labels (fallback del §6).

## 5. Módulos / responsabilidades

| Módulo | Responsabilidad |
|--------|-----------------|
| `src/game/clans.ts` | Lista canónica de clanes + índice de sector (0..7) |
| `src/game/questions.ts` | Banco + `pickRandomUnused(usedIds, questions, rng)` |
| `src/game/round.ts` | `getPendingClans`, `markClanPlayed`, `advanceRoundIfComplete` |
| `src/game/spin.ts` | `pickClan(pending, rng)`, `angleForClanIndex(index, sectorDeg)`, `buildSpinAnimation(...)` |
| `src/ui/RouletteWheel.tsx` | Fondo + 8 labels + dimmed + rotación + pointer fijo |
| `src/ui/TurnScreen.tsx` | Orquesta fases, botones, contador de ronda |
| `src/App.tsx` | Montaje + estado (`useReducer` preferible) |

Funciones de sorteo y ángulos: **puras** (inyectar `rng` en tests).

## 6. UI y animación

- Fondo: arte Encuentro Nacional de Rovers FEPE 2026 (PNG del evento).
- 8 etiquetas de clan en ángulos fijos (`index * 45°`), calibrados al arte (el PNG no garantiza 8 tablas perfectas; las labels definen los sectores lógicos).
- Pointer fijo (no rota); rota la capa del disco/labels.
- Jugados: `opacity` baja; siguen en el disco.
- Animación: ~3–4 s, easing de desaceleración, 4–6 vueltas extras + ángulo objetivo.
- Contador: `Ronda X` + cantidad de pendientes.
- Fallback si falla el PNG: disco sólido + labels (el turno no se rompe).

## 7. Bordes y errores

- No girar si no hay pendientes (debe haberse avanzado ronda).
- No abrir pregunta si no quedan preguntas libres → mensaje host.
- Ignorar input durante `spinning`.
- “Volver a girar” solo en `clanRevealed`.
- Alcance B no incluye deshacer tras “Mostrar pregunta”.

## 8. Pruebas (Vitest)

1. `pickClan` nunca devuelve un id en `playedClanIds`.
2. Tras marcar 8 clanes jugados, `advanceRoundIfComplete` incrementa ronda y limpia pendientes.
3. `pickRandomUnused` no repite ids usados.
4. Re-giro (simulado a nivel estado) no muta `playedClanIds` ni `usedQuestionIds`.
5. `angleForClanIndex` es estable y distinto por índice.

## 9. Fuera de alcance (siguiente specs)

- Timer 60 s, prórroga, confirmación correcto/incorrecto
- Panel host con respuesta oculta
- Sonidos definitivos, pausa, persistencia offline
- CRUD clanes/logos, export, mata-mata, config de evento

## 10. Criterio de hecho (alcance B)

- [x] App Vite arranca en local
- [x] Se ven 8 clanes sobre el fondo del encuentro (fallback disco sólido; PNG pendiente)
- [x] Girar sortea solo pendientes; jugados quedan apagados
- [x] Re-giro no consume clan ni pregunta
- [x] Mostrar pregunta revela texto al azar no repetido
- [x] Al completar 8 turnos, empieza ronda nueva
- [x] Tests unitarios de sorteo/ronda en verde
