// src/content/hubs/vendor-domains/google-ai.ts
import type { HubData } from "./google-cloud";

export const googleAiHub: HubData = {
  hubKind: "vendorDomain",
  hubSlug: "google-ai",
  vendorKey: "google",
  domainKey: "ai",

  title: {
    it: "Google AI & Data",
    en: "Google AI & Data",
    fr: "Google IA & Data",
    es: "Google IA & Datos",
  },

  description: {
    it: "Percorso dedicato ad AI e dati nell’ecosistema Google. Contenuti e quiz in arrivo.",
    en: "A path focused on AI and data in the Google ecosystem. Content and quizzes coming soon.",
    fr: "Parcours dédié à l’IA et à la data dans l’écosystème Google. Contenus et quiz bientôt.",
    es: "Ruta centrada en IA y datos en el ecosistema Google. Contenidos y quizzes próximamente.",
  },

  // ✅ richiesto dal tuo tipo HubData
  certs: [],
};
