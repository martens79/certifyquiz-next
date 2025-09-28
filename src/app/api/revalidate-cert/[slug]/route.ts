export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

const ALLOWED = new Set([
  "supersegreto_lungo",
  "ilnomedimianonnaealbertatoch", // usa questo come definitivo
]);

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const provided = (req.headers.get("x-revalidate-secret") ?? "").trim();
  if (!provided || !ALLOWED.has(provided)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
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
