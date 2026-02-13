import type { HubData } from "./google-cloud";

export const microsoftAiHub: HubData = {
  hubKind: "vendorDomain",
  hubSlug: "microsoft-ai",
  vendorKey: "microsoft",
  domainKey: "ai",

  title: {
    it: "Microsoft AI: percorsi e quiz",
    en: "Microsoft AI: paths and quizzes",
    fr: "Microsoft IA : parcours et quiz",
    es: "Microsoft IA: rutas y quizzes",
  },

  description: {
    it: "AI Fundamentals e percorsi di intelligenza artificiale Microsoft.",
    en: "AI Fundamentals and Microsoft artificial intelligence paths.",
    fr: "AI Fundamentals et parcours d'intelligence artificielle Microsoft.",
    es: "AI Fundamentals y rutas de inteligencia artificial Microsoft.",
  },

  certs: [
    {
      slug: "microsoft-ai-fundamentals",
      badge: "AI",
      examCode: "AI-900",
      popularity: 75,
    },
  ],
};
