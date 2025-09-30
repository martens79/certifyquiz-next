// app/sitemap-index.xml/route.ts
import { getAllCertSlugs } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const site = "https://www.certifyquiz.com";
  const langs = ["it", "en", "fr", "es"] as const;
  const base: Record<(typeof langs)[number], string> = {
    it: "certificazioni",
    en: "certifications",
    fr: "certifications",
    es: "certificaciones",
  };

  const slugs = await getAllCertSlugs("it");
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

  // 🔹 UN SOLO BLOCCO <url> PER SLUG (più compatto), con alternates + x-default
  for (const slug of slugs) {
    const map = Object.fromEntries(langs.map(l => [l, `${site}/${l}/${base[l]}/${slug}`]));
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

  // Header di debug: quanti x-default abbiamo generato (== numero slug)
  const xDefaultCount = slugs.length.toString();

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
      "X-XDefault-Count": xDefaultCount,
    },
  });
}
