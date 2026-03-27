/**
 * Membangun URL wa.me dari nomor WhatsApp (sumber: GET `/company-information` → `contact.whatsapp`).
 */

/** Digit untuk wa.me: strip non-digit, `08…` → `628…`. */
export function normalizeIndonesiaWhatsappDigits(input: string): string {
  const d = input.replace(/\D/g, '');
  if (!d) return '';
  if (d.startsWith('0')) return `62${d.slice(1)}`;
  if (d.startsWith('62')) return d;
  return d;
}

export function whatsappWaMeUrl(digitsOrRaw: string): string {
  const d = normalizeIndonesiaWhatsappDigits(digitsOrRaw);
  if (!d) return '';
  return `https://wa.me/${d}`;
}

export function whatsappWaMeUrlWithText(
  digitsOrRaw: string,
  message: string,
): string {
  const base = whatsappWaMeUrl(digitsOrRaw);
  if (!base) return '';
  return `${base}?text=${encodeURIComponent(message)}`;
}
