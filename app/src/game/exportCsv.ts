import type { RankRow } from "./ranking";

function escapeCsvField(value: string | number): string {
  const text = String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function buildResultsCsv(
  titulo: string,
  rows: Array<RankRow & { clan: string; representante: string }>,
): string {
  const lines = [
    escapeCsvField(titulo),
    "puesto,clan,representante,puntos",
    ...rows.map((row) =>
      [
        escapeCsvField(row.puesto),
        escapeCsvField(row.clan),
        escapeCsvField(row.representante),
        escapeCsvField(row.puntos),
      ].join(","),
    ),
  ];

  return `\uFEFF${lines.join("\n")}`;
}
