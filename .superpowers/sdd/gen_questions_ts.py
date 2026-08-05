from pathlib import Path
import json

qs = json.loads(
    Path(
        r"c:\Users\kyrian\Documents\06-Scout\Scout\Encuentro_Rover\.superpowers\sdd\questions_extracted.json"
    ).read_text(encoding="utf-8")
)

for q in qs:
    if q["id"] == 109 and "primeros" in q["texto"].lower():
        q["texto"] = "¿Quién es considerado el descubridor de Gilwell?"
        q["respuestaCorrecta"] = "Percy Baden-Powell Nevill."
    if q["id"] == 7 and q["respuestaCorrecta"].rstrip().endswith("todas"):
        q["respuestaCorrecta"] = q["respuestaCorrecta"].rstrip() + " las decisiones."
    if q["id"] == 37 and q["respuestaCorrecta"].startswith("Esta "):
        q["respuestaCorrecta"] = "Está" + q["respuestaCorrecta"][4:]

lines: list[str] = []
lines.append('import type { Question, Rng } from "./types";')
lines.append("")
lines.append("export const QUESTIONS: Question[] = [")
for q in qs:
    texto = json.dumps(q["texto"], ensure_ascii=False)
    resp = json.dumps(q["respuestaCorrecta"], ensure_ascii=False)
    lines.append("  {")
    lines.append(f"    id: {q['id']},")
    lines.append(f"    texto: {texto},")
    lines.append(f"    respuestaCorrecta: {resp},")
    lines.append("  },")
lines.append("];")
lines.append("")
lines.append("export function pickRandomUnused(")
lines.append("  usedIds: number[],")
lines.append("  questions: Question[],")
lines.append("  rng: Rng,")
lines.append("): Question {")
lines.append("  const available = questions.filter((q) => !usedIds.includes(q.id));")
lines.append('  if (available.length === 0) throw new Error("No unused questions left");')
lines.append("  const index = Math.min(")
lines.append("    available.length - 1,")
lines.append("    Math.floor(rng() * available.length),")
lines.append("  );")
lines.append("  return available[index];")
lines.append("}")
lines.append("")

out = Path(
    r"c:\Users\kyrian\Documents\06-Scout\Scout\Encuentro_Rover\app\src\game\questions.ts"
)
out.write_text("\n".join(lines), encoding="utf-8")
texts = [q["texto"] for q in qs]
print(f"wrote {out}")
print(f"count={len(qs)} unique_textos={len(set(texts))}")
print("sample:", qs[0]["texto"])
