// src/app/sitemap.ts
import type { MetadataRoute } from "next";

const RAW = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.certifyquiz.com";
const SITE = RAW.replace(/\/+$/, ""); // niente trailing slash

const langs = ["it", "es", "en", "fr"] as const;
type Lang = typeof langs[number];

const detailSlugs = ["jncie", "f5", "aws-cloud-practitioner", "cisco-ccst-networking"];

const staticPages: Record<Lang, string[]> = {
  it: ["come-funziona", "contatti", "privacy", "termini", "cookie"],
  es: ["como-funciona", "contactos", "privacidad", "terminos", "cookies"],
  en: ["how-it-works", "contact", "privacy", "terms", "cookies"],
  fr: ["fonctionnement", "contact", "confidentialite", "conditions", "cookies"],
};

const listPath: Record<Lang, string> = {
  it: "certificazioni",
  es: "certificaciones",
  en: "certifications",
  fr: "certifications",
};

export default function sitemap(): MetadataRoute.Sitemap {
  const items: MetadataRoute.Sitemap = [];
  const now = new Date();

  for (const lang of langs) {
    // home lingua
    items.push({
      url: `${SITE}/${lang}`,
      changeFrequency: "weekly",
      priority: 0.9,
      lastModified: now,
    });

    // lista cert
    items.push({
      url: `${SITE}/${lang}/${listPath[lang]}`,
      changeFrequency: "weekly",
      priority: 0.8,
      lastModified: now,
    });

    // detail live
    for (const slug of detailSlugs) {
      items.push({
        url: `${SITE}/${lang}/${listPath[lang]}/${slug}`,
        changeFrequency: "weekly",
        priority: 0.8,
        lastModified: now,
      });
    }

    // statiche
    for (const p of staticPages[lang]) {
      items.push({
        url: `${SITE}/${lang}/${p}`,
        changeFrequency: "monthly",
        priority: 0.6,
        lastModified: now,
      });
    }
  }

  return items;
}
