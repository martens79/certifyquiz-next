// src/content/hubs/vendor-domains/google-career.ts
import type { HubData } from "./google-cloud";

export const googleCareerHub: HubData = {
  hubKind: "vendorDomain",
  hubSlug: "google-career",
  vendorKey: "google",
  domainKey: "career",

  title: {
    it: "Google Career Certificates",
    en: "Google Career Certificates",
    fr: "Google Career Certificates",
    es: "Google Career Certificates",
  },

  description: {
    it: "Certificati professionali Google (IT, Data, Project, Cybersecurity…). Quiz e percorsi in arrivo.",
    en: "Google Professional Certificates (IT, Data, Project, Cybersecurity…). Quizzes and paths coming soon.",
    fr: "Certificats professionnels Google (IT, Data, Project, Cybersécurité…). Quiz et parcours bientôt.",
    es: "Certificados profesionales de Google (TI, Datos, Project, Ciberseguridad…). Quizzes y rutas próximamente.",
  },

  certs: [],
};
