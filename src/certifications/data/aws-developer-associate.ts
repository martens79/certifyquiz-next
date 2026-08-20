// src/certifications/data/aws-developer-associate.ts
// ✅ LIVE dal 2026-08-20 — collegata al registro (IDS_BY_SLUG/RAW_CERTS) e
// alla hub aws-cloud (quarta card). Completa il trio Associate insieme a
// Solutions Architect e SysOps Administrator (quest'ultima ancora da fare).
//
// ⚠️ Le 210 domande sono SOLO in italiano (question_en/fr/es NULL in DB).
// L'endpoint quiz (/api/questions/:topicId) non ha fallback IT per le altre
// lingue: un utente EN/FR/ES che fa questo quiz vede domande/risposte vuote
// finché non si eseguono le UPDATE di traduzione — gap noto e accettato
// (decisione 2026-08-20), da chiudere appena possibile.
//
// Logo: /public/images/certifications/aws-developer-associate.png non esiste
// ancora — imageUrl è volutamente "" (vedi commento sotto) per mostrare il
// placeholder generico invece di un'icona rotta. Aggiornare quando pronto.
//
// Blueprint verificato il 2026-08-19 sull'exam guide ufficiale AWS.

const AWSDeveloperAssociate = {
  slug: "aws-developer-associate",
  // Logo non ancora caricato in /public/images/certifications/. Stringa
  // vuota invece del path atteso: i componenti (hub card, ecc.) trattano
  // imageUrl falsy come "nessun logo" e mostrano il placeholder generico,
  // invece di un'icona rotta. Aggiornare non appena il file è disponibile.
  imageUrl: "",
  officialUrl: "https://aws.amazon.com/certification/certified-developer-associate/",

  examBlueprint: {
    provider: "AWS",
    examCode: "DVA-C02",
    officialSourceName: "AWS Certified Developer - Associate — Exam Guide (DVA-C02)",
    officialSourceUrl:
      "https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02.html",
    officialExamPageUrl: "https://aws.amazon.com/certification/certified-developer-associate/",
    lastVerifiedAt: "2026-08-19",
    domains: [
      { name: "Development with AWS Services", percentage: 32 },
      { name: "Security", percentage: 26 },
      { name: "Deployment", percentage: 24 },
      { name: "Troubleshooting and Optimization", percentage: 18 },
    ],
  },

  levelOrder: 3, // associate, dopo Cloud Practitioner e AI Practitioner

  title: {
    it: "AWS Certified Developer – Associate – Simulazione Esame DVA-C02 2026",
    en: "AWS Certified Developer – Associate – DVA-C02 Practice Test 2026",
    fr: "AWS Certified Developer – Associate – Simulation Examen DVA-C02 2026",
    es: "AWS Certified Developer – Associate – Simulacro Examen DVA-C02 2026",
  },

  level: {
    it: "Associate",
    en: "Associate",
    fr: "Associate",
    es: "Associate",
  },

  description: {
    it: "Preparati all'esame AWS Certified Developer – Associate DVA-C02 con quiz in stile esame su sviluppo, sicurezza, deployment CI/CD e troubleshooting di applicazioni cloud-native su AWS. Aggiornato al 2026.",
    en: "Prepare for the AWS Certified Developer – Associate DVA-C02 exam with exam-style quizzes covering development, security, CI/CD deployment, and troubleshooting of cloud-native applications on AWS. Updated for 2026.",
    fr: "Préparez l'examen AWS Certified Developer – Associate DVA-C02 avec des quiz type examen sur le développement, la sécurité, le déploiement CI/CD et le dépannage d'applications cloud-natives sur AWS. Mis à jour en 2026.",
    es: "Prepárate para el examen AWS Certified Developer – Associate DVA-C02 con quizzes tipo examen sobre desarrollo, seguridad, despliegue CI/CD y resolución de problemas de aplicaciones cloud-native en AWS. Actualizado en 2026.",
  },

  metaTitle: {
    it: "AWS Developer Associate DVA-C02 – Quiz e Simulazione Esame 2026 | CertifyQuiz",
    en: "AWS Developer Associate DVA-C02 – Practice Test & Exam Simulation 2026 | CertifyQuiz",
    fr: "AWS Developer Associate DVA-C02 – Quiz et Simulation Examen 2026 | CertifyQuiz",
    es: "AWS Developer Associate DVA-C02 – Quiz y Simulacro Examen 2026 | CertifyQuiz",
  },

  metaDescription: {
    it: "Simulazione esame AWS Certified Developer – Associate DVA-C02: quiz su sviluppo, sicurezza, CI/CD e troubleshooting su AWS. Inizia gratis su CertifyQuiz.",
    en: "AWS Certified Developer – Associate DVA-C02 practice test: quizzes on development, security, CI/CD, and troubleshooting on AWS. Start free on CertifyQuiz.",
    fr: "Simulation examen AWS Developer Associate DVA-C02 : quiz sur développement, sécurité, CI/CD et dépannage sur AWS. Commencez gratuitement sur CertifyQuiz.",
    es: "Simulacro examen AWS Developer Associate DVA-C02: quizzes sobre desarrollo, seguridad, CI/CD y resolución de problemas en AWS. Empieza gratis en CertifyQuiz.",
  },

  // ─── EXTRA CONTENT ──────────────────────────────────────────────────────────

  extraContent: {
    learn: {
      it: [
        "Sviluppare applicazioni resilienti su AWS con pattern event-driven, messaggistica (SQS/SNS/EventBridge) e gestione strutturata degli errori.",
        "Configurare, ottimizzare e integrare funzioni AWS Lambda: versioni, alias, concorrenza, cold start e performance tuning.",
        "Progettare l'accesso ai dati con DynamoDB, caching (ElastiCache/DAX) e riconoscere quando usare store specializzati in base al workload.",
        "Implementare autenticazione, autorizzazione e crittografia con Cognito, IAM, KMS e Secrets Manager.",
        "Automatizzare test e deployment con AWS SAM, CodePipeline/CodeBuild/CodeDeploy e strategie blue/green, canary e rolling.",
      ],
      en: [
        "Develop resilient applications on AWS with event-driven patterns, messaging (SQS/SNS/EventBridge), and structured error handling.",
        "Configure, optimize, and integrate AWS Lambda functions: versions, aliases, concurrency, cold starts, and performance tuning.",
        "Design data access with DynamoDB, caching (ElastiCache/DAX), and recognize when to use specialized data stores based on workload.",
        "Implement authentication, authorization, and encryption with Cognito, IAM, KMS, and Secrets Manager.",
        "Automate testing and deployment with AWS SAM, CodePipeline/CodeBuild/CodeDeploy, and blue/green, canary, and rolling strategies.",
      ],
      fr: [
        "Développer des applications résilientes sur AWS avec des modèles event-driven, la messagerie (SQS/SNS/EventBridge) et une gestion structurée des erreurs.",
        "Configurer, optimiser et intégrer des fonctions AWS Lambda : versions, alias, concurrence, cold start et optimisation des performances.",
        "Concevoir l'accès aux données avec DynamoDB, la mise en cache (ElastiCache/DAX), et reconnaître quand utiliser des data stores spécialisés selon la charge de travail.",
        "Mettre en œuvre l'authentification, l'autorisation et le chiffrement avec Cognito, IAM, KMS et Secrets Manager.",
        "Automatiser les tests et le déploiement avec AWS SAM, CodePipeline/CodeBuild/CodeDeploy et les stratégies blue/green, canary et rolling.",
      ],
      es: [
        "Desarrollar aplicaciones resilientes en AWS con patrones event-driven, mensajería (SQS/SNS/EventBridge) y gestión estructurada de errores.",
        "Configurar, optimizar e integrar funciones AWS Lambda: versiones, alias, concurrencia, cold start y ajuste de rendimiento.",
        "Diseñar el acceso a datos con DynamoDB, caché (ElastiCache/DAX), y reconocer cuándo usar almacenes de datos especializados según la carga de trabajo.",
        "Implementar autenticación, autorización y cifrado con Cognito, IAM, KMS y Secrets Manager.",
        "Automatizar pruebas y despliegue con AWS SAM, CodePipeline/CodeBuild/CodeDeploy y estrategias blue/green, canary y rolling.",
      ],
    },

    examReference: {
      it: [
        {
          text: "AWS Certified Developer - Associate — Pagina ufficiale della certificazione",
          url: "https://aws.amazon.com/certification/certified-developer-associate/",
        },
      ],
      en: [
        {
          text: "AWS Certified Developer - Associate — Official certification page",
          url: "https://aws.amazon.com/certification/certified-developer-associate/",
        },
      ],
      fr: [
        {
          text: "AWS Certified Developer - Associate — Page officielle de la certification",
          url: "https://aws.amazon.com/certification/certified-developer-associate/",
        },
      ],
      es: [
        {
          text: "AWS Certified Developer - Associate — Página oficial de la certificación",
          url: "https://aws.amazon.com/certification/certified-developer-associate/",
        },
      ],
    },

    whyChoose: {
      it: [
        "Una delle certificazioni Associate AWS più richieste per ruoli di sviluppo software cloud-native.",
        "Copre l'intero ciclo di vita applicativo: sviluppo, sicurezza, test e deployment automatizzato, non solo il design dell'architettura.",
        "Completa il trio Associate insieme a Solutions Architect Associate e SysOps Administrator Associate.",
        "Quiz aggiornati al 2026 con scenari realistici su Lambda, DynamoDB, CodePipeline e strategie di deployment blue/green e canary.",
        "Valida competenze pratiche di codice, SDK e automazione richieste ogni giorno dai team di sviluppo che lavorano su AWS.",
      ],
      en: [
        "One of the most in-demand AWS Associate certifications for cloud-native software development roles.",
        "Covers the full application lifecycle: development, security, testing, and automated deployment, not just architectural design.",
        "Completes the Associate trio alongside Solutions Architect Associate and SysOps Administrator Associate.",
        "Quizzes updated for 2026 with realistic scenarios on Lambda, DynamoDB, CodePipeline, and blue/green and canary deployment strategies.",
        "Validates practical code, SDK, and automation skills used daily by development teams working on AWS.",
      ],
      fr: [
        "L'une des certifications AWS Associate les plus recherchées pour les rôles de développement logiciel cloud-native.",
        "Couvre l'ensemble du cycle de vie applicatif : développement, sécurité, tests et déploiement automatisé, pas seulement la conception architecturale.",
        "Complète le trio Associate aux côtés de Solutions Architect Associate et SysOps Administrator Associate.",
        "Quiz mis à jour en 2026 avec des scénarios réalistes sur Lambda, DynamoDB, CodePipeline et les stratégies de déploiement blue/green et canary.",
        "Valide des compétences pratiques en code, SDK et automatisation utilisées quotidiennement par les équipes de développement sur AWS.",
      ],
      es: [
        "Una de las certificaciones AWS Associate más solicitadas para roles de desarrollo de software cloud-native.",
        "Cubre todo el ciclo de vida de la aplicación: desarrollo, seguridad, pruebas y despliegue automatizado, no solo el diseño de la arquitectura.",
        "Completa el trío Associate junto con Solutions Architect Associate y SysOps Administrator Associate.",
        "Quizzes actualizados para 2026 con escenarios realistas sobre Lambda, DynamoDB, CodePipeline y estrategias de despliegue blue/green y canary.",
        "Valida habilidades prácticas de código, SDK y automatización que usan a diario los equipos de desarrollo que trabajan en AWS.",
      ],
    },

    faq: {
      it: [
        {
          q: "Serve esperienza di programmazione per questa certificazione?",
          a: "Sì. A differenza di Cloud Practitioner e AI Practitioner (foundational), Developer Associate richiede familiarità con almeno un linguaggio ad alto livello e con concetti base di sviluppo applicativo (API, SDK, gestione degli errori).",
        },
        {
          q: "Quanto tempo ci vuole per prepararsi?",
          a: "La maggior parte dei candidati con esperienza di sviluppo si prepara in 2-3 mesi con sessioni regolari di quiz e pratica su Lambda, DynamoDB e i servizi CI/CD.",
        },
        {
          q: "In cosa differisce da AWS Solutions Architect Associate?",
          a: "Solutions Architect si concentra sulla progettazione dell'architettura complessiva; Developer Associate è più tecnica e orientata al codice: SDK, API, debugging, testing e automazione del deployment.",
        },
        {
          q: "Quali servizi AWS sono più testati nell'esame?",
          a: "Lambda, API Gateway, DynamoDB, servizi di sicurezza (IAM, Cognito, KMS, Secrets Manager) e servizi CI/CD (CodePipeline, CodeBuild, CodeDeploy) coprono la maggior parte delle domande.",
        },
      ],
      en: [
        {
          q: "Do I need programming experience for this certification?",
          a: "Yes. Unlike Cloud Practitioner and AI Practitioner (foundational), Developer Associate requires familiarity with at least one high-level programming language and basic application development concepts (APIs, SDKs, error handling).",
        },
        {
          q: "How long does it take to prepare?",
          a: "Most candidates with development experience prepare in 2–3 months with regular quiz sessions and hands-on practice with Lambda, DynamoDB, and CI/CD services.",
        },
        {
          q: "How does it differ from AWS Solutions Architect Associate?",
          a: "Solutions Architect focuses on overall architecture design; Developer Associate is more technical and code-oriented: SDKs, APIs, debugging, testing, and deployment automation.",
        },
        {
          q: "Which AWS services are most tested in the exam?",
          a: "Lambda, API Gateway, DynamoDB, security services (IAM, Cognito, KMS, Secrets Manager), and CI/CD services (CodePipeline, CodeBuild, CodeDeploy) cover most of the questions.",
        },
      ],
      fr: [
        {
          q: "Faut-il de l'expérience en programmation pour cette certification ?",
          a: "Oui. Contrairement à Cloud Practitioner et AI Practitioner (fondamentales), Developer Associate exige une familiarité avec au moins un langage de haut niveau et des concepts de base du développement applicatif (API, SDK, gestion des erreurs).",
        },
        {
          q: "Combien de temps faut-il pour se préparer ?",
          a: "La plupart des candidats ayant une expérience de développement se préparent en 2 à 3 mois avec des sessions régulières de quiz et de pratique sur Lambda, DynamoDB et les services CI/CD.",
        },
        {
          q: "En quoi diffère-t-elle d'AWS Solutions Architect Associate ?",
          a: "Solutions Architect se concentre sur la conception globale de l'architecture ; Developer Associate est plus technique et orientée code : SDK, API, débogage, tests et automatisation du déploiement.",
        },
        {
          q: "Quels services AWS sont les plus testés à l'examen ?",
          a: "Lambda, API Gateway, DynamoDB, les services de sécurité (IAM, Cognito, KMS, Secrets Manager) et les services CI/CD (CodePipeline, CodeBuild, CodeDeploy) couvrent la majorité des questions.",
        },
      ],
      es: [
        {
          q: "¿Necesito experiencia en programación para esta certificación?",
          a: "Sí. A diferencia de Cloud Practitioner y AI Practitioner (fundacionales), Developer Associate requiere familiaridad con al menos un lenguaje de alto nivel y conceptos básicos de desarrollo de aplicaciones (APIs, SDKs, gestión de errores).",
        },
        {
          q: "¿Cuánto tiempo lleva prepararse?",
          a: "La mayoría de los candidatos con experiencia en desarrollo se preparan en 2-3 meses con sesiones regulares de quiz y práctica con Lambda, DynamoDB y servicios CI/CD.",
        },
        {
          q: "¿En qué se diferencia de AWS Solutions Architect Associate?",
          a: "Solutions Architect se centra en el diseño general de la arquitectura; Developer Associate es más técnica y orientada al código: SDKs, APIs, depuración, pruebas y automatización del despliegue.",
        },
        {
          q: "¿Qué servicios de AWS se evalúan más en el examen?",
          a: "Lambda, API Gateway, DynamoDB, servicios de seguridad (IAM, Cognito, KMS, Secrets Manager) y servicios CI/CD (CodePipeline, CodeBuild, CodeDeploy) cubren la mayoría de las preguntas.",
        },
      ],
    },
  },

  // ─── TOPICS (7, approvati) ────────────────────────────────────────────────
  // Dominio 1 (32%) sdoppiato in 3 topic, Dominio 3 (24%) in 2 topic — gli
  // altri due domini restano 1:1. Titoli/slug qui devono restare identici
  // (per lingua) a quelli inseriti in DB dalla migration SQL corrispondente.

  topics: [
    {
      title: {
        it: "Sviluppo di applicazioni su AWS",
        en: "Developing applications on AWS",
        fr: "Développement d'applications sur AWS",
        es: "Desarrollo de aplicaciones en AWS",
      },
      slug: {
        it: "sviluppo-applicazioni-aws",
        en: "developing-applications-on-aws",
        fr: "developpement-applications-aws",
        es: "desarrollo-aplicaciones-aws",
      },
    },
    {
      title: {
        it: "Sviluppo con AWS Lambda",
        en: "Developing with AWS Lambda",
        fr: "Développement avec AWS Lambda",
        es: "Desarrollo con AWS Lambda",
      },
      slug: {
        it: "sviluppo-aws-lambda",
        en: "developing-with-aws-lambda",
        fr: "developpement-aws-lambda",
        es: "desarrollo-aws-lambda",
      },
    },
    {
      title: {
        it: "Data store nello sviluppo applicativo",
        en: "Data stores in application development",
        fr: "Data stores dans le développement applicatif",
        es: "Almacenes de datos en el desarrollo de aplicaciones",
      },
      slug: {
        it: "data-store-sviluppo-applicativo",
        en: "data-stores-application-development",
        fr: "data-stores-developpement-applicatif",
        es: "almacenes-datos-desarrollo-aplicaciones",
      },
    },
    {
      title: {
        it: "Sicurezza delle applicazioni AWS",
        en: "AWS application security",
        fr: "Sécurité des applications AWS",
        es: "Seguridad de aplicaciones AWS",
      },
      slug: {
        it: "sicurezza-applicazioni-aws",
        en: "aws-application-security",
        fr: "securite-applications-aws",
        es: "seguridad-aplicaciones-aws",
      },
    },
    {
      title: {
        it: "Preparazione e test delle applicazioni",
        en: "Preparing and testing applications",
        fr: "Préparation et test des applications",
        es: "Preparación y prueba de aplicaciones",
      },
      slug: {
        it: "preparazione-test-applicazioni",
        en: "preparing-and-testing-applications",
        fr: "preparation-test-applications",
        es: "preparacion-prueba-aplicaciones",
      },
    },
    {
      title: {
        it: "CI/CD e strategie di deployment su AWS",
        en: "CI/CD and deployment strategies on AWS",
        fr: "CI/CD et stratégies de déploiement sur AWS",
        es: "CI/CD y estrategias de despliegue en AWS",
      },
      slug: {
        it: "cicd-strategie-deployment-aws",
        en: "cicd-and-deployment-strategies-on-aws",
        fr: "cicd-strategies-deploiement-aws",
        es: "cicd-estrategias-despliegue-aws",
      },
    },
    {
      title: {
        it: "Troubleshooting, osservabilità e ottimizzazione",
        en: "Troubleshooting, observability and optimization",
        fr: "Dépannage, observabilité et optimisation",
        es: "Resolución de problemas, observabilidad y optimización",
      },
      slug: {
        it: "troubleshooting-osservabilita-ottimizzazione",
        en: "troubleshooting-observability-optimization",
        fr: "depannage-observabilite-optimisation",
        es: "resolucion-problemas-observabilidad-optimizacion",
      },
    },
  ],

  // ─── ROUTES ─────────────────────────────────────────────────────────────

  quizRoute: {
    it: "/it/quiz/aws-developer-associate",
    en: "/en/quiz/aws-developer-associate",
    fr: "/fr/quiz/aws-developer-associate",
    es: "/es/quiz/aws-developer-associate",
  },

  backRoute: {
    it: "/it/certificazioni",
    en: "/en/certifications",
    fr: "/fr/certifications",
    es: "/es/certifications",
  },
} as const;

export default AWSDeveloperAssociate;
