// app/sitemap-index.xml/route.ts
export const dynamic = "force-dynamic";
export const revalidate = 0;

type Lang = "it" | "en" | "fr" | "es";

export async function GET() {
  const site = "https://www.certifyquiz.com";
  const langs: Lang[] = ["it", "en", "fr", "es"];
  const base: Record<Lang, string> = {
    it: "certificazioni",
    en: "certifications",
    fr: "certifications",
    es: "certificaciones",
  };

  const API = (process.env.API_BASE_URL || "").replace(/\/+$/, "");
  const apiUrl = `${API}/certifications?locale=it&fields=slug`;

  let slugs: string[] = [];
  let status = 0;
  let ok = false;

  try {
    const r = await fetch(apiUrl, { cache: "no-store", next: { revalidate: 0 } });
    status = r.status;
    ok = r.ok;
    if (r.ok) {
      const data = await r.json();
      if (Array.isArray(data)) {
        slugs = data
          .map((x: any) => (typeof x === "string" ? x : (x?.slug ?? null)))
          .filter(Boolean);
      }
    }
  } catch (_) {
    // keep defaults
  }

  const now = new Date().toISOString();
  const urls: string[] = [];

  // Home + lingue + liste
  urls.push(`
    <url>
      <loc>${site}/</loc>
      <lastmod>${now}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>1.0</priority>
    </url>`);
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

  // 1 blocco <url> per slug, alternates + x-default
  for (const slug of slugs) {
    const map = Object.fromEntries(langs.map(l => [l, `${site}/${l}/${base[l]}/${slug}`])) as Record<Lang,string>;
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
      // cache temporaneamente disattivata per vedere la versione nuova
      "Cache-Control": "no-store",
      // 🔎 debug
      "X-Api-Base-Url": API || "EMPTY",
      "X-Api-Url": apiUrl,
      "X-Api-Ok": String(ok),
      "X-Api-Status": String(status),
      "X-Slugs-Len": String(slugs.length),
    },
  });
}
