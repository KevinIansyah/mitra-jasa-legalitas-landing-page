export function normalizeIndonesiaWhatsappDigits(input: string): string {
  const digitsOnly = input.replace(/\D/g, '');
  if (!digitsOnly) return '';
  if (digitsOnly.startsWith('0')) return `62${digitsOnly.slice(1)}`;
  if (digitsOnly.startsWith('62')) return digitsOnly;
  return digitsOnly;
}

export function whatsappWaMeUrl(digitsOrRaw: string): string {
  const normalizedDigits = normalizeIndonesiaWhatsappDigits(digitsOrRaw);
  if (!normalizedDigits) return '';
  return `https://wa.me/${normalizedDigits}`;
}

export function whatsappWaMeUrlWithText(
  digitsOrRaw: string,
  message: string,
): string {
  const base = whatsappWaMeUrl(digitsOrRaw);
  if (!base) return '';
  return `${base}?text=${encodeURIComponent(message)}`;
}
