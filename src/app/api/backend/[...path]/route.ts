// src/app/api/backend/[...path]/route.ts
// Proxy verso Express API (/api/*) con forwarding headers (incl. cookie) + CORS/preflight robusto.
// Nota: usato sia in locale (API_BASE_URL_DEV) sia su Vercel (API_BASE_URL).

function stripTrailingApi(u: string) {
  // rimuove solo un /api finale (con o senza slash)
  return u.replace(/\/api\/?$/, "");
}

const API_REMOTE_RAW = process.env.API_BASE_URL || "https://api.certifyquiz.com/api";
const API_LOCAL_RAW = process.env.API_BASE_URL_DEV || "http://127.0.0.1:8080/api";

// ✅ Base senza /api finale (così non rischi mai /api/api)
const API_REMOTE = stripTrailingApi(API_REMOTE_RAW);
const API_LOCAL = stripTrailingApi(API_LOCAL_RAW);

// Se sei su Vercel, NON usare mai il locale.
// In locale, usa DEV a meno che tu voglia forzare remoto.
const IS_VERCEL = !!process.env.VERCEL;
const FORCE_REMOTE = process.env.USE_REMOTE_API === "1";

const TARGET_BASE = IS_VERCEL || FORCE_REMOTE ? API_REMOTE : API_LOCAL;

function buildTargetUrl(req: Request, path: string[]) {
  const incoming = new URL(req.url);

  // La nostra API backend è sempre sotto /api/...
  // Esempi:
  // - /api/backend/public/home-stats  -> https://api.certifyquiz.com/api/public/home-stats
  // - /api/backend/topics/123         -> https://api.certifyquiz.com/api/topics/123
  const target = new URL(`${TARGET_BASE}/api/${path.join("/")}`);

  target.search = incoming.search;
  return target.toString();
}

function sanitizeHeaders(inHeaders: Headers) {
  const h = new Headers(inHeaders);

  // hop-by-hop headers che non vanno proxati
  [
    "host",
    "connection",
    "keep-alive",
    "proxy-authenticate",
    "proxy-authorization",
    "te",
    "trailer",
    "transfer-encoding",
    "upgrade",
    "content-length",
  ].forEach((k) => h.delete(k));

  return h;
}

/**
 * CORS headers robusti:
 * - Non rompe same-origin (sono header extra).
 * - Salva i casi edge (preflight / mobile / header custom) per /auth/refresh.
 */
function corsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "*";
  const reqHeaders =
    req.headers.get("access-control-request-headers") ||
    "authorization, content-type";
  const reqMethod =
    req.headers.get("access-control-request-method") ||
    "GET,POST,PUT,PATCH,DELETE,OPTIONS";

  return {
    "access-control-allow-origin": origin,
    "access-control-allow-credentials": "true",
    "access-control-allow-headers": reqHeaders,
    "access-control-allow-methods": reqMethod,
    "access-control-max-age": "86400",
    vary: "origin",
  };
}

async function proxy(req: Request, path: string[]) {
  const method = req.method.toUpperCase();

  // ✅ Rispondi al preflight con CORS completo (evita edge-case su refresh)
  if (method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(req) });
  }

  const url = buildTargetUrl(req, path);

  // ✅ Forward headers in arrivo (incl. cookie + authorization)
  const headers = sanitizeHeaders(req.headers);

  const body =
    method === "GET" || method === "HEAD" ? undefined : await req.arrayBuffer();

  const res = await fetch(url, { method, headers, body, redirect: "manual" });

  // Copia headers risposta in modo safe
  const outHeaders = new Headers(res.headers);
  outHeaders.delete("content-encoding"); // evita mismatch se runtime ricompone
  outHeaders.delete("content-length");

  // ✅ Aggiungi CORS anche alle risposte (non rompe, ma rende stabile)
  const ch = corsHeaders(req);
  Object.entries(ch).forEach(([k, v]) => outHeaders.set(k, v));

  return new Response(res.body, { status: res.status, headers: outHeaders });
}

// ✅ Next 15+: params è async
type Ctx = { params: Promise<{ path: string[] }> };

export async function GET(req: Request, ctx: Ctx) {
  const { path } = await ctx.params;
  return proxy(req, path);
}
export async function POST(req: Request, ctx: Ctx) {
  const { path } = await ctx.params;
  return proxy(req, path);
}
export async function PUT(req: Request, ctx: Ctx) {
  const { path } = await ctx.params;
  return proxy(req, path);
}
export async function PATCH(req: Request, ctx: Ctx) {
  const { path } = await ctx.params;
  return proxy(req, path);
}
export async function DELETE(req: Request, ctx: Ctx) {
  const { path } = await ctx.params;
  return proxy(req, path);
}
export async function OPTIONS(req: Request, ctx: Ctx) {
  const { path } = await ctx.params;
  return proxy(req, path);
}