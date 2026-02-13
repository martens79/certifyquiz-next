import type { HubData } from "./google-cloud";

export const comptiaCloudHub: HubData = {
  hubKind: "vendorDomain",
  hubSlug: "comptia-cloud",
  vendorKey: "comptia",
  domainKey: "cloud",

  title: {
    it: "CompTIA Cloud: certificazioni e quiz",
    en: "CompTIA Cloud: certifications and quizzes",
    fr: "CompTIA Cloud : certifications et quiz",
    es: "CompTIA Cloud: certificaciones y quizzes",
  },

  description: {
    it: "Percorso cloud CompTIA con Cloud+; pratica con quiz ed esercizi.",
    en: "CompTIA cloud path with Cloud+; practice with quizzes and exercises.",
    fr: "CompTIA cloud avec Cloud+; pratique avec quiz.",
    es: "CompTIA cloud con Cloud+; practica con quizzes.",
  },

  certs: [
    {
      slug: "comptia-cloud-plus",
      badge: "Cloud",
      examCode: "CV0-003",
      popularity: 75,
    },
  ],
};
