// src/app/sitemap.ts
import { getAllCertSlugs } from "@/lib/data";

export const revalidate = 86400; // rigenera ogni 24h

export default async function sitemap() {
  const site = "https://www.certifyquiz.com";
  const langs = ["it", "en", "fr", "es"] as const;
  const base = { it:"certificazioni", en:"certifications", fr:"certifications", es:"certificaciones" };

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

  // Lingue
  for (const l of langs) {
    urls.push(`
      <url>
        <loc>${site}/${l}</loc>
        <lastmod>${now}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>`);
  }

  // Liste
  for (const l of langs) {
    urls.push(`
      <url>
        <loc>${site}/${l}/${base[l]}</loc>
        <lastmod>${now}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>`);
  }

  // Certificazioni con hreflang
  for (const slug of slugs) {
    const map = Object.fromEntries(langs.map(l => [l, `${site}/${l}/${base[l]}/${slug}`]));
    for (const l of langs) {
      urls.push(`
        <url>
          <loc>${map[l]}</loc>
          <lastmod>${now}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.7</priority>
          ${langs.map(x => `<xhtml:link rel="alternate" hreflang="${x}" href="${map[x]}"/>`).join("\n")}
        </url>`);
    }
  }

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
     <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
             xmlns:xhtml="http://www.w3.org/1999/xhtml">
       ${urls.join("\n")}
     </urlset>`,
    { headers: { "Content-Type": "application/xml" } }
  );
}
