// src/content/hubs/vendor-domains/google-education.ts
import type { HubData } from "./google-cloud";

export const googleEducationHub: HubData = {
  hubKind: "vendorDomain",
  hubSlug: "google-education",
  vendorKey: "google",
  domainKey: "education",

  title: {
    it: "Google for Education",
    en: "Google for Education",
    fr: "Google for Education",
    es: "Google for Education",
  },

  description: {
    it: "Percorsi per docenti e scuole (Educator, Trainer, Coach). Contenuti e quiz in arrivo.",
    en: "Education paths (Educator, Trainer, Coach). Content and quizzes coming soon.",
    fr: "Parcours éducation (Educator, Trainer, Coach). Contenus et quiz bientôt.",
    es: "Rutas de educación (Educator, Trainer, Coach). Contenidos y quizzes próximamente.",
  },

  certs: [],
};
