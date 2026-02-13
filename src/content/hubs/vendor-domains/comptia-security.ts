import type { HubData } from "./google-cloud";

export const comptiaSecurityHub: HubData = {
  hubKind: "vendorDomain",
  hubSlug: "comptia-security",
  vendorKey: "comptia",
  domainKey: "security",

  title: {
    it: "CompTIA Security: certificazioni e quiz",
    en: "CompTIA Security: certifications and quizzes",
    fr: "CompTIA Sécurité : certifications et quiz",
    es: "CompTIA Seguridad: certificaciones y quizzes",
  },

  description: {
    it: "Percorso di sicurezza CompTIA con Security+; pratica con quiz ed esercizi.",
    en: "CompTIA security path with Security+; practice with quizzes and exercises.",
    fr: "Parcours CompTIA sécurité avec Security+; pratique avec quiz.",
    es: "Ruta CompTIA seguridad con Security+; practica con quizzes.",
  },

  certs: [
    {
      slug: "security-plus",
      badge: "Security",
      examCode: "SY0-701",
      popularity: 92,
    },
  ],
};
