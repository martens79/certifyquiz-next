import type { HubData } from "./google-cloud";

export const awsCloudHub: HubData = {
  hubKind: "vendorDomain",
  hubSlug: "aws-cloud",
  vendorKey: "aws",
  domainKey: "cloud",
  title: {
    it: "AWS Cloud: certificazioni e quiz",
    en: "AWS Cloud: certifications and quizzes",
    fr: "AWS Cloud : certifications et quiz",
    es: "AWS Cloud: certificaciones y quizzes",
  },
  description: {
    it: "Percorso AWS Cloud: fondamentali, servizi core e pratica con quiz in stile esame. Contenuti in crescita.",
    en: "AWS Cloud path: fundamentals, core services and exam-style quiz practice. Growing content.",
    fr: "Parcours AWS Cloud : fondamentaux, services clés et entraînement via quiz type examen. Contenu en croissance.",
    es: "Ruta AWS Cloud: fundamentos, servicios clave y práctica con quizzes estilo examen. Contenido en crecimiento.",
  },
  certs: [],
};
