// src/content/hubs/vendor-domains/google-cloud.ts
import type { Locale } from "@/lib/i18n";

export type HubKind = "vendor" | "vendorDomain" | "category";

export type HubSection = {
  title: Record<Locale, string>;
  description?: Record<Locale, string>;
  hrefByLang: (lang: Locale) => string;
};

export type HubCertItem = {
  slug: string; // cert slug (es. "google-cloud" = /certifications/google-cloud)
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

/**
 * ✅ Google Cloud Domain Hub
 * Goal: be the authoritative “index” for Google Cloud certifications on the site.
 * - Stronger SEO copy (without fluff)
 * - Clear promise: quizzes + exam practice
 * - Scales: you just add items to `certs` over time
 */
export const googleCloudHub: HubData = {
  hubKind: "vendorDomain",
  hubSlug: "google-cloud",
  vendorKey: "google",
  domainKey: "cloud",

  title: {
    it: "Certificazioni Google Cloud: quiz, pratica ed esami",
    en: "Google Cloud Certifications: quizzes, practice and exams",
    fr: "Certifications Google Cloud : quiz, pratique et examens",
    es: "Certificaciones de Google Cloud: quizzes, práctica y exámenes",
  },

  description: {
    it: "Hub Google Cloud con le certificazioni disponibili su CertifyQuiz: scegli il livello (foundational, associate, professional) e allenati con quiz in stile esame, spiegazioni e pratica mirata. Contenuti in crescita e aggiornati.",
    en: "Google Cloud hub with the certifications available on CertifyQuiz: choose your level (foundational, associate, professional) and train with exam-style quizzes, explanations and focused practice. Growing, updated content.",
    fr: "Hub Google Cloud avec les certifications disponibles sur CertifyQuiz : choisissez votre niveau (foundational, associate, professional) et entraînez-vous avec des quiz type examen, des explications et une pratique ciblée. Contenu en croissance, mis à jour.",
    es: "Hub de Google Cloud con las certificaciones disponibles en CertifyQuiz: elige tu nivel (foundational, associate, professional) y practica con quizzes estilo examen, explicaciones y práctica enfocada. Contenido en crecimiento y actualizado.",
  },

  certs: [
    // ✅ Certificazione già presente: /certifications/google-cloud
    {
      slug: "google-cloud",
      badge: "Foundational",
      examCode: "Cloud Digital Leader",
      popularity: 90,
    },

    // 🔜 Quando aggiungi nuove certificazioni, basta aggiungerle qui.
    // Esempi (solo quando esistono davvero le pagine /certifications/...):
    // { slug: "google-associate-cloud-engineer", badge: "Associate", examCode: "Associate Cloud Engineer", popularity: 85 },
    // { slug: "google-professional-cloud-architect", badge: "Professional", examCode: "Professional Cloud Architect", popularity: 88 },
  ],
};
