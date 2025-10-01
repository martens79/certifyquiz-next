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
  // URL per estrarre query e slug
  const url = new URL(req.url);

  // Auth: header oppure ?secret= (solo fuori da production)
  const fromHeader = (req.headers.get("x-revalidate-secret") ?? "").trim();
  const fromQs = url.searchParams.get("secret")?.trim() || "";
  const provided =
    fromHeader || (process.env.VERCEL_ENV !== "production" ? fromQs : "");

  if (!provided || provided !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  // Ricava lo slug dalla URL: /api/revalidate-cert/<slug>?cascade=1
  const slug = decodeURIComponent(url.pathname.replace(/^\/api\/revalidate-cert\//, "") || "");
  if (!slug) {
    return NextResponse.json({ ok: false, error: "Missing slug" }, { status: 400 });
  }

  const cascade = url.searchParams.get("cascade") === "1";

  // Costruisci i path da revalidare
  const paths: string[] = [];
  (Object.keys(BASE_BY_LANG) as Array<keyof typeof BASE_BY_LANG>).forEach((L) => {
    paths.push(`${BASE_BY_LANG[L]}/${slug}`);
    if (cascade) paths.push(BASE_BY_LANG[L]);
  });
  if (cascade) paths.push("/");

  // Base URL dell’app (env o origin della richiesta)
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? url.origin;

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
