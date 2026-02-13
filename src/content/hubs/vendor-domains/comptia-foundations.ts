import type { HubData } from "./google-cloud";

export const comptiaFoundationsHub: HubData = {
  hubKind: "vendorDomain",
  hubSlug: "comptia-foundations",
  vendorKey: "comptia",
  domainKey: "foundations",

  title: {
    it: "CompTIA Foundations: ITF+ e A+",
    en: "CompTIA Foundations: ITF+ and A+",
    fr: "CompTIA Fondations : ITF+ et A+",
    es: "CompTIA Fundamentos: ITF+ y A+",
  },

  description: {
    it: "Percorso CompTIA di base con ITF+ e A+; allenati con quiz ed esercizi.",
    en: "CompTIA basic path with ITF+ and A+; train with quizzes and exercises.",
    fr: "Parcours CompTIA de base avec ITF+ et A+; entraînez-vous avec quiz.",
    es: "Ruta básica CompTIA con ITF+ y A+; practica con quizzes.",
  },

  certs: [
    {
      slug: "comptia-itf-plus",
      badge: "Foundations",
      examCode: "FC0-U61",
      popularity: 60,
    },
    {
      slug: "comptia-a-plus",
      badge: "Core",
      examCode: "220-1101 / 220-1102",
      popularity: 95,
    },
  ],
};
