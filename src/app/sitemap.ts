// src/app/sitemap.ts
import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const RAW = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.certifyquiz.com";
const SITE = RAW.replace(/\/+$/, "");

// Usa API remota (no proxy)
const API_RAW = process.env.API_BASE_URL ?? "https://api.certifyquiz.com/api";
const API_BASE = API_RAW.replace(/\/+$/, "");

const langs = ["it", "es", "en", "fr"] as const;
type Lang = (typeof langs)[number];

// NB: la route fisica è /[lang]/certificazioni → stesso segmento per tutte le lingue
const LIST_SEGMENT = "certificazioni" as const;

const staticPages: Record<Lang, string[]> = {
  it: ["come-funziona", "contatti", "privacy", "termini", "cookie"],
  es: ["como-funciona", "contactos", "privacidad", "terminos", "cookies"],
  en: ["how-it-works", "contact", "privacy", "terms", "cookies"],
  fr: ["fonctionnement", "contact", "confidentialite", "conditions", "cookies"],
};

async function getRemoteCerts(lang: Lang, timeoutMs = 5000) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  const url = `${API_BASE}/certifications?lang=${encodeURIComponent(lang)}`;

  try {
    const res = await fetch(url, {
      headers: { accept: "application/json" },
      cache: "no-store",
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const arr = (await res.json()) as Array<{ id: number; slug: string | null }>;
    return arr.filter(
      (c) => typeof c.slug === "string" && c.slug.trim().length > 0
    ) as Array<{ id: number; slug: string }>;
  } catch {
    // fallback silenzioso: nessuna URL dinamica se backend non risponde
    return [];
  } finally {
    clearTimeout(t);
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Fetch paralleli delle certificazioni per lingua
  const perLang = await Promise.all(
    langs.map(async (lang) => {
      const certs = await getRemoteCerts(lang);
      const base = `${SITE}/${lang}`;

      const entries: MetadataRoute.Sitemap = [
        // Home lingua
        {
          url: `${base}`,
          changeFrequency: "weekly",
          priority: 0.9,
          lastModified: now,
        },
        // Lista certificazioni lingua
        {
          url: `${base}/${LIST_SEGMENT}`,
          changeFrequency: "weekly",
          priority: 0.8,
          lastModified: now,
        },
        // Statiche lingua
        ...staticPages[lang].map((p) => ({
          url: `${base}/${p}`,
          changeFrequency: "monthly" as const,
          priority: 0.6,
          lastModified: now,
        })),
        // Dettagli certificazioni lingua
        ...certs.map((c) => ({
          url: `${base}/${LIST_SEGMENT}/${c.slug}`,
          changeFrequency: "weekly" as const,
          priority: 0.8,
          lastModified: now,
        })),
      ];

      return entries;
    })
  );

  // Flatten
  return perLang.flat();
}
