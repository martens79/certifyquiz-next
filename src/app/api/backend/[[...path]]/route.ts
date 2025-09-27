import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_BASE_URL!; // -> imposta su Vercel: API_BASE_URL=https://api.certifyquiz.com

function target(path: string[] = [], search: string) {
  const p = path.join("/");
  return `${API_BASE}${p ? `/${p}` : ""}${search ? `?${search}` : ""}`;
}

async function forward(req: NextRequest, method: string, path?: string[]) {
  const url = target(path ?? [], req.nextUrl.searchParams.toString());
  const body = method === "GET" || method === "HEAD" ? undefined : await req.arrayBuffer();

  const res = await fetch(url, {
    method,
    body,
    headers: {
      Accept: req.headers.get("accept") || "*/*",
      "Content-Type": req.headers.get("content-type") || "",
      Authorization: req.headers.get("authorization") || "",
      cookie: req.headers.get("cookie") || "",
    },
    cache: "no-store",
  });

  const text = await res.text();
  const out = new NextResponse(text, { status: res.status });

  const setCookie = res.headers.get("set-cookie");
  if (setCookie) out.headers.set("set-cookie", setCookie);
  const ct = res.headers.get("content-type");
  if (ct) out.headers.set("content-type", ct);

  return out;
}

export const GET    = (req: NextRequest, { params }: { params: { path?: string[] } }) => forward(req, "GET", params.path);
export const POST   = (req: NextRequest, { params }: { params: { path?: string[] } }) => forward(req, "POST", params.path);
export const PUT    = (req: NextRequest, { params }: { params: { path?: string[] } }) => forward(req, "PUT", params.path);
export const PATCH  = (req: NextRequest, { params }: { params: { path?: string[] } }) => forward(req, "PATCH", params.path);
export const DELETE = (req: NextRequest, { params }: { params: { path?: string[] } }) => forward(req, "DELETE", params.path);
