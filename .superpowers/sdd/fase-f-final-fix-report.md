# Fase F — Final Review Fix Report

**Fecha:** 2026-08-06
**Alcance:** Findings "Important" + Minor seguros del code review final de Fase F.

## Fix notes

### 1. Spec §8 honesty (`docs/superpowers/specs/2026-08-06-fase-f-show-sonidos.md`)

Los tres checkboxes de audio en runtime (giro/acierto/error suenan, sin doble audio,
mute silencia) ahora aclaran explícitamente que están **verificados por tests
unitarios y arquitectura** (`soundTransitions.test.ts`, `sounds.test.ts`,
`useGameSounds` + `playSound`), y que el **walkthrough manual en navegador está
pendiente**. No se afirma falsamente que se hizo una prueba manual. El resto de
los checks de §8 quedan sin cambios.

### 2. Mute test real assertion (`app/src/game/sounds.test.ts`)

El test de `playSound` con mute quedaba sin ninguna verificación de que
`Audio` no se construya. Se agregó un helper `stubMockAudio()` (reutiliza el
patrón `MockAudio` + `vi.stubGlobal("Audio", ...)` ya usado en el test de
`unlockAudio`) y el test ahora afirma `expect(MockAudio).not.toHaveBeenCalled()`
con `mute=true`. Se separó el caso "stub sin archivo" en su propio test
(sigue siendo no-throw, sin necesidad de mock). Se agregó
`afterEach(() => vi.unstubAllGlobals())` para no filtrar el stub de `Audio`
entre tests.

### 3. iOS unlock (`app/src/game/sounds.ts`)

`unlockAudio()` ahora setea `audio.muted = true` además de `volume = 0`,
requerido por Safari/iOS para permitir el autoplay silencioso de
desbloqueo.

### 4. Zero Vite warning (`app/src/ui/RouletteWheel.css`)

Se comentó la línea `background-image: url("/ruleta-fondo.png");` con un
TODO indicando que se debe descomentar cuando FEPE entregue el PNG. Se
mantiene `background-color: #4a4a4a` como fallback. No se inventó ningún
PNG ni asset.

### 5. Roadmap PDF (`docs/superpowers/specs/2026-08-05-roadmap-post-b.md`)

La fila "Export PDF resultados" en la tabla §1 se movió de fase `F` a
`post-F / G`, para que la Fase F (cerrada) no siga apareciendo como dueña
de un entregable pendiente.

## Minor (safe) fixes también aplicados

- **Score flash selector scope:** `app/src/ui/ScoreTable.css` — el selector
  `tr.highlighted` (global, cualquier tabla) se acotó a
  `.score-table tr.highlighted`, alineado con la clase real que usa
  `ScoreTable.tsx`.
- **Test soundTransitions RESPIN → spinning:** se agregó
  `it("emits spin again on RESPIN → spinning", ...)` en
  `app/src/game/soundTransitions.test.ts`, replicando el patrón RESPIN de
  `turnReducer.test.ts` (SPIN → SPIN_FINISHED → RESPIN) y verificando que
  `soundsForTransition` vuelve a emitir `"spin"`.
- **Dead `isAudioUnlocked` export:** se confirmó que ningún código fuera de
  `sounds.test.ts` lo usaba (`PublicScreen.tsx` / `HostScreen.tsx` solo usan
  `unlockAudio`). Se eliminó la función y la variable de estado interna
  `unlocked` de `app/src/game/sounds.ts`. El test de `unlockAudio` ahora
  verifica la construcción del mock de `Audio` (`MockAudio` llamado con la
  URL correcta, `volume = 0`, `muted = true`, `play()` invocado) en lugar de
  `isAudioUnlocked()`.

## Test + build output

### `npx vitest run src/game/sounds.test.ts src/game/soundTransitions.test.ts`

```
 RUN  v4.1.10 C:/Users/kyrian/Documents/06-Scout/Scout/Encuentro_Rover/app

 Test Files  2 passed (2)
      Tests  11 passed (11)
   Start at  19:13:00
   Duration  4.25s (transform 262ms, setup 0ms, import 391ms, tests 37ms, environment 3.71s)
```

### `npm test`

```
> app@0.0.0 test
> vitest run --passWithNoTests

 RUN  v4.1.10 C:/Users/kyrian/Documents/06-Scout/Scout/Encuentro_Rover/app

 Test Files  15 passed (15)
      Tests  79 passed (79)
   Start at  19:13:19
   Duration  4.67s (transform 1.18s, setup 0ms, import 2.00s, tests 225ms, environment 4.09s)
```

### `npm run build`

```
> app@0.0.0 build
> tsc -b && vite build

vite v8.2.0 building client environment for production...
✓ 56 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.45 kB │ gzip:  0.29 kB
dist/assets/index-Du6wpIlS.css   15.29 kB │ gzip:  3.93 kB
dist/assets/index-6RMFX5A6.js   286.71 kB │ gzip: 90.41 kB

✓ built in 570ms
```

No warning about missing `ruleta-fondo.png` — the reference is commented out,
so Vite never attempts to resolve it.

## Files changed

- `docs/superpowers/specs/2026-08-06-fase-f-show-sonidos.md`
- `docs/superpowers/specs/2026-08-05-roadmap-post-b.md`
- `app/src/game/sounds.ts`
- `app/src/game/sounds.test.ts`
- `app/src/game/soundTransitions.test.ts`
- `app/src/ui/RouletteWheel.css`
- `app/src/ui/ScoreTable.css`
