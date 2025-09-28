// src/app/api/revalidate-cert/[slug]/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

// (opzionale) rimuovi pure questa GET quando hai finito i test
export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return NextResponse.json({ ok: true, msg: "Route OK, usa POST", slug });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // ✅ Accetta l'ENV + fallback al nuovo secret così non resti bloccato
const allowed = [
  ...(((process.env.REVALIDATE_SECRETS ?? process.env.REVALIDATE_SECRET ?? "") as string)
      .split(",").map(s => s.trim()).filter(Boolean)),
  "ilnomedimianonnaealbertatoch", // fallback temporaneo
];
  const hdr = (req.headers.get("x-revalidate-secret") ?? "").trim();
  const qs  = (req.nextUrl.searchParams.get("secret") ?? "").trim();
  let body = "";
  try { const b = await req.json(); if (b && typeof b.secret === "string") body = b.secret.trim(); } catch {}

  const provided = hdr || qs || body;
  if (!allowed.length || !provided || !allowed.includes(provided)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (!slug) return NextResponse.json({ ok: false, error: "Missing slug" }, { status: 400 });

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
