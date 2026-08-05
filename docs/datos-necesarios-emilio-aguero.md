# Datos y decisiones pendientes — Emilio Agüero

**Proyecto:** Justa del Saber / Encuentro Rover  
**Fecha:** 2026-08-03  
**Contexto:** Audios WhatsApp (2026-08-02) + definiciones ya cerradas con el equipo

Este documento lista **solo lo que necesitamos de Emilio** para poder diseñar e implementar sin inventar reglas. Al final hay un resumen de lo ya decidido, para que pueda validar o corregir.

---

## 1. Archivos / datos a entregar

| # | Qué | Formato preferido | Notas |
|---|-----|-------------------|--------|
| 1.1 | Lista de **clanes** que participan | Excel / CSV | Nombre oficial de cada clan (como debe verse en pantalla) |
| 1.2 | **Logos** de clanes | PNG o SVG (ideal fondo transparente) | Confirmar si existen; si faltan, acordar placeholder (iniciales + color) |
| 1.3 | Banco de **preguntas** | Excel / CSV | Ver columnas sugeridas abajo |
| 1.4 | Lista de **participantes** | Excel / CSV | Solo asistencia/registro; **no** entran al juego en vivo |
| 1.5 | Cantidad aproximada | — | Nº de clanes y nº de preguntas el día del evento |

### Columnas sugeridas — Clanes

| Columna | Obligatorio | Ejemplo |
|---------|-------------|---------|
| `clan_id` | Sí | `clan_01` |
| `nombre` | Sí | `Clan Halcones` |
| `logo_archivo` | Si hay logo | `halcones.png` |
| `color` | Opcional | `#1B4F72` |

### Columnas sugeridas — Preguntas

| Columna | Obligatorio | Ejemplo |
|---------|-------------|---------|
| `pregunta_id` | Sí | `1` |
| `texto` | Sí | `¿Cuál es la ley scout?` |
| `respuesta_correcta` | Sí | Texto que ve el host para juzgar |
| `notas_host` | Opcional | Criterios de aceptación / respuestas equivalentes |

### Columnas sugeridas — Participantes (asistencia)

| Columna | Obligatorio | Ejemplo |
|---------|-------------|---------|
| `nombre` | Sí | `Ana Pérez` |
| `clan` | Sí | `Clan Halcones` |
| Otros | Opcional | grupo, rol, etc. |

> Si ya tienen el Excel con otras columnas, **enviar el archivo tal cual** y nos adaptamos.

---

## 2. Decisiones de producto que debe cerrar Emilio

### 2.1 Título en pantalla (prioridad alta)

¿Cómo se llama lo que ve el público?

- Justa del Saber  
- Justa del Saber — Encuentro Rover  
- Encuentro Rover (subtítulo Justa del Saber)  
- Otro: _______________

### 2.2 Respuesta correcta vs. pantalla única (prioridad alta)

El host opera **en la misma pantalla que se proyecta**, pero la app tiene la **respuesta oficial** oculta al público.

¿Cómo prefiere que el host vea la respuesta sin que el salón la lea?

| Opción | Descripción |
|--------|-------------|
| A | Botón que la muestra unos segundos en un rincón |
| B | Segunda ventana chica en la notebook (no proyectada) solo para la respuesta |
| C | Pantalla de preparación (host ve la respuesta) y después proyecta la pregunta sin ella |
| D | Pasar a dos vistas (público + panel host) solo por este motivo |
| E | Otra: _______________ |

### 2.3 Desempate en la tabla final (prioridad media)

Si dos clanes terminan con los mismos puntos:

- Comparten puesto  
- Gana quien tenga más aciertos  
- Gana quien haya usado menos tiempo en los aciertos  
- Otra regla: _______________

### 2.4 Validación del flujo general (prioridad alta)

Confirmar si este flujo es el correcto:

