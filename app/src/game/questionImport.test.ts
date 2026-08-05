import { describe, expect, it } from "vitest";
import { parseQuestionsCsv, parseQuestionsJson } from "./questionImport";

describe("questionImport", () => {
  it("parseQuestionsJson parses a valid array", () => {
    const text = JSON.stringify([
      { id: 1, texto: "¿Pregunta?", respuestaCorrecta: "Respuesta" },
      { id: 2, texto: "Otra", respuestaCorrecta: "Sí" },
    ]);
    expect(parseQuestionsJson(text)).toEqual([
      { id: 1, texto: "¿Pregunta?", respuestaCorrecta: "Respuesta" },
      { id: 2, texto: "Otra", respuestaCorrecta: "Sí" },
    ]);
  });

  it("parseQuestionsJson throws on invalid JSON", () => {
    expect(() => parseQuestionsJson("not json")).toThrow();
    expect(() => parseQuestionsJson("[]")).not.toThrow();
  });

  it("parseQuestionsJson throws when entries lack required fields", () => {
    expect(() => parseQuestionsJson('[{"id":1}]')).toThrow();
  });

  it("parseQuestionsCsv parses header and rows", () => {
    const csv = [
      "id,texto,respuestaCorrecta",
      "1,¿Qué es?,Una respuesta",
      "2,Otra?,Sí",
    ].join("\n");
    expect(parseQuestionsCsv(csv)).toEqual([
      { id: 1, texto: "¿Qué es?", respuestaCorrecta: "Una respuesta" },
      { id: 2, texto: "Otra?", respuestaCorrecta: "Sí" },
    ]);
  });

  it("parseQuestionsCsv throws on missing header", () => {
    expect(() => parseQuestionsCsv("foo,bar\n1,x,y")).toThrow();
  });

  it("parseQuestionsCsv throws on empty file", () => {
    expect(() => parseQuestionsCsv("")).toThrow();
  });
});
