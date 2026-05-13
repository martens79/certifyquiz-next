// src/certifications/data/google-cloud.ts
// 🌟 CertifyQuiz Original / Foundations path
// ✅ Mantiene slug "google-cloud" per non rompere SEO, link e quiz esistenti.
// ✅ Percorso base/foundations proprietario CertifyQuiz.
// ✅ Pensato come certificazione introduttiva gratuita prima di Google Cloud Digital Leader.

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
    it: "Base gratuita",
    en: "Free Beginner",
    fr: "Débutant gratuit",
    es: "Principiante gratis",
  },

  description: {
    it: "Google Cloud Foundations by CertifyQuiz è un percorso base gratuito pensato per chi vuole iniziare a capire Google Cloud da zero. Copre i concetti fondamentali del cloud, i servizi dati e AI, la sicurezza, l’infrastruttura, il compute e la modernizzazione delle applicazioni.",
    en: "Google Cloud Foundations by CertifyQuiz is a free beginner path for learners who want to understand Google Cloud from zero. It covers cloud fundamentals, data and AI services, security, infrastructure, compute, and application modernization.",
    fr: "Google Cloud Foundations by CertifyQuiz est un parcours débutant gratuit pour comprendre Google Cloud depuis zéro. Il couvre les fondamentaux du cloud, les services de données et d’IA, la sécurité, l’infrastructure, le compute et la modernisation des applications.",
    es: "Google Cloud Foundations by CertifyQuiz es una ruta gratuita para principiantes que quieren entender Google Cloud desde cero. Cubre fundamentos cloud, servicios de datos e IA, seguridad, infraestructura, compute y modernización de aplicaciones.",
  },

  metaTitle: {
    it: "Google Cloud Foundations Gratis | Quiz Base Cloud 2026",
    en: "Free Google Cloud Foundations Quiz | Cloud Basics 2026",
    fr: "Google Cloud Foundations gratuit | Quiz bases cloud 2026",
    es: "Google Cloud Foundations gratis | Quiz bases cloud 2026",
  },

  metaDescription: {
    it: "Impara Google Cloud da zero con un percorso gratuito CertifyQuiz. Quiz su fondamenti cloud, AI, dati, sicurezza, infrastruttura, compute e modernizzazione.",
    en: "Learn Google Cloud from zero with a free CertifyQuiz path. Practice quizzes on cloud fundamentals, AI, data, security, infrastructure, compute, and modernization.",
    fr: "Apprenez Google Cloud depuis zéro avec un parcours gratuit CertifyQuiz. Quiz sur les fondamentaux cloud, l’IA, les données, la sécurité, l’infrastructure, le compute et la modernisation.",
    es: "Aprende Google Cloud desde cero con una ruta gratuita de CertifyQuiz. Quizzes sobre fundamentos cloud, IA, datos, seguridad, infraestructura, compute y modernización.",
  },

  topics: [
    {
      title: {
        it: "Fondamenti del cloud e Google Cloud",
        en: "Cloud and Google Cloud Fundamentals",
        fr: "Fondamentaux du cloud et de Google Cloud",
        es: "Fundamentos de cloud y Google Cloud",
      },
      slug: {
        it: "fondamenti-cloud-google-cloud",
        en: "cloud-google-cloud-fundamentals",
        fr: "fondamentaux-cloud-google-cloud",
        es: "fundamentos-cloud-google-cloud",
      },
    },
    {
      title: {
        it: "AI e servizi dati Google Cloud",
        en: "Google Cloud AI and Data Services",
        fr: "IA et services de données Google Cloud",
        es: "IA y servicios de datos de Google Cloud",
      },
      slug: {
        it: "ai-servizi-dati-google-cloud",
        en: "google-cloud-ai-data-services",
        fr: "ia-services-donnees-google-cloud",
        es: "ia-servicios-datos-google-cloud",
      },
    },
    {
      title: {
        it: "Sicurezza cloud e infrastruttura Google",
        en: "Google Cloud Security and Infrastructure",
        fr: "Sécurité cloud et infrastructure Google",
        es: "Seguridad cloud e infraestructura Google",
      },
      slug: {
        it: "sicurezza-cloud-infrastruttura-google",
        en: "google-cloud-security-infrastructure",
        fr: "securite-cloud-infrastructure-google",
        es: "seguridad-cloud-infraestructura-google",
      },
    },
    {
      title: {
        it: "Compute e modernizzazione applicazioni",
        en: "Compute and Application Modernization",
        fr: "Compute et modernisation des applications",
        es: "Compute y modernización de aplicaciones",
      },
      slug: {
        it: "compute-modernizzazione-applicazioni",
        en: "compute-application-modernization",
        fr: "compute-modernisation-applications",
        es: "compute-modernizacion-aplicaciones",
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
        "Comprendere i concetti fondamentali del cloud computing e il ruolo di Google Cloud.",
        "Distinguere region, zone, servizi core, risorse cloud e modelli di scalabilità.",
        "Conoscere i principali servizi dati e AI di Google Cloud a livello introduttivo.",
        "Capire le basi di IAM, sicurezza cloud, infrastruttura, responsabilità condivisa e controllo degli accessi.",
        "Scoprire compute, container, serverless e modernizzazione delle applicazioni con servizi come Cloud Run, GKE e App Engine.",
        "Costruire una base solida prima di passare a Google Cloud Digital Leader o ad altri percorsi cloud.",
      ],
      en: [
        "Understand the fundamentals of cloud computing and the role of Google Cloud.",
        "Distinguish regions, zones, core services, cloud resources, and scalability models.",
        "Learn the main Google Cloud data and AI services at an introductory level.",
        "Understand IAM, cloud security, infrastructure, shared responsibility, and access control basics.",
        "Explore compute, containers, serverless, and application modernization with services such as Cloud Run, GKE, and App Engine.",
        "Build a solid foundation before moving to Google Cloud Digital Leader or other cloud learning paths.",
      ],
      fr: [
        "Comprendre les fondamentaux du cloud computing et le rôle de Google Cloud.",
        "Distinguer régions, zones, services principaux, ressources cloud et modèles de scalabilité.",
        "Découvrir les principaux services de données et d’IA de Google Cloud à un niveau introductif.",
        "Comprendre les bases de l’IAM, de la sécurité cloud, de l’infrastructure, de la responsabilité partagée et du contrôle d’accès.",
        "Découvrir le compute, les conteneurs, le serverless et la modernisation des applications avec Cloud Run, GKE et App Engine.",
        "Construire une base solide avant de passer à Google Cloud Digital Leader ou à d’autres parcours cloud.",
      ],
      es: [
        "Comprender los fundamentos del cloud computing y el papel de Google Cloud.",
        "Distinguir regiones, zonas, servicios principales, recursos cloud y modelos de escalabilidad.",
        "Conocer los principales servicios de datos e IA de Google Cloud a nivel introductorio.",
        "Comprender IAM, seguridad cloud, infraestructura, responsabilidad compartida y control de acceso.",
        "Explorar compute, contenedores, serverless y modernización de aplicaciones con Cloud Run, GKE y App Engine.",
        "Crear una base sólida antes de avanzar hacia Google Cloud Digital Leader u otros recorridos cloud.",
      ],
    },

    whyChoose: {
      it: [
        "È gratuito e pensato come punto di ingresso semplice nel mondo Google Cloud.",
        "È ideale per principianti, studenti, junior e persone che arrivano da percorsi non tecnici.",
        "Ti permette di capire il cloud prima di affrontare certificazioni ufficiali più strutturate.",
        "Unisce teoria, servizi reali Google Cloud e quiz pratici in un percorso leggero ma utile.",
        "È un buon primo step prima di Google Cloud Digital Leader, Cloud Digital Leader o altri percorsi cloud.",
      ],
      en: [
        "It is free and designed as a simple entry point into the Google Cloud ecosystem.",
        "It is ideal for beginners, students, junior profiles, and learners from non-technical backgrounds.",
        "It helps you understand cloud concepts before approaching more structured official certifications.",
        "It combines theory, real Google Cloud services, and practical quizzes in a light but useful path.",
        "It is a good first step before Google Cloud Digital Leader or other cloud learning paths.",
      ],
      fr: [
        "Il est gratuit et conçu comme un point d’entrée simple dans l’écosystème Google Cloud.",
        "Il est idéal pour les débutants, étudiants, profils juniors et personnes issues de parcours non techniques.",
        "Il aide à comprendre les concepts cloud avant d’aborder des certifications officielles plus structurées.",
        "Il combine théorie, services réels Google Cloud et quiz pratiques dans un parcours léger mais utile.",
        "C’est une bonne première étape avant Google Cloud Digital Leader ou d’autres parcours cloud.",
      ],
      es: [
        "Es gratuito y está diseñado como una entrada sencilla al ecosistema Google Cloud.",
        "Es ideal para principiantes, estudiantes, perfiles junior y personas de áreas no técnicas.",
        "Ayuda a entender el cloud antes de preparar certificaciones oficiales más estructuradas.",
        "Combina teoría, servicios reales de Google Cloud y quizzes prácticos en una ruta ligera pero útil.",
        "Es un buen primer paso antes de Google Cloud Digital Leader u otros recorridos cloud.",
      ],
    },

    faq: {
      it: [
        {
          q: "Google Cloud Foundations by CertifyQuiz è una certificazione ufficiale Google?",
          a: "No. È un percorso proprietario CertifyQuiz sui fondamenti di Google Cloud. È pensato come base gratuita prima di eventuali certificazioni ufficiali.",
        },
        {
          q: "Questo percorso sarà gratuito?",
          a: "Sì. Google Cloud Foundations rientra nei percorsi base CertifyQuiz pensati per aiutare gli utenti a iniziare senza barriere.",
        },
        {
          q: "È utile prima di Google Cloud Digital Leader?",
          a: "Sì. Aiuta a costruire le basi su cloud, dati, AI, sicurezza, infrastruttura e modernizzazione prima di affrontare Google Cloud Digital Leader.",
        },
        {
          q: "Serve esperienza tecnica avanzata?",
          a: "No. Il percorso è pensato per principianti, studenti, profili junior e persone che vogliono entrare nel cloud da zero.",
        },
      ],
      en: [
        {
          q: "Is Google Cloud Foundations by CertifyQuiz an official Google certification?",
          a: "No. It is a proprietary CertifyQuiz path focused on Google Cloud fundamentals. It is designed as a free foundation before official certifications.",
        },
        {
          q: "Will this path be free?",
          a: "Yes. Google Cloud Foundations belongs to the CertifyQuiz foundation paths designed to help users start without barriers.",
        },
        {
          q: "Is it useful before Google Cloud Digital Leader?",
          a: "Yes. It helps you build foundations in cloud, data, AI, security, infrastructure, and modernization before approaching Google Cloud Digital Leader.",
        },
        {
          q: "Do I need advanced technical experience?",
          a: "No. The path is designed for beginners, students, junior profiles, and learners who want to start cloud from zero.",
        },
      ],
      fr: [
        {
          q: "Google Cloud Foundations by CertifyQuiz est-elle une certification officielle Google ?",
          a: "Non. C’est un parcours propriétaire CertifyQuiz sur les fondamentaux de Google Cloud. Il sert de base gratuite avant d’éventuelles certifications officielles.",
        },
        {
          q: "Ce parcours sera-t-il gratuit ?",
          a: "Oui. Google Cloud Foundations fait partie des parcours de base CertifyQuiz conçus pour aider les utilisateurs à commencer sans barrière.",
        },
        {
          q: "Est-il utile avant Google Cloud Digital Leader ?",
          a: "Oui. Il aide à construire les bases du cloud, des données, de l’IA, de la sécurité, de l’infrastructure et de la modernisation avant Google Cloud Digital Leader.",
        },
        {
          q: "Faut-il une expérience technique avancée ?",
          a: "Non. Le parcours est conçu pour les débutants, étudiants, profils juniors et personnes qui veulent commencer le cloud depuis zéro.",
        },
      ],
      es: [
        {
          q: "¿Google Cloud Foundations by CertifyQuiz es una certificación oficial de Google?",
          a: "No. Es una ruta propia de CertifyQuiz sobre fundamentos de Google Cloud. Está pensada como base gratuita antes de certificaciones oficiales.",
        },
        {
          q: "¿Esta ruta será gratuita?",
          a: "Sí. Google Cloud Foundations forma parte de las rutas base de CertifyQuiz pensadas para ayudar a los usuarios a empezar sin barreras.",
        },
        {
          q: "¿Sirve antes de Google Cloud Digital Leader?",
          a: "Sí. Ayuda a construir bases sobre cloud, datos, IA, seguridad, infraestructura y modernización antes de Google Cloud Digital Leader.",
        },
        {
          q: "¿Necesito experiencia técnica avanzada?",
          a: "No. La ruta está diseñada para principiantes, estudiantes, perfiles junior y personas que quieren empezar en cloud desde cero.",
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