// src/certifications/data/mysql-certification.ts
// Modulo dati per "MySQL Certification" (no React/JSX).

const MySQLCertification = {
  slug: "mysql",
  imageUrl: "/images/certifications/mysql.png",

  // Pagina ufficiale generale (documentazione MySQL)
  officialUrl: "https://dev.mysql.com/doc/",

  title: {
    it: "MySQL - Database Relazionale Open Source",
    en: "MySQL - Open Source Relational Database",
    fr: "MySQL - Base de données relationnelle open source",
    es: "MySQL - Base de datos relacional de código abierto",
  },

  level: {
    it: "Intermedio",
    en: "Intermediate",
    fr: "Intermédiaire",
    es: "Intermedio",
  },

  description: {
    it: "Impara a gestire database MySQL, scrivere query e strutturare dati per applicazioni reali.",
    en: "Learn to manage MySQL databases, write queries and structure data for real applications.",
    fr: "Apprenez à gérer des bases de données MySQL, à écrire des requêtes et à structurer les données.",
    es: "Aprende a gestionar bases de datos MySQL, escribir consultas y estructurar datos.",
  },

  topics: [
    { it: "Concetti base di database", en: "Basic Database Concepts", fr: "Concepts de base des bases de données", es: "Conceptos básicos de bases de datos" },
    { it: "Scrittura di query SQL", en: "Writing SQL Queries", fr: "Écriture de requêtes SQL", es: "Escritura de consultas SQL" },
    { it: "Ottimizzazione delle prestazioni", en: "Performance Optimization", fr: "Optimisation des performances", es: "Optimización del rendimiento" },
    { it: "Stored procedure e trigger", en: "Stored Procedures and Triggers", fr: "Procédures stockées et déclencheurs", es: "Procedimientos almacenados y desencadenadores" },
    { it: "Gestione utenti e permessi", en: "User and Permission Management", fr: "Gestion des utilisateurs et des permissions", es: "Gestión de usuarios y permisos" },
  ],

  extraContent: {
    // ✅ SOLO esami ufficiali (Oracle)
    examReference: {
      it: [
        { text: "1Z0-909 • MySQL 8.0 Database Developer — Esame ufficiale", url: "https://education.oracle.com/mysql-8-0-database-developer/pexam_1Z0-909" },
        { text: "1Z0-908 • MySQL 8.0 Database Administrator — Esame ufficiale", url: "https://education.oracle.com/mysql-8-0-database-administrator/pexam_1Z0-908" },
      ],
      en: [
        { text: "1Z0-909 • MySQL 8.0 Database Developer — Official exam", url: "https://education.oracle.com/mysql-8-0-database-developer/pexam_1Z0-909" },
        { text: "1Z0-908 • MySQL 8.0 Database Administrator — Official exam", url: "https://education.oracle.com/mysql-8-0-database-administrator/pexam_1Z0-908" },
      ],
      fr: [
        { text: "1Z0-909 • MySQL 8.0 Database Developer — Examen officiel", url: "https://education.oracle.com/mysql-8-0-database-developer/pexam_1Z0-909" },
        { text: "1Z0-908 • MySQL 8.0 Database Administrator — Examen officiel", url: "https://education.oracle.com/mysql-8-0-database-administrator/pexam_1Z0-908" },
      ],
      es: [
        { text: "1Z0-909 • MySQL 8.0 Database Developer — Examen oficial", url: "https://education.oracle.com/mysql-8-0-database-developer/pexam_1Z0-909" },
        { text: "1Z0-908 • MySQL 8.0 Database Administrator — Examen oficial", url: "https://education.oracle.com/mysql-8-0-database-administrator/pexam_1Z0-908" },
      ],
    },

    learn: {
      it: [
        "Creare e gestire database relazionali.",
        "Scrivere query SQL per interrogare e manipolare i dati.",
        "Ottimizzare le performance delle query.",
        "Gestire utenti e permessi su MySQL.",
        "Utilizzare funzioni, viste, trigger e stored procedure.",
      ],
      en: [
        "Create and manage relational databases.",
        "Write SQL queries to retrieve and manipulate data.",
        "Optimize query performance.",
        "Manage users and permissions in MySQL.",
        "Use functions, views, triggers, and stored procedures.",
      ],
      fr: [
        "Créer et gérer des bases de données relationnelles.",
        "Écrire des requêtes SQL pour interroger et manipuler les données.",
        "Optimiser les performances des requêtes.",
        "Gérer les utilisateurs et les autorisations dans MySQL.",
        "Utiliser des fonctions, des vues, des déclencheurs et des procédures stockées.",
      ],
      es: [
        "Crear y gestionar bases de datos relacionales.",
        "Escribir consultas SQL para consultar y manipular datos.",
        "Optimizar el rendimiento de las consultas.",
        "Gestionar usuarios y permisos en MySQL.",
        "Usar funciones, vistas, desencadenadores y procedimientos almacenados.",
      ],
    },

    whyChoose: {
      it: [
        "MySQL è uno dei database open source più utilizzati al mondo.",
        "Richiesta per ruoli di sviluppatore backend e data analyst.",
        "Fondamentale per chi lavora con applicazioni web e CMS.",
        "Ampia documentazione e comunità di supporto.",
        "Valido per colloqui tecnici e concorsi.",
      ],
      en: [
        "MySQL is one of the most used open-source databases worldwide.",
        "Required for backend developer and data analyst roles.",
        "Essential for working with web apps and CMSs.",
        "Extensive documentation and community support.",
        "Valuable for technical interviews and exams.",
      ],
      fr: [
        "MySQL est l'une des bases de données open source les plus utilisées au monde.",
        "Requise pour les postes de développeur backend et d'analyste de données.",
        "Essentielle pour travailler avec des applications web et des CMS.",
        "Documentation abondante et communauté active.",
        "Valable pour les entretiens techniques et les concours.",
      ],
      es: [
        "MySQL es una de las bases de datos open source más utilizadas del mundo.",
        "Requerida para roles de desarrollador backend y analista de datos.",
        "Esencial para trabajar con apps web y CMS.",
        "Amplia documentación y comunidad activa.",
        "Útil para entrevistas técnicas y oposiciones.",
      ],
    },

    faq: {
      it: [
        { q: "MySQL è difficile da imparare?", a: "No, è considerato uno dei linguaggi più accessibili per iniziare con i database." },
        { q: "Serve un software specifico per usare MySQL?", a: "Puoi utilizzare strumenti come MySQL Workbench oppure terminale e interfacce web." },
        { q: "Qual è la differenza tra MySQL e SQL?", a: "SQL è il linguaggio standard, MySQL è un software che lo implementa." },
      ],
      en: [
        { q: "Is MySQL hard to learn?", a: "No, it's considered one of the most beginner-friendly database tools." },
        { q: "Do I need special software for MySQL?", a: "You can use tools like MySQL Workbench or terminal and web interfaces." },
        { q: "What's the difference between MySQL and SQL?", a: "SQL is the standard language, MySQL is a software that implements it." },
      ],
      fr: [
        { q: "MySQL est-il difficile à apprendre ?", a: "Non, c'est l'un des outils de base de données les plus accessibles." },
        { q: "Faut-il un logiciel spécial pour utiliser MySQL ?", a: "Vous pouvez utiliser MySQL Workbench, un terminal ou des interfaces web." },
        { q: "Quelle est la différence entre MySQL et SQL ?", a: "SQL est le langage standard, MySQL est un logiciel qui l’implémente." },
      ],
      es: [
        { q: "¿Es difícil aprender MySQL?", a: "No, es una de las herramientas de base de datos más accesibles." },
        { q: "¿Necesito un software especial para usar MySQL?", a: "Puedes usar herramientas como MySQL Workbench o interfaces de línea de comandos y web." },
        { q: "¿Cuál es la diferencia entre MySQL y SQL?", a: "SQL es el lenguaje estándar, MySQL es un software que lo implementa." },
      ],
    },
  },

  // Rotte quiz localizzate
  quizRoute: {
    it: "/it/quiz/mysql-certification",
    en: "/en/quiz/mysql-certification",
    fr: "/fr/quiz/mysql-certification",
    es: "/es/quiz/mysql-certification",
  },

  // Rotta “indietro” (lista certificazioni) localizzata
  backRoute: {
    it: "/it/certificazioni",
    en: "/en/certifications",
    fr: "/fr/certifications",
    es: "/es/certificaciones",
  },
} as const;

export default MySQLCertification;
