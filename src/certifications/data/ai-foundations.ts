// src/certifications/data/ai-foundations.ts
// 🔥 CertifyQuiz proprietary certification – AI beginner path.
// Data-only file: no JSX, no router logic, no DB IDs.

const AIFoundations = {
  slug: "ai-foundations",
  imageUrl: "/images/certifications/ai-foundations.png",
  officialUrl: "https://certifyquiz.com/en/certifications/ai-foundations",

  levelOrder: 1, // for sorting in hub/filter

  title: {
    it: "AI Foundations – Impara le Basi dell'Intelligenza Artificiale",
    en: "AI Foundations – Learn Artificial Intelligence Basics",
    fr: "Fondamentaux IA – Apprenez les Bases de l'Intelligence Artificielle",
    es: "Fundamentos de IA – Aprende las Bases de la Inteligencia Artificial",
  },

  level: {
    it: "Base",
    en: "Beginner",
    fr: "Débutant",
    es: "Principiante",
  },

  description: {
    it: "Il punto di partenza per capire l'AI in modo pratico. Percorso CertifyQuiz su intelligenza artificiale, machine learning, LLM, prompt engineering, casi d'uso reali e AI responsabile. Nessuna programmazione richiesta.",
    en: "The starting point to understand AI practically. CertifyQuiz path covering artificial intelligence, machine learning, LLMs, prompt engineering, real-world use cases, and responsible AI. No coding required.",
    fr: "Le point de départ pour comprendre l'IA de façon pratique. Parcours CertifyQuiz sur l'intelligence artificielle, le machine learning, les LLM, le prompt engineering, les cas d'usage réels et l'IA responsable. Aucune programmation requise.",
    es: "El punto de partida para entender la IA de forma práctica. Ruta CertifyQuiz sobre inteligencia artificial, machine learning, LLM, prompt engineering, casos de uso reales e IA responsable. Sin programación.",
  },

  // ─── SEO ────────────────────────────────────────────────────────────────────

  metaTitle: {
    it: "Quiz AI Foundations 2026 – Basi di Intelligenza Artificiale | CertifyQuiz",
    en: "AI Foundations Quiz 2026 – Artificial Intelligence Basics | CertifyQuiz",
    fr: "Quiz Fondamentaux IA 2026 – Bases de l'Intelligence Artificielle | CertifyQuiz",
    es: "Quiz Fundamentos de IA 2026 – Bases de Inteligencia Artificial | CertifyQuiz",
  },

  metaDescription: {
    it: "Impara AI, machine learning, LLM e prompt engineering con quiz pratici gratuiti. Percorso base ideale prima di AI-900 o AWS AI Practitioner. Inizia gratis su CertifyQuiz.",
    en: "Learn AI, machine learning, LLMs and prompt engineering with free practice quizzes. Ideal foundation before AI-900 or AWS AI Practitioner. Start free on CertifyQuiz.",
    fr: "Apprenez l'IA, le machine learning, les LLM et le prompt engineering avec des quiz gratuits. Base idéale avant AI-900 ou AWS AI Practitioner. Commencez gratuitement sur CertifyQuiz.",
    es: "Aprende IA, machine learning, LLM y prompt engineering con quizzes gratuitos. Base ideal antes de AI-900 o AWS AI Practitioner. Empieza gratis en CertifyQuiz.",
  },

  // ─── TOPICS ─────────────────────────────────────────────────────────────────

  topics: [
    {
      title: {
        it: "Fondamenti di intelligenza artificiale",
        en: "Artificial Intelligence Fundamentals",
        fr: "Fondamentaux de l'intelligence artificielle",
        es: "Fundamentos de inteligencia artificial",
      },
      slug: {
        it: "fondamenti-intelligenza-artificiale",
        en: "artificial-intelligence-fundamentals",
        fr: "fondamentaux-intelligence-artificielle",
        es: "fundamentos-inteligencia-artificial",
      },
    },
    {
      title: {
        it: "Machine Learning e Deep Learning",
        en: "Machine Learning and Deep Learning",
        fr: "Machine Learning et Deep Learning",
        es: "Machine Learning y Deep Learning",
      },
      slug: {
        it: "machine-learning-deep-learning",
        en: "machine-learning-deep-learning",
        fr: "machine-learning-deep-learning",
        es: "machine-learning-deep-learning",
      },
    },
    {
      title: {
        it: "LLM e Prompt Engineering",
        en: "LLMs and Prompt Engineering",
        fr: "LLM et Prompt Engineering",
        es: "LLM y Prompt Engineering",
      },
      slug: {
        it: "llm-e-prompt-engineering",
        en: "llm-and-prompt-engineering",
        fr: "llm-et-prompt-engineering",
        es: "llm-y-prompt-engineering",
      },
    },
    {
      title: {
        it: "AI nel mondo reale",
        en: "AI in the Real World",
        fr: "L'IA dans le monde réel",
        es: "La IA en el mundo real",
      },
      slug: {
        it: "ai-nel-mondo-reale",
        en: "ai-in-the-real-world",
        fr: "ia-dans-le-monde-reel",
        es: "ia-en-el-mundo-real",
      },
    },
    {
      title: {
        it: "AI responsabile, etica e sicurezza",
        en: "Responsible AI, Ethics and Security",
        fr: "IA responsable, éthique et sécurité",
        es: "IA responsable, ética y seguridad",
      },
      slug: {
        it: "ai-responsabile-etica-sicurezza",
        en: "responsible-ai-ethics-security",
        fr: "ia-responsable-ethique-securite",
        es: "ia-responsable-etica-seguridad",
      },
    },
  ],

  // ─── EXTRA CONTENT ──────────────────────────────────────────────────────────

  extraContent: {
    learn: {
      it: [
        "Distinguere AI, machine learning, deep learning e AI generativa con esempi concreti.",
        "Capire come funzionano dataset, training, inference e valutazione di un modello.",
        "Scrivere prompt più chiari ed efficaci per ChatGPT, Copilot e altri strumenti AI.",
        "Riconoscere i casi d'uso reali dell'AI in azienda, nel marketing, nella medicina e nell'istruzione.",
        "Comprendere rischi, bias algoritmici, privacy e principi di AI responsabile.",
      ],
      en: [
        "Distinguish AI, machine learning, deep learning, and generative AI with concrete examples.",
        "Understand how datasets, training, inference, and model evaluation work.",
        "Write clearer and more effective prompts for ChatGPT, Copilot, and other AI tools.",
        "Recognize real AI use cases in business, marketing, healthcare, and education.",
        "Understand risks, algorithmic bias, privacy, and responsible AI principles.",
      ],
      fr: [
        "Distinguer l'IA, le machine learning, le deep learning et l'IA générative avec des exemples concrets.",
        "Comprendre le fonctionnement des datasets, de l'entraînement, de l'inférence et de l'évaluation des modèles.",
        "Rédiger des prompts plus clairs et efficaces pour ChatGPT, Copilot et d'autres outils IA.",
        "Identifier les cas d'usage réels de l'IA en entreprise, dans le marketing, la santé et l'éducation.",
        "Comprendre les risques, les biais algorithmiques, la confidentialité et les principes d'IA responsable.",
      ],
      es: [
        "Distinguir IA, machine learning, deep learning e IA generativa con ejemplos concretos.",
        "Entender cómo funcionan los datasets, el entrenamiento, la inferencia y la evaluación de modelos.",
        "Escribir prompts más claros y eficaces para ChatGPT, Copilot y otras herramientas de IA.",
        "Reconocer casos de uso reales de la IA en empresas, marketing, salud y educación.",
        "Comprender riesgos, sesgos algorítmicos, privacidad y principios de IA responsable.",
      ],
    },

    examReference: {
      it: [
        {
          text: "AI Foundations by CertifyQuiz — Percorso proprietario",
          url: "https://certifyquiz.com/it/certificazioni/ai-foundations",
        },
      ],
      en: [
        {
          text: "AI Foundations by CertifyQuiz — Proprietary learning path",
          url: "https://certifyquiz.com/en/certifications/ai-foundations",
        },
      ],
      fr: [
        {
          text: "Fondamentaux IA par CertifyQuiz — Parcours propriétaire",
          url: "https://certifyquiz.com/fr/certifications/ai-foundations",
        },
      ],
      es: [
        {
          text: "Fundamentos de IA por CertifyQuiz — Ruta propia",
          url: "https://certifyquiz.com/es/certifications/ai-foundations",
        },
      ],
    },

    whyChoose: {
      it: [
        "Percorso pratico pensato per chi parte da zero: nessuna programmazione richiesta.",
        "Base solida prima di certificazioni ufficiali come AI-900, AWS AI Practitioner o Google AI Essentials.",
        "Copre LLM e prompt engineering, competenze già richieste in quasi tutti i settori.",
        "Ideale per aziende che vogliono costruire AI literacy nei propri team.",
        "Quiz aggiornati al 2026 con scenari reali, non solo teoria.",
      ],
      en: [
        "Practical path for absolute beginners — no coding required.",
        "Solid foundation before official certifications like AI-900, AWS AI Practitioner, or Google AI Essentials.",
        "Covers LLMs and prompt engineering, skills now in demand across every industry.",
        "Ideal for companies looking to build AI literacy across their teams.",
        "Quizzes updated for 2026 with real-world scenarios, not just theory.",
      ],
      fr: [
        "Parcours pratique pour les débutants complets — aucune programmation requise.",
        "Base solide avant les certifications officielles comme AI-900, AWS AI Practitioner ou Google AI Essentials.",
        "Couvre les LLM et le prompt engineering, des compétences désormais demandées dans tous les secteurs.",
        "Idéal pour les entreprises qui souhaitent développer la culture IA de leurs équipes.",
        "Quiz mis à jour en 2026 avec des scénarios réels, pas seulement de la théorie.",
      ],
      es: [
        "Ruta práctica para principiantes absolutos — sin programación.",
        "Base sólida antes de certificaciones oficiales como AI-900, AWS AI Practitioner o Google AI Essentials.",
        "Cubre LLM y prompt engineering, habilidades ya demandadas en todos los sectores.",
        "Ideal para empresas que quieren desarrollar la cultura IA en sus equipos.",
        "Quizzes actualizados en 2026 con escenarios reales, no solo teoría.",
      ],
    },

    faq: {
      it: [
        {
          q: "Questa certificazione è riconosciuta da Microsoft, AWS o Google?",
          a: "No. È una certificazione proprietaria CertifyQuiz pensata come percorso pratico introduttivo. È il punto di partenza ideale prima di affrontare certificazioni ufficiali come AI-900, AWS AI Practitioner o Google AI Essentials.",
        },
        {
          q: "Serve saper programmare?",
          a: "No. Il percorso è progettato per principianti assoluti, professionisti non tecnici e chiunque voglia capire l'AI in modo pratico e applicato, senza scrivere codice.",
        },
        {
          q: "Quanto tempo ci vuole per completarlo?",
          a: "Dipende dal tuo ritmo, ma la maggior parte degli utenti completa il percorso in 5–10 ore totali, suddivise in sessioni brevi.",
        },
        {
          q: "È utile per le aziende?",
          a: "Sì. È ideale per formare team su concetti AI, prompt engineering, rischi, privacy e casi d'uso concreti. Contattaci per il piano Team.",
        },
      ],
      en: [
        {
          q: "Is this certification recognized by Microsoft, AWS, or Google?",
          a: "No. It is a CertifyQuiz proprietary certification designed as a practical introductory path. It is the ideal starting point before pursuing official certifications like AI-900, AWS AI Practitioner, or Google AI Essentials.",
        },
        {
          q: "Do I need programming skills?",
          a: "No. The path is designed for absolute beginners, non-technical professionals, and anyone who wants to understand AI practically — no coding required.",
        },
        {
          q: "How long does it take to complete?",
          a: "It depends on your pace, but most users complete the path in 5–10 hours total, split across short sessions.",
        },
        {
          q: "Is it useful for companies?",
          a: "Yes. It is ideal for training teams on AI concepts, prompt engineering, risks, privacy, and real-world use cases. Contact us about the Team plan.",
        },
      ],
      fr: [
        {
          q: "Cette certification est-elle reconnue par Microsoft, AWS ou Google ?",
          a: "Non. C'est une certification propriétaire CertifyQuiz conçue comme parcours pratique d'introduction. C'est le point de départ idéal avant de passer des certifications officielles comme AI-900, AWS AI Practitioner ou Google AI Essentials.",
        },
        {
          q: "Faut-il savoir programmer ?",
          a: "Non. Le parcours est conçu pour les débutants complets, les profils non techniques et toute personne souhaitant comprendre l'IA de façon pratique — sans écrire de code.",
        },
        {
          q: "Combien de temps faut-il pour le terminer ?",
          a: "Cela dépend de votre rythme, mais la plupart des utilisateurs terminent le parcours en 5 à 10 heures au total, réparties en courtes sessions.",
        },
        {
          q: "Est-ce utile pour les entreprises ?",
          a: "Oui. C'est idéal pour former les équipes aux concepts IA, au prompt engineering, aux risques, à la confidentialité et aux cas d'usage concrets. Contactez-nous pour le plan Team.",
        },
      ],
      es: [
        {
          q: "¿Esta certificación está reconocida por Microsoft, AWS o Google?",
          a: "No. Es una certificación propia de CertifyQuiz pensada como ruta práctica introductoria. Es el punto de partida ideal antes de afrontar certificaciones oficiales como AI-900, AWS AI Practitioner o Google AI Essentials.",
        },
        {
          q: "¿Necesito saber programar?",
          a: "No. La ruta está diseñada para principiantes absolutos, perfiles no técnicos y cualquier persona que quiera entender la IA de forma práctica — sin escribir código.",
        },
        {
          q: "¿Cuánto tiempo se tarda en completarla?",
          a: "Depende de tu ritmo, pero la mayoría de los usuarios completan la ruta en 5–10 horas en total, distribuidas en sesiones cortas.",
        },
        {
          q: "¿Es útil para empresas?",
          a: "Sí. Es ideal para formar equipos en conceptos de IA, prompt engineering, riesgos, privacidad y casos de uso reales. Contáctanos para el plan Team.",
        },
      ],
    },
  },

  // ─── ROUTES ─────────────────────────────────────────────────────────────────

  quizRoute: {
    it: "/it/quiz/ai-foundations",
    en: "/en/quiz/ai-foundations",
    fr: "/fr/quiz/ai-foundations",
    es: "/es/quiz/ai-foundations",
  },

  backRoute: {
    it: "/it/certificazioni",
    en: "/en/certifications",
    fr: "/fr/certifications",
    es: "/es/certifications",
  },
} as const;

export default AIFoundations;