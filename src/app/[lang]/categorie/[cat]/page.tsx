// src/app/[lang]/categorie/[cat]/page.tsx
// Category page — slug mapping per lingua + SEO hreflang/canonical coerenti
// Regole:
// - SEO pages: EN senza /en, altre lingue con /{lang}
// - Quiz: SEMPRE con /{lang} (EN incluso)

import type { Metadata } from "next";
import Link from "next/link";

import { CERT_SLUGS } from "@/certifications/data";
import { PRIMARY_CERT_SLUG_BY_CATEGORY } from "@/lib/primary-cert-by-category";
import { seoPrefix, quizPrefix } from "@/lib/paths";

import {
  getCategoryStyle,
  CERT_CATEGORY_BY_SLUG,
  type CategoryKey,
} from "@/lib/certs";
import { getCertCardDesc, type CertDescLocale } from "@/lib/cert-descriptions";

/* -------------------------------- Config -------------------------------- */
const LOCALES = ["it", "en", "fr", "es"] as const;
type Locale = (typeof LOCALES)[number];

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com").replace(
  /\/+$/,
  ""
);

/* ------------------------------------------------------------------------ */
/*                       CATEGORY META — MULTILINGUA                         */
/* ------------------------------------------------------------------------ */

const CATEGORY_META: Record<
  CategoryKey,
  {
    key: CategoryKey;
    emoji?: string;
    title: Record<Locale, string>;
    subtitle: Record<Locale, string>;
  }
> = {
  default: {
    key: "default",
    emoji: "📚",
    title: { it: "Categorie", en: "Categories", fr: "Catégories", es: "Categorías" },
    subtitle: {
      it: "Scegli una categoria per iniziare.",
      en: "Pick a category to get started.",
      fr: "Choisissez une catégorie pour commencer.",
      es: "Elige una categoría para empezar.",
    },
  },

  base: {
    key: "base",
    emoji: "🧮",
    title: { it: "Base", en: "Basics", fr: "Bases", es: "Básico" },
    subtitle: {
      it: "Competenze digitali di base e alfabetizzazione informatica.",
      en: "Basic digital skills and IT literacy.",
      fr: "Compétences numériques de base et initiation informatique.",
      es: "Habilidades digitales básicas y alfabetización informática.",
    },
  },

  sicurezza: {
    key: "sicurezza",
    emoji: "🔐",
    title: { it: "Sicurezza", en: "Security", fr: "Sécurité", es: "Seguridad" },
    subtitle: {
      it: "Protezione dei dati, minacce informatiche e prevenzione.",
      en: "Data protection, cyber threats and prevention.",
      fr: "Protection des données, menaces informatiques et prévention.",
      es: "Protección de datos, amenazas informáticas y prevención.",
    },
  },

  reti: {
    key: "reti",
    emoji: "🧩",
    title: { it: "Reti", en: "Networking", fr: "Réseaux", es: "Redes" },
    subtitle: {
      it: "Fondamenti di reti, protocolli e infrastrutture.",
      en: "Network fundamentals, protocols, and infrastructures.",
      fr: "Bases des réseaux, protocoles et infrastructures.",
      es: "Fundamentos de redes, protocolos e infraestructuras.",
    },
  },

  cloud: {
    key: "cloud",
    emoji: "☁️",
    title: { it: "Cloud", en: "Cloud", fr: "Cloud", es: "Nube" },
    subtitle: {
      it: "Servizi cloud, modelli di distribuzione e sicurezza.",
      en: "Cloud services, deployment models and security.",
      fr: "Services cloud, modèles de déploiement et sécurité.",
      es: "Servicios en la nube, modelos de despliegue y seguridad.",
    },
  },

  database: {
    key: "database",
    emoji: "🗄️",
    title: { it: "Database", en: "Databases", fr: "Bases de données", es: "Bases de datos" },
    subtitle: {
      it: "Modellazione, interrogazione e gestione dei dati.",
      en: "Data modeling, querying and management.",
      fr: "Modélisation, requêtes et gestion des données.",
      es: "Modelado, consultas y gestión de datos.",
    },
  },

  programmazione: {
    key: "programmazione",
    emoji: "⌨️",
    title: { it: "Programmazione", en: "Programming", fr: "Programmation", es: "Programación" },
    subtitle: {
      it: "Linguaggi moderni e logica di programmazione.",
      en: "Modern languages and programming logic.",
      fr: "Langages modernes et logique de programmation.",
      es: "Lenguajes modernos y lógica de programación.",
    },
  },

  virtualizzazione: {
    key: "virtualizzazione",
    emoji: "🖥️",
    title: { it: "Virtualizzazione", en: "Virtualization", fr: "Virtualisation", es: "Virtualización" },
    subtitle: {
      it: "Tecnologie di virtualizzazione e ambienti cloud-native.",
      en: "Virtualization technologies and cloud-native environments.",
      fr: "Technologies de virtualisation et environnements cloud-native.",
      es: "Tecnologías de virtualización y entornos cloud-native.",
    },
  },

  ai: {
    key: "ai",
    emoji: "🧠",
    title: {
      it: "Intelligenza Artificiale",
      en: "Artificial Intelligence",
      fr: "Intelligence Artificielle",
      es: "Inteligencia Artificial",
    },
    subtitle: {
      it: "Concetti base di AI e machine learning.",
      en: "Basic concepts of AI and machine learning.",
      fr: "Concepts de base de l'IA et du machine learning.",
      es: "Conceptos básicos de IA y aprendizaje automático.",
    },
  },
    management: {
    key: "management",
    emoji: "💼",
    title: {
      it: "Management & Project Management",
      en: "Management & Project Management",
      fr: "Management & Gestion de Projet",
      es: "Management y Gestión de Proyectos",
    },
    subtitle: {
      it: "Project management, leadership, Agile, governance e organizzazione aziendale.",
      en: "Project management, leadership, Agile, governance and business organization.",
      fr: "Gestion de projet, leadership, Agile, gouvernance et organisation d’entreprise.",
      es: "Gestión de proyectos, liderazgo, Agile, gobernanza y organización empresarial.",
    },
  },
};


