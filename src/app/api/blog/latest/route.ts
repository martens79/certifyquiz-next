export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { sanityServerClient } from "@/lib/sanity.server";
import { articlesListByLang } from "@/lib/sanity.queries";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lang = (searchParams.get("lang") || "en") as any;

    const rawLimit = Number(searchParams.get("limit") || "1");
    const limit = Number.isFinite(rawLimit)
      ? Math.max(1, Math.min(rawLimit, 6))
      : 1;

    const items = await sanityServerClient.fetch<any[]>(articlesListByLang, { lang });

    const articles = Array.isArray(items) ? items.slice(0, limit) : [];
    const first = articles[0] ?? null;

    return NextResponse.json(
      {
        article: first,
        articles,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("API /api/blog/latest error:", err?.message || err);

    return NextResponse.json(
      {
        article: null,
        articles: [],
        error: err?.message || "Sanity request failed",
      },
      { status: 200 }
    );
  }
}