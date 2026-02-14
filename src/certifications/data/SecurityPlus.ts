// src/certifications/data/security-plus.ts
// 🔥 SEO-optimized version – data-only (no JSX)

const SecurityPlus = {
  slug: "security-plus",
  imageUrl: "/images/certifications/securityplus-icon.png",
  officialUrl: "https://www.comptia.org/certifications/security",

  title: {
    it: "CompTIA Security+ – Quiz e Simulazioni d'Esame",
    en: "Security+ Practice Test 2026 – 834 Exam Questions",
    fr: "CompTIA Security+ – Quiz et Simulation d’Examen",
    es: "CompTIA Security+ – Quiz y Simulación de Examen",
  },

  level: {
    it: "Intermedio",
    en: "Intermediate",
    fr: "Intermédiaire",
    es: "Intermedio",
  },

  description: {
    it: "Allenati per l’esame CompTIA Security+ (SY0-701) con quiz in stile esame, modalità training e simulazioni con timer. Copertura completa dei domini ufficiali e banca domande in crescita.",
    en: "Practice with 834 Security+ exam-style questions (English pool). Includes training mode, timed exam simulation, and mixed quizzes covering all SY0-701 domains.",
    fr: "Préparez l’examen CompTIA Security+ (SY0-701) avec des quiz type examen, un mode entraînement et une simulation chronométrée. Banque de questions en croissance.",
    es: "Prepárate para el examen CompTIA Security+ (SY0-701) con quizzes tipo examen, modo entrenamiento y simulación con temporizador. Banco de preguntas en expansión.",
  },

  topics: [
    { it: "Minacce, attacchi e vulnerabilità", en: "Threats, Attacks & Vulnerabilities", fr: "Menaces, attaques et vulnérabilités", es: "Amenazas, ataques y vulnerabilidades" },
    { it: "Architettura e design sicuro", en: "Secure Architecture & Design", fr: "Architecture et conception sécurisées", es: "Arquitectura y diseño seguros" },
    { it: "Implementazione della sicurezza", en: "Security Implementation", fr: "Mise en œuvre de la sécurité", es: "Implementación de seguridad" },
    { it: "Operazioni e risposta agli incidenti", en: "Operations & Incident Response", fr: "Opérations et réponse aux incidents", es: "Operaciones y respuesta a incidentes" },
    { it: "Governance, rischio e compliance", en: "Governance, Risk & Compliance", fr: "Gouvernance, risque et conformité", es: "Gobernanza, riesgo y cumplimiento" },
  ],

  extraContent: {
    learn: {
      it: [
        "Comprendere minacce moderne, attacchi e vulnerabilità.",
        "Applicare controlli di sicurezza su reti e sistemi.",
        "Gestire incidenti e implementare piani di risposta.",
        "Prepararti con quiz realistici in stile esame.",
      ],
      en: [
        "Master modern threats, attacks, and vulnerabilities.",
        "Apply security controls across networks and systems.",
        "Understand risk management and incident response.",
        "Practice with realistic exam-style questions.",
      ],
      fr: [
        "Maîtriser les menaces modernes et vulnérabilités.",
        "Appliquer des contrôles de sécurité sur réseaux et systèmes.",
        "Gérer les incidents et analyser les risques.",
        "S’entraîner avec des quiz type examen.",
      ],
      es: [
        "Dominar amenazas y vulnerabilidades modernas.",
        "Aplicar controles de seguridad en redes y sistemas.",
        "Gestionar incidentes y riesgos.",
        "Practicar con preguntas tipo examen.",
      ],
    },

    whyChoose: {
      it: [
        "Certificazione richiesta a livello globale.",
        "Perfetta per ruoli come SOC Analyst o Security Administrator.",
        "Base solida per certificazioni avanzate (CySA+, CASP+).",
      ],
      en: [
        "One of the most in-demand cybersecurity certifications worldwide.",
        "Ideal for SOC analyst, security administrator, and junior security roles.",
        "Strong foundation for advanced certs like CySA+ or CASP+.",
      ],
      fr: [
        "Certification très demandée en cybersécurité.",
        "Adaptée aux postes d’analyste SOC ou administrateur sécurité.",
        "Base solide pour des certifications avancées.",
      ],
      es: [
        "Certificación muy demandada en ciberseguridad.",
        "Ideal para analista SOC o administrador de seguridad.",
        "Base sólida para certificaciones avanzadas.",
      ],
    },

    examReference: {
      it: [
        { text: "SY0-701 • Pagina ufficiale CompTIA Security+", url: "https://www.comptia.org/certifications/security" },
      ],
      en: [
        { text: "SY0-701 • Official CompTIA Security+ page", url: "https://www.comptia.org/certifications/security" },
      ],
      fr: [
        { text: "SY0-701 • Page officielle CompTIA Security+", url: "https://www.comptia.org/certifications/security" },
      ],
      es: [
        { text: "SY0-701 • Página oficial CompTIA Security+", url: "https://www.comptia.org/certifications/security" },
      ],
    },

    faq: {
      it: [
        { q: "Quante domande include l’esame?", a: "Fino a 90 domande a scelta multipla e performance-based." },
        { q: "È valida a livello internazionale?", a: "Sì, è riconosciuta globalmente." },
        { q: "Quanto dura la certificazione?", a: "3 anni con rinnovo tramite CEU." },
      ],
      en: [
        { q: "How many questions are on the exam?", a: "Up to 90 multiple-choice and performance-based questions." },
        { q: "Is it globally recognized?", a: "Yes, it's recognized worldwide." },
        { q: "How long is it valid?", a: "3 years, renewable via CEUs." },
      ],
      fr: [
        { q: "Combien de questions à l’examen ?", a: "Jusqu’à 90 questions (QCM et pratiques)." },
        { q: "Est-elle reconnue à l’international ?", a: "Oui, mondialement reconnue." },
        { q: "Quelle est sa validité ?", a: "3 ans avec renouvellement CEU." },
      ],
      es: [
        { q: "¿Cuántas preguntas tiene el examen?", a: "Hasta 90 preguntas tipo test y prácticas." },
        { q: "¿Está reconocida internacionalmente?", a: "Sí, a nivel mundial." },
        { q: "¿Cuál es su vigencia?", a: "3 años renovables con CEUs." },
      ],
    },
  },

  quizRoute: {
    it: "/it/quiz/security-plus",
    en: "/en/quiz/security-plus",
    fr: "/fr/quiz/security-plus",
    es: "/es/quiz/security-plus",
  },

  backRoute: {
    it: "/it/certificazioni",
    en: "/certifications",
    fr: "/fr/certifications",
    es: "/es/certificaciones",
  },
} as const;

export default SecurityPlus;
