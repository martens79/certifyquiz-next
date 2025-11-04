// src/certifications/data/google-tensorflow-developer.ts
// ✅ Versione data-only (nessun JSX/router).
// 🖼️ Metti l'immagine in /public/images/certifications/tensorflow-icon.png

const GoogleTensorFlowDeveloper = {
  slug: "google-tensorflow-developer",
  imageUrl: "/images/certifications/tensorflow-icon.png",
  officialUrl: "https://www.tensorflow.org/certificate",

  title: {
    it: "Google TensorFlow Developer",
    en: "Google TensorFlow Developer",
    fr: "Développeur Google TensorFlow",
    es: "Desarrollador Google TensorFlow",
  },

  level: {
    it: "Avanzato",
    en: "Advanced",
    fr: "Avancé",
    es: "Avanzado",
  },

  description: {
    it: "Certificazione per lo sviluppo di modelli di machine learning con TensorFlow.",
    en: "Certification for developing machine learning models using TensorFlow.",
    fr: "Certification pour le développement de modèles de machine learning avec TensorFlow.",
    es: "Certificación para desarrollar modelos de machine learning con TensorFlow.",
  },

  topics: [
    { it: "Fondamenti di machine learning", en: "Machine learning fundamentals", fr: "Fondamentaux du machine learning", es: "Fundamentos del aprendizaje automático" },
    { it: "TensorFlow e Keras", en: "TensorFlow and Keras", fr: "TensorFlow et Keras", es: "TensorFlow y Keras" },
    { it: "Costruzione e addestramento modelli", en: "Model building and training", fr: "Construction et entraînement des modèles", es: "Construcción y entrenamiento de modelos" },
    { it: "Validazione e valutazione", en: "Validation and evaluation", fr: "Validation et évaluation", es: "Validación y evaluación" },
    { it: "Deployment in produzione", en: "Production deployment", fr: "Déploiement en production", es: "Despliegue en producción" },
  ],

  extraContent: {
    // 🔗 Solo pagina ufficiale
    examReference: {
      it: [
        { text: "TensorFlow Developer Certificate — Pagina ufficiale d’esame", url: "https://www.tensorflow.org/certificate" },
      ],
      en: [
        { text: "TensorFlow Developer Certificate — Official exam page", url: "https://www.tensorflow.org/certificate" },
      ],
      fr: [
        { text: "TensorFlow Developer Certificate — Page officielle de l’examen", url: "https://www.tensorflow.org/certificate" },
      ],
      es: [
        { text: "TensorFlow Developer Certificate — Página oficial del examen", url: "https://www.tensorflow.org/certificate" },
      ],
    },

    learn: {
      it: [
        "Svilupperai competenze fondamentali nel machine learning e deep learning.",
        "Userai TensorFlow e Keras per costruire, addestrare e distribuire modelli.",
        "Imparerai ad applicare modelli in ambienti reali.",
      ],
      en: [
        "Build foundational skills in machine learning and deep learning.",
        "Use TensorFlow and Keras to build, train, and deploy models.",
        "Learn to apply models in real-world environments.",
      ],
      fr: [
        "Développez des compétences fondamentales en machine learning et deep learning.",
        "Utilisez TensorFlow et Keras pour créer, entraîner et déployer des modèles.",
        "Apprenez à appliquer les modèles dans des environnements réels.",
      ],
      es: [
        "Desarrolla habilidades fundamentales en machine learning y deep learning.",
        "Usa TensorFlow y Keras para construir, entrenar y desplegar modelos.",
        "Aprende a aplicar modelos en entornos reales.",
      ],
    },

    whyChoose: {
      it: [
        "È una certificazione riconosciuta da Google.",
        "Perfetta per sviluppatori, data scientist e professionisti dell'AI.",
        "Aumenta le opportunità di lavoro nel campo dell’intelligenza artificiale.",
      ],
      en: [
        "A certification recognized by Google.",
        "Ideal for developers, data scientists, and AI professionals.",
        "Enhances job opportunities in the field of artificial intelligence.",
      ],
      fr: [
        "Une certification reconnue par Google.",
        "Parfaite pour les développeurs, data scientists et professionnels de l’IA.",
        "Améliore les opportunités d'emploi dans le domaine de l'intelligence artificielle.",
      ],
      es: [
        "Una certificación reconocida por Google.",
        "Ideal para desarrolladores, científicos de datos y profesionales de IA.",
        "Mejora las oportunidades laborales en el campo de la inteligencia artificial.",
      ],
    },

    faq: {
      it: [
        { q: "È una certificazione ufficiale Google?", a: "Sì, è offerta e riconosciuta ufficialmente da Google." },
        { q: "Serve esperienza pregressa con TensorFlow?", a: "È consigliata una conoscenza base di Python e machine learning." },
      ],
      en: [
        { q: "Is this an official Google certification?", a: "Yes, it is officially offered and recognized by Google." },
        { q: "Do I need prior experience with TensorFlow?", a: "Basic knowledge of Python and machine learning is recommended." },
      ],
      fr: [
        { q: "S'agit-il d'une certification officielle de Google ?", a: "Oui, elle est officiellement proposée et reconnue par Google." },
        { q: "Faut-il une expérience préalable avec TensorFlow ?", a: "Une connaissance de base de Python et du machine learning est recommandée." },
      ],
      es: [
        { q: "¿Es una certificación oficial de Google?", a: "Sí, es ofrecida y reconocida oficialmente por Google." },
        { q: "¿Necesito experiencia previa con TensorFlow?", a: "Se recomienda tener conocimientos básicos de Python y aprendizaje automático." },
      ],
    },
  },

  // Rotte quiz localizzate
  quizRoute: {
    it: "/it/quiz/tensorflow",
    en: "/en/quiz/tensorflow",
    fr: "/fr/quiz/tensorflow",
    es: "/es/quiz/tensorflow",
  },

  // Rotta “indietro”: lista certificazioni per lingua (coerente con gli altri data/*.ts)
  backRoute: {
    it: "/it/certificazioni",
    en: "/en/certifications",
    fr: "/fr/certifications",
    es: "/es/certificaciones",
  },
} as const;

export default GoogleTensorFlowDeveloper;
