// src/certifications/data/cisco-ccst-cybersecurity.ts
// Data-only per CertificationPage (server). Nessun JSX/Router.

const CISCO_CCST_CYBERSECURITY = {
  slug: "cisco-ccst-cybersecurity",
  imageUrl: "/images/certifications/ccst_cybersecurity.png", // metti il logo in /public/images/certifications/ccst_cybersecurity.png
  officialUrl:
    "https://www.cisco.com/site/us/en/learn/training-certifications/exams/ccst-cybersecurity.html",

  // Verificato il 2026-08-04 sul documento ufficiale Cisco (Objective Domains).
  // Cisco non pubblica un peso percentuale per i singoli domini di questo esame.
  examBlueprint: {
    examCode: "100-160",
    provider: "Cisco",
    officialSourceName: "Cisco Certified Support Technician: Cybersecurity — Objective Domains",
    officialSourceUrl:
      "https://learningcontent.cisco.com/documents/CCST+Cybersecurity+Objecitve+Domain_Cisco_Final_wCiscoLogo.pdf",
    officialExamPageUrl:
      "https://www.cisco.com/site/us/en/learn/training-certifications/exams/ccst-cybersecurity.html",
    lastVerifiedAt: "2026-08-04",
    domains: [
      { name: "Essential Security Principles" },
      { name: "Basic Network Security Concepts" },
      { name: "Endpoint Security Concepts" },
      { name: "Vulnerability Assessment and Risk Management" },
      { name: "Incident Handling" },
    ],
  },

  title: {
    it: "Cisco CCST – Cybersecurity",
    en: "Cisco CCST – Cybersecurity",
    fr: "Cisco CCST – Cybersecurity",
    es: "Cisco CCST – Cybersecurity",
  },
  level: { it: "Base", en: "Entry-level", fr: "Débutant", es: "Inicial" },
  description: {
    it: "La certificazione Cisco CCST Cybersecurity attesta le competenze essenziali per proteggere i sistemi informatici, identificare le minacce e comprendere le basi della sicurezza di rete e dei dispositivi.",
    en: "The Cisco CCST Cybersecurity certification validates essential skills to secure IT systems, identify threats, and understand fundamentals of network and device security.",
    fr: "La certification Cisco CCST Cybersecurity valide les compétences essentielles pour sécuriser les systèmes informatiques, identifier les menaces et comprendre les bases de la sécurité des réseaux et des appareils.",
    es: "La certificación Cisco CCST Cybersecurity valida habilidades esenciales para proteger sistemas informáticos, identificar amenazas y comprender los fundamentos de la seguridad de redes y dispositivos.",
  },
  metaTitle: {
  en: "Cisco CCST Cybersecurity — Free Practice Quiz & Exam Prep",
  it: "Cisco CCST Cybersecurity in Italiano — Quiz e Simulazione Esame",
  fr: "Cisco CCST Cybersecurity en Français — Quiz et Examen Blanc",
  es: "Cisco CCST Cybersecurity en Español — Quiz y Examen de Práctica",
},
metaDescription: {
  en: "Prepare for Cisco CCST Cybersecurity 100-160 with exam-style quizzes on security principles, networks, endpoints, risk and incident handling. Start free.",
  it: "Preparati al Cisco CCST Cybersecurity 100-160 con quiz su sicurezza, reti, endpoint, rischi e gestione degli incidenti. Inizia gratis in italiano.",
  fr: "Préparez le Cisco CCST Cybersecurity 100-160 avec des quiz sur la sécurité, les réseaux, les terminaux, les risques et les incidents. Commencez gratuitement.",
  es: "Prepárate para Cisco CCST Cybersecurity 100-160 con quizzes sobre seguridad, redes, endpoints, riesgos e incidentes. Empieza gratis en español.",
},
  // Descriptive fallback only. Topic links continue to come from the backend.
  // These five areas follow the published 100-160 objective domains above.
  topics: [
    { title: {
      it: "Principi essenziali di sicurezza",
      en: "Essential Security Principles",
      fr: "Principes essentiels de sécurité",
      es: "Principios esenciales de seguridad",
    } },
    { title: {
      it: "Concetti di base della sicurezza di rete",
      en: "Basic Network Security Concepts",
      fr: "Concepts de base de la sécurité réseau",
      es: "Conceptos básicos de seguridad de red",
    } },
    { title: {
      it: "Concetti di sicurezza degli endpoint",
      en: "Endpoint Security Concepts",
      fr: "Concepts de sécurité des terminaux",
      es: "Conceptos de seguridad de endpoints",
    } },
    { title: {
      it: "Valutazione delle vulnerabilità e gestione dei rischi",
      en: "Vulnerability Assessment and Risk Management",
      fr: "Évaluation des vulnérabilités et gestion des risques",
      es: "Evaluación de vulnerabilidades y gestión de riesgos",
    } },
    { title: {
      it: "Gestione degli incidenti di sicurezza",
      en: "Incident Handling",
      fr: "Gestion des incidents de sécurité",
      es: "Gestión de incidentes de seguridad",
    } },
  ],

  extraContent: {
    learn: {
      it: [
        "Comprendere i concetti fondamentali di cybersecurity.",
        "Identificare minacce comuni come malware, phishing e ransomware.",
        "Apprendere i principi di sicurezza di rete e protezione dei dati.",
        "Utilizzare strumenti base per l'analisi e la prevenzione degli attacchi.",
        "Prepararsi per ruoli entry-level nella sicurezza IT.",
      ],
      en: [
        "Understand fundamental cybersecurity concepts.",
        "Identify common threats such as malware, phishing, and ransomware.",
        "Learn principles of network security and data protection.",
        "Use basic tools for attack analysis and prevention.",
        "Prepare for entry-level roles in IT security.",
      ],
      fr: [
        "Comprendre les concepts fondamentaux de la cybersécurité.",
        "Identifier les menaces courantes (malwares, phishing, ransomwares).",
        "Apprendre les principes de sécurité réseau et de protection des données.",
        "Utiliser des outils de base pour analyser et prévenir les attaques.",
        "Se préparer à des rôles débutants en sécurité informatique.",
      ],
      es: [
        "Comprender los conceptos fundamentales de ciberseguridad.",
        "Identificar amenazas comunes como malware, phishing y ransomware.",
        "Aprender principios de seguridad de red y protección de datos.",
        "Usar herramientas básicas para analizar y prevenir ataques.",
        "Prepararse para roles iniciales en seguridad informática.",
      ],
    },
    examReference: {
      it: [
        {
          text: "100-160 • CCST Cybersecurity — Pagina ufficiale d’esame",
          url: "https://www.cisco.com/site/us/en/learn/training-certifications/exams/ccst-cybersecurity.html",
        },
      ],
      en: [
        {
          text: "100-160 • CCST Cybersecurity — Official exam page",
          url: "https://www.cisco.com/site/us/en/learn/training-certifications/exams/ccst-cybersecurity.html",
        },
      ],
      fr: [
        {
          text: "100-160 • CCST Cybersecurity — Page officielle de l’examen",
          url: "https://www.cisco.com/site/us/en/learn/training-certifications/exams/ccst-cybersecurity.html",
        },
      ],
      es: [
        {
          text: "100-160 • CCST Cybersecurity — Página oficial del examen",
          url: "https://www.cisco.com/site/us/en/learn/training-certifications/exams/ccst-cybersecurity.html",
        },
      ],
    },
    whyChoose: {
      it: [
        "Ideale per chi desidera iniziare una carriera nella sicurezza informatica.",
        "Certificazione ufficiale Cisco, riconosciuta a livello internazionale.",
        "Accessibile anche senza esperienza tecnica pregressa.",
        "Una base per approfondire la sicurezza di reti ed endpoint e la gestione degli incidenti.",
        "Supportata da Cisco con risorse didattiche di qualità.",
      ],
      en: [
        "Ideal for starting a career in cybersecurity.",
        "Official Cisco certification, internationally recognized.",
        "Accessible even without prior technical experience.",
        "A foundation for further study of network and endpoint security and incident handling.",
        "Backed by Cisco with quality learning resources.",
      ],
      fr: [
        "Idéal pour débuter en cybersécurité.",
        "Certification Cisco officielle reconnue internationalement.",
        "Accessible sans expérience technique préalable.",
        "Une base pour approfondir la sécurité des réseaux et des terminaux et la gestion des incidents.",
        "Soutenue par Cisco avec des ressources de qualité.",
      ],
      es: [
        "Ideal para comenzar en ciberseguridad.",
        "Certificación oficial de Cisco reconocida internacionalmente.",
        "Accesible incluso sin experiencia técnica previa.",
        "Una base para profundizar en la seguridad de redes y endpoints y la gestión de incidentes.",
        "Respaldada por Cisco con recursos de calidad.",
      ],
    },
    faq: {
      it: [
        { q: "Serve esperienza tecnica per sostenere l'esame?", a: "No, è progettata per chi è alle prime armi." },
        { q: "È una certificazione ufficiale Cisco?", a: "Sì, riconosciuta a livello internazionale." },
        { q: "Come preparo l’esame?", a: "Studia con NetAcad e pratica con i quiz di CertifyQuiz." },
      ],
      en: [
        { q: "Do I need technical experience?", a: "No, it's designed for beginners." },
        { q: "Is it an official Cisco certification?", a: "Yes, it's internationally recognized." },
        { q: "How to prepare?", a: "Study with NetAcad and practice with CertifyQuiz quizzes." },
      ],
      fr: [
        { q: "Expérience technique requise ?", a: "Non, conçue pour débutants." },
        { q: "Certification Cisco officielle ?", a: "Oui, reconnue internationalement." },
        { q: "Comment préparer ?", a: "Cours NetAcad + quiz CertifyQuiz." },
      ],
      es: [
        { q: "¿Experiencia técnica requerida?", a: "No, diseñada para principiantes." },
        { q: "¿Certificación oficial de Cisco?", a: "Sí, reconocida internacionalmente." },
        { q: "¿Cómo prepararse?", a: "Curso NetAcad + cuestionarios de CertifyQuiz." },
      ],
    },
  },

  // rotte localizzate per i pulsanti
  quizRoute: {
  it: "/it/quiz/cisco-ccst-cybersecurity",
  en: "/en/quiz/cisco-ccst-cybersecurity",
  fr: "/fr/quiz/cisco-ccst-cybersecurity",
  es: "/es/quiz/cisco-ccst-cybersecurity",
},
  backRoute: {
    it: "/it/certificazioni",
    en: "/certifications",
    fr: "/fr/certifications",
    es: "/es/certifications",
  },
} as const;

export default CISCO_CCST_CYBERSECURITY;
