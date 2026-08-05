# Roadmap — Justas del Saber (post alcance B)

**Fecha:** 2026-08-05  
**Fuente de verdad de producto:** cuestionario Emilio Agüero (completo)  
**Hecho:** alcance B — ruleta de clanes + pregunta al azar + revelar respuesta (parcial); **Fase C** — juicio, timer, panel host, sync `/` + `/host`  
**App:** `app/` (React + Vite + TypeScript)

## 1. Mapa Emilio → estado

| Pedido de Emilio | Estado | Fase |
|------------------|--------|------|
| 8 clanes; 1 representante (puntaje del clan) | Parcial (clanes sí; representantes no) | D |
| Ruleta de clanes; una vez por ronda; 10 rondas | Hecho (tope 10 en reducer) | C |
| Preguntas no se repiten (incl. desempate) | Hecho (pool 200 PDF) | — |
| Pregunta al azar (sin ruleta de números) | Hecho (desvío acordado vs. audio Emilio) | — |
| Timer 60 s; cortar si ya respondió; reiniciar timer | Hecho | C |
| Host: Correcta / Incorrecta + **confirmación** | Hecho | C |
| Antes de confirmar: re-timer o re-ruleta | Hecho | C |
| Puntaje 10 / 0 (sin bonus de tiempo) | Hecho | C |
| Respuesta oficial **después** de juzgar (no antes al público) | Hecho | C |
| Panel host (ve respuesta) ≠ pantalla pública (pregunta + timer) | Hecho (`/` + `/host`) | C |
| Tabla de posiciones tras cada turno | Hecho | C |
| Podio 1–2–3 + clasificación final | Pendiente | E |
| Empate → mata-mata con preguntas nuevas | Pendiente | E |
| Sonidos (ruleta, 10 s, fin, acierto, error) | Pendiente | F |
| Animaciones clan / ruleta / tabla | Parcial (ruleta) | F |
| Offline-first + guardado automático | Pendiente | G |
| Pausa general | Pendiente | G |
| CRUD clanes + logos + representantes editables | Pendiente | D |
| Cargar banco preguntas | Hecho (fixtures TS); UI carga CSV luego | D |
| Export PDF/Excel resultados | Pendiente | E |
| Reiniciar competencia / reutilizar evento | Pendiente | D |
| Config sin código (nombre, rondas, timer) | Pendiente | D |
| Arte fondo encuentro en ruleta | Pendiente (fallback sólido) | F |
| Título Encuentro Rover 2026 / Justas del Saber | Hecho | — |

## 2. Fases de planificación / implementación

Cada fase = **spec** (`docs/superpowers/specs/`) → **plan** (`docs/superpowers/plans/`) → SDD.

### Fase C — Juego en vivo ✅ **Implementado**
**Objetivo:** turno completo jugable el día del evento.

- Timer 60 s (corte manual, reinicio; aviso a 10 s → Fase F)
- Host marca Correcta / Incorrecta con **confirmación**
- Antes de confirmar: reiniciar timer o volver a girar (sin consumir)
- Puntaje: +10 / 0; actualizar tabla
- Orden de revelación: pregunta (+ timer) → juzgar → **entonces** respuesta oficial
- Dos superficies: **público** (proyector) y **host** (respuesta + botones)
- Contador de ronda con tope 10
- UI: `PublicScreen` + `HostScreen`; sync `BroadcastChannel` + `localStorage`

**Spec:** `2026-08-05-fase-c-juicio-timer-host.md` — 34 tests en verde.

### Fase D — Datos y setup del evento
- Representantes por clan (editables hasta el último momento)
- CRUD clanes + logos (PNG)
- Import CSV/JSON del banco (además del PDF ya embebido)
- Config: nombre evento, nº rondas, segundos
- Reiniciar competencia limpia

### Fase E — Cierre y desempate
- Pantalla final: podio + tabla completa
- Mata-mata entre empatados (preguntas nuevas, sin repetir)
- Export resultados PDF y/o Excel

### Fase F — Show (Kahoot / Rover)
- Sonidos definitivos
- Animación anuncio de clan + actualización de tabla
- Cablear `ruleta-fondo.png` (arte FEPE)
- Pulido visual proyector

### Fase G — Robustez evento
- Offline-first (sin depender de GitHub Pages en vivo)
- Autoguardado (localStorage / IndexedDB): puntajes, usadas, turno
- Botón pausa general
- Recuperar partida tras corte de luz / cierre de pestaña

## 3. Orden recomendado

```text
C (jugar de verdad) → D (setup día-D) → E (final/empates) → F (show) → G (a prueba de fallos)
```

C bloquea el ensayo útil. D puede avanzar en paralelo de contenido (logos). G preferible antes del evento aunque F sea cosmético.

## 4. Decisiones ya cerradas (no reabrir salvo Emilio)

- Ruleta de **clanes**, no de números de pregunta  
- Pregunta **aleatoria** del pool  
- Puntaje **fijo** 10 / 0  
- Offline prioritario  
- Justa = actividad del encuentro (no “otra arma secreta” en el sistema)

## 5. Próximo entregable de diseño

**Spec Fase D** — CRUD clanes, representantes, logos, config del evento.

Fase C cerrada (2026-08-05): spec + plan + SDD + implementación + criterios §10 verificados.
