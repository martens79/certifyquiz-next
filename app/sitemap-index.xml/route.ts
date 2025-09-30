// app/sitemap-index.xml/route.ts
export const dynamic = "force-dynamic";
export const revalidate = 0;

type Lang = "it" | "en" | "fr" | "es";

function isRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object";
}
function pickSlugs(data: unknown): string[] {
  if (!Array.isArray(data)) return [];
  const out: string[] = [];
  for (const x of data) {
    if (typeof x === "string") {
      out.push(x);
    } else if (isRecord(x)) {
      const slug = x["slug"];
      if (typeof slug === "string") out.push(slug);
    }
  }
  return out;
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

  // ⚠️ deve finire con /api (es: https://api.certifyquiz.com/api)
  const API = (process.env.API_BASE_URL || "").replace(/\/+$/, "");
  const baseQs = "locale=it&fields=slug";

  const candidates: string[] = [
    `${API}/certifications?${baseQs}`,
    `${API}/certifications?${baseQs}&limit=1000`,
    `${API}/certifications?${baseQs}&pageSize=1000`,
    `${API}/certifications?${baseQs}&per_page=1000`,
    `${API}/certifications?${baseQs}&take=1000`,
    `${API}/certifications?${baseQs}&offset=0&limit=1000`,
    `${API}/certifications?${baseQs}&page=1&per_page=1000`,
  ];

  let bestSlugs: string[] = [];
  const tried: string[] = [];
  for (const url of candidates) {
    tried.push(url);
    try {
      const r = await fetch(url, { cache: "no-store", next: { revalidate: 0 } });
      if (!r.ok) continue;
      const data: unknown = await r.json();
      const slugs = Array.from(new Set(pickSlugs(data)));
      if (slugs.length > bestSlugs.length) {
        bestSlugs = slugs;
        if (bestSlugs.length >= 30) break; // sufficiente per il tuo caso
      }
    } catch {
      // passa alla prossima variante
    }
  }

  const slugs = bestSlugs;
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

  // 1 blocco per slug, con hreflang + x-default
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

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
          xmlns:xhtml="http://www.w3.org/1999/xhtml">
    ${urls.join("\n")}
  </urlset>`;
  xml = xml.replace("<urlset ", `<urlset data-build="${Date.now()}" `); // stamp per diagnosi

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "no-store", // durante i test; poi metti s-maxage
      // debug minimi utili
      "X-Api-Base-Url": API || "EMPTY",
      "X-Slugs-Len": String(slugs.length),
      "X-Tried-Count": String(tried.length),
    },
  });
}