1. Cargar clanes + preguntas (+ participantes solo como lista)  
2. Host gira la **ruleta** → sale **clan** + **pregunta** (la pregunta no se repite; el clan sí puede repetir)  
3. Se muestra pregunta + **timer 60 s**  
4. El clan responde **en voz alta**  
5. Host marca **Correcto / Incorrecto** (o prórroga si hace falta; al vencer el tiempo → 0 salvo prórroga)  
6. Se **revela la respuesta oficial** al público  
7. Se muestran **puntajes**  
8. Siguiente ruleta… hasta agotar preguntas (o host finaliza antes)  
9. **Tabla final** de puntajes + sonidos de cierre  

¿Algo que sobra, falta o cambia?

### 2.5 Puntaje (confirmar números)

Propuesta ya acordada con el equipo (Emilio puede corregir):

```text
Si Correcto:  puntos = 10 + segundos_restantes
Si Incorrecto o tiempo agotado (sin prórroga):  0
Timer: 60 segundos
```

Ejemplo: acierto con 42 s restantes → **52 puntos**.

¿OK o cambiar base / duración?

### 2.6 “Arma secreta” (prioridad baja / contexto)

En el primer audio menciona un acuerdo con Dani sobre un “arma secreta”.  
¿Es **esta Justa del Saber** el arma secreta, o hay otro elemento aparte?

---

## 3. Logística del día (para no fallar en el evento)

| # | Pregunta | Respuesta de Emilio |
|---|----------|---------------------|
| 3.1 | ¿Hay proyector + notebook estables? | |
| 3.2 | ¿Habrá internet el día del evento? (la app irá a **GitHub Pages**) | |
| 3.3 | ¿Quién es el host/operador de la Justa? | |
| 3.4 | ¿Hay ensayo previo? ¿Cuándo? | |
| 3.5 | ¿Quién entrega/aprueba el Excel final de preguntas? | |

---

## 4. Checklist rápido para Emilio

- [ ] Enviar Excel/CSV de **clanes**  
- [ ] Enviar **logos** (o confirmar que usemos placeholders)  
- [ ] Enviar Excel/CSV de **preguntas** con respuesta correcta  
- [ ] Enviar Excel/CSV de **participantes** (asistencia)  
- [ ] Definir **título** en pantalla  
- [ ] Elegir cómo el host ve la **respuesta oculta** (sección 2.2)  
- [ ] Definir **desempate**  
- [ ] Confirmar o corregir **fórmula de puntaje** y flujo (2.4 / 2.5)  
- [ ] Confirmar **internet / proyector** el día del encuentro  
- [ ] Aclarar si “arma secreta” = esta app  

---

## Anexo — Ya decidido (no hace falta reabrir salvo que Emilio objete)

| Tema | Decisión |
|------|----------|
| Tipo de juego | Justa del Saber (estilo show / Kahoot de salón) |
| Quién compite | Clanes |
| Participantes | Solo asistencia; no juegan en la ruleta |
| Cómo responden | En voz alta |
| Quién juzga | Host marca Correcto / Incorrecto en la app |
| Puntaje | Base 10 + segundos restantes; Incorrecto = 0 |
| Timer | 60 s |
| Fin del timer | 0 puntos por defecto; host puede dar prórroga |
| Ruleta | Pregunta no se repite; clan sí puede repetir |
| Fin del juego | Al agotar preguntas, o el host cierra antes |
| Pantalla | Una sola (proyectada); host opera ahí |
| Tras juzgar | Revelar respuesta oficial → puntajes |
| Tras cada pregunta | Mostrar puntajes |
| Al final | Tabla de puntajes |
| Deshacer error del host | Sí: deshacer última ronda |
| Datos | Excel/CSV (+ adaptar archivo existente) |
| Deploy | GitHub Pages (usuario del repo / branch) |
| Idioma UI | Español |
| Sonido | Completo: ruleta, timer, acierto/error, final |

---

**Próximo paso interno:** con las respuestas de Emilio + los Excel, cerrar diseño/MVP e implementar.
