// src/certifications/data/itfplus.ts
// Data consumabile dal renderer server (niente JSX/router).

const ITFPlus = {
  slug: "comptia-itf-plus",
  imageUrl: "/images/certifications/itf-icon.png", // sostituisci quando avrai l’icona Tech+
  officialUrl: "https://www.comptia.org/en-us/certifications/tech/",

  title: {
    it: "CompTIA Tech+ (ex ITF+)",
    en: "CompTIA Tech+ (ex ITF+)",
    fr: "CompTIA Tech+ (ex ITF+)",
    es: "CompTIA Tech+ (ex ITF+)",
  },
  level: { it: "Principiante", en: "Beginner", fr: "Débutant", es: "Principiante" },

  description: {
    it: "Tech+ è l’evoluzione di ITF+: fondamenti IT con taglio pratico (infrastruttura, applicazioni, sviluppo di base, dati e sicurezza).",
    en: "Tech+ evolves ITF+, covering IT fundamentals with a hands-on focus (infrastructure, applications, basic dev, data, security).",
    fr: "Tech+ fait évoluer ITF+ et couvre les fondamentaux IT avec une approche pratique (infrastructure, applications, dev de base, données, sécurité).",
    es: "Tech+ evoluciona ITF+ y cubre fundamentos de TI con enfoque práctico (infraestructura, aplicaciones, desarrollo básico, datos, seguridad).",
  },

  topics: [
    { it: "Concetti e terminologia IT", en: "Tech Concepts & Terminology", fr: "Concepts et terminologie IT", es: "Conceptos y terminología de TI" },
    { it: "Infrastruttura (HW, dispositivi, virtualizzazione, cloud)", en: "Infrastructure (HW, devices, virtualization, cloud)", fr: "Infrastructure (matériel, virtualisation, cloud)", es: "Infraestructura (HW, virtualización, nube)" },
    { it: "Applicazioni e software (OS, browser, strumenti)", en: "Applications & Software (OS, browsers, tools)", fr: "Applications & logiciels (OS, navigateurs, outils)", es: "Aplicaciones y software (SO, navegadores, herramientas)" },
    { it: "Concetti base di sviluppo software", en: "Basic Software Development Concepts", fr: "Concepts de base du développement", es: "Conceptos básicos de desarrollo" },
    { it: "Dati e database (fondamenti)", en: "Data & Database Fundamentals", fr: "Données & bases de données", es: "Datos y fundamentos de bases de datos" },
    { it: "Sicurezza e reti (principi, buone pratiche)", en: "Security & Networking (principles, best practices)", fr: "Sécurité & réseau (principes, bonnes pratiques)", es: "Seguridad y redes (principios, buenas prácticas)" },
  ],

  extraContent: {
    // Avviso transizione ITF+ → Tech+
    notice: {
      it: "CompTIA Tech+ (FC0-U71) è il successore di ITF+ (FC0-U61). Se inizi ora, punta direttamente a Tech+.",
      en: "CompTIA Tech+ (FC0-U71) replaces ITF+ (FC0-U61). If you’re starting now, go for Tech+.",
      fr: "CompTIA Tech+ (FC0-U71) remplace ITF+ (FC0-U61). Si vous débutez, visez Tech+.",
      es: "CompTIA Tech+ (FC0-U71) reemplaza a ITF+ (FC0-U61). Si empiezas ahora, elige Tech+.",
    },

    learn: {
      it: [
        "Basi operative per muoverti nell’IT con esempi pratici.",
        "Infrastruttura moderna: virtualizzazione e servizi cloud.",
        "Fondamenti di sviluppo, dati e sicurezza per ruoli entry-level.",
      ],
      en: [
        "Hands-on foundations to navigate IT confidently.",
        "Modern infrastructure: virtualization and cloud services.",
        "Basic dev, data and security essentials for entry-level roles.",
      ],
      fr: [
        "Fondamentaux concrets pour évoluer en IT.",
        "Infrastructure moderne : virtualisation et services cloud.",
        "Bases de dev, données et sécurité pour débutants.",
      ],
      es: [
        "Fundamentos prácticos para moverte en TI con seguridad.",
        "Infraestructura moderna: virtualización y servicios en la nube.",
        "Bases de desarrollo, datos y seguridad para roles iniciales.",
      ],
    },

    examReference: {
      it: [
        { text: "CompTIA Tech+ (FC0-U71) — Pagina ufficiale", url: "https://www.comptia.org/en-us/certifications/tech/" },
        { text: "CompTIA ITF+ (FC0-U61) — Pagina storica", url: "https://www.comptia.org/en-us/certifications/itf/" },
      ],
      en: [
        { text: "CompTIA Tech+ (FC0-U71) — Official page", url: "https://www.comptia.org/en-us/certifications/tech/" },
        { text: "CompTIA ITF+ (FC0-U61) — Legacy page", url: "https://www.comptia.org/en-us/certifications/itf/" },
      ],
      fr: [
        { text: "CompTIA Tech+ (FC0-U71) — Page officielle", url: "https://www.comptia.org/en-us/certifications/tech/" },
        { text: "CompTIA ITF+ (FC0-U61) — Page historique", url: "https://www.comptia.org/en-us/certifications/itf/" },
      ],
      es: [
        { text: "CompTIA Tech+ (FC0-U71) — Página oficial", url: "https://www.comptia.org/en-us/certifications/tech/" },
        { text: "CompTIA ITF+ (FC0-U61) — Página histórica", url: "https://www.comptia.org/en-us/certifications/itf/" },
      ],
    },

    whyChoose: {
      it: [
        "Titolo aggiornato, orientato alla pratica.",
        "Allinea basi di infrastruttura, software, dati e sicurezza.",
        "Ottimo ponte verso A+, Network+, Security+.",
      ],
      en: [
        "Updated, practice-oriented entry credential.",
        "Aligns infra, software, data and security basics.",
        "Great bridge to A+, Network+, Security+.",
      ],
      fr: [
        "Certif d’entrée actualisée et pratique.",
        "Aligne les bases d’infra, logiciel, données et sécurité.",
        "Tremplin vers A+, Network+, Security+.",
      ],
      es: [
        "Credencial de entrada actualizada y práctica.",
        "Alinea fundamentos de infraestructura, software, datos y seguridad.",
        "Puente hacia A+, Network+, Security+.",
      ],
    },

    faq: {
      it: [
        { q: "Differenza tra Tech+ e ITF+?", a: "Tech+ evolve ITF+: più pratica e aggiornata a cloud/virtualizzazione. È il riferimento attuale." },
        { q: "Serve esperienza?", a: "No, pensata per principianti assoluti e ruoli junior." },
        { q: "Codice d’esame?", a: "Tech+ è FC0-U71 (ITF+ era FC0-U61)." },
        { q: "Quante domande/durata?", a: "Tipicamente 60–75 domande, ~60 minuti (verifica sempre la pagina ufficiale)." },
        { q: "Lingue disponibili?", a: "Controlla la pagina ufficiale; CQ offre prep in IT/EN/FR/ES." },
        { q: "I quiz ITF+ aiutano con Tech+?", a: "Sì, i fondamentali restano validi; stiamo ampliando per Tech+." },
      ],
      en: [
        { q: "Difference between Tech+ and ITF+?", a: "Tech+ evolves ITF+: more hands-on and updated for cloud/virtualization." },
        { q: "Need prior experience?", a: "No, aimed at absolute beginners and junior roles." },
        { q: "Exam code?", a: "Tech+ is FC0-U71 (ITF+ was FC0-U61)." },
        { q: "Questions/duration?", a: "Typically 60–75 items, ~60 minutes (check official page)." },
        { q: "Languages?", a: "See official page; CQ prep is IT/EN/FR/ES." },
        { q: "Are ITF+ quizzes useful?", a: "Yes—fundamentals carry over; we’re expanding for Tech+." },
      ],
      fr: [
        { q: "Différence Tech+ vs ITF+ ?", a: "Tech+ fait évoluer ITF+ : plus pratique, à jour cloud/virtualisation." },
        { q: "Expérience requise ?", a: "Non, pour grands débutants et rôles juniors." },
        { q: "Code examen ?", a: "Tech+ : FC0-U71 (ITF+ : FC0-U61)." },
        { q: "Questions/durée ?", a: "60–75 env., ~60 min (vérifier la page officielle)." },
        { q: "Langues ?", a: "Voir la page officielle ; CQ : IT/EN/FR/ES." },
        { q: "Les quiz ITF+ aident ?", a: "Oui, les fondamentaux restent valables ; contenu étendu pour Tech+." },
      ],
      es: [
        { q: "¿Diferencia Tech+ vs ITF+?", a: "Tech+ evoluciona ITF+: más práctica, actualizada a nube/virtualización." },
        { q: "¿Experiencia previa?", a: "No, para principiantes y roles junior." },
        { q: "¿Código del examen?", a: "Tech+: FC0-U71 (ITF+: FC0-U61)." },
        { q: "¿Preguntas/duración?", a: "60–75 aprox., ~60 min (confirma en la página oficial)." },
        { q: "¿Idiomas?", a: "Ver página oficial; CQ: IT/EN/FR/ES." },
        { q: "¿Sirven los quiz ITF+?", a: "Sí; ampliamos material orientado a Tech+." },
      ],
    },
  },

  // Rotte localizzate (manteniamo slug/quiz esistenti su itfplus)
  quizRoute: {
    it: "/it/quiz/itfplus",
    en: "/en/quiz/itfplus",
    fr: "/fr/quiz/itfplus",
    es: "/es/quiz/itfplus",
  },
  backRoute: {
    it: "/it/certificazioni",
    en: "/en/certifications",
    fr: "/fr/certifications",
    es: "/es/certifications",
  },
} as const;

export default ITFPlus;
