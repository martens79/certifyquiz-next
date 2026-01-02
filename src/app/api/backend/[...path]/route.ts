// src/app/api/backend/[...path]/route.ts

const LOCAL_API_BASE = "http://127.0.0.1:8080/api";

function buildTargetUrl(req: Request, path: string[]) {
  const incoming = new URL(req.url);
  const target = new URL(`${LOCAL_API_BASE}/${path.join("/")}`);
  target.search = incoming.search; // preserva querystring
  return target.toString();
}

async function proxy(req: Request, path: string[]) {
  const url = buildTargetUrl(req, path);

  // Copia headers (incluso Authorization) e rimuovi host
  const headers = new Headers(req.headers);
  headers.delete("host");

  // Body solo per metodi non GET/HEAD
  const method = req.method.toUpperCase();
  const body =
    method === "GET" || method === "HEAD" ? undefined : await req.arrayBuffer();

  const res = await fetch(url, {
    method,
    headers,
    body,
    redirect: "manual",
  });

  // Rimanda status + headers + stream body
  const outHeaders = new Headers(res.headers);

  // (Opzionale) evita headers che a volte danno fastidio in dev
  // outHeaders.delete("content-encoding");

  return new Response(res.body, { status: res.status, headers: outHeaders });
}

export async function GET(req: Request, ctx: { params: { path: string[] } }) {
  return proxy(req, ctx.params.path);
}
export async function POST(req: Request, ctx: { params: { path: string[] } }) {
  return proxy(req, ctx.params.path);
}
export async function PUT(req: Request, ctx: { params: { path: string[] } }) {
  return proxy(req, ctx.params.path);
}
export async function PATCH(req: Request, ctx: { params: { path: string[] } }) {
  return proxy(req, ctx.params.path);
}
export async function DELETE(
  req: Request,
  ctx: { params: { path: string[] } }
) {
  return proxy(req, ctx.params.path);
}
export async function OPTIONS(
  req: Request,
  ctx: { params: { path: string[] } }
) {
  return proxy(req, ctx.params.path);
}
