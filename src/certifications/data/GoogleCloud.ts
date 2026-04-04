// src/certifications/data/google-cloud.ts
// ✅ Versione data-only (nessun JSX/router). Coerente con gli altri file.
// 🖼️ Assicurati che l’immagine esista in /public/images/certifications/google_cloud_icon.png

const GoogleCloud = {
  slug: "google-cloud",
  imageUrl: "/images/certifications/google_cloud_icon.png",
  officialUrl: "https://cloud.google.com/certification/cloud-digital-leader",

  title: {
    it: "Google Cloud — Fondamenti (Cloud Digital Leader)",
    en: "Google Cloud — Fundamentals (Cloud Digital Leader)",
    fr: "Google Cloud — Fondamentaux (Cloud Digital Leader)",
    es: "Google Cloud — Fundamentos (Cloud Digital Leader)",
  },

  level: {
    it: "Base",
    en: "Beginner",
    fr: "Débutant",
    es: "Básico",
  },

  description: {
    it: "Fondamenti Google Cloud: concetti cloud, servizi GCP, sicurezza, networking e storage. Quiz realistici e link alle pagine ufficiali d’esame.",
    en: "Google Cloud fundamentals: cloud concepts, GCP services, security, networking and storage. Realistic quizzes and links to official exam pages.",
    fr: "Fondamentaux Google Cloud : concepts cloud, services GCP, sécurité, réseau et stockage. Quiz réalistes et liens officiels d’examen.",
    es: "Fundamentos de Google Cloud: conceptos cloud, servicios GCP, seguridad, redes y almacenamiento. Cuestionarios realistas y enlaces oficiales del examen.",
  },

  topics: [
  {
    title: {
      it: "Trasformazione digitale con Google Cloud",
      en: "Digital Transformation with Google Cloud",
      fr: "Transformation numérique avec Google Cloud",
      es: "Transformación digital con Google Cloud",
    },
    slug: {
      it: "trasformazione-digitale-con-google-cloud",
      en: "digital-transformation-with-google-cloud",
      fr: "transformation-numerique-avec-google-cloud",
      es: "transformacion-digital-con-google-cloud",
    },
  },
  {
    title: {
      it: "Innovazione con i dati e Google Cloud",
      en: "Innovation with Data and Google Cloud",
      fr: "Innovation avec les données et Google Cloud",
      es: "Innovación con datos y Google Cloud",
    },
    slug: {
      it: "innovazione-con-i-dati-e-google-cloud",
      en: "innovation-with-data-and-google-cloud",
      fr: "innovation-avec-les-donnees-et-google-cloud",
      es: "innovacion-con-datos-y-google-cloud",
    },
  },
  {
    title: {
      it: "Modernizzazione di infrastrutture e applicazioni",
      en: "Modernization of Infrastructure and Applications",
      fr: "Modernisation de l'infrastructure et des applications",
      es: "Modernización de infraestructura y aplicaciones",
    },
    slug: {
      it: "modernizzazione-di-infrastrutture-e-applicazioni",
      en: "modernization-of-infrastructure-and-applications",
      fr: "modernisation-de-linfrastructure-et-des-applications",
      es: "modernizacion-de-infraestructura-y-aplicaciones",
    },
  },
  {
    title: {
      it: "Sicurezza e operazioni con Google Cloud",
      en: "Security and Operations with Google Cloud",
      fr: "Sécurité et opérations avec Google Cloud",
      es: "Seguridad y operaciones con Google Cloud",
    },
    slug: {
      it: "sicurezza-e-operazioni-con-google-cloud",
      en: "security-and-operations-with-google-cloud",
      fr: "securite-et-operations-avec-google-cloud",
      es: "seguridad-y-operaciones-con-google-cloud",
    },
  },
],

  extraContent: {
    examReference: {
      it: [
        { text: "Cloud Digital Leader — Pagina ufficiale d’esame", url: "https://cloud.google.com/certification/cloud-digital-leader" },
        { text: "Associate Cloud Engineer — (opzionale, passo successivo)", url: "https://cloud.google.com/certification/cloud-engineer" },
      ],
      en: [
        { text: "Cloud Digital Leader — Official exam page", url: "https://cloud.google.com/certification/cloud-digital-leader" },
        { text: "Associate Cloud Engineer — (optional, next step)", url: "https://cloud.google.com/certification/cloud-engineer" },
      ],
      fr: [
        { text: "Cloud Digital Leader — Page officielle de l’examen", url: "https://cloud.google.com/certification/cloud-digital-leader" },
        { text: "Associate Cloud Engineer — (optionnel, étape suivante)", url: "https://cloud.google.com/certification/cloud-engineer" },
      ],
      es: [
        { text: "Cloud Digital Leader — Página oficial del examen", url: "https://cloud.google.com/certification/cloud-digital-leader" },
        { text: "Associate Cloud Engineer — (opcional, siguiente paso)", url: "https://cloud.google.com/certification/cloud-engineer" },
      ],
    },

    learn: {
      it: [
        "Comprendere i concetti fondamentali del cloud computing secondo Google.",
        "Esplorare i principali servizi offerti da Google Cloud Platform (GCP).",
        "Conoscere i modelli di deployment e gestione delle risorse su GCP.",
        "Apprendere le pratiche di sicurezza e conformità nella nuvola.",
        "Sviluppare competenze di base su networking, storage e compute su GCP.",
      ],
      en: [
        "Understand fundamental cloud computing concepts according to Google.",
        "Explore key services offered by Google Cloud Platform (GCP).",
        "Learn about deployment models and resource management in GCP.",
        "Gain knowledge on cloud security and compliance best practices.",
        "Develop basic skills in networking, storage, and compute on GCP.",
      ],
      fr: [
        "Comprendre les concepts fondamentaux du cloud computing selon Google.",
        "Explorer les principaux services offerts par Google Cloud Platform (GCP).",
        "Connaître les modèles de déploiement et la gestion des ressources sur GCP.",
        "Apprendre les pratiques de sécurité et de conformité dans le cloud.",
        "Développer des compétences de base en réseau, stockage et calcul sur GCP.",
      ],
      es: [
        "Comprender los conceptos fundamentales de la computación en la nube según Google.",
        "Explorar los principales servicios ofrecidos por Google Cloud Platform (GCP).",
        "Conocer los modelos de implementación y gestión de recursos en GCP.",
        "Aprender las prácticas de seguridad y cumplimiento en la nube.",
        "Desarrollar habilidades básicas en redes, almacenamiento y cómputo en GCP.",
      ],
    },

    whyChoose: {
      it: [
        "Certificazione ufficiale supportata da Google.",
        "Riconosciuta da aziende e startup che adottano GCP.",
        "Base ideale per ruoli cloud entry-level e futuri esperti.",
        "Copre concetti cloud vendor-neutral e pratici.",
        "Valida per concorsi pubblici e selezioni IT moderne.",
      ],
      en: [
        "Official certification supported by Google.",
        "Recognized by companies and startups using GCP.",
        "Great foundation for entry-level cloud roles and future specialists.",
        "Covers vendor-neutral and practical cloud concepts.",
        "Valid for public competitions and modern IT job selection.",
      ],
      fr: [
        "Certification officielle soutenue par Google.",
        "Reconnue par les entreprises et les startups utilisant GCP.",
        "Base idéale pour les rôles cloud débutants et futurs experts.",
        "Couvre des concepts cloud neutres et pratiques.",
        "Valable pour les concours publics et les sélections informatiques modernes.",
      ],
      es: [
        "Certificación oficial respaldada por Google.",
        "Reconocida por empresas y startups que usan GCP.",
        "Base ideal para roles de entrada en cloud y futuros especialistas.",
        "Cubre conceptos en la nube neutrales y prácticos.",
        "Válida para oposiciones y procesos de selección en TI.",
      ],
    },

    faq: {
      it: [
        { q: "È adatta anche a chi non ha esperienza cloud?", a: "Sì, la certificazione è pensata per principianti e professionisti alle prime armi con GCP." },
        { q: "Ci sono esami ufficiali disponibili?", a: "Sì, Google offre l’esame ‘Cloud Digital Leader’ come introduzione ufficiale." },
        { q: "Quanto dura la certificazione?", a: "La validità standard è di 3 anni, come per molte certificazioni cloud." },
      ],
      en: [
        { q: "Is it suitable for cloud beginners?", a: "Yes, it is designed for newcomers and professionals starting with GCP." },
        { q: "Are there official exams available?", a: "Yes, Google offers the ‘Cloud Digital Leader’ exam as an official entry point." },
        { q: "How long is the certification valid?", a: "Typically, it's valid for 3 years like most cloud certifications." },
      ],
      fr: [
        { q: "Est-elle adaptée aux débutants en cloud ?", a: "Oui, elle est conçue pour les débutants et les professionnels débutant sur GCP." },
        { q: "Y a-t-il des examens officiels disponibles ?", a: "Oui, Google propose l’examen ‘Cloud Digital Leader’ comme introduction officielle." },
        { q: "Quelle est la durée de validité ?", a: "En général, elle est valable 3 ans comme les autres certifications cloud." },
      ],
      es: [
        { q: "¿Es adecuada para principiantes en la nube?", a: "Sí, está diseñada para principiantes y profesionales que empiezan con GCP." },
        { q: "¿Hay exámenes oficiales disponibles?", a: "Sí, Google ofrece el examen ‘Cloud Digital Leader’ como entrada oficial." },
        { q: "¿Cuánto dura la certificación?", a: "Normalmente tiene una validez de 3 años como otras certificaciones cloud." },
      ],
    },
  },

  // Rotte quiz localizzate
  quizRoute: {
    it: "/it/quiz/google-cloud",
    en: "/en/quiz/google-cloud",
    fr: "/fr/quiz/google-cloud",
    es: "/es/quiz/google-cloud",
  },

  // Rotta “indietro”: lista certificazioni per lingua
  backRoute: {
    it: "/it/certificazioni",
    en: "/certifications",
    fr: "/fr/certifications",
    es: "/es/certificaciones",
  },
} as const;

export default GoogleCloud;
