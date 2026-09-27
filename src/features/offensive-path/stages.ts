// src/features/offensive-path/stages.ts
// Data-only config for the Offensive Security Path (/offensive-security).
// No runtime imports on purpose: tests load this file directly with node.
//
// Rules (enforced by tests/offensive-security-path.test.ts):
// - status "next" / "planned" => certSlugs = [], ctas = [], no href anywhere;
// - every slug actually listed in certSlugs must exist in the registry;
// - practical stages never offer "blueprint-mock" nor mock-exam wording.
// A new stage is a new entry here: the page renders whatever this file lists.

import type { Locale } from "@/lib/paths";

export type StageStatus = "available" | "next" | "planned";
export type StageLevel = "foundation" | "intermediate" | "advanced";
export type AssessmentNature = "knowledge" | "mixed" | "practical";
export type ResourceKind =
  | "quiz"
  | "scenario-practice"
  | "labs"
  | "blueprint-mock"
  | "practical-prep";

/** Declarative link target, resolved to a localized href by the page. */
export type CtaTarget =
  | { to: "cert" | "quiz" | "mock" | "labs"; certSlug: string }
  | { to: "lab"; labSlug: string };

export type StageCta = { target: CtaTarget; primary?: boolean };

export type StageCopy = {
  title: string;
  target: string;
  objective: string;
  skills: string[];
  body: string[];
  note?: string;
};

export type PathStage = {
  id: "fundamentals" | "ceh" | "pentest-plus" | "ejpt" | "pnpt" | "oscp";
  status: StageStatus;
  level: StageLevel;
  assessmentNature: AssessmentNature;
  /** Certifications with real CertifyQuiz content. [] for next/planned. */
  certSlugs: string[];
  /** For available stages: what exists today. Otherwise: the planned format. */
  resources: ResourceKind[];
  /** Certification whose interactive labs are listed inline (live data). */
  labsCertSlug?: string;
  ctas: StageCta[];
  copy: Record<Locale, StageCopy>;
};

/** Short display names (brand names, identical in every locale). */
export const CERT_LABELS: Record<string, string> = {
  "networking-foundations": "Networking Foundations",
  "cybersecurity-foundations": "Cybersecurity Foundations",
  "cisco-ccst-networking": "Cisco CCST Networking",
  "cisco-ccst-cybersecurity": "Cisco CCST Cybersecurity",
  "isc2-cc": "ISC2 CC",
  "security-plus": "CompTIA Security+",
  ceh: "CEH",
};

