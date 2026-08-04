// src/certifications/data/csharp.ts
// ✅ Versione semplice coerente con gli altri file (solo `as const`, nessun import)
// ⚠️ Nota: mantieni lo slug "csharp" finché non farai la redirect verso /azure-developer

const CSharpAzureDeveloper = {
  slug: "csharp",
  imageUrl: "/images/certifications/csharp-icon.png",
  officialUrl: "https://learn.microsoft.com/en-us/credentials/certifications/azure-developer/",

  // Verificato il 2026-08-04. Microsoft ha ritirato l'esame AZ-204 il
  // 2026-07-31 senza annunciare un esame sostitutivo. Niente examBlueprint
  // (non esiste un esame corrente da documentare): la pagina è riposizionata
  // come ripasso delle competenze C#/.NET su Azure basato sul programma
  // dell'esame ritirato, non come preparazione a un esame prenotabile.

  title: {
    it: "Sviluppatore Azure con C#/.NET (AZ-204 – esame ritirato)",
    en: "Azure Developer with C#/.NET (AZ-204 – retired exam)",
    fr: "Développeur Azure avec C#/.NET (AZ-204 – examen retiré)",
    es: "Desarrollador de Azure con C#/.NET (AZ-204 – examen retirado)",
  },

  level: {
    it: "Intermedio",
    en: "Intermediate",
    fr: "Intermédiaire",
    es: "Intermedio",
  },

  description: {
    it: "Quiz per sviluppatori C#/.NET su Azure basati sul programma dell'esame Microsoft AZ-204, ritirato il 31/07/2026 senza un sostituto annunciato. Utile per ripassare compute, storage, sicurezza, integrazione e monitoraggio su Azure, anche se l'esame non è più prenotabile.",
    en: "C#/.NET Azure developer quizzes based on the Microsoft AZ-204 exam objectives, retired on 2026-07-31 with no successor announced. Useful to review Azure compute, storage, security, integration, and monitoring skills, even though the exam can no longer be booked.",
    fr: "Quiz pour développeurs C#/.NET sur Azure basés sur le programme de l'examen Microsoft AZ-204, retiré le 31/07/2026 sans successeur annoncé. Utile pour réviser le calcul, le stockage, la sécurité, l'intégration et la supervision sur Azure, même si l'examen n'est plus réservable.",
    es: "Quizzes para desarrolladores C#/.NET en Azure basados en el programa del examen Microsoft AZ-204, retirado el 31/07/2026 sin sucesor anunciado. Útil para repasar cómputo, almacenamiento, seguridad, integración y monitoreo en Azure, aunque el examen ya no se puede reservar.",
  },

  metaTitle: {
    en: "C# / AZ-204 Practice Questions – Azure Developer Skills | CertifyQuiz",
    it: "C# / AZ-204 Quiz – Competenze Azure Developer | CertifyQuiz",
    fr: "C# / AZ-204 Quiz – Compétences Azure Developer | CertifyQuiz",
    es: "C# / AZ-204 Quiz – Competencias Azure Developer | CertifyQuiz",
  },
  metaDescription: {
    en: "Practice C#/.NET Azure developer skills based on the retired AZ-204 exam objectives. Covers compute, storage, security, APIs and monitoring. Start free.",
    it: "Allenati sulle competenze C#/.NET Azure Developer basate sul programma dell'esame AZ-204 (ritirato). Copre compute, storage, sicurezza, API e monitoraggio. Inizia gratis.",
    fr: "Entraînez-vous sur les compétences C#/.NET Azure Developer basées sur le programme de l'examen AZ-204 (retiré). Couvre calcul, stockage, sécurité, API et supervision. Commencez gratuitement.",
    es: "Practica competencias C#/.NET Azure Developer basadas en el programa del examen AZ-204 (retirado). Cubre cómputo, almacenamiento, seguridad, API y monitoreo. Empieza gratis.",
  },
  topics: [
  {
    title: {
      it: "Sintassi e costrutti C#",
      en: "C# syntax and constructs",
      fr: "Syntaxe et constructions C#",
      es: "Sintaxis y construcciones de C#",
    },
    slug: {
      it: "sintassi-e-costrutti-c",
      en: "c-syntax-and-constructs",
      fr: "syntaxe-et-constructions-c",
      es: "sintaxis-y-construcciones-de-c",
    },
  },
  {
    title: {
      it: "Programmazione orientata agli oggetti",
      en: "Object-oriented programming",
      fr: "Programmation orientée objet",
      es: "Programación orientada a objetos",
    },
    slug: {
      it: "programmazione-orientata-agli-oggetti",
      en: "object-oriented-programming",
      fr: "programmation-orientee-objet",
      es: "programacion-orientada-a-objetos",
    },
  },
  {
    title: {
      it: "Gestione degli errori e debugging",
      en: "Error handling and debugging",
      fr: "Gestion des erreurs et débogage",
      es: "Gestión de errores y depuración",
    },
    slug: {
      it: "gestione-degli-errori-e-debugging",
      en: "error-handling-and-debugging",
      fr: "gestion-des-erreurs-et-debogage",
      es: "gestion-de-errores-y-depuracion",
    },
  },
  {
    title: {
      it: "Dati e collezioni",
      en: "Data and collections",
      fr: "Données et collections",
      es: "Datos y colecciones",
    },
    slug: {
      it: "dati-e-collezioni",
      en: "data-and-collections",
      fr: "donnees-et-collections",
      es: "datos-y-colecciones",
    },
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
          text: "AZ-204: Developing Solutions for Microsoft Azure — (ESAME RITIRATO 31/07/2026)",
          url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-developer/",
        },
        {
          text: "70-483: Programming in C# — (ESAME RITIRATO) elenco esami ritirati",
          url: "https://learn.microsoft.com/en-us/credentials/support/retired-certification-exams",
        },
      ],
      en: [
        {
          text: "AZ-204: Developing Solutions for Microsoft Azure — (RETIRED 2026-07-31)",
          url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-developer/",
        },
        {
          text: "70-483: Programming in C# — (RETIRED) retired exams list",
          url: "https://learn.microsoft.com/en-us/credentials/support/retired-certification-exams",
        },
      ],
      fr: [
        {
          text: "AZ-204 : Developing Solutions for Microsoft Azure — (RETIRÉ le 31/07/2026)",
          url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-developer/",
        },
        {
          text: "70-483 : Programming in C# — (RETIRÉ) liste des examens retirés",
          url: "https://learn.microsoft.com/en-us/credentials/support/retired-certification-exams",
        },
      ],
      es: [
        {
          text: "AZ-204: Developing Solutions for Microsoft Azure — (RETIRADO 31/07/2026)",
          url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-developer/",
        },
        {
          text: "70-483: Programming in C# — (RETIRADO) lista de exámenes retirados",
          url: "https://learn.microsoft.com/en-us/credentials/support/retired-certification-exams",
        },
      ],
    },

    whyChoose: {
      it: [
        "Basato sul percorso Microsoft per sviluppatori C#/.NET su Azure (esame AZ-204, ora ritirato).",
        "Competenze comunque richieste sul mercato per ruoli cloud-native e API/backend.",
        "Utile come ripasso tecnico, anche senza un esame Microsoft attivo da sostenere.",
      ],
      en: [
        "Based on Microsoft's path for C#/.NET developers on Azure (AZ-204 exam, now retired).",
        "Skills still in high market demand for cloud-native and API/backend roles.",
        "Useful as technical review, even with no active Microsoft exam to take.",
      ],
      fr: [
        "Basé sur le parcours Microsoft pour développeurs C#/.NET sur Azure (examen AZ-204, désormais retiré).",
        "Compétences toujours très demandées pour les rôles cloud-native et API/backend.",
        "Utile comme révision technique, même sans examen Microsoft actif à passer.",
      ],
      es: [
        "Basado en la ruta de Microsoft para desarrolladores C#/.NET en Azure (examen AZ-204, ahora retirado).",
        "Competencias con alta demanda de mercado para roles cloud-native y API/backend.",
        "Útil como repaso técnico, aunque no haya un examen Microsoft activo que rendir.",
      ],
    },

    faq: {
      it: [
        {
          q: "Posso ancora sostenere l’esame AZ-204?",
          a: "No. Microsoft ha ritirato l'esame AZ-204 il 31/07/2026 e al momento non ha annunciato un esame sostitutivo per la certificazione Azure Developer Associate. Questi quiz restano utili per ripassare le competenze C#/.NET su Azure, ma non portano più a una nuova certificazione Microsoft.",
        },
        {
          q: "Se ho già la certificazione Azure Developer Associate, cosa cambia?",
          a: "Nulla: resta valida secondo i suoi termini originali. Cambia solo che non è più possibile sostenere un nuovo esame o rinnovarla tramite un assessment AZ-204.",
        },
      ],
      en: [
        {
          q: "Can I still take the AZ-204 exam?",
          a: "No. Microsoft retired the AZ-204 exam on 2026-07-31 and has not announced a replacement exam for the Azure Developer Associate certification. These quizzes remain useful for reviewing C#/.NET skills on Azure, but no longer lead to a new Microsoft certification.",
        },
        {
          q: "If I already hold the Azure Developer Associate certification, what changes?",
          a: "Nothing: it remains valid under its original terms. The only change is that you can no longer take a new exam or renew it via an AZ-204 assessment.",
        },
      ],
      fr: [
        {
          q: "Puis-je encore passer l’examen AZ-204 ?",
          a: "Non. Microsoft a retiré l'examen AZ-204 le 31/07/2026 et n'a annoncé aucun examen de remplacement pour la certification Azure Developer Associate. Ces quiz restent utiles pour réviser les compétences C#/.NET sur Azure, mais ne mènent plus à une nouvelle certification Microsoft.",
        },
        {
          q: "Si j’ai déjà la certification Azure Developer Associate, qu’est-ce qui change ?",
          a: "Rien : elle reste valide selon ses conditions d'origine. Seul changement : il n'est plus possible de passer un nouvel examen ni de la renouveler via une évaluation AZ-204.",
        },
      ],
      es: [
        {
          q: "¿Todavía puedo presentar el examen AZ-204?",
          a: "No. Microsoft retiró el examen AZ-204 el 31/07/2026 y no ha anunciado un examen sustituto para la certificación Azure Developer Associate. Estos quizzes siguen siendo útiles para repasar las competencias C#/.NET en Azure, pero ya no conducen a una nueva certificación Microsoft.",
        },
        {
          q: "Si ya tengo la certificación Azure Developer Associate, ¿qué cambia?",
          a: "Nada: sigue siendo válida según sus términos originales. Solo cambia que ya no se puede presentar un nuevo examen ni renovarla mediante una evaluación AZ-204.",
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
    en: "/certifications",
    fr: "/fr/certifications",
    es: "/es/certificaciones",
  },
} as const;

export default CSharpAzureDeveloper;
