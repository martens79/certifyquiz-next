// app/api/revalidate-cert/[slug]/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

const BASE_BY_LANG = {
  it: "/it/certificazioni",
  en: "/en/certifications",
  fr: "/fr/certifications",
  es: "/es/certificaciones",
} as const;

export async function POST(req: Request) {
  // AUTH — solo header, confronto rigoroso (normalizzato)
  const norm = (s: string) => s.replace(/^\s+|\s+$/g, "").replace(/^['"]+|['"]+$/g, "");
  const provided = norm(req.headers.get("x-revalidate-secret") ?? "");
  const expected = norm(process.env.REVALIDATE_SECRET ?? "");
  if (!provided || !expected || provided !== expected) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  // URL per query/slug/base
  const url = new URL(req.url);

  // Ricava lo slug dalla URL: /api/revalidate-cert/<slug>?cascade=1
  const slug = decodeURIComponent(url.pathname.replace(/^\/api\/revalidate-cert\//, "") || "");
  if (!slug) {
    return NextResponse.json({ ok: false, error: "Missing slug" }, { status: 400 });
  }

  const cascade = url.searchParams.get("cascade") === "1";

  // Path da revalidare (tutte le lingue)
  const paths: string[] = [];
  (Object.keys(BASE_BY_LANG) as Array<keyof typeof BASE_BY_LANG>).forEach((L) => {
    paths.push(`${BASE_BY_LANG[L]}/${slug}`);
    if (cascade) paths.push(BASE_BY_LANG[L]);
  });
  if (cascade) paths.push("/");

  // Base dell’app: env o origin richiesta
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? `${url.protocol}//${url.host}`;

  // Forward verso l’endpoint universale
  const res = await fetch(`${base}/api/revalidate`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-revalidate-secret": provided,
    },
    body: JSON.stringify({
      certSlug: slug,
      lang: "all",
      cascade,
      paths,
      // tags: ["certs:list", `cert:${slug}`], // se usi i tag, scommenta/allinea
    }),
    cache: "no-store",
  }).catch(() => null);

  if (!res) {
    return NextResponse.json({ ok: false, error: "forward failed" }, { status: 500 });
  }

  const json = await res.json().catch(() => ({ ok: false, error: "bad JSON" }));
  return NextResponse.json(json, { status: res.ok ? 200 : res.status });
}
