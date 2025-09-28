// src/app/api/revalidate-cert/[slug]/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

// (facoltativo) GET di diagnosi: puoi tenerlo o rimuoverlo
export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ slug: string }> }
) {
  const { slug } = await ctx.params;
  return NextResponse.json({ ok: true, msg: "Route OK, usa POST", slug });
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ slug: string }> }
) {
  const { slug } = await ctx.params;

  // 1) Legge i segreti ammessi (lista o singolo)
  const allowed = ((process.env.REVALIDATE_SECRETS ??
                    process.env.REVALIDATE_SECRET ??
                    "") as string)
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  // 2) Raccoglie il secret "fornito" (header, query, body)
  const hdrSecret = (req.headers.get("x-revalidate-secret") ?? "").trim();
  const qsSecret  = (req.nextUrl.searchParams.get("secret") ?? "").trim();
  let bodySecret = "";
  try {
    const b = await req.json();
    if (b && typeof b.secret === "string") bodySecret = b.secret.trim();
  } catch { /* body vuoto/non-json: ok */ }

  const provided = hdrSecret || qsSecret || bodySecret;

  // 3) DEBUG sicuro: se ?debug=1 mostriamo perché rifiutiamo (senza svelare segreti)
  const wantDebug = req.nextUrl.searchParams.get("debug") === "1";

  // ---- BLOCCO CHE HAI CHIESTO DI RIFARE (con extra debug mismatch) ----
  if (!allowed.length || !provided || !allowed.includes(provided)) {
    let reason: "Missing allowed secrets" | "Missing provided secret" | "Secret mismatch";
    if (!allowed.length) reason = "Missing allowed secrets";
    else if (!provided) reason = "Missing provided secret";
    else reason = "Secret mismatch";

    // trova il primo secret consentito con stessa length del provided
    const candidate = allowed.find(s => s.length === provided.length) ?? allowed[0] ?? "";

    // calcola indice del primo char differente (solo per debug)
    let firstDiff = -1, envCode = undefined as number|undefined, providedCode = undefined as number|undefined;
    const L = Math.min(candidate.length, provided.length);
    for (let i = 0; i < L; i++) {
      if (candidate.charCodeAt(i) !== provided.charCodeAt(i)) {
        firstDiff = i;
        envCode = candidate.charCodeAt(i);
        providedCode = provided.charCodeAt(i);
        break;
      }
    }

    const payload = {
      ok: false,
      reason,
      // info innocue utili al debug
      allowCount: allowed.length,
      allowLens: allowed.map(s => s.length),
      providedLen: provided.length,
      source: hdrSecret ? "header" : qsSecret ? "query" : bodySecret ? "body" : "none",
      // mismatch details (non stampiamo valori, solo codepoint/indice)
      firstDiff,
      envCode,
      providedCode,
    };

    // in debug rispondiamo 200 per far leggere il body anche a client che esplodono sui 401
    return NextResponse.json(payload, { status: wantDebug ? 200 : 401 });
  }
  // ---------------------------------------------------------------------

  if (!slug) {
    return NextResponse.json({ ok: false, error: "Missing slug" }, { status: 400 });
  }

  // Pagine collegate (adatta ai tuoi path reali)
  const paths = [
    `/it/certificazioni/${slug}`,
    `/en/certifications/${slug}`,
    `/fr/certifications/${slug}`,
    `/es/certificaciones/${slug}`,
    "/",
    "/it/certificazioni",
  ];

  try {
    // Invalida path e tag
    paths.forEach((p) => revalidatePath(p));
    revalidateTag(`cert:${slug}`);
    revalidateTag("certs:list");

    return NextResponse.json({ ok: true, slug, paths });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
