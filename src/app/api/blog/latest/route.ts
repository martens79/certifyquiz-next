export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { sanityServerClient } from "@/lib/sanity.server";
import { articlesListByLang } from "@/lib/sanity.queries";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lang = (searchParams.get("lang") || "en") as any;

    const items = await sanityServerClient.fetch<any[]>(articlesListByLang, { lang });
    const first = items?.[0] ?? null;

    return NextResponse.json({ article: first }, { status: 200 });
  } catch (err: any) {
    // così vedi l’errore in console server
    console.error("API /api/blog/latest error:", err?.message || err);
    return NextResponse.json(
      { article: null, error: err?.message || "Sanity request failed" },
      { status: 200 }
    );
  }
}
