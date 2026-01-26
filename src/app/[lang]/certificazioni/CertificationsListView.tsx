// src/app/[lang]/certificazioni/CertificationsListView.tsx
import Script from "next/script";

import type { Locale } from "@/lib/i18n";
import { getCertificationsListRSC } from "@/lib/server/certs";
import type { CertListItem } from "@/lib/certs";
import { CertificationListClient } from "@/components/CertificationListClient";

/* ------------------------- CANONICAL PATHS (PUBLIC) ------------------------- */
/**
 * Regole:
 * - IT: /it/certificazioni
 * - EN: /certifications (NO /en)
 * - FR: /fr/certifications (poi rewrite interno verso /fr/certificazioni)
 * - ES: /es/certificaciones (poi rewrite interno verso /es/certificazioni)
 */
const listPathByLang: Record<Locale, string> = {
  it: "/it/certificazioni",
  en: "/certifications",
  fr: "/fr/certifications",
  es: "/es/certificaciones",
};

const detailPath = (lang: Locale, slug: string) => `${listPathByLang[lang]}/${slug}`;

/* ------------------------- LIVELLI (per filtri) ------------------------- */
type LevelKey = "base" | "intermediate" | "advanced";

/**
 * IMPORTANT:
 * - Qui usiamo SOLO slug canonici (quelli del registry / IDS_BY_SLUG).
 * - Gli alias vengono “normalizzati” a monte.
 */
const LEVEL_BY_SLUG: Record<string, LevelKey> = {
  // base
  "comptia-itf-plus": "base",
  "aws-cloud-practitioner": "base",
  "google-cloud": "base",
  eipass: "base",
  "eipass-basic": "base",
  pekit: "base",
  icdl: "base",
  "cisco-ccst-networking": "base",
  "cisco-ccst-security": "base",

  // intermediate
  "comptia-a-plus": "intermediate",
  "network-plus": "intermediate",
  "security-plus": "intermediate",
  ccna: "intermediate",
  ceh: "intermediate",
  "java-se": "intermediate",
  "python-developer": "intermediate",
  "javascript-developer": "intermediate",
  "microsoft-virtualization": "intermediate",
  "microsoft-azure-fundamentals": "intermediate",
  "microsoft-ai-fundamentals": "intermediate",
  "oracle-database-sql": "intermediate",
  mysql: "intermediate",
  "microsoft-sql-server": "intermediate",
  "mongodb-developer": "intermediate",
  "ibm-cloud-v5": "intermediate",
  f5: "intermediate",

  // advanced
  cissp: "advanced",
  jncie: "advanced",
  "aws-solutions-architect": "advanced",
  "vmware-vcp": "advanced",
};

/* ------------------------- ICONE (canoniche) ------------------------- */
const ICON_BY_SLUG: Record<string, string> = {
  // canonici
  "aws-cloud-practitioner": "/images/certifications/aws-cloud-practitioner.png",
  "aws-solutions-architect": "/images/certifications/aws-solutions-architect.png",
  "google-cloud": "/images/certifications/google_cloud_icon.png",
  tensorflow: "/images/certifications/tensorflow-icon.png",

  "comptia-itf-plus": "/images/certifications/itf-icon.png",
  "comptia-a-plus": "/images/certifications/comptia-a-plus.png",
  "security-plus": "/images/certifications/securityplus-icon.png",
  "network-plus": "/images/certifications/networkplus.png",
  "comptia-cloud-plus": "/images/certifications/cloudplus-icon.png",

  ccna: "/images/certifications/ccna.png",
  "cisco-ccst-networking": "/images/certifications/ccst_networking.png",
  "cisco-ccst-security": "/images/certifications/ccst_cybersecurity.png", // ✅ nuovo canonico
  "cisco-ccst-cybersecurity": "/images/certifications/ccst_cybersecurity.png",

  cissp: "/images/certifications/cissp.png",
  ceh: "/images/certifications/ceh.png",
  "isc2-cc": "/images/certifications/isc2-icon.png",

  icdl: "/images/certifications/ecdl.png",
  "microsoft-azure-fundamentals": "/images/certifications/azure-fundamentals-icon.png",
  csharp: "/images/certifications/csharp-icon.png",
  "microsoft-sql-server": "/images/certifications/sqlserver.png",
  "microsoft-virtualization": "/images/certifications/microsoft-virtualization-logo.png",
  "microsoft-ai-fundamentals": "/images/certifications/ai-fundamentals-icon.png",

  "ibm-cloud-v5": "/images/certifications/ibmcloud-icon.png",
  f5: "/images/certifications/f5-icon.png",

  "eipass-basic": "/images/certifications/eipass.png",
  eipass: "/images/certifications/eipass.png",
  pekit: "/images/certifications/pekit.png",

  "java-se": "/images/certifications/java-icon.png",
  "javascript-developer": "/images/certifications/javascript-icon.png",
  "python-developer": "/images/certifications/python.png",

  "oracle-database-sql": "/images/certifications/oracle-sql.png",
  mysql: "/images/certifications/mysql.png",
  "mongodb-developer": "/images/certifications/mongodb.png",

  "vmware-vcp": "/images/certifications/vmware-vcp.png",
  jncie: "/images/certifications/jncie-icon.png",
};

/* ---------------------------- SEO TEXT ---------------------------- */
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

