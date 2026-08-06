import { describe, expect, it } from "vitest";
import { buildResultsCsv } from "./exportCsv";

describe("buildResultsCsv", () => {
  it("includes UTF-8 BOM, title, header, and data rows", () => {
    const csv = buildResultsCsv("Justas del Saber", [
      {
        clanId: "a",
        puesto: 1,
        puntos: 40,
        clan: "Dragones",
        representante: "Juan",
      },
      {
        clanId: "b",
        puesto: 2,
        puntos: 30,
        clan: "Kurusu",
        representante: "María",
      },
    ]);

    expect(csv.startsWith("\uFEFF")).toBe(true);
    expect(csv).toContain("Justas del Saber");
    expect(csv).toContain("puesto,clan,representante,puntos");
    expect(csv).toContain("1,Dragones,Juan,40");
    expect(csv).toContain("2,Kurusu,María,30");
  });

  it("escapes double quotes in fields", () => {
    const csv = buildResultsCsv("Evento", [
      {
        clanId: "a",
        puesto: 1,
        puntos: 10,
        clan: 'Clan "Norte"',
        representante: 'Ana "L"',
      },
    ]);

    expect(csv).toContain('"Clan ""Norte"""');
    expect(csv).toContain('"Ana ""L"""');
  });

  it("quotes fields containing commas", () => {
    const csv = buildResultsCsv("Evento", [
      {
        clanId: "a",
        puesto: 1,
        puntos: 10,
        clan: "San Jorge, Capadocia",
        representante: "Pedro",
      },
    ]);

    expect(csv).toContain('"San Jorge, Capadocia"');
  });
});
