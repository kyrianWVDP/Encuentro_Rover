import type { Question, Rng } from "./types";

export const QUESTIONS: Question[] = [
  {
    id: 1,
    texto: "¿Cuál es el lema de los Rovers?",
    respuestaCorrecta: "Servir.",
  },
  {
    id: 2,
    texto: "¿Cómo se denomina la unidad de la Rama Rover?",
    respuestaCorrecta: "Clan de Rovers.",
  },
  {
    id: 3,
    texto: "¿Qué significa “Ich Dien”?",
    respuestaCorrecta: "Yo sirvo.",
  },
  {
    id: 4,
    texto: "¿Quién escribió Roverismo hacia el éxito?",
    respuestaCorrecta: "Robert Baden-Powell.",
  },
  {
    id: 5,
    texto: "¿Qué significa FEPE?",
    respuestaCorrecta: "Federación Paraguaya de Escultismo.",
  },
  {
    id: 6,
    texto: "¿Cuál es la capital de Paraguay?",
    respuestaCorrecta: "Asunción.",
  },
  {
    id: 7,
    texto: "¿Entre qué edades se aplica el método Rover según Roverismo Práctico?",
    respuestaCorrecta: "Entre los 18 y los 22 años.",
  },
  {
    id: 8,
    texto: "¿Qué es el Consejo de Clan?",
    respuestaCorrecta:
      "Es el organismo de deliberación, participación y decisión del Clan.",
  },
  {
    id: 9,
    texto: "¿Quién fundó el Movimiento Scout?",
    respuestaCorrecta: "Lord Robert Stephenson Smyth Baden-Powell.",
  },
  {
    id: 10,
    texto: "¿Qué color tiene el kepí de los Rovers según el manual?",
    respuestaCorrecta: "Rojo, con la insignia oficial correspondiente.",
  },
  {
    id: 11,
    texto: "¿Dónde se realizó el primer Rover Moot Mundial?",
    respuestaCorrecta: "En Kandersteg, Suiza.",
  },
  {
    id: 12,
    texto: "¿Cuáles son los dos idiomas oficiales de Paraguay?",
    respuestaCorrecta: "Español y guaraní.",
  },
];

export function pickRandomUnused(
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
