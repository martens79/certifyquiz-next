import { getAllCertSlugs } from "@/lib/data";

export default async function sitemap() {
  const site = "https://www.certifyquiz.com";
  const langs = ["it", "en", "fr", "es"] as const;
  const base = { it:"certificazioni", en:"certifications", fr:"certifications", es:"certificaciones" };

  // prendo gli slug (puoi farlo una sola volta, tanto slug è comune)
  const slugs = await getAllCertSlugs("it");

  const now = new Date();

  // Home
  const home = [{ url: site, lastModified: now, changefreq: "weekly", priority: 1 }];

  // Lingue
  const langHomes = langs.map(l => ({
    url: `${site}/${l}`,
    lastModified: now,
    changefreq: "weekly",
    priority: 0.8,
  }));

  // Liste certificazioni
  const lists = langs.map(l => ({
    url: `${site}/${l}/${base[l]}`,
    lastModified: now,
    changefreq: "weekly",
    priority: 0.8,
  }));

  // Dettagli certificazioni + hreflang
  const entries = slugs.flatMap(slug => {
    const map = Object.fromEntries(langs.map(l => [l, `${site}/${l}/${base[l]}/${slug}`]));
    return langs.map(l => ({
      url: map[l],
      lastModified: now,
      changefreq: "weekly",
      priority: 0.7,
      alternates: { languages: map }, // <-- hreflang
    }));
  });

  return [...home, ...langHomes, ...lists, ...entries];
}
