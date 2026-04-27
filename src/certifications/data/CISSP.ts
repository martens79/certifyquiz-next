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
  metaTitle: {
  it: "CISSP – Practice Test e Quiz Cybersecurity Avanzato 2026 | CertifyQuiz",
  en: "CISSP Practice Test 2026 – Exam-Style Questions | CertifyQuiz",
  fr: "CISSP – Test Pratique et Quiz Cybersécurité 2026 | CertifyQuiz",
  es: "CISSP – Practice Test y Quiz Ciberseguridad 2026 | CertifyQuiz",
},
metaDescription: {
  it: "Preparati al CISSP con quiz avanzati su tutti e 8 i domini: rischio, crittografia, IAM, sicurezza reti e operazioni. Per professionisti senior.",
  en: "Practice for the CISSP exam with advanced questions across all 8 domains: risk, cryptography, IAM, network security and operations. For senior professionals.",
  fr: "Préparez le CISSP avec des quiz avancés sur les 8 domaines : risque, cryptographie, IAM, sécurité réseau et opérations. Pour professionnels seniors.",
  es: "Prepárate para el CISSP con preguntas avanzadas en los 8 dominios: riesgo, criptografía, IAM, seguridad de redes y operaciones. Para profesionales senior.",
},
 topics: [
  {
    title: {
      it: "Security and Risk Management",
      en: "Security and Risk Management",
      fr: "Gestion des risques et sécurité",
      es: "Gestión de riesgos y seguridad",
    },
    slug: {
      it: "security-and-risk-management",
      en: "security-and-risk-management",
      fr: "gestion-des-risques-et-securite",
      es: "gestion-de-riesgos-y-seguridad",
    },
  },
  {
    title: {
      it: "Identity and Access Management (IAM)",
      en: "Identity and Access Management (IAM)",
      fr: "Gestion des identités et des accès (IAM)",
      es: "Gestión de identidades y accesos (IAM)",
    },
    slug: {
      it: "identity-and-access-management-iam",
      en: "identity-and-access-management-iam",
      fr: "gestion-des-identites-et-des-acces-iam",
      es: "gestion-de-identidades-y-accesos-iam",
    },
  },
  {
    title: {
      it: "Asset Security",
      en: "Asset Security",
      fr: "Sécurité des actifs",
      es: "Seguridad de activos",
    },
    slug: {
      it: "asset-security",
      en: "asset-security",
      fr: "securite-des-actifs",
      es: "seguridad-de-activos",
    },
  },
  {
    title: {
      it: "Communication and Network Security",
      en: "Communication and Network Security",
      fr: "Sécurité des communications et des réseaux",
      es: "Seguridad de comunicaciones y redes",
    },
    slug: {
      it: "communication-and-network-security",
      en: "communication-and-network-security",
      fr: "securite-des-communications-et-des-reseaux",
      es: "seguridad-de-comunicaciones-y-redes",
    },
  },
  {
    title: {
      it: "Security Assessment and Testing",
      en: "Security Assessment and Testing",
      fr: "Évaluation et tests de sécurité",
      es: "Evaluación y pruebas de seguridad",
    },
    slug: {
      it: "security-assessment-and-testing",
      en: "security-assessment-and-testing",
      fr: "evaluation-et-tests-de-securite",
      es: "evaluacion-y-pruebas-de-seguridad",
    },
  },
  {
    title: {
      it: "Security Architecture and Engineering",
      en: "Security Architecture and Engineering",
      fr: "Architecture et ingénierie de la sécurité",
      es: "Arquitectura e ingeniería de seguridad",
    },
    slug: {
      it: "security-architecture-and-engineering",
      en: "security-architecture-and-engineering",
      fr: "architecture-et-ingenierie-de-la-securite",
      es: "arquitectura-e-ingenieria-de-seguridad",
    },
  },
  {
    title: {
      it: "Security Operations",
      en: "Security Operations",
      fr: "Opérations de sécurité",
      es: "Operaciones de seguridad",
    },
    slug: {
      it: "security-operations",
      en: "security-operations",
      fr: "operations-de-securite",
      es: "operaciones-de-seguridad",
    },
  },
  {
    title: {
      it: "Software Development Security",
      en: "Software Development Security",
      fr: "Sécurité du développement logiciel",
      es: "Seguridad en el desarrollo de software",
    },
    slug: {
      it: "software-development-security",
      en: "software-development-security",
      fr: "securite-du-developpement-logiciel",
      es: "seguridad-en-el-desarrollo-de-software",
    },
  },
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
    en: "/en/quiz/cissp",
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
