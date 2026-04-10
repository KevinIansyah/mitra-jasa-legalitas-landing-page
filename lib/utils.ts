import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================================================
// DATE FORMAT UTILITIES
// ============================================================================

export function formatDate(
  dateString: string,
  locale: 'id' | 'en' = 'id',
  options?: Intl.DateTimeFormatOptions,
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const localeString = locale === 'id' ? 'id-ID' : 'en-US';

  return new Date(dateString).toLocaleDateString(
    localeString,
    options || defaultOptions,
  );
}

export function formatDateTime(
  dateString: string,
  locale: 'id' | 'en' = 'id',
): string {
  return formatDate(dateString, locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateShort(
  dateString: string,
  locale: 'id' | 'en' = 'id',
): string {
  return formatDate(dateString, locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatRelativeTime(
  dateString: string,
  locale: 'id' | 'en' = 'id',
): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat(locale === 'id' ? 'id-ID' : 'en-US', {
    numeric: 'auto',
  });

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second');
  } else if (diffInSeconds < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
  } else if (diffInSeconds < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
  } else if (diffInSeconds < 2592000) {
    return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
  } else if (diffInSeconds < 31536000) {
    return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
  } else {
    return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
  }
}

// ============================================================================
// STRING UTILITIES
// ============================================================================

export function getInitials(name: string): string {
  return name
    .trim()
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

export function formatIdrFromApi(value: string | null | undefined): string {
  if (value == null || value === '') return '';
  const parsedAmount = Number.parseFloat(value);
  if (Number.isNaN(parsedAmount)) return value;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(parsedAmount);
}

export function formatServicePrice(price: string): string {
  return formatIdrFromApi(price) || '-';
}

export function resolvePublicFileUrl(path: string | null | undefined): string | null {
  if (!path?.trim()) return null;
  const t = path.trim();
  if (t.startsWith('http://') || t.startsWith('https://')) return t;
  const raw =
    (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL?.trim()) ||
    (typeof process !== 'undefined' && process.env.API_URL?.trim()) ||
    '';
  if (!raw) return t.startsWith('/') ? t : `/${t}`;
  const base = raw.replace(/\/$/, '');
  return t.startsWith('/') ? `${base}${t}` : `${base}/${t}`;
}

export function firstApiValidationMessage(
  errors: Record<string, string[] | boolean> | undefined,
): string | undefined {
  if (!errors) return undefined;
  for (const v of Object.values(errors)) {
    if (Array.isArray(v) && v[0]) return v[0];
  }
  return undefined;
}
