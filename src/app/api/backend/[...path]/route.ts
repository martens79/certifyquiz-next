// src/app/api/backend/[...path]/route.ts

const API_REMOTE = process.env.API_BASE_URL || "https://api.certifyquiz.com/api";
const API_LOCAL = process.env.API_BASE_URL_DEV || "http://127.0.0.1:8080/api";

// Se sei su Vercel, NON usare mai il locale.
// In locale, usa DEV a meno che tu voglia forzare remoto.
const IS_VERCEL = !!process.env.VERCEL;
const FORCE_REMOTE = process.env.USE_REMOTE_API === "1";

const TARGET_BASE = IS_VERCEL || FORCE_REMOTE ? API_REMOTE : API_LOCAL;

function buildTargetUrl(req: Request, path: string[]) {
  const incoming = new URL(req.url);
  const target = new URL(`${TARGET_BASE}/${path.join("/")}`);
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

async function proxy(req: Request, path: string[]) {
  // Rispondi subito al preflight: evita fetch inutile e problemi CORS locali
  if (req.method.toUpperCase() === "OPTIONS") {
    return new Response(null, { status: 204 });
  }

  const url = buildTargetUrl(req, path);
  const headers = sanitizeHeaders(req.headers);

  const method = req.method.toUpperCase();
  const body =
    method === "GET" || method === "HEAD" ? undefined : await req.arrayBuffer();

  const res = await fetch(url, { method, headers, body, redirect: "manual" });

  // Copia headers risposta in modo safe
  const outHeaders = new Headers(res.headers);
  outHeaders.delete("content-encoding"); // evita mismatch se runtime ricompone
  outHeaders.delete("content-length");

  return new Response(res.body, { status: res.status, headers: outHeaders });
}

export async function GET(req: Request, ctx: any) {
  return proxy(req, ctx.params.path as string[]);
}
export async function POST(req: Request, ctx: any) {
  return proxy(req, ctx.params.path as string[]);
}
export async function PUT(req: Request, ctx: any) {
  return proxy(req, ctx.params.path as string[]);
}
export async function PATCH(req: Request, ctx: any) {
  return proxy(req, ctx.params.path as string[]);
}
export async function DELETE(req: Request, ctx: any) {
  return proxy(req, ctx.params.path as string[]);
}
export async function OPTIONS(req: Request, ctx: any) {
  return proxy(req, ctx.params.path as string[]);
}
