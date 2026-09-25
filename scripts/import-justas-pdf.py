# -*- coding: utf-8 -*-
"""Import Justas del saber.pdf → questions.ts + questions-revisadas.json.

Canonical source: docs/Justas_del_saber.pdf
"""
from __future__ import annotations

import json
import re
import shutil
from pathlib import Path

from pypdf import PdfReader

ROOT = Path(__file__).resolve().parent.parent
PDF_SRC = Path(r"c:\Users\kyrian\Downloads\Justas del saber.pdf")
PDF_DEST = ROOT / "docs" / "Justas_del_saber.pdf"
OLD_PDF = ROOT / "docs" / "Justas_del_Saber_Rover_buhito_un_poco_mas_grande.pdf"
OUT_TS = ROOT / "app" / "src" / "game" / "questions.ts"
OUT_JSON = ROOT / "app" / "public" / "questions-revisadas.json"
OUT_EXTRACTED = ROOT / ".superpowers" / "sdd" / "questions_extracted.json"


def clean_ws(s: str) -> str:
    return re.sub(r"\s+", " ", s).strip()


def parse_pdf(path: Path) -> list[dict]:
    reader = PdfReader(str(path))
    text = "\n".join((p.extract_text() or "") for p in reader.pages)
    lines: list[str] = []
    for ln in text.splitlines():
        ln = ln.strip()
        if not ln:
            continue
        if ln.upper() == "JUSTAS DEL SABER ROVER":
            continue
        if re.match(r"^[IVXLC]+\.\s+", ln):
            continue
        lines.append(ln)
    joined = "\n".join(lines)
    parts = re.split(r"(?m)^(\d+)\.\s+", joined)
    qs: list[dict] = []
    for i in range(1, len(parts), 2):
        qid = int(parts[i])
        body = parts[i + 1].strip()
        m = re.match(r"(.*?)\?\s*(.*)", body, flags=re.S)
        if not m:
            raise SystemExit(f"No ? found for id={qid}: {body[:120]!r}")
        texto = clean_ws(m.group(1) + "?")
        respuesta = clean_ws(m.group(2))
        if not respuesta:
            raise SystemExit(f"Empty answer for id={qid}")
        qs.append({"id": qid, "texto": texto, "respuestaCorrecta": respuesta})
    if not qs:
        raise SystemExit("No questions parsed from PDF")
    expected = list(range(1, len(qs) + 1))
    got = [q["id"] for q in qs]
    if got != expected:
        raise SystemExit(f"Non-contiguous ids: got {got[:5]}...{got[-3:]}")
    return qs


def write_ts(qs: list[dict], path: Path) -> None:
    lines: list[str] = [
        "import type { Question, Rng } from \"./types\";",
        "",
        "// Source of truth: docs/Justas_del_saber.pdf (regenerate via scripts/import-justas-pdf.py)",
        "export const QUESTIONS: Question[] = [",
    ]
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
    lines.append(
        """export function pickRandomUnused(
  usedIds: number[],
  questions: Question[],
  rng: Rng,
): Question {
  const available = questions.filter((q) => !usedIds.includes(q.id));
  if (available.length === 0) throw new Error("No unused questions left");
  const index = Math.min(
    available.length - 1,
    Math.floor(rng() * available.length),
  );
  return available[index];
}
"""
    )
    path.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    if not PDF_SRC.is_file():
        raise SystemExit(f"Missing PDF: {PDF_SRC}")

    PDF_DEST.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(PDF_SRC, PDF_DEST)
    print(f"Copied: {PDF_DEST}")

    if OLD_PDF.is_file():
        OLD_PDF.unlink()
        print(f"Deleted previous source: {OLD_PDF.name}")

    qs = parse_pdf(PDF_DEST)
    print(f"Parsed {len(qs)} questions")

    # PDF extraction truncates id 7; keep the full canonical sentence.
    for q in qs:
        if q["id"] == 7:
            q["respuestaCorrecta"] = (
                "Dirigir responsablemente la propia vida, elegir un camino "
                "y no esperar que otras personas tomen todas las decisiones."
            )
            break

    write_ts(qs, OUT_TS)
    print(f"Wrote {OUT_TS}")

    OUT_JSON.write_text(
        json.dumps(qs, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {OUT_JSON}")

    OUT_EXTRACTED.parent.mkdir(parents=True, exist_ok=True)
    OUT_EXTRACTED.write_text(
        json.dumps(qs, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {OUT_EXTRACTED}")

    print("\nSamples:")
    for q in qs[:2] + qs[6:7] + qs[-2:]:
        print(f"  {q['id']}. {q['texto']}")
        print(f"     -> {q['respuestaCorrecta']}")


if __name__ == "__main__":
    main()
