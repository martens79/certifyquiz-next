// src/certifications/data/csharp.ts
// ✅ Versione semplice coerente con gli altri file (solo `as const`, nessun import)
// ⚠️ Nota: mantieni lo slug "csharp" finché non farai la redirect verso /azure-developer

const CSharpAzureDeveloper = {
  slug: "csharp",
  imageUrl: "/images/certifications/csharp-icon.png",
  officialUrl: "https://learn.microsoft.com/en-us/credentials/certifications/azure-developer/",

  title: {
    it: "Sviluppatore Azure con C#/.NET (AZ-204)",
    en: "Azure Developer with C#/.NET (AZ-204)",
    fr: "Développeur Azure avec C#/.NET (AZ-204)",
    es: "Desarrollador de Azure con C#/.NET (AZ-204)",
  },

  level: {
    it: "Intermedio",
    en: "Intermediate",
    fr: "Intermédiaire",
    es: "Intermedio",
  },

  description: {
    it: "Percorso Microsoft per sviluppatori C#/.NET che creano API, funzioni e app cloud-native su Azure. Copre compute, storage, sicurezza, integrazione e monitoraggio.",
    en: "Microsoft path for C#/.NET developers building APIs, functions, and cloud-native apps on Azure. Covers compute, storage, security, integration, and monitoring.",
    fr: "Parcours Microsoft pour développeurs C#/.NET créant des API, functions et apps cloud-native sur Azure. Couvre calcul, stockage, sécurité, intégration et supervision.",
    es: "Ruta de Microsoft para desarrolladores C#/.NET que crean API, funciones y apps cloud-native en Azure. Cubre cómputo, almacenamiento, seguridad, integración y monitoreo.",
  },

  topics: [
    {
      it: "Sviluppare soluzioni di calcolo su Azure (App Service, Functions, container)",
      en: "Develop Azure compute solutions (App Service, Functions, containers)",
      fr: "Développer des solutions de calcul Azure (App Service, Functions, conteneurs)",
      es: "Desarrollar soluciones de cómputo en Azure (App Service, Functions, contenedores)",
    },
    {
      it: "Sviluppare per l’archiviazione Azure (Blob, Cosmos DB, dati relazionali)",
      en: "Develop for Azure storage (Blob, Cosmos DB, relational data)",
      fr: "Développer pour le stockage Azure (Blob, Cosmos DB, données relationnelles)",
      es: "Desarrollar para el almacenamiento de Azure (Blob, Cosmos DB, datos relacionales)",
    },
    {
      it: "Implementare la sicurezza (Entra ID, Key Vault, managed identities)",
      en: "Implement security (Entra ID, Key Vault, managed identities)",
      fr: "Implémenter la sécurité (Entra ID, Key Vault, identités gérées)",
      es: "Implementar seguridad (Entra ID, Key Vault, identidades administradas)",
    },
    {
      it: "Monitorare, fare troubleshooting e ottimizzare (Logs, Application Insights, scalabilità)",
      en: "Monitor, troubleshoot, and optimize (Logs, Application Insights, scalability)",
      fr: "Surveiller, dépanner et optimiser (journaux, Application Insights, scalabilité)",
      es: "Supervisar, resolver problemas y optimizar (registros, Application Insights, escalabilidad)",
    },
    {
      it: "Integrare servizi e API (SDK/REST, API Management, Event Grid/Service Bus/Event Hubs)",
      en: "Connect to and consume services & APIs (SDK/REST, API Management, Event Grid/Service Bus/Event Hubs)",
      fr: "Connecter et consommer des services & API (SDK/REST, API Management, Event Grid/Service Bus/Event Hubs)",
      es: "Conectar y consumir servicios y API (SDK/REST, API Management, Event Grid/Service Bus/Event Hubs)",
    },
  ],

  extraContent: {
    learn: {
      it: [
        "Progettare e sviluppare applicazioni e API su Azure usando C# e .NET.",
        "Integrare servizi Azure (storage, code/eventi, API Management).",
        "Applicare identità e sicurezza (Entra ID, Key Vault, managed identities).",
        "Monitorare e ottimizzare soluzioni con Application Insights e log.",
      ],
      en: [
        "Design and build apps & APIs on Azure using C# and .NET.",
        "Integrate Azure services (storage, messaging/events, API Management).",
        "Apply identity & security (Entra ID, Key Vault, managed identities).",
        "Monitor and optimize with Application Insights and logs.",
      ],
      fr: [
        "Concevoir et développer des applications & API sur Azure avec C# et .NET.",
        "Intégrer les services Azure (stockage, messagerie/événements, API Management).",
        "Appliquer l’identité et la sécurité (Entra ID, Key Vault, identités gérées).",
        "Surveiller et optimiser avec Application Insights et les journaux.",
      ],
      es: [
        "Diseñar y crear apps y API en Azure con C# y .NET.",
        "Integrar servicios de Azure (almacenamiento, mensajería/eventos, API Management).",
        "Aplicar identidad y seguridad (Entra ID, Key Vault, identidades administradas).",
        "Supervisar y optimizar con Application Insights y registros.",
      ],
    },

    examReference: {
      it: [
        {
          text: "AZ-204: Developing Solutions for Microsoft Azure — Pagina ufficiale d’esame",
          url: "https://learn.microsoft.com/en-us/credentials/certifications/exams/az-204/",
        },
        {
          text: "70-483: Programming in C# — (ESAME RITIRATO) elenco esami ritirati",
          url: "https://learn.microsoft.com/en-us/credentials/support/retired-certification-exams",
        },
      ],
      en: [
        {
          text: "AZ-204: Developing Solutions for Microsoft Azure — Official exam page",
          url: "https://learn.microsoft.com/en-us/credentials/certifications/exams/az-204/",
        },
        {
          text: "70-483: Programming in C# — (RETIRED) retired exams list",
          url: "https://learn.microsoft.com/en-us/credentials/support/retired-certification-exams",
        },
      ],
      fr: [
        {
          text: "AZ-204 : Developing Solutions for Microsoft Azure — Page officielle de l’examen",
          url: "https://learn.microsoft.com/en-us/credentials/certifications/exams/az-204/",
        },
        {
          text: "70-483 : Programming in C# — (RETIRÉ) liste des examens retirés",
          url: "https://learn.microsoft.com/en-us/credentials/support/retired-certification-exams",
        },
      ],
      es: [
        {
          text: "AZ-204: Developing Solutions for Microsoft Azure — Página oficial del examen",
          url: "https://learn.microsoft.com/en-us/credentials/certifications/exams/az-204/",
        },
        {
          text: "70-483: Programming in C# — (RETIRADO) lista de exámenes retirados",
          url: "https://learn.microsoft.com/en-us/credentials/support/retired-certification-exams",
        },
      ],
    },

    whyChoose: {
      it: [
        "Percorso ufficiale Microsoft per sviluppatori C#/.NET su Azure.",
        "Alta richiesta sul mercato per ruoli cloud-native e API/backend.",
        "Vendor ufficiale, con rinnovo semplice e gratuito online.",
      ],
      en: [
        "Microsoft’s official path for C#/.NET developers on Azure.",
        "High market demand for cloud-native and API/backend roles.",
        "First-party credential with easy, free online renewal.",
      ],
      fr: [
        "Parcours officiel Microsoft pour développeurs C#/.NET sur Azure.",
        "Forte demande marché pour les rôles cloud-native et API/backend.",
        "Certif Microsoft avec renouvellement en ligne gratuit.",
      ],
      es: [
        "Ruta oficial de Microsoft para desarrolladores C#/.NET en Azure.",
        "Alta demanda del mercado para roles cloud-native y API/backend.",
        "Acreditación oficial con renovación online gratuita.",
      ],
    },

    faq: {
      it: [
        { q: "Dove posso sostenere l’esame?", a: "Online con proctoring remoto o presso un centro Pearson VUE autorizzato." },
        {
          q: "Quanto dura la certificazione e come si rinnova?",
          a: "Le certificazioni Microsoft role-based (come Azure Developer) sono valide 1 anno. Puoi rinnovarle GRATIS con un assessment online su Microsoft Learn entro i 6 mesi prima della scadenza.",
        },
      ],
      en: [
        { q: "Where can I take the exam?", a: "Online with remote proctoring or at an authorized Pearson VUE test center." },
        {
          q: "How long is the certification valid and how do I renew?",
          a: "Microsoft role-based certifications (like Azure Developer) are valid for 1 year. Renew FREE via an online assessment on Microsoft Learn within the 6-month window before expiration.",
        },
      ],
      fr: [
        { q: "Où passer l’examen ?", a: "En ligne avec surveillance à distance ou dans un centre Pearson VUE agréé." },
        {
          q: "Quelle est la durée de validité et comment renouveler ?",
          a: "Les certifications Microsoft basées sur les rôles (comme Azure Developer) sont valides 1 an. Renouvelez-les GRATUITEMENT via une évaluation en ligne sur Microsoft Learn dans les 6 mois précédant l’expiration.",
        },
      ],
      es: [
        { q: "¿Dónde puedo hacer el examen?", a: "En línea con supervisión remota o en un centro autorizado de Pearson VUE." },
        {
          q: "¿Duración y renovación?",
          a: "Las certificaciones de Microsoft basadas en roles (como Azure Developer) son válidas por 1 año. Renuévalas GRATIS con una evaluación online en Microsoft Learn dentro de los 6 meses previos al vencimiento.",
        },
      ],
    },
  },

  quizRoute: {
    it: "/it/quiz/csharp",
    en: "/en/quiz/csharp",
    fr: "/fr/quiz/csharp",
    es: "/es/quiz/csharp",
  },

  backRoute: {
    it: "/it/certificazioni",
    en: "/en/certifications",
    fr: "/fr/certifications",
    es: "/es/certificaciones",
  },
} as const;

export default CSharpAzureDeveloper;
