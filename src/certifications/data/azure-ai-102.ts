// src/certifications/data/azure-ai-102.ts
// SEO-optimized version – data-only (no JSX/router).

const AZURE_AI_102 = {
  slug: "azure-ai-102-ai-engineer-associate",
  imageUrl: "/images/certifications/azure-ai-102.png",
  officialUrl:
    "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-apps-and-agents-developer-associate/",

  // Verificato il 2026-08-04. Microsoft ha ritirato AI-102 (Azure AI Engineer
  // Associate) il 2026-06-30 e lo ha sostituito con AI-103, sotto la
  // certificazione RINOMINATA "Azure AI Apps and Agents Developer Associate"
  // (più enfasi su agenti AI e Microsoft Foundry). Slug e quizRoute restano
  // invariati per non rompere URL/backlink esistenti.
  examBlueprint: {
    provider: "Microsoft",
    examCode: "AI-103",
    officialSourceName:
      "Microsoft Learn — Study Guide for Exam AI-103 (skills measured as of April 16, 2026)",
    officialSourceUrl:
      "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-103",
    officialExamPageUrl:
      "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-apps-and-agents-developer-associate/",
    lastVerifiedAt: "2026-08-04",
    domains: [
      { name: "Plan and manage an Azure AI solution", percentageMin: 25, percentageMax: 30 },
      { name: "Implement generative AI and agentic solutions", percentageMin: 30, percentageMax: 35 },
      { name: "Implement computer vision solutions", percentageMin: 10, percentageMax: 15 },
      { name: "Implement text analysis solutions", percentageMin: 10, percentageMax: 15 },
      { name: "Implement information extraction solutions", percentageMin: 10, percentageMax: 15 },
    ],
  },

  title: {
    it: "Azure AI-103 – Quiz e Simulazione Esame AI Apps and Agents Developer",
    en: "AI-103 Practice Test 2026 – Azure AI Apps and Agents Developer",
    fr: "Azure AI-103 – Quiz et Simulation Examen AI Apps and Agents Developer",
    es: "Azure AI-103 – Quiz y Simulación de Examen AI Apps and Agents Developer",
  },

  level: {
    it: "Intermedio",
    en: "Intermediate",
    fr: "Intermédiaire",
    es: "Intermedio",
  },

  description: {
    it: "Preparati all'esame Microsoft Azure AI-103 Azure AI Apps and Agents Developer Associate (ex AI-102) con quiz in stile esame, modalità training e simulazioni. Allenati su Microsoft Foundry, soluzioni agentic e generative AI, visione artificiale, analisi testo e knowledge mining.",
    en: "Practice for the Microsoft Azure AI-103 Azure AI Apps and Agents Developer Associate exam (formerly AI-102) with exam-style questions, training mode, and realistic practice across Microsoft Foundry, generative AI and agentic solutions, computer vision, text analysis, and information extraction.",
    fr: "Préparez l'examen Microsoft Azure AI-103 Azure AI Apps and Agents Developer Associate (anciennement AI-102) avec des quiz type examen, un mode entraînement et des séries réalistes sur Microsoft Foundry, solutions generative AI et agentic, vision par ordinateur, analyse de texte et knowledge mining.",
    es: "Prepárate para el examen Microsoft Azure AI-103 Azure AI Apps and Agents Developer Associate (antes AI-102) con quizzes tipo examen, modo entrenamiento y práctica realista sobre Microsoft Foundry, soluciones generative AI y agentic, visión artificial, análisis de texto y knowledge mining.",
  },

  metaTitle: {
    it: "AI-103 – Quiz e Simulazione Esame Azure AI Apps and Agents | CertifyQuiz",
    en: "AI-103 Practice Test – Azure AI Apps and Agents Questions | CertifyQuiz",
    fr: "AI-103 – Quiz et Simulation Examen Azure AI Apps and Agents | CertifyQuiz",
    es: "AI-103 – Quiz y Simulacro Examen Azure AI Apps and Agents | CertifyQuiz",
  },

  metaDescription: {
    it: "Preparati all'esame Azure AI-103 (ex AI-102) con quiz in stile esame: Microsoft Foundry, agenti AI, computer vision, analisi testo e knowledge mining. Inizia gratis.",
    en: "Practice for Azure AI-103 (formerly AI-102) with exam-style questions. Covers Microsoft Foundry, AI agents, computer vision, text analysis and information extraction. Start free.",
    fr: "Préparez l'examen Azure AI-103 (anciennement AI-102) avec des quiz type examen : Microsoft Foundry, agents IA, vision par ordinateur, analyse de texte et knowledge mining. Commencez gratuitement.",
    es: "Prepárate para el examen Azure AI-103 (antes AI-102) con quizzes tipo examen: Microsoft Foundry, agentes de IA, visión artificial, análisis de texto y knowledge mining. Empieza gratis.",
  },

  topics: [
    {
      title: {
        it: "Pianificazione e gestione di soluzioni Azure AI",
        en: "Planning and Managing Azure AI Solutions",
        fr: "Planification et gestion des solutions Azure AI",
        es: "Planificación y gestión de soluciones Azure AI",
      },
      slug: {
        it: "pianificazione-e-gestione-di-soluzioni-azure-ai",
        en: "planning-and-managing-azure-ai-solutions",
        fr: "planification-et-gestion-des-solutions-azure-ai",
        es: "planificacion-y-gestion-de-soluciones-azure-ai",
      },
    },
    {
      title: {
        it: "Visione artificiale",
        en: "Computer Vision",
        fr: "Vision par ordinateur",
        es: "Visión artificial",
      },
      slug: {
        it: "visione-artificiale",
        en: "computer-vision",
        fr: "vision-par-ordinateur",
        es: "vision-artificial",
      },
    },
    {
      title: {
        it: "Elaborazione del linguaggio naturale",
        en: "Natural Language Processing",
        fr: "Traitement du langage naturel",
        es: "Procesamiento del lenguaje natural",
      },
      slug: {
        it: "elaborazione-del-linguaggio-naturale",
        en: "natural-language-processing",
        fr: "traitement-du-langage-naturel",
        es: "procesamiento-del-lenguaje-natural",
      },
    },
    {
      title: {
        it: "Speech",
        en: "Speech",
        fr: "Speech",
        es: "Speech",
      },
      slug: {
        it: "speech",
        en: "speech",
        fr: "speech",
        es: "speech",
      },
    },
    {
      title: {
        it: "Knowledge Mining e Document Intelligence",
        en: "Knowledge Mining and Document Intelligence",
        fr: "Knowledge Mining et Document Intelligence",
        es: "Knowledge Mining y Document Intelligence",
      },
      slug: {
        it: "knowledge-mining-e-document-intelligence",
        en: "knowledge-mining-and-document-intelligence",
        fr: "knowledge-mining-et-document-intelligence",
        es: "knowledge-mining-y-document-intelligence",
      },
    },
    {
      title: {
        it: "AI generativa con Azure OpenAI",
        en: "Generative AI with Azure OpenAI",
        fr: "IA générative avec Azure OpenAI",
        es: "IA generativa con Azure OpenAI",
      },
      slug: {
        it: "ai-generativa-con-azure-openai",
        en: "generative-ai-with-azure-openai",
        fr: "ia-generativa-avec-azure-openai",
        es: "ia-generativa-con-azure-openai",
      },
    },
  ],

  extraContent: {
    learn: {
      it: [
        "Pianificare e proteggere soluzioni Azure AI: risorse, chiavi, identità gestite, container e monitoraggio.",
        "Usare Azure AI Vision e Custom Vision: analisi immagini, OCR, classificazione e object detection.",
        "Padroneggiare Azure AI Language: sentiment, NER, CLU, question answering e traduzione.",
        "Costruire soluzioni vocali con speech-to-text, text-to-speech, SSML e traduzione vocale.",
        "Implementare RAG con Azure AI Search, Document Intelligence e Azure OpenAI.",
      ],
      en: [
        "Plan and secure Azure AI solutions: resources, keys, managed identities, containers, and monitoring.",
        "Use Azure AI Vision and Custom Vision: image analysis, OCR, classification, and object detection.",
        "Master Azure AI Language: sentiment, NER, CLU, question answering, and translation.",
        "Build speech solutions with speech-to-text, text-to-speech, SSML, and speech translation.",
        "Implement RAG with Azure AI Search, Document Intelligence, and Azure OpenAI.",
      ],
      fr: [
        "Planifier et sécuriser des solutions Azure AI : ressources, clés, identités managées, conteneurs et supervision.",
        "Utiliser Azure AI Vision et Custom Vision : analyse d'images, OCR, classification et détection d'objets.",
        "Maîtriser Azure AI Language : sentiment, NER, CLU, question answering et traduction.",
        "Créer des solutions vocales avec speech-to-text, text-to-speech, SSML et traduction vocale.",
        "Implémenter la RAG avec Azure AI Search, Document Intelligence et Azure OpenAI.",
      ],
      es: [
        "Planificar y proteger soluciones de Azure AI: recursos, claves, identidades administradas, contenedores y monitorización.",
        "Usar Azure AI Vision y Custom Vision: análisis de imágenes, OCR, clasificación y detección de objetos.",
        "Dominar Azure AI Language: sentiment, NER, CLU, question answering y traducción.",
        "Crear soluciones de voz con speech-to-text, text-to-speech, SSML y traducción de voz.",
        "Implementar RAG con Azure AI Search, Document Intelligence y Azure OpenAI.",
      ],
    },

    examReference: {
      it: [
        {
          text: "Microsoft AI-103: Azure AI Apps and Agents Developer Associate — Pagina ufficiale dell'esame",
          url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-apps-and-agents-developer-associate/",
        },
      ],
      en: [
        {
          text: "Microsoft AI-103: Azure AI Apps and Agents Developer Associate — Official exam page",
          url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-apps-and-agents-developer-associate/",
        },
      ],
      fr: [
        {
          text: "Microsoft AI-103 : Azure AI Apps and Agents Developer Associate — Page officielle de l'examen",
          url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-apps-and-agents-developer-associate/",
        },
      ],
      es: [
        {
          text: "Microsoft AI-103: Azure AI Apps and Agents Developer Associate — Página oficial del examen",
          url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-apps-and-agents-developer-associate/",
        },
      ],
    },

    whyChoose: {
      it: [
        "La certificazione Microsoft di riferimento per chi sviluppa agenti e soluzioni AI su Azure con Microsoft Foundry.",
        "Ottima per ruoli AI Engineer, Cloud Developer e Solution Architect orientati all'AI.",
        "Copre competenze molto richieste: agenti AI, RAG e Microsoft Foundry.",
        "Passo successivo naturale dopo AI-901 Azure AI Fundamentals.",
      ],
      en: [
        "The reference Microsoft certification for building AI agents and solutions on Azure with Microsoft Foundry.",
        "Great for AI engineer, cloud developer, and AI-focused solution architect roles.",
        "Covers in-demand skills: AI agents, RAG, and Microsoft Foundry.",
        "The natural next step after AI-901 Azure AI Fundamentals.",
      ],
      fr: [
        "La certification Microsoft de référence pour développer des agents et solutions IA sur Azure avec Microsoft Foundry.",
        "Idéale pour les rôles AI engineer, cloud developer et solution architect orientés IA.",
        "Couvre des compétences très demandées : agents IA, RAG et Microsoft Foundry.",
        "L'étape naturelle après AI-901 Azure AI Fundamentals.",
      ],
      es: [
        "La certificación Microsoft de referencia para desarrollar agentes y soluciones de IA en Azure con Microsoft Foundry.",
        "Ideal para roles de AI engineer, cloud developer y solution architect orientados a la IA.",
        "Cubre competencias muy demandadas: agentes de IA, RAG y Microsoft Foundry.",
        "El paso natural después de AI-901 Azure AI Fundamentals.",
      ],
    },

    faq: {
      it: [
        {
          q: "AI-103 conviene nel 2026?",
          a: "Sì. È la certificazione Microsoft per gli AI Engineer e copre Microsoft Foundry, agenti AI, RAG, visione artificiale, analisi testo e knowledge mining.",
        },
        {
          q: "AI-103 è la stessa cosa di AI-102?",
          a: "È il suo successore diretto: Microsoft ha ritirato AI-102 (Azure AI Engineer Associate) il 30/06/2026 e lo ha sostituito con AI-103, sotto la certificazione rinominata \"Azure AI Apps and Agents Developer Associate\", con più enfasi su agenti AI e Microsoft Foundry.",
        },
        {
          q: "Serve prima AI-901?",
          a: "Non è obbligatoria, ma è consigliata se parti da zero. AI-103 è più tecnica e presuppone familiarità con Azure, API, SDK e basi di programmazione.",
        },
        {
          q: "Quali argomenti copre AI-103?",
          a: "Copre pianificazione e gestione di soluzioni Azure AI, generative AI e soluzioni agentic, computer vision, analisi testo e knowledge mining/information extraction.",
        },
      ],
      en: [
        {
          q: "Is AI-103 worth it?",
          a: "Yes. It is Microsoft's certification for AI engineers and covers Microsoft Foundry, AI agents, RAG, computer vision, text analysis, and information extraction.",
        },
        {
          q: "Is AI-103 the same as AI-102?",
          a: "It is its direct successor: Microsoft retired AI-102 (Azure AI Engineer Associate) on 2026-06-30 and replaced it with AI-103, under the renamed \"Azure AI Apps and Agents Developer Associate\" certification, with more emphasis on AI agents and Microsoft Foundry.",
        },
        {
          q: "Do I need AI-901 first?",
          a: "It is not mandatory, but recommended if you are starting from scratch. AI-103 is more technical and assumes familiarity with Azure, APIs, SDKs, and programming basics.",
        },
        {
          q: "What topics does AI-103 cover?",
          a: "It covers planning and managing Azure AI solutions, generative AI and agentic solutions, computer vision, text analysis, and information extraction/knowledge mining.",
        },
      ],
      fr: [
        {
          q: "L'AI-103 vaut-elle le coup ?",
          a: "Oui. C'est la certification Microsoft pour les AI engineers et elle couvre Microsoft Foundry, les agents IA, la RAG, la vision par ordinateur, l'analyse de texte et le knowledge mining.",
        },
        {
          q: "L'AI-103 est-elle la même chose que l'AI-102 ?",
          a: "C'est son successeur direct : Microsoft a retiré l'AI-102 (Azure AI Engineer Associate) le 30/06/2026 et l'a remplacée par l'AI-103, sous la certification renommée \"Azure AI Apps and Agents Developer Associate\", avec plus d'accent sur les agents IA et Microsoft Foundry.",
        },
        {
          q: "Faut-il passer AI-901 d'abord ?",
          a: "Ce n'est pas obligatoire, mais recommandé si vous débutez. AI-103 est plus technique et suppose une familiarité avec Azure, les API, les SDK et les bases de programmation.",
        },
        {
          q: "Quels sujets couvre AI-103 ?",
          a: "Elle couvre la planification et la gestion de solutions Azure AI, les solutions generative AI et agentic, la vision par ordinateur, l'analyse de texte et le knowledge mining/information extraction.",
        },
      ],
      es: [
        {
          q: "¿Vale la pena AI-103?",
          a: "Sí. Es la certificación Microsoft para AI engineers y cubre Microsoft Foundry, agentes de IA, RAG, visión artificial, análisis de texto y knowledge mining.",
        },
        {
          q: "¿AI-103 es lo mismo que AI-102?",
          a: "Es su sucesor directo: Microsoft retiró AI-102 (Azure AI Engineer Associate) el 30/06/2026 y lo reemplazó por AI-103, bajo la certificación renombrada \"Azure AI Apps and Agents Developer Associate\", con más énfasis en agentes de IA y Microsoft Foundry.",
        },
        {
          q: "¿Necesito AI-901 primero?",
          a: "No es obligatoria, pero sí recomendable si empiezas de cero. AI-103 es más técnica y presupone familiaridad con Azure, APIs, SDKs y bases de programación.",
        },
        {
          q: "¿Qué temas cubre AI-103?",
          a: "Cubre planificación y gestión de soluciones Azure AI, soluciones generative AI y agentic, visión artificial, análisis de texto y knowledge mining/information extraction.",
        },
      ],
    },
  },

  quizRoute: {
    it: "/it/quiz/azure-ai-102-ai-engineer-associate",
    en: "/en/quiz/azure-ai-102-ai-engineer-associate",
    fr: "/fr/quiz/azure-ai-102-ai-engineer-associate",
    es: "/es/quiz/azure-ai-102-ai-engineer-associate",
  },

  backRoute: {
    it: "/it/certificazioni",
    en: "/certifications",
    fr: "/fr/certifications",
    es: "/es/certifications",
  },
} as const;

export default AZURE_AI_102;