// src/certifications/data/cisco-ccst-cybersecurity.ts
// Data-only per CertificationPage (server). Nessun JSX/Router.

const CISCO_CCST_CYBERSECURITY = {
  slug: "cisco-ccst-security",
  imageUrl: "/images/certifications/ccst_cybersecurity.png", // metti il logo in /public/images/certifications/ccst_cybersecurity.png
  officialUrl:
    "https://www.cisco.com/site/us/en/learn/training-certifications/exams/ccst-cybersecurity.html",

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

  topics: [
    { it: "Concetti di sicurezza informatica", en: "Cybersecurity concepts", fr: "Notions de cybersécurité", es: "Conceptos de ciberseguridad" },
    { it: "Minacce e vulnerabilità", en: "Threats and vulnerabilities", fr: "Menaces et vulnérabilités", es: "Amenazas y vulnerabilidades" },
    { it: "Sicurezza della rete", en: "Network security", fr: "Sécurité réseau", es: "Seguridad de red" },
    { it: "Sicurezza dei dispositivi", en: "Device security", fr: "Sécurité des dispositifs", es: "Seguridad de dispositivos" },
    { it: "Risposta agli incidenti", en: "Incident response", fr: "Réponse aux incidents", es: "Respuesta a incidentes" },
    { it: "Fondamenti di cybersecurity operativa", en: "Operational cybersecurity fundamentals", fr: "Notions fondamentales de cybersécurité opérationnelle", es: "Fundamentos de ciberseguridad operativa" },
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
        "Ottimo primo passo verso percorsi come CCNA Security e CEH.",
        "Supportata da Cisco con risorse didattiche di qualità.",
      ],
      en: [
        "Ideal for starting a career in cybersecurity.",
        "Official Cisco certification, internationally recognized.",
        "Accessible even without prior technical experience.",
        "Great first step toward paths like CCNA Security and CEH.",
        "Backed by Cisco with quality learning resources.",
      ],
      fr: [
        "Idéal pour débuter en cybersécurité.",
        "Certification Cisco officielle reconnue internationalement.",
        "Accessible sans expérience technique préalable.",
        "Excellent point de départ vers CCNA Security et CEH.",
        "Soutenue par Cisco avec des ressources de qualité.",
      ],
      es: [
        "Ideal para comenzar en ciberseguridad.",
        "Certificación oficial de Cisco reconocida internacionalmente.",
        "Accesible incluso sin experiencia técnica previa.",
        "Excelente primer paso hacia CCNA Security y CEH.",
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
   it: "/it/quiz/cisco-ccst-security",
    en: "/en/quiz/cisco-ccst-security",
    fr: "/fr/quiz/cisco-ccst-security",
    es: "/es/quiz/cisco-ccst-security",

  },
  backRoute: {
    it: "/it/certificazioni",
    en: "/certifications",
    fr: "/fr/certifications",
    es: "/es/certifications",
  },
} as const;

export default CISCO_CCST_CYBERSECURITY;
