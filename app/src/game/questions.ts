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
    respuestaCorrecta: "Es el organismo de deliberación, participación y decisión del Clan.",
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
  {
    id: 13,
    texto: "¿Cuál es el lema de los Rovers? (Variante 2)",
    respuestaCorrecta: "Servir.",
  },
  {
    id: 14,
    texto: "¿Cómo se denomina la unidad de la Rama Rover? (Variante 2)",
    respuestaCorrecta: "Clan de Rovers.",
  },
  {
    id: 15,
    texto: "¿Qué significa “Ich Dien”? (Variante 2)",
    respuestaCorrecta: "Yo sirvo.",
  },
  {
    id: 16,
    texto: "¿Quién escribió Roverismo hacia el éxito? (Variante 2)",
    respuestaCorrecta: "Robert Baden-Powell.",
  },
  {
    id: 17,
    texto: "¿Qué significa FEPE? (Variante 2)",
    respuestaCorrecta: "Federación Paraguaya de Escultismo.",
  },
  {
    id: 18,
    texto: "¿Cuál es la capital de Paraguay? (Variante 2)",
    respuestaCorrecta: "Asunción.",
  },
  {
    id: 19,
    texto: "¿Entre qué edades se aplica el método Rover según Roverismo Práctico? (Variante 2)",
    respuestaCorrecta: "Entre los 18 y los 22 años.",
  },
  {
    id: 20,
    texto: "¿Qué es el Consejo de Clan? (Variante 2)",
    respuestaCorrecta: "Es el organismo de deliberación, participación y decisión del Clan.",
  },
  {
    id: 21,
    texto: "¿Quién fundó el Movimiento Scout? (Variante 2)",
    respuestaCorrecta: "Lord Robert Stephenson Smyth Baden-Powell.",
  },
  {
    id: 22,
    texto: "¿Qué color tiene el kepí de los Rovers según el manual? (Variante 2)",
    respuestaCorrecta: "Rojo, con la insignia oficial correspondiente.",
  },
  {
    id: 23,
    texto: "¿Dónde se realizó el primer Rover Moot Mundial? (Variante 2)",
    respuestaCorrecta: "En Kandersteg, Suiza.",
  },
  {
    id: 24,
    texto: "¿Cuáles son los dos idiomas oficiales de Paraguay? (Variante 2)",
    respuestaCorrecta: "Español y guaraní.",
  },
  {
    id: 25,
    texto: "¿Cuál es el lema de los Rovers? (Variante 3)",
    respuestaCorrecta: "Servir.",
  },
  {
    id: 26,
    texto: "¿Cómo se denomina la unidad de la Rama Rover? (Variante 3)",
    respuestaCorrecta: "Clan de Rovers.",
  },
  {
    id: 27,
    texto: "¿Qué significa “Ich Dien”? (Variante 3)",
    respuestaCorrecta: "Yo sirvo.",
  },
  {
    id: 28,
    texto: "¿Quién escribió Roverismo hacia el éxito? (Variante 3)",
    respuestaCorrecta: "Robert Baden-Powell.",
  },
  {
    id: 29,
    texto: "¿Qué significa FEPE? (Variante 3)",
    respuestaCorrecta: "Federación Paraguaya de Escultismo.",
  },
  {
    id: 30,
    texto: "¿Cuál es la capital de Paraguay? (Variante 3)",
    respuestaCorrecta: "Asunción.",
  },
  {
    id: 31,
    texto: "¿Entre qué edades se aplica el método Rover según Roverismo Práctico? (Variante 3)",
    respuestaCorrecta: "Entre los 18 y los 22 años.",
  },
  {
    id: 32,
    texto: "¿Qué es el Consejo de Clan? (Variante 3)",
    respuestaCorrecta: "Es el organismo de deliberación, participación y decisión del Clan.",
  },
  {
    id: 33,
    texto: "¿Quién fundó el Movimiento Scout? (Variante 3)",
    respuestaCorrecta: "Lord Robert Stephenson Smyth Baden-Powell.",
  },
  {
    id: 34,
    texto: "¿Qué color tiene el kepí de los Rovers según el manual? (Variante 3)",
    respuestaCorrecta: "Rojo, con la insignia oficial correspondiente.",
  },
  {
    id: 35,
    texto: "¿Dónde se realizó el primer Rover Moot Mundial? (Variante 3)",
    respuestaCorrecta: "En Kandersteg, Suiza.",
  },
  {
    id: 36,
    texto: "¿Cuáles son los dos idiomas oficiales de Paraguay? (Variante 3)",
    respuestaCorrecta: "Español y guaraní.",
  },
  {
    id: 37,
    texto: "¿Cuál es el lema de los Rovers? (Variante 4)",
    respuestaCorrecta: "Servir.",
  },
  {
    id: 38,
    texto: "¿Cómo se denomina la unidad de la Rama Rover? (Variante 4)",
    respuestaCorrecta: "Clan de Rovers.",
  },
  {
    id: 39,
    texto: "¿Qué significa “Ich Dien”? (Variante 4)",
    respuestaCorrecta: "Yo sirvo.",
  },
  {
    id: 40,
    texto: "¿Quién escribió Roverismo hacia el éxito? (Variante 4)",
    respuestaCorrecta: "Robert Baden-Powell.",
  },
  {
    id: 41,
    texto: "¿Qué significa FEPE? (Variante 4)",
    respuestaCorrecta: "Federación Paraguaya de Escultismo.",
  },
  {
    id: 42,
    texto: "¿Cuál es la capital de Paraguay? (Variante 4)",
    respuestaCorrecta: "Asunción.",
  },
  {
    id: 43,
    texto: "¿Entre qué edades se aplica el método Rover según Roverismo Práctico? (Variante 4)",
    respuestaCorrecta: "Entre los 18 y los 22 años.",
  },
  {
    id: 44,
    texto: "¿Qué es el Consejo de Clan? (Variante 4)",
    respuestaCorrecta: "Es el organismo de deliberación, participación y decisión del Clan.",
  },
  {
    id: 45,
    texto: "¿Quién fundó el Movimiento Scout? (Variante 4)",
    respuestaCorrecta: "Lord Robert Stephenson Smyth Baden-Powell.",
  },
  {
    id: 46,
    texto: "¿Qué color tiene el kepí de los Rovers según el manual? (Variante 4)",
    respuestaCorrecta: "Rojo, con la insignia oficial correspondiente.",
  },
  {
    id: 47,
    texto: "¿Dónde se realizó el primer Rover Moot Mundial? (Variante 4)",
    respuestaCorrecta: "En Kandersteg, Suiza.",
  },
  {
    id: 48,
    texto: "¿Cuáles son los dos idiomas oficiales de Paraguay? (Variante 4)",
    respuestaCorrecta: "Español y guaraní.",
  },
  {
    id: 49,
    texto: "¿Cuál es el lema de los Rovers? (Variante 5)",
    respuestaCorrecta: "Servir.",
  },
  {
    id: 50,
    texto: "¿Cómo se denomina la unidad de la Rama Rover? (Variante 5)",
    respuestaCorrecta: "Clan de Rovers.",
  },
  {
    id: 51,
    texto: "¿Qué significa “Ich Dien”? (Variante 5)",
    respuestaCorrecta: "Yo sirvo.",
  },
  {
    id: 52,
    texto: "¿Quién escribió Roverismo hacia el éxito? (Variante 5)",
    respuestaCorrecta: "Robert Baden-Powell.",
  },
  {
    id: 53,
    texto: "¿Qué significa FEPE? (Variante 5)",
    respuestaCorrecta: "Federación Paraguaya de Escultismo.",
  },
  {
    id: 54,
    texto: "¿Cuál es la capital de Paraguay? (Variante 5)",
    respuestaCorrecta: "Asunción.",
  },
  {
    id: 55,
    texto: "¿Entre qué edades se aplica el método Rover según Roverismo Práctico? (Variante 5)",
    respuestaCorrecta: "Entre los 18 y los 22 años.",
  },
  {
    id: 56,
    texto: "¿Qué es el Consejo de Clan? (Variante 5)",
    respuestaCorrecta: "Es el organismo de deliberación, participación y decisión del Clan.",
  },
  {
    id: 57,
    texto: "¿Quién fundó el Movimiento Scout? (Variante 5)",
    respuestaCorrecta: "Lord Robert Stephenson Smyth Baden-Powell.",
  },
  {
    id: 58,
    texto: "¿Qué color tiene el kepí de los Rovers según el manual? (Variante 5)",
    respuestaCorrecta: "Rojo, con la insignia oficial correspondiente.",
  },
  {
    id: 59,
    texto: "¿Dónde se realizó el primer Rover Moot Mundial? (Variante 5)",
    respuestaCorrecta: "En Kandersteg, Suiza.",
  },
  {
    id: 60,
    texto: "¿Cuáles son los dos idiomas oficiales de Paraguay? (Variante 5)",
    respuestaCorrecta: "Español y guaraní.",
  },
  {
    id: 61,
    texto: "¿Cuál es el lema de los Rovers? (Variante 6)",
    respuestaCorrecta: "Servir.",
  },
  {
    id: 62,
    texto: "¿Cómo se denomina la unidad de la Rama Rover? (Variante 6)",
    respuestaCorrecta: "Clan de Rovers.",
  },
  {
    id: 63,
    texto: "¿Qué significa “Ich Dien”? (Variante 6)",
    respuestaCorrecta: "Yo sirvo.",
  },
  {
    id: 64,
    texto: "¿Quién escribió Roverismo hacia el éxito? (Variante 6)",
    respuestaCorrecta: "Robert Baden-Powell.",
  },
  {
    id: 65,
    texto: "¿Qué significa FEPE? (Variante 6)",
    respuestaCorrecta: "Federación Paraguaya de Escultismo.",
  },
  {
    id: 66,
    texto: "¿Cuál es la capital de Paraguay? (Variante 6)",
    respuestaCorrecta: "Asunción.",
  },
  {
    id: 67,
    texto: "¿Entre qué edades se aplica el método Rover según Roverismo Práctico? (Variante 6)",
    respuestaCorrecta: "Entre los 18 y los 22 años.",
  },
  {
    id: 68,
    texto: "¿Qué es el Consejo de Clan? (Variante 6)",
    respuestaCorrecta: "Es el organismo de deliberación, participación y decisión del Clan.",
  },
  {
    id: 69,
    texto: "¿Quién fundó el Movimiento Scout? (Variante 6)",
    respuestaCorrecta: "Lord Robert Stephenson Smyth Baden-Powell.",
  },
  {
    id: 70,
    texto: "¿Qué color tiene el kepí de los Rovers según el manual? (Variante 6)",
    respuestaCorrecta: "Rojo, con la insignia oficial correspondiente.",
  },
  {
    id: 71,
    texto: "¿Dónde se realizó el primer Rover Moot Mundial? (Variante 6)",
    respuestaCorrecta: "En Kandersteg, Suiza.",
  },
  {
    id: 72,
    texto: "¿Cuáles son los dos idiomas oficiales de Paraguay? (Variante 6)",
    respuestaCorrecta: "Español y guaraní.",
  },
  {
    id: 73,
    texto: "¿Cuál es el lema de los Rovers? (Variante 7)",
    respuestaCorrecta: "Servir.",
  },
  {
    id: 74,
    texto: "¿Cómo se denomina la unidad de la Rama Rover? (Variante 7)",
    respuestaCorrecta: "Clan de Rovers.",
  },
  {
    id: 75,
    texto: "¿Qué significa “Ich Dien”? (Variante 7)",
    respuestaCorrecta: "Yo sirvo.",
  },
  {
    id: 76,
    texto: "¿Quién escribió Roverismo hacia el éxito? (Variante 7)",
    respuestaCorrecta: "Robert Baden-Powell.",
  },
  {
    id: 77,
    texto: "¿Qué significa FEPE? (Variante 7)",
    respuestaCorrecta: "Federación Paraguaya de Escultismo.",
  },
  {
    id: 78,
    texto: "¿Cuál es la capital de Paraguay? (Variante 7)",
    respuestaCorrecta: "Asunción.",
  },
  {
    id: 79,
    texto: "¿Entre qué edades se aplica el método Rover según Roverismo Práctico? (Variante 7)",
    respuestaCorrecta: "Entre los 18 y los 22 años.",
  },
  {
    id: 80,
    texto: "¿Qué es el Consejo de Clan? (Variante 7)",
    respuestaCorrecta: "Es el organismo de deliberación, participación y decisión del Clan.",
  },
  {
    id: 81,
    texto: "¿Quién fundó el Movimiento Scout? (Variante 7)",
    respuestaCorrecta: "Lord Robert Stephenson Smyth Baden-Powell.",
  },
  {
    id: 82,
    texto: "¿Qué color tiene el kepí de los Rovers según el manual? (Variante 7)",
    respuestaCorrecta: "Rojo, con la insignia oficial correspondiente.",
  },
  {
    id: 83,
    texto: "¿Dónde se realizó el primer Rover Moot Mundial? (Variante 7)",
    respuestaCorrecta: "En Kandersteg, Suiza.",
  },
  {
    id: 84,
    texto: "¿Cuáles son los dos idiomas oficiales de Paraguay? (Variante 7)",
    respuestaCorrecta: "Español y guaraní.",
  },
  {
    id: 85,
    texto: "¿Cuál es el lema de los Rovers? (Variante 8)",
    respuestaCorrecta: "Servir.",
  },
  {
    id: 86,
    texto: "¿Cómo se denomina la unidad de la Rama Rover? (Variante 8)",
    respuestaCorrecta: "Clan de Rovers.",
  },
  {
    id: 87,
    texto: "¿Qué significa “Ich Dien”? (Variante 8)",
    respuestaCorrecta: "Yo sirvo.",
  },
  {
    id: 88,
    texto: "¿Quién escribió Roverismo hacia el éxito? (Variante 8)",
    respuestaCorrecta: "Robert Baden-Powell.",
  },
  {
    id: 89,
    texto: "¿Qué significa FEPE? (Variante 8)",
    respuestaCorrecta: "Federación Paraguaya de Escultismo.",
  },
  {
    id: 90,
    texto: "¿Cuál es la capital de Paraguay? (Variante 8)",
    respuestaCorrecta: "Asunción.",
  }
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
