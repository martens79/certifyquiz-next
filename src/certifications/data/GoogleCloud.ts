// src/certifications/data/google-cloud.ts
// 🌟 CertifyQuiz Original / Foundations path
// ✅ Mantiene slug "google-cloud" per non rompere SEO, link e quiz esistenti.
// ✅ Posizionato come percorso introduttivo proprietario prima di Google Cloud Digital Leader.
// ✅ Non duplica la certificazione ufficiale: la cita solo come step successivo.

const GoogleCloud = {
  slug: "google-cloud",
  imageUrl: "/images/certifications/google_cloud_icon.png",
  officialUrl: "https://cloud.google.com/learn",

  levelOrder: 1,

  title: {
    it: "Google Cloud Foundations by CertifyQuiz",
    en: "Google Cloud Foundations by CertifyQuiz",
    fr: "Google Cloud Foundations by CertifyQuiz",
    es: "Google Cloud Foundations by CertifyQuiz",
  },

  level: {
    it: "Base",
    en: "Beginner",
    fr: "Débutant",
    es: "Principiante",
  },

  description: {
    it: "Google Cloud Foundations by CertifyQuiz è un percorso introduttivo proprietario pensato per chi vuole capire Google Cloud da zero. Copre cloud computing, infrastruttura, sicurezza, costi, dati, AI e trasformazione digitale, ed è ideale prima di preparare Google Cloud Digital Leader.",
    en: "Google Cloud Foundations by CertifyQuiz is a proprietary introductory path for learners who want to understand Google Cloud from zero. It covers cloud computing, infrastructure, security, costs, data, AI, and digital transformation, and is ideal before preparing for Google Cloud Digital Leader.",
    fr: "Google Cloud Foundations by CertifyQuiz est un parcours introductif propriétaire conçu pour comprendre Google Cloud depuis zéro. Il couvre le cloud computing, l'infrastructure, la sécurité, les coûts, les données, l'IA et la transformation numérique, et constitue une base idéale avant Google Cloud Digital Leader.",
    es: "Google Cloud Foundations by CertifyQuiz es una ruta introductoria propia para aprender Google Cloud desde cero. Cubre cloud computing, infraestructura, seguridad, costos, datos, IA y transformación digital, y es ideal antes de preparar Google Cloud Digital Leader.",
  },

  // ─── SEO ────────────────────────────────────────────────────────────────────

  metaTitle: {
    it: "Google Cloud Foundations by CertifyQuiz – Quiz Base Cloud 2026",
    en: "Google Cloud Foundations by CertifyQuiz – Cloud Basics Quiz 2026",
    fr: "Google Cloud Foundations by CertifyQuiz – Quiz Bases Cloud 2026",
    es: "Google Cloud Foundations by CertifyQuiz – Quiz Bases Cloud 2026",
  },

  metaDescription: {
    it: "Impara Google Cloud da zero con il percorso proprietario Google Cloud Foundations by CertifyQuiz. Quiz su cloud, sicurezza, costi, dati, AI e trasformazione digitale.",
    en: "Learn Google Cloud from zero with Google Cloud Foundations by CertifyQuiz. Practice quizzes on cloud computing, security, costs, data, AI, and digital transformation.",
    fr: "Apprenez Google Cloud depuis zéro avec Google Cloud Foundations by CertifyQuiz. Quiz sur le cloud, la sécurité, les coûts, les données, l'IA et la transformation numérique.",
    es: "Aprende Google Cloud desde cero con Google Cloud Foundations by CertifyQuiz. Quizzes sobre cloud, seguridad, costos, datos, IA y transformación digital.",
  },

  // ─── TOPICS ─────────────────────────────────────────────────────────────────
  // ⚠️ Questi slug devono restare allineati agli slug reali dei topic/quiz.

  topics: [
    {
      title: {
        it: "Infrastruttura cloud, sicurezza e costi",
        en: "Cloud infrastructure, security and costs",
        fr: "Infrastructure cloud, sécurité et coûts",
        es: "Infraestructura cloud, seguridad y costos",
      },
      slug: {
        it: "cloud-infrastruttura-sicurezza-costi",
        en: "cloud-infrastructure-security-costs",
        fr: "infrastructure-cloud-securite-couts",
        es: "infraestructura-cloud-seguridad-costos",
      },
    },
    {
      title: {
        it: "Dati, AI e innovazione",
        en: "Data, AI and innovation",
        fr: "Données, IA et innovation",
        es: "Datos, IA e innovación",
      },
      slug: {
        it: "dati-ai-innovazione",
        en: "data-ai-innovation",
        fr: "donnees-ia-innovation",
        es: "datos-ia-innovacion",
      },
    },
    {
      title: {
        it: "Trasformazione digitale",
        en: "Digital transformation",
        fr: "Transformation numérique",
        es: "Transformación digital",
      },
      slug: {
        it: "trasformazione-digitale",
        en: "digital-transformation",
        fr: "transformation-numerique",
        es: "transformacion-digital",
      },
    },
  ],

  // ─── EXTRA CONTENT ──────────────────────────────────────────────────────────

  extraContent: {
    examReference: {
      it: [
        {
          text: "Google Cloud Digital Leader — prossimo step consigliato",
          url: "https://cloud.google.com/certification/cloud-digital-leader",
        },
        {
          text: "Google Cloud — Risorse ufficiali di apprendimento",
          url: "https://cloud.google.com/learn",
        },
      ],
      en: [
        {
          text: "Google Cloud Digital Leader — recommended next step",
          url: "https://cloud.google.com/certification/cloud-digital-leader",
        },
        {
          text: "Google Cloud — Official learning resources",
          url: "https://cloud.google.com/learn",
        },
      ],
      fr: [
        {
          text: "Google Cloud Digital Leader — prochaine étape recommandée",
          url: "https://cloud.google.com/certification/cloud-digital-leader",
        },
        {
          text: "Google Cloud — Ressources officielles d’apprentissage",
          url: "https://cloud.google.com/learn",
        },
      ],
      es: [
        {
          text: "Google Cloud Digital Leader — siguiente paso recomendado",
          url: "https://cloud.google.com/certification/cloud-digital-leader",
        },
        {
          text: "Google Cloud — Recursos oficiales de aprendizaje",
          url: "https://cloud.google.com/learn",
        },
      ],
    },

    learn: {
      it: [
        "Comprendere i concetti fondamentali del cloud computing e il ruolo di Google Cloud.",
        "Capire region, zone, macchine virtuali, storage, rete e scalabilità.",
        "Imparare le basi di sicurezza cloud, IAM, crittografia e responsabilità condivisa.",
        "Comprendere come dati, analytics e AI supportano innovazione e decisioni aziendali.",
        "Gestire concetti base di costo, budget, risorse inutilizzate e ottimizzazione cloud.",
        "Costruire una base solida prima di preparare Google Cloud Digital Leader.",
      ],
      en: [
        "Understand the fundamentals of cloud computing and the role of Google Cloud.",
        "Learn regions, zones, virtual machines, storage, networking, and scalability.",
        "Understand cloud security basics, IAM, encryption, and shared responsibility.",
        "Learn how data, analytics, and AI support innovation and business decision-making.",
        "Understand basic cost concepts, budgets, unused resources, and cloud optimization.",
        "Build a strong foundation before preparing for Google Cloud Digital Leader.",
      ],
      fr: [
        "Comprendre les concepts fondamentaux du cloud computing et le rôle de Google Cloud.",
        "Apprendre les régions, zones, machines virtuelles, stockage, réseau et scalabilité.",
        "Comprendre les bases de la sécurité cloud, IAM, chiffrement et responsabilité partagée.",
        "Comprendre comment les données, l'analytics et l'IA soutiennent l'innovation et la prise de décision.",
        "Comprendre les coûts, budgets, ressources inutilisées et optimisation cloud.",
        "Construire une base solide avant Google Cloud Digital Leader.",
      ],
      es: [
        "Comprender los conceptos fundamentales del cloud computing y el papel de Google Cloud.",
        "Aprender regiones, zonas, máquinas virtuales, almacenamiento, redes y escalabilidad.",
        "Comprender seguridad cloud, IAM, cifrado y responsabilidad compartida.",
        "Entender cómo datos, analytics e IA impulsan innovación y decisiones empresariales.",
        "Comprender costos, presupuestos, recursos no utilizados y optimización cloud.",
        "Crear una base sólida antes de preparar Google Cloud Digital Leader.",
      ],
    },

    whyChoose: {
      it: [
        "È il punto di partenza ideale per chi vuole capire Google Cloud da zero.",
        "È un percorso proprietario CertifyQuiz pensato per studenti, junior e profili non tecnici.",
        "Non richiede esperienza tecnica avanzata o conoscenza precedente di Google Cloud.",
        "Collega cloud, sicurezza, costi, dati e AI in un unico percorso pratico.",
        "Aiuta a prepararsi meglio alla certificazione ufficiale Google Cloud Digital Leader.",
      ],
      en: [
        "It is the ideal starting point for learning Google Cloud from zero.",
        "It is a proprietary CertifyQuiz path designed for students, juniors, and non-technical profiles.",
        "It does not require advanced technical experience or previous Google Cloud knowledge.",
        "It connects cloud, security, costs, data, and AI in one practical path.",
        "It helps you prepare more effectively for the official Google Cloud Digital Leader certification.",
      ],
      fr: [
        "C'est le point de départ idéal pour apprendre Google Cloud depuis zéro.",
        "C'est un parcours propriétaire CertifyQuiz conçu pour les étudiants, juniors et profils non techniques.",
        "Aucune expérience technique avancée ni connaissance préalable de Google Cloud n'est requise.",
        "Il relie cloud, sécurité, coûts, données et IA dans un parcours pratique.",
        "Il aide à mieux préparer la certification officielle Google Cloud Digital Leader.",
      ],
      es: [
        "Es el punto de partida ideal para aprender Google Cloud desde cero.",
        "Es una ruta propia de CertifyQuiz pensada para estudiantes, juniors y perfiles no técnicos.",
        "No requiere experiencia técnica avanzada ni conocimiento previo de Google Cloud.",
        "Conecta cloud, seguridad, costos, datos e IA en un camino práctico.",
        "Ayuda a preparar mejor la certificación oficial Google Cloud Digital Leader.",
      ],
    },

    faq: {
      it: [
        {
          q: "Google Cloud Foundations by CertifyQuiz è una certificazione ufficiale Google?",
          a: "No. È un percorso proprietario CertifyQuiz sui fondamenti di Google Cloud. La certificazione ufficiale consigliata dopo questo percorso è Google Cloud Digital Leader.",
        },
        {
          q: "Devo studiare Google Cloud Foundations prima della Digital Leader?",
          a: "Non è obbligatorio, ma è consigliato se parti da zero o vuoi rafforzare cloud, dati, AI, sicurezza e costi prima di affrontare una certificazione ufficiale.",
        },
        {
          q: "I quiz sono utili per la certificazione Google Cloud Digital Leader?",
          a: "Sì. I quiz coprono concetti fondamentali che aiutano a preparare meglio il percorso verso Google Cloud Digital Leader.",
        },
        {
          q: "Serve esperienza tecnica avanzata?",
          a: "No. Il percorso è pensato per principianti, studenti, profili junior e professionisti business-tech.",
        },
      ],
      en: [
        {
          q: "Is Google Cloud Foundations by CertifyQuiz an official Google certification?",
          a: "No. It is a proprietary CertifyQuiz path focused on Google Cloud fundamentals. The recommended official certification after this path is Google Cloud Digital Leader.",
        },
        {
          q: "Should I study Google Cloud Foundations before Digital Leader?",
          a: "It is not mandatory, but it is recommended if you are starting from zero or want to strengthen cloud, data, AI, security, and cost concepts before an official certification.",
        },
        {
          q: "Are the quizzes useful for Google Cloud Digital Leader?",
          a: "Yes. The quizzes cover fundamental concepts that help you prepare more effectively for Google Cloud Digital Leader.",
        },
        {
          q: "Do I need advanced technical experience?",
          a: "No. The path is designed for beginners, students, junior profiles, and business-tech professionals.",
        },
      ],
      fr: [
        {
          q: "Google Cloud Foundations by CertifyQuiz est-elle une certification officielle Google ?",
          a: "Non. C'est un parcours propriétaire CertifyQuiz sur les fondamentaux de Google Cloud. La certification officielle recommandée ensuite est Google Cloud Digital Leader.",
        },
        {
          q: "Dois-je étudier Google Cloud Foundations avant Digital Leader ?",
          a: "Ce n'est pas obligatoire, mais recommandé si vous partez de zéro ou souhaitez renforcer cloud, données, IA, sécurité et coûts avant une certification officielle.",
        },
        {
          q: "Les quiz sont-ils utiles pour Google Cloud Digital Leader ?",
          a: "Oui. Les quiz couvrent des concepts fondamentaux utiles pour mieux préparer Google Cloud Digital Leader.",
        },
        {
          q: "Faut-il une expérience technique avancée ?",
          a: "Non. Le parcours est conçu pour les débutants, étudiants, profils juniors et professionnels business-tech.",
        },
      ],
      es: [
        {
          q: "¿Google Cloud Foundations by CertifyQuiz es una certificación oficial de Google?",
          a: "No. Es una ruta propia de CertifyQuiz sobre fundamentos de Google Cloud. La certificación oficial recomendada después es Google Cloud Digital Leader.",
        },
        {
          q: "¿Debo estudiar Google Cloud Foundations antes de Digital Leader?",
          a: "No es obligatorio, pero sí recomendable si empiezas desde cero o quieres reforzar cloud, datos, IA, seguridad y costos antes de una certificación oficial.",
        },
        {
          q: "¿Los quizzes sirven para Google Cloud Digital Leader?",
          a: "Sí. Los quizzes cubren conceptos fundamentales que ayudan a preparar mejor Google Cloud Digital Leader.",
        },
        {
          q: "¿Necesito experiencia técnica avanzada?",
          a: "No. La ruta está diseñada para principiantes, estudiantes, perfiles junior y profesionales business-tech.",
        },
      ],
    },
  },

  quizRoute: {
    it: "/it/quiz/google-cloud",
    en: "/en/quiz/google-cloud",
    fr: "/fr/quiz/google-cloud",
    es: "/es/quiz/google-cloud",
  },

  backRoute: {
    it: "/it/certificazioni",
    en: "/certifications",
    fr: "/fr/certifications",
    es: "/es/certificaciones",
  },
} as const;

export default GoogleCloud;