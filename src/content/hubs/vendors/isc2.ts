import type { Locale } from "@/lib/i18n";
import type { HubData } from "../vendor-domains/google-cloud";

const hubHref = (slug: string) => (lang: Locale) =>
  lang === "en" ? `/hub/${slug}` : `/${lang}/hub/${slug}`;

/**
 * ISC2 Vendor Hub (central)
 */
export const isc2VendorHub: HubData = {
  hubKind: "vendor",
  hubSlug: "isc2",
  vendorKey: "isc2",

  title: {
    it: "Certificazioni ISC2: CC, CISSP e cybersecurity",
    en: "ISC2 Certifications: CC, CISSP and cybersecurity",
    fr: "Certifications ISC2 : CC, CISSP et cybersécurité",
    es: "Certificaciones ISC2: CC, CISSP y ciberseguridad",
  },

  description: {
    it: "Hub ISC2 su CertifyQuiz per prepararti alle certificazioni cybersecurity più riconosciute. Parti da ISC2 CC, consolida le basi della sicurezza e scopri il percorso verso CISSP e livelli più avanzati.",
    en: "ISC2 hub on CertifyQuiz to prepare for some of the most recognized cybersecurity certifications. Start from ISC2 CC, strengthen security fundamentals and explore the path toward CISSP and advanced levels.",
    fr: "Hub ISC2 sur CertifyQuiz pour préparer certaines des certifications cybersécurité les plus reconnues. Commencez par ISC2 CC, renforcez les bases sécurité puis découvrez le parcours vers CISSP et les niveaux avancés.",
    es: "Hub ISC2 en CertifyQuiz para preparar algunas de las certificaciones de ciberseguridad más reconocidas. Empieza con ISC2 CC, refuerza fundamentos de seguridad y descubre el camino hacia CISSP y niveles avanzados.",
  },

  sections: [
    {
      title: {
        it: "ISC2 CC",
        en: "ISC2 CC",
        fr: "ISC2 CC",
        es: "ISC2 CC",
      },
      description: {
        it: "Percorso entry-level ISC2 per iniziare con cybersecurity, security principles, access control, network security e risk management.",
        en: "ISC2 entry-level path to start with cybersecurity, security principles, access control, network security and risk management.",
        fr: "Parcours ISC2 débutant pour commencer avec cybersécurité, security principles, access control, network security et risk management.",
        es: "Ruta ISC2 de nivel inicial para empezar con ciberseguridad, security principles, access control, network security y risk management.",
      },
      hrefByLang: hubHref("isc2-security"),
    },

    {
      title: {
        it: "CISSP",
        en: "CISSP",
        fr: "CISSP",
        es: "CISSP",
      },
      description: {
        it: "Percorso avanzato cybersecurity focalizzato su governance, risk management, architecture, operations e security engineering.",
        en: "Advanced cybersecurity path focused on governance, risk management, architecture, operations and security engineering.",
        fr: "Parcours cybersécurité avancé focalisé sur gouvernance, risk management, architecture, operations et security engineering.",
        es: "Ruta avanzada de ciberseguridad enfocada en governance, risk management, architecture, operations y security engineering.",
      },
      hrefByLang: hubHref("isc2-security"),
    },

    {
      title: {
        it: "Cybersecurity Roadmap",
        en: "Cybersecurity Roadmap",
        fr: "Roadmap Cybersécurité",
        es: "Roadmap Ciberseguridad",
      },
      description: {
        it: "Segui la roadmap Cybersecurity: foundations, ISC2 CC, Security+, CEH e certificazioni avanzate.",
        en: "Follow the Cybersecurity roadmap: foundations, ISC2 CC, Security+, CEH and advanced certifications.",
        fr: "Suivez la roadmap Cybersécurité : foundations, ISC2 CC, Security+, CEH et certifications avancées.",
        es: "Sigue la roadmap Ciberseguridad: foundations, ISC2 CC, Security+, CEH y certificaciones avanzadas.",
      },
      hrefByLang: (lang: Locale) =>
        lang === "en"
          ? "/roadmap-cybersecurity"
          : `/${lang}/roadmap-cybersecurity`,
    },

    {
      title: {
        it: "Security Foundations",
        en: "Security Foundations",
        fr: "Security Foundations",
        es: "Security Foundations",
      },
      description: {
        it: "Se parti da zero, rafforza prima le basi con networking, security concepts e fundamentals.",
        en: "If you are starting from zero, first strengthen your foundations with networking, security concepts and fundamentals.",
        fr: "Si vous débutez, commencez par renforcer les foundations avec networking, security concepts et fundamentals.",
        es: "Si empiezas desde cero, primero refuerza foundations con networking, security concepts y fundamentals.",
      },
      hrefByLang: (lang: Locale) =>
        lang === "en"
          ? "/roadmap-fundamentals"
          : `/${lang}/roadmap-fundamentals`,
    },
  ],
};