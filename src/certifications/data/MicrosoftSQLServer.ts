// src/certifications/data/sql-server.ts
// 🔥 SEO-optimized “killer” version – data-only (no React/JSX).

const MicrosoftSQLServer = {
  slug: "microsoft-sql-server",
  imageUrl: "/images/certifications/sqlserver.png",

  // 🔗 Pagina ufficiale prodotto/documentazione
  officialUrl: "https://learn.microsoft.com/sql/",

  // ✅ SEO-first: intent “practice test / questions / quiz”
  // EN ha 760 domande → lo dichiariamo SOLO in EN (pool reale).
  title: {
    it: "Microsoft SQL Server – Quiz e Domande Pratiche",
    en: "SQL Server Practice Test 2026 – 760 Exam-Style Questions",
    fr: "Microsoft SQL Server – Quiz et Questions Pratiques",
    es: "Microsoft SQL Server – Quiz y Preguntas Prácticas",
  },

  level: {
    it: "Intermedio",
    en: "Intermediate",
    fr: "Intermédiaire",
    es: "Intermedio",
  },

  // ✅ description: non più “certificazione dedicata…”, ma pagina di pratica
  description: {
    it: "Esercitati con quiz e domande pratiche su SQL e Microsoft SQL Server: query reali, modellazione dati, stored procedure, performance, backup e sicurezza. Modalità training e quiz misti per prepararti sul serio.",
    en: "Practice SQL and Microsoft SQL Server with 760 exam-style questions (English pool). Train on real queries, database design, stored procedures, performance tuning, backup/restore, and security with focused quizzes and mixed tests.",
    fr: "Entraînez-vous sur SQL et Microsoft SQL Server avec des quiz et des questions pratiques : requêtes, modélisation, procédures stockées, performances, sauvegarde/restauration et sécurité. Banque de questions en croissance.",
    es: "Practica SQL y Microsoft SQL Server con quizzes y preguntas prácticas: consultas, modelado, procedimientos almacenados, rendimiento, backup/restauración y seguridad. Banco de preguntas en crecimiento.",
  },

 topics: [
  {
    title: {
      it: "Fondamenti di database relazionali",
      en: "Fundamentals of Relational Databases",
      fr: "Fondamentaux des bases de données relationnelles",
      es: "Fundamentos de bases de datos relacionales",
    },
    slug: {
      it: "fondamenti-di-database-relazionali",
      en: "fundamentals-of-relational-databases",
      fr: "fondamentaux-des-bases-de-donnees-relationnelles",
      es: "fundamentos-de-bases-de-datos-relacionales",
    },
  },
  {
    title: {
      it: "Linguaggio SQL e T-SQL",
      en: "SQL and T-SQL Language",
      fr: "Langage SQL et T-SQL",
      es: "Lenguaje SQL y T-SQL",
    },
    slug: {
      it: "linguaggio-sql-e-t-sql",
      en: "sql-and-t-sql-language",
      fr: "langage-sql-et-t-sql",
      es: "lenguaje-sql-y-t-sql",
    },
  },
  {
    title: {
      it: "Gestione degli oggetti di database",
      en: "Management of Database Objects",
      fr: "Gestion des objets de base de données",
      es: "Gestión de objetos de base de datos",
    },
    slug: {
      it: "gestione-degli-oggetti-di-database",
      en: "management-of-database-objects",
      fr: "gestion-des-objets-de-base-de-donnees",
      es: "gestion-de-objetos-de-base-de-datos",
    },
  },
  {
    title: {
      it: "Sicurezza e gestione degli accessi",
      en: "Security and Access Management",
      fr: "Sécurité et gestion des accès",
      es: "Seguridad y gestión de accesos",
    },
    slug: {
      it: "sicurezza-e-gestione-degli-accessi",
      en: "security-and-access-management",
      fr: "securite-et-gestion-des-acces",
      es: "seguridad-y-gestion-de-accesos",
    },
  },
  {
    title: {
      it: "Backup e ripristino dei dati",
      en: "Data Backup and Recovery",
      fr: "Sauvegarde et récupération des données",
      es: "Respaldo y recuperación de datos",
    },
    slug: {
      it: "backup-e-ripristino-dei-dati",
      en: "data-backup-and-recovery",
      fr: "sauvegarde-et-recuperation-des-donnees",
      es: "respaldo-y-recuperacion-de-datos",
    },
  },
  {
    title: {
      it: "Ottimizzazione delle prestazioni",
      en: "Performance Optimization",
      fr: "Optimisation des performances",
      es: "Optimización del rendimiento",
    },
    slug: {
      it: "ottimizzazione-delle-prestazioni",
      en: "performance-optimization",
      fr: "optimisation-des-performances",
      es: "optimizacion-del-rendimiento",
    },
  },
],

  extraContent: {
    // ✅ SOLO pagine d’esame ufficiali (percorsi moderni Azure Data)
    examReference: {
      it: [
        { text: "DP-900: Microsoft Azure Data Fundamentals", url: "https://learn.microsoft.com/en-us/credentials/certifications/exams/dp-900/" },
        { text: "DP-300: Administering Microsoft Azure SQL Solutions", url: "https://learn.microsoft.com/en-us/credentials/certifications/exams/dp-300/" },
      ],
      en: [
        { text: "DP-900: Microsoft Azure Data Fundamentals", url: "https://learn.microsoft.com/en-us/credentials/certifications/exams/dp-900/" },
        { text: "DP-300: Administering Microsoft Azure SQL Solutions", url: "https://learn.microsoft.com/en-us/credentials/certifications/exams/dp-300/" },
      ],
      fr: [
        { text: "DP-900 : Notions fondamentales des données Microsoft Azure", url: "https://learn.microsoft.com/en-us/credentials/certifications/exams/dp-900/" },
        { text: "DP-300 : Administration des solutions Microsoft Azure SQL", url: "https://learn.microsoft.com/en-us/credentials/certifications/exams/dp-300/" },
      ],
      es: [
        { text: "DP-900: Fundamentos de datos de Microsoft Azure", url: "https://learn.microsoft.com/en-us/credentials/certifications/exams/dp-900/" },
        { text: "DP-300: Administración de soluciones Microsoft Azure SQL", url: "https://learn.microsoft.com/en-us/credentials/certifications/exams/dp-300/" },
      ],
    },

    // ✅ SEO booster (manteniamo la tua idea, ma più “search intent” + practice)
    currentCertification: {
      it: [
        "Molti cercano “Microsoft SQL Server certification 2021/2023”: oggi Microsoft punta soprattutto su certificazioni role-based nell’area Azure Data.",
        "Se vuoi lavorare con SQL Server e database Microsoft, i due step più rilevanti sono DP-900 (fondamenti dati) e DP-300 (amministrazione di Azure SQL).",
        "Qui ti alleni sulle competenze che contano davvero: SQL pratico, progettazione, performance, backup e sicurezza — utili sia su SQL Server on-prem che nel mondo Azure.",
      ],
      en: [
        "Many users search for “Microsoft SQL Server certification 2021/2023”: today Microsoft’s official path focuses on role-based Azure Data certifications.",
        "If you work with SQL Server and Microsoft databases, the most relevant steps are DP-900 (data fundamentals) and DP-300 (administering Azure SQL).",
        "This page is practice-first: real SQL/SQL Server skills (queries, design, performance, backup, security) that stay valuable across on-prem SQL Server and modern Azure tracks.",
      ],
      fr: [
        "Beaucoup recherchent “Microsoft SQL Server certification 2021/2023” : aujourd’hui, le parcours officiel Microsoft est surtout orienté vers Azure Data (role-based).",
        "Pour travailler avec SQL Server et l’écosystème Microsoft, les étapes clés sont DP-900 (fondamentaux data) et DP-300 (administration d’Azure SQL).",
        "Cette page est centrée sur la pratique : SQL, modélisation, performances, sauvegarde et sécurité — compétences utiles on-prem et dans Azure.",
      ],
      es: [
        "Muchos buscan “Microsoft SQL Server certification 2021/2023”: hoy Microsoft se centra en certificaciones role-based de Azure Data.",
        "Para trabajar con SQL Server y el ecosistema Microsoft, los pasos clave son DP-900 (fundamentos de datos) y DP-300 (administración de Azure SQL).",
        "Esta página es práctica: SQL, modelado, rendimiento, copias de seguridad y seguridad — habilidades válidas tanto on-prem como en Azure.",
      ],
    },

    // ✅ learn: più “practice test” e meno brochure
    learn: {
      it: [
        "Scrivere query SQL solide (JOIN, subquery, aggregazioni) con casi pratici.",
        "Progettare database: tabelle, chiavi, vincoli, normalizzazione e indici.",
        "Creare e usare viste, stored procedure e funzioni in T-SQL.",
        "Capire performance: piani di esecuzione, indici, ottimizzazione query.",
        "Gestire backup/restore e concetti base di sicurezza (ruoli, permessi).",
      ],
      en: [
        "Write real SQL queries (JOINs, subqueries, aggregations) with practical scenarios.",
        "Design databases: tables, keys, constraints, normalization, and indexing.",
        "Build and use views, stored procedures, and functions (T-SQL).",
        "Improve performance: execution plans, indexes, query tuning basics.",
        "Handle backup/restore and core security concepts (roles, permissions).",
      ],
      fr: [
        "Écrire des requêtes SQL (JOIN, sous-requêtes, agrégations) sur des cas pratiques.",
        "Concevoir une base : tables, clés, contraintes, normalisation et index.",
        "Utiliser vues, procédures stockées et fonctions (T-SQL).",
        "Travailler les performances : plans d’exécution, index, optimisation.",
        "Comprendre sauvegarde/restauration et sécurité (rôles, permissions).",
      ],
      es: [
        "Escribir consultas SQL (JOIN, subconsultas, agregaciones) con casos prácticos.",
        "Diseñar BD: tablas, claves, restricciones, normalización e índices.",
        "Usar vistas, procedimientos y funciones (T-SQL).",
        "Mejorar rendimiento: planes de ejecución, índices, optimización.",
        "Entender backup/restauración y seguridad (roles, permisos).",
      ],
    },

    // ✅ whyChoose: posizionamento “practice + lavoro”
    whyChoose: {
      it: [
        "SQL Server è ovunque in aziende e PA: saper fare query bene è una skill monetizzabile.",
        "Approccio pratico: quiz e domande che ti allenano su problemi reali.",
        "Ottimo ponte verso percorsi moderni (Azure Data: DP-900 / DP-300).",
        "Perfetto se vuoi migliorare velocità e precisione su SQL/T-SQL.",
      ],
      en: [
        "SQL Server skills are in-demand across enterprise environments.",
        "Practice-first: quizzes designed around real-world query scenarios.",
        "A strong bridge toward modern Microsoft Azure Data paths (DP-900 / DP-300).",
        "Great for improving speed and accuracy with SQL/T-SQL fundamentals.",
      ],
      fr: [
        "Compétences SQL Server très recherchées en entreprise.",
        "Approche pratique : quiz orientés cas réels et requêtes.",
        "Bon tremplin vers Azure Data (DP-900 / DP-300).",
        "Idéal pour gagner en vitesse et précision en SQL/T-SQL.",
      ],
      es: [
        "Habilidades de SQL Server muy demandadas en empresas.",
        "Enfoque práctico: quizzes con escenarios reales de consultas.",
        "Buen puente hacia Azure Data (DP-900 / DP-300).",
        "Ideal para mejorar rapidez y precisión en SQL/T-SQL.",
      ],
    },

    // ✅ FAQ: intent “practice + cert confusion 2021/2023 + percorso”
    faq: {
      it: [
        { q: "Qual è la certificazione Microsoft SQL “attuale”?", a: "Oggi Microsoft punta su certificazioni Azure Data. Per iniziare: DP-900. Per amministrare Azure SQL: DP-300." },
        { q: "SQL Server certification 2021/2023 esiste ancora?", a: "Molte certificazioni storiche sono state sostituite o reindirizzate. Le competenze SQL/SQL Server restano però fondamentali e trasferibili." },
        { q: "Questa pagina è utile anche se uso SQL Server on-prem?", a: "Sì. Query, modellazione, performance, backup e sicurezza valgono sia on-prem che in ambienti cloud." },
        { q: "SQL Server è gratuito?", a: "Esiste SQL Server Express (gratuito) con funzionalità limitate." },
        { q: "Devo conoscere già SQL?", a: "Aiuta, ma puoi partire dalle basi e migliorare con esercizi e quiz progressivi." },
      ],
      en: [
        { q: "What is the current Microsoft SQL certification path?", a: "Microsoft focuses on Azure Data role-based certifications. Start with DP-900, then DP-300 for Azure SQL administration." },
        { q: "Does “SQL Server certification 2021/2023” still exist?", a: "Many legacy SQL Server certs were replaced or redirected. Core SQL/SQL Server skills are still essential and transferable." },
        { q: "Is this useful for on-prem SQL Server too?", a: "Yes. Queries, modeling, performance, backup/restore, and security apply on-prem and in cloud environments." },
        { q: "Is SQL Server free?", a: "There is a free edition called SQL Server Express with limited features." },
        { q: "Do I need prior SQL knowledge?", a: "It helps, but you can start from fundamentals and improve with consistent practice." },
      ],
      fr: [
        { q: "Quel est le parcours “actuel” de certification SQL chez Microsoft ?", a: "Microsoft privilégie Azure Data. Commencez par DP-900, puis DP-300 pour l’administration d’Azure SQL." },
        { q: "La “SQL Server certification 2021/2023” existe-t-elle encore ?", a: "De nombreuses certifications historiques ont été remplacées. Les compétences SQL/SQL Server restent essentielles et transférables." },
        { q: "Utile aussi pour SQL Server on-prem ?", a: "Oui. Requêtes, modélisation, performances, sauvegarde/restauration et sécurité s’appliquent partout." },
        { q: "SQL Server est-il gratuit ?", a: "Il existe une édition gratuite : SQL Server Express (fonctionnalités limitées)." },
        { q: "Faut-il déjà connaître SQL ?", a: "C’est un plus, mais on peut démarrer des bases et progresser avec la pratique." },
      ],
      es: [
        { q: "¿Cuál es la ruta “actual” de certificación SQL en Microsoft?", a: "Microsoft se centra en Azure Data. Empieza con DP-900 y luego DP-300 para administración de Azure SQL." },
        { q: "¿Sigue existiendo la “SQL Server certification 2021/2023”?", a: "Muchas certificaciones antiguas fueron reemplazadas. Aun así, las habilidades de SQL/SQL Server siguen siendo clave." },
        { q: "¿Sirve también para SQL Server on-prem?", a: "Sí. Consultas, modelado, rendimiento, backup/restauración y seguridad aplican en cualquier entorno." },
        { q: "¿SQL Server es gratuito?", a: "Existe SQL Server Express (gratuito) con funciones limitadas." },
        { q: "¿Necesito saber SQL previamente?", a: "Ayuda, pero puedes empezar desde cero y mejorar con práctica constante." },
      ],
    },
  },

  // Rotte quiz localizzate
  quizRoute: {
    it: "/it/quiz/microsoft-sql-server",
    en: "/en/quiz/microsoft-sql-server",
    fr: "/fr/quiz/microsoft-sql-server",
    es: "/es/quiz/microsoft-sql-server",
  },

  // Rotta “indietro” localizzata
  backRoute: {
    it: "/it/certificazioni",
    en: "/certifications",
    fr: "/fr/certifications",
    es: "/es/certificaciones",
  },
} as const;

export default MicrosoftSQLServer;
