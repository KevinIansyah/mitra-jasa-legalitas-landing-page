/**
 * API Client untuk Client Components
 */

import { parseApiErrorResponse } from "./parse-api-error";
import { ApiSuccessResponse } from "../types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ============================================================================
// COOKIE HELPERS
// ============================================================================

export const cookieHelpers = {
  setToken(token: string): void {
    if (typeof document === 'undefined') return;
    const maxAge = 60 * 60 * 24 * 7; // 7 hari
    document.cookie = `auth_token=${token}; path=/; max-age=${maxAge}; SameSite=Lax; Secure`;
  },

  getToken(): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(/auth_token=([^;]+)/);
    return match ? match[1] : null;
  },

  removeToken(): void {
    if (typeof document === 'undefined') return;
    document.cookie = 'auth_token=; path=/; max-age=0';
  },
};

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

function buildHeaders(): HeadersInit {
  const token = cookieHelpers.getToken();

  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

function buildFormDataHeaders(): HeadersInit {
  const token = cookieHelpers.getToken();

  return {
    Accept: 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    if (res.status === 401) {
      cookieHelpers.removeToken();
    }
    throw await parseApiErrorResponse(res);
  }

  const data = await res.json();
  return extractData<T>(data);
}

// ============================================================================
// HTTP METHODS
// ============================================================================

async function get<T>(url: string): Promise<T> {
  const res = await fetch(`${API_URL}${url}`, {
    method: 'GET',
    headers: buildHeaders(),
    credentials: 'include',
  });

  return handleResponse<T>(res);
}

async function post<T>(url: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${url}`, {
    method: 'POST',
    headers: buildHeaders(),
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });

  return handleResponse<T>(res);
}

async function postFormData<T>(url: string, formData: FormData): Promise<T> {
  const res = await fetch(`${API_URL}${url}`, {
    method: 'POST',
    headers: buildFormDataHeaders(),
    credentials: 'include',
    body: formData,
  });

  return handleResponse<T>(res);
}

// Untuk update data tanpa file — gunakan JSON body dengan method PUT
async function put<T>(url: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${url}`, {
    method: 'PUT',
    headers: buildHeaders(),
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });

  return handleResponse<T>(res);
}

// Untuk update data dengan file — Laravel tidak bisa terima PUT multipart,
// jadi tetap pakai POST dengan _method spoofing
async function putFormData<T>(url: string, formData: FormData): Promise<T> {
  formData.append('_method', 'PUT');

  const res = await fetch(`${API_URL}${url}`, {
    method: 'POST',
    headers: buildFormDataHeaders(),
    credentials: 'include',
    body: formData,
  });

  return handleResponse<T>(res);
}

async function patch<T>(url: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${url}`, {
    method: 'PATCH',
    headers: buildHeaders(),
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });

  return handleResponse<T>(res);
}

// Untuk update data dengan file via PATCH
async function patchFormData<T>(url: string, formData: FormData): Promise<T> {
  formData.append('_method', 'PATCH');

  const res = await fetch(`${API_URL}${url}`, {
    method: 'POST',
    headers: buildFormDataHeaders(),
    credentials: 'include',
    body: formData,
  });

  return handleResponse<T>(res);
}

async function del<T>(url: string): Promise<T> {
  const res = await fetch(`${API_URL}${url}`, {
    method: 'DELETE',
    headers: buildHeaders(),
    credentials: 'include',
  });

  return handleResponse<T>(res);
}

// ============================================================================
// EXPORT
// ============================================================================

export const apiClient = {
  get,
  post,
  postFormData,
  put,
  putFormData,
  patch,
  patchFormData,
  delete: del,
  ...cookieHelpers,
};
