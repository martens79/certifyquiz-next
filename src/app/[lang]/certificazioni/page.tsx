// src/app/[lang]/certificazioni/page.tsx
// Lista certificazioni — Next 15, ISR, SEO + JSON-LD

import type { Metadata } from "next";
import Script from "next/script";

import { locales, type Locale, isLocale } from "@/lib/i18n";
import { canonicalUrl } from "@/lib/seo";

import { getCertificationsListRSC } from "@/lib/server/certs";
import type { CertListItem } from "@/lib/certs";
import { CertificationListClient } from "@/components/CertificationListClient";

export const revalidate = 86400; // ISR: 24h

const RAW_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com";
const SITE_URL = RAW_SITE_URL.replace(/\/+$/, "");

// ------------------------- PATH PER LINGUA -------------------------
// Nota strategia SEO:
// - EN ufficiale = root (senza /en) → /certifications
// - /en/* resta route tecnica ma non deve indicizzarsi (noindex + canonical verso root)
const listPathByLang: Record<Locale, string> = {
  it: "/it/certificazioni",
  en: "/en/certificazioni", // route tecnica (non indicizzare)
  fr: "/fr/certificazioni",
  es: "/es/certificaciones",
};

// 🔥 EN ufficiale (root)
const EN_ROOT_LIST_PATH = "/certifications";

const detailPath = (lang: Locale, slug: string) =>
  `${listPathByLang[lang]}/${slug}`;

// Path ufficiale EN per detail (root)
const enRootDetailPath = (slug: string) => `/certifications/${slug}`;

// ------------------------- LIVELLI (per filtri) -------------------------
type LevelKey = "base" | "intermediate" | "advanced";

// Mappa slug -> livello logico usata dai filtri
const LEVEL_BY_SLUG: Record<string, LevelKey> = {
  // Base
  "comptia-itf-plus": "base",
  "aws-cloud-practitioner": "base",
  "google-cloud": "base",
  "eipass-basic": "base",
  eipass: "base",
  ecdl: "base",
  pekit: "base",
  icdl: "base",
  "cisco-ccst-networking": "base",
  "cisco-ccst-security": "base",

  // Intermedio
  "comptia-a-plus": "intermediate",
  "comptia-network-plus": "intermediate",
  "comptia-security-plus": "intermediate",
  ccna: "intermediate",
  ceh: "intermediate",
  "java-se": "intermediate",
  python: "intermediate",
  "javascript-developer": "intermediate",
  "microsoft-virtualization": "intermediate",
  "microsoft-azure-fundamentals": "intermediate",

  // Avanzato
  cissp: "advanced",
  jncie: "advanced",
  "aws-solutions-architect": "advanced",
  "vmware-certified-professional": "advanced",
  "mongodb-developer": "advanced",
};

// ------------------------- ICONE PER SLUG -------------------------
const ICON_BY_SLUG: Record<string, string> = {
  // Base / cloud / AI
  "ai-fundamentals": "/images/certifications/ai-fundamentals-icon.png",
  "aws-cloud-practitioner": "/images/certifications/aws-cloud-practitioner.png",
  "aws-solutions-architect": "/images/certifications/aws-solutions-architect.png",
  "azure-fundamentals": "/images/certifications/azure-fundamentals-icon.png",
  "google-cloud": "/images/certifications/google_cloud_icon.png",
  "google-tensorflow": "/images/certifications/tensorflow-icon.png",

  // CompTIA
  "comptia-itf-plus": "/images/certifications/itf-icon.png",
  "comptia-a-plus": "/images/certifications/comptia-a-plus.png",
  "comptia-security-plus": "/images/certifications/securityplus-icon.png",
  "comptia-network-plus": "/images/certifications/networkplus.png",
  "comptia-cloud-plus": "/images/certifications/cloudplus-icon.png",

  // Cisco / networking / security
  ccna: "/images/certifications/ccna.png",
  "cisco-ccst-networking": "/images/certifications/ccst_networking.png",
  "cisco-ccst-security": "/images/certifications/ccst_cybersecurity.png",

  // Security / ISC2
  cissp: "/images/certifications/cissp.png",
  ceh: "/images/certifications/ceh.png",
  "isc2-cc": "/images/certifications/isc2-icon.png",

  // Microsoft / DB / virtualizzazione
  ecdl: "/images/certifications/ecdl.png",
  "microsoft-azure-fundamentals":
    "/images/certifications/azure-fundamentals-icon.png",
  "microsoft-csharp": "/images/certifications/csharp-icon.png",
  "microsoft-sql-server": "/images/certifications/sqlserver.png",
  "microsoft-virtualization":
    "/images/certifications/microsoft-virtualization-logo.png",
  "microsoft-ai": "/images/certifications/ai-fundamentals-icon.png",

  // IBM / F5
  "ibm-cloud-v5": "/images/certifications/ibmcloud-icon.png",
  f5: "/images/certifications/f5-icon.png",

  // EIPASS / PEKIT / ICDL
  "eipass-basic": "/images/certifications/eipass.png",
  eipass: "/images/certifications/eipass.png",
  pekit: "/images/certifications/pekit.png",
  icdl: "/images/certifications/icdl.png",

  // Dev / linguaggi
  "java-se": "/images/certifications/java-icon.png",
  "javascript-developer": "/images/certifications/javascript-icon.png",
  python: "/images/certifications/python.png",

  // DB
  "oracle-database-sql": "/images/certifications/oracle-sql.png",
  "mysql-certification": "/images/certifications/mysql.png",
  "mongodb-developer": "/images/certifications/mongodb.png",

  // VMware
  "vmware-certified-professional": "/images/certifications/vmware-vcp.png",

  // Altre
  jncie: "/images/certifications/jncie-icon.png",
};

