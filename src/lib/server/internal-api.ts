// src/lib/server/internal-api.ts
//
// Header di autenticazione server-to-server Vercel → Railway.
//
// Il backend salta il rate limiter globale SOLO per le GET SEO read-only in
// allowlist (oggi /api/topic-pages/*) quando riceve questo header con il
// secret corretto (vedi quiz_project/middleware/internalRateLimitBypass.js).
// Motivo: le fetch SSR/ISR escono da pochi IP Vercel condivisi e un picco di
// render non in cache esauriva il bucket → 429 → pagine 500 (2026-09-29).
//
// INTERNAL_SERVER_TOKEN è una env var SOLO server (mai NEXT_PUBLIC_*):
// "server-only" impedisce che questo modulo finisca nel bundle browser.

import "server-only";

export const INTERNAL_TOKEN_HEADER = "X-Internal-Server-Token";

/** Header da aggiungere alle fetch SSR/ISR verso gli endpoint in allowlist. */
export function internalApiHeaders(): Record<string, string> {
  const token = process.env.INTERNAL_SERVER_TOKEN;
  return token ? { [INTERNAL_TOKEN_HEADER]: token } : {};
}
