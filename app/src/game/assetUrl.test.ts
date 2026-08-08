import { describe, it, expect } from "vitest";
import { assetUrl, assetUrlOrNull } from "./assetUrl";

describe("assetUrl", () => {
  it("prefixes Vite BASE_URL for public paths", () => {
    const base = import.meta.env.BASE_URL || "/";
    expect(assetUrl("/logos/yvy-pyta.png")).toBe(`${base}logos/yvy-pyta.png`);
    expect(assetUrl("sounds/spin.mp3")).toBe(`${base}sounds/spin.mp3`);
  });

  it("leaves absolute http(s) and data URLs alone", () => {
    expect(assetUrl("https://cdn.example/logo.png")).toBe(
      "https://cdn.example/logo.png",
    );
    expect(assetUrl("data:image/png;base64,xx")).toBe("data:image/png;base64,xx");
  });

  it("assetUrlOrNull handles empty", () => {
    expect(assetUrlOrNull(null)).toBeNull();
    expect(assetUrlOrNull(undefined)).toBeNull();
    expect(assetUrlOrNull("")).toBeNull();
  });
});
