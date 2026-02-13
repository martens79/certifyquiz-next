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
    it: "Allenati per la certificazione IBM Cloud V5 con quiz e pratica.",
    en: "Train for IBM Cloud V5 certification with quizzes and practice.",
    fr: "Entraînez-vous pour la certification IBM Cloud V5 avec des quiz.",
    es: "Practica para la certificación IBM Cloud V5 con quizzes.",
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
