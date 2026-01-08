// app/api/backend/[[...path]]/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const RAW_BASE = process.env.API_BASE_URL ?? "https://api.certifyquiz.com/api";
const API_BASE = RAW_BASE.replace(/\/+$/, "");

function makeUrl(pathSegs: string[] | undefined, search: URLSearchParams) {
  const segs = pathSegs?.length ? "/" + pathSegs.map(encodeURIComponent).join("/") : "";
  const qs = search.toString();
  return `${API_BASE}${segs}${qs ? `?${qs}` : ""}`;
}

async function fetchUpstream(url: string, req: NextRequest, method: string, body?: ArrayBuffer) {
  const headers = new Headers(req.headers);
  headers.set("accept", headers.get("accept") ?? "application/json");
  if (!headers.get("content-type")) headers.delete("content-type");
  if (!headers.get("authorization")) headers.delete("authorization");
  const init: RequestInit = { method, headers, cache: "no-store" };
  if (body) init.body = body;
  return fetch(url, init);
}

const slugify = (s: unknown) =>
  String(s ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

async function passThrough(req: NextRequest, method: string, path: string[] | undefined) {
  const search = req.nextUrl.searchParams;
  const body = method === "GET" || method === "HEAD" ? undefined : await req.arrayBuffer();

  const tried: string[] = [];
  const first = makeUrl(path, search);
  tried.push(first);

  let res = await fetchUpstream(first, req, method, body);

  // Fallback SOLO per GET /certifications/{slug}
  if (method === "GET" && path && path[0] === "certifications" && path.length === 2 && !res.ok) {
    const slug = path[1]!;
    let text = "";
    try { text = await res.clone().text(); } catch {}
    const looksBad = res.status === 400 || res.status === 404 || /bad_id/i.test(text);

    if (looksBad) {
      // ALT1: ?slug=
      const sp1 = new URLSearchParams(search);
      sp1.set("slug", slug);
      const alt1 = `${API_BASE}/certifications?${sp1.toString()}`;
      tried.push(alt1);
      const r1 = await fetchUpstream(alt1, req, "GET");
      if (r1.ok) {
        res = r1;
      } else {
        // ALT2: /by-slug/{slug}
        const alt2 = `${API_BASE}/certifications/by-slug/${encodeURIComponent(slug)}${search.size ? `?${search.toString()}` : ""}`;
        tried.push(alt2);
        const r2 = await fetchUpstream(alt2, req, "GET");
        if (r2.ok) {
          res = r2;
        } else {
          // ALT3: lista → trova id → /{id}
          const listUrl = `${API_BASE}/certifications${search.size ? `?${search.toString()}` : ""}`;
          tried.push(listUrl);
          const listRes = await fetchUpstream(listUrl, req, "GET");
          if (listRes.ok) {
            try {
              const arr = (await listRes.clone().json()) as Array<Record<string, unknown>>;
              const found =
                Array.isArray(arr) &&
                arr.find(
                  (x) =>
                    (typeof x?.slug === "string" && x.slug === slug) ||
                    slugify(x?.name) === slug
                );
              const id = found && typeof found.id === "number" ? found.id : undefined;
              if (id) {
                const alt3 = `${API_BASE}/certifications/${id}${search.size ? `?${search.toString()}` : ""}`;
                tried.push(alt3);
                const r3 = await fetchUpstream(alt3, req, "GET");
                if (r3.ok) res = r3;
              }
            } catch {}
          }
        }
      }
    }
  }

  const txt = await res.text();
  const out = new NextResponse(txt, { status: res.status });
  out.headers.set("content-type", res.headers.get("content-type") ?? "application/json; charset=utf-8");
  const setCookie = res.headers.get("set-cookie");
  if (setCookie) out.headers.set("set-cookie", setCookie);
  out.headers.set("x-upstream-url", res.url || first);
  out.headers.set("x-upstream-tried", tried.join(" || "));
  return out;
}

type Ctx = { params: Promise<{ path?: string[] }> };
export async function GET(req: NextRequest, ctx: Ctx) { const { path } = await ctx.params; return passThrough(req, "GET", path); }
export async function HEAD(req: NextRequest, ctx: Ctx) { const { path } = await ctx.params; return passThrough(req, "HEAD", path); }
export async function POST(req: NextRequest, ctx: Ctx) { const { path } = await ctx.params; return passThrough(req, "POST", path); }
export async function PUT(req: NextRequest, ctx: Ctx) { const { path } = await ctx.params; return passThrough(req, "PUT", path); }
export async function PATCH(req: NextRequest, ctx: Ctx) { const { path } = await ctx.params; return passThrough(req, "PATCH", path); }
export async function DELETE(req: NextRequest, ctx: Ctx) { const { path } = await ctx.params; return passThrough(req, "DELETE", path); }
