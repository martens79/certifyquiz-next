// app/api/revalidate/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

// ---- i18n base paths per lingua
const ALL_LOCALES = ["it", "en", "fr", "es"] as const;
type Locale = typeof ALL_LOCALES[number];
type Lang = Locale | "all";

const BASE_BY_LANG: Record<Locale, string> = {
  it: "/it/certificazioni",
  en: "/en/certifications",
  fr: "/fr/certifications",
  es: "/es/certificaciones",
};

type RevalidateBody = {
  // formati generici
  path?: string;
  paths?: string[];
  tags?: string[];
  dryRun?: boolean;

  // estensioni “universali”
  certSlug?: string; // es. "comptia-itf-plus"
  lang?: Lang;       // "it"|"en"|"fr"|"es"|"all"
  cascade?: boolean; // se true, revalida anche la lista per lingua
};

const MAX_ITEMS = 100;
const MAX_PATH_LEN = 2048;

function isStringArray(a: unknown): a is string[] {
  return Array.isArray(a) && a.every((x) => typeof x === "string");
}

function normPath(p: string): string {
  let out = p.trim();
  if (!out.startsWith("/")) out = "/" + out;
  return out.slice(0, MAX_PATH_LEN);
}

function uniq<T>(a: T[]): T[] {
  return Array.from(new Set(a));
}

// ping/health
export async function GET() {
  return NextResponse.json({ ok: true, hint: "Use POST", version: "v2-unified+langmap" });
}

// per chiarezza sui metodi
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: { Allow: "OPTIONS, GET, POST" } });
}

export async function POST(req: NextRequest) {
  // --- AUTH: header obbligatorio in prod; in preview consento anche ?secret= e normalizzo ---
  const env = process.env.VERCEL_ENV ?? "development";
  const url = new URL(req.url);

  const pick =
    (req.headers.get("x-revalidate-secret") ?? "") ||
    (env !== "production" ? (url.searchParams.get("secret") ?? "") : "");

  const normalize = (s: string) =>
    s.replace(/^\s+|\s+$/g, "").replace(/^['"]+|['"]+$/g, ""); // trim + strip quotes

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
  // in preview/dev: accetto qualsiasi secret non vuoto (ma se expected è settato e coincide, OK)

  // ---- Body parsing safe
  let body: RevalidateBody = {};
  try {
    const raw = await req.json();
    if (raw && typeof raw === "object") body = raw as RevalidateBody;
  } catch {
    // body vuoto → gestiamo sotto
  }

  // ---- Input diretto
  const list: string[] = [];
  if (typeof body.path === "string") list.push(body.path);
  if (isStringArray(body.paths)) list.push(...body.paths);

  const tags = isStringArray(body.tags)
    ? uniq(body.tags.map((t) => t.trim()).filter(Boolean))
    : [];

  // ---- Derivati da certSlug/lang/cascade (i18n corretta)
  const locales: Locale[] =
    body.lang && body.lang !== "all" ? [body.lang as Locale] : [...ALL_LOCALES];

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
  }

  // ---- Normalizza & limita
  const uniquePaths = uniq(list.concat(derived).map(normPath).filter(Boolean)).slice(0, MAX_ITEMS);

  if (uniquePaths.length === 0 && tags.length === 0) {
    return NextResponse.json({ ok: false, error: "Missing path(s) or tags or certSlug" }, { status: 400 });
  }

  // ---- Dry-run
  if (body.dryRun) {
    return NextResponse.json({
      ok: true,
      dryRun: true,
      willRevalidate: uniquePaths,
      willRevalidateTags: tags,
      count: { paths: uniquePaths.length, tags: tags.length },
    });
  }

  // ---- Esecuzione
  try {
    for (const p of uniquePaths) revalidatePath(p, "page");
    for (const t of tags) revalidateTag(t);

    return NextResponse.json({
      ok: true,
      revalidated: uniquePaths,
      revalidatedTags: tags,
      count: { paths: uniquePaths.length, tags: tags.length },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
