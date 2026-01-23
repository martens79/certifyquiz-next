// src/app/[lang]/certificazioni/CertificationsListView.tsx
import Script from "next/script";

import { type Locale, withLang } from "@/lib/i18n";
import { getCertificationsListRSC } from "@/lib/server/certs";
import type { CertListItem } from "@/lib/certs";
import { CertificationListClient } from "@/components/CertificationListClient";

/* ------------------------- PATH PER LINGUA ------------------------- */
const listPathByLang: Record<Locale, string> = {
  it: "/it/certificazioni",
  en: "/en/certificazioni", // route tecnica (non indicizzare)
  fr: "/fr/certificazioni",
  es: "/es/certificaciones",
};

const detailPath = (lang: Locale, slug: string) => `${listPathByLang[lang]}/${slug}`;
const enRootDetailPath = (slug: string) => `/certifications/${slug}`;

/* ------------------------- LIVELLI (per filtri) ------------------------- */
type LevelKey = "base" | "intermediate" | "advanced";

const LEVEL_BY_SLUG: Record<string, LevelKey> = {
  // base
  "comptia-itf-plus": "base",
  "aws-cloud-practitioner": "base",
  "google-cloud": "base",
  "eipass-basic": "base",
  eipass: "base",
  ecdl: "base",
  pekit: "base",
  icdl: "base",
  "cisco-ccst-networking": "base",
  "cisco-ccst-cybersecurity": "base",

  // intermediate
  "comptia-a-plus": "intermediate",
  "comptia-network-plus": "intermediate",
  "security-plus": "intermediate",
  ccna: "intermediate",
  ceh: "intermediate",
  "java-se": "intermediate",
  python: "intermediate",
  "javascript-developer": "intermediate",
  "microsoft-virtualization": "intermediate",
  "microsoft-azure-fundamentals": "intermediate",

  // advanced
  cissp: "advanced",
  jncie: "advanced",
  "aws-solutions-architect": "advanced",
  "vmware-certified-professional": "advanced",
  "mongodb-developer": "advanced",
};

/* ------------------------- ICONE PER SLUG ------------------------- */
const ICON_BY_SLUG: Record<string, string> = {
  "ai-fundamentals": "/images/certifications/ai-fundamentals-icon.png",
  "aws-cloud-practitioner": "/images/certifications/aws-cloud-practitioner.png",
  "aws-solutions-architect": "/images/certifications/aws-solutions-architect.png",
  "azure-fundamentals": "/images/certifications/azure-fundamentals-icon.png",
  "google-cloud": "/images/certifications/google_cloud_icon.png",
  "google-tensorflow": "/images/certifications/tensorflow-icon.png",

  "comptia-itf-plus": "/images/certifications/itf-icon.png",
  "comptia-a-plus": "/images/certifications/comptia-a-plus.png",
  "security-plus": "/images/certifications/securityplus-icon.png",
  "comptia-network-plus": "/images/certifications/networkplus.png",
  "comptia-cloud-plus": "/images/certifications/cloudplus-icon.png",

  ccna: "/images/certifications/ccna.png",
  "cisco-ccst-networking": "/images/certifications/ccst_networking.png",
  "cisco-ccst-cybersecurity": "/images/certifications/ccst_cybersecurity.png",

  cissp: "/images/certifications/cissp.png",
  ceh: "/images/certifications/ceh.png",
  "isc2-cc": "/images/certifications/isc2-icon.png",

  ecdl: "/images/certifications/ecdl.png",
  "microsoft-azure-fundamentals": "/images/certifications/azure-fundamentals-icon.png",
  "microsoft-csharp": "/images/certifications/csharp-icon.png",
  "microsoft-sql-server": "/images/certifications/sqlserver.png",
  "microsoft-virtualization": "/images/certifications/microsoft-virtualization-logo.png",
  "microsoft-ai": "/images/certifications/ai-fundamentals-icon.png",

  "ibm-cloud-v5": "/images/certifications/ibmcloud-icon.png",
  f5: "/images/certifications/f5-icon.png",

  "eipass-basic": "/images/certifications/eipass.png",
  eipass: "/images/certifications/eipass.png",
  pekit: "/images/certifications/pekit.png",
  icdl: "/images/certifications/icdl.png",

  "java-se": "/images/certifications/java-icon.png",
  "javascript-developer": "/images/certifications/javascript-icon.png",
  python: "/images/certifications/python.png",

  "oracle-database-sql": "/images/certifications/oracle-sql.png",
  "mysql-certification": "/images/certifications/mysql.png",
  "mongodb-developer": "/images/certifications/mongodb.png",

  "vmware-certified-professional": "/images/certifications/vmware-vcp.png",
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
const normalizeSlug = (raw: unknown): string => {
  const s = String(raw ?? "").trim();

  // alias CompTIA Security+
  if (s === "comptia-security-plus") return "security-plus";

  // alias CCST: vecchio → canonico
  if (s === "cisco-ccst-cybersecurity") return "cisco-ccst-security";

  return s;
};


export default async function CertificationsListView({ lang }: ViewProps) {
  const L = lang;

  const raw = await getCertificationsListRSC();

  let certs: CertListItem[] = (raw as any[]).map((c: any) => {
    const slug = normalizeSlug(c.slug);

    const title =
      c.title && typeof c.title === "object" ? c.title : c.title ?? c.name ?? slug;

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
  // Se dal backend arriva una sola voce "cisco-ccst", la splittiamo in 2
  // Fix CCST (split)
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
      imageUrl: ICON_BY_SLUG["cisco-ccst-networking"],
    });
  }
  if (!hasCyber) {
    toAdd.push({
      ...base,
      slug: "cisco-ccst-cybersecurity",
      title: cyberTitle,
      imageUrl: ICON_BY_SLUG["cisco-ccst-cybersecurity"],
    });
  }

  certs.push(...toAdd);
}

  const visible = certs.filter(
    (c): c is CertListItem & { slug: string } =>
      typeof c.slug === "string" && c.slug.trim().length > 0
  );

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: SEO[L].title,
    itemListElement: visible.map((c, i) => {
      const titleText =
        typeof c.title === "string" ? c.title : c.title?.[L] ?? c.title?.it ?? c.slug;

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

          let levelKey: LevelKey | null = LEVEL_BY_SLUG[c.slug] ?? null;

          if (!levelKey) {
            const rawLevelForKey = levelText ?? "";
            if (/base/i.test(rawLevelForKey)) levelKey = "base";
            else if (/intermedio|intermediate/i.test(rawLevelForKey)) levelKey = "intermediate";
            else if (/avanzat|advanced/i.test(rawLevelForKey)) levelKey = "advanced";
          }

          const href =
            L === "en" ? enRootDetailPath(c.slug) : withLang(L, `/certificazioni/${c.slug}`);

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
