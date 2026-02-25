import type { HubData } from "./google-cloud";

export const isc2SecurityHub: HubData = {
  hubKind: "vendorDomain",
  hubSlug: "isc2-security",
  vendorKey: "isc2",
  domainKey: "security",

  title: {
    it: "ISC2 Security: certificazioni e quiz",
    en: "ISC2 Security: certifications and quizzes",
    fr: "ISC2 Sécurité : certifications et quiz",
    es: "ISC2 Seguridad: certificaciones y quizzes",
  },

  description: {
    it: "Percorso ISC2: parti da CC e sali fino a CISSP. Allenati con quiz in stile esame e spiegazioni chiare.",
    en: "ISC2 path: start with CC and level up to CISSP. Practice with exam-style quizzes and clear explanations.",
    fr: "Parcours ISC2 : commencez par CC puis montez vers CISSP. Entraînez-vous avec des quiz type examen.",
    es: "Ruta ISC2: empieza con CC y sube hasta CISSP. Practica con quizzes estilo examen y explicaciones claras.",
  },

  certs: [
    {
      slug: "isc2-cc",
      badge: "Entry",
      examCode: "CC",
      popularity: 80,
    },
    {
      slug: "cissp",
      badge: "Advanced",
      examCode: "CISSP",
      popularity: 95,
    },
  ],
};