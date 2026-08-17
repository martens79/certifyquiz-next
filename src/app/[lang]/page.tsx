import HomeWithAuth from "@/components/home/HomeWithAuth";
import StructuredData from "@/components/StructuredData";
import type { Locale, Localized } from "@/lib/i18n";
import type { Metadata } from "next";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com").replace(
  /\/+$/,
  ""
);

const ogLocale: Record<Locale, string> = {
  it: "it_IT",
  en: "en_US",
  fr: "fr_FR",
  es: "es_ES",
};

const getLabel = (dict: Partial<Record<Locale, string>>, lang: Locale): string =>
  dict[lang] ?? dict.it ?? dict.en ?? dict.fr ?? dict.es ?? "";

/* ─────────────── Helpers route per categoria ─────────────── */
const segByLang: Record<Locale, string> = {
  it: "categorie",
  en: "categories",
  fr: "categories",
  es: "categorias",
};

const categoryUrl = (lang: Locale, catKey: string) =>
  `${SITE}/${lang}/${segByLang[lang]}/${catKey}`;

/* ─────────────── Ordine & etichette categorie ─────────────── */
const categoriesOrder: ReadonlyArray<{ key: string; label: Localized<string> }> = [
  { key: "base", label: { it: "Base", en: "Basic", fr: "Bases", es: "Básico" } },
  {
    key: "sicurezza",
    label: { it: "Sicurezza", en: "Security", fr: "Sécurité", es: "Seguridad" },
  },
  { key: "reti", label: { it: "Reti", en: "Networking", fr: "Réseaux", es: "Redes" } },
  {
    key: "ai",
    label: {
      it: "Intelligenza Artificiale",
      en: "Artificial Intelligence",
      fr: "Intelligence Artificielle",
      es: "Inteligencia Artificial",
    },
  },
  { key: "cloud", label: { it: "Cloud", en: "Cloud", fr: "Cloud", es: "Nube" } },
  {
    key: "database",
    label: {
      it: "Database",
      en: "Databases",
      fr: "Bases de données",
      es: "Bases de datos",
    },
  },
  {
    key: "programmazione",
    label: {
      it: "Programmazione",
      en: "Programming",
      fr: "Programmation",
      es: "Programación",
    },
  },
  {
    key: "virtualizzazione",
    label: {
      it: "Virtualizzazione",
      en: "Virtualization",
      fr: "Virtualisation",
      es: "Virtualización",
    },
  },
  {
    key: "business-applications",
    label: { it: "Business Applications", en: "Business Applications", fr: "Business Applications", es: "Business Applications" },
  },
];

/* ─────────────── SEO metadata ─────────────── */
export async function generateMetadata(
  props: { params: Promise<{ lang: Locale }> }
): Promise<Metadata> {
  const { lang } = await props.params;

  const title = getLabel(
    {
      it: "CertifyQuiz — Quiz e Simulazioni per Certificazioni IT",
      en: "CertifyQuiz — IT Certification Practice Tests & Quizzes",
      fr: "CertifyQuiz — Quiz et Tests d'Entraînement pour Certifications IT",
      es: "CertifyQuiz — Quiz y Simulacros para Certificaciones IT",
    },
    lang
  );

  const description = getLabel(
    {
      it: "Preparati alle certificazioni IT con quiz gratuiti, spiegazioni dettagliate e simulazioni realistiche. AWS, Azure, Security+, CCNA, PMP e altro.",
      en: "Prepare for IT certifications with free practice quizzes and detailed explanations. AWS, Azure, Security+, CCNA, PMP and more.",
      fr: "Préparez vos certifications IT avec des quiz gratuits et des explications détaillées. AWS, Azure, Security+, CCNA, PMP et plus.",
      es: "Prepárate para certificaciones IT con quiz gratuitos y explicaciones detalladas. AWS, Azure, Security+, CCNA, PMP y más.",
    },
    lang
  );

  const canonical = `${SITE}/${lang}`;

  return {
    metadataBase: new URL(SITE),
    title,
    description,
    alternates: {
      canonical,
      languages: {
        it: `${SITE}/it`,
        en: `${SITE}/`,
        fr: `${SITE}/fr`,
        es: `${SITE}/es`,
        "x-default": `${SITE}/`,
      },
    },
    openGraph: {
      url: canonical,
      title,
      description,
      siteName: "CertifyQuiz",
      locale: ogLocale[lang],
      type: "website",
      images: [
        {
          url: `${SITE}/og/home-${lang}.png`,
          width: 1200,
          height: 630,
          alt: "CertifyQuiz Home",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE}/og/home-${lang}.png`],
      site: "@CertifyQuiz",
    },
    robots: { index: true, follow: true },
  };
}

/* ─────────────── Pagina ─────────────── */
export default async function LangHome(
  props: { params: Promise<{ lang: Locale }> }
) {
  const { lang } = await props.params;

  // JSON-LD: Breadcrumbs
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${SITE}/${lang}`,
      },
    ],
  } as const;

  // JSON-LD: ItemList categorie (URL localizzati)
  const categoriesItemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Home categories",
    itemListOrder: "http://schema.org/ItemListOrderAscending",
    numberOfItems: categoriesOrder.length,
    itemListElement: categoriesOrder.map((c, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name:
        (c.label as Record<string, string>)[lang] ??
        (c.label as Record<string, string>)["it"] ??
        "",
      url: categoryUrl(lang, c.key),
    })),
  } as const;

  return (
    <>
      <StructuredData id="ld-home-breadcrumb" data={breadcrumbLd} />
      <StructuredData id="ld-home-categories" data={categoriesItemListLd} />
      <main id="main">
        {/* HomeWithAuth gestisce il token e passa isLoggedIn a <Home /> */}
        <HomeWithAuth lang={lang} />
      </main>
    </>
  );
}
