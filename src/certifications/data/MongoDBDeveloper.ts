// src/certifications/data/mongodb-developer.ts
// Modulo dati puro per "MongoDB Developer Associate" (no React/JSX).

const MongoDBDeveloper = {
  slug: "mongodb-developer",
  imageUrl: "/images/certifications/mongodb.png",

  // Pagina ufficiale dell’esame (solo link ufficiale)
  officialUrl: "https://www.mongodb.com/certification/developer",

  title: {
    it: "MongoDB Developer Associate",
    en: "MongoDB Developer Associate",
    fr: "MongoDB Developer Associate",
    es: "MongoDB Developer Associate",
  },

  level: {
    it: "Intermedio",
    en: "Intermediate",
    fr: "Intermédiaire",
    es: "Intermedio",
  },

  description: {
    it: "La certificazione MongoDB Developer attesta le competenze per lavorare con database NoSQL moderni e applicazioni orientate ai documenti.",
    en: "The MongoDB Developer certification validates skills to work with modern NoSQL databases and document-based applications.",
    fr: "La certification MongoDB Developer valide les compétences pour travailler avec des bases NoSQL modernes et des applications orientées documents.",
    es: "La certificación MongoDB Developer valida competencias para trabajar con bases de datos NoSQL modernas y aplicaciones orientadas a documentos.",
  },

  topics: [
    { it: "Comandi MongoDB e CRUD", en: "MongoDB Commands and CRUD", fr: "Commandes MongoDB et CRUD", es: "Comandos MongoDB y CRUD" },
    { it: "Modellazione dei documenti", en: "Document Modeling", fr: "Modélisation de documents", es: "Modelado de documentos" },
    { it: "Query e aggregazioni avanzate", en: "Advanced Queries and Aggregations", fr: "Requêtes et agrégations avancées", es: "Consultas y agregaciones avanzadas" },
    { it: "Replica set e sharding", en: "Replica Sets and Sharding", fr: "Replica sets et sharding", es: "Replica sets y sharding" },
    { it: "Sicurezza e backup", en: "Security and Backup", fr: "Sécurité et sauvegarde", es: "Seguridad y respaldo" },
  ],

  extraContent: {
    // ✅ SOLO pagine d’esame ufficiali
    examReference: {
      it: [{ text: "MongoDB Certified Developer Associate — Esame ufficiale", url: "https://www.mongodb.com/certification/developer" }],
      en: [{ text: "MongoDB Certified Developer Associate — Official exam", url: "https://www.mongodb.com/certification/developer" }],
      fr: [{ text: "MongoDB Certified Developer Associate — Examen officiel", url: "https://www.mongodb.com/certification/developer" }],
      es: [{ text: "MongoDB Certified Developer Associate — Examen oficial", url: "https://www.mongodb.com/certification/developer" }],
    },

    learn: {
      it: [
        "Utilizzare i comandi base e avanzati di MongoDB.",
        "Progettare e normalizzare strutture di documenti NoSQL.",
        "Gestire query, aggregazioni e indici.",
        "Configurare replica set e sharding.",
        "Integrare MongoDB in applicazioni reali.",
      ],
      en: [
        "Use basic and advanced MongoDB commands.",
        "Design and normalize NoSQL document structures.",
        "Handle queries, aggregations, and indexes.",
        "Configure replica sets and sharding.",
        "Integrate MongoDB into real-world applications.",
      ],
      fr: [
        "Utiliser les commandes de base et avancées de MongoDB.",
        "Concevoir et normaliser des structures de documents NoSQL.",
        "Gérer les requêtes, les agrégations et les index.",
        "Configurer les ensembles de réplicas et le sharding.",
        "Intégrer MongoDB dans des applications réelles.",
      ],
      es: [
        "Usar comandos básicos y avanzados de MongoDB.",
        "Diseñar y normalizar estructuras de documentos NoSQL.",
        "Gestionar consultas, agregaciones e índices.",
        "Configurar conjuntos de réplicas y sharding.",
        "Integrar MongoDB en aplicaciones reales.",
      ],
    },

    whyChoose: {
      it: [
        "MongoDB è il database NoSQL più utilizzato al mondo.",
        "Richiesto in ambito backend, cloud e sviluppo moderno.",
        "Forte richiesta sul mercato del lavoro.",
        "Fondamentale per sviluppatori full-stack e data engineer.",
        "Open source e altamente scalabile.",
      ],
      en: [
        "MongoDB is the most widely used NoSQL database.",
        "In demand in backend, cloud, and modern development.",
        "High demand in the job market.",
        "Essential for full-stack developers and data engineers.",
        "Open source and highly scalable.",
      ],
      fr: [
        "MongoDB est la base de données NoSQL la plus utilisée au monde.",
        "Recherchée dans le développement backend et cloud.",
        "Forte demande sur le marché du travail.",
        "Essentielle pour les développeurs full-stack et data engineers.",
        "Open source et hautement évolutive.",
      ],
      es: [
        "MongoDB es la base de datos NoSQL más utilizada en el mundo.",
        "Muy solicitada en desarrollo backend y cloud.",
        "Alta demanda en el mercado laboral.",
        "Esencial para desarrolladores full-stack e ingenieros de datos.",
        "Open source y altamente escalable.",
      ],
    },

    faq: {
      it: [
        { q: "Devo conoscere già altri database?", a: "No, ma una base di logica relazionale può aiutare." },
        { q: "Serve saper programmare?", a: "Sì, è consigliato conoscere almeno JavaScript o Python." },
        { q: "L'esame MongoDB è ufficiale?", a: "Sì, esiste un esame ufficiale MongoDB Associate disponibile online." },
      ],
      en: [
        { q: "Do I need prior knowledge of other databases?", a: "No, but relational logic basics can help." },
        { q: "Do I need to know how to code?", a: "Yes, at least some JavaScript or Python is recommended." },
        { q: "Is the MongoDB exam official?", a: "Yes, there's an official MongoDB Associate exam available online." },
      ],
      fr: [
        { q: "Dois-je connaître d'autres bases de données ?", a: "Non, mais une base en logique relationnelle est utile." },
        { q: "Dois-je savoir programmer ?", a: "Oui, il est recommandé de connaître JavaScript ou Python." },
        { q: "L'examen MongoDB est-il officiel ?", a: "Oui, il existe un examen MongoDB Associate officiel en ligne." },
      ],
      es: [
        { q: "¿Necesito conocer otras bases de datos?", a: "No, pero tener nociones básicas de lógica relacional ayuda." },
        { q: "¿Debo saber programar?", a: "Sí, se recomienda conocer al menos JavaScript o Python." },
        { q: "¿El examen de MongoDB es oficial?", a: "Sí, hay un examen oficial MongoDB Associate disponible online." },
      ],
    },
  },

  // Rotte quiz localizzate
  quizRoute: {
    it: "/it/quiz/mongodb-developer",
    en: "/en/quiz/mongodb-developer",
    fr: "/fr/quiz/mongodb-developer",
    es: "/es/quiz/mongodb-developer",
  },

  // Rotta “indietro” (lista certificazioni) localizzata
  backRoute: {
    it: "/it/certificazioni",
    en: "/en/certifications",
    fr: "/fr/certifications",
    es: "/es/certificaciones",
  },
} as const;

export default MongoDBDeveloper;
