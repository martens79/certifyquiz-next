// src/certifications/data/aws-solutions-architect.ts
// Data-only per CertificationPage (server). Nessun JSX/Router.

const AWS_SOLUTIONS_ARCHITECT = {
  slug: "aws-solutions-architect",
  imageUrl: "/images/certifications/aws-solutions-architect.png", // metti il logo in /public/images/certifications/
  officialUrl: "https://aws.amazon.com/certification/certified-solutions-architect-associate/",

  title: {
    it: "AWS Solutions Architect",
    en: "AWS Solutions Architect",
    fr: "Architecte Solutions AWS",
    es: "Arquitecto de Soluciones AWS",
  },
  level: {
    it: "Intermedio",
    en: "Intermediate",
    fr: "Intermédiaire",
    es: "Intermedio",
  },
  description: {
    it: "Progetta soluzioni scalabili, sicure e performanti nel cloud AWS: una delle certificazioni più richieste al mondo.",
    en: "Design scalable, secure, high-performing solutions on AWS—one of the most in-demand certifications globally.",
    fr: "Concevez des solutions évolutives, sécurisées et performantes sur AWS — l’une des certifications les plus recherchées.",
    es: "Diseña soluciones escalables, seguras y de alto rendimiento en AWS — una de las certificaciones más demandadas.",
  },

  topics: [
    {
      it: "Principi di architettura cloud AWS",
      en: "AWS Cloud Architecture Principles",
      fr: "Principes d’architecture cloud AWS",
      es: "Principios de arquitectura en la nube de AWS",
    },
    {
      it: "Progettazione di applicazioni scalabili",
      en: "Designing Scalable Applications",
      fr: "Conception d’applications évolutives",
      es: "Diseño de aplicaciones escalables",
    },
    {
      it: "Sicurezza e best practice su AWS",
      en: "AWS Security and Best Practices",
      fr: "Sécurité AWS et bonnes pratiques",
      es: "Seguridad y buenas prácticas en AWS",
    },
    {
      it: "Networking e storage su AWS",
      en: "Networking and Storage in AWS",
      fr: "Réseau et stockage sur AWS",
      es: "Redes y almacenamiento en AWS",
    },
    {
      it: "Monitoraggio e ottimizzazione performance",
      en: "Monitoring and Performance Optimization",
      fr: "Surveillance et optimisation des performances",
      es: "Supervisión y optimización del rendimiento",
    },
  ],

  extraContent: {
    learn: {
      it: [
        "Progettare architetture cloud resilienti, scalabili e sicure su AWS.",
        "Selezionare i servizi giusti (compute, storage, rete, database) per esigenze specifiche.",
        "Implementare bilanciamento del carico, alta disponibilità e disaster recovery.",
        "Ottimizzare costi e performance con strumenti di monitoraggio e best practice.",
      ],
      en: [
        "Design resilient, scalable, and secure cloud architectures on AWS.",
        "Choose the right services (compute, storage, networking, database) for specific needs.",
        "Implement load balancing, high availability, and disaster recovery.",
        "Optimize cost and performance using monitoring tools and best practices.",
      ],
      fr: [
        "Concevoir des architectures cloud résilientes, évolutives et sécurisées sur AWS.",
        "Choisir les bons services (calcul, stockage, réseau, base de données) selon les besoins.",
        "Mettre en œuvre l’équilibrage de charge, la haute disponibilité et le PRA.",
        "Optimiser les coûts et les performances avec des outils de suivi et des bonnes pratiques.",
      ],
      es: [
        "Diseñar arquitecturas en la nube resilientes, escalables y seguras en AWS.",
        "Elegir los servicios adecuados (cómputo, almacenamiento, red, base de datos).",
        "Implementar balanceo de carga, alta disponibilidad y recuperación ante desastres.",
        "Optimizar costes y rendimiento con herramientas de monitoreo y buenas prácticas.",
      ],
    },
    examReference: {
      it: [
        { text: "AWS Certified Solutions Architect – Associate (SAA-C03) – Pagina ufficiale", url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/" },
        { text: "AWS Certified Solutions Architect – Professional (SAP-C02) – Pagina ufficiale", url: "https://aws.amazon.com/certification/certified-solutions-architect-professional/" },
      ],
      en: [
        { text: "AWS Certified Solutions Architect – Associate (SAA-C03) – Official page", url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/" },
        { text: "AWS Certified Solutions Architect – Professional (SAP-C02) – Official page", url: "https://aws.amazon.com/certification/certified-solutions-architect-professional/" },
      ],
      fr: [
        { text: "AWS Certified Solutions Architect – Associate (SAA-C03) – Page officielle", url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/" },
        { text: "AWS Certified Solutions Architect – Professional (SAP-C02) – Page officielle", url: "https://aws.amazon.com/certification/certified-solutions-architect-professional/" },
      ],
      es: [
        { text: "AWS Certified Solutions Architect – Associate (SAA-C03) – Página oficial", url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/" },
        { text: "AWS Certified Solutions Architect – Professional (SAP-C02) – Página oficial", url: "https://aws.amazon.com/certification/certified-solutions-architect-professional/" },
      ],
    },
    whyChoose: {
      it: [
        "Tra le certificazioni cloud più richieste a livello globale.",
        "Valorizza profili come cloud architect, DevOps e solution designer.",
      ],
      en: [
        "One of the most in-demand cloud certifications worldwide.",
        "Boosts roles like cloud architect, DevOps engineer, and solution designer.",
      ],
      fr: [
        "Parmi les certifications cloud les plus demandées au monde.",
        "Valorise des rôles tels qu’architecte cloud, ingénieur DevOps et concepteur de solutions.",
      ],
      es: [
        "Entre las certificaciones cloud más demandadas a nivel mundial.",
        "Potencia roles como arquitecto cloud, ingeniero DevOps y diseñador de soluciones.",
      ],
    },
    faq: {
      it: [
        { q: "Serve esperienza pregressa?", a: "Una conoscenza di base dei servizi AWS è consigliata, ma non obbligatoria." },
        { q: "Quanto dura l’esame?", a: "Circa 130 minuti, 65 domande a scelta multipla o risposta multipla." },
        { q: "Dove si svolge?", a: "Online o presso un test center autorizzato Pearson VUE." },
      ],
      en: [
        { q: "Is prior experience required?", a: "Basic AWS knowledge is recommended, but not mandatory." },
        { q: "How long is the exam?", a: "About 130 minutes, 65 multiple-choice or multiple-response questions." },
        { q: "Where can I take it?", a: "Online or at an authorized Pearson VUE test center." },
      ],
      fr: [
        { q: "Faut-il une expérience préalable ?", a: "Une connaissance de base d’AWS est recommandée, sans être obligatoire." },
        { q: "Quelle est la durée de l'examen ?", a: "Environ 130 minutes, 65 questions à choix unique ou multiple." },
        { q: "Où le passer ?", a: "En ligne ou dans un centre Pearson VUE agréé." },
      ],
      es: [
        { q: "¿Se necesita experiencia previa?", a: "Se recomienda conocimiento básico de AWS, pero no es obligatorio." },
        { q: "¿Cuánto dura el examen?", a: "Aproximadamente 130 minutos, 65 preguntas de opción única o múltiple." },
        { q: "¿Dónde se realiza?", a: "En línea o en un centro autorizado Pearson VUE." },
      ],
    },
  },

  // ✅ AWS Solutions Architect -> deve puntare al suo quiz, non a aws-cloud (Cloud Practitioner)
quizRoute: {
  it: "/it/quiz/aws-solutions-architect",
  en: "/en/quiz/aws-solutions-architect",
  fr: "/fr/quiz/aws-solutions-architect",
  es: "/es/quiz/aws-solutions-architect",
},

  backRoute: {
    it: "/it/certificazioni",
    en: "/certifications",
    fr: "/fr/certifications",
    es: "/es/certifications",
  },
} as const;

export default AWS_SOLUTIONS_ARCHITECT;
