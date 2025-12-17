// src/certifications/data/cissp.ts
// Data-only consumabile da CertificationPage (server). Nessun JSX/Router.

const CISSP = {
  slug: "cissp",
  imageUrl: "/images/certifications/cissp.png", // metti l’icona in /public/images/certifications/cissp.png
  officialUrl: "https://www.isc2.org/certifications/cissp",

  title: {
    it: "CISSP - Certified Information Systems Security Professional",
    en: "CISSP - Certified Information Systems Security Professional",
    fr: "CISSP - Professionnel Certifié en Sécurité des Systèmes d'Information",
    es: "CISSP - Profesional Certificado en Seguridad de Sistemas de Información",
  },
  level: { it: "Avanzato", en: "Advanced", fr: "Avancé", es: "Avanzado" },
  description: {
    it: "La certificazione CISSP attesta competenze avanzate nella gestione e protezione delle informazioni; è uno standard globale per i professionisti della sicurezza.",
    en: "The CISSP certification validates advanced skills in information security management and is a global standard for cybersecurity professionals.",
    fr: "La certification CISSP valide des compétences avancées en gestion de la sécurité de l'information et constitue une référence mondiale.",
    es: "La certificación CISSP valida habilidades avanzadas en gestión de seguridad de la información y es un estándar global.",
  },

  topics: [
    { it: "Gestione della sicurezza", en: "Security Management", fr: "Gestion de la sécurité", es: "Gestión de la seguridad" },
    { it: "Sicurezza delle reti", en: "Network Security", fr: "Sécurité des réseaux", es: "Seguridad de redes" },
    { it: "Controlli di accesso", en: "Access Control", fr: "Contrôle d'accès", es: "Control de acceso" },
    { it: "Sicurezza nello sviluppo software", en: "Software Development Security", fr: "Sécurité du développement logiciel", es: "Seguridad en el desarrollo de software" },
    { it: "Business continuity e disaster recovery", en: "Business Continuity and Disaster Recovery", fr: "Continuité d'activité et reprise après sinistre", es: "Continuidad del negocio y recuperación" },
  ],

  extraContent: {
    learn: {
      it: [
        "Protezione di asset informativi e infrastrutture critiche.",
        "Implementazione e monitoraggio dei controlli di sicurezza.",
        "Crittografia, gestione del rischio e sicurezza applicativa.",
      ],
      en: [
        "Protect information assets and critical infrastructure.",
        "Implement and monitor security controls.",
        "Cryptography, risk management, and application security.",
      ],
      fr: [
        "Protéger les actifs informationnels et les infrastructures critiques.",
        "Mettre en œuvre et surveiller les contrôles de sécurité.",
        "Cryptographie, gestion des risques et sécurité applicative.",
      ],
      es: [
        "Proteger activos de información e infraestructuras críticas.",
        "Implementar y supervisar controles de seguridad.",
        "Criptografía, gestión de riesgos y seguridad de aplicaciones.",
      ],
    },

    examReference: {
      it: [
        { text: "CISSP — Pagina ufficiale certificazione/esame", url: "https://www.isc2.org/certifications/cissp" },
        { text: "CISSP-ISSAP — Architettura (pagina ufficiale)", url: "https://www.isc2.org/certifications/issap" },
        { text: "CISSP-ISSEP — Ingegneria (pagina ufficiale)", url: "https://www.isc2.org/certifications/issep" },
        { text: "CISSP-ISSMP — Management (pagina ufficiale)", url: "https://www.isc2.org/certifications/issmp" },
      ],
      en: [
        { text: "CISSP — Official certification/exam page", url: "https://www.isc2.org/certifications/cissp" },
        { text: "CISSP-ISSAP — Architecture (official page)", url: "https://www.isc2.org/certifications/issap" },
        { text: "CISSP-ISSEP — Engineering (official page)", url: "https://www.isc2.org/certifications/issep" },
        { text: "CISSP-ISSMP — Management (official page)", url: "https://www.isc2.org/certifications/issmp" },
      ],
      fr: [
        { text: "CISSP — Page officielle certification/examen", url: "https://www.isc2.org/certifications/cissp" },
        { text: "CISSP-ISSAP — Architecture (page officielle)", url: "https://www.isc2.org/certifications/issap" },
        { text: "CISSP-ISSEP — Ingénierie (page officielle)", url: "https://www.isc2.org/certifications/issep" },
        { text: "CISSP-ISSMP — Management (page officielle)", url: "https://www.isc2.org/certifications/issmp" },
      ],
      es: [
        { text: "CISSP — Página oficial de certificación/examen", url: "https://www.isc2.org/certifications/cissp" },
        { text: "CISSP-ISSAP — Arquitectura (página oficial)", url: "https://www.isc2.org/certifications/issap" },
        { text: "CISSP-ISSEP — Ingeniería (página oficial)", url: "https://www.isc2.org/certifications/issep" },
        { text: "CISSP-ISSMP — Gestión (página oficial)", url: "https://www.isc2.org/certifications/issmp" },
      ],
    },

    whyChoose: {
      it: [
        "Riconoscimento internazionale nella sicurezza informatica.",
        "Richiesta per ruoli senior in cybersecurity.",
        "Copre in modo trasversale tutti i domini della sicurezza.",
      ],
      en: [
        "Internationally recognized in cybersecurity.",
        "Often required for senior cybersecurity roles.",
        "Covers all security domains comprehensively.",
      ],
      fr: [
        "Reconnue internationalement en cybersécurité.",
        "Souvent exigée pour des postes seniors.",
        "Couvre l'ensemble des domaines de la sécurité.",
      ],
      es: [
        "Reconocida internacionalmente en ciberseguridad.",
        "Frecuente requisito para roles senior.",
        "Cubre todos los dominios de seguridad de forma integral.",
      ],
    },

    faq: {
      it: [
        { q: "È adatta ai principianti?", a: "No. Richiede ~5 anni di esperienza in ≥ 2 domini della sicurezza." },
        { q: "Quanto è difficile l'esame?", a: "Molto impegnativo e ampio. Serve preparazione profonda e mirata." },
      ],
      en: [
        { q: "Is it suitable for beginners?", a: "No. ~5 years in ≥ 2 security domains are expected." },
        { q: "How hard is the exam?", a: "Challenging and broad. Deep, targeted preparation is essential." },
      ],
      fr: [
        { q: "Convient-elle aux débutants ?", a: "Non. Environ 5 ans d'expérience sur ≥ 2 domaines sont attendus." },
        { q: "Difficulté de l’examen ?", a: "Exigeant et très vaste. Préparation approfondie indispensable." },
      ],
      es: [
        { q: "¿Apta para principiantes?", a: "No. Se esperan ~5 años en ≥ 2 dominios de seguridad." },
        { q: "¿Dificultad del examen?", a: "Exigente y amplio. Requiere preparación profunda y específica." },
      ],
    },
  },

  // rotte localizzate per i pulsanti/indietro
  quizRoute: {
    it: "/it/quiz/cissp",
    en: "/quiz/cissp",
    fr: "/fr/quiz/cissp",
    es: "/es/quiz/cissp",
  },
  backRoute: {
    it: "/it/certificazioni",
    en: "/certifications",
    fr: "/fr/certifications",
    es: "/es/certifications",
  },
} as const;

export default CISSP;
