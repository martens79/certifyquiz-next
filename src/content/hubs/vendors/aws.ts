import type { Locale } from "@/lib/i18n";
import type { HubData } from "../vendor-domains/google-cloud";

// helper: /hub/... per EN, /{lang}/hub/... per le altre
const hubHref = (slug: string) => (lang: Locale) =>
  lang === "en" ? `/hub/${slug}` : `/${lang}/hub/${slug}`;

/**
 * AWS Vendor Hub (central)
 */
export const awsVendorHub: HubData = {
  hubKind: "vendor",
  hubSlug: "aws",
  vendorKey: "aws",

  title: {
    it: "Certificazioni AWS: Cloud, Architecting e AI",
    en: "AWS Certifications: Cloud, Architecting and AI",
    fr: "Certifications AWS : Cloud, Architecture et IA",
    es: "Certificaciones AWS: Cloud, Arquitectura e IA",
  },

  description: {
    it: "Hub AWS per prepararti alle certificazioni più importanti su CertifyQuiz: AWS Cloud Practitioner, AWS Solutions Architect e AWS AI Practitioner. Parti dalle basi cloud, passa all’architettura e poi approfondisci AI e servizi moderni.",
    en: "AWS hub to prepare for the main AWS certifications on CertifyQuiz: AWS Cloud Practitioner, AWS Solutions Architect and AWS AI Practitioner. Start with cloud fundamentals, move into architecture and then explore AI and modern AWS services.",
    fr: "Hub AWS pour préparer les principales certifications AWS sur CertifyQuiz : AWS Cloud Practitioner, AWS Solutions Architect et AWS AI Practitioner. Commencez par les bases du cloud, passez à l’architecture puis explorez l’IA et les services AWS modernes.",
    es: "Hub AWS para preparar las principales certificaciones de AWS en CertifyQuiz: AWS Cloud Practitioner, AWS Solutions Architect y AWS AI Practitioner. Empieza con fundamentos cloud, avanza hacia arquitectura y después explora IA y servicios modernos de AWS.",
  },

  sections: [
    {
      title: {
        it: "AWS Cloud Practitioner",
        en: "AWS Cloud Practitioner",
        fr: "AWS Cloud Practitioner",
        es: "AWS Cloud Practitioner",
      },
      description: {
        it: "Il punto di partenza per AWS: concetti cloud, responsabilità condivisa, billing, servizi principali, sicurezza base e casi d’uso.",
        en: "The starting point for AWS: cloud concepts, shared responsibility, billing, core services, basic security and common use cases.",
        fr: "Le point de départ pour AWS : concepts cloud, responsabilité partagée, facturation, services principaux, sécurité de base et cas d’usage.",
        es: "El punto de partida para AWS: conceptos cloud, responsabilidad compartida, facturación, servicios principales, seguridad básica y casos de uso.",
      },
      hrefByLang: hubHref("aws-cloud"),
    },

    {
      title: {
        it: "AWS Solutions Architect",
        en: "AWS Solutions Architect",
        fr: "AWS Solutions Architect",
        es: "AWS Solutions Architect",
      },
      description: {
        it: "Percorso per imparare a progettare soluzioni AWS: compute, storage, networking, resilienza, IAM, costi e best practice architetturali.",
        en: "Path to learn how to design AWS solutions: compute, storage, networking, resilience, IAM, costs and architectural best practices.",
        fr: "Parcours pour apprendre à concevoir des solutions AWS : compute, stockage, réseau, résilience, IAM, coûts et bonnes pratiques d’architecture.",
        es: "Ruta para aprender a diseñar soluciones AWS: compute, almacenamiento, redes, resiliencia, IAM, costes y buenas prácticas arquitectónicas.",
      },
      hrefByLang: hubHref("aws-architecture"),
    },

    {
      title: {
        it: "AWS AI Practitioner",
        en: "AWS AI Practitioner",
        fr: "AWS AI Practitioner",
        es: "AWS AI Practitioner",
      },
      description: {
        it: "Percorso per comprendere AI, machine learning, generative AI e servizi AWS collegati all’intelligenza artificiale.",
        en: "Path to understand AI, machine learning, generative AI and AWS services related to artificial intelligence.",
        fr: "Parcours pour comprendre l’IA, le machine learning, l’IA générative et les services AWS liés à l’intelligence artificielle.",
        es: "Ruta para comprender IA, machine learning, IA generativa y servicios de AWS relacionados con inteligencia artificial.",
      },
      hrefByLang: hubHref("aws-ai"),
    },

    {
      title: {
        it: "Cloud Roadmap",
        en: "Cloud Roadmap",
        fr: "Roadmap Cloud",
        es: "Roadmap Cloud",
      },
      description: {
        it: "Non sai da dove iniziare? Segui la roadmap Cloud: foundations, AWS, Azure, architettura, Kubernetes e operations.",
        en: "Not sure where to start? Follow the Cloud roadmap: foundations, AWS, Azure, architecture, Kubernetes and operations.",
        fr: "Vous ne savez pas par où commencer ? Suivez la roadmap Cloud : foundations, AWS, Azure, architecture, Kubernetes et operations.",
        es: "¿No sabes por dónde empezar? Sigue la roadmap Cloud: foundations, AWS, Azure, arquitectura, Kubernetes y operations.",
      },
      hrefByLang: (lang: Locale) =>
        lang === "en" ? "/roadmap-cloud" : `/${lang}/roadmap-cloud`,
    },

    {
      title: {
        it: "AWS Security & Operations",
        en: "AWS Security & Operations",
        fr: "AWS Sécurité & Operations",
        es: "AWS Seguridad & Operations",
      },
      description: {
        it: "Area futura per sicurezza, logging, IAM avanzato, monitoring, incident response e gestione operativa su AWS.",
        en: "Future area for security, logging, advanced IAM, monitoring, incident response and AWS operations.",
        fr: "Future zone pour sécurité, logs, IAM avancé, monitoring, réponse à incident et operations AWS.",
        es: "Área futura para seguridad, logs, IAM avanzado, monitoring, respuesta a incidentes y operations en AWS.",
      },
      hrefByLang: hubHref("aws-security"),
    },
  ],
};