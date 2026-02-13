import type { HubData } from "./google-cloud";

export const microsoftAzureHub: HubData = {
  hubKind: "vendorDomain",
  hubSlug: "microsoft-azure",
  vendorKey: "microsoft",
  domainKey: "cloud",
  title: {
    it: "Microsoft Azure: certificazioni e quiz",
    en: "Microsoft Azure: certifications and quizzes",
    fr: "Microsoft Azure : certifications et quiz",
    es: "Microsoft Azure: certificaciones y quizzes",
  },
  description: {
    it: "Percorsi Azure: fundamentals, servizi core, governance e pratica d’esame con quiz. Contenuti in crescita.",
    en: "Azure paths: fundamentals, core services, governance and exam-style quiz practice. Growing content.",
    fr: "Parcours Azure : fondamentaux, services clés, gouvernance et entraînement via quiz. Contenu en croissance.",
    es: "Rutas Azure: fundamentos, servicios clave, gobernanza y práctica con quizzes. Contenido en crecimiento.",
  },
  certs: [
    {
      slug: "microsoft-azure-fundamentals",
      badge: "Foundational",
      examCode: "AZ-900",
      popularity: 90,
    },
    {
  slug: "microsoft-virtualization",
  badge: "Infrastructure",
  examCode: "Virtualization",
  popularity: 60,
},

  ],
};
