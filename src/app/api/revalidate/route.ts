// app/api/revalidate/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

/** i18n base */
const ALL_LOCALES = ["it", "en", "fr", "es"] as const;
type Locale = typeof ALL_LOCALES[number];
type Lang = Locale | "all";

const BASE_BY_LANG: Record<Locale, string> = {
  it: "/it/certificazioni",
  en: "/en/certifications",
  fr: "/fr/certifications",
  es: "/es/certificaciones",
};

/** input */
type RevalidateBody = {
  // generici
  path?: string;
  paths?: string[];
  tags?: string[];
  dryRun?: boolean;

  // estesi
  certSlug?: string; // es. "ccna"
  lang?: Lang;       // "it"|"en"|"fr"|"es"|"all"
  cascade?: boolean; // se true, revalida anche la lista per lingua (e home se all)
};

/** safety & limiti */
const MAX_ITEMS = 100;
const MAX_PATH_LEN = 2048;
const SLUG_RE = /^[a-z0-9-]{1,120}$/i;

/** utils */
function isStringArray(a: unknown): a is string[] {
  return Array.isArray(a) && a.every((x) => typeof x === "string");
}
function normPath(p: string): string {
  let out = (p || "").trim();
  if (!out.startsWith("/")) out = "/" + out;
  return out.slice(0, MAX_PATH_LEN);
}
function uniq<T>(a: T[]): T[] {
  return Array.from(new Set(a));
}
const norm = (s: string) => s.replace(/^\s+|\s+$/g, "").replace(/^['"]+|['"]+$/g, "");

/** CORS (più stretto in prod) */
function corsHeaders() {
  const isProd = process.env.NODE_ENV === "production";
  const origin = isProd ? (process.env.CORS_ORIGIN ?? "https://www.certifyquiz.com") : "*";
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "OPTIONS, GET, POST",
    "Access-Control-Allow-Headers": "Content-Type, x-revalidate-secret",
  };
}

/** health */
export async function GET() {
  return NextResponse.json(
    { ok: true, hint: "Use POST", version: "v2-unified+langmap+tags" },
    { headers: corsHeaders() }
  );
}

/** preflight */
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

/** main */
export async function POST(req: NextRequest) {
  // auth
  const provided = norm(req.headers.get("x-revalidate-secret") ?? "");
  const expected = norm(process.env.REVALIDATE_SECRET ?? "");
  if (!provided || !expected || provided !== expected) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401, headers: corsHeaders() });
  }

  // body
  let body: RevalidateBody = {};
  try {
    const raw = await req.json();
    if (raw && typeof raw === "object") body = raw as RevalidateBody;
  } catch {
    // body vuoto → gestiamo sotto
  }

  // input diretto
  const list: string[] = [];
  if (typeof body.path === "string") list.push(body.path);
  if (isStringArray(body.paths)) list.push(...body.paths);

  // tags espliciti
  const tags: string[] = isStringArray(body.tags)
    ? uniq(body.tags.map((t) => t.trim()).filter(Boolean))
    : [];

  // validazione slug (se presente)
  if (body.certSlug && !SLUG_RE.test(body.certSlug)) {
    return NextResponse.json({ ok: false, error: "Invalid certSlug" }, { status: 400, headers: corsHeaders() });
  }

  // derivati i18n da certSlug/lang/cascade
  const locales: Locale[] = body.lang && body.lang !== "all" ? [body.lang as Locale] : [...ALL_LOCALES];

  const derived: string[] = [];
  if (body.certSlug) {
    for (const L of locales) {
      const base = BASE_BY_LANG[L];
      derived.push(`${base}/${body.certSlug}`);
      if (body.cascade) derived.push(base);
    }
    if (body.cascade && (body.lang === "all" || !body.lang)) {
      derived.push("/"); // opzionale: tocca anche la home
    }
    // auto-tag “cert-centrico”
    tags.push(`cert:${body.certSlug}`, "certs:list");
  }

  // normalizza/limita
  const uniquePaths = uniq(list.concat(derived).map(normPath).filter(Boolean)).slice(0, MAX_ITEMS);
  const uniqueTags = uniq(tags);

  if (uniquePaths.length === 0 && uniqueTags.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Missing path(s), tags or certSlug" },
      { status: 400, headers: corsHeaders() }
    );
  }

  // dry run
  if (body.dryRun) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[revalidate:dryRun]", { paths: uniquePaths, tags: uniqueTags });
    }
    return NextResponse.json(
      {
        ok: true,
        dryRun: true,
        willRevalidate: uniquePaths,
        willRevalidateTags: uniqueTags,
        count: { paths: uniquePaths.length, tags: uniqueTags.length },
      },
      { headers: corsHeaders() }
    );
  }

  // esecuzione
  try {
    for (const p of uniquePaths) revalidatePath(p);      // param "page" non necessario
    for (const t of uniqueTags) revalidateTag(t);

    if (process.env.NODE_ENV !== "production") {
      console.log("[revalidate:done]", { paths: uniquePaths, tags: uniqueTags });
    }

    return NextResponse.json(
      {
        ok: true,
        revalidated: uniquePaths,
        revalidatedTags: uniqueTags,
        count: { paths: uniquePaths.length, tags: uniqueTags.length },
      },
      { headers: corsHeaders() }
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg }, { status: 500, headers: corsHeaders() });
  }
}
