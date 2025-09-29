// src/lib/data.ts
export type Cert = {
  slug: string;
  locale: "it" | "en" | "fr" | "es";
  title: string;
  h1: string;
  intro: string;
  seoDescription: string;
  faq: { q: string; a: string }[];
};

// --- Mock di fallback (puoi rimuoverlo quando non serve più) ---
const MOCK: Cert[] = [
  {
    slug: "comptia-itf-plus",
    locale: "it",
    title: "CompTIA ITF+",
    h1: "Quiz CompTIA ITF+ (Simulatore d’esame)",
    intro:
      "Allenati all’esame CompTIA ITF+ con quiz aggiornati e spiegazioni passo-passo. Modalità allenamento ed esame, statistiche e badge.",
    seoDescription:
      "Allenati all’esame CompTIA ITF+ con quiz reali e spiegazioni chiare. Modalità allenamento/esame e progressi. Provalo gratis.",
    faq: [
      { q: "Quanto dura l’esame ITF+?", a: "Circa 60 minuti con domande a scelta multipla." },
      { q: "Quanti punti servono per superare?", a: "In genere intorno a 650 su 900." },
    ],
  },
];

const API = process.env.API_BASE_URL; // es: https://api.certifyquiz.com

// ---------- Type guards & helpers ----------
function isString(v: unknown): v is string {
  return typeof v === "string";
}
function isRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object";
}
function getString(r: Record<string, unknown>, key: string): string | undefined {
  const v = r[key];
  return typeof v === "string" ? v : undefined;
}
function normalizeFaq(x: unknown): { q: string; a: string }[] {
  if (!Array.isArray(x)) return [];
  const out: { q: string; a: string }[] = [];
  for (const it of x) {
    if (!isRecord(it)) continue;
    const q = getString(it, "q") ?? getString(it, "question") ?? "";
    const a = getString(it, "a") ?? getString(it, "answer") ?? "";
    if (q || a) out.push({ q, a });
  }
  return out;
}

// ---------- API (con cache tag) ----------
export async function getAllCertSlugs(
  locale: Cert["locale"] = "it"
): Promise<string[]> {
  if (!API) {
    return MOCK.filter((c) => c.locale === locale).map((c) => c.slug);
  }
  try {
    // LISTA → tag condiviso "certs:list"
    const r = await fetch(`${API}/certifications?locale=${locale}&fields=slug`, {
      next: {
        tags: ["certs:list"], // invalidabile via revalidateTag("certs:list")
        revalidate: 86400,    // ISR di fallback
      },
    });
    if (!r.ok) return [];
    const data: unknown = await r.json();

    if (!Array.isArray(data)) return [];
    const slugs: string[] = [];
    for (const item of data) {
      if (isString(item)) {
        slugs.push(item);
      } else if (isRecord(item)) {
        const s = getString(item, "slug");
        if (s) slugs.push(s);
      }
    }
    return slugs;
  } catch {
    return MOCK.filter((c) => c.locale === locale).map((c) => c.slug);
  }
}

export async function getCertBySlug(
  slug: string,
  locale: Cert["locale"] = "it"
): Promise<Cert | null> {
  if (!API) {
    return MOCK.find((c) => c.slug === slug && c.locale === locale) ?? null;
  }
  try {
    // DETTAGLIO → tag specifico per slug + lista
    const r = await fetch(`${API}/certifications/${slug}?locale=${locale}`, {
      next: {
        tags: [`cert:${slug}`, "certs:list"], // revalidateTag(`cert:${slug}`) + revalidateTag("certs:list")
        revalidate: 86400,
      },
    });
    if (!r.ok) return null;
    const raw: unknown = await r.json();
    if (!isRecord(raw)) return null;

    const title =
      getString(raw, "title") ??
      getString(raw, "name") ??
      getString(raw, "h1") ??
      slug;

    const h1 =
      getString(raw, "h1") ??
      getString(raw, "title") ??
      getString(raw, "name") ??
      slug;

    const intro = getString(raw, "intro") ?? getString(raw, "description") ?? "";
    const seoDescription =
      getString(raw, "seoDescription") ??
      getString(raw, "seo") ??
      getString(raw, "description") ??
      "";

    const faq = normalizeFaq((raw as Record<string, unknown>)["faq"]);

    return { slug, locale, title, h1, intro, seoDescription, faq };
  } catch {
    return MOCK.find((c) => c.slug === slug && c.locale === locale) ?? null;
  }
}

// (opzionale) lista completa per pagina /certificazioni
export async function getCertList(
  locale: Cert["locale"] = "it"
): Promise<Cert[]> {
  if (!API) return MOCK.filter((c) => c.locale === locale);
  try {
    const r = await fetch(`${API}/certifications?locale=${locale}`, {
      next: { tags: ["certs:list"], revalidate: 86400 },
    });
    if (!r.ok) return [];
    const arr: unknown = await r.json();
    if (!Array.isArray(arr)) return [];

    const list: Cert[] = [];
    for (const raw of arr) {
      if (!isRecord(raw)) continue;
      const slug = getString(raw, "slug");
      if (!slug) continue;

      const title =
        getString(raw, "title") ??
        getString(raw, "name") ??
        getString(raw, "h1") ??
        slug;

      const h1 =
        getString(raw, "h1") ??
        getString(raw, "title") ??
        getString(raw, "name") ??
        slug;

      const intro = getString(raw, "intro") ?? getString(raw, "description") ?? "";
      const seoDescription =
        getString(raw, "seoDescription") ??
        getString(raw, "seo") ??
        getString(raw, "description") ??
        "";

      const faq = normalizeFaq((raw as Record<string, unknown>)["faq"]);
      list.push({ slug, locale, title, h1, intro, seoDescription, faq });
    }
    return list;
  } catch {
    return MOCK.filter((c) => c.locale === locale);
  }
}
