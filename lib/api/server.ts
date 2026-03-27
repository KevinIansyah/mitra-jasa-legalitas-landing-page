/**
 * API Server untuk Server Components & Server Actions
 */

import { cookies } from 'next/headers';
import { parseApiErrorResponse } from './parse-api-error';
import { ApiSuccessResponse } from '../types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ============================================================================
// INTERNALS
// ============================================================================

function extractData<T>(responseData: unknown): T {
  if (
    responseData &&
    typeof responseData === 'object' &&
    'data' in responseData
  ) {
    const apiResponse = responseData as ApiSuccessResponse<T>;

    if ('meta' in apiResponse && apiResponse.meta) {
      return {
        data: apiResponse.data,
        ...apiResponse.meta,
      } as T;
    }

    return apiResponse.data;
  }

  return responseData as T;
}

async function buildHeaders(): Promise<HeadersInit> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw await parseApiErrorResponse(res);
  }

  const data = await res.json();
  return extractData<T>(data);
}

// ============================================================================
// HTTP METHODS
// ============================================================================

async function get<T>(url: string): Promise<T> {
  const headers = await buildHeaders();

  const res = await fetch(`${API_URL}${url}`, {
    method: 'GET',
    headers,
    cache: 'no-store',
  });

  return handleResponse<T>(res);
}

async function post<T>(url: string, body?: unknown): Promise<T> {
  const headers = await buildHeaders();

  const res = await fetch(`${API_URL}${url}`, {
    method: 'POST',
    headers,
    cache: 'no-store',
    body: body ? JSON.stringify(body) : undefined,
  });

  return handleResponse<T>(res);
}

async function put<T>(url: string, body?: unknown): Promise<T> {
  const headers = await buildHeaders();

  const res = await fetch(`${API_URL}${url}`, {
    method: 'PUT',
    headers,
    cache: 'no-store',
    body: body ? JSON.stringify(body) : undefined,
  });

  return handleResponse<T>(res);
}

async function patch<T>(url: string, body?: unknown): Promise<T> {
  const headers = await buildHeaders();

  const res = await fetch(`${API_URL}${url}`, {
    method: 'PATCH',
    headers,
    cache: 'no-store',
    body: body ? JSON.stringify(body) : undefined,
  });

  return handleResponse<T>(res);
}

async function del<T>(url: string): Promise<T> {
  const headers = await buildHeaders();

  const res = await fetch(`${API_URL}${url}`, {
    method: 'DELETE',
    headers,
    cache: 'no-store',
  });

  return handleResponse<T>(res);
}

// ============================================================================
// EXPORT
// ============================================================================

export const apiServer = {
  get,
  post,
  put,
  patch,
  delete: del,
};