const ROADMAP_BY_CATEGORY: Partial<Record<CategoryKey, string>> = {
  base: "fundamentals",
  sicurezza: "cybersecurity",
  reti: "networking",
  cloud: "cloud",
  programmazione: "programming",
  database: "databases",
  virtualizzazione: "virtualization",
  ai: "ai",
  management: "management",
};


/* ------------------------------------------------------------------------ */
/*                           Slug mapping                                   */
/* ------------------------------------------------------------------------ */

const CAT_SLUG_TO_KEY: Record<Locale, Record<string, CategoryKey>> = {
  it: {
    base: "base",
    sicurezza: "sicurezza",
    reti: "reti",
    cloud: "cloud",
    database: "database",
    programmazione: "programmazione",
    virtualizzazione: "virtualizzazione",
     management: "management",
    "intelligenza-artificiale": "ai",
  },
  en: {
    fundamentals: "base",
    basics: "base",
    security: "sicurezza",
    networking: "reti",
    cloud: "cloud",
    databases: "database",
    programming: "programmazione",
    virtualization: "virtualizzazione",
     management: "management",
    "artificial-intelligence": "ai",
  },
  fr: {
    fondamentaux: "base",
    bases: "base",
    securite: "sicurezza",
    reseaux: "reti",
    cloud: "cloud",
    "bases-de-donnees": "database",
    programmation: "programmazione",
    virtualisation: "virtualizzazione",
     management: "management",
    "intelligence-artificielle": "ai",
  },
  es: {
    fundamentos: "base",
    basico: "base",
    seguridad: "sicurezza",
    redes: "reti",
    cloud: "cloud",
    "bases-de-datos": "database",
    programacion: "programmazione",
    virtualizacion: "virtualizzazione",
    "gestion-management": "management",
     management: "management",
    "inteligencia-artificial": "ai",
  },
};

