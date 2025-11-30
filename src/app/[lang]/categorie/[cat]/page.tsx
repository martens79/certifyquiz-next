// src/app/[lang]/categorie/[cat]/page.tsx
// Category page — SEO fixed, localized titles, hreflang, cleaned OG, proper breadcrumb

import type { Metadata } from "next";
import Link from "next/link";
import { CERT_SLUGS } from "@/certifications/data";
import {
  getCategoryStyle,
  CERT_CATEGORY_BY_SLUG,
  type CategoryKey,
} from "@/lib/certs";

/* -------------------------------- Config -------------------------------- */
const LOCALES = ["it", "en", "fr", "es"] as const;
type Locale = (typeof LOCALES)[number];

const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com").replace(
    /\/+$/,
    ""
  );

/* ------------------------------------------------------------------------ */
/*                       CATEGORY META — MULTILINGUA                       */
/* ------------------------------------------------------------------------ */

const CATEGORY_META: Record<
  string,
  {
    key: CategoryKey;
    emoji?: string;
    title: Record<Locale, string>;
    subtitle: Record<Locale, string>;
  }
> = {
  base: {
    key: "base",
    emoji: "🧮",
    title: {
      it: "Base",
      en: "Basics",
      fr: "Bases",
      es: "Básico",
    },
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
    title: {
      it: "Sicurezza",
      en: "Security",
      fr: "Sécurité",
      es: "Seguridad",
    },
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
    title: {
      it: "Reti",
      en: "Networking",
      fr: "Réseaux",
      es: "Redes",
    },
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
    title: {
      it: "Cloud",
      en: "Cloud",
      fr: "Cloud",
      es: "Nube",
    },
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
    title: {
      it: "Database",
      en: "Databases",
      fr: "Bases de données",
      es: "Bases de datos",
    },
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
    title: {
      it: "Programmazione",
      en: "Programming",
      fr: "Programmation",
      es: "Programación",
    },
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
    title: {
      it: "Virtualizzazione",
      en: "Virtualization",
      fr: "Virtualisation",
      es: "Virtualización",
    },
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
};

/* ------------------------------------------------------------------------ */
/*                           Helpers localizzati                           */
/* ------------------------------------------------------------------------ */

function segForCertifications(lang: Locale) {
  return lang === "it"
    ? "certificazioni"
    : lang === "es"
    ? "certificaciones"
    : "certifications"; // en/fr
}

function segForCategories(lang: Locale) {
  return lang === "it"
    ? "categorie"
    : lang === "es"
    ? "categorias"
    : "categories"; // en/fr
}

const ogLocale = (lang: Locale) =>
  lang === "it"
    ? "it-IT"
    : lang === "en"
    ? "en-US"
    : lang === "fr"
    ? "fr-FR"
    : "es-ES";

function localizedPath(lang: Locale, cat: string) {
  return `/${lang}/${segForCategories(lang)}/${cat}`;
}

function hreflangMap(cat: string) {
  return Object.fromEntries(
    LOCALES.map((l) => [ogLocale(l), `${SITE_URL}${localizedPath(l, cat)}`])
  );
}

/* ------------------------------------------------------------------------ */
/*                                 Metadata                                */
/* ------------------------------------------------------------------------ */

export const revalidate = 60;
export const runtime = "nodejs";
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale; cat: string }>;
}): Promise<Metadata> {
  const { lang, cat } = await params;

  const meta = CATEGORY_META[cat];

  const tTitle = meta?.title[lang] ?? meta?.title.it ?? "Categoria";
  const tSubtitle =
    meta?.subtitle[lang] ?? meta?.subtitle.it ?? "Seleziona una certificazione";

  const canonical = `${SITE_URL}${localizedPath(lang, cat)}`;

  return {
    title: `${tTitle} — Certificazioni`,
    description: tSubtitle,
    alternates: {
      canonical,
      languages: hreflangMap(cat),
    },
    openGraph: {
      title: `${tTitle} — Certificazioni`,
      description: tSubtitle,
      url: canonical,
      siteName: "CertifyQuiz",
      locale: ogLocale(lang),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${tTitle} — Certificazioni`,
      description: tSubtitle,
    },
    robots: { index: true, follow: true },
  };
}

/* ------------------------------------------------------------------------ */
/*                                  PAGE                                   */
/* ------------------------------------------------------------------------ */

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ lang: Locale; cat: string }>;
}) {
  const { lang, cat } = await params;
  const meta = CATEGORY_META[cat];

  if (!meta) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-2xl font-bold mb-2">Categoria non trovata</h1>
        <p className="text-sm text-gray-600">
          Slug ricevuto: <code>{cat}</code>
        </p>
      </main>
    );
  }

  const css = getCategoryStyle(meta.key);

  const certSlugs = CERT_SLUGS.filter(
    (s) => (CERT_CATEGORY_BY_SLUG[s] ?? "") === meta.key
  );

  /* ---------------------- JSON-LD Breadcrumb ---------------------- */
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name:
          lang === "it"
            ? "Certificazioni"
            : lang === "es"
            ? "Certificaciones"
            : "Certifications",
        item: `${SITE_URL}/${lang}/${segForCertifications(lang)}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: meta.title[lang] ?? meta.title.it,
        item: `${SITE_URL}${localizedPath(lang, cat)}`,
      },
    ],
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <header className={`rounded-2xl p-6 shadow-sm mb-8 ${css.header}`}>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <span>{meta.emoji}</span>{" "}
          {meta.title[lang] ?? meta.title.it}
        </h1>
        <p className="mt-1 opacity-80">
          {meta.subtitle[lang] ?? meta.subtitle.it}
        </p>
      </header>

      {certSlugs.length === 0 ? (
        <p className="text-gray-700">Nessuna certificazione in questa categoria.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {certSlugs.map((slug) => (
            <Link
              key={slug}
              href={`/${lang}/${segForCertifications(lang)}/${slug}`}
              className={`rounded-2xl p-5 shadow-sm transition ${css.wrapper}`}
            >
              <div className="text-lg font-semibold mb-1">
                {slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </div>
              <p className="text-sm opacity-80">
                {lang === "it"
                  ? "Vai alla pagina certificazione →"
                  : lang === "en"
                  ? "Go to certification page →"
                  : lang === "fr"
                  ? "Voir la certification →"
                  : "Ir a la certificación →"}
              </p>
            </Link>
          ))}

          <Link
            href={`/${lang}/quiz-mixed/${cat}`}
            className={`rounded-2xl p-5 font-semibold shadow-sm transition ${css.wrapper}`}
          >
            <div className="text-xl mb-1">
              🎯{" "}
              {lang === "it"
                ? `Quiz misti — ${meta.title.it}`
                : lang === "en"
                ? `Mixed quiz — ${meta.title.en}`
                : lang === "fr"
                ? `Quiz mixtes — ${meta.title.fr}`
                : `Quiz mixtos — ${meta.title.es}`}
            </div>
            <p className="text-sm opacity-80">
              {lang === "it"
                ? "Tutti gli argomenti della categoria in un solo test."
                : lang === "en"
                ? "All category topics in a single test."
                : lang === "fr"
                ? "Tous les sujets de la catégorie dans un seul test."
                : "Todos los temas de la categoría en una sola prueba."}
            </p>
          </Link>
        </div>
      )}
    </main>
  );
}
