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
    { it: "Sintassi e OOP", en: "Syntax and OOP", fr: "Syntaxe et POO", es: "Sintaxis y POO" },
    { it: "Gestione eccezioni", en: "Exception handling", fr: "Gestion des exceptions", es: "Manejo de excepciones" },
    { it: "Collezioni e JDBC", en: "Collections and JDBC", fr: "Collections et JDBC", es: "Colecciones y JDBC" },
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
    en: "/en/certifications",
    fr: "/fr/certifications",
    es: "/es/certificaciones",
  },
} as const;

export default JavaSE;
