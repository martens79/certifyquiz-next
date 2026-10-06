// src/certifications/data/isc2-cc.ts
// ✅ Versione data-only (nessun JSX/router).
// 🖼️ Assicurati che l’immagine esista in /public/images/certifications/isc2-icon.png

const ISC2CC = {
  slug: "isc2-cc",
  imageUrl: "/images/certifications/isc2-icon.png",
  officialUrl: "https://www.isc2.org/certifications/certified-in-cybersecurity",

  // Verificato il 2026-10-06 sul documento ufficiale ISC2 (Exam Outline v01/2026,
  // effective 2026-09-01). Sostituisce l'outline effective 2025-10-01: non
  // ripubblicarlo (vedi tests/isc2-cc-blueprint.test.ts). I pesi sono quelli
  // ufficiali ISC2 (somma 99,9% per arrotondamento).
  examBlueprint: {
    provider: "ISC2",
    officialSourceName: "ISC2 Certified in Cybersecurity (CC) — Exam Outline (effective 2026-09-01)",
    officialSourceUrl:
      "https://edge.sitecorecloud.io/internationf173-xmc4e73-prodbc0f-9660/media/Project/ISC2/Main/Media/documents/exam-outlines/2026/EXAMS-CC_Exam_Outline-English-Revised-01-2026-Final.pdf",
    officialExamPageUrl:
      "https://www.isc2.org/certifications/cc/cc-certification-exam-outline",
    lastVerifiedAt: "2026-10-06",
    domains: [
      { name: "Security Principles", percentage: 24 },
      { name: "Security Governance", percentage: 17.3 },
      { name: "Identity And Access Management (IAM) Concepts", percentage: 20 },
      { name: "Networking and Cloud Security Concepts", percentage: 21.3 },
      { name: "Security Operations and Incident Response", percentage: 17.3 },
    ],
  },

  // ✅ SEO-first: titoli orientati a quiz / practice test / simulazione esame
 title: {
  it: "ISC2 CC Practice Test 2026 – Quiz e Simulazione Esame",
  en: "ISC2 CC Practice Test 2026 – Free Certified in Cybersecurity Quiz",
  fr: "ISC2 CC Test Pratique 2026 – Quiz Cybersécurité Gratuit",
  es: "ISC2 CC Practice Test 2026 – Quiz Gratis de Ciberseguridad",
},

  level: {
    it: "Principiante",
    en: "Beginner",
    fr: "Débutant",
    es: "Principiante",
  },

  // ✅ Descrizioni più coerenti con i topic reali del DB
  description: {
  it: "Preparati all’esame ISC2 Certified in Cybersecurity con quiz gratuiti, domande tipo esame, spiegazioni chiare e pratica su rischio, controlli, compliance e incident response.",
  en: "Prepare for the ISC2 Certified in Cybersecurity exam with a free practice test, exam-style questions, clear explanations and focused cybersecurity revision.",
  fr: "Préparez l’examen ISC2 Certified in Cybersecurity avec un test pratique gratuit, des QCM type examen, des explications claires et une révision ciblée.",
  es: "Prepárate para el examen ISC2 Certified in Cybersecurity con un practice test gratis, preguntas tipo examen, explicaciones claras y repaso guiado.",
},
practiceName: { it: "ISC2 CC", en: "ISC2 CC", fr: "ISC2 CC", es: "ISC2 CC" },
metaTitle: {
  it: "ISC2 CC – Practice Test e Quiz Cybersecurity 2026 | CertifyQuiz",
  en: "ISC2 CC Certified in Cybersecurity – Practice Test 2026 | CertifyQuiz",
  fr: "ISC2 CC Certified in Cybersecurity – Test Pratique 2026 | CertifyQuiz",
  es: "ISC2 CC Certified in Cybersecurity – Practice Test 2026 | CertifyQuiz",
},
metaDescription: {
  it: "Preparati all'esame ISC2 CC con quiz gratuiti in stile esame. Copre rischio, controlli, compliance e incident response. Inizia gratis.",
  en: "Prepare for the ISC2 Certified in Cybersecurity exam with free practice questions. Covers risk, security controls, compliance and incident response. Start free.",
  fr: "Préparez l'examen ISC2 CC avec des questions gratuites type examen. Couvre risque, contrôles, conformité et réponse aux incidents. Commencez gratuitement.",
  es: "Prepárate para el examen ISC2 CC con preguntas gratuitas tipo examen. Cubre riesgo, controles, cumplimiento e incident response. Empieza gratis.",
},
  // ✅ Allineato ai topic reali del DB + slug reali
  topics: [
    {
      title: {
        it: "Concetti di sicurezza",
        en: "Security Fundamentals",
        fr: "Fondamentaux de la sécurité",
        es: "Fundamentos de seguridad",
      },
      slug: {
        it: "concetti-di-sicurezza",
        en: "security-fundamentals",
        fr: "fondamentaux-de-la-securite",
        es: "fundamentos-de-seguridad",
      },
    },
    {
      title: {
        it: "Gestione del rischio",
        en: "Risk Management",
        fr: "Gestion des risques",
        es: "Gestión de riesgos",
      },
      slug: {
        it: "gestione-del-rischio",
        en: "risk-management",
        fr: "gestion-des-risques",
        es: "gestion-de-riesgos",
      },
    },
    {
      title: {
        it: "Controlli di sicurezza",
        en: "Security Controls",
        fr: "Contrôles de sécurité",
        es: "Controles de seguridad",
      },
      slug: {
        it: "controlli-di-sicurezza",
        en: "security-controls",
        fr: "controles-de-securite",
        es: "controles-de-seguridad",
      },
    },
    {
      title: {
        it: "Conformità e standard",
        en: "Compliance and Standards",
        fr: "Conformité et normes",
        es: "Cumplimiento y estándares",
      },
      slug: {
        it: "conformita-e-standard",
        en: "compliance-and-standards",
        fr: "conformite-et-normes",
        es: "cumplimiento-y-estandares",
      },
    },
    {
      title: {
        it: "Risposta agli incidenti",
        en: "Incident Response",
        fr: "Réponse aux incidents",
        es: "Respuesta ante incidentes",
      },
      slug: {
        it: "risposta-agli-incidenti",
        en: "incident-response",
        fr: "reponse-aux-incidents",
        es: "respuesta-ante-incidentes",
      },
    },
  ],

  extraContent: {
    // 🔗 Solo pagina ufficiale d’esame
    examReference: {
      it: [
        {
          text: "ISC2 Certified in Cybersecurity (CC) — Pagina ufficiale d’esame",
          url: "https://www.isc2.org/certifications/certified-in-cybersecurity",
        },
      ],
      en: [
        {
          text: "ISC2 Certified in Cybersecurity (CC) — Official exam page",
          url: "https://www.isc2.org/certifications/certified-in-cybersecurity",
        },
      ],
      fr: [
        {
          text: "ISC2 Certified in Cybersecurity (CC) — Page officielle de l’examen",
          url: "https://www.isc2.org/certifications/certified-in-cybersecurity",
        },
      ],
      es: [
        {
          text: "ISC2 Certified in Cybersecurity (CC) — Página oficial del examen",
          url: "https://www.isc2.org/certifications/certified-in-cybersecurity",
        },
      ],
    },

    // ✅ Più coerente con i veri domini/topic
    learn: {
      it: [
        "Capire i fondamenti della cybersecurity: minacce, vulnerabilità, rischio e principi base della sicurezza.",
        "Studiare la gestione del rischio, le policy, la governance e i concetti essenziali di compliance.",
        "Rafforzare le basi sui controlli di sicurezza e sulle misure difensive usate negli ambienti IT.",
        "Allenarti su conformità, standard e risposta agli incidenti con domande in stile esame e spiegazioni dettagliate.",
      ],
      en: [
        "Understand core cybersecurity fundamentals: threats, vulnerabilities, risk, and essential security principles.",
        "Learn risk management basics, policies, governance, and key compliance concepts.",
        "Strengthen your understanding of security controls and defensive measures used in IT environments.",
        "Practice compliance, standards, and incident response with exam-style questions and detailed explanations.",
      ],
      fr: [
        "Comprendre les bases de la cybersécurité : menaces, vulnérabilités, risque et principes essentiels de sécurité.",
        "Étudier la gestion des risques, les politiques, la gouvernance et les notions clés de conformité.",
        "Renforcer les bases sur les contrôles de sécurité et les mesures de défense utilisées dans les environnements IT.",
        "S’entraîner sur la conformité, les normes et la réponse aux incidents avec des questions type examen et des explications détaillées.",
      ],
      es: [
        "Comprender los fundamentos de la ciberseguridad: amenazas, vulnerabilidades, riesgo y principios esenciales de seguridad.",
        "Aprender gestión de riesgos, políticas, gobernanza y conceptos clave de cumplimiento.",
        "Reforzar la comprensión de controles de seguridad y medidas defensivas utilizadas en entornos IT.",
        "Practicar cumplimiento, estándares y respuesta ante incidentes con preguntas tipo examen y explicaciones detalladas.",
      ],
    },

    whyChoose: {
      it: [
        "Certificazione ufficiale ISC2 perfetta per iniziare un percorso in cybersecurity.",
        "Adatta a principianti, studenti, neolaureati e persone in transizione verso ruoli IT/security.",
        "Ottimo primo passo prima di certificazioni più avanzate come Security+, SSCP o CISSP.",
        "Allenarti con quiz pratici ti aiuta a capire dove sbagli e migliorare più velocemente.",
      ],
      en: [
        "Official ISC2 entry-level certification — a strong starting point for cybersecurity.",
        "Great for beginners, students, recent graduates, and career changers moving into IT/security.",
        "An excellent first step before more advanced certifications such as Security+, SSCP, or CISSP.",
        "Practice-based preparation helps you identify weak areas and improve faster.",
      ],
      fr: [
        "Certification officielle ISC2 idéale pour débuter en cybersécurité.",
        "Adaptée aux débutants, étudiants, jeunes diplômés et personnes en reconversion vers l’IT/la sécurité.",
        "Excellent premier pas avant des certifications plus avancées comme Security+, SSCP ou CISSP.",
        "L’entraînement par quiz aide à identifier les lacunes et à progresser plus vite.",
      ],
      es: [
        "Certificación oficial de ISC2 ideal para comenzar en ciberseguridad.",
        "Adecuada para principiantes, estudiantes, recién graduados y personas que cambian hacia roles IT/security.",
        "Excelente primer paso antes de certificaciones más avanzadas como Security+, SSCP o CISSP.",
        "La práctica con quizzes ayuda a detectar puntos débiles y mejorar más rápido.",
      ],
    },

    faq: {
      it: [
        {
          q: "La certificazione ISC2 CC è adatta ai principianti?",
          a: "Sì. ISC2 CC è una certificazione entry-level pensata per validare le basi della cybersecurity senza richiedere esperienza avanzata.",
        },
        {
          q: "Quali argomenti copre l’esame ISC2 CC?",
          a: "L’esame copre cinque domini: Security Principles, Security Governance, concetti di Identity and Access Management (IAM), concetti di Networking and Cloud Security, e Security Operations e Incident Response.",
        },
        {
          q: "Come mi preparo al meglio per ISC2 CC?",
          a: "Studia i concetti chiave e allenati con domande in stile esame. La pratica costante ti aiuta a individuare i punti deboli e aumentare la confidenza.",
        },
        {
          q: "I quiz di CertifyQuiz sono utili per l’esame ISC2 CC?",
          a: "Sì. I quiz sono pensati per avvicinarsi allo stile dell’esame e rafforzare i concetti fondamentali con spiegazioni dettagliate.",
        },
      ],
      en: [
        {
          q: "Is ISC2 CC suitable for beginners?",
          a: "Yes. ISC2 CC is an entry-level certification designed to validate core cybersecurity knowledge without requiring advanced experience.",
        },
        {
          q: "What topics are covered in the ISC2 CC exam?",
          a: "The exam covers five domains: Security Principles, Security Governance, Identity and Access Management (IAM) Concepts, Networking and Cloud Security Concepts, and Security Operations and Incident Response.",
        },
        {
          q: "What is the best way to prepare for ISC2 CC?",
          a: "Study the core concepts and practice with exam-style questions. Consistent practice helps you identify weak areas and build confidence.",
        },
        {
          q: "Do CertifyQuiz quizzes help with ISC2 CC preparation?",
          a: "Yes. The quizzes are designed to reflect exam-style thinking and reinforce key concepts through detailed explanations.",
        },
        {
          q: "Where can I practice ISC2 CC exam questions?",
          a: "Use the ISC2 CC quiz and practice test on CertifyQuiz to work through exam-style questions by topic, then review explanations for the areas you miss.",
        },
      ],
      fr: [
        {
          q: "La certification ISC2 CC convient-elle aux débutants ?",
          a: "Oui. ISC2 CC est une certification d’entrée conçue pour valider les bases de la cybersécurité sans exiger d’expérience avancée.",
        },
        {
          q: "Quels sujets sont couverts par l’examen ISC2 CC ?",
          a: "L’examen couvre cinq domaines : Security Principles, Security Governance, concepts d’Identity and Access Management (IAM), concepts de Networking and Cloud Security, et Security Operations and Incident Response.",
        },
        {
          q: "Quelle est la meilleure façon de se préparer à ISC2 CC ?",
          a: "Révisez les notions clés et entraînez-vous avec des questions type examen. Une pratique régulière aide à repérer les faiblesses et à gagner en confiance.",
        },
        {
          q: "Les quiz de CertifyQuiz sont-ils utiles pour préparer ISC2 CC ?",
          a: "Oui. Les quiz sont conçus pour se rapprocher du raisonnement de l’examen et renforcer les concepts clés grâce à des explications détaillées.",
        },
      ],
      es: [
        {
          q: "¿La certificación ISC2 CC es adecuada para principiantes?",
          a: "Sí. ISC2 CC es una certificación de nivel inicial diseñada para validar conocimientos básicos de ciberseguridad sin requerir experiencia avanzada.",
        },
        {
          q: "¿Qué temas cubre el examen ISC2 CC?",
          a: "El examen cubre cinco dominios: Security Principles, Security Governance, conceptos de Identity and Access Management (IAM), conceptos de Networking and Cloud Security y Security Operations and Incident Response.",
        },
        {
          q: "¿Cuál es la mejor forma de prepararme para ISC2 CC?",
          a: "Estudia los conceptos clave y practica con preguntas tipo examen. La práctica constante ayuda a detectar debilidades y ganar confianza.",
        },
        {
          q: "¿Los quizzes de CertifyQuiz ayudan para preparar ISC2 CC?",
          a: "Sí. Los quizzes están diseñados para acercarse al estilo de razonamiento del examen y reforzar los conceptos clave con explicaciones detalladas.",
        },
      ],
    },
  },

  // ✅ Rotte quiz localizzate
  quizRoute: {
    it: "/it/quiz/isc2-cc",
    en: "/en/quiz/isc2-cc",
    fr: "/fr/quiz/isc2-cc",
    es: "/es/quiz/isc2-cc",
  },

  // ✅ Rotta “indietro”: lista certificazioni per lingua
  backRoute: {
    it: "/it/certificazioni",
    en: "/certifications",
    fr: "/fr/certifications",
    es: "/es/certificaciones",
  },
} as const;

export default ISC2CC;
