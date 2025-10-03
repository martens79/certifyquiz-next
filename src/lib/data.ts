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

// Usa il proxy locale se non è settata API_BASE_URL (vedi next.config.ts -> /api/backend)
const API = process.env.API_BASE_URL ?? "/api/backend";

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

// --- Fallback locali (finché il backend non espone tutto) ---
const MOCK: Cert[] = [
  // Dettagli mostrati nella lista IT
  {
    slug: "jncie",
    locale: "it",
    title: "JNCIE",
    h1: "JNCIE — Juniper Networks Certified Internet Expert",
    intro: "Preparati all’esame JNCIE con quiz realistici e spiegazioni.",
    seoDescription: "Quiz JNCIE con spiegazioni in italiano per preparare l’esame Expert di Juniper.",
    faq: [{ q: "Quanto dura l’esame JNCIE?", a: "Dipende dalla traccia; tipicamente è un lab di più ore." }],
  },
  {
    slug: "f5",
    locale: "it",
    title: "F5 Certified Professional",
    h1: "F5 Certified Professional",
    intro: "Application delivery e sicurezza: metti alla prova le tue competenze.",
    seoDescription: "Quiz per certificazioni F5 con focus su ADC e sicurezza applicativa.",
    faq: [],
  },
  {
    slug: "aws-cloud-practitioner",
    locale: "it",
    title: "AWS Cloud Practitioner",
    h1: "AWS Certified Cloud Practitioner",
    intro: "Fondamenti del cloud AWS: servizi base, pricing e best practice.",
    seoDescription: "Quiz AWS Cloud Practitioner in italiano con spiegazioni passo-passo.",
    faq: [],
  },
  {
    slug: "cisco-ccst-networking",
    locale: "it",
    title: "Cisco CCST – Networking",
    h1: "Cisco CCST – Networking",
    intro: "Reti di base, modelli, indirizzamento e troubleshooting entry-level.",
    seoDescription: "Quiz Cisco CCST Networking con spiegazioni e domande aggiornate.",
    faq: [],
  },

  // Se vuoi tenere anche ITF+ per test:
  // {
  //   slug: "comptia-itf-plus",
  //   locale: "it",
  //   title: "CompTIA ITF+",
  //   h1: "Quiz CompTIA ITF+ (Simulatore d’esame)",
  //   intro: "Allenati all’esame CompTIA ITF+ con quiz aggiornati e spiegazioni passo-passo.",
  //   seoDescription: "Allenati all’esame CompTIA ITF+ con quiz reali e spiegazioni chiare.",
  //   faq: [
  //     { q: "Quanto dura l’esame ITF+?", a: "Circa 60 minuti con domande a scelta multipla." },
  //     { q: "Quanti punti servono per superare?", a: "In genere intorno a 650 su 900." },
  //   ],
  // },
];

// ---------- API (con cache tag) ----------
export async function getAllCertSlugs(
  locale: Cert["locale"] = "it"
): Promise<string[]> {
  // Se non c'è API, torna i fallback
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
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data: unknown = await r.json();

    const slugs: string[] = [];
    if (Array.isArray(data)) {
      for (const item of data) {
        if (isString(item)) slugs.push(item);
        else if (isRecord(item)) {
          const s = getString(item, "slug");
          if (s) slugs.push(s);
        }
      }
    }
    // Se vuoto, fallback locali
    if (slugs.length === 0) {
      return MOCK.filter((c) => c.locale === locale).map((c) => c.slug);
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
  // Se non c'è API, prova dai fallback
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
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const raw: unknown = await r.json();
    if (!isRecord(raw)) throw new Error("Invalid payload");

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
    // Fallback: prendi dalla lista locale
    const fb = MOCK.find((c) => c.slug === slug && c.locale === locale);
    if (fb) return fb;
    return null;
  }
}

// Lista completa per pagina /certificazioni
export async function getCertList(
  locale: Cert["locale"] = "it"
): Promise<Cert[]> {
  if (!API) return MOCK.filter((c) => c.locale === locale);
  try {
    const r = await fetch(`${API}/certifications?locale=${locale}`, {
      next: { tags: ["certs:list"], revalidate: 86400 },
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const arr: unknown = await r.json();
    if (!Array.isArray(arr)) throw new Error("Invalid array");

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
    // Se la lista API è vuota, usa fallback locali
    if (list.length === 0) {
      return MOCK.filter((c) => c.locale === locale);
    }
    return list;
  } catch {
    return MOCK.filter((c) => c.locale === locale);
  }
}
