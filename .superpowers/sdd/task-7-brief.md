### Task 7: Spec checklist + polish design status

**Files:**
- Modify: `docs/superpowers/specs/2026-08-05-ruleta-turno-design.md` (marcar criterios de hecho)

- [ ] **Step 1: Verificar criterios de hecho del spec §10**

- [ ] **Step 2: Anotar en el spec** que el banco completo PDF queda para una tarea posterior de import

- [ ] **Step 3: Commit docs (si aplica)**

```bash
git add docs/superpowers
git commit -m "docs: mark ruleta turno scope B acceptance criteria"
```

---

## Self-review (plan vs spec)

| Spec requirement | Task |
|------------------|------|
| Ruleta de clanes, no de preguntas | 5, 6 |
| Sorteo real entre pendientes | 2, 4 |
| 8 visibles; jugados dimmed | 5 |
| Re-giro sin consumir | 4 |
| Pregunta al azar no repetida | 3, 4, 6 |
| Avance de ronda tras 8 | 3, 4 |
| React+Vite+TS | 1 |
| Tests Vitest listados | 2, 3, 4 |
| Sin timer/puntaje/host panel | Global constraints |

No placeholders TBD. Tipos alineados entre tasks (`Rng`, `RoundState`, `GameState`).