export const PATH_STAGES: readonly PathStage[] = [
  {
    id: "fundamentals",
    status: "available",
    level: "foundation",
    assessmentNature: "knowledge",
    certSlugs: [
      "networking-foundations",
      "cybersecurity-foundations",
      "cisco-ccst-networking",
      "cisco-ccst-cybersecurity",
      "isc2-cc",
      "security-plus",
    ],
    resources: ["quiz", "scenario-practice", "labs"],
    ctas: [
      { target: { to: "cert", certSlug: "networking-foundations" }, primary: true },
      { target: { to: "cert", certSlug: "isc2-cc" } },
    ],
    copy: {
      en: {
        title: "Security and networking fundamentals",
        target: "Networking and Cybersecurity Foundations, Cisco CCST, ISC2 CC, CompTIA Security+",
        objective:
          "Understand what you will later be testing: networks, protocols, identities and the controls that defend them.",
        skills: [
          "TCP/IP, ports and common protocols",
          "Authentication, authorization and access control",
          "Threats, vulnerabilities and risk vocabulary",
          "Security controls, logging and incident basics",
        ],
        body: [
          "Offensive work is mostly reading systems correctly. A scan result, an HTTP response or a log line only makes sense if you already know how the underlying protocol or control is supposed to behave. That is why this path starts on the defensive side, not with attack tools.",
          "You do not need every certification listed here. A common route is one networking starting point, then ISC2 CC or CCST Cybersecurity, then Security+ when you want a broader and better-known credential before moving to CEH.",
        ],
      },
      it: {
        title: "Fondamenti di sicurezza e networking",
        target: "Networking e Cybersecurity Foundations, Cisco CCST, ISC2 CC, CompTIA Security+",
        objective:
          "Capire ciò che in seguito metterai alla prova: reti, protocolli, identità e i controlli che li proteggono.",
        skills: [
          "TCP/IP, porte e protocolli più comuni",
          "Autenticazione, autorizzazione e controllo degli accessi",
          "Minacce, vulnerabilità e lessico del rischio",
          "Controlli di sicurezza, log e basi di incident response",
        ],
        body: [
          "Il lavoro offensivo consiste soprattutto nel leggere correttamente i sistemi. L'output di una scansione, una risposta HTTP o una riga di log hanno senso solo se sai già come dovrebbero comportarsi il protocollo o il controllo sottostante. Per questo il percorso parte dal lato difensivo e non dagli strumenti di attacco.",
          "Non servono tutte le certificazioni elencate. Un percorso tipico è un punto di partenza sul networking, poi ISC2 CC o CCST Cybersecurity, quindi Security+ quando vuoi una credenziale più ampia e riconosciuta prima di passare a CEH.",
        ],
      },
      fr: {
        title: "Fondamentaux de la sécurité et des réseaux",
        target: "Networking et Cybersecurity Foundations, Cisco CCST, ISC2 CC, CompTIA Security+",
        objective:
          "Comprendre ce que vous testerez plus tard : réseaux, protocoles, identités et contrôles qui les protègent.",
        skills: [
          "TCP/IP, ports et protocoles courants",
          "Authentification, autorisation et contrôle d'accès",
          "Menaces, vulnérabilités et vocabulaire du risque",
          "Contrôles de sécurité, journaux et bases de la réponse aux incidents",
        ],
        body: [
          "Le travail offensif consiste surtout à bien lire les systèmes. Un résultat de scan, une réponse HTTP ou une ligne de journal n'ont de sens que si vous savez déjà comment le protocole ou le contrôle concerné est censé se comporter. C'est pourquoi ce parcours commence du côté défensif, et non par les outils d'attaque.",
          "Vous n'avez pas besoin de toutes les certifications listées. Un chemin fréquent : un premier point d'entrée réseau, puis ISC2 CC ou CCST Cybersecurity, puis Security+ lorsque vous voulez une certification plus large et plus reconnue avant de passer au CEH.",
        ],
      },
      es: {
        title: "Fundamentos de seguridad y redes",
        target: "Networking y Cybersecurity Foundations, Cisco CCST, ISC2 CC, CompTIA Security+",
        objective:
          "Entender lo que más adelante vas a poner a prueba: redes, protocolos, identidades y los controles que los protegen.",
        skills: [
          "TCP/IP, puertos y protocolos habituales",
          "Autenticación, autorización y control de acceso",
          "Amenazas, vulnerabilidades y vocabulario de riesgo",
          "Controles de seguridad, registros y bases de respuesta a incidentes",
        ],
        body: [
          "El trabajo ofensivo consiste sobre todo en leer bien los sistemas. El resultado de un escaneo, una respuesta HTTP o una línea de log solo tienen sentido si ya sabes cómo debería comportarse el protocolo o el control subyacente. Por eso esta ruta empieza por el lado defensivo y no por las herramientas de ataque.",
          "No necesitas todas las certificaciones de la lista. Un recorrido habitual es un punto de partida de redes, después ISC2 CC o CCST Cybersecurity y luego Security+ cuando quieras una credencial más amplia y conocida antes de pasar a CEH.",
        ],
      },
    },
  },
  {
    id: "ceh",
    status: "available",
    level: "intermediate",
    assessmentNature: "knowledge",
    certSlugs: ["ceh"],
    resources: ["quiz", "scenario-practice", "blueprint-mock", "labs"],
    labsCertSlug: "ceh",
    ctas: [
      { target: { to: "quiz", certSlug: "ceh" }, primary: true },
      { target: { to: "mock", certSlug: "ceh" } },
      { target: { to: "lab", labSlug: "ceh-recon-service-enumeration" } },
      { target: { to: "cert", certSlug: "ceh" } },
    ],
    copy: {
      en: {
        title: "Ethical hacking foundation: CEH",
        target: "EC-Council Certified Ethical Hacker (312-50)",
        objective:
          "Learn the attacker's methodology end to end and practise interpreting technical evidence the way the exam and real assessments require.",
        skills: [
          "Reconnaissance, scanning and service enumeration",
          "Web application and web server attack surface",
          "System hacking phases and privilege escalation logic",
          "Scope, rules of engagement and reporting",
        ],
        body: [
          "CEH is the first offensive stage fully available on CertifyQuiz today. The exam is multiple-choice, so knowledge practice is the core: topic training across all nine blueprint domains, mixed quizzes and a timed mock exam of 125 questions in 240 minutes whose domain mix follows the official EC-Council blueprint.",
          "Many questions go beyond definitions: they show an exhibit such as Nmap output, an HTTP exchange or a log excerpt and ask what it actually proves. Alongside the quizzes, four guided CEH Offensive Labs take you from reconnaissance to web evidence, privilege escalation reasoning and a scoped, reported assessment. The first lab is free; the other three are included with Premium.",
        ],
        note: "The labs are guided, evidence-based exercises in your browser. They do not give you a live target to attack.",
      },
      it: {
        title: "Base di ethical hacking: CEH",
        target: "EC-Council Certified Ethical Hacker (312-50)",
        objective:
          "Imparare la metodologia dell'attaccante dall'inizio alla fine e allenarsi a interpretare le evidenze tecniche come richiedono l'esame e gli assessment reali.",
        skills: [
          "Ricognizione, scansione ed enumerazione dei servizi",
          "Superficie di attacco di applicazioni e server web",
          "Fasi del system hacking e logica della privilege escalation",
          "Ambito, regole di ingaggio e reporting",
        ],
        body: [
          "CEH è la prima tappa offensiva disponibile oggi su CertifyQuiz in forma completa. L'esame è a scelta multipla, quindi il cuore della preparazione è la pratica sulle conoscenze: training per argomento su tutti e nove i domini del blueprint, quiz misti e una prova d'esame cronometrata da 125 domande in 240 minuti, con la distribuzione per dominio del blueprint ufficiale EC-Council.",
          "Molte domande vanno oltre le definizioni: mostrano un exhibit, come un output di Nmap, uno scambio HTTP o un estratto di log, e chiedono che cosa dimostra davvero. Accanto ai quiz, quattro CEH Offensive Labs guidati ti portano dalla ricognizione alle evidenze web, al ragionamento sulla privilege escalation fino a un assessment con ambito definito e report. Il primo lab è gratuito; gli altri tre sono inclusi in Premium.",
        ],
        note: "I lab sono esercitazioni guidate basate su evidenze, nel browser. Non forniscono un bersaglio reale da attaccare.",
      },
      fr: {
        title: "Base du hacking éthique : CEH",
        target: "EC-Council Certified Ethical Hacker (312-50)",
        objective:
          "Apprendre la méthodologie de l'attaquant de bout en bout et s'entraîner à interpréter des preuves techniques comme l'exigent l'examen et les évaluations réelles.",
        skills: [
          "Reconnaissance, scan et énumération des services",
          "Surface d'attaque des applications et serveurs web",
          "Phases du system hacking et logique d'élévation de privilèges",
          "Périmètre, règles d'engagement et rapport",
        ],
        body: [
          "Le CEH est la première étape offensive entièrement disponible aujourd'hui sur CertifyQuiz. L'examen est à choix multiples : l'entraînement sur les connaissances est donc central, avec un travail par thème sur les neuf domaines du blueprint, des quiz mixtes et un examen blanc chronométré de 125 questions en 240 minutes dont la répartition suit le blueprint officiel d'EC-Council.",
          "Beaucoup de questions vont au-delà des définitions : elles présentent une pièce technique, comme une sortie Nmap, un échange HTTP ou un extrait de journal, et demandent ce qu'elle prouve réellement. En complément des quiz, quatre CEH Offensive Labs guidés vous mènent de la reconnaissance aux preuves web, au raisonnement sur l'élévation de privilèges puis à une évaluation cadrée avec rapport. Le premier lab est gratuit ; les trois autres sont inclus dans Premium.",
        ],
        note: "Les labs sont des exercices guidés fondés sur des preuves, dans votre navigateur. Ils ne fournissent pas de cible réelle à attaquer.",
      },
      es: {
        title: "Base de hacking ético: CEH",
        target: "EC-Council Certified Ethical Hacker (312-50)",
        objective:
          "Aprender la metodología del atacante de principio a fin y practicar la interpretación de evidencias técnicas como exigen el examen y las evaluaciones reales.",
        skills: [
          "Reconocimiento, escaneo y enumeración de servicios",
          "Superficie de ataque de aplicaciones y servidores web",
          "Fases del system hacking y lógica de escalada de privilegios",
          "Alcance, reglas de enfrentamiento e informes",
        ],
        body: [
          "CEH es la primera etapa ofensiva disponible hoy de forma completa en CertifyQuiz. El examen es de opción múltiple, así que el núcleo es la práctica de conocimientos: entrenamiento por tema en los nueve dominios del blueprint, cuestionarios mixtos y un simulacro cronometrado de 125 preguntas en 240 minutos cuya distribución sigue el blueprint oficial de EC-Council.",
          "Muchas preguntas van más allá de las definiciones: muestran una evidencia, como una salida de Nmap, un intercambio HTTP o un extracto de log, y preguntan qué demuestra realmente. Junto a los cuestionarios, cuatro CEH Offensive Labs guiados te llevan del reconocimiento a las evidencias web, al razonamiento sobre escalada de privilegios y a una evaluación con alcance definido e informe. El primer lab es gratuito; los otros tres están incluidos en Premium.",
        ],
        note: "Los labs son ejercicios guiados basados en evidencias, en tu navegador. No ofrecen un objetivo real que atacar.",
      },
    },
  },
  {
    id: "pentest-plus",
    status: "next",
    level: "intermediate",
    assessmentNature: "mixed",
    certSlugs: [],
    resources: ["quiz", "scenario-practice", "labs"],
    ctas: [],
    copy: {
      en: {
        title: "Structured penetration testing: CompTIA PenTest+",
        target: "CompTIA PenTest+ (PT0-003)",
        objective:
          "Move from knowing attack techniques to running an engagement: planning, scoping, discovery, attacks and communicating results.",
        skills: [
          "Engagement planning, scoping and legal constraints",
          "Reconnaissance and vulnerability discovery",
          "Attacks against network, web, cloud and host targets",
          "Post-exploitation, cleanup and reporting",
        ],
        body: [
          "PenTest+ is the next certification we are building for this path. Compared with CEH it puts more weight on the engagement as a whole: what you are allowed to test, how you document it and how you turn findings into a report a client can act on. The exam combines multiple-choice questions with performance-based items.",
          "Preparation for this stage is not published yet. When it is, this card will link to it; until then there is deliberately no separate page.",
        ],
      },
      it: {
        title: "Penetration testing strutturato: CompTIA PenTest+",
        target: "CompTIA PenTest+ (PT0-003)",
        objective:
          "Passare dal conoscere le tecniche di attacco al condurre un ingaggio: pianificazione, ambito, discovery, attacchi e comunicazione dei risultati.",
        skills: [
          "Pianificazione dell'ingaggio, ambito e vincoli legali",
          "Ricognizione e individuazione delle vulnerabilità",
          "Attacchi a reti, applicazioni web, cloud e host",
          "Post-exploitation, pulizia e reporting",
        ],
        body: [
          "PenTest+ è la prossima certificazione che stiamo costruendo per questo percorso. Rispetto a CEH dà più peso all'ingaggio nel suo insieme: che cosa sei autorizzato a testare, come lo documenti e come trasformi i finding in un report su cui il cliente può agire. L'esame combina domande a scelta multipla e domande performance-based.",
          "La preparazione per questa tappa non è ancora pubblicata. Quando lo sarà, questa scheda porterà ai contenuti; fino ad allora, di proposito, non esiste una pagina separata.",
        ],
      },
      fr: {
        title: "Test d'intrusion structuré : CompTIA PenTest+",
        target: "CompTIA PenTest+ (PT0-003)",
        objective:
          "Passer de la connaissance des techniques d'attaque à la conduite d'une mission : planification, périmètre, découverte, attaques et restitution.",
        skills: [
          "Planification de la mission, périmètre et contraintes légales",
          "Reconnaissance et découverte de vulnérabilités",
          "Attaques sur réseaux, applications web, cloud et hôtes",
          "Post-exploitation, nettoyage et rapport",
        ],
        body: [
          "PenTest+ est la prochaine certification que nous construisons pour ce parcours. Par rapport au CEH, elle accorde plus de poids à la mission dans son ensemble : ce que vous avez le droit de tester, comment vous le documentez et comment vous transformez vos constats en un rapport exploitable par le client. L'examen combine questions à choix multiples et questions de type performance-based.",
          "La préparation de cette étape n'est pas encore publiée. Dès qu'elle le sera, cette fiche y mènera ; d'ici là, il n'existe volontairement aucune page séparée.",
        ],
      },
      es: {
        title: "Pentesting estructurado: CompTIA PenTest+",
        target: "CompTIA PenTest+ (PT0-003)",
        objective:
          "Pasar de conocer técnicas de ataque a dirigir un encargo: planificación, alcance, descubrimiento, ataques y comunicación de resultados.",
        skills: [
          "Planificación del encargo, alcance y restricciones legales",
          "Reconocimiento y descubrimiento de vulnerabilidades",
          "Ataques a redes, aplicaciones web, cloud y hosts",
          "Post-explotación, limpieza e informes",
        ],
        body: [
          "PenTest+ es la próxima certificación que estamos construyendo para esta ruta. Frente a CEH, da más peso al encargo en su conjunto: qué estás autorizado a probar, cómo lo documentas y cómo conviertes los hallazgos en un informe útil para el cliente. El examen combina preguntas de opción múltiple con preguntas basadas en desempeño.",
          "La preparación para esta etapa aún no está publicada. Cuando lo esté, esta ficha enlazará a ella; hasta entonces, a propósito, no existe una página separada.",
        ],
      },
    },
  },
  {
    id: "ejpt",
    status: "planned",
    level: "intermediate",
    assessmentNature: "practical",
    certSlugs: [],
    resources: ["practical-prep", "scenario-practice", "labs"],
    ctas: [],
    copy: {
      en: {
        title: "Entry-level practical testing: eJPT Practice",
        target: "eJPT (INE Security)",
        objective:
          "Apply the fundamentals hands-on: discover hosts, enumerate services and move through a small network.",
        skills: [
          "Host discovery and service enumeration in practice",
          "Basic web application testing",
          "Exploiting known vulnerabilities responsibly",
          "Pivoting between network segments",
        ],
        body: [
          "eJPT is assessed hands-on: you work inside a lab environment and answer questions based on what you actually find there. Reading about techniques is not enough; you need repetition with real tooling.",
          "This stage is planned. What we intend to offer is practical preparation, with scenario practice and guided labs built around the kind of evidence you meet in a hands-on assessment, not a copy of the exam itself.",
        ],
      },
      it: {
        title: "Test pratico di livello base: eJPT Practice",
        target: "eJPT (INE Security)",
        objective:
          "Applicare i fondamenti sul campo: individuare host, enumerare servizi e muoversi in una piccola rete.",
        skills: [
          "Host discovery ed enumerazione dei servizi nella pratica",
          "Test di base delle applicazioni web",
          "Sfruttamento responsabile di vulnerabilità note",
          "Pivoting tra segmenti di rete",
        ],
        body: [
          "L'eJPT si valuta sul campo: lavori dentro un ambiente di laboratorio e rispondi alle domande in base a ciò che trovi davvero. Leggere delle tecniche non basta; serve ripetizione con strumenti reali.",
          "Questa tappa è pianificata. Ciò che intendiamo offrire è una preparazione pratica, con scenari ed esercitazioni guidate costruite attorno al tipo di evidenze che incontri in una valutazione pratica, non una copia dell'esame.",
        ],
      },
      fr: {
        title: "Test pratique de niveau débutant : eJPT Practice",
        target: "eJPT (INE Security)",
        objective:
          "Appliquer les fondamentaux en conditions pratiques : découvrir des hôtes, énumérer des services et progresser dans un petit réseau.",
        skills: [
          "Découverte d'hôtes et énumération de services en pratique",
          "Tests de base d'applications web",
          "Exploitation responsable de vulnérabilités connues",
          "Pivot entre segments réseau",
        ],
        body: [
          "L'eJPT s'évalue en pratique : vous travaillez dans un environnement de laboratoire et répondez aux questions à partir de ce que vous y trouvez réellement. Lire sur les techniques ne suffit pas ; il faut de la répétition avec de vrais outils.",
          "Cette étape est planifiée. Nous prévoyons une préparation pratique, avec des scénarios et des labs guidés construits autour du type de preuves rencontrées lors d'une évaluation pratique, et non une copie de l'examen.",
        ],
      },
      es: {
        title: "Pruebas prácticas de nivel inicial: eJPT Practice",
        target: "eJPT (INE Security)",
        objective:
          "Aplicar los fundamentos en la práctica: descubrir hosts, enumerar servicios y moverte por una red pequeña.",
        skills: [
          "Descubrimiento de hosts y enumeración de servicios en la práctica",
          "Pruebas básicas de aplicaciones web",
          "Explotación responsable de vulnerabilidades conocidas",
          "Pivoting entre segmentos de red",
        ],
        body: [
          "El eJPT se evalúa en la práctica: trabajas dentro de un entorno de laboratorio y respondes preguntas según lo que realmente encuentras. Leer sobre técnicas no basta; hace falta repetición con herramientas reales.",
          "Esta etapa está planificada. Lo que queremos ofrecer es preparación práctica, con escenarios y labs guiados construidos en torno al tipo de evidencias que aparecen en una evaluación práctica, no una copia del examen.",
        ],
      },
    },
  },
  {
    id: "pnpt",
    status: "planned",
    level: "advanced",
    assessmentNature: "practical",
    certSlugs: [],
    resources: ["practical-prep", "scenario-practice"],
    ctas: [],
    copy: {
      en: {
        title: "Professional engagement workflow: PNPT Practice",
        target: "PNPT (TCM Security)",
        objective:
          "Work like a consultant on a full engagement, from external reconnaissance to internal Active Directory compromise and a client-ready report.",
        skills: [
          "OSINT and external attack surface",
          "Active Directory enumeration and attacks",
          "Handling evidence during an engagement",
          "Writing and presenting a professional report",
        ],
        body: [
          "PNPT is a multi-day practical engagement that ends with a written report and a live debrief. Reporting and communication count as much as technical access.",
          "This stage is planned. Preparation here will focus on engagement workflow, evidence handling and report-writing practice. It does not, and cannot, reproduce the real engagement.",
        ],
      },
      it: {
        title: "Flusso di un ingaggio professionale: PNPT Practice",
        target: "PNPT (TCM Security)",
        objective:
          "Lavorare come un consulente su un ingaggio completo, dalla ricognizione esterna alla compromissione di Active Directory interna fino a un report pronto per il cliente.",
        skills: [
          "OSINT e superficie di attacco esterna",
          "Enumerazione e attacchi ad Active Directory",
          "Gestione delle evidenze durante l'ingaggio",
          "Stesura e presentazione di un report professionale",
        ],
        body: [
          "Il PNPT è un ingaggio pratico di più giorni che si conclude con un report scritto e un debrief dal vivo. Reporting e comunicazione contano quanto l'accesso tecnico.",
          "Questa tappa è pianificata. La preparazione si concentrerà sul flusso dell'ingaggio, sulla gestione delle evidenze e sulla pratica di scrittura del report. Non riproduce, né può riprodurre, l'ingaggio reale.",
        ],
      },
      fr: {
        title: "Déroulé d'une mission professionnelle : PNPT Practice",
        target: "PNPT (TCM Security)",
        objective:
          "Travailler comme un consultant sur une mission complète, de la reconnaissance externe à la compromission de l'Active Directory interne, jusqu'à un rapport prêt pour le client.",
        skills: [
          "OSINT et surface d'attaque externe",
          "Énumération et attaques Active Directory",
          "Gestion des preuves pendant la mission",
          "Rédaction et présentation d'un rapport professionnel",
        ],
        body: [
          "Le PNPT est une mission pratique sur plusieurs jours qui se termine par un rapport écrit et un débriefing en direct. Le rapport et la communication comptent autant que l'accès technique.",
          "Cette étape est planifiée. La préparation portera sur le déroulé de la mission, la gestion des preuves et l'entraînement à la rédaction du rapport. Elle ne reproduit pas, et ne peut pas reproduire, la mission réelle.",
        ],
      },
      es: {
        title: "Flujo de un encargo profesional: PNPT Practice",
        target: "PNPT (TCM Security)",
        objective:
          "Trabajar como un consultor en un encargo completo, desde el reconocimiento externo hasta el compromiso del Active Directory interno y un informe listo para el cliente.",
        skills: [
          "OSINT y superficie de ataque externa",
          "Enumeración y ataques a Active Directory",
          "Gestión de evidencias durante el encargo",
          "Redacción y presentación de un informe profesional",
        ],
        body: [
          "El PNPT es un encargo práctico de varios días que termina con un informe escrito y una presentación en directo. El informe y la comunicación cuentan tanto como el acceso técnico.",
          "Esta etapa está planificada. La preparación se centrará en el flujo del encargo, la gestión de evidencias y la práctica de redacción de informes. No reproduce, ni puede reproducir, el encargo real.",
        ],
      },
    },
  },
  {
    id: "oscp",
    status: "planned",
    level: "advanced",
    assessmentNature: "practical",
    certSlugs: [],
    resources: ["practical-prep", "scenario-practice", "labs"],
    ctas: [],
    copy: {
      en: {
        title: "Advanced practical preparation: OSCP Practice",
        target: "OSCP (OffSec)",
        objective:
          "Build the independence needed for a long, proctored hands-on exam: enumerate thoroughly, adapt exploits and document every step.",
        skills: [
          "Methodical enumeration under time pressure",
          "Adapting public exploits safely",
          "Linux and Windows privilege escalation",
          "Active Directory attack chains and report-quality notes",
        ],
        body: [
          "OSCP is a long, proctored practical exam followed by a professional report. It rewards methodology and persistence far more than memorised facts, which is why it sits at the end of this path.",
          "This stage is planned as advanced practical preparation: scenario reasoning, methodology checklists and labs that train decisions. We will not present it as a replica of the exam, because no question bank can reproduce a hands-on OSCP attempt.",
        ],
      },
      it: {
        title: "Preparazione pratica avanzata: OSCP Practice",
        target: "OSCP (OffSec)",
        objective:
          "Costruire l'autonomia necessaria per un lungo esame pratico sorvegliato: enumerare a fondo, adattare gli exploit e documentare ogni passaggio.",
        skills: [
          "Enumerazione metodica sotto pressione di tempo",
          "Adattamento sicuro di exploit pubblici",
          "Privilege escalation su Linux e Windows",
          "Catene di attacco Active Directory e note da report",
        ],
        body: [
          "L'OSCP è un lungo esame pratico sorvegliato seguito da un report professionale. Premia il metodo e la costanza molto più delle nozioni memorizzate, ed è per questo che si trova alla fine del percorso.",
          "Questa tappa è pianificata come preparazione pratica avanzata: ragionamento su scenari, checklist di metodo e lab che allenano le decisioni. Non la presenteremo come una replica dell'esame, perché nessuna banca di domande può riprodurre un tentativo pratico OSCP.",
        ],
      },
      fr: {
        title: "Préparation pratique avancée : OSCP Practice",
        target: "OSCP (OffSec)",
        objective:
          "Acquérir l'autonomie nécessaire pour un long examen pratique surveillé : énumérer en profondeur, adapter les exploits et documenter chaque étape.",
        skills: [
          "Énumération méthodique sous contrainte de temps",
          "Adaptation sûre d'exploits publics",
          "Élévation de privilèges sous Linux et Windows",
          "Chaînes d'attaque Active Directory et notes dignes d'un rapport",
        ],
        body: [
          "L'OSCP est un long examen pratique surveillé suivi d'un rapport professionnel. Il récompense la méthode et la persévérance bien plus que les connaissances mémorisées, c'est pourquoi il se trouve à la fin de ce parcours.",
          "Cette étape est planifiée comme une préparation pratique avancée : raisonnement sur des scénarios, checklists de méthode et labs qui entraînent la prise de décision. Nous ne la présenterons pas comme une réplique de l'examen, car aucune banque de questions ne peut reproduire une tentative pratique de l'OSCP.",
        ],
      },
      es: {
        title: "Preparación práctica avanzada: OSCP Practice",
        target: "OSCP (OffSec)",
        objective:
          "Desarrollar la autonomía necesaria para un largo examen práctico supervisado: enumerar a fondo, adaptar exploits y documentar cada paso.",
        skills: [
          "Enumeración metódica bajo presión de tiempo",
          "Adaptación segura de exploits públicos",
          "Escalada de privilegios en Linux y Windows",
          "Cadenas de ataque en Active Directory y notas de calidad de informe",
        ],
        body: [
          "El OSCP es un largo examen práctico supervisado seguido de un informe profesional. Premia el método y la constancia mucho más que los datos memorizados, y por eso está al final de esta ruta.",
          "Esta etapa está planificada como preparación práctica avanzada: razonamiento sobre escenarios, checklists de metodología y labs que entrenan la toma de decisiones. No la presentaremos como una réplica del examen, porque ningún banco de preguntas puede reproducir un intento práctico de OSCP.",
        ],
      },
    },
  },
];
