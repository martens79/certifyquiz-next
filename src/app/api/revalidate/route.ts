// src/app/api/revalidate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

type RevalidateBody = {
  path?: string;
  paths?: string[];
  tags?: string[];       // NEW: revalidateTag support
  dryRun?: boolean;      // NEW: test senza eseguire
};

const MAX_ITEMS = 100;       // hard cap per evitare abusi
const MAX_PATH_LEN = 2048;   // sanity check

function isStringArray(a: unknown): a is string[] {
  return Array.isArray(a) && a.every((x) => typeof x === "string");
}

function normPath(p: string): string {
  // trim, forza slash iniziale, rimuovi spazi doppi
  let out = p.trim();
  if (!out.startsWith("/")) out = "/" + out;
  return out.slice(0, MAX_PATH_LEN);
}

export async function POST(req: NextRequest) {
  // 1) Auth
  const provided = req.headers.get("x-revalidate-secret")?.trim();
  if (!provided || provided !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  // 2) Body parsing safe
  let body: RevalidateBody = {};
  try {
    const raw = await req.json();
    if (raw && typeof raw === "object") body = raw as RevalidateBody;
  } catch {
    // body vuoto → va bene, gestiamo sotto
  }

  // 3) Raccolta input
  const list: string[] = [];
  if (typeof body.path === "string") list.push(body.path);
  if (isStringArray(body.paths)) list.push(...body.paths);

  const tags = isStringArray(body.tags) ? Array.from(new Set(body.tags.map((t) => t.trim()).filter(Boolean))) : [];

  // 4) Normalizza path
  const uniquePaths = Array.from(new Set(list.map(normPath))).filter(Boolean).slice(0, MAX_ITEMS);

  if (uniquePaths.length === 0 && tags.length === 0) {
    return NextResponse.json({ ok: false, error: "Missing path(s) or tags" }, { status: 400 });
  }

  // 5) Dry-run?
  if (body.dryRun) {
    return NextResponse.json({
      ok: true,
      dryRun: true,
      willRevalidate: uniquePaths,
      willRevalidateTags: tags,
      count: { paths: uniquePaths.length, tags: tags.length },
    });
  }

  // 6) Esecuzione
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
