import type { Locale } from "@/lib/i18n";
import type { HubData } from "../vendor-domains/google-cloud";

const hubHref = (slug: string) => (lang: Locale) =>
  lang === "en" ? `/hub/${slug}` : `/${lang}/hub/${slug}`;

export const ibmVendorHub: HubData = {
  hubKind: "vendor",
  hubSlug: "ibm",
  vendorKey: "ibm",

  title: {
    it: "Certificazioni IBM: Cloud, AI e Security",
    en: "IBM Certifications: Cloud, AI and Security",
    fr: "Certifications IBM : Cloud, IA et Sécurité",
    es: "Certificaciones IBM: Cloud, IA y Seguridad",
  },

  description: {
    it: "Hub IBM su CertifyQuiz per prepararti ai percorsi IBM Cloud, AI e Security. Parti dalle basi cloud enterprise e approfondisci infrastruttura, intelligenza artificiale e sicurezza.",
    en: "IBM hub on CertifyQuiz to prepare for IBM Cloud, AI and Security paths. Start from enterprise cloud fundamentals and explore infrastructure, artificial intelligence and security.",
    fr: "Hub IBM sur CertifyQuiz pour préparer les parcours IBM Cloud, IA et Sécurité. Commencez par les bases du cloud enterprise puis explorez infrastructure, intelligence artificielle et sécurité.",
    es: "Hub IBM en CertifyQuiz para preparar rutas IBM Cloud, IA y Seguridad. Empieza desde fundamentos cloud enterprise y explora infraestructura, inteligencia artificial y seguridad.",
  },

  sections: [
    {
      title: {
        it: "IBM Cloud",
        en: "IBM Cloud",
        fr: "IBM Cloud",
        es: "IBM Cloud",
      },
      description: {
        it: "Percorso IBM Cloud V5: infrastruttura cloud, virtualizzazione, deployment, networking e servizi enterprise.",
        en: "IBM Cloud V5 path: cloud infrastructure, virtualization, deployment, networking and enterprise services.",
        fr: "Parcours IBM Cloud V5 : infrastructure cloud, virtualisation, déploiement, réseau et services enterprise.",
        es: "Ruta IBM Cloud V5: infraestructura cloud, virtualización, deployment, redes y servicios enterprise.",
      },
      hrefByLang: hubHref("ibm-cloud"),
    },

    {
      title: {
        it: "IBM AI",
        en: "IBM AI",
        fr: "IBM IA",
        es: "IBM IA",
      },
      description: {
        it: "Area AI IBM dedicata a machine learning, automazione, AI enterprise e strumenti Watson.",
        en: "IBM AI area focused on machine learning, automation, enterprise AI and Watson tools.",
        fr: "Zone IA IBM dédiée au machine learning, à l’automatisation, à l’IA enterprise et aux outils Watson.",
        es: "Área IA IBM enfocada en machine learning, automatización, IA enterprise y herramientas Watson.",
      },
      hrefByLang: hubHref("ibm-ai"),
    },

    {
      title: {
        it: "IBM Security",
        en: "IBM Security",
        fr: "IBM Security",
        es: "IBM Security",
      },
      description: {
        it: "Percorso sicurezza IBM: identity, protezione dati, governance, monitoraggio e cybersecurity enterprise.",
        en: "IBM security path: identity, data protection, governance, monitoring and enterprise cybersecurity.",
        fr: "Parcours sécurité IBM : identité, protection des données, gouvernance, monitoring et cybersécurité enterprise.",
        es: "Ruta de seguridad IBM: identidad, protección de datos, governance, monitoring y ciberseguridad enterprise.",
      },
      hrefByLang: hubHref("ibm-security"),
    },

    {
      title: {
        it: "Cloud Roadmap",
        en: "Cloud Roadmap",
        fr: "Roadmap Cloud",
        es: "Roadmap Cloud",
      },
      description: {
        it: "Segui la roadmap Cloud: foundations, AWS, Azure, Google Cloud, IBM Cloud e operations.",
        en: "Follow the Cloud roadmap: foundations, AWS, Azure, Google Cloud, IBM Cloud and operations.",
        fr: "Suivez la roadmap Cloud : foundations, AWS, Azure, Google Cloud, IBM Cloud et operations.",
        es: "Sigue la roadmap Cloud: foundations, AWS, Azure, Google Cloud, IBM Cloud y operations.",
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
        it: "Percorso AI completo: foundations, machine learning, AI generativa e strumenti enterprise.",
        en: "Complete AI path: foundations, machine learning, generative AI and enterprise tools.",
        fr: "Parcours IA complet : foundations, machine learning, IA générative et outils enterprise.",
        es: "Ruta completa IA: foundations, machine learning, IA generativa y herramientas enterprise.",
      },
      hrefByLang: (lang: Locale) =>
        lang === "en" ? "/roadmap-ai" : `/${lang}/roadmap-ai`,
    },
  ],
};