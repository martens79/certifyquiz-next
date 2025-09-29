// src/app/api/revalidate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

type RevalidateBody =
  | { path: string; paths?: string[] }
  | { path?: string; paths: string[] }
  | Record<string, never>;

function isStringArray(a: unknown): a is string[] {
  return Array.isArray(a) && a.every((x) => typeof x === "string");
}

export async function POST(req: NextRequest) {
  const provided = req.headers.get("x-revalidate-secret")?.trim();
  if (!provided || provided !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  // Parse JSON in modo sicuro (anche se il body è vuoto o non-JSON)
  let body: RevalidateBody = {};
  try {
    const raw = await req.json();
    if (typeof raw === "object" && raw !== null) body = raw as RevalidateBody;
  } catch {
    body = {};
  }

  const list: string[] = [];

  if (typeof (body as { path?: unknown }).path === "string") {
    list.push((body as { path: string }).path);
  }
  if (isStringArray((body as { paths?: unknown }).paths)) {
    list.push(...(body as { paths: string[] }).paths);
  }

  // normalizza: trim, unici, solo non-vuoti
  const unique = Array.from(new Set(list.map((p) => p.trim()))).filter(Boolean);

  if (unique.length === 0) {
    return NextResponse.json({ ok: false, error: "Missing path(s)" }, { status: 400 });
  }

  try {
    for (const p of unique) {
      revalidatePath(p, "page"); // opzionale il secondo arg, ma esplicito è meglio
    }
    return NextResponse.json({ ok: true, revalidated: unique });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
