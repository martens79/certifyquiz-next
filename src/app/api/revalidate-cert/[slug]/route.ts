// src/app/api/revalidate-cert/[slug]/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { ENV } from "@/lib/env";

// Base path per lingua (coerente con le tue route pubbliche)
const BASE_BY_LANG: Record<"it"|"en"|"fr"|"es", string> = {
  it: "/it/certificazioni",
  en: "/en/certifications",
  fr: "/fr/certifications",
  es: "/es/certificaciones",
};

type Params = { params: { slug: string } };

export async function POST(req: NextRequest, { params }: Params) {
  const provided = (req.headers.get("x-revalidate-secret") ?? "").trim();
  if (provided !== ENV.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const raw = params?.slug ?? "";
  const slug = decodeURIComponent(raw);
  if (!slug) {
    return NextResponse.json({ ok: false, error: "Missing slug" }, { status: 400 });
  }

  // Se vuoi accettare ?cascade=1 per revalidare anche le liste:
  const url = new URL(req.url);
  const cascade = url.searchParams.get("cascade") === "1";

  // Costruisco i path derivati (pagina + liste per lingua)
  const paths: string[] = [];
  (Object.keys(BASE_BY_LANG) as Array<keyof typeof BASE_BY_LANG>).forEach((L) => {
    paths.push(`${BASE_BY_LANG[L]}/${slug}`);
    if (cascade) paths.push(BASE_BY_LANG[L]);
  });
  // Home opzionale:
  if (cascade) paths.push("/");

  // 🔁 Forward verso l’endpoint universale (mantenendo segreto + compat)
  const forwardRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/revalidate`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-revalidate-secret": provided,
    },
    body: JSON.stringify({
      // Usando l’API “nuova” tieni anche i tag se vuoi:
      certSlug: slug,
      lang: "all",
      cascade,
      paths,            // espliciti
      // tags: ["certs:list", `cert:${slug}`], // se li usi, allinea i nomi ai tuoi
    }),
    cache: "no-store",
  }).catch(() => null);

  if (!forwardRes) {
    return NextResponse.json({ ok: false, error: "forward failed" }, { status: 500 });
  }

  const json = await forwardRes.json().catch(() => ({ ok: false, error: "bad JSON" }));
  return NextResponse.json(json, { status: forwardRes.ok ? 200 : forwardRes.status });
}
