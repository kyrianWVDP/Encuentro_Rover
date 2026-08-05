const STOP_WORDS = new Set([
  "clan",
  "v",
  "la",
  "el",
  "los",
  "las",
  "lo",
  "de",
  "del",
  "y",
  "e",
  "a",
  "en",
]);

export function clanInitials(nombre: string): string {
  const words = nombre.trim().split(/\s+/);
  const significant = words.filter((w) => !STOP_WORDS.has(w.toLowerCase()));

  if (significant.length === 0) {
    return nombre.trim().slice(0, 3).toUpperCase();
  }

  return significant
    .slice(0, 3)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
}
