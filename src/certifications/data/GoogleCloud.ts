// src/certifications/data/google-cloud.ts
// ✅ Google Cloud Fundamentals
// ✅ Mantiene slug "google-cloud" per non rompere SEO, link e quiz esistenti
// ✅ NON duplica più Google Cloud Digital Leader: la cita solo come prossimo step

const GoogleCloud = {
  slug: "google-cloud",
  imageUrl: "/images/certifications/google_cloud_icon.png",
  officialUrl: "https://cloud.google.com/learn",

  title: {
    it: "Google Cloud — Fondamenti",
    en: "Google Cloud — Fundamentals",
    fr: "Google Cloud — Fondamentaux",
    es: "Google Cloud — Fundamentos",
  },

  level: {
    it: "Base",
    en: "Beginner",
    fr: "Débutant",
    es: "Básico",
  },

  description: {
    it: "Impara i fondamenti di Google Cloud: infrastruttura cloud, sicurezza, costi, dati, AI e trasformazione digitale. Percorso base ideale prima di preparare la certificazione Google Cloud Digital Leader.",
    en: "Learn Google Cloud fundamentals: cloud infrastructure, security, costs, data, AI, and digital transformation. A beginner-friendly path before preparing for the Google Cloud Digital Leader certification.",
    fr: "Apprenez les fondamentaux de Google Cloud : infrastructure cloud, sécurité, coûts, données, IA et transformation numérique. Un parcours idéal avant la certification Google Cloud Digital Leader.",
    es: "Aprende los fundamentos de Google Cloud: infraestructura cloud, seguridad, costos, datos, IA y transformación digital. Un camino base ideal antes de preparar la certificación Google Cloud Digital Leader.",
  },

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
        "Comprendere i concetti fondamentali del cloud computing.",
        "Capire region, zone, macchine virtuali, storage e scalabilità.",
        "Imparare le basi di sicurezza cloud, IAM, crittografia e responsabilità condivisa.",
        "Comprendere come dati e AI supportano innovazione e decisioni aziendali.",
        "Gestire concetti base di costo, budget, risorse inutilizzate e ottimizzazione cloud.",
        "Prepararsi gradualmente al percorso Google Cloud Digital Leader.",
      ],
      en: [
        "Understand the fundamental concepts of cloud computing.",
        "Learn regions, zones, virtual machines, storage, and scalability.",
        "Understand cloud security basics, IAM, encryption, and shared responsibility.",
        "Learn how data and AI support innovation and business decision-making.",
        "Understand basic cost concepts, budgets, unused resources, and cloud optimization.",
        "Build a foundation before preparing for Google Cloud Digital Leader.",
      ],
      fr: [
        "Comprendre les concepts fondamentaux du cloud computing.",
        "Apprendre les régions, zones, machines virtuelles, stockage et scalabilité.",
        "Comprendre les bases de la sécurité cloud, IAM, chiffrement et responsabilité partagée.",
        "Comprendre comment les données et l’IA soutiennent l’innovation et la prise de décision.",
        "Comprendre les coûts, budgets, ressources inutilisées et optimisation cloud.",
        "Construire une base solide avant Google Cloud Digital Leader.",
      ],
      es: [
        "Comprender los conceptos fundamentales del cloud computing.",
        "Aprender regiones, zonas, máquinas virtuales, almacenamiento y escalabilidad.",
        "Comprender seguridad cloud, IAM, cifrado y responsabilidad compartida.",
        "Entender cómo los datos y la IA impulsan innovación y decisiones empresariales.",
        "Comprender costos, presupuestos, recursos no utilizados y optimización cloud.",
        "Crear una base antes de preparar Google Cloud Digital Leader.",
      ],
    },

    whyChoose: {
      it: [
        "È il punto di partenza ideale per chi vuole capire Google Cloud da zero.",
        "Non richiede esperienza tecnica avanzata.",
        "Collega cloud, sicurezza, costi, dati e AI in un unico percorso pratico.",
        "Aiuta a prepararsi meglio alla certificazione Google Cloud Digital Leader.",
        "È utile per studenti, professionisti junior, project manager e profili business-tech.",
      ],
      en: [
        "It is the ideal starting point for learning Google Cloud from zero.",
        "It does not require advanced technical experience.",
        "It connects cloud, security, costs, data, and AI in one practical path.",
        "It helps you prepare more effectively for Google Cloud Digital Leader.",
        "It is useful for students, junior professionals, project managers, and business-tech profiles.",
      ],
      fr: [
        "C’est le point de départ idéal pour apprendre Google Cloud depuis zéro.",
        "Aucune expérience technique avancée n’est requise.",
        "Il relie cloud, sécurité, coûts, données et IA dans un parcours pratique.",
        "Il aide à mieux préparer Google Cloud Digital Leader.",
        "Il est utile pour étudiants, profils juniors, chefs de projet et profils business-tech.",
      ],
      es: [
        "Es el punto de partida ideal para aprender Google Cloud desde cero.",
        "No requiere experiencia técnica avanzada.",
        "Conecta cloud, seguridad, costos, datos e IA en un camino práctico.",
        "Ayuda a preparar mejor Google Cloud Digital Leader.",
        "Es útil para estudiantes, perfiles junior, project managers y perfiles business-tech.",
      ],
    },

    faq: {
      it: [
        {
          q: "È una certificazione ufficiale Google?",
          a: "No. È un percorso base di preparazione sui fondamenti di Google Cloud. La certificazione ufficiale consigliata dopo questo percorso è Google Cloud Digital Leader.",
        },
        {
          q: "Devo studiare Google Cloud Fundamentals prima della Digital Leader?",
          a: "Non è obbligatorio, ma è consigliato se parti da zero o vuoi rafforzare cloud, dati, AI, sicurezza e costi.",
        },
        {
          q: "I quiz sono utili per la certificazione Digital Leader?",
          a: "Sì. I quiz coprono concetti fondamentali che aiutano a preparare meglio il percorso verso Google Cloud Digital Leader.",
        },
      ],
      en: [
        {
          q: "Is this an official Google certification?",
          a: "No. This is a foundational learning path for Google Cloud basics. The recommended official certification after this path is Google Cloud Digital Leader.",
        },
        {
          q: "Should I study Google Cloud Fundamentals before Digital Leader?",
          a: "It is not mandatory, but it is recommended if you are starting from zero or want to strengthen cloud, data, AI, security, and cost concepts.",
        },
        {
          q: "Are the quizzes useful for the Digital Leader certification?",
          a: "Yes. The quizzes cover fundamental concepts that help you prepare more effectively for Google Cloud Digital Leader.",
        },
      ],
      fr: [
        {
          q: "Est-ce une certification officielle Google ?",
          a: "Non. C’est un parcours de base sur les fondamentaux de Google Cloud. La certification officielle recommandée ensuite est Google Cloud Digital Leader.",
        },
        {
          q: "Dois-je étudier Google Cloud Fundamentals avant Digital Leader ?",
          a: "Ce n’est pas obligatoire, mais recommandé si vous partez de zéro ou souhaitez renforcer cloud, données, IA, sécurité et coûts.",
        },
        {
          q: "Les quiz sont-ils utiles pour Digital Leader ?",
          a: "Oui. Les quiz couvrent des concepts fondamentaux utiles pour mieux préparer Google Cloud Digital Leader.",
        },
      ],
      es: [
        {
          q: "¿Es una certificación oficial de Google?",
          a: "No. Es un camino de aprendizaje base sobre los fundamentos de Google Cloud. La certificación oficial recomendada después es Google Cloud Digital Leader.",
        },
        {
          q: "¿Debo estudiar Google Cloud Fundamentals antes de Digital Leader?",
          a: "No es obligatorio, pero sí recomendable si empiezas desde cero o quieres reforzar cloud, datos, IA, seguridad y costos.",
        },
        {
          q: "¿Los quizzes sirven para Digital Leader?",
          a: "Sí. Los quizzes cubren conceptos fundamentales que ayudan a preparar mejor Google Cloud Digital Leader.",
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