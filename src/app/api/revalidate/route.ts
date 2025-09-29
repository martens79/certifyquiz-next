import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-revalidate-secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  // Accetta sia { path: "/foo" } sia { paths: ["/a", "/b"] }
  const body = await req.json().catch(() => ({} as any));
  const { path, paths } = body as { path?: string; paths?: string[] };

  const list = Array.from(
    new Set(
      (Array.isArray(paths) ? paths : []).concat(typeof path === "string" ? [path] : [])
    )
  ).filter(Boolean);

  if (list.length === 0) {
    return NextResponse.json({ ok: false, error: "Missing path(s)" }, { status: 400 });
  }

  list.forEach((p) => revalidatePath(p));
  return NextResponse.json({ ok: true, revalidated: list });
}