type ViewProps = { lang: Locale };

const RAW_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com";
const SITE_URL = RAW_SITE_URL.replace(/\/+$/, "");

/* ------------------------- SLUG NORMALIZATION ------------------------- */
/**
 * Normalizza slug dal backend (o vecchi URL) verso slug canonici del tuo registry.
 * Se qui normalizzi bene, spariscono:
 * - 404 da slug legacy
 * - "slug non mappato" nei quiz (quando usi lo stesso slug)
 */
const normalizeSlug = (raw: unknown): string => {
  const s = String(raw ?? "").trim();

  // canonical ICDL
  if (s === "ecdl") return "icdl";

  // CompTIA aliases
  if (s === "comptia-security-plus") return "security-plus";
  if (s === "comptia-network-plus") return "network-plus";

  // Legacy slugs (visti in giro)
  if (s === "mysql-certification") return "mysql";
  if (s === "google-tensorflow") return "tensorflow";
  if (s === "microsoft-ai") return "microsoft-ai-fundamentals";
  if (s === "ai-fundamentals") return "microsoft-ai-fundamentals";
  if (s === "azure-fundamentals") return "microsoft-azure-fundamentals";

  // VMware legacy
  if (s === "vmware-certified-professional") return "vmware-vcp";

  // Dev languages legacy
  if (s === "python") return "python-developer";
  if (s === "javascript") return "javascript-developer";

  
  // CCST aliases: accetta varianti legacy -> canonico = cisco-ccst-security
if (s === "cisco-ccst-cybersecurity") return "cisco-ccst-security";
if (s === "ccst-cybersecurity") return "cisco-ccst-security";

  return s;
};

export default async function CertificationsListView({ lang }: ViewProps) {
  const L = lang;

  const raw = await getCertificationsListRSC();

  let certs: CertListItem[] = (raw as any[]).map((c: any) => {
    const slug = normalizeSlug(c.slug);

    const title =
      c.title && typeof c.title === "object" ? c.title : c.title ?? c.name ?? slug;

    // Icon fallback: prefer backend image, else our local registry by canonical slug
    const imageUrl = c.imageUrl ?? c.image_url ?? ICON_BY_SLUG[slug] ?? null;

    const level = c.level && typeof c.level === "object" ? c.level : c.level ?? null;

    const description =
      c.description && typeof c.description === "object"
        ? c.description
        : c.description ?? null;

    const category = (c.category as CertListItem["category"]) ?? null;

    return { slug, title, imageUrl, level, description, category };
  });

  /* ------------------------- FIX CCST "GENERIC" ------------------------- */
  // Se dal backend arriva una sola voce "cisco-ccst", la splittiamo in 2 (networking + cybersecurity)
  const ccstIndex = certs.findIndex((c) => c.slug === "cisco-ccst");
  if (ccstIndex !== -1) {
    const base = certs[ccstIndex];
    certs.splice(ccstIndex, 1);

    const hasNetworking = certs.some((c) => c.slug === "cisco-ccst-networking");
    const hasCyber = certs.some((c) => c.slug === "cisco-ccst-cybersecurity");

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

    const cyberTitle =
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
        imageUrl: ICON_BY_SLUG["cisco-ccst-networking"] ?? base.imageUrl ?? null,
      });
    }
    if (!hasCyber) {
      toAdd.push({
        ...base,
        slug: "cisco-ccst-security", // ✅ qui
        title: cyberTitle,
        imageUrl: ICON_BY_SLUG["cisco-ccst-cybersecurity"] ?? base.imageUrl ?? null,
      });
    }

    certs.push(...toAdd);
  }

  const visible = certs.filter(
    (c): c is CertListItem & { slug: string } =>
      typeof c.slug === "string" && c.slug.trim().length > 0
  );

  /* ------------------------- JSON-LD ------------------------- */
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: SEO[L].title,
    itemListElement: visible.map((c, i) => {
      const titleText =
        typeof c.title === "string" ? c.title : c.title?.[L] ?? c.title?.it ?? c.slug;

      const urlPath = detailPath(L, c.slug);

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

      <CertificationListClient
        lang={L}
        items={visible.map((c) => {
          const titleText =
            typeof c.title === "string" ? c.title : c.title?.[L] ?? c.title?.it ?? c.slug;

          const levelText =
            typeof c.level === "string" ? c.level : c.level?.[L] ?? c.level?.it;

          const descriptionText =
            typeof c.description === "string"
              ? c.description
              : c.description?.[L] ?? c.description?.it;

          // LevelKey for filters (prefer map, else infer from level text)
          let levelKey: LevelKey | null = LEVEL_BY_SLUG[c.slug] ?? null;
          if (!levelKey) {
            const rawLevelForKey = levelText ?? "";
            if (/base|beginner|principiante/i.test(rawLevelForKey)) levelKey = "base";
            else if (/intermedio|intermediate/i.test(rawLevelForKey)) levelKey = "intermediate";
            else if (/avanzat|advanced/i.test(rawLevelForKey)) levelKey = "advanced";
          }

          const href = detailPath(L, c.slug);

          return {
            slug: c.slug,
            href,
            title: titleText,
            level: levelText,
            description: descriptionText,
            imageUrl: c.imageUrl,
            levelKey,
            category: c.category ?? null,
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
