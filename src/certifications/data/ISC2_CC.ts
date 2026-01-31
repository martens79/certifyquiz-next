// src/certifications/data/isc2-cc.ts
// ✅ Versione data-only (nessun JSX/router).
// 🖼️ Assicurati che l’immagine esista in /public/images/certifications/isc2-icon.png

const ISC2CC = {
  slug: "isc2-cc",
  imageUrl: "/images/certifications/isc2-icon.png",
  officialUrl: "https://www.isc2.org/certifications/certified-in-cybersecurity",

  title: {
    it: "ISC2 Certified in Cybersecurity (CC)",
    en: "ISC2 Certified in Cybersecurity (CC)",
    fr: "ISC2 Certified in Cybersecurity (CC)",
    es: "ISC2 Certified in Cybersecurity (CC)",
  },

  level: {
    it: "Principiante",
    en: "Beginner",
    fr: "Débutant",
    es: "Principiante",
  },

  description: {
    it: "Certificazione base di sicurezza informatica rivolta a chi vuole iniziare una carriera nella cybersecurity. Ideale per consolidare concetti fondamentali, gestione dei rischi, protezione dei dati e strumenti difensivi.",
    en: "Entry-level cybersecurity certification for those starting a career in the field. Great to build core knowledge in security concepts, risk management, data protection, and defensive tools.",
    // ✅ FR potenziato per intent “examen / cybersécurité / quiz”
    fr: "Préparez l’examen ISC2 Certified in Cybersecurity (CC) avec des quiz d’entraînement et des questions pratiques. Certification débutant idéale pour démarrer en cybersécurité : concepts de sécurité, gestion des risques, protection des données et outils de défense.",
    es: "Certificación de ciberseguridad de nivel inicial para quienes comienzan en el campo. Ideal para aprender conceptos de seguridad, gestión de riesgos, protección de datos y herramientas defensivas.",
  },

  topics: [
    { it: "Concetti di sicurezza", en: "Security Concepts", fr: "Concepts de sécurité", es: "Conceptos de seguridad" },
    { it: "Gestione dei rischi", en: "Risk Management", fr: "Gestion des risques", es: "Gestión de riesgos" },
    { it: "Protezione dei dati", en: "Data Protection", fr: "Protection des données", es: "Protección de datos" },
    { it: "Strumenti di difesa", en: "Defense Tools", fr: "Outils de défense", es: "Herramientas de defensa" },
  ],

  extraContent: {
    // 🔗 Solo pagine ufficiali d’esame
    examReference: {
      it: [
        { text: "ISC2 Certified in Cybersecurity (CC) — Pagina ufficiale d’esame", url: "https://www.isc2.org/certifications/certified-in-cybersecurity" },
      ],
      en: [
        { text: "ISC2 Certified in Cybersecurity (CC) — Official exam page", url: "https://www.isc2.org/certifications/certified-in-cybersecurity" },
      ],
      fr: [
        { text: "ISC2 Certified in Cybersecurity (CC) — Page officielle de l’examen", url: "https://www.isc2.org/certifications/certified-in-cybersecurity" },
      ],
      es: [
        { text: "ISC2 Certified in Cybersecurity (CC) — Página oficial del examen", url: "https://www.isc2.org/certifications/certified-in-cybersecurity" },
      ],
    },

    learn: {
      it: [
        "Competenze fondamentali in cybersecurity per chi inizia nel settore.",
        "Concetti di sicurezza, gestione dei rischi e protezione dei dati.",
        "Tecniche difensive e strumenti di sicurezza informatica.",
        "Allenamento con quiz e domande in stile esame per fissare i concetti.",
      ],
      en: [
        "Fundamental cybersecurity skills for beginners.",
        "Security concepts, risk management, and data protection.",
        "Defensive techniques and security tools.",
        "Exam-style practice with quizzes and questions to build confidence.",
      ],
      // ✅ FR potenziato (examen/quiz/QCM)
      fr: [
        "Compétences fondamentales en cybersécurité pour les débutants.",
        "Concepts de sécurité, gestion des risques et protection des données.",
        "Techniques de défense et outils de sécurité (IDS/IPS, pare-feu, chiffrement, NAC).",
        "Entraînement à l’examen avec des quiz et des questions pratiques (QCM).",
      ],
      es: [
        "Habilidades fundamentales de ciberseguridad para principiantes.",
        "Conceptos de seguridad, gestión de riesgos y protección de datos.",
        "Técnicas defensivas y herramientas de seguridad.",
        "Práctica tipo examen con quizzes y preguntas para reforzar conceptos.",
      ],
    },

    whyChoose: {
      it: [
        "Certificazione ufficiale ISC2 per iniziare nel settore della cybersecurity.",
        "Perfetta per studenti, neolaureati o chi vuole cambiare carriera.",
        "Riconosciuta a livello internazionale nel mondo della sicurezza.",
        "Ottima come primo passo prima di certificazioni più avanzate.",
      ],
      en: [
        "Official ISC2 certification for starting in cybersecurity.",
        "Perfect for students, recent graduates, or career changers.",
        "Internationally recognized in the security field.",
        "A strong first step before moving to more advanced certifications.",
      ],
      // ✅ FR potenziato per intent “examen”
      fr: [
        "Certification officielle ISC2 pour débuter en cybersécurité.",
        "Parfaite pour les étudiants, jeunes diplômés ou en reconversion.",
        "Reconnaissance internationale dans le domaine de la sécurité.",
        "Idéale si vous cherchez un entraînement type examen (quiz, QCM, questions pratiques).",
      ],
      es: [
        "Certificación oficial de ISC2 para comenzar en ciberseguridad.",
        "Ideal para estudiantes, recién graduados o quienes cambian de carrera.",
        "Reconocida internacionalmente en el campo de la seguridad.",
        "Buen primer paso antes de certificaciones más avanzadas.",
      ],
    },

    faq: {
      it: [
        { q: "La certificazione CC è adatta ai principianti?", a: "Sì, è pensata proprio per chi inizia nel campo della sicurezza informatica." },
        { q: "Serve esperienza pregressa per iscriversi?", a: "No, non è richiesta esperienza. È accessibile a tutti." },
        { q: "Come mi preparo al meglio?", a: "Studia i concetti base e allenati con quiz e domande in stile esame per consolidare i punti deboli." },
      ],
      en: [
        { q: "Is the CC certification suitable for beginners?", a: "Yes, it's designed for those starting in cybersecurity." },
        { q: "Do I need prior experience to enroll?", a: "No, prior experience is not required. It's open to everyone." },
        { q: "What’s the best way to prepare?", a: "Learn the fundamentals and practice with exam-style questions to improve accuracy and confidence." },
      ],
      // ✅ FR: FAQ mirate per query “examen cc cybersécurité”
      fr: [
        { q: "La certification ISC2 CC convient-elle aux débutants ?", a: "Oui. Elle est conçue comme une certification d’entrée pour démarrer en cybersécurité et valider les bases." },
        { q: "Faut-il une expérience préalable pour passer l’examen ?", a: "Non. Aucune expérience n’est requise. Un plan de révision et des quiz d’entraînement suffisent pour progresser." },
        { q: "Comment se préparer à l’examen CC en cybersécurité ?", a: "Révisez les concepts clés (risques, menaces, protection des données) et entraînez-vous avec des questions pratiques de type QCM." },
        { q: "Le quiz CertifyQuiz aide-t-il pour l’examen ISC2 CC ?", a: "Oui. Les quiz d’entraînement sont conçus pour se rapprocher du style examen et renforcer la compréhension des notions essentielles." },
      ],
      es: [
        { q: "¿La certificación CC es adecuada para principiantes?", a: "Sí, está diseñada para quienes inician en ciberseguridad." },
        { q: "¿Necesito experiencia previa?", a: "No, no se requiere experiencia. Está abierta a todos." },
        { q: "¿Cuál es la mejor forma de prepararme?", a: "Aprende los fundamentos y practica con preguntas tipo examen para mejorar precisión y confianza." },
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
