// src/certifications/data/isc2-cc.ts
// ✅ Versione data-only (nessun JSX/router).
// 🖼️ Assicurati che l’immagine esista in /public/images/certifications/isc2-icon.png

const ISC2CC = {
  slug: "isc2-cc",
  imageUrl: "/images/certifications/isc2-icon.png",
  officialUrl: "https://www.isc2.org/certifications/certified-in-cybersecurity",

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
          a: "L’esame copre concetti di sicurezza, gestione del rischio, controlli di sicurezza, conformità e standard, e risposta agli incidenti.",
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
          a: "The exam covers security fundamentals, risk management, security controls, compliance and standards, and incident response.",
        },
        {
          q: "What is the best way to prepare for ISC2 CC?",
          a: "Study the core concepts and practice with exam-style questions. Consistent practice helps you identify weak areas and build confidence.",
        },
        {
          q: "Do CertifyQuiz quizzes help with ISC2 CC preparation?",
          a: "Yes. The quizzes are designed to reflect exam-style thinking and reinforce key concepts through detailed explanations.",
        },
      ],
      fr: [
        {
          q: "La certification ISC2 CC convient-elle aux débutants ?",
          a: "Oui. ISC2 CC est une certification d’entrée conçue pour valider les bases de la cybersécurité sans exiger d’expérience avancée.",
        },
        {
          q: "Quels sujets sont couverts par l’examen ISC2 CC ?",
          a: "L’examen couvre les fondamentaux de la sécurité, la gestion des risques, les contrôles de sécurité, la conformité et les normes, ainsi que la réponse aux incidents.",
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
          a: "El examen cubre fundamentos de seguridad, gestión de riesgos, controles de seguridad, cumplimiento y estándares, y respuesta ante incidentes.",
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