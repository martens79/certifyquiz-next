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
    it: "Certificazioni AWS: percorsi, quiz e pratica d’esame",
    en: "AWS Certifications: paths, quizzes and exam practice",
    fr: "Certifications AWS : parcours, quiz et entraînement",
    es: "Certificaciones de AWS: rutas, quizzes y práctica",
  },

  description: {
    it: "Hub centrale per prepararti alle certificazioni AWS: scegli un percorso (Cloud Foundations, Architecting, DevOps, Security, Data) e vai ai quiz. Contenuti in crescita e organizzati per area.",
    en: "Central hub to prepare for AWS certifications: pick a path (Cloud Foundations, Architecting, DevOps, Security, Data) and jump to quizzes. Growing content, organized by domain.",
    fr: "Hub central pour préparer les certifications AWS : choisissez un parcours (Fondations Cloud, Architecture, DevOps, Sécurité, Data) et accédez aux quiz. Contenu en croissance, organisé par domaine.",
    es: "Hub central para preparar certificaciones de AWS: elige una ruta (Fundamentos Cloud, Arquitectura, DevOps, Seguridad, Datos) y ve a los quizzes. Contenido en crecimiento, organizado por área.",
  },

  sections: [
    {
      title: { it: "AWS Cloud (Foundational)", en: "AWS Cloud (Foundational)", fr: "AWS Cloud (Débutant)", es: "AWS Cloud (Fundacional)" },
      description: {
        it: "Percorso per iniziare: concetti cloud, billing, sicurezza base e servizi principali. Ideale per Cloud Practitioner.",
        en: "Start here: cloud concepts, billing, core security and main services. Great for Cloud Practitioner.",
        fr: "Commencez ici : concepts cloud, facturation, sécurité de base et services principaux. Idéal pour Cloud Practitioner.",
        es: "Empieza aquí: conceptos cloud, facturación, seguridad base y servicios principales. Ideal para Cloud Practitioner.",
      },
      hrefByLang: hubHref("aws-cloud"),
    },

    {
      title: { it: "Architecture (Architect)", en: "Architecture (Architect)", fr: "Architecture (Architect)", es: "Arquitectura (Architect)" },
      description: {
        it: "Progettazione di soluzioni su AWS: networking, storage, resilienza e best practice (in arrivo).",
        en: "Design solutions on AWS: networking, storage, resilience and best practices (coming soon).",
        fr: "Concevoir des solutions sur AWS : réseau, stockage, résilience et bonnes pratiques (bientôt).",
        es: "Diseñar soluciones en AWS: redes, almacenamiento, resiliencia y buenas prácticas (próximamente).",
      },
      hrefByLang: hubHref("aws-architecture"),
    },

    {
      title: { it: "DevOps", en: "DevOps", fr: "DevOps", es: "DevOps" },
      description: {
        it: "CI/CD, automazione, osservabilità e operations su AWS (in arrivo).",
        en: "CI/CD, automation, observability and operations on AWS (coming soon).",
        fr: "CI/CD, automatisation, observabilité et opérations sur AWS (bientôt).",
        es: "CI/CD, automatización, observabilidad y operaciones en AWS (próximamente).",
      },
      hrefByLang: hubHref("aws-devops"),
    },

    {
      title: { it: "Security", en: "Security", fr: "Sécurité", es: "Seguridad" },
      description: {
        it: "Identity, logging, incident response e best practice security su AWS (in arrivo).",
        en: "Identity, logging, incident response and AWS security best practices (coming soon).",
        fr: "Identité, logs, réponse à incident et bonnes pratiques sécurité AWS (bientôt).",
        es: "Identidad, logs, respuesta a incidentes y buenas prácticas de seguridad en AWS (próximamente).",
      },
      hrefByLang: hubHref("aws-security"),
    },

    {
      title: { it: "Data & Analytics", en: "Data & Analytics", fr: "Data & Analytics", es: "Datos y Analítica" },
      description: {
        it: "Servizi dati (database, lake, analytics) e casi d’uso (in arrivo).",
        en: "Data services (databases, lakes, analytics) and use cases (coming soon).",
        fr: "Services data (bases de données, data lake, analytics) et cas d’usage (bientôt).",
        es: "Servicios de datos (bases de datos, data lake, analítica) y casos de uso (próximamente).",
      },
      hrefByLang: hubHref("aws-data"),
    },
  ],
};
