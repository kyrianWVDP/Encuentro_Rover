# Design: Fase E — Podio, mata-mata y export CSV

**Fecha:** 2026-08-05  
**Proyecto:** Justas del Saber — Encuentro Rover 2026  
**Estado:** Implementado — Fase E (2026-08-05)  
**Stack:** React + Vite + TypeScript (`app/`)  
**Depende de:** Fases C–D  
**Fuente:** cuestionario Emilio Agüero

## 1. Objetivo

Al terminar la fase regular:

1. Detectar empates y resolverlos con **mata-mata automático** (preguntas nuevas, sin repetir).
2. Mostrar **podio 1.º–2.º–3.º** + clasificación completa.
3. Permitir **descargar CSV** de resultados (abre en Excel).

## 2. Decisiones

| Tema | Decisión |
|------|----------|
| Empates | **A** — mata-mata automático por grupos de prioridad |
| Export | **A** — CSV (`puesto,clan,representante,puntos`) |
| Arquitectura | **1** — modo `tiebreak`/`final` en el mismo reducer |

## 3. Flujo

```text
regularComplete
  → BEGIN_FINALE
      → si hay empates: mode=tiebreak (grupo de mayor prioridad)
      → si no: mode=final
tiebreak (mismo turno C, solo tiebreakClanIds activos)
  → al resolver grupo → siguiente grupo o mode=final
final → podio + tabla + Descargar CSV
```

Prioridad de empates: primero el bloque que disputa el **mejor** puesto (1.º, luego 2.º, …).

## 4. Modelo

```ts
type GameMode = "regular" | "tiebreak" | "final";

// en GameState:
mode: GameMode;
tiebreakClanIds: string[] | null;
```

- `usedQuestionIds` **global** (mata-mata no reinicia el pool).
- En tiebreak, `getPendingClans` / ruleta usan solo `tiebreakClanIds`.
- Puntaje mata-mata: mismo +10 / 0 sobre `scores` (desempata el total).

**Helpers**
- `rankClans(scores, clans)` → `{ clanId, puesto, puntos }[]`
- `nextTieGroup(ranking)` → `string[] | null`
- `buildResultsCsv(titulo, rows)` → string
- `downloadCsv(filename, content)` (UI)

## 5. UI

- Banner “Mata-mata” en tiebreak (público + host).
- Ruleta: solo grupo activo.
- `FinalScreen` / sección final: podio + `ScoreTable` + CSV.
- Host: botón CSV; link setup / reiniciar partida (D).

## 6. Bordes

- Sin preguntas → error host.
- `BEGIN_FINALE` solo si `regularComplete`.
- CSV UTF-8 (BOM `\uFEFF` para Excel Windows).
- 3+ empatados: el grupo sigue hasta orden interno claro.

## 7. Tests

1. `rankClans` con empates  
2. `nextTieGroup` prioridad  
3. CSV columnas correctas  
4. Tiebreak no reusa preguntas usadas  
5. Sin empates → final directo  

## 8. Criterio de hecho

- [x] Tras 10 rondas, entra tiebreak o final según scores  
- [x] Mata-mata solo entre empatados; preguntas nuevas  
- [x] Podio 1–2–3 + tabla  
- [x] Descargar CSV usable en Excel  
- [x] Tests E en verde  

## 9. Fuera de alcance

PDF, sonidos (F), pause (G).
