import { getAllCertSlugs } from "@/lib/data";

export default async function sitemap() {
  const base = "https://www.certifyquiz.com";
  const slugs = await getAllCertSlugs("it");
  return [
    { url: `${base}/`, changefreq: "weekly", priority: 1.0 },
    { url: `${base}/it/certificazioni`, changefreq: "weekly", priority: 0.8 },
    ...slugs.map(s => ({ url: `${base}/it/certificazioni/${s}`, changefreq: "weekly", priority: 0.8 })),
  ];
}
