// src/certifications/data/java-se.ts
// ✅ Versione data-only per il renderer server (niente JSX/router).

const JavaSE = {
  slug: "java-se",
  imageUrl: "/images/certifications/java-icon.png",
  // Panoramica Oracle Java SE; gli esami specifici sono nelle examReference
  officialUrl: "https://education.oracle.com/java-se",

  title: {
    it: "Java SE",
    en: "Java SE",
    fr: "Java SE",
    es: "Java SE",
  },

  level: {
    it: "Intermedio",
    en: "Intermediate",
    fr: "Intermédiaire",
    es: "Intermedio",
  },

  description: {
    it: "Certificazione per chi desidera diventare sviluppatore Java.",
    en: "Certification for those who want to become Java developers.",
    fr: "Certification pour ceux qui souhaitent devenir développeurs Java.",
    es: "Certificación para quienes deseen convertirse en desarrolladores Java.",
  },

  topics: [
  {
    title: {
      it: "Sintassi di base Java",
      en: "Java basic syntax",
      fr: "Syntaxe de base de Java",
      es: "Sintaxis básica de Java",
    },
    slug: {
      it: "sintassi-di-base-java",
      en: "java-basic-syntax",
      fr: "syntaxe-de-base-de-java",
      es: "sintaxis-basica-de-java",
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
      it: "Progettazione di classi",
      en: "Class design",
      fr: "Conception de classes",
      es: "Diseño de clases",
    },
    slug: {
      it: "progettazione-di-classi",
      en: "class-design",
      fr: "conception-de-classes",
      es: "diseno-de-clases",
    },
  },
  {
    title: {
      it: "Generics e collezioni",
      en: "Generics and collections",
      fr: "Generics et collections",
      es: "Generics y colecciones",
    },
    slug: {
      it: "generics-e-collezioni",
      en: "generics-and-collections",
      fr: "generics-et-collections",
      es: "generics-y-colecciones",
    },
  },
  {
    title: {
      it: "Concorrenza e multithreading",
      en: "Concurrency and multithreading",
      fr: "Concurrence et multithreading",
      es: "Concurrencia y multithreading",
    },
    slug: {
      it: "concorrenza-e-multithreading",
      en: "concurrency-and-multithreading",
      fr: "concurrence-et-multithreading",
      es: "concurrencia-y-multithreading",
    },
  },
  {
    title: {
      it: "JDBC e database",
      en: "JDBC and databases",
      fr: "JDBC et bases de données",
      es: "JDBC y bases de datos",
    },
    slug: {
      it: "jdbc-e-database",
      en: "jdbc-and-databases",
      fr: "jdbc-et-bases-de-donnees",
      es: "jdbc-y-bases-de-datos",
    },
  },
],
  extraContent: {
    // 🔗 SOLO pagine d’esame Oracle ufficiali
    examReference: {
      it: [
        { text: "Oracle Certified Professional: Java SE 21 Developer — Esame 1Z0-830", url: "https://education.oracle.com/java-se-21-developer/pexam_1Z0-830" },
        { text: "Oracle Certified Professional: Java SE 17 Developer — Esame 1Z0-829", url: "https://education.oracle.com/java-se-17-developer/pexam_1Z0-829" },
        { text: "Oracle Certified Professional: Java SE 11 Developer — Esame 1Z0-819", url: "https://education.oracle.com/java-se-11-developer/pexam_1Z0-819" },
      ],
      en: [
        { text: "Oracle Certified Professional: Java SE 21 Developer — Exam 1Z0-830", url: "https://education.oracle.com/java-se-21-developer/pexam_1Z0-830" },
        { text: "Oracle Certified Professional: Java SE 17 Developer — Exam 1Z0-829", url: "https://education.oracle.com/java-se-17-developer/pexam_1Z0-829" },
        { text: "Oracle Certified Professional: Java SE 11 Developer — Exam 1Z0-819", url: "https://education.oracle.com/java-se-11-developer/pexam_1Z0-819" },
      ],
      fr: [
        { text: "Oracle Certified Professional : Java SE 21 Developer — Examen 1Z0-830", url: "https://education.oracle.com/java-se-21-developer/pexam_1Z0-830" },
        { text: "Oracle Certified Professional : Java SE 17 Developer — Examen 1Z0-829", url: "https://education.oracle.com/java-se-17-developer/pexam_1Z0-829" },
        { text: "Oracle Certified Professional : Java SE 11 Developer — Examen 1Z0-819", url: "https://education.oracle.com/java-se-11-developer/pexam_1Z0-819" },
      ],
      es: [
        { text: "Oracle Certified Professional: Java SE 21 Developer — Examen 1Z0-830", url: "https://education.oracle.com/java-se-21-developer/pexam_1Z0-830" },
        { text: "Oracle Certified Professional: Java SE 17 Developer — Examen 1Z0-829", url: "https://education.oracle.com/java-se-17-developer/pexam_1Z0-829" },
        { text: "Oracle Certified Professional: Java SE 11 Developer — Examen 1Z0-819", url: "https://education.oracle.com/java-se-11-developer/pexam_1Z0-819" },
      ],
    },

    learn: {
      it: [
        "Fondamenti del linguaggio Java, sintassi e struttura.",
        "Programmazione a oggetti (classi, ereditarietà, polimorfismo).",
        "Gestione delle eccezioni e uso delle collezioni.",
        "Interfacce grafiche e connettività a database (JDBC).",
      ],
      en: [
        "Java language fundamentals, syntax and structure.",
        "Object-oriented programming (classes, inheritance, polymorphism).",
        "Exception handling and collections usage.",
        "GUI and database connectivity (JDBC).",
      ],
      fr: [
        "Fondamentaux du langage Java, syntaxe et structure.",
        "Programmation orientée objet (classes, héritage, polymorphisme).",
        "Gestion des exceptions et utilisation des collections.",
        "Interfaces graphiques et connexion aux bases (JDBC).",
      ],
      es: [
        "Fundamentos del lenguaje Java, sintaxis y estructura.",
        "Programación orientada a objetos (clases, herencia, polimorfismo).",
        "Manejo de excepciones y uso de colecciones.",
        "Interfaces gráficas y conexión a bases de datos (JDBC).",
      ],
    },

    whyChoose: {
      it: [
        "Certificazione Oracle riconosciuta a livello globale.",
        "Java è tra i linguaggi più richiesti nello sviluppo enterprise.",
        "Ottima base per backend, desktop e Android.",
        "Competenze fondamentali in OOP e ingegneria del software.",
      ],
      en: [
        "Globally recognized Oracle certification.",
        "Java is highly demanded in enterprise development.",
        "Great foundation for backend, desktop, and Android.",
        "Core skills in OOP and software engineering.",
      ],
      fr: [
        "Certification Oracle reconnue mondialement.",
        "Java est très demandé dans l’entreprise.",
        "Excellente base pour backend, desktop et Android.",
        "Compétences clés en POO et ingénierie logicielle.",
      ],
      es: [
        "Certificación Oracle reconocida mundialmente.",
        "Java es muy demandado en entornos empresariales.",
        "Base excelente para backend, escritorio y Android.",
        "Habilidades clave en POO e ingeniería de software.",
      ],
    },

    faq: {
      it: [
        { q: "Java SE è adatto per iniziare?", a: "Sì, è pensata per chi inizia con la programmazione a oggetti." },
        { q: "Serve conoscere altri linguaggi prima?", a: "No, ma avere basi di logica di programmazione può aiutare." },
      ],
      en: [
        { q: "Is Java SE good for beginners?", a: "Yes, it's designed for those starting with object-oriented programming." },
        { q: "Do I need to know other languages first?", a: "No, but basic programming logic is helpful." },
      ],
      fr: [
        { q: "Java SE convient-il aux débutants ?", a: "Oui, pour ceux qui débutent en POO." },
        { q: "Faut-il connaître d'autres langages avant ?", a: "Non, mais des notions de logique de programmation aident." },
      ],
      es: [
        { q: "¿Java SE es adecuado para principiantes?", a: "Sí, para quienes empiezan con POO." },
        { q: "¿Necesito saber otros lenguajes antes?", a: "No, pero ayuda tener bases de lógica de programación." },
      ],
    },
  },

  // Rotte quiz localizzate
  quizRoute: {
    it: "/it/quiz/java",
    en: "/en/quiz/java",
    fr: "/fr/quiz/java",
    es: "/es/quiz/java",
  },

  // Rotta “indietro”: lista certificazioni per lingua
  backRoute: {
    it: "/it/certificazioni",
    en: "/certifications",
    fr: "/fr/certifications",
    es: "/es/certificaciones",
  },
} as const;

export default JavaSE;