const CAT_KEY_TO_SLUG: Record<Locale, Record<CategoryKey, string>> = {
  it: {
    default: "base",
    base: "base",
    sicurezza: "sicurezza",
    reti: "reti",
    cloud: "cloud",
    database: "database",
    programmazione: "programmazione",
    virtualizzazione: "virtualizzazione",
    management: "management",
    ai: "intelligenza-artificiale",
  },
  en: {
    default: "fundamentals",
    base: "fundamentals",
    sicurezza: "security",
    reti: "networking",
    cloud: "cloud",
    database: "databases",
    programmazione: "programming",
    virtualizzazione: "virtualization",
    management: "management",
    ai: "artificial-intelligence",
  },
  fr: {
    default: "fondamentaux",
    base: "fondamentaux",
    sicurezza: "securite",
    reti: "reseaux",
    cloud: "cloud",
    database: "bases-de-donnees",
    programmazione: "programmation",
    virtualizzazione: "virtualisation",
    management: "management",
    ai: "intelligence-artificielle",
  },
  es: {
    default: "fundamentos",
    base: "fundamentos",
    sicurezza: "seguridad",
    reti: "redes",
    cloud: "cloud",
    database: "bases-de-datos",
    programmazione: "programacion",
    virtualizzazione: "virtualizacion",
    management: "management",
    ai: "inteligencia-artificial",
  },
};

function resolveInternalKey(lang: Locale, slug: string): CategoryKey | null {
  const s = (slug || "").trim();
  if (!s) return null;

  // slug pubblico → key interna (es. "seguridad" → "sicurezza")
  const bySlug = CAT_SLUG_TO_KEY[lang]?.[s];
  if (bySlug) return bySlug;

  // già key interna (es. "sicurezza")
  if (Object.prototype.hasOwnProperty.call(CAT_KEY_TO_SLUG[lang], s)) {
    return s as CategoryKey;
  }

  return null;
}



/* ------------------------------------------------------------------------ */
/*                              Path helpers                                */
/* ------------------------------------------------------------------------ */

function segForCategories(lang: Locale) {
  return lang === "it" ? "categorie" : lang === "es" ? "categorias" : "categories";
}

function segForCertifications(lang: Locale) {
  return lang === "it"
    ? "certificazioni"
    : lang === "es"
    ? "certificaciones"
    : "certifications";
}

/** SEO path builder: EN no prefix, others /{lang} */
function seoPath(lang: Locale, pathname: string) {
  const base = seoPrefix(lang); // "" | "/it" | "/fr" | "/es"
  return base ? `${base}${pathname}` : pathname;
}

function localizedCategoryPath(lang: Locale, key: CategoryKey) {
  return seoPath(lang, `/${segForCategories(lang)}/${CAT_KEY_TO_SLUG[lang][key]}`);
}

function localizedCertListPath(lang: Locale) {
  return seoPath(lang, `/${segForCertifications(lang)}`);
}

function localizedCertPath(lang: Locale, certSlug: string) {
  return seoPath(lang, `/${segForCertifications(lang)}/${certSlug}`);
}

function mixedQuizPath(lang: Locale, key: CategoryKey) {
  const certSlug = PRIMARY_CERT_SLUG_BY_CATEGORY[key] ?? PRIMARY_CERT_SLUG_BY_CATEGORY.default;
  return `${quizPrefix(lang)}/quiz/${certSlug}/mixed`;
}

/* ------------------------------------------------------------------------ */
/*                                SEO helpers                               */
/* ------------------------------------------------------------------------ */

const ogLocale = (lang: Locale) =>
  lang === "it" ? "it-IT" : lang === "en" ? "en-US" : lang === "fr" ? "fr-FR" : "es-ES";

function hreflangMap(key: CategoryKey) {
  const out: Record<string, string> = {};
  for (const l of LOCALES) {
    out[ogLocale(l)] = `${SITE_URL}${localizedCategoryPath(l, key)}`;
  }
  out["x-default"] = `${SITE_URL}${localizedCategoryPath("en", key)}`;
  return out;
}

/* ------------------------------------------------------------------------ */
/*                                Metadata                                  */
/* ------------------------------------------------------------------------ */

export const revalidate = 60;
export const runtime = "nodejs";
export const dynamicParams = true;

