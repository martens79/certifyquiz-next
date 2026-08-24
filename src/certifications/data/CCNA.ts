// src/certifications/data/ccna.ts
// 🔥 SEO-optimized “killer” version – data-only (no JSX/router).

const CCNA = {
  slug: "ccna",
  imageUrl: "/images/certifications/ccna.png",
  officialUrl:
    "https://www.cisco.com/site/us/en/learn/training-certifications/exams/ccna.html",

  // Verificato il 2026-08-04 sulle fonti Cisco ufficiali.
  // CCNA v2.0 è annunciato per il 2027-02-03: fino ad allora la versione
  // corrente indicata da Cisco resta 200-301 v1.1.
  examBlueprint: {
    examName: "Implementing and Administering Cisco Solutions",
    examCode: "200-301",
    examVersion: "v1.1",
    provider: "Cisco",
    officialSourceName: "CCNA Exam v1.1 (200-301) — Exam Topics",
    officialSourceUrl:
      "https://learningcontent.cisco.com/documents/marketing/exam-topics/200-301-CCNA-v1.1.pdf",
    officialExamPageUrl:
      "https://www.cisco.com/site/us/en/learn/training-certifications/exams/ccna.html",
    lastVerifiedAt: "2026-08-23",
    domains: [
      { name: "Network Fundamentals", percentage: 20 },
      { name: "Network Access", percentage: 20 },
      { name: "IP Connectivity", percentage: 25 },
      { name: "IP Services", percentage: 10 },
      { name: "Security Fundamentals", percentage: 15 },
      { name: "Automation and Programmability", percentage: 10 },
    ],
  },

  // ✅ EN: numero reale (600). Altre lingue: no numeri falsi, ma intent “exam practice”.
  title: {
    it: "Cisco CCNA 200-301 – 1300+ domande e 18 lab",
    en: "CCNA 200-301 Practice – 1300+ Questions and 18 Labs",
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
    it: "Preparati al Cisco CCNA 200-301 v1.1 con oltre 1300 practice question, mock exam bilanciato sui sei domini, 10 Reviews e 18 lab interattivi, inclusi routing, IPv6, switching, security e automazione.",
    en: "Prepare for Cisco CCNA 200-301 v1.1 with 1300+ practice questions, a six-domain blueprint-balanced mock exam, 10 Reviews, and 18 interactive labs covering routing, IPv6, switching, security, and automation.",
    fr: "Préparez l’examen Cisco CCNA 200-301 avec des quiz type examen, un mode entraînement et des séries mixtes. Réseaux, routage/commutation, adressage IP, sécurité et automatisation de base.",
    es: "Prepárate para el examen Cisco CCNA 200-301 con quizzes tipo examen, modo entrenamiento y cuestionarios mixtos. Redes, routing/switching, direccionamiento IP, seguridad y automatización básica.",
  },
  metaTitle: {
  it: "CCNA 200-301 – Quiz e Simulazione Esame Cisco 2026 | CertifyQuiz",
  en: "CCNA 200-301 Practice – 1300+ Questions & 18 Labs | CertifyQuiz",
  fr: "CCNA 200-301 – Quiz et Simulation Examen Cisco 2026 | CertifyQuiz",
  es: "CCNA 200-301 – Quiz y Simulacro Examen Cisco 2026 | CertifyQuiz",
},
metaDescription: {
  it: "CCNA 200-301 v1.1: oltre 1300 domande, 10 Reviews, mock exam blueprint-based e 18 lab interattivi, di cui 4 gratuiti.",
  en: "CCNA 200-301 v1.1: 1300+ questions, 10 Reviews, a blueprint-based mock exam, and 18 interactive labs including 4 free labs.",
  fr: "Préparez le Cisco CCNA 200-301 avec des quiz type examen : routage, switching, subnetting, VLAN, OSPF et sécurité. Commencez gratuitement.",
  es: "Prepárate para el Cisco CCNA 200-301 con quizzes tipo examen: routing, switching, subnetting, VLAN, OSPF y seguridad. Empieza gratis.",
},
 topics: [
  { title:{it:"Dispositivi e hardware di rete Cisco",en:"Cisco Networking Devices and Hardware",fr:"Équipements et matériel réseau Cisco",es:"Dispositivos y hardware de red Cisco"}, slug:{it:"dispositivi-hardware-cisco",en:"cisco-network-devices-hardware",fr:"equipements-materiel-cisco",es:"dispositivos-hardware-cisco"} },
  { title:{it:"Cisco IOS e comandi CLI",en:"Cisco IOS and CLI Commands",fr:"Cisco IOS et commandes CLI",es:"Cisco IOS y comandos CLI"}, slug:{it:"cisco-ios-comandi-cli",en:"cisco-ios-cli-commands",fr:"cisco-ios-commandes-cli",es:"cisco-ios-comandos-cli"} },
  { title:{it:"Networking",en:"Networking",fr:"Réseaux",es:"Networking"}, slug:{it:"networking",en:"networking",fr:"reseaux",es:"networking"} },
  { title:{it:"Sicurezza",en:"Security",fr:"Sécurité",es:"Seguridad"}, slug:{it:"sicurezza",en:"security",fr:"securite",es:"seguridad"} },
  { title:{it:"Troubleshooting e diagnostica di rete",en:"Network Troubleshooting and Diagnostics",fr:"Dépannage et diagnostic réseau",es:"Troubleshooting y diagnóstico de red"}, slug:{it:"troubleshooting-diagnostica-rete",en:"network-troubleshooting-diagnostics",fr:"depannage-diagnostic-reseau",es:"troubleshooting-diagnostico-red"} },
  { title:{it:"Servizi IP",en:"IP Services",fr:"Services IP",es:"Servicios IP"}, slug:{it:"servizi-ip",en:"ip-services",fr:"services-ip",es:"servicios-ip"} },
  { title:{it:"Routing",en:"Routing",fr:"Routage",es:"Routing"}, slug:{it:"routing",en:"routing",fr:"routage",es:"routing"} },
  { title:{it:"Switching",en:"Switching",fr:"Commutation",es:"Switching"}, slug:{it:"switching",en:"switching",fr:"commutation",es:"switching"} },
  { title:{it:"Automazione e Programmabilità",en:"Automation and Programmability",fr:"Automatisation et programmabilité",es:"Automatización y programabilidad"}, slug:{it:"automazione-programmabilita",en:"automation-programmability",fr:"automatisation-programmabilite",es:"automatizacion-programabilidad"} },
  { title:{it:"Wireless",en:"Wireless",fr:"Sans fil",es:"Wireless"}, slug:{it:"wireless",en:"wireless",fr:"sans-fil",es:"wireless"} },
],

  extraContent: {
    currentCertification: {
      it:["Aggiornato il 23 agosto 2026 sul blueprint Cisco 200-301 v1.1.","1358 practice question in 10 topic, 10 Reviews e mock exam distribuito 20/20/25/10/15/10.","18 lab interattivi: 4 gratuiti e 14 inclusi negli accessi che comprendono i lab.","Le practice question allenano concetti e rapidità; il mock exam miscela i domini; le Reviews spiegano; i lab richiedono decisioni operative."],
      en:["Updated August 23, 2026 against the Cisco 200-301 v1.1 blueprint.","1358 practice questions across 10 topics, 10 Reviews, and a 20/20/25/10/15/10 blueprint-balanced mock exam.","18 interactive labs: 4 free and 14 included with access levels that contain labs.","Practice questions build knowledge and speed; the mock exam mixes domains; Reviews explain concepts; labs require operational decisions."],
      fr:["Mis à jour le 23 août 2026 selon le blueprint Cisco 200-301 v1.1.","1358 questions dans 10 thèmes, 10 Reviews et un mock exam réparti 20/20/25/10/15/10.","18 labs interactifs : 4 gratuits et 14 inclus dans les accès comprenant les labs.","Les questions développent connaissances et rapidité ; le mock exam mélange les domaines ; les Reviews expliquent ; les labs demandent des décisions opérationnelles."],
      es:["Actualizado el 23 de agosto de 2026 según el blueprint Cisco 200-301 v1.1.","1358 preguntas en 10 temas, 10 Reviews y un mock exam distribuido 20/20/25/10/15/10.","18 labs interactivos: 4 gratuitos y 14 incluidos en los accesos que contienen labs.","Las preguntas desarrollan conocimiento y velocidad; el mock exam mezcla dominios; las Reviews explican; los labs requieren decisiones operativas."],
    },
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
        { q: "Does CertifyQuiz include a CCNA mock test?", a: "Yes. After practicing by topic, use the CCNA mock exam to test your timing and apply concepts across the full 200-301 blueprint." },
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
