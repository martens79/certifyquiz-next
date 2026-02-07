// src/content/hubs/vendors/google.ts
import type { Locale } from "@/lib/i18n";
import type { HubData } from "../vendor-domains/google-cloud";

// helper: /hub/... per EN, /{lang}/hub/... per le altre
const hubHref = (slug: string) => (lang: Locale) =>
  lang === "en" ? `/hub/${slug}` : `/${lang}/hub/${slug}`;

/**
 * Google Vendor Hub (central)
 * Goal: SEO + conversion (practice-driven), without overpromising.
 */
export const googleVendorHub: HubData = {
  hubKind: "vendor",
  hubSlug: "google",
  vendorKey: "google",

  title: {
    it: "Certificazioni Google: percorsi, quiz e pratica d’esame",
    en: "Google Certifications: paths, quizzes and exam practice",
    fr: "Certifications Google : parcours, quiz et entraînement",
    es: "Certificaciones de Google: rutas, quizzes y práctica",
  },

  description: {
    it: "Un unico hub per prepararti alle certificazioni Google: scegli un percorso (Cloud, AI & Data, Career, Marketing, Education) e vai subito ai quiz. Contenuti in crescita, aggiornati e organizzati per area.",
    en: "One hub to prepare for Google certifications: choose a path (Cloud, AI & Data, Career, Marketing, Education) and jump straight to quizzes. Growing, updated content organized by domain.",
    fr: "Un hub unique pour préparer les certifications Google : choisissez un parcours (Cloud, IA & Data, Career, Marketing, Éducation) et accédez directement aux quiz. Contenu en croissance, organisé par domaine.",
    es: "Un solo hub para preparar certificaciones de Google: elige una ruta (Cloud, IA y Datos, Career, Marketing, Educación) y ve directo a los quizzes. Contenido en crecimiento, organizado por área.",
  },

  sections: [
    // ✅ LIVE (oggi)
    {
      title: { it: "Google Cloud", en: "Google Cloud", fr: "Google Cloud", es: "Google Cloud" },
      description: {
        it: "Certificazioni Google Cloud da foundational a professional: scegli la tua e allenati con quiz in stile esame.",
        en: "Google Cloud certifications from foundational to professional: pick yours and train with exam-style quizzes.",
        fr: "Certifications Google Cloud du niveau débutant au professionnel : entraînez-vous avec des quiz type examen.",
        es: "Certificaciones de Google Cloud de nivel básico a profesional: practica con quizzes estilo examen.",
      },
      hrefByLang: hubHref("google-cloud"),
    },

    // 🚧 FUTURE (pagine esistono, ma contenuti/certs cresceranno)
    {
      title: { it: "Google AI & Data", en: "Google AI & Data", fr: "Google IA & Data", es: "Google IA & Datos" },
      description: {
        it: "Percorsi su intelligenza artificiale e dati nell’ecosistema Google: basi, strumenti e pratica (in arrivo).",
        en: "AI and data paths in the Google ecosystem: fundamentals, tools and practice (coming soon).",
        fr: "Parcours IA et data dans l’écosystème Google : bases, outils et pratique (bientôt).",
        es: "Rutas de IA y datos en el ecosistema Google: fundamentos, herramientas y práctica (próximamente).",
      },
      hrefByLang: hubHref("google-ai"),
    },
    {
      title: { it: "Google Career Certificates", en: "Google Career Certificates", fr: "Google Career Certificates", es: "Google Career Certificates" },
      description: {
        it: "Certificati professionali Google (IT, Data, Project, Cybersecurity…): percorsi guidati + quiz (in arrivo).",
        en: "Google Professional Certificates (IT, Data, Project, Cybersecurity…): guided paths + quizzes (coming soon).",
        fr: "Certificats professionnels Google (IT, Data, Project, Cybersécurité…) : parcours + quiz (bientôt).",
        es: "Certificados profesionales de Google (TI, Datos, Project, Ciberseguridad…): rutas + quizzes (próximamente).",
      },
      hrefByLang: hubHref("google-career"),
    },
    {
      title: { it: "Google Marketing", en: "Google Marketing", fr: "Google Marketing", es: "Google Marketing" },
      description: {
        it: "Google Ads, Analytics e digital marketing: concetti chiave e simulazioni quiz (in arrivo).",
        en: "Google Ads, Analytics and digital marketing: key concepts and quiz practice (coming soon).",
        fr: "Google Ads, Analytics et marketing digital : notions clés et quiz (bientôt).",
        es: "Google Ads, Analytics y marketing digital: conceptos clave y práctica (próximamente).",
      },
      hrefByLang: hubHref("google-marketing"),
    },
    {
      title: { it: "Google for Education", en: "Google for Education", fr: "Google for Education", es: "Google for Education" },
      description: {
        it: "Percorsi per docenti e scuole: preparazione strutturata e quiz (in arrivo).",
        en: "Education paths for teachers and schools: structured prep and quizzes (coming soon).",
        fr: "Parcours éducation pour enseignants et écoles : préparation et quiz (bientôt).",
        es: "Rutas para educación: preparación estructurada y quizzes (próximamente).",
      },
      hrefByLang: hubHref("google-education"),
    },
  ],
};
