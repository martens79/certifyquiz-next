// app/sitemap-index.xml/route.ts
export const dynamic = "force-dynamic";
export const revalidate = 0;

type Lang = "it" | "en" | "fr" | "es";
type SlugItem = { slug?: string } | string;

function isRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object";
}

export async function GET() {
  const site = "https://www.certifyquiz.com";
  const langs: Lang[] = ["it", "en", "fr", "es"];
  const base: Record<Lang, string> = {
    it: "certificazioni",
    en: "certifications",
    fr: "certifications",
    es: "certificaciones",
  };

  // ⚠️ Deve finire con /api in Vercel (es: https://api.certifyquiz.com/api)
  const API = (process.env.API_BASE_URL || "").replace(/\/+$/, "");
  const apiUrl = `${API}/certifications?locale=it&fields=slug&limit=1000`;

  let slugs: string[] = [];
  try {
    const r = await fetch(apiUrl, { cache: "no-store", next: { revalidate: 0 } });
    if (r.ok) {
      const data: unknown = await r.json();
      if (Array.isArray(data)) {
        slugs = data
          .map((x: SlugItem) => {
            if (typeof x === "string") return x;
            if (isRecord(x) && typeof x.slug === "string") return x.slug;
            return null;
          })
          .filter((s): s is string => Boolean(s));
      }
    }
  } catch {
    slugs = [];
  }

  const now = new Date().toISOString();
  const urls: string[] = [];

  // Home
  urls.push(`
    <url>
      <loc>${site}/</loc>
      <lastmod>${now}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>1.0</priority>
    </url>`);

  // Lingue + liste
  for (const l of langs) {
    urls.push(`
      <url>
        <loc>${site}/${l}</loc>
        <lastmod>${now}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>`);
    urls.push(`
      <url>
        <loc>${site}/${l}/${base[l]}</loc>
        <lastmod>${now}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>`);
  }

  // 1 blocco <url> per ogni slug con alternates + x-default
  for (const slug of slugs) {
    const map = Object.fromEntries(
      langs.map(l => [l, `${site}/${l}/${base[l]}/${slug}`] as const)
    ) as Record<Lang, string>;

    urls.push(`
      <url>
        <loc>${map.it}</loc>
        <lastmod>${now}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
        ${langs.map(x => `<xhtml:link rel="alternate" hreflang="${x}" href="${map[x]}"/>`).join("\n")}
        <xhtml:link rel="alternate" hreflang="x-default" href="${map.it}"/>
      </url>`);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
          xmlns:xhtml="http://www.w3.org/1999/xhtml">
    ${urls.join("\n")}
  </urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
