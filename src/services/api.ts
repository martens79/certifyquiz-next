// src/services/api.ts
import { apiFetchJson } from "@/lib/auth";

export async function apiGet<T>(path: string, params?: Record<string, string | number>) {
  const qs = params
    ? "?" + new URLSearchParams(
        Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]))
      ).toString()
    : "";
  return apiFetchJson<T>(`${path}${qs}`);
}

export async function apiPost<T>(path: string, body?: unknown) {
  return apiFetchJson<T>(path, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
}
