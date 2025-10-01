// src/app/api/revalidate/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

type Lang = "it" | "en" | "fr" | "es" | "all";

type RevalidateBody = {
  // Formati già supportati
  path?: string;
  paths?: string[];
  tags?: string[];         // supporto revalidateTag
  dryRun?: boolean;        // test senza eseguire

  // Estensioni “universali”
  certSlug?: string;       // es. "comptia-itf-plus"
  lang?: Lang;             // "it"|"en"|"fr"|"es"|"all"
  cascade?: boolean;       // se true, revalida anche la lista /[lang]/certificazioni
};

const MAX_ITEMS = 100;       // hard cap anti-abuso
const MAX_PATH_LEN = 2048;   // sanity check

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

// Handler di cortesia per verificare che la route sia deployata
export async function GET() {
  return NextResponse.json({ ok: true, hint: "Use POST", version: "v2-unified+fallback" });
}


// Espone anche OPTIONS così l'header Allow è chiaro
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: { Allow: "OPTIONS, GET, POST" } });
}

export async function POST(req: NextRequest) {
 // --- AUTH robusta: header o ?secret= (solo fuori da prod), con fallback se ENV mancante ---
// 1) Auth — preview permissiva: accetta header o ?secret= se non sei in production
const env = process.env.VERCEL_ENV ?? "development";
const url = new URL(req.url);
const fromHeader = req.headers.get("x-revalidate-secret")?.trim() || "";
const fromQs = url.searchParams.get("secret")?.trim() || "";
const provided = fromHeader || (env !== "production" ? fromQs : "");
const expected = process.env.REVALIDATE_SECRET?.trim() || "";

if (!provided) {
  return NextResponse.json({ ok: false, error: "Unauthorized (missing secret)" }, { status: 401 });
}

if (env === "production") {
  // in production: confronto rigoroso
  if (!expected || provided !== expected) {
    return NextResponse.json({ ok: false, error: "Unauthorized (prod secret mismatch)" }, { status: 401 });
  }
} else {
  // in preview/dev: se c'è un expected e combacia, bene; altrimenti accettiamo comunque
  // (niente altro da fare)
}



  // 2) Body parsing safe
  let body: RevalidateBody = {};
  try {
    const raw = await req.json();
    if (raw && typeof raw === "object") body = raw as RevalidateBody;
  } catch {
    // body vuoto → gestiamo sotto
  }

  // 3) Raccolta input (paths/tags “diretti”)
  const list: string[] = [];
  if (typeof body.path === "string") list.push(body.path);
  if (isStringArray(body.paths)) list.push(...body.paths);

  const tags = isStringArray(body.tags)
    ? uniq(body.tags.map((t) => t.trim()).filter(Boolean))
    : [];

  // 4) Derivati da certSlug/lang/cascade (i18n)
  const locales = body.lang && body.lang !== "all" ? [body.lang] : ["it", "en", "fr", "es"];
  const derived: string[] = [];

  if (body.certSlug) {
    for (const L of locales) {
      derived.push(`/${L}/certificazioni/${body.certSlug}`);
      if (body.cascade) {
        derived.push(`/${L}/certificazioni`); // lista per lingua
      }
    }
  }

  // 5) Normalizza e limita
  const uniquePaths = uniq(
    list.concat(derived).map(normPath).filter(Boolean)
  ).slice(0, MAX_ITEMS);

  if (uniquePaths.length === 0 && tags.length === 0) {
    return NextResponse.json({ ok: false, error: "Missing path(s) or tags or certSlug" }, { status: 400 });
  }

  // 6) Dry-run?
  if (body.dryRun) {
    return NextResponse.json({
      ok: true,
      dryRun: true,
      willRevalidate: uniquePaths,
      willRevalidateTags: tags,
      count: { paths: uniquePaths.length, tags: tags.length },
    });
  }

  // 7) Esecuzione
  try {
    for (const p of uniquePaths) {
      revalidatePath(p, "page"); // esplicito
    }
    for (const t of tags) {
      revalidateTag(t);
    }

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
