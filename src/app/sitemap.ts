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

const CERT_SEGMENT_BY_LANG: Record<Lang, string> = {
  it: "certificazioni",
  es: "certificaciones",
  en: "certifications",
  fr: "certifications",
};

const staticPages: Record<Lang, string[]> = {
  it: ["come-funziona", "contatti", "privacy", "termini", "cookie"],
  es: ["como-funciona", "contactos", "privacidad", "terminos", "cookies"],
  en: ["how-it-works", "contact", "privacy", "terms", "cookies"],
  fr: ["fonctionnement", "contact", "confidentialite", "conditions", "cookies"],
};

type RemoteCert = {
  id: number;
  slug: string;
};

type RemoteTopic = {
  slug: string;
  certification_slug: string;
};

async function getRemoteCerts(lang: Lang, timeoutMs = 5000): Promise<RemoteCert[]> {
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

    const arr = (await res.json()) as Array<{
      id: number;
      slug: string | null;
    }>;

    return arr.filter(
      (c): c is RemoteCert =>
        typeof c.id === "number" &&
        typeof c.slug === "string" &&
        c.slug.trim().length > 0
    );
  } catch {
    return [];
  } finally {
    clearTimeout(t);
  }
}

async function getRemoteTopics(
  lang: Lang,
  timeoutMs = 5000
): Promise<RemoteTopic[]> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);

  const url = `${API_BASE}/sitemap/topics?lang=${encodeURIComponent(lang)}`;

  try {
    const res = await fetch(url, {
      headers: { accept: "application/json" },
      cache: "no-store",
      signal: controller.signal,
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const arr = (await res.json()) as Array<{
      slug?: string | null;
      certification_slug?: string | null;
    }>;

    return arr.filter(
      (t): t is RemoteTopic =>
        typeof t.slug === "string" &&
        t.slug.trim().length > 0 &&
        typeof t.certification_slug === "string" &&
        t.certification_slug.trim().length > 0
    );
  } catch {
    return [];
  } finally {
    clearTimeout(t);
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const perLang = await Promise.all(
    langs.map(async (lang) => {
      const certs = await getRemoteCerts(lang);
      const topics = await getRemoteTopics(lang);

      const base = lang === "en" ? SITE : `${SITE}/${lang}`;
      const listSegment = CERT_SEGMENT_BY_LANG[lang];

      const entries: MetadataRoute.Sitemap = [
        // Home lingua
        {
          url: base,
          changeFrequency: "weekly",
          priority: 0.9,
          lastModified: now,
        },

        // Lista certificazioni lingua
        {
          url: `${base}/${listSegment}`,
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
          url: `${base}/${listSegment}/${c.slug}`,
          changeFrequency: "weekly" as const,
          priority: 0.8,
          lastModified: now,
        })),

        // Topic pages lingua
        ...topics.map((t) => ({
          url: `${base}/${listSegment}/${t.certification_slug}/${t.slug}`,
          changeFrequency: "weekly" as const,
          priority: 0.7,
          lastModified: now,
        })),
      ];

      return entries;
    })
  );

  return perLang.flat();
}