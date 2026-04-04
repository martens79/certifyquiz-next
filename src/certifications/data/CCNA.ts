// src/certifications/data/ccna.ts
// 🔥 SEO-optimized “killer” version – data-only (no JSX/router).

const CCNA = {
  slug: "ccna",
  imageUrl: "/images/certifications/ccna.png",
  officialUrl:
    "https://www.cisco.com/site/us/en/learn/training-certifications/exams/ccna.html",

  // ✅ EN: numero reale (600). Altre lingue: no numeri falsi, ma intent “exam practice”.
  title: {
    it: "Cisco CCNA – Quiz e Simulazione Esame 200-301",
    en: "CCNA Practice Test 2026 – 600 Exam Questions (200-301)",
    fr: "Cisco CCNA – Quiz et Simulation Examen 200-301",
    es: "Cisco CCNA – Quiz y Simulación de Examen 200-301",
  },

  level: {
    it: "Intermedio",
    en: "Intermediate",
    fr: "Intermédiaire",
    es: "Intermedio",
  },

  // ✅ Spostiamo il focus: pratica + exam-style + simulation
  description: {
    it: "Preparati al Cisco CCNA 200-301 con quiz in stile esame, modalità training e simulazioni. Allenati su networking fundamentals, routing/switching, IP addressing, security e automazione di base.",
    en: "Practice for the Cisco CCNA 200-301 exam with 600 exam-style questions (English pool). Includes training mode, mixed quizzes, and realistic practice across networking fundamentals, routing & switching, IP services, security, and automation.",
    fr: "Préparez l’examen Cisco CCNA 200-301 avec des quiz type examen, un mode entraînement et des séries mixtes. Réseaux, routage/commutation, adressage IP, sécurité et automatisation de base.",
    es: "Prepárate para el examen Cisco CCNA 200-301 con quizzes tipo examen, modo entrenamiento y cuestionarios mixtos. Redes, routing/switching, direccionamiento IP, seguridad y automatización básica.",
  },

  // ✅ Topics più “syllabus-like” (più credibili per CCNA 200-301)
 topics: [
  {
    title: {
      it: "Hardware",
      en: "Hardware",
      fr: "Matériel",
      es: "Hardware",
    },
    slug: {
      it: "hardware",
      en: "hardware",
      fr: "materiel",
      es: "hardware",
    },
  },
  {
    title: {
      it: "Sistemi operativi",
      en: "Operating Systems",
      fr: "Systèmes d'exploitation",
      es: "Sistemas operativos",
    },
    slug: {
      it: "sistemi-operativi",
      en: "operating-systems",
      fr: "systemes-dexploitation",
      es: "sistemas-operativos",
    },
  },
  {
    title: {
      it: "Networking",
      en: "Networking",
      fr: "Réseautage",
      es: "Redes",
    },
    slug: {
      it: "networking",
      en: "networking",
      fr: "reseautage",
      es: "redes",
    },
  },
  {
    title: {
      it: "Sicurezza",
      en: "Security",
      fr: "Sécurité",
      es: "Seguridad",
    },
    slug: {
      it: "sicurezza",
      en: "security",
      fr: "securite",
      es: "seguridad",
    },
  },
  {
    title: {
      it: "Supporto tecnico",
      en: "Technical Support",
      fr: "Support technique",
      es: "Soporte técnico",
    },
    slug: {
      it: "supporto-tecnico",
      en: "technical-support",
      fr: "support-technique",
      es: "soporte-tecnico",
    },
  },
],

  extraContent: {
    learn: {
      it: [
        "Capire davvero OSI/TCP-IP, switching e routing (non solo teoria).",
        "Allenarti su subnetting e indirizzamento IP fino a farlo “a colpo d’occhio”.",
        "Configurare concetti chiave (VLAN, trunk, STP, OSPF) e riconoscere errori tipici.",
        "Lavorare su servizi IP (NAT, DHCP, DNS, NTP) e troubleshooting di rete.",
        "Prepararti con quiz in stile esame per aumentare velocità e precisione.",
      ],
      en: [
        "Master OSI/TCP-IP, switching, and routing with exam-style practice.",
        "Get fast at subnetting and IPv4/IPv6 addressing.",
        "Cover key 200-301 topics (VLANs, STP, OSPF, NAT, DHCP, ACLs).",
        "Train troubleshooting thinking: identify root causes quickly.",
        "Build confidence with consistent mixed practice and explanations.",
      ],
      fr: [
        "Maîtriser OSI/TCP-IP, switching et routage avec une pratique type examen.",
        "Progresser rapidement en subnetting et adressage IPv4/IPv6.",
        "Couvrir les sujets clés (VLAN, STP, OSPF, NAT, DHCP, ACL).",
        "Développer le réflexe dépannage (troubleshooting).",
        "Gagner en confiance avec des quiz mixtes et réguliers.",
      ],
      es: [
        "Dominar OSI/TCP-IP, switching y routing con práctica tipo examen.",
        "Mejorar rápido en subnetting y direccionamiento IPv4/IPv6.",
        "Cubrir temas clave (VLAN, STP, OSPF, NAT, DHCP, ACL).",
        "Entrenar mentalidad de troubleshooting para detectar fallos.",
        "Ganar confianza con práctica mixta y constante.",
      ],
    },

    examReference: {
      it: [
        {
          text: "Cisco CCNA 200-301 — Pagina ufficiale dell’esame",
          url: "https://www.cisco.com/site/us/en/learn/training-certifications/exams/ccna.html",
        },
      ],
      en: [
        {
          text: "Cisco CCNA 200-301 — Official exam page",
          url: "https://www.cisco.com/site/us/en/learn/training-certifications/exams/ccna.html",
        },
      ],
      fr: [
        {
          text: "Cisco CCNA 200-301 — Page officielle de l’examen",
          url: "https://www.cisco.com/site/us/en/learn/training-certifications/exams/ccna.html",
        },
      ],
      es: [
        {
          text: "Cisco CCNA 200-301 — Página oficial del examen",
          url: "https://www.cisco.com/site/us/en/learn/training-certifications/exams/ccna.html",
        },
      ],
    },

    whyChoose: {
      it: [
        "Certificazione di rete più conosciuta per entrare nel mondo networking.",
        "Ottima per ruoli NOC, Network Technician e Junior Network Engineer.",
        "Allenamento pratico: quiz e domande in stile esame (non solo teoria).",
        "Base solida prima di specializzarti (CyberOps, DevNet, CCNP).",
      ],
      en: [
        "One of the most recognized entry networking certifications worldwide.",
        "Great for NOC, network technician, and junior network engineer roles.",
        "Practice-first: exam-style questions to improve speed and accuracy.",
        "Solid foundation before specializing (CyberOps, DevNet, CCNP).",
      ],
      fr: [
        "Une des certifications réseau les plus reconnues pour débuter.",
        "Utile pour NOC, technicien réseau et junior network engineer.",
        "Approche pratique : questions type examen pour progresser vite.",
        "Bonne base avant une spécialisation (CyberOps, DevNet, CCNP).",
      ],
      es: [
        "Una de las certificaciones de redes más reconocidas para empezar.",
        "Ideal para NOC, técnico de redes y junior network engineer.",
        "Enfoque práctico: preguntas tipo examen para mejorar rápido.",
        "Base sólida antes de especializarte (CyberOps, DevNet, CCNP).",
      ],
    },

    faq: {
      it: [
        { q: "CCNA è ancora utile nel 2026?", a: "Sì. È una base forte per networking, troubleshooting e concetti enterprise. È spesso richiesta per ruoli junior." },
        { q: "Quanto dura l’esame 200-301?", a: "In genere circa 120 minuti (formato e durata possono variare nel tempo)." },
        { q: "Come mi preparo al meglio?", a: "Studia i concetti e fai pratica costante: quiz misti + revisione degli errori ti fanno salire di livello velocemente." },
      ],
      en: [
        { q: "Is CCNA still worth it in 2026?", a: "Yes. It’s a strong foundation for networking, troubleshooting, and enterprise concepts—often required for junior roles." },
        { q: "How long is the 200-301 exam?", a: "Typically around 120 minutes (format and duration can change over time)." },
        { q: "What’s the best way to prepare?", a: "Learn the concepts and practice daily: mixed quizzes + reviewing mistakes is the fastest way to improve." },
      ],
      fr: [
        { q: "CCNA est-elle utile en 2026 ?", a: "Oui. C’est une base solide en réseau et dépannage, souvent demandée pour des postes junior." },
        { q: "Quelle est la durée de l’examen 200-301 ?", a: "En général environ 120 minutes (le format peut évoluer)." },
        { q: "Comment bien se préparer ?", a: "Révisez et pratiquez régulièrement : quiz mixtes + analyse des erreurs = progression rapide." },
      ],
      es: [
        { q: "¿Sigue valiendo la pena CCNA en 2026?", a: "Sí. Es una base sólida de redes y troubleshooting, muy pedida para roles junior." },
        { q: "¿Cuánto dura el examen 200-301?", a: "Normalmente alrededor de 120 minutos (puede variar con el tiempo)." },
        { q: "¿Cómo prepararme mejor?", a: "Estudia y practica a diario: quizzes mixtos + revisar errores es lo más eficaz." },
      ],
    },
  },

  quizRoute: {
    it: "/it/quiz/cisco-ccna",
    en: "/en/quiz/cisco-ccna",
    fr: "/fr/quiz/cisco-ccna",
    es: "/es/quiz/cisco-ccna",
  },
  backRoute: {
    it: "/it/certificazioni",
    en: "/certifications",
    fr: "/fr/certifications",
    es: "/es/certifications",
  },
} as const;

export default CCNA;
