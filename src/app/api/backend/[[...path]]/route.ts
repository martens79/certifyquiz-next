import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const API_BASE = process.env.API_BASE_URL!; // imposta su Vercel

function buildTarget(path: string[] | undefined, search: string) {
  const segs = path && path.length ? "/" + path.join("/") : "";
  return `${API_BASE}${segs}${search ? `?${search}` : ""}`;
}

async function forward(method: string, req: NextRequest, path: string[] | undefined) {
  const url = buildTarget(path, req.nextUrl.searchParams.toString());
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

  // Copia body e header principali
  const text = await res.text();
  const out = new NextResponse(text, { status: res.status });

  const setCookie = res.headers.get("set-cookie");
  if (setCookie) out.headers.set("set-cookie", setCookie);

  const ct = res.headers.get("content-type");
  if (ct) out.headers.set("content-type", ct);

  return out;
}

// 👇 In Next 15, context.params è una Promise: serve await
export async function GET(req: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
  const { path } = await context.params;
  return forward("GET", req, path);
}
export async function POST(req: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
  const { path } = await context.params;
  return forward("POST", req, path);
}
export async function PUT(req: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
  const { path } = await context.params;
  return forward("PUT", req, path);
}
export async function PATCH(req: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
  const { path } = await context.params;
  return forward("PATCH", req, path);
}
export async function DELETE(req: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
  const { path } = await context.params;
  return forward("DELETE", req, path);
}
