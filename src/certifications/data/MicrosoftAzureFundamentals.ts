// src/certifications/data/microsoft-azure-fundamentals.ts
// Modulo dati puro per il renderer server (no React/JSX, no router).

const MicrosoftAzureFundamentals = {
  slug: "microsoft-azure-fundamentals",
  imageUrl: "/images/certifications/azure-fundamentals-icon.png",

  // 🔗 Pagina ufficiale esame AZ-900
  officialUrl:
    "https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/",

  title: {
    it: "Microsoft Azure Fundamentals",
    en: "Microsoft Azure Fundamentals",
    fr: "Microsoft Azure Fondamentaux",
    es: "Fundamentos de Microsoft Azure",
  },

  level: {
    it: "Base",
    en: "Beginner",
    fr: "Débutant",
    es: "Básico",
  },

  description: {
    it: "Introduzione al cloud computing con Azure.",
    en: "Introduction to cloud computing with Azure.",
    fr: "Introduction à l'informatique en nuage avec Azure.",
    es: "Introducción a la computación en la nube con Azure.",
  },
topics: [
  {
    title: {
      it: "Concetti di cloud",
      en: "Cloud concepts",
      fr: "Concepts de cloud",
      es: "Conceptos de nube",
    },
    slug: {
      it: "concetti-di-cloud",
      en: "cloud-concepts",
      fr: "concepts-de-cloud",
      es: "conceptos-de-nube",
    },
  },
  {
    title: {
      it: "Architettura e servizi Azure",
      en: "Azure architecture and services",
      fr: "Architecture et services Azure",
      es: "Arquitectura y servicios de Azure",
    },
    slug: {
      it: "architettura-e-servizi-azure",
      en: "azure-architecture-and-services",
      fr: "architecture-et-services-azure",
      es: "arquitectura-y-servicios-de-azure",
    },
  },
  {
    title: {
      it: "Gestione e governance di Azure",
      en: "Azure management and governance",
      fr: "Gestion et gouvernance d'Azure",
      es: "Gestión y gobernanza de Azure",
    },
    slug: {
      it: "gestione-e-governance-di-azure",
      en: "azure-management-and-governance",
      fr: "gestion-et-gouvernance-dazure",
      es: "gestion-y-gobernanza-de-azure",
    },
  },
],

  extraContent: {
    // ✅ SOLO pagine d’esame ufficiali
    examReference: {
      it: [
        {
          text: "Esame AZ-900: Microsoft Azure Fundamentals",
          url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/",
        },
      ],
      en: [
        {
          text: "Exam AZ-900: Microsoft Azure Fundamentals",
          url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/",
        },
      ],
      fr: [
        {
          text: "Examen AZ-900 : Microsoft Azure Fundamentals",
          url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/",
        },
      ],
      es: [
        {
          text: "Examen AZ-900: Microsoft Azure Fundamentals",
          url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/",
        },
      ],
    },

    learn: {
      it: [
        "Concetti base del cloud computing e modelli di servizio (IaaS, PaaS, SaaS).",
        "Panoramica sui servizi core di Azure (compute, storage, networking).",
        "Sicurezza, identità e conformità su Azure.",
        "Gestione dei costi e modelli di pricing cloud.",
        "Governance e strumenti di monitoraggio.",
      ],
      en: [
        "Basic cloud computing concepts and service models (IaaS, PaaS, SaaS).",
        "Overview of core Azure services (compute, storage, networking).",
        "Security, identity, and compliance on Azure.",
        "Cost management and cloud pricing models.",
        "Governance and monitoring tools.",
      ],
      fr: [
        "Concepts de base du cloud computing et modèles de services (IaaS, PaaS, SaaS).",
        "Présentation des services de base d’Azure (calcul, stockage, réseau).",
        "Sécurité, identité et conformité sur Azure.",
        "Gestion des coûts et modèles de tarification cloud.",
        "Gouvernance et outils de surveillance.",
      ],
      es: [
        "Conceptos básicos de computación en la nube y modelos de servicio (IaaS, PaaS, SaaS).",
        "Resumen de los servicios principales de Azure (cómputo, almacenamiento, red).",
        "Seguridad, identidad y cumplimiento en Azure.",
        "Gestión de costos y modelos de precios en la nube.",
        "Gobernanza y herramientas de monitoreo.",
      ],
    },

    whyChoose: {
      it: [
        "Perfetta introduzione al cloud per studenti e professionisti alle prime armi.",
        "Riconosciuta a livello globale e rilasciata da Microsoft.",
        "Non richiede conoscenze tecniche approfondite.",
        "Base solida per proseguire con certificazioni come Azure Administrator o AI Fundamentals.",
      ],
      en: [
        "Perfect cloud introduction for students and beginners.",
        "Globally recognized certification issued by Microsoft.",
        "No deep technical background required.",
        "Strong foundation for paths like Azure Administrator or AI Fundamentals.",
      ],
      fr: [
        "Introduction parfaite au cloud pour les étudiants et débutants.",
        "Certification reconnue mondialement, délivrée par Microsoft.",
        "Aucune connaissance technique approfondie requise.",
        "Base solide pour poursuivre avec Azure Administrator ou AI Fundamentals.",
      ],
      es: [
        "Introducción perfecta al cloud para estudiantes y principiantes.",
        "Certificación reconocida mundialmente, emitida por Microsoft.",
        "No se requieren conocimientos técnicos avanzados.",
        "Base sólida para avanzar hacia certificaciones como Azure Administrator o AI Fundamentals.",
      ],
    },

    faq: {
      it: [
        {
          q: "Serve esperienza tecnica per affrontare l’esame?",
          a: "No, la certificazione è pensata per principianti e non richiede competenze tecniche avanzate.",
        },
        {
          q: "È obbligatoria per certificazioni Microsoft più avanzate?",
          a: "Non è obbligatoria, ma è altamente consigliata come punto di partenza.",
        },
      ],
      en: [
        {
          q: "Do I need technical experience for this exam?",
          a: "No, the certification is designed for beginners and does not require technical skills.",
        },
        {
          q: "Is it required before other Microsoft certifications?",
          a: "It's not mandatory but highly recommended as a starting point.",
        },
      ],
      fr: [
        {
          q: "Faut-il de l’expérience technique pour passer l’examen ?",
          a: "Non, cette certification est faite pour les débutants sans connaissances techniques avancées.",
        },
        {
          q: "Est-elle obligatoire pour les certifications Microsoft avancées ?",
          a: "Non, mais elle est fortement recommandée comme point de départ.",
        },
      ],
      es: [
        {
          q: "¿Necesito experiencia técnica para este examen?",
          a: "No, está diseñada para principiantes sin conocimientos técnicos previos.",
        },
        {
          q: "¿Es obligatoria antes de otras certificaciones de Microsoft?",
          a: "No es obligatoria, pero sí muy recomendable como base.",
        },
      ],
    },
  },

  // Rotte quiz localizzate
  quizRoute: {
    it: "/it/quiz/azure-fundamentals",
    en: "/en/quiz/azure-fundamentals",
    fr: "/fr/quiz/azure-fundamentals",
    es: "/es/quiz/azure-fundamentals",
  },

  // Rotta “indietro” alla lista certificazioni
  backRoute: {
    it: "/it/certificazioni",
    en: "/certifications",
    fr: "/fr/certifications",
    es: "/es/certificaciones",
  },
} as const;

export default MicrosoftAzureFundamentals;
