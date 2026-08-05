import type { Question } from "./types";

function assertQuestion(value: unknown, index: number): Question {
  if (typeof value !== "object" || value === null) {
    throw new Error(`Invalid question at index ${index}`);
  }
  const row = value as Record<string, unknown>;
  const id = row.id;
  const texto = row.texto;
  const respuestaCorrecta = row.respuestaCorrecta;
  if (
    (typeof id !== "number" && typeof id !== "string") ||
    typeof texto !== "string" ||
    typeof respuestaCorrecta !== "string" ||
    texto.trim() === "" ||
    respuestaCorrecta.trim() === ""
  ) {
    throw new Error(`Invalid question at index ${index}`);
  }
  return {
    id: typeof id === "string" ? Number(id) : id,
    texto,
    respuestaCorrecta,
  };
}

export function parseQuestionsJson(text: string): Question[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Invalid JSON");
  }
  if (!Array.isArray(parsed)) {
    throw new Error("Expected JSON array");
  }
  return parsed.map((item, index) => assertQuestion(item, index));
}

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === "," && !inQuotes) {
      fields.push(current);
      current = "";
      continue;
    }
    current += ch;
  }
  fields.push(current);
  return fields;
}

export function parseQuestionsCsv(text: string): Question[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    throw new Error("Empty CSV");
  }

  const header = parseCsvLine(lines[0]).map((h) => h.trim());
  if (
    header.length < 3 ||
    header[0] !== "id" ||
    header[1] !== "texto" ||
    header[2] !== "respuestaCorrecta"
  ) {
    throw new Error("Invalid CSV header");
  }

  return lines.slice(1).map((line, index) => {
    const [idRaw, texto, respuestaCorrecta] = parseCsvLine(line);
    return assertQuestion(
      {
        id: Number(idRaw),
        texto,
        respuestaCorrecta,
      },
      index,
    );
  });
}
