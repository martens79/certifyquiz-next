import type { HubData } from "./google-cloud";

export const ibmCloudHub: HubData = {
  hubKind: "vendorDomain",
  hubSlug: "ibm-cloud",
  vendorKey: "ibm",
  domainKey: "cloud",

  title: {
    it: "IBM Cloud: certificazioni e quiz",
    en: "IBM Cloud: certifications and quizzes",
    fr: "IBM Cloud : certifications et quiz",
    es: "IBM Cloud: certificaciones y quizzes",
  },

  description: {
    it: "Archivio didattico IBM Cloud V5: la certificazione è ritirata, ma i quiz restano disponibili per ripassare i concetti.",
    en: "IBM Cloud V5 learning archive: the certification is retired, while the quizzes remain available for concept review.",
    fr: "Archive pédagogique IBM Cloud V5 : la certification est retirée, mais les quiz restent disponibles pour réviser les concepts.",
    es: "Archivo educativo IBM Cloud V5: la certificación está retirada, pero los cuestionarios siguen disponibles para repasar conceptos.",
  },

  certs: [
    {
      slug: "ibm-cloud-v5",
      badge: "Associate",
      examCode: "IBM Cloud V5",
      popularity: 70,
    },
  ],
};
