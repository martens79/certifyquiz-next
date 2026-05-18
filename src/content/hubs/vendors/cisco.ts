import type { Locale } from "@/lib/i18n";
import type { HubData } from "../vendor-domains/google-cloud";

const hubHref = (slug: string) => (lang: Locale) =>
  lang === "en" ? `/hub/${slug}` : `/${lang}/hub/${slug}`;

/**
 * Cisco Vendor Hub (central)
 */
export const ciscoVendorHub: HubData = {
  hubKind: "vendor",
  hubSlug: "cisco",
  vendorKey: "cisco",

  title: {
    it: "Certificazioni Cisco: CCNA, CCST Networking e Cybersecurity",
    en: "Cisco Certifications: CCNA, CCST Networking and Cybersecurity",
    fr: "Certifications Cisco : CCNA, CCST Networking et Cybersecurity",
    es: "Certificaciones Cisco: CCNA, CCST Networking y Cybersecurity",
  },

  description: {
    it: "Hub Cisco per prepararti alle certificazioni più importanti su CertifyQuiz: CCNA, Cisco CCST Networking e Cisco CCST Cybersecurity. Parti dalle basi di rete, consolida routing e switching, poi esplora i fondamenti della sicurezza.",
    en: "Cisco hub to prepare for the main Cisco certifications on CertifyQuiz: CCNA, Cisco CCST Networking and Cisco CCST Cybersecurity. Start with networking basics, strengthen routing and switching, then explore security fundamentals.",
    fr: "Hub Cisco pour préparer les principales certifications Cisco sur CertifyQuiz : CCNA, Cisco CCST Networking et Cisco CCST Cybersecurity. Commencez par les bases réseau, renforcez routing et switching, puis explorez les fondamentaux de la sécurité.",
    es: "Hub Cisco para preparar las principales certificaciones Cisco en CertifyQuiz: CCNA, Cisco CCST Networking y Cisco CCST Cybersecurity. Empieza con fundamentos de redes, refuerza routing y switching y después explora fundamentos de seguridad.",
  },

  sections: [
    {
      title: {
        it: "Cisco CCST Networking",
        en: "Cisco CCST Networking",
        fr: "Cisco CCST Networking",
        es: "Cisco CCST Networking",
      },
      description: {
        it: "Percorso entry-level Cisco per iniziare con reti, indirizzamento IP, dispositivi, protocolli, troubleshooting e basi operative.",
        en: "Cisco entry-level path to start with networking, IP addressing, devices, protocols, troubleshooting and operational basics.",
        fr: "Parcours Cisco débutant pour commencer avec les réseaux, l’adressage IP, les équipements, les protocoles, le troubleshooting et les bases opérationnelles.",
        es: "Ruta Cisco de nivel inicial para empezar con redes, direccionamiento IP, dispositivos, protocolos, troubleshooting y bases operativas.",
      },
      hrefByLang: hubHref("cisco-ccst-networking"),
    },

    {
      title: {
        it: "CCNA",
        en: "CCNA",
        fr: "CCNA",
        es: "CCNA",
      },
      description: {
        it: "La certificazione Cisco più importante per consolidare networking, routing, switching, IP services, security basics, automation e troubleshooting.",
        en: "Cisco’s key certification to strengthen networking, routing, switching, IP services, security basics, automation and troubleshooting.",
        fr: "La certification Cisco clé pour renforcer réseaux, routing, switching, services IP, bases sécurité, automatisation et troubleshooting.",
        es: "La certificación Cisco clave para reforzar redes, routing, switching, servicios IP, bases de seguridad, automatización y troubleshooting.",
      },
      hrefByLang: hubHref("cisco-networking"),
    },

    {
      title: {
        it: "Cisco CCST Cybersecurity",
        en: "Cisco CCST Cybersecurity",
        fr: "Cisco CCST Cybersecurity",
        es: "Cisco CCST Cybersecurity",
      },
      description: {
        it: "Percorso entry-level per comprendere minacce, sicurezza di rete, access control, vulnerabilità, difesa e concetti cyber fondamentali.",
        en: "Entry-level path to understand threats, network security, access control, vulnerabilities, defense and core cybersecurity concepts.",
        fr: "Parcours débutant pour comprendre menaces, sécurité réseau, contrôle d’accès, vulnérabilités, défense et concepts fondamentaux cyber.",
        es: "Ruta de nivel inicial para comprender amenazas, seguridad de red, control de acceso, vulnerabilidades, defensa y conceptos cyber fundamentales.",
      },
      hrefByLang: hubHref("cisco-ccst-cybersecurity"),
    },

    {
      title: {
        it: "Networking Roadmap",
        en: "Networking Roadmap",
        fr: "Roadmap Réseaux",
        es: "Roadmap Redes",
      },
      description: {
        it: "Non sai da dove iniziare? Segui la roadmap Networking: foundations, CCST, Network+, CCNA e troubleshooting.",
        en: "Not sure where to start? Follow the Networking roadmap: foundations, CCST, Network+, CCNA and troubleshooting.",
        fr: "Vous ne savez pas par où commencer ? Suivez la roadmap Réseaux : foundations, CCST, Network+, CCNA et troubleshooting.",
        es: "¿No sabes por dónde empezar? Sigue la roadmap Redes: foundations, CCST, Network+, CCNA y troubleshooting.",
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
        it: "Se il tuo obiettivo è la sicurezza, parti dalla roadmap Cybersecurity: basi, ISC2 CC, Security+, CCST Cybersecurity e CEH.",
        en: "If your goal is security, start from the Cybersecurity roadmap: basics, ISC2 CC, Security+, CCST Cybersecurity and CEH.",
        fr: "Si votre objectif est la sécurité, commencez par la roadmap Cybersécurité : bases, ISC2 CC, Security+, CCST Cybersecurity et CEH.",
        es: "Si tu objetivo es seguridad, empieza con la roadmap Ciberseguridad: bases, ISC2 CC, Security+, CCST Cybersecurity y CEH.",
      },
      hrefByLang: (lang: Locale) =>
        lang === "en"
          ? "/roadmap-cybersecurity"
          : `/${lang}/roadmap-cybersecurity`,
    },
  ],
};