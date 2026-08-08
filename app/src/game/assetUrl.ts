/**
 * Resolve a path under `public/` against Vite `base`
 * (required for GitHub Pages project sites).
 */
export function assetUrl(path: string): string {
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  const base = import.meta.env.BASE_URL || "/";
  const normalized = path.replace(/^\/+/, "");
  return `${base}${normalized}`;
}

export function assetUrlOrNull(
  path: string | null | undefined,
): string | null {
  if (!path) return null;
  return assetUrl(path);
}
