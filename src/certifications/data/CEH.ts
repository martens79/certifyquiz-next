// src/certifications/data/ceh.ts
// 🔥 CEH SEO KILLER – Practice Test Intent – Multi-language
// Data-only per CertificationPage (server). Nessun JSX/Router.

const CEH = {
  slug: "ceh",
  imageUrl: "/images/certifications/ceh.png",

  officialUrl:
    "https://www.eccouncil.org/train-certify/certified-ethical-hacker-ceh/",

  title: {
    it: "CEH Practice Test 2026 – Oltre 1000 Domande Tipo Esame (312-50)",
    en: "CEH Practice Test 2026 – 1000+ Real Exam Questions (312-50)",
    // ✅ CLICK MAGNET (match “ceh test pratique” + “qcm” + “simulation 125”)
    fr: "CEH Test Pratique 2026 – 1000+ QCM (Simulation 125 Questions)",
    es: "CEH Practice Test 2026 – Más de 1000 Preguntas Tipo Examen (312-50)",
  },

  level: {
    it: "Intermedio",
    en: "Intermediate",
    fr: "Intermédiaire",
    es: "Intermedio",
  },

  // Nota SEO/CTR:
  // - numero grande "1000+"
  // - CEH + 312-50
  // - exam simulation 125 timed
  // - mixed quizzes
  description: {
    it: "Preparati al CEH 312-50 con oltre 1000 domande tipo esame. Modalità training completa, simulazione cronometrata da 125 domande e quiz misti per misurare la tua preparazione reale (non teoria generica).",
    en: "Prepare for CEH 312-50 with 1000+ real exam-style questions. Full training mode, realistic 125-question timed simulation, and mixed quizzes to measure real readiness (not generic theory).",
    // ✅ aggiunge “test pratique CEH” + “préparation examen” senza spam
    fr: "Préparez le CEH 312-50 avec plus de 1000 questions type examen (QCM). Idéal comme test pratique CEH, avec mode entraînement complet, simulation chronométrée de 125 questions et quiz mixtes pour une préparation examen réaliste.",
    es: "Prepárate para CEH 312-50 con más de 1000 preguntas tipo examen. Modo entrenamiento completo, simulación cronometrada de 125 preguntas y cuestionarios mixtos para medir tu preparación real.",
  },

  // Se i topic DB sono questi 5, lasciali così (meglio coerenza con quizRoute/topic mapping).
  topics: [
    {
      it: "Metodologie di hacking etico",
      en: "Ethical Hacking Methodologies",
      fr: "Méthodologies de hacking éthique",
      es: "Metodologías de hacking ético",
    },
    {
      it: "Penetration Testing",
      en: "Penetration Testing",
      fr: "Tests de pénétration",
      es: "Pruebas de penetración",
    },
    {
      it: "Sicurezza delle reti",
      en: "Network Security",
      fr: "Sécurité des réseaux",
      es: "Seguridad de redes",
    },
    {
      it: "Malware ed Exploit",
      en: "Malware & Exploits",
      fr: "Malwares et exploits",
      es: "Malware y exploits",
    },
    {
      it: "Criptografia e Social Engineering",
      en: "Cryptography & Social Engineering",
      fr: "Cryptographie et ingénierie sociale",
      es: "Criptografía e ingeniería social",
    },
  ],

  extraContent: {
    // “Cosa imparerai” deve essere concreto + orientato ai task d’esame.
    learn: {
      it: [
        "Impostare un approccio “CEH-style”: reconnaissance → scanning → exploitation → post-exploitation.",
        "Riconoscere tecniche reali: enumerazione, privilege escalation, persistenza, evasione.",
        "Allenarti su attacchi web e di rete con domande mirate e quiz misti multi-dominio.",
        "Capire dove sbagli: spiegazioni e ragionamento dietro ogni risposta (quando disponibili).",
        "Simulare l’esame CEH 312-50 con 125 domande cronometrate per fare “exam readiness” vera.",
      ],
      en: [
        "Apply a CEH-style flow: reconnaissance → scanning → exploitation → post-exploitation.",
        "Train on real techniques: enumeration, privilege escalation, persistence, evasion.",
        "Practice web + network attack concepts using targeted and mixed multi-domain quizzes.",
        "Understand mistakes: explanations and reasoning behind each answer (when available).",
        "Build real exam readiness with a timed 125-question CEH 312-50 simulation.",
      ],
      fr: [
        "Appliquer un workflow “CEH” : reconnaissance → scan → exploitation → post-exploitation.",
        "S’entraîner sur des techniques réelles : énumération, élévation de privilèges, persistance, évasion.",
        "Travailler web + réseau avec des QCM ciblés et des quiz mixtes multi-domaines.",
        "Comprendre vos erreurs : explications et logique de réponse (si disponibles).",
        "Gagner en “exam readiness” avec une simulation CEH 312-50 de 125 questions chronométrées.",
      ],
      es: [
        "Aplicar un flujo “CEH”: reconnaissance → scanning → exploitation → post-exploitation.",
        "Practicar técnicas reales: enumeración, escalada de privilegios, persistencia, evasión.",
        "Entrenar conceptos de ataques web y de red con cuestionarios dirigidos y mixtos.",
        "Entender errores: explicaciones y razonamiento de cada respuesta (cuando esté disponible).",
        "Construir preparación real con una simulación CEH 312-50 de 125 preguntas cronometradas.",
      ],
    },

    // “Perché scegliere” deve vendere MA con promesse credibili.
    whyChoose: {
      it: [
        "Oltre 1000 domande tipo esame (allineate allo stile CEH 312-50).",
        "Modalità training per fare volume + modalità esame realistica per misurarti davvero.",
        "Simulazione cronometrata da 125 domande: perfetta per abituarti a ritmo e pressione.",
        "Quiz misti per colpire le lacune: meno illusioni, più preparazione reale.",
        "Multilingua: utile se studi e ripassi anche in francese/spagnolo/inglese.",
      ],
      en: [
        "1000+ real exam-style questions aligned with CEH 312-50.",
        "Training mode for volume + realistic exam mode to measure true readiness.",
        "Timed 125-question simulation to build pace and pressure tolerance.",
        "Mixed quizzes to expose weak areas fast (less illusion, more readiness).",
        "Multilingual practice to support study and revision across languages.",
      ],
      fr: [
        // ✅ micro-match (una sola volta) sulla query “test pratique”
        "Plus de 1000 questions type examen : un vrai test pratique CEH aligné 312-50.",
        "Mode entraînement pour faire du volume + mode examen pour vous mesurer réellement.",
        "Simulation chronométrée de 125 questions pour travailler rythme et stress.",
        "Quiz mixtes pour cibler vos lacunes (moins d’illusions, plus de niveau réel).",
        "Multilingue : idéal si vous révisez aussi en français/espagnol/anglais.",
      ],
      es: [
        "Más de 1000 preguntas tipo examen alineadas a CEH 312-50.",
        "Modo entrenamiento para volumen + modo examen realista para medir tu nivel.",
        "Simulación cronometrada de 125 preguntas para trabajar ritmo y presión.",
        "Cuestionarios mixtos para detectar debilidades rápido (menos ilusión, más preparación).",
        "Multilingüe: útil si estudias y repasas en varios idiomas.",
      ],
    },

    // FAQ: qui ci giochiamo SEO + conversione (risposte brevi, chiare, “no hype”).
    faq: {
      it: [
        {
          q: "Quante domande CEH sono disponibili?",
          a: "Il pool contiene oltre 1000 domande tipo esame CEH. Il numero può variare leggermente tra le lingue perché gli aggiornamenti non sono sempre simultanei.",
        },
        {
          q: "C’è una simulazione d’esame con timer?",
          a: "Sì. Puoi fare una simulazione cronometrata da 125 domande per allenarti in condizioni simili all’esame.",
        },
        {
          q: "È adatto al CEH 312-50?",
          a: "Sì. Il focus è sullo stile “exam practice” e sulla copertura dei principali argomenti richiesti dal CEH 312-50.",
        },
        {
          q: "Meglio training o esame?",
          a: "Training per fare volume e consolidare; modalità esame per misurare davvero il livello e migliorare il time management.",
        },
        {
          q: "Cosa cambia nei quiz misti?",
          a: "I quiz misti combinano più argomenti: sono ottimi per scoprire lacune e allenarti a cambiare contesto, come succede in un vero test.",
        },
      ],
      en: [
        {
          q: "How many CEH questions are available?",
          a: "The pool contains 1000+ CEH exam-style questions. Counts may differ slightly by language because updates are not always released at the same time.",
        },
        {
          q: "Is there a timed exam simulation?",
          a: "Yes. You can run a realistic timed simulation with 125 questions to train under exam-like conditions.",
        },
        {
          q: "Is this aligned with CEH 312-50?",
          a: "Yes. The focus is real exam practice and coverage of the major CEH 312-50 topics.",
        },
        {
          q: "Should I use training mode or exam mode?",
          a: "Use training mode to build volume and understanding; use exam mode to measure readiness and improve time management.",
        },
        {
          q: "What is the benefit of mixed quizzes?",
          a: "Mixed quizzes combine domains to expose weak areas faster and train context switching—closer to a real exam experience.",
        },
      ],
      fr: [
        {
          q: "Combien de questions CEH sont disponibles ?",
          a: "Le pool contient plus de 1000 questions type examen CEH (QCM). Le total peut varier légèrement selon la langue car les mises à jour ne sont pas toujours simultanées.",
        },
        {
          q: "Existe-t-il une simulation chronométrée ?",
          a: "Oui. Vous pouvez lancer une simulation réaliste de 125 questions avec chronomètre pour vous entraîner en conditions d’examen.",
        },
        {
          q: "Est-ce aligné avec le CEH 312-50 ?",
          a: "Oui. L’objectif est la pratique “type examen” et la couverture des sujets majeurs du CEH 312-50.",
        },
        {
          q: "Dois-je utiliser le mode entraînement ou le mode examen ?",
          a: "Le mode entraînement pour faire du volume et apprendre; le mode examen pour mesurer votre niveau et travailler la gestion du temps.",
        },
        {
          q: "À quoi servent les quiz mixtes ?",
          a: "Les quiz mixtes mélangent les domaines pour révéler vos lacunes plus vite et entraîner le changement de contexte, comme lors d’un vrai test.",
        },
      ],
      es: [
        {
          q: "¿Cuántas preguntas CEH están disponibles?",
          a: "El banco incluye más de 1000 preguntas tipo examen CEH. El total puede variar un poco entre idiomas porque las actualizaciones no siempre se publican al mismo tiempo.",
        },
        {
          q: "¿Hay simulación con temporizador?",
          a: "Sí. Puedes hacer una simulación realista de 125 preguntas con temporizador para entrenar en condiciones similares al examen.",
        },
        {
          q: "¿Está alineado con CEH 312-50?",
          a: "Sí. El enfoque es práctica real tipo examen y cobertura de los temas principales del CEH 312-50.",
        },
        {
          q: "¿Mejor modo entrenamiento o modo examen?",
          a: "Entrenamiento para volumen y comprensión; examen para medir preparación y mejorar la gestión del tiempo.",
        },
        {
          q: "¿Qué aportan los cuestionarios mixtos?",
          a: "Mezclan dominios para detectar debilidades más rápido y entrenar el cambio de contexto, más parecido a un examen real.",
        },
      ],
    },

    examReference: {
      it: [
        {
          text: "Pagina ufficiale certificazione CEH (EC-Council)",
          url: "https://www.eccouncil.org/train-certify/certified-ethical-hacker-ceh/",
        },
      ],
      en: [
        {
          text: "Official CEH certification page (EC-Council)",
          url: "https://www.eccouncil.org/train-certify/certified-ethical-hacker-ceh/",
        },
      ],
      fr: [
        {
          text: "Page officielle de la certification CEH (EC-Council)",
          url: "https://www.eccouncil.org/train-certify/certified-ethical-hacker-ceh/",
        },
      ],
      es: [
        {
          text: "Página oficial de la certificación CEH (EC-Council)",
          url: "https://www.eccouncil.org/train-certify/certified-ethical-hacker-ceh/",
        },
      ],
    },
  },

  quizRoute: {
    it: "/it/quiz/ceh",
    en: "/en/quiz/ceh",
    fr: "/fr/quiz/ceh",
    es: "/es/quiz/ceh",
  },

  backRoute: {
    it: "/it/certificazioni",
    en: "/certifications",
    fr: "/fr/certifications",
    es: "/es/certifications",
  },
} as const;

export default CEH;