/**
 * API Client for Client Components
 */

import { toast } from "sonner";
import { parseApiErrorResponse } from "./parse-api-error";
import { ApiError, ApiSuccessResponse } from "../types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.trim() ?? "";

export function getPublicApiBaseUrl(): string {
  return API_URL;
}

export function hasPublicApiBaseUrl(): boolean {
  return API_URL.length > 0;
}

// ============================================================================
// COOKIE HELPERS
// ============================================================================

function cookieSecureSuffix(): string {
  if (typeof window === "undefined") return "";
  return window.location.protocol === "https:" ? "; Secure" : "";
}

export const cookieHelpers = {
  /** Without remember: 7 days (default). Remember me: 30 days. */
  setToken(token: string, rememberMe = false): void {
    if (typeof document === "undefined") return;
    const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7;
    const value = encodeURIComponent(token);
    document.cookie = `auth_token=${value}; path=/; max-age=${maxAge}; SameSite=Lax${cookieSecureSuffix()}`;
  },

  getToken(): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(/(?:^|;\s*)auth_token=([^;]+)/);
    if (!match) return null;
    try {
      return decodeURIComponent(match[1]);
    } catch {
      return match[1];
    }
  },

  removeToken(): void {
    if (typeof document === "undefined") return;
    document.cookie = `auth_token=; path=/; max-age=0${cookieSecureSuffix()}`;
  },
};

// ============================================================================
// INTERNALS
// ============================================================================

function extractData<T>(responseData: unknown): T {
  if (responseData && typeof responseData === "object" && "data" in responseData) {
    const apiResponse = responseData as ApiSuccessResponse<T>;

    if ("meta" in apiResponse && apiResponse.meta) {
      return {
        data: apiResponse.data,
        ...apiResponse.meta,
      } as T;
    }

    const inner = apiResponse.data;
    if (inner != null) {
      return inner as T;
    }

    if (typeof apiResponse.message === "string") {
      return { message: apiResponse.message } as T;
    }
    return inner as T;
  }

  return responseData as T;
}

