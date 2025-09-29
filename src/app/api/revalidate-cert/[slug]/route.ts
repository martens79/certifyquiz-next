// src/app/api/revalidate-cert/[slug]/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { ENV } from "@/lib/env";

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ slug: string }> } // 👈 allineato al tuo tipo
) {
  const provided = (req.headers.get("x-revalidate-secret") ?? "").trim();
  if (provided !== ENV.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  // 👇 qui “await” per leggere params
  const { slug: raw } = await ctx.params;
  const slug = decodeURIComponent(raw ?? "");
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
    "/en/certifications",
    "/fr/certifications",
    "/es/certificaciones",
  ];

  try {
    revalidateTag(`cert:${slug}`);
    revalidateTag("certs:list");
    for (const p of paths) revalidatePath(p, "page");
    return NextResponse.json({ ok: true, slug, paths });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
