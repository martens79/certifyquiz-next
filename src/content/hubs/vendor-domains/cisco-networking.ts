import type { HubData } from "./google-cloud";

export const ciscoNetworkingHub: HubData = {
  hubKind: "vendorDomain",
  hubSlug: "cisco-networking",
  vendorKey: "cisco",
  domainKey: "networking",
  title: {
    it: "Cisco Networking: CCNA e quiz",
    en: "Cisco Networking: CCNA and quizzes",
    fr: "Cisco Réseau : CCNA et quiz",
    es: "Cisco Redes: CCNA y quizzes",
  },
  description: {
    it: "Routing, switching, IP services e security basics: allenati con quiz in stile CCNA. Contenuti in crescita.",
    en: "Routing, switching, IP services and security basics: train with CCNA-style quizzes. Growing content.",
    fr: "Routage, switching, services IP et bases sécurité : entraînez-vous avec des quiz type CCNA. Contenu en croissance.",
    es: "Routing, switching, servicios IP y bases de seguridad: practica con quizzes estilo CCNA. Contenido en crecimiento.",
  },
  certs: [
    {
      slug: "ccna",
      badge: "Associate",
      examCode: "200-301",
      popularity: 95,
    },
  ],
};
