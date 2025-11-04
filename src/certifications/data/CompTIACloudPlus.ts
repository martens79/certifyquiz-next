// src/certifications/data/comptia-cloud-plus.ts
// Data consumabile dal renderer server (niente JSX/router).

const CompTIACloudPlus = {
  slug: "comptia-cloud-plus",
  imageUrl: "/images/certifications/cloudplus-icon.png",
  officialUrl: "https://www.comptia.org/en-us/certifications/cloud/",

  title: {
    it: "CompTIA Cloud+",
    en: "CompTIA Cloud+",
    fr: "CompTIA Cloud+",
    es: "CompTIA Cloud+",
  },

  level: {
    it: "Intermedio",
    en: "Intermediate",
    fr: "Intermédiaire",
    es: "Intermedio",
  },

  description: {
    it: "La certificazione CompTIA Cloud+ attesta competenze nella gestione di infrastrutture cloud sicure ed efficienti.",
    en: "The CompTIA Cloud+ certification validates skills in managing secure and efficient cloud infrastructures.",
    fr: "La certification CompTIA Cloud+ valide les compétences dans la gestion d'infrastructures cloud sécurisées et efficaces.",
    es: "La certificación CompTIA Cloud+ valida habilidades en la gestión de infraestructuras cloud seguras y eficientes.",
  },

  topics: [
    { it: "Architettura e modelli di cloud computing", en: "Cloud architecture and models", fr: "Architecture et modèles de cloud computing", es: "Arquitectura y modelos de computación en la nube" },
    { it: "Implementazione e gestione delle infrastrutture cloud", en: "Cloud infrastructure implementation and management", fr: "Mise en œuvre et gestion de l’infrastructure cloud", es: "Implementación y gestión de infraestructuras cloud" },
    { it: "Sicurezza e conformità nel cloud", en: "Cloud security and compliance", fr: "Sécurité et conformité dans le cloud", es: "Seguridad y cumplimiento en la nube" },
    { it: "Risoluzione dei problemi di rete e storage cloud", en: "Cloud network and storage troubleshooting", fr: "Dépannage du réseau et du stockage cloud", es: "Resolución de problemas de red y almacenamiento cloud" },
    { it: "Monitoraggio e ottimizzazione delle risorse cloud", en: "Cloud resource monitoring and optimization", fr: "Surveillance et optimisation des ressources cloud", es: "Supervisión y optimización de recursos cloud" },
  ],

  extraContent: {
    learn: {
      it: [
        "Cloud+ ti permette di acquisire competenze pratiche per progettare, gestire e risolvere problemi in ambienti cloud complessi e multi-vendor.",
      ],
      en: [
        "Cloud+ equips you with practical skills to design, manage, and troubleshoot complex multi-vendor cloud environments.",
      ],
      fr: [
        "Cloud+ vous permet d'acquérir des compétences pratiques pour concevoir, gérer et résoudre des problèmes dans des environnements cloud complexes et multi-fournisseurs.",
      ],
      es: [
        "Cloud+ te brinda habilidades prácticas para diseñar, gestionar y resolver problemas en entornos cloud complejos y de múltiples proveedores.",
      ],
    },

    examReference: {
      it: [
        { text: "CompTIA Cloud+ (CV0-004) — Pagina ufficiale dell’esame", url: "https://www.comptia.org/en-us/certifications/cloud/" },
      ],
      en: [
        { text: "CompTIA Cloud+ (CV0-004) — Official exam page", url: "https://www.comptia.org/en-us/certifications/cloud/" },
      ],
      fr: [
        { text: "CompTIA Cloud+ (CV0-004) — Page officielle de l’examen", url: "https://www.comptia.org/en-us/certifications/cloud/" },
      ],
      es: [
        { text: "CompTIA Cloud+ (CV0-004) — Página oficial del examen", url: "https://www.comptia.org/en-us/certifications/cloud/" },
      ],
    },

    whyChoose: {
      it: [
        "È una certificazione neutrale che dimostra la tua capacità di lavorare nel cloud indipendentemente dal provider.",
        "Ideale per tecnici di sistema, ingegneri e amministratori IT.",
      ],
      en: [
        "A vendor-neutral certification proving your ability to work in cloud environments regardless of the provider.",
        "Ideal for system admins, engineers, and IT professionals.",
      ],
      fr: [
        "Une certification indépendante prouvant votre capacité à travailler dans des environnements cloud quel que soit le fournisseur.",
        "Idéale pour les administrateurs, ingénieurs et techniciens IT.",
      ],
      es: [
        "Una certificación neutral que demuestra tu capacidad para trabajar en entornos cloud sin importar el proveedor.",
        "Ideal para técnicos, ingenieros y profesionales de TI.",
      ],
    },

    faq: {
      it: [
        { q: "Serve esperienza precedente nel cloud?", a: "È consigliabile avere almeno 2-3 anni di esperienza in ambito IT o reti, ma non è obbligatoria." },
        { q: "Quanto dura la certificazione?", a: "La certificazione è valida per 3 anni e può essere rinnovata con crediti CEU o ri-esame." },
      ],
      en: [
        { q: "Do I need prior cloud experience?", a: "It's recommended to have 2–3 years of IT or networking experience, but it's not mandatory." },
        { q: "How long is the certification valid?", a: "It’s valid for 3 years and can be renewed through CEUs or retaking the exam." },
      ],
      fr: [
        { q: "Faut-il une expérience préalable dans le cloud ?", a: "Une expérience de 2 à 3 ans en informatique ou en réseau est recommandée, mais pas obligatoire." },
        { q: "Combien de temps la certification est-elle valable ?", a: "Elle est valable 3 ans et peut être renouvelée via des CEU ou un nouvel examen." },
      ],
      es: [
        { q: "¿Necesito experiencia previa en la nube?", a: "Se recomienda tener entre 2 y 3 años de experiencia en TI o redes, pero no es obligatorio." },
        { q: "¿Cuánto tiempo es válida la certificación?", a: "Es válida durante 3 años y se puede renovar con CEUs o repitiendo el examen." },
      ],
    },
  },

  // Rotte quiz localizzate (coerenti con i tuoi path attuali)
  quizRoute: {
    it: "/it/quiz/comptia-cloud-plus",
    en: "/en/quiz/comptia-cloud-plus",
    fr: "/fr/quiz/comptia-cloud-plus",
    es: "/es/quiz/comptia-cloud-plus",
  },

  // Rotta “indietro” generica verso lista certificazioni per lingua
  backRoute: {
    it: "/it/certificazioni",
    en: "/en/certifications",
    fr: "/fr/certifications",
    es: "/es/certificaciones",
  },
} as const;

export default CompTIACloudPlus;
