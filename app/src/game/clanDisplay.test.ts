import { describe, expect, it } from "vitest";
import { clanInitials } from "./clanDisplay";

describe("clanInitials", () => {
  it("derives 1-3 letters from significant words", () => {
    expect(clanInitials("V Guardia de Dragones")).toBe("GD");
    expect(clanInitials("Humaita PS15")).toBe("HP");
    expect(clanInitials("Chaco Boreal")).toBe("CB");
    expect(clanInitials("La Orden de San Jorge")).toBe("OSJ");
    expect(clanInitials("Kurusu Peregrino")).toBe("KP");
    expect(clanInitials("Humaita CF1")).toBe("HC");
    expect(clanInitials("San Jorge de Capadocia")).toBe("SJC");
    expect(clanInitials("Yvy Pytã")).toBe("YP");
  });

  it("ignores Clan prefix and articles", () => {
    expect(clanInitials("Clan Dragones")).toBe("D");
    expect(clanInitials("El Clan Norte")).toBe("N");
  });

  it("returns at most 3 characters", () => {
    expect(clanInitials("Alpha Beta Gamma Delta")).toHaveLength(3);
  });
});
