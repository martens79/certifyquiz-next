import type { HubData } from "./google-cloud";

export const ciscoCcsTHub: HubData = {
  hubKind: "vendorDomain",
  hubSlug: "cisco-ccst",
  vendorKey: "cisco",
  domainKey: "entry",

  title: {
    it: "Cisco CCST: percorsi e quiz",
    en: "Cisco CCST: paths and quizzes",
    fr: "Cisco CCST : parcours et quiz",
    es: "Cisco CCST: rutas y quizzes",
  },

  description: {
    it: "Percorsi entry-level Cisco (Networking e Cybersecurity): allenati con quiz in stile esame e spiegazioni dettagliate. Contenuti in crescita.",
    en: "Cisco entry-level paths (Networking and Cybersecurity): train with exam-style quizzes and detailed explanations. Growing content.",
    fr: "Parcours Cisco débutant (Réseau et Cybersécurité) : entraînez-vous avec des quiz type examen et des explications détaillées. Contenu en croissance.",
    es: "Rutas Cisco de nivel inicial (Redes y Ciberseguridad): practica con quizzes estilo examen y explicaciones detalladas. Contenido en crecimiento.",
  },

  certs: [
    {
      slug: "cisco-ccst-networking",
      badge: "Entry",
      examCode: "CCST Networking",
      popularity: 70,
    },
    {
      slug: "cisco-ccst-cybersecurity",
      badge: "Entry",
      examCode: "CCST Cybersecurity",
      popularity: 68,
    },
  ],
};
