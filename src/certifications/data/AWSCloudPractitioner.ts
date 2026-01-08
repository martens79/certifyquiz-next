// src/certifications/data/aws-cloud-practitioner.ts
// Data-only (niente JSX, niente router). Pronto per CertificationPage (server).

const AWS_CLOUD_PRACTITIONER = {
  slug: "aws-cloud-practitioner",
  imageUrl: "/images/certifications/aws-cloud-practitioner.png", // metti il file in /public/images/certifications/
  officialUrl: "https://aws.amazon.com/certification/certified-cloud-practitioner/",

  title: {
    it: "AWS Cloud Practitioner",
    en: "AWS Cloud Practitioner",
    fr: "Praticien du cloud AWS",
    es: "Practitioner de la nube AWS",
  },
  level: {
    it: "Base",
    en: "Entry",
    fr: "Base",
    es: "Básico",
  },
  description: {
    it: "Comprendi i fondamenti del cloud AWS e costruisci una base solida per il tuo percorso nella tecnologia cloud.",
    en: "Understand the fundamentals of AWS cloud and build a strong foundation for your cloud technology journey.",
    fr: "Comprenez les bases du cloud AWS et construisez une base solide pour votre parcours dans le cloud.",
    es: "Comprende los fundamentos de la nube de AWS y construye una base sólida para tu camino en tecnología cloud.",
  },

  topics: [
    {
      it: "Concetti di base del cloud computing",
      en: "Cloud Computing Fundamentals",
      fr: "Notions fondamentales du cloud computing",
      es: "Conceptos básicos de la computación en la nube",
    },
    {
      it: "Servizi principali AWS (EC2, S3, RDS)",
      en: "Core AWS Services (EC2, S3, RDS)",
      fr: "Services principaux d'AWS (EC2, S3, RDS)",
      es: "Servicios principales de AWS (EC2, S3, RDS)",
    },
    {
      it: "Modello di responsabilità condivisa",
      en: "Shared Responsibility Model",
      fr: "Modèle de responsabilité partagée",
      es: "Modelo de responsabilidad compartida",
    },
    {
      it: "Sicurezza e conformità in AWS",
      en: "Security and Compliance in AWS",
      fr: "Sécurité et conformité dans AWS",
      es: "Seguridad y cumplimiento en AWS",
    },
    {
      it: "Prezzi e supporto AWS",
      en: "AWS Pricing and Support",
      fr: "Tarification et support AWS",
      es: "Precios y soporte de AWS",
    },
  ],

  extraContent: {
    learn: {
      it: [
        "Scoprirai i concetti base del cloud computing e i servizi fondamentali offerti da AWS.",
        "Acquisirai una comprensione generale del modello di responsabilità condivisa, pricing, sicurezza e casi d'uso comuni.",
      ],
      en: [
        "You’ll learn the basic concepts of cloud computing and the core services provided by AWS.",
        "You'll gain a general understanding of the shared responsibility model, pricing, security, and common use cases.",
      ],
      fr: [
        "Vous apprendrez les concepts de base de l'informatique en nuage et les services fondamentaux proposés par AWS.",
        "Vous comprendrez le modèle de responsabilité partagée, la tarification, la sécurité et les cas d'usage courants.",
      ],
      es: [
        "Aprenderás los conceptos básicos de la computación en la nube y los servicios principales que ofrece AWS.",
        "Comprenderás el modelo de responsabilidad compartida, los precios, la seguridad y casos de uso comunes.",
      ],
    },
    examReference: {
      it: [
        {
          text: "AWS Certified Cloud Practitioner (CLF-C02) – Pagina ufficiale d’esame",
          url: "https://aws.amazon.com/certification/certified-cloud-practitioner/",
        },
      ],
      en: [
        {
          text: "AWS Certified Cloud Practitioner (CLF-C02) – Official exam page",
          url: "https://aws.amazon.com/certification/certified-cloud-practitioner/",
        },
      ],
      fr: [
        {
          text: "AWS Certified Cloud Practitioner (CLF-C02) – Page officielle de l’examen",
          url: "https://aws.amazon.com/certification/certified-cloud-practitioner/",
        },
      ],
      es: [
        {
          text: "AWS Certified Cloud Practitioner (CLF-C02) – Página oficial del examen",
          url: "https://aws.amazon.com/certification/certified-cloud-practitioner/",
        },
      ],
    },
    whyChoose: {
      it: [
        "È il primo passo ufficiale per iniziare una carriera nel cloud AWS.",
        "Riconosciuta a livello globale, è adatta anche a ruoli non tecnici e fornisce una solida base per proseguire con certificazioni avanzate.",
      ],
      en: [
        "This is the official first step to start a career in AWS cloud.",
        "Globally recognized, it’s also suitable for non-technical roles and provides a solid foundation for more advanced certifications.",
      ],
      fr: [
        "C'est la première étape officielle pour démarrer une carrière dans le cloud AWS.",
        "Reconnue mondialement, elle convient également aux profils non techniques et constitue une base solide pour des certifications plus avancées.",
      ],
      es: [
        "Es el primer paso oficial para comenzar una carrera en la nube de AWS.",
        "Reconocida mundialmente, también es adecuada para perfiles no técnicos y proporciona una base sólida para futuras certificaciones.",
      ],
    },
    faq: {
      it: [
        { q: "Serve esperienza tecnica?", a: "No, è pensata per principianti e ruoli aziendali." },
        { q: "Quanto dura l'esame?", a: "90 minuti con circa 65 domande." },
        { q: "In quali lingue è disponibile?", a: "Italiano, inglese, spagnolo, francese, tedesco, portoghese, cinese e altre." },
      ],
      en: [
        { q: "Do I need technical experience?", a: "No, it's designed for beginners and business roles." },
        { q: "How long is the exam?", a: "90 minutes with about 65 questions." },
        { q: "In which languages is it available?", a: "Italian, English, Spanish, French, German, Portuguese, Chinese, and more." },
      ],
      fr: [
        { q: "Faut-il une expérience technique ?", a: "Non, elle est conçue pour les débutants et les profils métiers." },
        { q: "Quelle est la durée de l'examen ?", a: "90 minutes avec environ 65 questions." },
        { q: "Dans quelles langues est-il disponible ?", a: "Italien, anglais, espagnol, français, allemand, portugais, chinois et autres." },
      ],
      es: [
        { q: "¿Se necesita experiencia técnica?", a: "No, está diseñada para principiantes y perfiles de negocio." },
        { q: "¿Cuánto dura el examen?", a: "90 minutos con unas 65 preguntas." },
        { q: "¿En qué idiomas está disponible?", a: "Italiano, inglés, español, francés, alemán, portugués, chino y más." },
      ],
    },
  },

  quizRoute: {
    it: "/it/quiz/aws-cloud-practitioner",
    en: "/en/quiz/aws-cloud-practitioner",
    fr: "/fr/quiz/aws-cloud-practitioner",
    es: "/es/quiz/aws-cloud-practitioner",
  },
  backRoute: {
    it: "/it/certificazioni",
    en: "/certifications",
    fr: "/fr/certifications",
    es: "/es/certifications",
  },
} as const;

export default AWS_CLOUD_PRACTITIONER;
