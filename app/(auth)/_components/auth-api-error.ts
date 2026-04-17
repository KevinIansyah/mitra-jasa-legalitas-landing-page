import { ApiError } from '@/lib/types/api';

export { isTurnstileValidationError, getTurnstileErrorMessage } from '@/lib/api/turnstile-error';

export function formatAuthApiError(err: unknown, fallback: string): string {
  if (err instanceof ApiError) {
    if (err.errors) {
      for (const v of Object.values(err.errors)) {
        if (Array.isArray(v) && v[0]) return String(v[0]);
      }
    }
    return err.message;
  }
  return fallback;
}

export function getFieldError(
  err: unknown,
  field: string,
): string | undefined {
  if (!(err instanceof ApiError) || !err.errors) return undefined;
  const raw = err.errors[field];
  if (Array.isArray(raw) && raw[0]) return String(raw[0]);
  return undefined;
}

export function maskEmailForDisplay(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain || local === undefined || local === '') return email;
  const first = local[0] ?? '';
  return `${first}***@${domain}`;
}
