import type { HubData } from "./google-cloud";

export const comptiaNetworkingHub: HubData = {
  hubKind: "vendorDomain",
  hubSlug: "comptia-networking",
  vendorKey: "comptia",
  domainKey: "networking",

  title: {
    it: "CompTIA Networking: certificazioni e quiz",
    en: "CompTIA Networking: certifications and quizzes",
    fr: "CompTIA Réseau : certifications et quiz",
    es: "CompTIA Redes: certificaciones y quizzes",
  },

  description: {
    it: "Percorso di rete CompTIA con Network+; pratica con quiz ed esercizi.",
    en: "CompTIA networking path with Network+; practice with quizzes and exercises.",
    fr: "CompTIA réseau avec Network+; pratique avec quiz.",
    es: "CompTIA redes con Network+; practica con quizzes.",
  },

  certs: [
    {
      slug: "network-plus",
      badge: "Networking",
      examCode: "N10-008",
      popularity: 90,
    },
  ],
};
