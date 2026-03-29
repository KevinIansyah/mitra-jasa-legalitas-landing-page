
export function zoomOutGoogleMapsEmbedUrl(
  url: string,
  factor = 4.5,
): string {
  if (!url.includes('google.com/maps/embed')) return url;

  return url.replace(/!1m3!1d([\d.]+)/, (_fullMatch, rawZoom: string) => {
    const num = parseFloat(rawZoom);
    if (!Number.isFinite(num) || num <= 0) return `!1m3!1d${rawZoom}`;
    return `!1m3!1d${num * factor}`;
  });
}
