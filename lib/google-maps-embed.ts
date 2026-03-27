/**
 * URL embed Google Maps (`?pb=...`) menyimpan span di segmen `!1m3!1d{angka}`.
 * Angka lebih besar = area tampilan lebih luas (lebih zoom out).
 * Faktor default bisa dinaikkan jika masih terasa terlalu dekat.
 */
export function zoomOutGoogleMapsEmbedUrl(
  url: string,
  factor = 4.5,
): string {
  if (!url.includes('google.com/maps/embed')) return url;

  return url.replace(/!1m3!1d([\d.]+)/, (_, raw: string) => {
    const num = parseFloat(raw);
    if (!Number.isFinite(num) || num <= 0) return `!1m3!1d${raw}`;
    return `!1m3!1d${num * factor}`;
  });
}
