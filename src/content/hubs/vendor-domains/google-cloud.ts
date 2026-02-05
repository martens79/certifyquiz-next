// src/content/hubs/vendor-domains/google-cloud.ts
import type { Locale } from "@/lib/i18n";

export type HubKind = "vendor" | "vendorDomain" | "category";

export type HubSection = {
  title: Record<Locale, string>;
  description?: Record<Locale, string>;
  hrefByLang: (lang: Locale) => string;
};

export type HubCertItem = {
  slug: string; // cert slug (es. "google-cloud" = la tua pagina /certifications/google-cloud)
  badge?: string;
  examCode?: string;
  popularity?: number;
};

export type HubData =
  | {
      hubKind: "vendor";
      hubSlug: string;
      vendorKey: string;
      title: Record<Locale, string>;
      description: Record<Locale, string>;
      sections: HubSection[];
    }
  | {
      hubKind: "vendorDomain" | "category";
      hubSlug: string;
      vendorKey?: string;
      domainKey?: string;
      title: Record<Locale, string>;
      description: Record<Locale, string>;
      certs: HubCertItem[];
    };

// ✅ QUIZ mai root: /{lang}/quiz/...
const hubHref = (slug: string) => (lang: Locale) =>
  lang === "en" ? `/hub/${slug}` : `/${lang}/hub/${slug}`;

export const googleCloudHub: HubData = {
  hubKind: "vendorDomain",
  hubSlug: "google-cloud",
  vendorKey: "google",
  domainKey: "cloud",
  title: {
    it: "Certificazioni Google Cloud",
    en: "Google Cloud Certifications",
    fr: "Certifications Google Cloud",
    es: "Certificaciones de Google Cloud",
  },
  description: {
    it: "Percorso Google Cloud: certificazioni disponibili, livello e accesso diretto ai quiz.",
    en: "Google Cloud path: available certifications, level, and direct access to quizzes.",
    fr: "Parcours Google Cloud : certifications disponibles, niveau et accès direct aux quiz.",
    es: "Ruta Google Cloud: certificaciones disponibles, nivel y acceso directo a los quizzes.",
  },
  certs: [
    // ✅ questa è la tua cert singola che hai ora: /certifications/google-cloud
    { slug: "google-cloud", badge: "Beginner", examCode: "Cloud Digital Leader", popularity: 90 },
  ],
};
