// src/certifications/data/javascript-developer.ts
// ✅ Versione data-only (consumabile dal renderer server). Nessun JSX/router.
// 🖼️ Immagine attesa: /public/images/certifications/javascript-icon.png

const JavaScriptDeveloper = {
  slug: "javascript-developer",
  imageUrl: "/images/certifications/javascript-icon.png",
  // Pagina "ufficiale" più neutra per un esame JS entry-level: usiamo W3Schools exam page come riferimento semplice.
  officialUrl: "https://www.w3schools.com/js/js_exam.asp",

  title: {
    it: "JavaScript Developer",
    en: "JavaScript Developer",
    fr: "Développeur JavaScript",
    es: "Desarrollador JavaScript",
  },

  level: {
    it: "Principiante",
    en: "Beginner",
    fr: "Débutant",
    es: "Principiante",
  },

  description: {
    it: "Certificazione per chi desidera diventare sviluppatore front-end con JavaScript.",
    en: "Certification for those who want to become front-end developers with JavaScript.",
    fr: "Certification pour ceux qui souhaitent devenir développeurs front-end avec JavaScript.",
    es: "Certificación para quienes deseen convertirse en desarrolladores front-end con JavaScript.",
  },

  topics: [
  {
    title: {
      it: "Variabili e tipi",
      en: "Variables and Types in JavaScript",
      fr: "Variables et types en JavaScript",
      es: "Variables y tipos en JavaScript",
    },
    slug: {
      it: "variabili-e-tipi",
      en: "variables-and-types-in-javascript",
      fr: "variables-et-types-en-javascript",
      es: "variables-y-tipos-en-javascript",
    },
  },
  {
    title: {
      it: "Oggetti e funzioni",
      en: "Objects and Functions in JavaScript",
      fr: "Objets et fonctions en JavaScript",
      es: "Objetos y funciones en JavaScript",
    },
    slug: {
      it: "oggetti-e-funzioni",
      en: "objects-and-functions-in-javascript",
      fr: "objets-et-fonctions-en-javascript",
      es: "objetos-y-funciones-en-javascript",
    },
  },
  {
    title: {
      it: "Browser ed eventi",
      en: "Browser and Events",
      fr: "Navigateur et événements",
      es: "Navegador y eventos",
    },
    slug: {
      it: "browser-ed-eventi",
      en: "browser-and-events",
      fr: "navigateur-et-evenements",
      es: "navegador-y-eventos",
    },
  },
  {
    title: {
      it: "Debugging ed errori",
      en: "Debugging and Error Handling",
      fr: "Débogage et gestion des erreurs",
      es: "Depuración y manejo de errores",
    },
    slug: {
      it: "debugging-ed-errori",
      en: "debugging-and-error-handling",
      fr: "debogage-et-gestion-des-erreurs",
      es: "depuracion-y-manejo-de-errores",
    },
  },
  {
    title: {
      it: "Programmazione asincrona",
      en: "Asynchronous Programming in JavaScript",
      fr: "Programmation asynchrone en JavaScript",
      es: "Programación asíncrona en JavaScript",
    },
    slug: {
      it: "programmazione-asincrona",
      en: "asynchronous-programming-in-javascript",
      fr: "programmation-asynchrone-en-javascript",
      es: "programacion-asincrona-en-javascript",
    },
  },
  {
    title: {
      it: "Testing e deployment",
      en: "Testing and Deployment in JavaScript",
      fr: "Tests et déploiement en JavaScript",
      es: "Pruebas y despliegue en JavaScript",
    },
    slug: {
      it: "testing-e-deployment",
      en: "testing-and-deployment-in-javascript",
      fr: "tests-et-deploiement-en-javascript",
      es: "pruebas-y-despliegue-en-javascript",
    },
  },
],

  extraContent: {
    examReference: {
      it: [
        { text: "OpenEDG JS Institute – JSE™ Certified Entry-Level JavaScript Programmer", url: "https://js.institute/certification-tracks" },
        { text: "OpenEDG JS Institute – JSA™ Certified Associate JavaScript Programmer", url: "https://js.institute/certification-tracks" },
        { text: "CIW JavaScript Specialist (Esame 1D0-735) – Obiettivi d’esame (PDF)", url: "https://ciwcertified.com/wp-content/uploads/2023/12/1D0-735.pdf" },
        { text: "W3Schools – JavaScript Certificate (pagina esame)", url: "https://www.w3schools.com/js/js_exam.asp" },
      ],
      en: [
        { text: "OpenEDG JS Institute – JSE™ Certified Entry-Level JavaScript Programmer", url: "https://js.institute/certification-tracks" },
        { text: "OpenEDG JS Institute – JSA™ Certified Associate JavaScript Programmer", url: "https://js.institute/certification-tracks" },
        { text: "CIW JavaScript Specialist (Exam 1D0-735) – Exam Objectives (PDF)", url: "https://ciwcertified.com/wp-content/uploads/2023/12/1D0-735.pdf" },
        { text: "W3Schools – JavaScript Certificate (exam page)", url: "https://www.w3schools.com/js/js_exam.asp" },
      ],
      fr: [
        { text: "OpenEDG JS Institute – JSE™ Programmeur JavaScript certifié (niveau débutant)", url: "https://js.institute/certification-tracks" },
        { text: "OpenEDG JS Institute – JSA™ Programmeur JavaScript certifié (niveau associé)", url: "https://js.institute/certification-tracks" },
        { text: "CIW JavaScript Specialist (Examen 1D0-735) – Objectifs d’examen (PDF)", url: "https://ciwcertified.com/wp-content/uploads/2023/12/1D0-735.pdf" },
        { text: "W3Schools – JavaScript Certificate (page d’examen)", url: "https://www.w3schools.com/js/js_exam.asp" },
      ],
      es: [
        { text: "OpenEDG JS Institute – JSE™ Programador JavaScript certificado (nivel inicial)", url: "https://js.institute/certification-tracks" },
        { text: "OpenEDG JS Institute – JSA™ Programador JavaScript certificado (nivel asociado)", url: "https://js.institute/certification-tracks" },
        { text: "CIW JavaScript Specialist (Examen 1D0-735) – Objetivos del examen (PDF)", url: "https://ciwcertified.com/wp-content/uploads/2023/12/1D0-735.pdf" },
        { text: "W3Schools – JavaScript Certificate (página del examen)", url: "https://www.w3schools.com/js/js_exam.asp" },
      ],
    },

    learn: {
      it: [
        "Sintassi di base, variabili e operatori in JavaScript.",
        "Manipolazione del DOM ed eventi per creare pagine interattive.",
        "Funzioni, oggetti e array per gestire dati complessi.",
        "Comunicazione con API tramite AJAX.",
      ],
      en: [
        "Basic syntax, variables, and operators in JavaScript.",
        "DOM manipulation and events to build interactive pages.",
        "Functions, objects, and arrays to manage complex data.",
        "API communication using AJAX.",
      ],
      fr: [
        "Syntaxe de base, variables et opérateurs en JavaScript.",
        "Manipulation du DOM et événements pour créer des pages interactives.",
        "Fonctions, objets et tableaux pour gérer des données complexes.",
        "Communication avec les API via AJAX.",
      ],
      es: [
        "Sintaxis básica, variables y operadores en JavaScript.",
        "Manipulación del DOM y eventos para crear páginas interactivas.",
        "Funciones, objetos y arreglos para manejar datos complejos.",
        "Comunicación con APIs usando AJAX.",
      ],
    },

    whyChoose: {
      it: [
        "Linguaggio fondamentale per lo sviluppo web front-end.",
        "Ampiamente richiesto nel mercato del lavoro tech.",
        "Supportato da tutti i browser e piattaforme moderne.",
        "Base solida per passare a framework come React o Vue.",
      ],
      en: [
        "Fundamental language for front-end web development.",
        "Highly demanded in the tech job market.",
        "Supported by all modern browsers and platforms.",
        "Solid foundation for frameworks like React or Vue.",
      ],
      fr: [
        "Langage fondamental pour le développement web front-end.",
        "Très demandé sur le marché de l'emploi tech.",
        "Pris en charge par tous les navigateurs modernes.",
        "Base solide pour passer à des frameworks comme React ou Vue.",
      ],
      es: [
        "Lenguaje fundamental para el desarrollo web front-end.",
        "Muy demandado en el mercado laboral tecnológico.",
        "Compatible con todos los navegadores modernos.",
        "Base sólida para pasar a frameworks como React o Vue.",
      ],
    },

    faq: {
      it: [
        { q: "JavaScript è difficile da imparare?", a: "No, è uno dei linguaggi più accessibili e diffusi, perfetto per iniziare." },
        { q: "Serve conoscere HTML e CSS prima?", a: "Non è obbligatorio, ma avere basi di HTML/CSS aiuta molto." },
      ],
      en: [
        { q: "Is JavaScript hard to learn?", a: "No, it's one of the most accessible and widely used languages — great for beginners." },
        { q: "Do I need to know HTML and CSS first?", a: "It's not required, but having some basics in HTML/CSS is very helpful." },
      ],
      fr: [
        { q: "Le JavaScript est-il difficile à apprendre ?", a: "Non, c'est l'un des langages les plus accessibles et populaires — idéal pour commencer." },
        { q: "Faut-il connaître HTML et CSS avant ?", a: "Ce n'est pas obligatoire, mais avoir des bases aide beaucoup." },
      ],
      es: [
        { q: "¿Es difícil aprender JavaScript?", a: "No, es uno de los lenguajes más accesibles y populares, ideal para principiantes." },
        { q: "¿Necesito saber HTML y CSS antes?", a: "No es obligatorio, pero tener una base en HTML y CSS ayuda bastante." },
      ],
    },
  },

  // Rotte quiz localizzate (coerenti con gli altri data/*.ts)
  quizRoute: {
    it: "/it/quiz/javascript",
    en: "/en/quiz/javascript",
    fr: "/fr/quiz/javascript",
    es: "/es/quiz/javascript",
  },

  // Rotta “indietro”: lista certificazioni per lingua
  backRoute: {
    it: "/it/certificazioni",
    en: "/certifications",
    fr: "/fr/certifications",
    es: "/es/certificaciones",
  },
} as const;

export default JavaScriptDeveloper;
