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
];

/* ─────────────── SEO metadata ─────────────── */
export async function generateMetadata(
  props: { params: Promise<{ lang: Locale }> }
): Promise<Metadata> {
  const { lang } = await props.params;

  const title = getLabel(
    {
      it: "CertifyQuiz — Allenati per le certificazioni IT",
      en: "CertifyQuiz — Prepare for IT Certifications",
      fr: "CertifyQuiz — Préparez vos certifications IT",
      es: "CertifyQuiz — Prepárate para certificaciones IT",
    },
    lang
  );

  const description = getLabel(
    {
      it: "Quiz, spiegazioni e badge per superare le certificazioni informatiche. Inizia subito con ITF+, A+, AWS, Azure, Security+ e molte altre!",
      en: "Quizzes, explanations and badges to pass IT certifications. Start now with ITF+, A+, AWS, Azure, Security+ and more!",
      fr: "Quiz, explications et badges pour réussir vos certifications IT. Commencez avec ITF+, A+, AWS, Azure, Security+ et plus !",
      es: "Cuestionarios, explicaciones y logros para aprobar certificaciones IT. Empieza con ITF+, A+, AWS, Azure, Security+ y más.",
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
        en: `${SITE}/en`,
        fr: `${SITE}/fr`,
        es: `${SITE}/es`,
        "x-default": `${SITE}/en`,
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
