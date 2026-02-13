import type { Locale } from "@/lib/i18n";
import type { HubData } from "../vendor-domains/google-cloud";

const hubHref = (slug: string) => (lang: Locale) =>
  lang === "en" ? `/hub/${slug}` : `/${lang}/hub/${slug}`;

export const oracleVendorHub: HubData = {
  hubKind: "vendor",
  hubSlug: "oracle",
  vendorKey: "oracle",

  title: {
    it: "Certificazioni Oracle: percorsi, quiz e pratica d’esame",
    en: "Oracle Certifications: paths, quizzes and exam practice",
    fr: "Certifications Oracle : parcours, quiz et entraînement",
    es: "Certificaciones Oracle: rutas, quizzes y práctica",
  },

  description: {
    it: "Hub centrale per le certificazioni Oracle: scegli un percorso e vai ai quiz.",
    en: "Central hub for Oracle certifications: choose a path and jump to quizzes.",
    fr: "Hub central pour les certifications Oracle : choisissez un parcours.",
    es: "Hub central de certificaciones Oracle: elige una ruta y ve a los quizzes.",
  },

  sections: [
    {
      title: { it: "Database SQL", en: "Database SQL", fr: "Base de données SQL", es: "Base de datos SQL" },
      description: {
        it: "Percorso Oracle Database SQL.",
        en: "Oracle Database SQL certification path.",
        fr: "Parcours Oracle Database SQL.",
        es: "Ruta Oracle Database SQL.",
      },
      hrefByLang: hubHref("oracle-database"),
    },
    {
      title: { it: "Cloud (in arrivo)", en: "Cloud (coming soon)", fr: "Cloud (bientôt)", es: "Cloud (próximamente)" },
      description: {
        it: "Percorso Oracle Cloud in sviluppo.",
        en: "Oracle Cloud certification path coming soon.",
        fr: "Parcours Oracle Cloud bientôt disponible.",
        es: "Ruta Oracle Cloud próximamente.",
      },
      hrefByLang: hubHref("oracle-cloud"),
    },
  ],
};
