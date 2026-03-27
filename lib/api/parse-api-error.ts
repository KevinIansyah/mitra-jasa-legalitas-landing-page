/**
 * Parsing error response API (Laravel + format success: false) dengan sanitasi 5xx di production.
 */

import { ApiError, isApiErrorResponse } from '../types/api';

export const GENERIC_SERVER_ERROR =
  'Terjadi kesalahan pada server. Silakan coba lagi nanti.';

function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
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
): ApiError {
  if (status >= 500 && isProduction()) {
    if (
      rawForServerLog !== undefined &&
      typeof window === 'undefined'
    ) {
      console.error('[api] upstream 5xx:', status, rawForServerLog);
    }
    return new ApiError(GENERIC_SERVER_ERROR, status);
  }
  return new ApiError(message, status, errors);
}

export async function parseApiErrorResponse(res: Response): Promise<ApiError> {
  let errorData: unknown;

  try {
    errorData = await res.json();
  } catch {
    return toApiError(
      res.status,
      'An error occurred while processing the request',
      undefined,
      undefined,
    );
  }

  if (isApiErrorResponse(errorData)) {
    return toApiError(
      res.status,
      errorData.message,
      errorData.errors ?? undefined,
      errorData,
    );
  }

  if (
    typeof errorData === 'object' &&
    errorData !== null &&
    'message' in errorData &&
    typeof (errorData as { message: unknown }).message === 'string'
  ) {
    return toApiError(
      res.status,
      (errorData as { message: string }).message,
      undefined,
      errorData,
    );
  }

  return toApiError(
    res.status,
    'An unexpected error occurred',
    undefined,
    errorData,
  );
}
