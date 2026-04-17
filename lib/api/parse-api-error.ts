/**
 * Parsing error response API (Laravel + format success: false) dengan sanitasi 5xx di production.
 */

import { ApiError, isApiErrorResponse } from "../types/api";

export const GENERIC_SERVER_ERROR = "Terjadi kesalahan pada server. Silakan coba lagi nanti.";

function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

function parseRetryAfterHeader(res: Response): number | undefined {
  const raw = res.headers.get("Retry-After") ?? res.headers.get("retry-after");
  if (!raw) return undefined;

  const trimmed = raw.trim();
  const seconds = Number(trimmed);
  if (Number.isFinite(seconds) && seconds >= 0) {
    return Math.max(1, Math.ceil(seconds));
  }

  const date = Date.parse(trimmed);
  if (!Number.isNaN(date)) {
    const diff = Math.ceil((date - Date.now()) / 1000);
    return diff > 0 ? diff : 1;
  }

  return undefined;
}

function buildRateLimitMessage(retryAfter?: number): string {
  const n = retryAfter ?? 60;
  return `Terlalu banyak percobaan. Coba lagi dalam ${n} detik.`;
}

/**
 * In production, no forward error upstream for 5xx (SQL, stack, etc.) to prevent sensitive information leakage.
 * Laravel with APP_DEBUG=false usually already suppresses, but this is a fallback layer.
 */
export function toApiError(
  status: number,
  message: string,
  errors?: Record<string, string[] | boolean>,
  rawForServerLog?: unknown,
  retryAfter?: number,
): ApiError {
  if (status >= 500 && isProduction()) {
    if (rawForServerLog !== undefined && typeof window === "undefined") {
      console.error("[api] upstream 5xx:", status, rawForServerLog);
    }
    return new ApiError(GENERIC_SERVER_ERROR, status);
  }
  if (status === 429) {
    return new ApiError(buildRateLimitMessage(retryAfter), status, errors, retryAfter);
  }
  return new ApiError(message, status, errors, retryAfter);
}

export async function parseApiErrorResponse(res: Response): Promise<ApiError> {
  const retryAfter = res.status === 429 ? parseRetryAfterHeader(res) : undefined;

  let errorData: unknown;

  try {
    errorData = await res.json();
  } catch {
    return toApiError(res.status, "An error occurred while processing the request", undefined, undefined, retryAfter);
  }

  if (isApiErrorResponse(errorData)) {
    return toApiError(res.status, errorData.message, errorData.errors ?? undefined, errorData, retryAfter);
  }

  if (typeof errorData === "object" && errorData !== null && "message" in errorData && typeof (errorData as { message: unknown }).message === "string") {
    return toApiError(res.status, (errorData as { message: string }).message, undefined, errorData, retryAfter);
  }

  return toApiError(res.status, "An unexpected error occurred", undefined, errorData, retryAfter);
}
