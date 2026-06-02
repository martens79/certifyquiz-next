import type { HubData } from "./google-cloud";

export const awsAiHub: HubData = {
  hubKind: "vendorDomain",
  hubSlug: "aws-ai",
  vendorKey: "aws",
  domainKey: "ai",
  title: {
    it: "AWS AI: certificazioni e quiz",
    en: "AWS AI: certifications and quizzes",
    fr: "AWS AI : certifications et quiz",
    es: "AWS AI: certificaciones y quizzes",
  },
  description: {
    it: "Percorso AWS AI: fondamenti di intelligenza artificiale, machine learning, servizi AI generativa e pratica con quiz in stile esame. Contenuti in crescita.",
    en: "AWS AI path: artificial intelligence fundamentals, machine learning, generative AI services, and exam-style quiz practice. Growing content.",
    fr: "Parcours AWS AI : fondamentaux de l’intelligence artificielle, machine learning, services d’IA générative et entraînement via quiz type examen. Contenu en croissance.",
    es: "Ruta AWS AI: fundamentos de inteligencia artificial, machine learning, servicios de IA generativa y práctica con quizzes estilo examen. Contenido en crecimiento.",
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
      popularity: 88,
    },
    {
      slug: "ai-foundations",
      badge: "Foundations",
      examCode: "CertifyQuiz",
      popularity: 85,
    },
    {
      slug: "microsoft-ai",
      badge: "AI Fundamentals",
      examCode: "AI-900",
      popularity: 82,
    },
  ],
};
