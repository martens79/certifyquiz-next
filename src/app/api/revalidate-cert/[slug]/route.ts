export const runtime = "nodejs";
// (opzionale) non serve forzare dynamic qui; le route API sono già dinamiche
// export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { ENV } from "@/lib/env";

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } } // ❗ non è una Promise
) {
  const provided = (req.headers.get("x-revalidate-secret") ?? "").trim();
  if (provided !== ENV.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const slug = decodeURIComponent(params.slug ?? "");
  if (!slug) {
    return NextResponse.json({ ok: false, error: "Missing slug" }, { status: 400 });
  }

  // Pagine da invalidare (adatta se i tuoi path differiscono)
  const paths = [
    `/it/certificazioni/${slug}`,
    `/en/certifications/${slug}`,
    `/fr/certifications/${slug}`,
    `/es/certificaciones/${slug}`,
    "/",
    "/it/certificazioni",
    "/en/certifications",
    "/fr/certifications",
    "/es/certificaciones",
  ];

  try {
    // Tag: dettaglio + lista
    revalidateTag(`cert:${slug}`);
    revalidateTag("certs:list");

    // Pagine
    for (const p of paths) revalidatePath(p, "page");

    return NextResponse.json({ ok: true, slug, paths });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
