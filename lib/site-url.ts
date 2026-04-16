const DEFAULT_PRODUCTION_ORIGIN = "https://mitrajasalegalitas.co.id";

export function getSiteOrigin(): string {
  const explicit =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.APP_URL?.trim() ||
    process.env.SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "")}`;
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }
  return DEFAULT_PRODUCTION_ORIGIN;
}

export function absoluteUrl(path: string): string {
  const base = getSiteOrigin();
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}