type Props = {
  params: Promise<{ lang: Locale; cat: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, cat } = await params;

  // ✅ lang non valido → metadata "safe"
  if (!LOCALES.includes(lang)) {
    const canonical = `${SITE_URL}/categories/${cat || ""}`; // fallback
    return {
      title: "Invalid language — CertifyQuiz",
      description: "Invalid language.",
      alternates: { canonical },
      robots: { index: false, follow: false },
    };
  }
const key = resolveInternalKey(lang, cat);

  if (!key) {
    const canonical = `${SITE_URL}${seoPath(lang, `/${segForCategories(lang)}/${cat}`)}`;
    return {
      title: "Categoria non trovata",
      description: "Categoria non valida.",
      alternates: { canonical },
      robots: { index: false, follow: false },
    };
  }
  

  const meta = CATEGORY_META[key];
  const title = meta.title[lang] ?? meta.title.it;
  const desc = meta.subtitle[lang] ?? meta.subtitle.it;
  const canonical = `${SITE_URL}${localizedCategoryPath(lang, key)}`;

  return {
    title: `${title} — CertifyQuiz`,
    description: desc,
    alternates: { canonical, languages: hreflangMap(key) },
    openGraph: {
      title,
      description: desc,
      url: canonical,
      siteName: "CertifyQuiz",
      locale: ogLocale(lang),
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description: desc },
    robots: { index: true, follow: true },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { lang, cat } = await params;
  const key = resolveInternalKey(lang, cat);

  if (!key) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-2xl font-bold mb-2">
          {lang === "it"
            ? "Categoria non trovata"
            : lang === "fr"
            ? "Catégorie introuvable"
            : lang === "es"
            ? "Categoría no encontrada"
            : "Category not found"}
        </h1>
        <p className="text-sm text-gray-600">
          Slug ricevuto: <code>{cat}</code>
        </p>
      </main>
    );
  }
  const meta = CATEGORY_META[key];
  const css = getCategoryStyle(key);

  const roadmapKey = ROADMAP_BY_CATEGORY[key];

const roadmapHref = roadmapKey
  ? lang === "en"
    ? `/roadmap-${roadmapKey}`
    : `/${lang}/roadmap-${roadmapKey}`
  : null;

const roadmapLabel =
  lang === "it"
    ? "Da dove partire? Apri la roadmap →"
    : lang === "fr"
    ? "Par où commencer ? Ouvrir la roadmap →"
    : lang === "es"
    ? "¿Por dónde empezar? Abrir la ruta →"
    : "Not sure where to start? Open the roadmap →";


  const certSlugs = CERT_SLUGS.filter((s) => CERT_CATEGORY_BY_SLUG[s] === key);

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name:
          lang === "it" ? "Certificazioni" : lang === "es" ? "Certificaciones" : "Certifications",
        item: `${SITE_URL}${localizedCertListPath(lang)}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: meta.title[lang] ?? meta.title.it,
        item: `${SITE_URL}${localizedCategoryPath(lang, key)}`,
      },
    ],
  };

  const ctaCert =
    lang === "it"
      ? "Vai alla pagina certificazione →"
      : lang === "fr"
      ? "Voir la certification →"
      : lang === "es"
      ? "Ir a la certificación →"
      : "Go to certification page →";

      const currentLang = lang as CertDescLocale;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <header className={`rounded-2xl p-6 shadow-sm mb-8 ${css.header}`}>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <span>{meta.emoji}</span> {meta.title[lang]}
        </h1>
        <p className="mt-1 opacity-80">{meta.subtitle[lang]}</p>
        {roadmapHref && (
  <Link
    href={roadmapHref}
    prefetch={false}
    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:underline"
  >
    {roadmapLabel}
  </Link>
)}

      </header>

      {certSlugs.length === 0 ? (
        <p className="text-gray-700">
          {lang === "it"
            ? "Nessuna certificazione in questa categoria."
            : lang === "fr"
            ? "Aucune certification dans cette catégorie."
            : lang === "es"
            ? "No hay certificaciones en esta categoría."
            : "No certifications in this category."}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {certSlugs.map((slug) => (
            <Link
              key={slug}
              href={localizedCertPath(lang, slug)}
              className={`rounded-2xl p-5 shadow-sm transition ${css.wrapper}`}
            >
              <div className="text-lg font-semibold leading-snug">
  {slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
</div>

<p className="mt-1 text-sm opacity-80 leading-snug">
  {getCertCardDesc(slug, currentLang)}
</p>

<p className="mt-3 text-sm underline underline-offset-4 opacity-70">
  {ctaCert}
</p>

            </Link>
          ))}

          
        </div>
      )}
    </main>
  );
}
