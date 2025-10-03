// src/lib/data.ts
// Layer dati con fallback locali finché il backend reale non è allineato.

export type Lang = "it" | "en" | "fr" | "es";

export type Cert = {
  slug: string;
  title: string;
  h1?: string;
  intro?: string;
  seoTitle?: string;
  seoDescription?: string;
  faq?: { q: string; a: string }[];
};

// Usa il proxy (next.config.ts -> /api/backend -> https://api.certifyquiz.com/api)
const API_BASE = "/api/backend";

// ---- FALLBACK LOCALI (minimi ma sufficienti a non 404-are) ----
const FALLBACKS: Record<Lang, Cert[]> = {
  it: [
    {
      slug: "jncie",
      title: "JNCIE",
      h1: "JNCIE — Juniper Networks Certified Internet Expert",
      intro: "Preparati all’esame JNCIE con quiz realistici e spiegazioni.",
      seoDescription: "Quiz JNCIE con spiegazioni in italiano per preparare l’esame Expert di Juniper.",
      faq: [
        { q: "Quanto dura l’esame JNCIE?", a: "Dipende dalla traccia, in genere exam lab di più ore." },
      ],
    },
    {
      slug: "f5",
      title: "F5 Certified Professional",
      h1: "F5 Certified Professional",
      intro: "Application Delivery e sicurezza: metti alla prova le tue competenze.",
      seoDescription: "Quiz per certificazioni F5 con focus su ADC e sicurezza applicativa.",
    },
    {
      slug: "aws-cloud-practitioner",
      title: "AWS Cloud Practitioner",
      h1: "AWS Certified Cloud Practitioner",
      intro: "Fondamenti del cloud AWS: servizi base, fatturazione e best practice.",
      seoDescription: "Quiz AWS Cloud Practitioner in italiano con spiegazioni passo-passo.",
    },
    {
      slug: "cisco-ccst-networking",
      title: "Cisco CCST – Networking",
      h1: "Cisco CCST – Networking",
      intro: "Reti di base, modelli, indirizzamento e troubleshooting entry-level.",
      seoDescription: "Quiz Cisco CCST Networking con spiegazioni e domande aggiornate.",
    },
    // Se vuoi testare anche ITF+:
    // { slug: "comptia-itf-plus", title: "CompTIA ITF+", seoDescription: "Quiz ITF+ con spiegazioni." },
  ],
  en: [],
  fr: [],
  es: [],
};

// ---- Helper robusto per fetch JSON ----
async function jsonOrThrow<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ---- API: LISTA ----
export async function getCertList(lang: Lang): Promise<Cert[]> {
  try {
    const res = await fetch(`${API_BASE}/certifications?lang=${lang}`, {
      // SSG con revalidate breve per lista
      next: { revalidate: 3600 },
    });
    const data = await jsonOrThrow<Cert[]>(res);
    if (Array.isArray(data) && data.length) return data;
    // Se l'API risponde ma è vuota, usa fallback
    const fb = FALLBACKS[lang]?.length ? FALLBACKS[lang] : FALLBACKS.it;
    return fb;
  } catch {
    const fb = FALLBACKS[lang]?.length ? FALLBACKS[lang] : FALLBACKS.it;
    return fb;
  }
}

// ---- API: SOLO SLUG ----
export async function getAllCertSlugs(lang: Lang): Promise<string[]> {
  try {
    const res = await fetch(`${API_BASE}/certifications/slugs?lang=${lang}`, {
      next: { revalidate: 3600 },
    });
    const data = await jsonOrThrow<string[]>(res);
    if (Array.isArray(data) && data.length) return data;
    // Fallback: deriva dagli item fallback
    const list = await getCertList(lang);
    return list.map((c) => c.slug);
  } catch {
    const list = await getCertList(lang);
    return list.map((c) => c.slug);
  }
}

// ---- API: DETTAGLIO ----
export async function getCertBySlug(slug: string, lang: Lang): Promise<Cert | null> {
  try {
    const res = await fetch(`${API_BASE}/certifications/${slug}?lang=${lang}`, {
      // Dettaglio può essere più “fresco”
      next: { revalidate: 300 },
    });
    const item = await jsonOrThrow<Cert>(res);
    if (item && item.slug) return item;
    // Se l'API risponde ma non torna un item valido, prova fallback
    const list = await getCertList(lang);
    return list.find((c) => c.slug === slug) ?? null;
  } catch {
    const list = await getCertList(lang);
    return list.find((c) => c.slug === slug) ?? null;
  }
}
