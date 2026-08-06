# Design: Fase F — Show (sonidos, animaciones, arte ruleta)

**Fecha:** 2026-08-06  
**Proyecto:** Justas del Saber — Encuentro Rover 2026  
**Estado:** Diseño aprobado — pendiente plan + implementación  
**Stack:** React + Vite + TypeScript (`app/`)  
**Depende de:** Fases C–E  
**Fuente:** cuestionario Emilio Agüero + links YouTube / MP3 locales

## 1. Objetivo

Dar “show” al proyector:

1. Sonidos en los momentos clave (con los MP3 ya descargados).
2. Animación breve al anunciar clan y al actualizar la tabla.
3. Cablear fondo de ruleta FEPE si existe el PNG.
4. Mute opcional desde el host (afecta al proyector).

## 2. Decisiones

| Tema | Decisión |
|------|----------|
| Assets faltantes (Inicio, 10 s, fin tiempo) | **A** — stubs; cablear cuando lleguen MP3 |
| Arquitectura audio | **1** — motor central `playSound` + hook en proyector |
| Dónde suena | Solo pantalla pública `/` (evitar doble audio) |
| Banderita Mario | `winner` — ganador / podio final |
| Sonido “Victoria” | `correct` — cada acierto confirmado |
| Mario game over | `incorrect` |
| Ruleta Preguntados | `spin` |
| Mute | Botón en host → `localStorage` `justas-mute-v1` |

## 3. Archivos de audio

Ubicación canónica: `app/public/sounds/` (no `dist/`; `dist` se regenera).

| Evento | Archivo | Origen actual (renombrar) | Disparo |
|--------|---------|---------------------------|---------|
| `spin` | `spin.mp3` | `moviendo la ruleta en preguntados.mp3` | Entrada a fase `spinning` |
| `correct` | `correct.mp3` | `Sonido de Victoria…mp3` | Juicio confirmado **correcta** |
| `incorrect` | `incorrect.mp3` | `SUPER MARIO - game over…mp3` | Juicio confirmado **incorrecta** |
| `winner` | `winner.mp3` | `Sonido banderita mario bros.mp3` | Entrada a fase `final` (podio) |
| `start` | — (stub) | Link Emilio “Inicio” | Futuro: arranque de justa |
| `timer10` | — (stub) | Pedido original Emilio | Futuro: quedan ≤10 s |
| `timerEnd` | — (stub) | Pedido original Emilio | Futuro: timer a 0 |

Referencias YouTube (solo vibe / origen; no embeber en runtime):

- Correcto (ref.): https://youtu.be/p2fiWcDgb80 — en app usamos el MP3 “Victoria” como `correct`
- Giro: https://youtube.com/shorts/3C25qkD9BtY
- Incorrecto: https://youtu.be/BVQ_JHmvhCM
- Ganador: https://youtu.be/BtE5WBhgLNw — en app usamos banderita Mario como `winner`
- Inicio: https://youtube.com/shorts/6GqccLoRnlg — pendiente de archivo

## 4. Arquitectura de sonido

```text
PublicScreen (+ FinalScreen vía phase final)
  → useGameSounds(prevState, state)
       → playSound(event)
            → si mute: no-op
            → si falta archivo: no-op (stub)
            → else: HTMLAudioElement.play()
```

- Módulo: `app/src/game/sounds.ts` — mapa evento → `/sounds/*.mp3`, `playSound`, `isMuted` / `setMuted`.
- Hook: `app/src/ui/useGameSounds.ts` — compara transiciones de `turn.phase` y juicio confirmado.
- Unlock autoplay: primer gesto del operador (clic en host o público) llama `unlockAudio()` una vez.
- Host **no** llama `playSound` (solo escribe mute). El proyector lee mute desde `localStorage` (+ evento `storage` o flag en sync si hace falta en la misma máquina).

### Reglas de disparo

| Transición | Evento |
|------------|--------|
| cualquier → `spinning` | `spin` |
| confirmación juicio → `revealAnswer` + judgement `correct` | `correct` |
| confirmación juicio → `revealAnswer` + judgement `incorrect` | `incorrect` |
| → `final` | `winner` |

No disparar en re-renders sin cambio de fase. Re-giro (`RESPIN` → `spinning`) sí vuelve a sonar `spin`.

## 5. Show visual

1. **Anuncio de clan** (`clanRevealed`): logo/nombre con pulse/scale breve (~1–1.5 s) en proyector.
2. **Tabla**: highlight de la fila del clan que acaba de jugar al entrar en `showScores`.
3. **Fondo ruleta**: si existe `app/public/ruleta-fondo.png` (o `app/src/assets/ruleta-fondo.png`), activar `background-image` en `RouletteWheel.css`; si no, mantener fallback gris actual.
4. Sin cards nuevas ni rediseño global del proyector.

## 6. UI host (mute)

- Toggle “Silenciar sonidos” en `/host`.
- Persistencia: `localStorage` key `justas-mute-v1` (`"1"` / `"0"`).
- Efecto: `playSound` en el proyector no reproduce.

## 7. Tests

1. Mapa: cada evento con archivo resuelve la URL esperada; stubs sin archivo no lanzan.
2. `playSound` con mute=true → no llama `Audio.play`.
3. Detección de transición: `→ spinning` ⇒ `spin`; confirm correct ⇒ `correct`; `→ final` ⇒ `winner`.
4. (Opcional UI) mute toggle escribe `localStorage`.

## 8. Criterio de hecho

- [ ] Los 4 MP3 viven en `app/public/sounds/` con nombres estables
- [ ] Giro / acierto / error / ganador final suenan en el proyector en el momento correcto
- [ ] Sin doble audio host+público
- [ ] Stubs Inicio/10s/fin no rompen
- [ ] Mute en host silencia el proyector
- [ ] Anuncio de clan + highlight de fila visibles
- [ ] Fondo ruleta cableado **si** hay PNG; si no, fallback OK
- [ ] Tests F en verde

## 9. Fuera de alcance

- Export PDF
- Sonidos Inicio / 10 s / fin de tiempo (hasta tener MP3)
- Pause / offline robusto (Fase G)
- Rediseño completo de branding del proyector
