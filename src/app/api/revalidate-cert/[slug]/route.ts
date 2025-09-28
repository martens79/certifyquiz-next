export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;

  const envSecret = (process.env.REVALIDATE_SECRET ?? "").trim();

  // Accetta il secret in 3 modi: header, query (?secret=), body {secret:"..."}
  const hdrSecret = (req.headers.get("x-revalidate-secret") ?? "").trim();
  const urlSecret = (req.nextUrl.searchParams.get("secret") ?? "").trim();
  let bodySecret = "";
  try {
    const body = await req.json();
    if (body && typeof body.secret === "string") bodySecret = body.secret.trim();
  } catch {
    // body vuoto o non JSON: ok
  }

  const provided = hdrSecret || urlSecret || bodySecret;

  // Debug sicuro: non mostriamo i valori, solo stato/length/uguaglianza
  const debug = req.nextUrl.searchParams.get("debug") === "1";
  if (!envSecret || !provided || envSecret !== provided) {
    const payload = {
      ok: false,
      reason: !envSecret
        ? "Missing ENV REVALIDATE_SECRET"
        : !provided
        ? "Missing secret (header/query/body)"
        : "Secret mismatch",
      envPresent: !!envSecret,
      providedPresent: !!provided,
      envLen: envSecret.length,
      providedLen: provided.length,
      equal: envSecret === provided,
      source: hdrSecret ? "header" : urlSecret ? "query" : bodySecret ? "body" : "none",
    };
    return NextResponse.json(payload, { status: 401 });
  }

  if (!slug) {
    return NextResponse.json({ ok: false, error: "Missing slug" }, { status: 400 });
  }

  const paths = [
    `/it/certificazioni/${slug}`,
    `/en/certifications/${slug}`,
    `/fr/certifications/${slug}`,
    `/es/certificaciones/${slug}`,
    "/",
    "/it/certificazioni",
  ];

  try {
    paths.forEach((p) => revalidatePath(p));
    revalidateTag(`cert:${slug}`);
    revalidateTag("certs:list");
    return NextResponse.json({ ok: true, slug, paths });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
