// src/lib/server/backend-fetch.ts
//
// GET JSON server-side verso il backend con un contratto esplicito sugli errori.
//
// Perche': prima un 429/timeout/5xx sulla chiamata di dettaglio certificazione
// veniva inghiottito e la landing perdeva `questionCountByLang`; il rendering lo
// leggeva come "0 domande" ("Questions not available yet", card Quiz disabilitata,
// noindex). Qui un errore resta un errore: il chiamante vede `kind: "error"` e non
// puo' scambiarlo per "il backend ha risposto: nessuna domanda".
//
// Regole:
// - 404 -> `not_found` (risposta valida del backend);
// - 429 -> `error/rate_limited`, MAI ritentato (ritentare peggiora il carico);
// - timeout / errore di rete / 5xx -> al massimo UN retry breve (rispetta
//   Retry-After se <= RETRY_AFTER_MAX_MS, altrimenti niente retry);
// - header interno X-Internal-Server-Token quando INTERNAL_SERVER_TOKEN e' impostato;
// - il secret non finisce mai in URL, log o messaggi.

import "server-only";
import { internalApiHeaders } from "@/lib/server/internal-api";

export type BackendErrorReason = "rate_limited" | "timeout" | "server_error" | "network" | "bad_response";

export type BackendResult<T> =
  | { kind: "ok"; data: T }
  | { kind: "not_found" }
  | { kind: "error"; reason: BackendErrorReason; status?: number; retryAfterSeconds?: number };

export type BackendGetOptions = {
  revalidate?: number;
  tags?: string[];
  timeoutMs?: number;
  /** Retry (max 1) per timeout/rete/5xx. Default true. Mai per 429. */
  retry?: boolean;
  headers?: Record<string, string>;
};

const DEFAULT_TIMEOUT_MS = 3000;
const RETRY_DELAY_MS = 250;
const RETRY_AFTER_MAX_MS = 1500;

type FetchInit = RequestInit & { next?: { revalidate?: number; tags?: string[] } };

function parseRetryAfter(value: string | null): number | undefined {
  if (!value) return undefined;
  const seconds = Number(value);
  return Number.isFinite(seconds) && seconds >= 0 ? seconds : undefined;
}

async function attempt<T>(url: string, options: BackendGetOptions): Promise<BackendResult<T>> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? DEFAULT_TIMEOUT_MS);
  try {
    const init: FetchInit = {
      headers: { ...internalApiHeaders(), ...(options.headers || {}) },
      signal: controller.signal,
    };
    if (options.revalidate !== undefined || options.tags) {
      init.next = { revalidate: options.revalidate, tags: options.tags };
    } else {
      init.cache = "no-store";
    }
    const res = await fetch(url, init);
    if (res.status === 404) return { kind: "not_found" };
    if (res.status === 429) {
      return { kind: "error", reason: "rate_limited", status: 429, retryAfterSeconds: parseRetryAfter(res.headers.get("retry-after")) };
    }
    if (res.status >= 500) {
      return { kind: "error", reason: "server_error", status: res.status, retryAfterSeconds: parseRetryAfter(res.headers.get("retry-after")) };
    }
    if (!res.ok) return { kind: "error", reason: "bad_response", status: res.status };
    try {
      return { kind: "ok", data: (await res.json()) as T };
    } catch {
      return { kind: "error", reason: "bad_response", status: res.status };
    }
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError";
    return { kind: "error", reason: aborted ? "timeout" : "network" };
  } finally {
    clearTimeout(timer);
  }
}

const isRetryable = (result: BackendResult<unknown>) =>
  result.kind === "error" && (result.reason === "timeout" || result.reason === "network" || result.reason === "server_error");

export async function backendGetJson<T>(url: string, options: BackendGetOptions = {}): Promise<BackendResult<T>> {
  const first = await attempt<T>(url, options);
  if (options.retry === false || !isRetryable(first)) return first;

  const retryAfterMs = first.kind === "error" && first.retryAfterSeconds !== undefined ? first.retryAfterSeconds * 1000 : 0;
  // Retry-After lungo = il backend chiede di aspettare: non ritentiamo qui.
  if (retryAfterMs > RETRY_AFTER_MAX_MS) return first;

  await new Promise((resolve) => setTimeout(resolve, Math.max(RETRY_DELAY_MS, retryAfterMs)));
  return attempt<T>(url, options);
}