// ---------------------------- SEO -----------------------------
const SEO = {
  it: {
    title: "Certificazioni — Elenco completo",
    description:
      "Esplora tutte le certificazioni IT su CertifyQuiz: scopri i percorsi, leggi i dettagli e allenati con quiz realistici in italiano.",
  },
  es: {
    title: "Certificaciones — Lista completa",
    description:
      "Explora todas las certificaciones de TI en CertifyQuiz: descubre itinerarios, detalles y practica con cuestionarios realistas en español.",
  },
  fr: {
    title: "Certifications — Liste complète",
    description:
      "Parcourez toutes les certifications IT sur CertifyQuiz : découvrez les parcours, les détails et entraînez-vous avec des quiz réalistes en français.",
  },
  en: {
    title: "Certifications — Full list",
    description:
      "Browse all IT certifications on CertifyQuiz: explore paths, read details, and practice with realistic quizzes in English.",
  },
} satisfies Record<Locale, { title: string; description: string }>;

/* ------------------------------- Metadata -------------------------------- */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const L: Locale = isLocale(lang) ? (lang as Locale) : "it";
  const { title, description } = SEO[L];

  // hreflang map
  const languages: Record<string, string> = {};
  for (const l of locales as readonly Locale[]) {
    const hreflang =
      l === "it"
        ? "it-IT"
        : l === "en"
        ? "en-US"
        : l === "fr"
        ? "fr-FR"
        : "es-ES";

    // 🔥 EN punta SEMPRE al root ufficiale
    languages[hreflang] =
      l === "en"
        ? canonicalUrl(EN_ROOT_LIST_PATH)
        : canonicalUrl(listPathByLang[l]);
  }

  // x-default = EN root
  languages["x-default"] = canonicalUrl(EN_ROOT_LIST_PATH);

  // canonical: EN → root, altre → loro lista
  const canonical =
    L === "en"
      ? canonicalUrl(EN_ROOT_LIST_PATH)
      : canonicalUrl(listPathByLang[L]);

  return {
    title,
    description,
    alternates: { canonical, languages },

    // 🔥 anti-duplicati: /en/* non indicizzabile
    robots:
      L === "en"
        ? { index: false, follow: true }
        : { index: true, follow: true },

    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "CertifyQuiz",
      type: "website",
      locale:
        L === "it"
          ? "it-IT"
          : L === "en"
          ? "en-US"
          : L === "fr"
          ? "fr-FR"
          : "es-ES",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

/* -------------------------- Static params (SSG) -------------------------- */
export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/* --------------------------------- PAGE ---------------------------------- */
export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const L: Locale = isLocale(lang) ? (lang as Locale) : "it";

  const raw = await getCertificationsListRSC();

  // Normalizzazione per aderire a CertListItem
  let certs: CertListItem[] = (raw as any[]).map((c: any) => {
    const slug: string = String(c.slug || "").trim();

    const title =
      c.title && typeof c.title === "object"
        ? c.title
        : c.title ?? c.name ?? slug;

    const imageUrl = c.imageUrl ?? c.image_url ?? ICON_BY_SLUG[slug] ?? null;

    const level =
      c.level && typeof c.level === "object" ? c.level : c.level ?? null;

    const description =
      c.description && typeof c.description === "object"
        ? c.description
        : c.description ?? null;

    const category = (c.category as CertListItem["category"]) ?? null;

    return { slug, title, imageUrl, level, description, category };
  });

  // 🔧 Fix speciale per Cisco CCST:
  // se nel backend c'è una cert "cisco-ccst", la trasformiamo in
  // Networking + Cybersecurity, ma senza duplicare Networking
  const ccstIndex = certs.findIndex((c) => c.slug === "cisco-ccst");
  if (ccstIndex !== -1) {
    const base = certs[ccstIndex];
    certs.splice(ccstIndex, 1); // rimuove la generica

    const hasNetworking = certs.some((c) => c.slug === "cisco-ccst-networking");
    const hasSecurity = certs.some((c) => c.slug === "cisco-ccst-security");

    const networkingTitle =
      typeof base.title === "string"
        ? `${base.title} – Networking`
        : {
            ...(base.title || {}),
            it: "Cisco CCST – Networking",
            en: "Cisco CCST – Networking",
            fr: "Cisco CCST – Networking",
            es: "Cisco CCST – Networking",
          };

    const securityTitle =
      typeof base.title === "string"
        ? `${base.title} – Cybersecurity`
        : {
            ...(base.title || {}),
            it: "Cisco CCST – Cybersecurity",
            en: "Cisco CCST – Cybersecurity",
            fr: "Cisco CCST – Cybersecurity",
            es: "Cisco CCST – Cybersecurity",
          };

    const toAdd: CertListItem[] = [];

    if (!hasNetworking) {
      toAdd.push({
        ...base,
        slug: "cisco-ccst-networking",
        title: networkingTitle,
        imageUrl: ICON_BY_SLUG["cisco-ccst-networking"],
      });
    }

    if (!hasSecurity) {
      toAdd.push({
        ...base,
        slug: "cisco-ccst-security",
        title: securityTitle,
        imageUrl: ICON_BY_SLUG["cisco-ccst-security"],
      });
    }

    certs.push(...toAdd);
  }

  const visible = certs.filter(
    (c): c is CertListItem & { slug: string } =>
      typeof c.slug === "string" && c.slug.trim().length > 0,
  );

  // JSON-LD ItemList
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: SEO[L].title,
    itemListElement: visible.map((c, i) => {
      const titleText =
        typeof c.title === "string" ? c.title : c.title?.[L] ?? c.title?.it ?? c.slug;

      // 🔥 URL nel JSON-LD:
      // - EN → root /certifications/:slug
      // - altre → loro path localizzato
      const urlPath = L === "en" ? enRootDetailPath(c.slug) : detailPath(L, c.slug);

      return {
        "@type": "ListItem",
        position: i + 1,
        url: new URL(urlPath, SITE_URL).toString(),
        name: titleText,
      };
    }),
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">{SEO[L].title}</h1>
        <p className="mt-2 max-w-3xl text-sm text-gray-600 dark:text-neutral-300">
          {SEO[L].description}
        </p>
      </header>

      {/* Lista certificazioni con search + filtri */}
      <CertificationListClient
        items={visible.map((c) => {
          const titleText =
            typeof c.title === "string" ? c.title : c.title?.[L] ?? c.title?.it ?? c.slug;

          const levelText =
            typeof c.level === "string" ? c.level : c.level?.[L] ?? c.level?.it;

          const descriptionText =
            typeof c.description === "string"
              ? c.description
              : c.description?.[L] ?? c.description?.it;

          // 1) livello logico da mappa slug -> LevelKey
          let levelKey: LevelKey | null = LEVEL_BY_SLUG[c.slug] ?? null;

          // 2) fallback: usiamo l'eventuale testo level
          if (!levelKey) {
            const rawLevelForKey = levelText ?? "";
            if (/base/i.test(rawLevelForKey)) levelKey = "base";
            else if (/intermedio|intermediate/i.test(rawLevelForKey))
              levelKey = "intermediate";
            else if (/avanzat|advanced/i.test(rawLevelForKey)) levelKey = "advanced";
          }

          const categoryLabel = typeof c.category === "string" ? c.category : null;

          return {
            slug: c.slug,
            href: L === "en" ? enRootDetailPath(c.slug) : detailPath(L, c.slug),
            title: titleText,
            level: levelText ?? undefined,
            description: descriptionText ?? undefined,
            imageUrl: c.imageUrl ?? undefined,
            levelKey: levelKey ?? undefined,
            category: categoryLabel,
          };
        })}
      />

      <Script
        id="certifyquiz-cert-list-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
    </main>
  );
}