function buildHeaders(): HeadersInit {
  const token = cookieHelpers.getToken();

  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

function buildFormDataHeaders(): HeadersInit {
  const token = cookieHelpers.getToken();

  return {
    Accept: "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

let lastRateLimitToastAt = 0;

function notifyRateLimit(error: ApiError): void {
  if (typeof window === "undefined") return;
  const now = Date.now();
  if (now - lastRateLimitToastAt < 1500) return;
  lastRateLimitToastAt = now;
  toast.error(error.message);
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    if (res.status === 401) {
      cookieHelpers.removeToken();
    }
    const error = await parseApiErrorResponse(res);
    if (error.status === 429) {
      notifyRateLimit(error);
    }
    throw error;
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const text = await res.text();
  if (!text.trim()) {
    return undefined as T;
  }

  const data = JSON.parse(text) as unknown;
  return extractData<T>(data);
}

// ============================================================================
// HTTP METHODS
// ============================================================================

function parseFilenameFromContentDisposition(header: string): string | null {
  const star = /filename\*=(?:UTF-8''|)([^;\n]+)/i.exec(header);
  if (star?.[1]) {
    const raw = star[1].trim().replace(/^"(.*)"$/, "$1");
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  }
  const quoted = /filename="([^"]+)"/i.exec(header);
  if (quoted?.[1]) return quoted[1];
  const plain = /filename=([^;\s]+)/i.exec(header);
  if (plain?.[1]) return plain[1].replace(/^"(.*)"$/, "$1");
  return null;
}

function buildBinaryGetHeaders(): HeadersInit {
  const token = cookieHelpers.getToken();

  return {
    Accept: "*/*",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

async function get<T>(url: string): Promise<T> {
  const res = await fetch(`${API_URL}${url}`, {
    method: "GET",
    headers: buildHeaders(),
    credentials: "include",
  });

  return handleResponse<T>(res);
}

async function getBlob(url: string): Promise<{ blob: Blob; filename: string | null }> {
  const res = await fetch(`${API_URL}${url}`, {
    method: "GET",
    headers: buildBinaryGetHeaders(),
    credentials: "include",
  });

  if (!res.ok) {
    if (res.status === 401) {
      cookieHelpers.removeToken();
    }
    const error = await parseApiErrorResponse(res);
    if (error.status === 429) {
      notifyRateLimit(error);
    }
    throw error;
  }

  const cd = res.headers.get("Content-Disposition");
  const filename = cd ? parseFilenameFromContentDisposition(cd) : null;
  const blob = await res.blob();
  return { blob, filename };
}

function resolveHrefToAbsoluteUrl(href: string): string {
  const t = href.trim();
  if (!t) return t;
  if (t.startsWith("http://") || t.startsWith("https://")) return t;
  const base = API_URL.replace(/\/$/, "");
  if (!base) return t.startsWith("/") ? t : `/${t}`;
  return t.startsWith("/") ? `${base}${t}` : `${base}/${t}`;
}

function pathnameStartsWithStorage(href: string): boolean {
  try {
    if (href.startsWith("http://") || href.startsWith("https://")) {
      return new URL(href).pathname.startsWith("/storage/");
    }
    return (href.split("?")[0] ?? "").startsWith("/storage/");
  } catch {
    return (href.split("?")[0] ?? "").startsWith("/storage/");
  }
}

async function fetchBinaryPublic(absoluteUrl: string): Promise<{ blob: Blob; filename: string | null }> {
  const res = await fetch(absoluteUrl, { credentials: "omit", mode: "cors" });
  if (!res.ok) {
    throw new Error("Tidak dapat mengunduh berkas.");
  }
  const cd = res.headers.get("Content-Disposition");
  const filename = cd ? parseFilenameFromContentDisposition(cd) : null;
  const blob = await res.blob();
  return { blob, filename };
}

function triggerBrowserFileDownload(blob: Blob, serverFilename: string | null, fallbackFilename: string): void {
  const name = (serverFilename?.trim() || fallbackFilename).replace(/^"(.*)"$/, "$1");
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function publicFileHostSuffix(): string {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_PUBLIC_FILE_HOST_SUFFIX?.trim()) {
    return process.env.NEXT_PUBLIC_PUBLIC_FILE_HOST_SUFFIX.trim();
  }
  return ".r2.dev";
}

function shouldUsePublicFileProxy(u: URL): boolean {
  if (typeof window === "undefined") return false;
  if (u.origin === window.location.origin) return false;
  return u.protocol === "https:" && u.hostname.endsWith(publicFileHostSuffix());
}

function downloadPublicFile(href: string, fallbackFilename: string): void {
  const absolute = resolveHrefToAbsoluteUrl(href).trim();
  if (!absolute) {
    throw new Error("Berkas tidak tersedia.");
  }

  let hrefForAnchor = absolute;
  let proxied = false;

  if (typeof window !== "undefined") {
    try {
      const u = new URL(absolute);
      if (shouldUsePublicFileProxy(u)) {
        const q = new URLSearchParams();
        q.set("url", absolute);
        q.set("name", fallbackFilename);
        hrefForAnchor = `${window.location.origin}/api/public-file?${q.toString()}`;
        proxied = true;
      }
    } catch {}
  }

  const a = document.createElement("a");
  a.href = hrefForAnchor;
  a.rel = "noopener noreferrer";
  a.download = fallbackFilename;

  if (typeof window !== "undefined" && !proxied) {
    try {
      const u = new URL(hrefForAnchor);
      if (u.origin !== window.location.origin) {
        a.target = "_blank";
      }
    } catch {
      a.target = "_blank";
    }
  }

  document.body.appendChild(a);
  a.click();
  a.remove();
}

async function downloadFile(href: string, fallbackFilename: string): Promise<void> {
  const trimmed = href.trim();
  if (!trimmed) {
    throw new Error("Berkas tidak tersedia.");
  }

  if (pathnameStartsWithStorage(trimmed)) {
    const absolute = resolveHrefToAbsoluteUrl(trimmed);
    const { blob, filename } = await fetchBinaryPublic(absolute);
    triggerBrowserFileDownload(blob, filename, fallbackFilename);
    return;
  }

  const apiBase = API_URL.replace(/\/$/, "");
  let blob: Blob;
  let serverFilename: string | null = null;

  const isHttp = trimmed.startsWith("http://") || trimmed.startsWith("https://");

  if (apiBase && isHttp && trimmed.startsWith(apiBase)) {
    const path = trimmed.slice(apiBase.length) || "/";
    const r = await getBlob(path);
    blob = r.blob;
    serverFilename = r.filename;
  } else if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    const r = await getBlob(trimmed);
    blob = r.blob;
    serverFilename = r.filename;
  } else if (isHttp) {
    const res = await fetch(trimmed, { credentials: "omit", mode: "cors" });
    if (!res.ok) {
      throw new Error("Tidak dapat mengunduh berkas.");
    }
    const cd = res.headers.get("Content-Disposition");
    serverFilename = cd ? parseFilenameFromContentDisposition(cd) : null;
    blob = await res.blob();
  } else {
    throw new Error("Format tautan berkas tidak dikenali.");
  }

  triggerBrowserFileDownload(blob, serverFilename, fallbackFilename);
}

async function downloadPortalAttachment(href: string, fallbackFilename: string): Promise<void> {
  const trimmed = href.trim();
  if (!trimmed) {
    throw new Error("Berkas tidak tersedia.");
  }

  const absolute = resolveHrefToAbsoluteUrl(trimmed);

  if (typeof window !== "undefined") {
    try {
      const u = new URL(absolute);
      if (shouldUsePublicFileProxy(u)) {
        downloadPublicFile(trimmed, fallbackFilename);
        return;
      }
    } catch {}
  }

  await downloadFile(trimmed, fallbackFilename);
}

async function post<T>(url: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${url}`, {
    method: "POST",
    headers: buildHeaders(),
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  return handleResponse<T>(res);
}

async function postFormData<T>(url: string, formData: FormData): Promise<T> {
  const res = await fetch(`${API_URL}${url}`, {
    method: "POST",
    headers: buildFormDataHeaders(),
    credentials: "include",
    body: formData,
  });

  return handleResponse<T>(res);
}

async function put<T>(url: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${url}`, {
    method: "PUT",
    headers: buildHeaders(),
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  return handleResponse<T>(res);
}

async function putFormData<T>(url: string, formData: FormData): Promise<T> {
  formData.append("_method", "PUT");

  const res = await fetch(`${API_URL}${url}`, {
    method: "POST",
    headers: buildFormDataHeaders(),
    credentials: "include",
    body: formData,
  });

  return handleResponse<T>(res);
}

async function patch<T>(url: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${url}`, {
    method: "PATCH",
    headers: buildHeaders(),
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  return handleResponse<T>(res);
}

async function patchFormData<T>(url: string, formData: FormData): Promise<T> {
  formData.append("_method", "PATCH");

  const res = await fetch(`${API_URL}${url}`, {
    method: "POST",
    headers: buildFormDataHeaders(),
    credentials: "include",
    body: formData,
  });

  return handleResponse<T>(res);
}

async function del<T>(url: string): Promise<T> {
  const res = await fetch(`${API_URL}${url}`, {
    method: "DELETE",
    headers: buildHeaders(),
    credentials: "include",
  });

  return handleResponse<T>(res);
}

// ============================================================================
// EXPORT
// ============================================================================

export const apiClient = {
  get,
  getBlob,
  downloadFile,
  downloadPublicFile,
  downloadPortalAttachment,
  post,
  postFormData,
  put,
  putFormData,
  patch,
  patchFormData,
  delete: del,
  ...cookieHelpers,
};
