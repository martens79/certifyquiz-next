// src/certifications/data/isc2-cc.ts
// ✅ Versione data-only (nessun JSX/router).
// 🖼️ Assicurati che l’immagine esista in /public/images/certifications/isc2-icon.png

const ISC2CC = {
  slug: "isc2-cc",
  imageUrl: "/images/certifications/isc2-icon.png",
  officialUrl: "https://www.isc2.org/certifications/certified-in-cybersecurity",

  // ✅ SEO-first: titoli orientati a “practice test / quiz / esame”
  title: {
    it: "ISC2 CC – Quiz e Simulazione Esame 2026 (Certified in Cybersecurity)",
    en: "ISC2 CC Practice Test 2026 – Certified in Cybersecurity Exam Questions",
    fr: "ISC2 CC Examen 2026 – Quiz et Questions (Certified in Cybersecurity)",
    es: "ISC2 CC Examen 2026 – Quiz y Preguntas (Certified in Cybersecurity)",
  },

  level: {
    it: "Principiante",
    en: "Beginner",
    fr: "Débutant",
    es: "Principiante",
  },

  // ✅ Descrizioni orientate a intent di ricerca (practice test / questions / exam-style)
  description: {
    it: "Allenati per l’esame ISC2 Certified in Cybersecurity (CC) con quiz gratuiti e domande in stile esame 2026. Migliora punteggio e sicurezza con spiegazioni dettagliate su concetti di sicurezza, gestione dei rischi, protezione dei dati e strumenti difensivi.",
    en: "Prepare for the ISC2 Certified in Cybersecurity (CC) exam with our FREE 2026 practice test. Train with exam-style questions, detailed explanations, and focused quizzes covering security concepts, risk management, data protection, and defensive tools.",
    fr: "Préparez l’examen ISC2 Certified in Cybersecurity (CC) 2026 avec notre quiz gratuit et des questions pratiques en style examen (QCM). Entraînez-vous sur les concepts de sécurité, la gestion des risques, la protection des données et les outils de défense.",
    es: "Prepárate para el examen ISC2 Certified in Cybersecurity (CC) 2026 con nuestro quiz gratuito y preguntas tipo examen. Practica con explicaciones detalladas sobre conceptos de seguridad, gestión de riesgos, protección de datos y herramientas defensivas.",
  },

  // ✅ Argomenti/Domain in forma “chiara” per SEO + UX
  topics: [
    {
      it: "Concetti di sicurezza (minacce, vulnerabilità, principi base)",
      en: "Security Concepts (threats, vulnerabilities, core principles)",
      fr: "Concepts de sécurité (menaces, vulnérabilités, principes)",
      es: "Conceptos de seguridad (amenazas, vulnerabilidades, principios)",
    },
    {
      it: "Gestione dei rischi (risk assessment, policy, compliance)",
      en: "Risk Management (assessment, policies, compliance)",
      fr: "Gestion des risques (évaluation, politiques, conformité)",
      es: "Gestión de riesgos (evaluación, políticas, cumplimiento)",
    },
    {
      it: "Protezione dei dati (CIA, privacy, cifratura, backup)",
      en: "Data Protection (CIA, privacy, encryption, backups)",
      fr: "Protection des données (CIA, confidentialité, chiffrement, sauvegardes)",
      es: "Protección de datos (CIA, privacidad, cifrado, copias de seguridad)",
    },
    {
      it: "Strumenti di difesa (firewall, IDS/IPS, hardening, IAM)",
      en: "Defense Tools (firewalls, IDS/IPS, hardening, IAM)",
      fr: "Outils de défense (pare-feu, IDS/IPS, durcissement, IAM)",
      es: "Herramientas de defensa (firewall, IDS/IPS, hardening, IAM)",
    },
  ],

  extraContent: {
    // 🔗 Solo pagine ufficiali d’esame
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

    // ✅ “Cosa imparerai” (SEO + valore percepito)
    learn: {
      it: [
        "Eseguire un ripasso completo delle basi di cybersecurity (minacce, vulnerabilità, controlli).",
        "Capire risk management: valutazione del rischio, policy, best practice e concetti di compliance.",
        "Rafforzare data protection: CIA triad, privacy, cifratura, backup e gestione accessi.",
        "Allenarti con quiz e domande in stile esame per aumentare precisione e confidenza.",
      ],
      en: [
        "Practice core cybersecurity fundamentals: threats, vulnerabilities, and security controls.",
        "Learn risk management basics: assessment methods, policies, best practices, and compliance concepts.",
        "Strengthen data protection knowledge: CIA triad, privacy, encryption, backups, and access control.",
        "Build confidence with exam-style quizzes and detailed explanations.",
      ],
      fr: [
        "Réviser les bases de la cybersécurité : menaces, vulnérabilités et contrôles de sécurité.",
        "Comprendre la gestion des risques : évaluation, politiques, bonnes pratiques et notions de conformité.",
        "Renforcer la protection des données : triade CIA, confidentialité, chiffrement, sauvegardes et contrôle d’accès.",
        "S’entraîner avec des quiz et des questions de type examen (QCM) + explications détaillées.",
      ],
      es: [
        "Repasar los fundamentos de ciberseguridad: amenazas, vulnerabilidades y controles de seguridad.",
        "Aprender gestión de riesgos: evaluación, políticas, buenas prácticas y conceptos de cumplimiento.",
        "Reforzar protección de datos: tríada CIA, privacidad, cifrado, copias de seguridad y control de acceso.",
        "Practicar con quizzes y preguntas tipo examen con explicaciones detalladas.",
      ],
    },

    // ✅ “Perché scegliere” (conversione futura + intent)
    whyChoose: {
      it: [
        "Certificazione ufficiale ISC2 perfetta per iniziare in cybersecurity.",
        "Ideale per studenti, neolaureati o chi vuole cambiare carriera.",
        "Ottimo primo step prima di certificazioni più avanzate (Security+, SSCP, CISSP).",
        "Allenamento pratico con quiz: capisci dove sbagli e migliori velocemente.",
      ],
      en: [
        "Official ISC2 entry-level certification — great starting point for cybersecurity.",
        "Perfect for students, recent graduates, or career changers.",
        "Strong first step before advanced certifications (Security+, SSCP, CISSP).",
        "Practice-first approach: identify weak areas and improve faster with quizzes.",
      ],
      fr: [
        "Certification officielle ISC2 pour débuter en cybersécurité (niveau entrée).",
        "Parfaite pour étudiants, jeunes diplômés ou en reconversion.",
        "Excellent tremplin avant des certifications plus avancées (Security+, SSCP, CISSP).",
        "Entraînement type examen : quiz, QCM et questions pratiques pour progresser vite.",
      ],
      es: [
        "Certificación oficial de ISC2 para empezar en ciberseguridad.",
        "Ideal para estudiantes, recién graduados o quienes cambian de carrera.",
        "Buen primer paso antes de certificaciones más avanzadas (Security+, SSCP, CISSP).",
        "Enfoque práctico: quizzes tipo examen para detectar fallos y mejorar rápido.",
      ],
    },

    // ✅ FAQ mirate per query “exam / practice test”
    faq: {
      it: [
        {
          q: "La certificazione ISC2 CC è adatta ai principianti?",
          a: "Sì. È pensata come certificazione entry-level per chi vuole iniziare in cybersecurity e validare le basi.",
        },
        {
          q: "Serve esperienza pregressa per sostenere l’esame?",
          a: "No. Non è richiesta esperienza. Un buon piano di studio e quiz in stile esame aiutano a progredire rapidamente.",
        },
        {
          q: "Come mi preparo al meglio?",
          a: "Studia i concetti fondamentali e allenati con domande in stile esame: ti aiutano a individuare i punti deboli e aumentare la confidenza.",
        },
        {
          q: "I quiz di CertifyQuiz sono utili per l’esame?",
          a: "Sì. Le domande sono pensate per avvicinarsi allo stile esame e consolidare i concetti chiave con spiegazioni dettagliate.",
        },
      ],
      en: [
        {
          q: "Is ISC2 CC suitable for beginners?",
          a: "Yes. It’s an entry-level certification designed to validate core cybersecurity fundamentals.",
        },
        {
          q: "Do I need prior experience to take the exam?",
          a: "No. Prior experience isn’t required. A solid study plan and exam-style practice questions are enough to improve quickly.",
        },
        {
          q: "What’s the best way to prepare for the ISC2 CC exam?",
          a: "Learn the fundamentals and practice with exam-style questions to identify weak areas, improve accuracy, and build confidence.",
        },
        {
          q: "Do CertifyQuiz quizzes help with ISC2 CC preparation?",
          a: "Yes. The quizzes are designed to match exam-style thinking and reinforce key concepts with detailed explanations.",
        },
      ],
      fr: [
        {
          q: "La certification ISC2 CC convient-elle aux débutants ?",
          a: "Oui. C’est une certification d’entrée pour valider les bases de la cybersécurité.",
        },
        {
          q: "Faut-il une expérience préalable pour passer l’examen ?",
          a: "Non. Aucune expérience n’est requise. Un plan de révision + des quiz d’entraînement (QCM) suffisent pour progresser.",
        },
        {
          q: "Comment se préparer à l’examen ISC2 CC en 2026 ?",
          a: "Révisez les notions clés (risques, menaces, protection des données) et entraînez-vous avec des questions pratiques de type examen (QCM).",
        },
        {
          q: "Les quiz CertifyQuiz sont-ils utiles pour l’examen ISC2 CC ?",
          a: "Oui. Les quiz d’entraînement se rapprochent du style examen et renforcent la compréhension grâce à des explications détaillées.",
        },
      ],
      es: [
        {
          q: "¿La certificación ISC2 CC es adecuada para principiantes?",
          a: "Sí. Es una certificación de nivel inicial para validar los fundamentos de ciberseguridad.",
        },
        {
          q: "¿Necesito experiencia previa para presentar el examen?",
          a: "No. No se requiere experiencia. Un buen plan de estudio y preguntas tipo examen ayudan a mejorar rápido.",
        },
        {
          q: "¿Cuál es la mejor forma de prepararme?",
          a: "Aprende lo esencial y practica con preguntas tipo examen para detectar puntos débiles, mejorar precisión y ganar confianza.",
        },
        {
          q: "¿Los quizzes de CertifyQuiz ayudan para ISC2 CC?",
          a: "Sí. Están pensados para aproximarse al estilo de examen y reforzar conceptos con explicaciones detalladas.",
        },
      ],
    },
  },

  // Rotte quiz localizzate
  quizRoute: {
    it: "/it/quiz/isc2-cc",
    en: "/en/quiz/isc2-cc",
    fr: "/fr/quiz/isc2-cc",
    es: "/es/quiz/isc2-cc",
  },

  // Rotta “indietro”: lista certificazioni per lingua
  backRoute: {
    it: "/it/certificazioni",
    en: "/certifications",
    fr: "/fr/certifications",
    es: "/es/certificaciones",
  },
} as const;

export default ISC2CC;
