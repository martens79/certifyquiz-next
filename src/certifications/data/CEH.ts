// src/certifications/data/ceh.ts
// 🔥 Versione SEO KILLER – intent Practice Test
// Data-only per CertificationPage (server). Nessun JSX/Router.

const CEH = {
  slug: "ceh",
  imageUrl: "/images/certifications/ceh.png",
  officialUrl:
    "https://www.eccouncil.org/train-certify/certified-ethical-hacker-ceh/",

  title: {
    it: "CEH Practice Test 2026 – 514 Domande Hacker Etico",
    en: "CEH Practice Test 2026 – 514 Real Exam Questions",
    fr: "CEH Practice Test 2026 – 514 Questions Examen",
    es: "CEH Practice Test 2026 – 514 Preguntas Tipo Examen",
  },

  level: {
    it: "Intermedio",
    en: "Intermediate",
    fr: "Intermédiaire",
    es: "Intermedio",
  },

  description: {
    it: "Allenati con 514 domande in stile esame CEH (Certified Ethical Hacker). Modalità training completa, simulazione esame da 125 domande con timer e quiz misti per verificare la tua preparazione reale.",
    en: "Practice with 514 CEH exam-style questions. Full training mode, timed 125-question exam simulation, and mixed quizzes covering all Certified Ethical Hacker topics.",
    fr: "Entraînez-vous avec 514 questions type examen CEH. Mode entraînement complet, simulation chronométrée de 125 questions et quiz mixtes couvrant tous les domaines du Certified Ethical Hacker.",
    es: "Practica con 514 preguntas tipo examen CEH. Modo entrenamiento completo, simulación cronometrada de 125 preguntas y cuestionarios mixtos de todos los temas.",
  },

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
    learn: {
      it: [
        "Identificare vulnerabilità reali nei sistemi.",
        "Simulare attacchi in ambienti controllati.",
        "Comprendere exploit, malware e tecniche di evasione.",
        "Allenarti con 514 domande in stile esame CEH.",
        "Simulare l’esame ufficiale da 125 domande con timer.",
      ],
      en: [
        "Identify real-world vulnerabilities.",
        "Simulate ethical hacking attacks.",
        "Understand exploits, malware, and attack techniques.",
        "Train with 514 real exam-style CEH questions.",
        "Simulate the official 125-question timed exam.",
      ],
      fr: [
        "Identifier des vulnérabilités réelles.",
        "Simuler des attaques éthiques.",
        "Comprendre exploits, malwares et techniques d’attaque.",
        "S’entraîner avec 514 questions type examen CEH.",
        "Simuler l’examen officiel de 125 questions chronométré.",
      ],
      es: [
        "Identificar vulnerabilidades reales.",
        "Simular ataques éticos.",
        "Comprender exploits y técnicas de ataque.",
        "Entrenar con 514 preguntas tipo examen CEH.",
        "Simular el examen oficial de 125 preguntas con temporizador.",
      ],
    },

    whyChoose: {
      it: [
        "514 domande disponibili in inglese.",
        "Modalità training e modalità esame realistica.",
        "Copertura completa di tutti i domini CEH.",
        "Ideale per prepararsi al CEH 312-50.",
      ],
      en: [
        "514 questions available in English.",
        "Full training and realistic exam mode.",
        "Complete coverage of CEH domains.",
        "Designed for CEH 312-50 preparation.",
      ],
      fr: [
        "514 questions disponibles en anglais.",
        "Mode entraînement et mode examen réaliste.",
        "Couverture complète des domaines CEH.",
        "Conçu pour la préparation au CEH 312-50.",
      ],
      es: [
        "514 preguntas disponibles en inglés.",
        "Modo entrenamiento y modo examen realista.",
        "Cobertura completa de los dominios CEH.",
        "Diseñado para la preparación CEH 312-50.",
      ],
    },

    faq: {
      en: [
        {
          q: "How many CEH questions are available?",
          a: "There are currently 514 CEH exam-style questions available in English.",
        },
        {
          q: "Is there a timed CEH exam simulation?",
          a: "Yes. You can simulate the official 125-question CEH exam with a timer.",
        },
        {
          q: "Is this aligned with CEH 312-50?",
          a: "Yes. The question pool covers all major CEH 312-50 domains.",
        },
      ],
      it: [],
      fr: [],
      es: [],
    },

    examReference: {
      en: [
        {
          text: "Official CEH (312-50) certification page",
          url: "https://www.eccouncil.org/train-certify/certified-ethical-hacker-ceh/",
        },
      ],
      it: [],
      fr: [],
      es: [],
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
