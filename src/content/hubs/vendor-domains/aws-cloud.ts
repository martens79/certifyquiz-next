import type { HubData } from "./google-cloud";

export const awsCloudHub: HubData = {
  hubKind: "vendorDomain",
  hubSlug: "aws-cloud",
  vendorKey: "aws",
  domainKey: "cloud",
  title: {
    it: "AWS Cloud: certificazioni e quiz",
    en: "AWS Cloud: certifications and quizzes",
    fr: "AWS Cloud : certifications et quiz",
    es: "AWS Cloud: certificaciones y quizzes",
  },
  description: {
    it: "Percorso AWS Cloud: fondamentali, AI generativa e servizi core, con pratica su quiz in stile esame. Contenuti in crescita.",
    en: "AWS Cloud path: fundamentals, generative AI and core services, with exam-style quiz practice. Growing content.",
    fr: "Parcours AWS Cloud : fondamentaux, IA générative et services clés, avec entraînement via quiz type examen. Contenu en croissance.",
    es: "Ruta AWS Cloud: fundamentos, IA generativa y servicios clave, con práctica con quizzes estilo examen. Contenido en crecimiento.",
  },
  certs: [
    {
      slug: "aws-cloud-practitioner",
      badge: "Foundational",
      examCode: "CLF-C02",
      popularity: 95,
    },
    {
      slug: "aws-solutions-architect",
      badge: "Associate",
      examCode: "SAA-C03",
      popularity: 92,
    },
    {
      slug: "aws-ai-practitioner",
      badge: "Foundational",
      examCode: "AIF-C01",
      popularity: 90,
    },
  ],
};
