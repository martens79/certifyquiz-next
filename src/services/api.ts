// src/services/api.ts
// Wrapper HTTP basati su fetch + token (da src/lib/auth.ts).
// Supportano `params` in querystring e includono helper extra (PATCH, FormData).

import { authFetch, backendUrl } from "@/lib/auth";

/** Serializza un oggetto in querystring, ignorando null/undefined e gestendo array */
function toQueryString(params?: Record<string, unknown>): string {
  if (!params) return "";
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    if (Array.isArray(v)) {
      for (const item of v) {
        if (item === undefined || item === null) continue;
        usp.append(k, String(item));
      }
    } else {
      usp.set(k, String(v));
    }
  }
  const s = usp.toString();
  return s ? `?${s}` : "";
}

type BaseInit = Omit<RequestInit, "method" | "body"> & {
  /** Se false, non aggiunge Authorization; default: true */
  auth?: boolean;
  /** Parametri querystring */
  params?: Record<string, unknown>;
};

async function parseResponse<T>(res: Response, path: string, method: string): Promise<T> {
  if (!res.ok) {
    let text = "";
    try { text = await res.text(); } catch {}
    throw new Error(`${method} ${path} ${res.status} ${res.statusText} ${text}`);
  }
  // 204 No Content
  if (res.status === 204) return undefined as unknown as T;

  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    return (await res.json()) as T;
  }
  // fallback: testo
  return (await res.text()) as unknown as T;
}

/** GET tipizzata con supporto `params` */
export async function apiGet<T = unknown>(path: string, init: BaseInit = {}): Promise<T> {
  const { params, auth = true, headers, ...rest } = init;
  const url = backendUrl(path) + toQueryString(params);

  const res = await authFetch(url, {
    ...rest,
    auth,
    headers: { ...(headers as Record<string, string> | undefined) },
    method: "GET",
  });

  return parseResponse<T>(res, path, "GET");
}

/** POST tipizzata (JSON) */
export async function apiPost<T = unknown, B = unknown>(
  path: string,
  body?: B,
  init: BaseInit = {}
): Promise<T> {
  const { params, auth = true, headers, ...rest } = init;
  const url = backendUrl(path) + toQueryString(params);

  const res = await authFetch(url, {
    ...rest,
    auth,
    headers: {
      "Content-Type": "application/json",
      ...(headers as Record<string, string> | undefined),
    },
    method: "POST",
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  return parseResponse<T>(res, path, "POST");
}

/** PUT tipizzata (JSON) */
export async function apiPut<T = unknown, B = unknown>(
  path: string,
  body?: B,
  init: BaseInit = {}
): Promise<T> {
  const { params, auth = true, headers, ...rest } = init;
  const url = backendUrl(path) + toQueryString(params);

  const res = await authFetch(url, {
    ...rest,
    auth,
    headers: {
      "Content-Type": "application/json",
      ...(headers as Record<string, string> | undefined),
    },
    method: "PUT",
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  return parseResponse<T>(res, path, "PUT");
}

/** PATCH tipizzata (JSON) */
export async function apiPatch<T = unknown, B = unknown>(
  path: string,
  body?: B,
  init: BaseInit = {}
): Promise<T> {
  const { params, auth = true, headers, ...rest } = init;
  const url = backendUrl(path) + toQueryString(params);

  const res = await authFetch(url, {
    ...rest,
    auth,
    headers: {
      "Content-Type": "application/json",
      ...(headers as Record<string, string> | undefined),
    },
    method: "PATCH",
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  return parseResponse<T>(res, path, "PATCH");
}

/** DELETE tipizzata */
export async function apiDelete<T = unknown>(path: string, init: BaseInit = {}): Promise<T> {
  const { params, auth = true, headers, ...rest } = init;
  const url = backendUrl(path) + toQueryString(params);

  const res = await authFetch(url, {
    ...rest,
    auth,
    headers: { ...(headers as Record<string, string> | undefined) },
    method: "DELETE",
  });

  return parseResponse<T>(res, path, "DELETE");
}

/** POST FormData (upload) — NON imposta Content-Type (lo fa il browser) */
export async function apiPostForm<T = unknown>(
  path: string,
  formData: FormData,
  init: BaseInit = {}
): Promise<T> {
  const { params, auth = true, headers, ...rest } = init;
  const url = backendUrl(path) + toQueryString(params);

  const res = await authFetch(url, {
    ...rest,
    auth,
    headers: { ...(headers as Record<string, string> | undefined) },
    method: "POST",
    body: formData,
  });

  return parseResponse<T>(res, path, "POST_FORM");
}
