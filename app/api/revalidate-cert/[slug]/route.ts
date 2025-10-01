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

  // --- AUTH robusta: header o ?secret= (solo fuori da prod), con fallback se ENV mancante ---
// Auth — strict in production, ma normalizza (trim + strip quotes) per evitare mismatch accidentali
const env = process.env.VERCEL_ENV ?? "development";
const url = new URL(req.url);

const fromHeader = (req.headers.get("x-revalidate-secret") ?? "");
const fromQs = url.searchParams.get("secret") ?? "";
const pick = fromHeader || (env !== "production" ? fromQs : "");

const normalize = (s: string) =>
  s.replace(/^\s+|\s+$/g, "").replace(/^['"]+|['"]+$/g, ""); // trim + togli quote esterne

const provided = normalize(pick);
const expected = normalize(process.env.REVALIDATE_SECRET ?? "");

if (!provided) {
  return NextResponse.json({ ok: false, error: "Unauthorized (missing secret)" }, { status: 401 });
}
if (env === "production") {
  if (!expected || provided !== expected) {
    return NextResponse.json({ ok: false, error: "Unauthorized (prod secret mismatch)" }, { status: 401 });
  }
}
// in preview/dev: se c'è expected e coincide bene, altrimenti accettiamo purché non vuoto



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
