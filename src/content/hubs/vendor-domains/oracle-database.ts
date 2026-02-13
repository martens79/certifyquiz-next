import type { HubData } from "./google-cloud";

export const oracleDatabaseHub: HubData = {
  hubKind: "vendorDomain",
  hubSlug: "oracle-database",
  vendorKey: "oracle",
  domainKey: "database",

  title: {
    it: "Oracle Database: certificazioni e quiz",
    en: "Oracle Database: certifications and quizzes",
    fr: "Oracle Database : certifications et quiz",
    es: "Oracle Database: certificaciones y quizzes",
  },

  description: {
    it: "Allenati per la certificazione Oracle Database SQL con quiz e pratica.",
    en: "Train for Oracle Database SQL certification with quizzes and practice.",
    fr: "Entraînez-vous pour la certification Oracle Database SQL avec des quiz.",
    es: "Practica para la certificación Oracle Database SQL con quizzes.",
  },

  certs: [
    {
      slug: "oracle-database-sql",
      badge: "Associate",
      examCode: "Oracle Database SQL",
      popularity: 75,
    },
  ],
};
