// src/content/hubs/vendors/google.ts
import type { Locale } from "@/lib/i18n";
import type { HubData } from "../vendor-domains/google-cloud";

// helper: /hub/... per EN, /{lang}/hub/... per le altre
const hubHref = (slug: string) => (lang: Locale) =>
  lang === "en" ? `/hub/${slug}` : `/${lang}/hub/${slug}`;

/**
 * Google Vendor Hub (central)
 * Goal: SEO + conversion, collegato alle certificazioni e roadmap reali.
 */
export const googleVendorHub: HubData = {
  hubKind: "vendor",
  hubSlug: "google",
  vendorKey: "google",

  title: {
    it: "Certificazioni Google: Cloud, AI e TensorFlow",
    en: "Google Certifications: Cloud, AI and TensorFlow",
    fr: "Certifications Google : Cloud, IA et TensorFlow",
    es: "Certificaciones Google: Cloud, IA y TensorFlow",
  },

  description: {
    it: "Hub Google su CertifyQuiz per prepararti ai percorsi Google Cloud, AI e TensorFlow. Parti dalle basi cloud, passa a Google Cloud Digital Leader e approfondisci AI, machine learning e strumenti Google.",
    en: "Google hub on CertifyQuiz to prepare for Google Cloud, AI and TensorFlow paths. Start from cloud foundations, move into Google Cloud Digital Leader and explore AI, machine learning and Google tools.",
    fr: "Hub Google sur CertifyQuiz pour préparer les parcours Google Cloud, IA et TensorFlow. Commencez par les bases cloud, passez à Google Cloud Digital Leader puis explorez l’IA, le machine learning et les outils Google.",
    es: "Hub Google en CertifyQuiz para preparar rutas de Google Cloud, IA y TensorFlow. Empieza por fundamentos cloud, avanza hacia Google Cloud Digital Leader y explora IA, machine learning y herramientas Google.",
  },

  sections: [
    {
      title: {
        it: "Google Cloud Foundations",
        en: "Google Cloud Foundations",
        fr: "Google Cloud Foundations",
        es: "Google Cloud Foundations",
      },
      description: {
        it: "Percorso introduttivo per comprendere cloud, infrastruttura Google, servizi principali, sicurezza, costi e concetti fondamentali.",
        en: "Introductory path to understand cloud, Google infrastructure, core services, security, costs and foundational concepts.",
        fr: "Parcours introductif pour comprendre le cloud, l’infrastructure Google, les services principaux, la sécurité, les coûts et les concepts fondamentaux.",
        es: "Ruta introductoria para comprender cloud, infraestructura Google, servicios principales, seguridad, costes y conceptos fundamentales.",
      },
      hrefByLang: hubHref("google-cloud"),
    },

    {
      title: {
        it: "Google Cloud Digital Leader",
        en: "Google Cloud Digital Leader",
        fr: "Google Cloud Digital Leader",
        es: "Google Cloud Digital Leader",
      },
      description: {
        it: "Percorso business-oriented su trasformazione digitale, innovazione, AI, dati e servizi Google Cloud.",
        en: "Business-oriented path covering digital transformation, innovation, AI, data and Google Cloud services.",
        fr: "Parcours orienté business sur transformation digitale, innovation, IA, données et services Google Cloud.",
        es: "Ruta orientada a negocio sobre transformación digital, innovación, IA, datos y servicios de Google Cloud.",
      },
      hrefByLang: hubHref("google-cloud"),
    },

    {
      title: {
        it: "TensorFlow & AI",
        en: "TensorFlow & AI",
        fr: "TensorFlow & IA",
        es: "TensorFlow & IA",
      },
      description: {
        it: "Machine learning, AI foundations, TensorFlow, modelli, workflow e strumenti Google collegati all’intelligenza artificiale.",
        en: "Machine learning, AI foundations, TensorFlow, models, workflows and Google tools related to artificial intelligence.",
        fr: "Machine learning, foundations IA, TensorFlow, modèles, workflows et outils Google liés à l’intelligence artificielle.",
        es: "Machine learning, fundamentos de IA, TensorFlow, modelos, workflows y herramientas Google relacionadas con inteligencia artificial.",
      },
      hrefByLang: hubHref("google-ai"),
    },

    {
      title: {
        it: "Cloud Roadmap",
        en: "Cloud Roadmap",
        fr: "Roadmap Cloud",
        es: "Roadmap Cloud",
      },
      description: {
        it: "Non sai da dove iniziare? Segui la roadmap Cloud: foundations, AWS, Azure, Google Cloud, Kubernetes e operations.",
        en: "Not sure where to start? Follow the Cloud roadmap: foundations, AWS, Azure, Google Cloud, Kubernetes and operations.",
        fr: "Vous ne savez pas par où commencer ? Suivez la roadmap Cloud : foundations, AWS, Azure, Google Cloud, Kubernetes et operations.",
        es: "¿No sabes por dónde empezar? Sigue la roadmap Cloud: foundations, AWS, Azure, Google Cloud, Kubernetes y operations.",
      },
      hrefByLang: (lang: Locale) =>
        lang === "en" ? "/roadmap-cloud" : `/${lang}/roadmap-cloud`,
    },

    {
      title: {
        it: "AI Roadmap",
        en: "AI Roadmap",
        fr: "Roadmap IA",
        es: "Roadmap IA",
      },
      description: {
        it: "Percorso AI completo: foundations, strumenti moderni, AI generativa, machine learning e certificazioni introduttive.",
        en: "Complete AI path: foundations, modern tools, generative AI, machine learning and introductory certifications.",
        fr: "Parcours IA complet : foundations, outils modernes, IA générative, machine learning et certifications introductives.",
        es: "Ruta completa IA: foundations, herramientas modernas, IA generativa, machine learning y certificaciones introductorias.",
      },
      hrefByLang: (lang: Locale) =>
        lang === "en" ? "/roadmap-ai" : `/${lang}/roadmap-ai`,
    },
  ],
};