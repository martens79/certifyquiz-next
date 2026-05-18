import type { Locale } from "@/lib/i18n";
import type { HubData } from "../vendor-domains/google-cloud";

const hubHref = (slug: string) => (lang: Locale) =>
  lang === "en" ? `/hub/${slug}` : `/${lang}/hub/${slug}`;

export const comptiaVendorHub: HubData = {
  hubKind: "vendor",
  hubSlug: "comptia",
  vendorKey: "comptia",

  title: {
    it: "Certificazioni CompTIA: ITF+, A+, Network+, Security+ e Cloud+",
    en: "CompTIA Certifications: ITF+, A+, Network+, Security+ and Cloud+",
    fr: "Certifications CompTIA : ITF+, A+, Network+, Security+ et Cloud+",
    es: "Certificaciones CompTIA: ITF+, A+, Network+, Security+ y Cloud+",
  },

  description: {
    it: "Hub CompTIA su CertifyQuiz per prepararti alle certificazioni più importanti: IT Fundamentals, A+, Network+, Security+ e Cloud+. Parti dalle basi IT e costruisci competenze reali in networking, cybersecurity e cloud.",
    en: "CompTIA hub on CertifyQuiz to prepare for the main certifications: IT Fundamentals, A+, Network+, Security+ and Cloud+. Start from IT basics and build real networking, cybersecurity and cloud skills.",
    fr: "Hub CompTIA sur CertifyQuiz pour préparer les principales certifications : IT Fundamentals, A+, Network+, Security+ et Cloud+. Commencez par les bases IT et développez de vraies compétences en réseau, cybersécurité et cloud.",
    es: "Hub CompTIA en CertifyQuiz para preparar las principales certificaciones: IT Fundamentals, A+, Network+, Security+ y Cloud+. Empieza desde las bases IT y desarrolla habilidades reales en redes, ciberseguridad y cloud.",
  },

  sections: [
    {
      title: {
        it: "CompTIA ITF+",
        en: "CompTIA ITF+",
        fr: "CompTIA ITF+",
        es: "CompTIA ITF+",
      },
      description: {
        it: "Il punto di partenza ideale per iniziare nel mondo IT: hardware, software, reti, sicurezza base e concetti fondamentali.",
        en: "The ideal starting point for entering IT: hardware, software, networking, basic security and core concepts.",
        fr: "Le point de départ idéal pour entrer dans l’IT : hardware, software, réseau, sécurité de base et concepts fondamentaux.",
        es: "El punto de partida ideal para entrar en IT: hardware, software, redes, seguridad básica y conceptos fundamentales.",
      },
      hrefByLang: hubHref("comptia-foundations"),
    },

    {
      title: {
        it: "CompTIA A+",
        en: "CompTIA A+",
        fr: "CompTIA A+",
        es: "CompTIA A+",
      },
      description: {
        it: "Supporto tecnico, troubleshooting, sistemi operativi, dispositivi, sicurezza base e competenze help desk.",
        en: "Technical support, troubleshooting, operating systems, devices, basic security and help desk skills.",
        fr: "Support technique, troubleshooting, systèmes d’exploitation, appareils, sécurité de base et compétences help desk.",
        es: "Soporte técnico, troubleshooting, sistemas operativos, dispositivos, seguridad básica y habilidades help desk.",
      },
      hrefByLang: hubHref("comptia-foundations"),
    },

    {
      title: {
        it: "CompTIA Network+",
        en: "CompTIA Network+",
        fr: "CompTIA Network+",
        es: "CompTIA Network+",
      },
      description: {
        it: "Networking, protocolli, subnetting, troubleshooting, infrastrutture e concetti fondamentali di rete.",
        en: "Networking, protocols, subnetting, troubleshooting, infrastructure and core networking concepts.",
        fr: "Réseaux, protocoles, subnetting, troubleshooting, infrastructure et concepts fondamentaux réseau.",
        es: "Redes, protocolos, subnetting, troubleshooting, infraestructura y conceptos fundamentales de networking.",
      },
      hrefByLang: hubHref("comptia-networking"),
    },

    {
      title: {
        it: "CompTIA Security+",
        en: "CompTIA Security+",
        fr: "CompTIA Security+",
        es: "CompTIA Security+",
      },
      description: {
        it: "Cybersecurity, gestione del rischio, identity management, attacchi, difesa e security operations.",
        en: "Cybersecurity, risk management, identity management, attacks, defense and security operations.",
        fr: "Cybersécurité, gestion du risque, identity management, attaques, défense et security operations.",
        es: "Ciberseguridad, gestión de riesgos, identity management, ataques, defensa y security operations.",
      },
      hrefByLang: hubHref("comptia-security"),
    },

    {
      title: {
        it: "CompTIA Cloud+",
        en: "CompTIA Cloud+",
        fr: "CompTIA Cloud+",
        es: "CompTIA Cloud+",
      },
      description: {
        it: "Virtualizzazione, cloud infrastructure, deployment, monitoring, automazione e operations cloud.",
        en: "Virtualization, cloud infrastructure, deployment, monitoring, automation and cloud operations.",
        fr: "Virtualisation, infrastructure cloud, déploiement, monitoring, automatisation et cloud operations.",
        es: "Virtualización, infraestructura cloud, deployment, monitoring, automatización y cloud operations.",
      },
      hrefByLang: hubHref("comptia-cloud"),
    },

    {
      title: {
        it: "Networking Roadmap",
        en: "Networking Roadmap",
        fr: "Roadmap Réseaux",
        es: "Roadmap Redes",
      },
      description: {
        it: "Segui il percorso networking: foundations, Network+, CCST e CCNA.",
        en: "Follow the networking path: foundations, Network+, CCST and CCNA.",
        fr: "Suivez le parcours réseau : foundations, Network+, CCST et CCNA.",
        es: "Sigue la ruta de redes: foundations, Network+, CCST y CCNA.",
      },
      hrefByLang: (lang: Locale) =>
        lang === "en" ? "/roadmap-networking" : `/${lang}/roadmap-networking`,
    },

    {
      title: {
        it: "Cybersecurity Roadmap",
        en: "Cybersecurity Roadmap",
        fr: "Roadmap Cybersécurité",
        es: "Roadmap Ciberseguridad",
      },
      description: {
        it: "Percorso completo cybersecurity: basi, Security+, ISC2 CC, CEH e certificazioni avanzate.",
        en: "Complete cybersecurity path: basics, Security+, ISC2 CC, CEH and advanced certifications.",
        fr: "Parcours cybersécurité complet : bases, Security+, ISC2 CC, CEH et certifications avancées.",
        es: "Ruta completa de ciberseguridad: bases, Security+, ISC2 CC, CEH y certificaciones avanzadas.",
      },
      hrefByLang: (lang: Locale) =>
        lang === "en"
          ? "/roadmap-cybersecurity"
          : `/${lang}/roadmap-cybersecurity`,
    },
  ],
};