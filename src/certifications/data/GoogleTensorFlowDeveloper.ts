// src/certifications/data/google-tensorflow-developer.ts
// ✅ Versione data-only (nessun JSX/router).
// 🖼️ Metti l'immagine in /public/images/certifications/tensorflow-icon.png

const GoogleTensorFlowDeveloper = {
  slug: "tensorflow",
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
  {
    title: {
      it: "Fondamenti di TensorFlow",
      en: "TensorFlow Fundamentals",
      fr: "Fondamentaux de TensorFlow",
      es: "Fundamentos de TensorFlow",
    },
    slug: {
      it: "fondamenti-di-tensorflow",
      en: "tensorflow-fundamentals",
      fr: "fondamentaux-de-tensorflow",
      es: "fundamentos-de-tensorflow",
    },
  },
  {
    title: {
      it: "Reti neurali",
      en: "Neural Networks",
      fr: "Réseaux neuronaux",
      es: "Redes neuronales",
    },
    slug: {
      it: "reti-neurali",
      en: "neural-networks",
      fr: "reseaux-neuronaux",
      es: "redes-neuronales",
    },
  },
  {
    title: {
      it: "Classificazione immagini",
      en: "Image Classification",
      fr: "Classification d'images",
      es: "Clasificación de imágenes",
    },
    slug: {
      it: "classificazione-immagini",
      en: "image-classification",
      fr: "classification-dimages",
      es: "clasificacion-de-imagenes",
    },
  },
  {
    title: {
      it: "NLP",
      en: "NLP",
      fr: "NLP",
      es: "NLP",
    },
    slug: {
      it: "nlp",
      en: "nlp",
      fr: "nlp",
      es: "nlp",
    },
  },
  {
    title: {
      it: "Previsioni su serie temporali",
      en: "Time Series Forecasting",
      fr: "Prévisions de séries temporelles",
      es: "Predicciones de series temporales",
    },
    slug: {
      it: "previsioni-su-serie-temporali",
      en: "time-series-forecasting",
      fr: "previsions-de-series-temporelles",
      es: "predicciones-de-series-temporales",
    },
  },
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
    en: "/certifications",
    fr: "/fr/certifications",
    es: "/es/certificaciones",
  },
} as const;

export default GoogleTensorFlowDeveloper;
