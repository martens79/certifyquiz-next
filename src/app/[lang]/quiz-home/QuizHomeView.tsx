import QuizHome from "@/components/QuizHome";
import StructuredData from "@/components/StructuredData";

export type Locale = "it" | "en" | "fr" | "es";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com";

function urlFor(lang: Locale, path: string) {
  // ✅ EN = root (no /en)
  if (lang === "en") return `${SITE}${path}`;
  return `${SITE}/${lang}${path}`;
}

export default function QuizHomeView({ lang }: { lang: Locale }) {
  const homeUrl = lang === "en" ? `${SITE}/` : `${SITE}/${lang}`;
  const quizHomeUrl = urlFor(lang, "/quiz-home");

  const catLabel: Record<
    | "base"
    | "sicurezza"
    | "reti"
    | "cloud"
    | "database"
    | "programmazione"
    | "virtualizzazione"
    | "intelligenza-artificiale",
    Record<Locale, string>
  > = {
    base: { it: "Base", en: "Fundamentals", fr: "Base", es: "Básico" },
    sicurezza: { it: "Sicurezza", en: "Security", fr: "Sécurité", es: "Seguridad" },
    reti: { it: "Reti", en: "Networking", fr: "Réseaux", es: "Redes" },
    cloud: { it: "Cloud", en: "Cloud", fr: "Cloud", es: "Nube" },
    database: { it: "Database", en: "Database", fr: "Base de données", es: "Base de datos" },
    programmazione: { it: "Programmazione", en: "Programming", fr: "Programmation", es: "Programación" },
    virtualizzazione: { it: "Virtualizzazione", en: "Virtualization", fr: "Virtualisation", es: "Virtualización" },
    "intelligenza-artificiale": {
      it: "Intelligenza Artificiale",
      en: "Artificial Intelligence",
      fr: "Intelligence Artificielle",
      es: "Inteligencia Artificial",
    },
  };

  const categoriesOrder = [
    "base",
    "sicurezza",
    "reti",
    "cloud",
    "database",
    "programmazione",
    "virtualizzazione",
    "intelligenza-artificiale",
  ] as const;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: homeUrl },
      { "@type": "ListItem", position: 2, name: "Quiz", item: quizHomeUrl },
    ],
  };

  const categoriesItemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Quiz categories",
    itemListOrder: "http://schema.org/ItemListOrderAscending",
    numberOfItems: categoriesOrder.length,
    itemListElement: categoriesOrder.map((key, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: catLabel[key][lang] || catLabel[key].it,
      url: `${quizHomeUrl}#${key}`,
    })),
  };

  return (
    <>
      <StructuredData id="ld-breadcrumb-quizhome" data={breadcrumbLd} />
      <StructuredData id="ld-itemlist-quiz-categories" data={categoriesItemListLd} />
      <QuizHome lang={lang} />
    </>
  );
}
