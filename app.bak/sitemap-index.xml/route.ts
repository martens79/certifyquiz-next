// app/sitemap-index.xml/route.ts
export const dynamic = "force-dynamic";
export const revalidate = 0;

type Lang = "it" | "en" | "fr" | "es";
type UnknownRecord = Record<string, unknown>;

function isRecord(v: unknown): v is UnknownRecord {
  return v !== null && typeof v === "object";
}

function pickFrom(u: unknown, key: string): unknown[] {
  if (Array.isArray(u)) return u;
  if (isRecord(u) && Array.isArray((u as UnknownRecord)[key])) {
    return (u as UnknownRecord)[key] as unknown[];
  }
  return [];
}

async function fetchJSON(url: string, init?: RequestInit) {
  const r = await fetch(url, { cache: "no-store", next: { revalidate: 0 }, ...init });
  if (!r.ok) throw new Error(`HTTP ${r.status} ${r.statusText}`);
  return (await r.json()) as unknown;
}

export async function GET() {
  const site = "https://www.certifyquiz.com";
  const langs: Lang[] = ["it", "en", "fr", "es"];
  const baseByLang: Record<Lang, string> = {
    it: "certificazioni",
    en: "certifications",
    fr: "certifications",
    es: "certificaciones",
  };

  const API = (process.env.API_BASE_URL || "").replace(/\/+$/, "");

  let source: "availability" | "public" | "empty" = "empty";
  let slugs: string[] = [];

  if (API) {
    // 1) Endpoint pubblico “pro”: quiz-translation-availability (ha già slug fallback)
    try {
      const url = API + "/quiz-translation-availability?lang=en";
      const data = await fetchJSON(url);
      const items = pickFrom(data, "items");
      const got = items
        .map((x) => (isRecord(x) && typeof x.slug === "string" ? x.slug : null))
        .filter((s): s is string => !!s);
      if (got.length) {
        slugs = Array.from(new Set(got)).sort();
        source = "availability";
      } else {
        throw new Error("empty_availability");
      }
    } catch {
      // 2) Fallback “pubblico base”
      try {
        const url = API + "/certifications?locale=it&fields=slug";
        const data = await fetchJSON(url);
        const arr = Array.isArray(data)
          ? data
          : pickFrom(data, "data").length
          ? pickFrom(data, "data")
          : pickFrom(data, "items");
        const got = arr
          .map((x) =>
            typeof x === "string"
              ? x
              : isRecord(x) && typeof x.slug === "string"
              ? (x.slug as string)
              : null
          )
          .filter((s): s is string => !!s);
        slugs = Array.from(new Set(got)).sort();
        source = "public";
      } catch {
        slugs = [];
        source = "empty";
      }
    }
  }

  const lastmod = new Date().toISOString();
  const lines: string[] = [];
  const push = (s: string) => lines.push(s);

  push('<?xml version="1.0" encoding="UTF-8"?>');
  push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
  push('        xmlns:xhtml="http://www.w3.org/1999/xhtml">');

  // Home
  push("  <url>");
  push(`    <loc>${site}/</loc>`);
  push(`    <lastmod>${lastmod}</lastmod>`);
  push("    <changefreq>weekly</changefreq>");
  push("    <priority>1.0</priority>");
  push("  </url>");

  // Lingue + liste
  for (const l of langs) {
    push("  <url>");
    push(`    <loc>${site}/${l}</loc>`);
    push(`    <lastmod>${lastmod}</lastmod>`);
    push("    <changefreq>weekly</changefreq>");
    push("    <priority>0.8</priority>");
    push("  </url>");

    push("  <url>");
    push(`    <loc>${site}/${l}/${baseByLang[l]}</loc>`);
    push(`    <lastmod>${lastmod}</lastmod>`);
    push("    <changefreq>weekly</changefreq>");
    push("    <priority>0.8</priority>");
    push("  </url>");
  }

  // 1 blocco per certificazione (loc IT) + hreflang + x-default
  for (const slug of slugs) {
    const map: Record<Lang, string> = {
      it: `${site}/it/${baseByLang.it}/${slug}`,
      en: `${site}/en/${baseByLang.en}/${slug}`,
      fr: `${site}/fr/${baseByLang.fr}/${slug}`,
      es: `${site}/es/${baseByLang.es}/${slug}`,
    };

    push("  <url>");
    push(`    <loc>${map.it}</loc>`);
    push(`    <lastmod>${lastmod}</lastmod>`);
    push("    <changefreq>weekly</changefreq>");
    push("    <priority>0.7</priority>");
    for (const l of langs) {
      push(`    <xhtml:link rel="alternate" hreflang="${l}" href="${map[l]}"/>`);
    }
    push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${map.it}"/>`);
    push("  </url>");
  }

  push("</urlset>");

  const xml = lines.join("\n");

  const headers = new Headers({
    "Content-Type": "application/xml; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Source": source,                 // "availability" | "public" | "empty"
    "X-Slugs-Len": String(slugs.length)
  });

  return new Response(xml, { headers });
}
