// src/app/api/revalidate-cert/[slug]/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

// GET di diagnosi (puoi rimuoverlo dopo i test)
export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ slug: string }> } // 👈 params come Promise
) {
  const { slug } = await ctx.params;
  return NextResponse.json({ ok: true, msg: "Route OK, usa POST", slug });
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ slug: string }> }
) {
  const { slug } = await ctx.params;

  // prendi segreti e normalizza (trim per rimuovere spazi accidentali)
  const envSecret = (process.env.REVALIDATE_SECRET ?? "").trim();
  const hdrSecret = (req.headers.get("x-revalidate-secret") ?? "").trim();

  // 🔎 modalità debug: aggiungi ?debug=1 alla URL per vedere lo stato
  const debug = req.nextUrl.searchParams.get("debug") === "1";
  if (!envSecret || !hdrSecret || envSecret !== hdrSecret) {
    const payload = {
      ok: false,
      reason: !envSecret
        ? "Missing ENV REVALIDATE_SECRET"
        : !hdrSecret
        ? "Missing header x-revalidate-secret"
        : "Secret mismatch",
      // info innocue per capire: NIENTE segreti in chiaro
      envPresent: !!envSecret,
      hdrPresent: !!hdrSecret,
      envLen: envSecret.length,
      hdrLen: hdrSecret.length,
      equal: envSecret === hdrSecret,
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
