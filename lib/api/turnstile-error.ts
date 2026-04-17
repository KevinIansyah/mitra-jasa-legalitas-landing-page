import { ApiError } from '@/lib/types/api';

/**
 * Helper deteksi error Turnstile dari response backend.
 *
 * Backend Laravel mengembalikan 422 dengan field `cf_turnstile_token`
 * ketika token CAPTCHA kosong/invalid/expired.
 */

export const TURNSTILE_FIELD = 'cf_turnstile_token';

export function isTurnstileValidationError(err: unknown): boolean {
  if (!(err instanceof ApiError)) return false;
  if (err.status !== 422) return false;
  return Boolean(err.errors?.[TURNSTILE_FIELD]);
}

export function getTurnstileErrorMessage(err: unknown): string | undefined {
  if (!(err instanceof ApiError) || !err.errors) return undefined;
  const raw = err.errors[TURNSTILE_FIELD];
  if (Array.isArray(raw) && raw[0]) return String(raw[0]);
  return undefined;
}
