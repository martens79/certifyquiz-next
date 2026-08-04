// src/certifications/data/microsoft-ai-fundamentals.ts
// ✅ Modulo dati puro per il renderer server (no React/JSX, no router).

const MicrosoftAIFundamentals = {
  slug: "microsoft-ai",  // ← era "microsoft-ai-fundamentals"
  imageUrl: "/images/certifications/ai-fundamentals-icon.png",
  officialUrl:
    "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-fundamentals/",

  // Verificato il 2026-08-04. Microsoft ha ritirato AI-900 il 2026-06-30 e lo
  // ha sostituito con AI-901 (stessa certificazione "Azure AI Fundamentals").
  examBlueprint: {
    provider: "Microsoft",
    examCode: "AI-901",
    officialSourceName:
      "Microsoft Learn — Study Guide for Exam AI-901 (skills measured as of April 15, 2026)",
    officialSourceUrl:
      "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-901",
    officialExamPageUrl:
      "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-fundamentals/",
    lastVerifiedAt: "2026-08-04",
    domains: [
      { name: "Identify AI concepts and capabilities", percentageMin: 40, percentageMax: 45 },
      { name: "Implement AI solutions by using Microsoft Foundry", percentageMin: 55, percentageMax: 60 },
    ],
  },

  title: {
    it: "Microsoft AI Fundamentals",
    en: "Microsoft AI Fundamentals",
    fr: "Microsoft AI Fondamentaux",
    es: "Fundamentos de IA de Microsoft",
  },

  level: {
    it: "Base",
    en: "Beginner",
    fr: "Débutant",
    es: "Básico",
  },

  description: {
    it: "Certificazione base sull'intelligenza artificiale.",
    en: "Foundational certification in artificial intelligence.",
    fr: "Certification de base en intelligence artificielle.",
    es: "Certificación básica en inteligencia artificial.",
  },

  metaTitle: {
    en: "Microsoft AI-901 Practice Test 2026 – Azure AI Fundamentals | CertifyQuiz",
    it: "Microsoft AI-901 Practice Test 2026 – AI Fundamentals in Italiano | CertifyQuiz",
    fr: "Microsoft AI-901 Test Pratique 2026 – Azure AI Fondamentaux | CertifyQuiz",
    es: "Microsoft AI-901 Practice Test 2026 – Azure AI Fundamentos | CertifyQuiz",
  },
  metaDescription: {
    en: "Prepare for the Microsoft AI-901 exam (formerly AI-900) with practice questions on AI concepts, machine learning, computer vision, NLP and generative AI. Start free.",
    it: "Preparati all'esame Microsoft AI-901 (ex AI-900) con quiz su concetti AI, machine learning, visione artificiale, NLP e AI generativa. Inizia gratis.",
    fr: "Préparez l'examen Microsoft AI-901 (anciennement AI-900) avec des quiz sur les concepts IA, machine learning, vision par ordinateur, NLP et IA générative. Commencez gratuitement.",
    es: "Prepárate para el examen Microsoft AI-901 (antes AI-900) con preguntas sobre conceptos de IA, machine learning, visión por computadora, NLP e IA generativa. Empieza gratis.",
  },

  topics: [
  {
    title: {
      it: "Concetti di AI",
      en: "AI Concepts",
      fr: "Concepts de l’IA",
      es: "Conceptos de IA",
    },
    slug: {
      it: "concetti-di-ai",
      en: "ai-concepts",
      fr: "concepts-de-lia",
      es: "conceptos-de-ia",
    },
  },
  {
    title: {
      it: "Machine learning su Azure",
      en: "Machine Learning on Azure",
      fr: "Apprentissage automatique sur Azure",
      es: "Aprendizaje automático en Azure",
    },
    slug: {
      it: "machine-learning-su-azure",
      en: "machine-learning-on-azure",
      fr: "apprentissage-automatique-sur-azure",
      es: "aprendizaje-automatico-en-azure",
    },
  },
  {
    title: {
      it: "Visione artificiale",
      en: "Computer Vision",
      fr: "Vision par ordinateur",
      es: "Visión por computadora",
    },
    slug: {
      it: "visione-artificiale",
      en: "computer-vision",
      fr: "vision-par-ordinateur",
      es: "vision-por-computadora",
    },
  },
  {
    title: {
      it: "Elaborazione del linguaggio naturale",
      en: "Natural Language Processing",
      fr: "Traitement du langage naturel",
      es: "Procesamiento de lenguaje natural",
    },
    slug: {
      it: "elaborazione-del-linguaggio-naturale",
      en: "natural-language-processing",
      fr: "traitement-du-langage-naturel",
      es: "procesamiento-de-lenguaje-natural",
    },
  },
  {
    title: {
      it: "AI generativa",
      en: "Generative AI",
      fr: "IA générative",
      es: "IA generativa",
    },
    slug: {
      it: "ai-generativa",
      en: "generative-ai",
      fr: "ia-generative",
      es: "ia-generativa",
    },
  },
],

  extraContent: {
    learn: {
      it: [
        "Concetti fondamentali dell’intelligenza artificiale.",
        "Differenze tra machine learning e deep learning.",
        "Servizi AI offerti da Microsoft Azure.",
        "Etica, responsabilità e uso corretto dell'AI.",
        "Casi d’uso reali nel business e nell’industria.",
      ],
      en: [
        "Fundamental concepts of artificial intelligence.",
        "Differences between machine learning and deep learning.",
        "AI services provided by Microsoft Azure.",
        "Ethics, responsibility, and proper use of AI.",
        "Real-world business and industry use cases.",
      ],
      fr: [
        "Concepts fondamentaux de l’intelligence artificielle.",
        "Différences entre machine learning et deep learning.",
        "Services d’IA proposés par Microsoft Azure.",
        "Éthique, responsabilité et bon usage de l’IA.",
        "Cas d’utilisation réels en entreprise et industrie.",
      ],
      es: [
        "Conceptos fundamentales de inteligencia artificial.",
        "Diferencias entre aprendizaje automático y profundo.",
        "Servicios de IA de Microsoft Azure.",
        "Ética, responsabilidad y uso adecuado de la IA.",
        "Casos de uso reales en empresas e industria.",
      ],
    },

    // 🔗 SOLO pagine d’esame ufficiali
    examReference: {
      it: [
        {
          text: "Esame AI-901: Microsoft Azure AI Fundamentals",
          url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-fundamentals/",
        },
      ],
      en: [
        {
          text: "Exam AI-901: Microsoft Azure AI Fundamentals",
          url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-fundamentals/",
        },
      ],
      fr: [
        {
          text: "Examen AI-901 : Microsoft Azure AI Fundamentals",
          url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-fundamentals/",
        },
      ],
      es: [
        {
          text: "Examen AI-901: Microsoft Azure AI Fundamentals",
          url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-fundamentals/",
        },
      ],
    },

    whyChoose: {
      it: [
        "Certificazione introduttiva perfetta per avvicinarsi al mondo dell’AI.",
        "Rilasciata da Microsoft, riconosciuta a livello globale.",
        "Non richiede competenze tecniche avanzate o esperienza.",
        "Ottima base per proseguire con percorsi Microsoft o di data science.",
      ],
      en: [
        "Perfect introductory certification for exploring AI.",
        "Issued by Microsoft and globally recognized.",
        "No prior technical expertise or experience required.",
        "Great foundation for Microsoft or data science tracks.",
      ],
      fr: [
        "Certification d’introduction idéale pour découvrir l’IA.",
        "Délivrée par Microsoft et reconnue mondialement.",
        "Aucune compétence technique avancée requise.",
        "Bonne base pour poursuivre en data science ou chez Microsoft.",
      ],
      es: [
        "Certificación introductoria perfecta para iniciarse en IA.",
        "Emitida por Microsoft y reconocida a nivel mundial.",
        "No requiere experiencia ni conocimientos técnicos previos.",
        "Excelente base para avanzar en rutas de Microsoft o ciencia de datos.",
      ],
    },

    faq: {
      it: [
        {
          q: "Serve esperienza in AI per affrontare l’esame?",
          a: "No, la certificazione è pensata proprio per chi parte da zero.",
        },
        {
          q: "Perché ora si chiama AI-901 e non più AI-900?",
          a: "Microsoft ha ritirato l'esame AI-900 il 30/06/2026 e lo ha sostituito con AI-901 il 15/04/2026, mantenendo la stessa certificazione \"Azure AI Fundamentals\". Chi ha già ottenuto la certificazione con AI-900 non deve rifare nulla.",
        },
        {
          q: "La certificazione ha una scadenza?",
          a: "Le certificazioni Microsoft di livello Fundamentals non scadono, ma Microsoft aggiorna periodicamente l'esame (come nel passaggio da AI-900 ad AI-901).",
        },
      ],
      en: [
        {
          q: "Do I need AI experience to take this exam?",
          a: "No, this certification is designed for beginners with no prior knowledge.",
        },
        {
          q: "Why is it AI-901 now instead of AI-900?",
          a: "Microsoft retired the AI-900 exam on 2026-06-30 and replaced it with AI-901 on 2026-04-15, under the same \"Azure AI Fundamentals\" certification. If you already earned the certification via AI-900, nothing changes for you.",
        },
        {
          q: "Does the certification expire?",
          a: "Microsoft Fundamentals-level certifications do not expire, but Microsoft periodically refreshes the exam itself (as with the AI-900 to AI-901 update).",
        },
      ],
      fr: [
        {
          q: "Faut-il de l’expérience en IA pour passer l’examen ?",
          a: "Non, cette certification est faite pour les débutants.",
        },
        {
          q: "Pourquoi est-ce AI-901 maintenant et non AI-900 ?",
          a: "Microsoft a retiré l'examen AI-900 le 30/06/2026 et l'a remplacé par AI-901 le 15/04/2026, sous la même certification \"Azure AI Fundamentals\". Si vous avez déjà obtenu la certification via AI-900, rien ne change pour vous.",
        },
        {
          q: "La certification a-t-elle une date d’expiration ?",
          a: "Les certifications Microsoft de niveau Fundamentals n'expirent pas, mais Microsoft met à jour périodiquement l'examen (comme le passage d'AI-900 à AI-901).",
        },
      ],
      es: [
        {
          q: "¿Necesito experiencia en IA para este examen?",
          a: "No, está pensada para principiantes sin conocimientos previos.",
        },
        {
          q: "¿Por qué ahora es AI-901 y no AI-900?",
          a: "Microsoft retiró el examen AI-900 el 30/06/2026 y lo reemplazó por AI-901 el 15/04/2026, bajo la misma certificación \"Azure AI Fundamentals\". Si ya obtuviste la certificación con AI-900, no cambia nada para ti.",
        },
        {
          q: "¿La certificación tiene fecha de vencimiento?",
          a: "Las certificaciones Microsoft de nivel Fundamentals no caducan, pero Microsoft actualiza periódicamente el examen (como en el paso de AI-900 a AI-901).",
        },
      ],
    },
  },

  // Rotte quiz localizzate
quizRoute: {
  it: "/it/quiz/microsoft-ai",
  en: "/en/quiz/microsoft-ai",
  fr: "/fr/quiz/microsoft-ai",
  es: "/es/quiz/microsoft-ai",
},

// Rotta “indietro” alla lista certificazioni
backRoute: {
  it: "/it/certificazioni",
  en: "/certifications",
  fr: "/fr/certifications",
  es: "/es/certificaciones",
},
} as const;

export default MicrosoftAIFundamentals;
