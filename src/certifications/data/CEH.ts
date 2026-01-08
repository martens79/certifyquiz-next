// src/certifications/data/ceh.ts
// Data-only per CertificationPage (server). Nessun JSX/Router.

const CEH = {
  slug: "ceh",
  imageUrl: "/images/certifications/ceh.png", // metti il logo in /public/images/certifications/ceh.png
  officialUrl:
    "https://www.eccouncil.org/train-certify/certified-ethical-hacker-ceh/",

  title: {
    it: "Certified Ethical Hacker (CEH)",
    en: "Certified Ethical Hacker (CEH)",
    fr: "Hacker Éthique Certifié (CEH)",
    es: "Hacker Ético Certificado (CEH)",
  },
  level: {
    it: "Intermedio",
    en: "Intermediate",
    fr: "Intermédiaire",
    es: "Intermedio",
  },
  description: {
    it: "La certificazione CEH attesta le competenze di un esperto in penetration testing e hacking etico.",
    en: "The CEH certification validates the skills of a professional in penetration testing and ethical hacking.",
    fr: "La certification CEH valide les compétences d'un expert en tests de pénétration et en hacking éthique.",
    es: "La certificación CEH valida las habilidades de un experto en pruebas de penetración y hacking ético.",
  },

  topics: [
    {
      it: "Metodologie di hacking etico",
      en: "Ethical hacking methodologies",
      fr: "Méthodologies de hacking éthique",
      es: "Metodologías de hacking ético",
    },
    {
      it: "Penetration testing",
      en: "Penetration testing",
      fr: "Tests de pénétration",
      es: "Pruebas de penetración",
    },
    {
      it: "Sicurezza delle reti",
      en: "Network security",
      fr: "Sécurité des réseaux",
      es: "Seguridad de redes",
    },
    {
      it: "Malware e tecniche di exploit",
      en: "Malware and exploit techniques",
      fr: "Malwares et techniques d'exploitation",
      es: "Malware y técnicas de explotación",
    },
    {
      it: "Cryptography e social engineering",
      en: "Cryptography and social engineering",
      fr: "Cryptographie et ingénierie sociale",
      es: "Criptografía e ingeniería social",
    },
  ],

  extraContent: {
    learn: {
      it: [
        "Identificare vulnerabilità nei sistemi informatici.",
        "Simulare attacchi hacker in modo etico.",
        "Comprendere malware, exploit e tecniche di attacco.",
        "Applicare tecniche di penetration testing.",
        "Utilizzare strumenti come Nmap, Metasploit, Wireshark.",
      ],
      en: [
        "Identify vulnerabilities in IT systems.",
        "Simulate ethical hacking attacks.",
        "Understand malware, exploits, and attack methods.",
        "Apply penetration testing techniques.",
        "Use tools like Nmap, Metasploit, Wireshark.",
      ],
      fr: [
        "Identifier les vulnérabilités des systèmes informatiques.",
        "Simuler des attaques de manière éthique.",
        "Comprendre les malwares, exploits et méthodes d’attaque.",
        "Appliquer les techniques de tests de pénétration.",
        "Utiliser des outils comme Nmap, Metasploit, Wireshark.",
      ],
      es: [
        "Identificar vulnerabilidades en sistemas informáticos.",
        "Simular ataques de hacking de forma ética.",
        "Comprender malware, exploits y métodos de ataque.",
        "Aplicar técnicas de pruebas de penetración.",
        "Usar herramientas como Nmap, Metasploit, Wireshark.",
      ],
    },
    examReference: {
      it: [
        {
          text: "CEH (312-50) — Pagina ufficiale della certificazione/esame",
          url: "https://www.eccouncil.org/train-certify/certified-ethical-hacker-ceh/",
        },
        {
          text: "CEH Practical — Pagina ufficiale dell’esame pratico",
          url: "https://www.eccouncil.org/train-certify/certified-ethical-hacker-ceh-practical/",
        },
      ],
      en: [
        {
          text: "CEH (312-50) — Official certification/exam page",
          url: "https://www.eccouncil.org/train-certify/certified-ethical-hacker-ceh/",
        },
        {
          text: "CEH Practical — Official practical exam page",
          url: "https://www.eccouncil.org/train-certify/certified-ethical-hacker-ceh-practical/",
        },
      ],
      fr: [
        {
          text: "CEH (312-50) — Page officielle de la certification/examen",
          url: "https://www.eccouncil.org/train-certify/certified-ethical-hacker-ceh/",
        },
        {
          text: "CEH Practical — Page officielle de l’examen pratique",
          url: "https://www.eccouncil.org/train-certify/certified-ethical-hacker-ceh-practical/",
        },
      ],
      es: [
        {
          text: "CEH (312-50) — Página oficial de la certificación/examen",
          url: "https://www.eccouncil.org/train-certify/certified-ethical-hacker-ceh/",
        },
        {
          text: "CEH Practical — Página oficial del examen práctico",
          url: "https://www.eccouncil.org/train-certify/certified-ethical-hacker-ceh-practical/",
        },
      ],
    },
    whyChoose: {
      it: [
        "È la certificazione di riferimento per l’hacking etico.",
        "Riconosciuta da aziende di cybersecurity in tutto il mondo.",
        "Utile per ruoli come analista SOC, penetration tester, red team.",
        "Competenze pratiche immediatamente spendibili.",
        "Aggiornata alle minacce moderne (APT, ransomware, ecc.).",
      ],
      en: [
        "Global standard for ethical hacking certification.",
        "Recognized by cybersecurity firms worldwide.",
        "Great for roles like SOC analyst, penetration tester, red team.",
        "Immediately applicable practical skills.",
        "Updated with modern threats (APTs, ransomware).",
      ],
      fr: [
        "Certification de référence en hacking éthique.",
        "Reconnue par les entreprises de cybersécurité.",
        "Adaptée aux rôles d’analyste SOC, pentester, red team.",
        "Compétences pratiques directement applicables.",
        "Actualisée avec les menaces modernes (APT, ransomwares).",
      ],
      es: [
        "Estándar global en hacking ético.",
        "Reconocida por empresas de ciberseguridad.",
        "Ideal para analistas SOC, pentesters, red team.",
        "Habilidades prácticas aplicables de inmediato.",
        "Actualizada ante amenazas modernas (APT, ransomware).",
      ],
    },
    faq: {
      it: [
        {
          q: "Serve esperienza in cybersecurity?",
          a: "Consigliate basi di networking e sistemi, ma non obbligatorie.",
        },
        {
          q: "Esame teorico o pratico?",
          a: "Include domande a scelta multipla e scenari pratici.",
        },
        {
          q: "Dove sostenerlo?",
          a: "Centri Pearson VUE o da remoto con proctoring.",
        },
      ],
      en: [
        {
          q: "Do I need cybersecurity experience?",
          a: "Basics of networking and systems are recommended, not required.",
        },
        { q: "Theoretical or practical exam?", a: "Multiple-choice plus practical scenarios." },
        { q: "Where to take it?", a: "Pearson VUE centers or online with proctoring." },
      ],
      fr: [
        {
          q: "Expérience en cybersécurité requise ?",
          a: "Bases en réseaux et systèmes recommandées, non obligatoires.",
        },
        { q: "Examen théorique ou pratique ?", a: "QCM et scénarios pratiques." },
        { q: "Où le passer ?", a: "Centres Pearson VUE ou en ligne avec surveillance." },
      ],
      es: [
        {
          q: "¿Experiencia en ciberseguridad?",
          a: "Se recomiendan bases de redes y sistemas, no obligatorias.",
        },
        { q: "¿Examen teórico o práctico?", a: "Tipo test y escenarios prácticos." },
        { q: "¿Dónde se realiza?", a: "Centros Pearson VUE o en línea con supervisión." },
      ],
    },
  },

  quizRoute: {
    it: "/it/quiz/ceh",
    en: "/en/quiz/ceh",
    fr: "/fr/quiz/ceh",
    es: "/es/quiz/ceh",
  },
  backRoute: {
    it: "/it/certificazioni",
    en: "/certifications",
    fr: "/fr/certifications",
    es: "/es/certifications",
  },
} as const;

export default CEH;
