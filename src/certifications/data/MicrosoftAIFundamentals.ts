// src/certifications/data/microsoft-ai-fundamentals.ts
// ✅ Modulo dati puro per il renderer server (no React/JSX, no router).

const MicrosoftAIFundamentals = {
  slug: "microsoft-ai-fundamentals",
  imageUrl: "/images/certifications/ai-fundamentals-icon.png",

  // 🔗 Pagina ufficiale dell’esame (AI-900)
  officialUrl:
    "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-fundamentals/",

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

  topics: [
    { it: "AI di base", en: "Basic AI", fr: "IA de base", es: "IA básica" },
    { it: "Machine Learning", en: "Machine Learning", fr: "Apprentissage automatique", es: "Aprendizaje automático" },
    { it: "Etica e AI", en: "AI Ethics", fr: "Éthique de l'IA", es: "Ética de la IA" },
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
          text: "Esame AI-900: Microsoft Azure AI Fundamentals",
          url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-fundamentals/",
        },
      ],
      en: [
        {
          text: "Exam AI-900: Microsoft Azure AI Fundamentals",
          url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-fundamentals/",
        },
      ],
      fr: [
        {
          text: "Examen AI-900 : Microsoft Azure AI Fundamentals",
          url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-fundamentals/",
        },
      ],
      es: [
        {
          text: "Examen AI-900: Microsoft Azure AI Fundamentals",
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
          q: "La certificazione ha una scadenza?",
          a: "Al momento non ha una scadenza ufficiale, ma Microsoft può aggiornarla periodicamente.",
        },
      ],
      en: [
        {
          q: "Do I need AI experience to take this exam?",
          a: "No, this certification is designed for beginners with no prior knowledge.",
        },
        {
          q: "Does the certification expire?",
          a: "It currently has no official expiration, but Microsoft may update it over time.",
        },
      ],
      fr: [
        {
          q: "Faut-il de l’expérience en IA pour passer l’examen ?",
          a: "Non, cette certification est faite pour les débutants.",
        },
        {
          q: "La certification a-t-elle une date d’expiration ?",
          a: "Elle n’a pas de date limite officielle, mais Microsoft peut la mettre à jour.",
        },
      ],
      es: [
        {
          q: "¿Necesito experiencia en IA para este examen?",
          a: "No, está pensada para principiantes sin conocimientos previos.",
        },
        {
          q: "¿La certificación tiene fecha de vencimiento?",
          a: "Actualmente no tiene una fecha oficial, pero Microsoft puede actualizarla con el tiempo.",
        },
      ],
    },
  },

  // Rotte quiz localizzate
  quizRoute: {
    it: "/it/quiz/ai-fundamentals",
    en: "/en/quiz/ai-fundamentals",
    fr: "/fr/quiz/ai-fundamentals",
    es: "/es/quiz/ai-fundamentals",
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
