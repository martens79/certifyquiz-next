// src/features/offensive-path/copy.ts
// Page-level copy for the Offensive Security Path, IT/EN/FR/ES.
// Data-only (type import only) so tests can load it with node.

import type { Locale } from "@/lib/paths";
import type {
  AssessmentNature,
  ResourceKind,
  StageLevel,
  StageStatus,
} from "./stages";

type CtaKind = "cert" | "quiz" | "mock" | "labs" | "lab";

export type PathPageCopy = {
  meta: { title: string; description: string };
  eyebrow: string;
  h1: string;
  intro: string[];
  heroPrimary: string;
  heroSecondary: string;
  overviewTitle: string;
  legendTitle: string;
  status: Record<StageStatus, string>;
  statusHelp: Record<StageStatus, string>;
  level: Record<StageLevel, string>;
  nature: Record<AssessmentNature, string>;
  natureHelp: Record<AssessmentNature, string>;
  resource: Record<ResourceKind, string>;
  cta: Record<CtaKind, (name: string) => string>;
  stepLabel: (n: number) => string;
  targetLabel: string;
  objectiveLabel: string;
  skillsLabel: string;
  availableNowLabel: string;
  plannedFormatLabel: string;
  certsLabel: string;
  questions: string;
  scenarios: string;
  labs: string;
  labsListTitle: string;
  freeLab: string;
  premiumLab: string;
  minutes: string;
  examTypesTitle: string;
  examTypes: string[];
  faqTitle: string;
  faq: Array<{ q: string; a: string }>;
  relatedTitle: string;
  relatedRoadmap: string;
  relatedLabs: string;
  disclaimer: string;
};

export const PATH_COPY: Record<Locale, PathPageCopy> = {
  en: {
    meta: {
      title: "Offensive Security Learning Path: CEH to Pentesting | CertifyQuiz",
      description:
        "A step-by-step offensive security path: fundamentals, CEH with quizzes, exhibits, a blueprint mock and labs, then PenTest+ and practical pentest preparation.",
    },
    eyebrow: "Offensive Security",
    h1: "Offensive Security Learning Path",
    intro: [
      "This path takes you from cybersecurity and networking fundamentals to practical penetration testing. Each stage says what it is for, which skills it builds and what CertifyQuiz already offers for it, so you always know where to start and what comes next.",
      "Not every stage is tested the same way. CEH and PenTest+ are sat as computer-based exams; eJPT, PNPT and OSCP are practical, hands-on assessments. We mark the difference clearly and only publish preparation that matches how each exam really works.",
    ],
    heroPrimary: "Start with CEH",
    heroSecondary: "Check the fundamentals first",
    overviewTitle: "The path at a glance",
    legendTitle: "How to read each stage",
    status: { available: "Available", next: "Next on the roadmap", planned: "Planned" },
    statusHelp: {
      available: "Content is published and you can use it today.",
      next: "The stage we are building next. No release date is promised.",
      planned: "Part of the roadmap. No preparation is published yet.",
    },
    level: { foundation: "Foundation", intermediate: "Intermediate", advanced: "Advanced" },
    nature: {
      knowledge: "Knowledge-based exam",
      mixed: "Multiple-choice + performance-based",
      practical: "Practical, hands-on exam",
    },
    natureHelp: {
      knowledge: "Multiple-choice questions: practice with quizzes, exhibits and timed tests.",
      mixed: "Questions plus hands-on tasks inside the exam.",
      practical: "You work in a real environment and deliver results or a report.",
    },
    resource: {
      quiz: "Quiz & training",
      "scenario-practice": "Scenario & exhibit practice",
      labs: "Interactive labs",
      "blueprint-mock": "Blueprint mock exam",
      "practical-prep": "Practical preparation",
    },
    cta: {
      cert: (name) => `${name} overview`,
      quiz: (name) => `Start ${name} training`,
      mock: (name) => `${name} blueprint mock exam`,
      labs: (name) => `All ${name} labs`,
      lab: () => "Try the free lab",
    },
    stepLabel: (n) => `Stage ${n}`,
    targetLabel: "Target",
    objectiveLabel: "Objective",
    skillsLabel: "Skills you build",
    availableNowLabel: "Available on CertifyQuiz",
    plannedFormatLabel: "Planned format",
    certsLabel: "Certifications in this stage",
    questions: "questions",
    scenarios: "scenarios",
    labs: "labs",
    labsListTitle: "CEH Offensive Labs",
    freeLab: "Free",
    premiumLab: "Premium",
    minutes: "min",
    examTypesTitle: "Knowledge exams and practical exams need different preparation",
    examTypes: [
      "CEH is a multiple-choice exam, and PenTest+ adds performance-based items to its multiple-choice questions. In both cases you prove that you know techniques, tools and procedures and that you can interpret evidence correctly. Topic practice, exhibit-based questions and timed tests map well onto that format.",
      "eJPT, PNPT and OSCP are different: you receive an environment and must obtain results yourself, and for PNPT and OSCP you also write a professional report. Quizzes still help you fix concepts, but the preparation that matters is hands-on repetition. For these stages CertifyQuiz will offer practical preparation, never a question-based imitation of the exam.",
      "A realistic plan combines both. Use the knowledge stages to build vocabulary and judgment, and start practising in a lab environment as early as you can, even before CEH.",
    ],
    faqTitle: "Frequently asked questions",
    faq: [
      {
        q: "Do I need CEH before PenTest+?",
        a: "No. There is no formal prerequisite between them. We place CEH first because its broad coverage of attack techniques is a useful map before PenTest+ goes deeper into running an engagement. If a job posting asks for PenTest+, you can go straight to it once your fundamentals are solid.",
      },
      {
        q: "Where should I start if I am completely new?",
        a: "Start with the fundamentals stage: a networking starting point, then ISC2 CC or CCST Cybersecurity. Move to CEH when ports, protocols and access control no longer feel new, because most offensive questions assume you already read them fluently.",
      },
      {
        q: "Are the CEH Offensive Labs free?",
        a: "The first lab, on reconnaissance and service enumeration, is free for everyone. The other three labs are included with Premium. All four are guided, evidence-based exercises that run in your browser.",
      },
      {
        q: "What does \"Next on the roadmap\" mean?",
        a: "It marks the stage we are building next, currently CompTIA PenTest+. It is not a release date. A stage only gets links once its content is actually published, so you will never land on an empty page from here.",
      },
      {
        q: "Can CertifyQuiz prepare me for OSCP today?",
        a: "Not yet. OSCP is a practical exam and the stage is marked as planned. When it becomes available it will be practical preparation built on scenarios, methodology and labs, and it will never be presented as a replica of the exam.",
      },
    ],
    relatedTitle: "Related",
    relatedRoadmap: "Cybersecurity roadmap: SOC, cloud security, GRC and more",
    relatedLabs: "All interactive labs",
    disclaimer:
      "CEH is a trademark of EC-Council. CompTIA, PenTest+ and Security+ are trademarks of CompTIA. eJPT is a trademark of INE, PNPT of TCM Security and OSCP of OffSec; other names are trademarks of their respective owners. CertifyQuiz is independent and not affiliated with or endorsed by these organisations. The Practice stages train the skills these exams assess and do not reproduce the exams.",
  },
  it: {
    meta: {
      title: "Percorso Offensive Security: da CEH al pentesting | CertifyQuiz",
      description:
        "Percorso offensive security passo per passo: fondamenti, CEH con quiz, exhibit, simulazione da blueprint e lab, poi PenTest+ e preparazione pratica al pentest.",
    },
    eyebrow: "Offensive Security",
    h1: "Percorso Offensive Security",
    intro: [
      "Questo percorso ti porta dai fondamenti di cybersecurity e networking fino al penetration testing pratico. Ogni tappa spiega a cosa serve, quali competenze sviluppa e che cosa offre già CertifyQuiz, così sai sempre da dove partire e cosa viene dopo.",
      "Non tutte le tappe si valutano allo stesso modo. CEH e PenTest+ sono esami al computer; eJPT, PNPT e OSCP sono valutazioni pratiche sul campo. Segnaliamo chiaramente la differenza e pubblichiamo solo una preparazione coerente con il funzionamento reale di ciascun esame.",
    ],
    heroPrimary: "Inizia da CEH",
    heroSecondary: "Prima verifica i fondamenti",
    overviewTitle: "Il percorso in sintesi",
    legendTitle: "Come leggere ogni tappa",
    status: { available: "Disponibile", next: "Prossima tappa in sviluppo", planned: "Pianificata" },
    statusHelp: {
      available: "I contenuti sono pubblicati e puoi usarli oggi.",
      next: "La tappa che stiamo costruendo ora. Nessuna data promessa.",
      planned: "Fa parte della roadmap. Non c'è ancora preparazione pubblicata.",
    },
    level: { foundation: "Base", intermediate: "Intermedio", advanced: "Avanzato" },
    nature: {
      knowledge: "Esame di conoscenze",
      mixed: "Scelta multipla + performance-based",
      practical: "Esame pratico sul campo",
    },
    natureHelp: {
      knowledge: "Domande a scelta multipla: allenati con quiz, exhibit e prove cronometrate.",
      mixed: "Domande più attività pratiche all'interno dell'esame.",
      practical: "Lavori in un ambiente reale e consegni risultati o un report.",
    },
    resource: {
      quiz: "Quiz e training",
      "scenario-practice": "Scenari ed exhibit",
      labs: "Laboratori interattivi",
      "blueprint-mock": "Simulazione d'esame da blueprint",
      "practical-prep": "Preparazione pratica",
    },
    cta: {
      cert: (name) => `Panoramica ${name}`,
      quiz: (name) => `Inizia il training ${name}`,
      mock: (name) => `Simulazione d'esame ${name}`,
      labs: (name) => `Tutti i lab ${name}`,
      lab: () => "Prova il lab gratuito",
    },
    stepLabel: (n) => `Tappa ${n}`,
    targetLabel: "Obiettivo certificazione",
    objectiveLabel: "Scopo",
    skillsLabel: "Competenze che sviluppi",
    availableNowLabel: "Disponibile su CertifyQuiz",
    plannedFormatLabel: "Formato previsto",
    certsLabel: "Certificazioni di questa tappa",
    questions: "domande",
    scenarios: "scenari",
    labs: "lab",
    labsListTitle: "CEH Offensive Labs",
    freeLab: "Gratis",
    premiumLab: "Premium",
    minutes: "min",
    examTypesTitle: "Esami di conoscenze ed esami pratici richiedono preparazioni diverse",
    examTypes: [
      "CEH è un esame a scelta multipla, e PenTest+ aggiunge domande performance-based a quelle a scelta multipla. In entrambi i casi dimostri di conoscere tecniche, strumenti e procedure e di saper interpretare correttamente le evidenze. Pratica per argomento, domande con exhibit e prove cronometrate si adattano bene a questo formato.",
      "eJPT, PNPT e OSCP sono diversi: ricevi un ambiente e devi ottenere i risultati da solo, e per PNPT e OSCP scrivi anche un report professionale. I quiz aiutano ancora a fissare i concetti, ma la preparazione che conta è la ripetizione pratica. Per queste tappe CertifyQuiz offrirà preparazione pratica, mai un'imitazione dell'esame fatta di domande.",
      "Un piano realistico combina le due cose. Usa le tappe di conoscenza per costruire lessico e capacità di giudizio, e inizia a esercitarti in un ambiente di laboratorio il prima possibile, anche prima di CEH.",
    ],
    faqTitle: "Domande frequenti",
    faq: [
      {
        q: "Serve CEH prima di PenTest+?",
        a: "No. Non esiste un prerequisito formale tra le due. Mettiamo CEH prima perché la sua ampia copertura delle tecniche di attacco è una buona mappa prima che PenTest+ approfondisca la conduzione di un ingaggio. Se un annuncio di lavoro chiede PenTest+, puoi andarci direttamente quando i fondamenti sono solidi.",
      },
      {
        q: "Da dove parto se sono alle prime armi?",
        a: "Parti dalla tappa dei fondamenti: un punto di partenza sul networking, poi ISC2 CC o CCST Cybersecurity. Passa a CEH quando porte, protocolli e controllo degli accessi non ti sembrano più nuovi, perché la maggior parte delle domande offensive dà per scontato che tu li legga con naturalezza.",
      },
      {
        q: "I CEH Offensive Labs sono gratuiti?",
        a: "Il primo lab, su ricognizione ed enumerazione dei servizi, è gratuito per tutti. Gli altri tre lab sono inclusi in Premium. Tutti e quattro sono esercitazioni guidate basate su evidenze che si svolgono nel browser.",
      },
      {
        q: "Che cosa significa \"Prossima tappa in sviluppo\"?",
        a: "Indica la tappa che stiamo costruendo adesso, cioè CompTIA PenTest+. Non è una data di rilascio. Una tappa riceve link solo quando i suoi contenuti sono davvero pubblicati, quindi da qui non finirai mai su una pagina vuota.",
      },
      {
        q: "CertifyQuiz può prepararmi oggi all'OSCP?",
        a: "Non ancora. L'OSCP è un esame pratico e la tappa è segnata come pianificata. Quando sarà disponibile sarà una preparazione pratica basata su scenari, metodo e lab, e non verrà mai presentata come una replica dell'esame.",
      },
    ],
    relatedTitle: "Approfondimenti",
    relatedRoadmap: "Roadmap cybersecurity: SOC, cloud security, GRC e altro",
    relatedLabs: "Tutti i laboratori interattivi",
    disclaimer:
      "CEH è un marchio di EC-Council. CompTIA, PenTest+ e Security+ sono marchi di CompTIA. eJPT è un marchio di INE, PNPT di TCM Security e OSCP di OffSec; gli altri nomi sono marchi dei rispettivi proprietari. CertifyQuiz è indipendente e non è affiliata né approvata da queste organizzazioni. Le tappe Practice allenano le competenze valutate da questi esami e non li riproducono.",
  },
  fr: {
    meta: {
      title: "Parcours Offensive Security : du CEH au pentest | CertifyQuiz",
      description:
        "Parcours offensive security étape par étape : fondamentaux, CEH avec quiz, pièces techniques, examen blanc et labs, puis PenTest+ et préparation pratique.",
    },
    eyebrow: "Offensive Security",
    h1: "Parcours Offensive Security",
    intro: [
      "Ce parcours vous mène des fondamentaux de la cybersécurité et des réseaux jusqu'au test d'intrusion pratique. Chaque étape indique à quoi elle sert, quelles compétences elle développe et ce que CertifyQuiz propose déjà, pour que vous sachiez toujours par où commencer et quelle est la suite.",
      "Toutes les étapes ne s'évaluent pas de la même façon. Le CEH et PenTest+ sont des examens sur ordinateur ; l'eJPT, le PNPT et l'OSCP sont des évaluations pratiques. Nous signalons clairement la différence et ne publions qu'une préparation fidèle au fonctionnement réel de chaque examen.",
    ],
    heroPrimary: "Commencer par le CEH",
    heroSecondary: "Vérifier d'abord les fondamentaux",
    overviewTitle: "Le parcours en un coup d'œil",
    legendTitle: "Comment lire chaque étape",
    status: { available: "Disponible", next: "Prochaine étape en préparation", planned: "Planifiée" },
    statusHelp: {
      available: "Le contenu est publié et utilisable dès aujourd'hui.",
      next: "L'étape que nous construisons maintenant. Aucune date n'est promise.",
      planned: "Fait partie de la feuille de route. Aucune préparation publiée pour l'instant.",
    },
    level: { foundation: "Fondamental", intermediate: "Intermédiaire", advanced: "Avancé" },
    nature: {
      knowledge: "Examen de connaissances",
      mixed: "Choix multiples + performance-based",
      practical: "Examen pratique",
    },
    natureHelp: {
      knowledge: "Questions à choix multiples : entraînez-vous avec quiz, pièces techniques et tests chronométrés.",
      mixed: "Des questions et des tâches pratiques au sein de l'examen.",
      practical: "Vous travaillez dans un environnement réel et livrez des résultats ou un rapport.",
    },
    resource: {
      quiz: "Quiz et entraînement",
      "scenario-practice": "Scénarios et pièces techniques",
      labs: "Laboratoires interactifs",
      "blueprint-mock": "Examen blanc selon le blueprint",
      "practical-prep": "Préparation pratique",
    },
    cta: {
      cert: (name) => `Présentation ${name}`,
      quiz: (name) => `Commencer l'entraînement ${name}`,
      mock: (name) => `Examen blanc ${name}`,
      labs: (name) => `Tous les labs ${name}`,
      lab: () => "Essayer le lab gratuit",
    },
    stepLabel: (n) => `Étape ${n}`,
    targetLabel: "Certification visée",
    objectiveLabel: "Objectif",
    skillsLabel: "Compétences développées",
    availableNowLabel: "Disponible sur CertifyQuiz",
    plannedFormatLabel: "Format prévu",
    certsLabel: "Certifications de cette étape",
    questions: "questions",
    scenarios: "scénarios",
    labs: "labs",
    labsListTitle: "CEH Offensive Labs",
    freeLab: "Gratuit",
    premiumLab: "Premium",
    minutes: "min",
    examTypesTitle: "Examens de connaissances et examens pratiques demandent des préparations différentes",
    examTypes: [
      "Le CEH est un examen à choix multiples, et PenTest+ ajoute des questions de type performance-based aux questions à choix multiples. Dans les deux cas, vous prouvez que vous connaissez techniques, outils et procédures et que vous savez interpréter correctement des preuves. L'entraînement par thème, les questions avec pièces techniques et les tests chronométrés correspondent bien à ce format.",
      "L'eJPT, le PNPT et l'OSCP sont différents : vous recevez un environnement et devez obtenir les résultats vous-même, et pour le PNPT et l'OSCP vous rédigez aussi un rapport professionnel. Les quiz aident toujours à fixer les notions, mais la préparation qui compte est la répétition pratique. Pour ces étapes, CertifyQuiz proposera une préparation pratique, jamais une imitation de l'examen sous forme de questions.",
      "Un plan réaliste combine les deux. Utilisez les étapes de connaissances pour construire vocabulaire et jugement, et commencez à pratiquer en laboratoire le plus tôt possible, même avant le CEH.",
    ],
    faqTitle: "Questions fréquentes",
    faq: [
      {
        q: "Faut-il le CEH avant PenTest+ ?",
        a: "Non. Il n'existe aucun prérequis formel entre les deux. Nous plaçons le CEH en premier parce que sa large couverture des techniques d'attaque constitue une bonne carte avant que PenTest+ n'approfondisse la conduite d'une mission. Si une offre d'emploi demande PenTest+, vous pouvez y aller directement une fois les fondamentaux solides.",
      },
      {
        q: "Par où commencer si je débute complètement ?",
        a: "Commencez par l'étape des fondamentaux : un premier point d'entrée réseau, puis ISC2 CC ou CCST Cybersecurity. Passez au CEH quand les ports, les protocoles et le contrôle d'accès ne vous semblent plus nouveaux, car la plupart des questions offensives supposent que vous les lisez avec aisance.",
      },
      {
        q: "Les CEH Offensive Labs sont-ils gratuits ?",
        a: "Le premier lab, consacré à la reconnaissance et à l'énumération des services, est gratuit pour tous. Les trois autres labs sont inclus dans Premium. Les quatre sont des exercices guidés, fondés sur des preuves, qui se déroulent dans votre navigateur.",
      },
      {
        q: "Que signifie « Prochaine étape en préparation » ?",
        a: "Cela désigne l'étape que nous construisons maintenant, c'est-à-dire CompTIA PenTest+. Ce n'est pas une date de sortie. Une étape ne reçoit de liens qu'une fois son contenu réellement publié, vous n'arriverez donc jamais sur une page vide depuis ici.",
      },
      {
        q: "CertifyQuiz peut-il me préparer à l'OSCP aujourd'hui ?",
        a: "Pas encore. L'OSCP est un examen pratique et l'étape est indiquée comme planifiée. Lorsqu'elle sera disponible, ce sera une préparation pratique fondée sur des scénarios, de la méthode et des labs, et elle ne sera jamais présentée comme une réplique de l'examen.",
      },
    ],
    relatedTitle: "Pour aller plus loin",
    relatedRoadmap: "Roadmap cybersécurité : SOC, sécurité cloud, GRC et plus",
    relatedLabs: "Tous les laboratoires interactifs",
    disclaimer:
      "CEH est une marque d'EC-Council. CompTIA, PenTest+ et Security+ sont des marques de CompTIA. eJPT est une marque d'INE, PNPT de TCM Security et OSCP d'OffSec ; les autres noms sont des marques de leurs propriétaires respectifs. CertifyQuiz est indépendant et n'est ni affilié ni approuvé par ces organisations. Les étapes Practice entraînent les compétences évaluées par ces examens et ne les reproduisent pas.",
  },
  es: {
    meta: {
      title: "Ruta Offensive Security: de CEH al pentesting | CertifyQuiz",
      description:
        "Ruta de offensive security paso a paso: fundamentos, CEH con cuestionarios, evidencias, simulacro y labs, luego PenTest+ y preparación práctica para pentesting.",
    },
    eyebrow: "Offensive Security",
    h1: "Ruta Offensive Security",
    intro: [
      "Esta ruta te lleva desde los fundamentos de ciberseguridad y redes hasta el pentesting práctico. Cada etapa explica para qué sirve, qué habilidades desarrolla y qué ofrece ya CertifyQuiz, para que siempre sepas por dónde empezar y qué viene después.",
      "No todas las etapas se evalúan igual. CEH y PenTest+ son exámenes por ordenador; eJPT, PNPT y OSCP son evaluaciones prácticas. Marcamos la diferencia con claridad y solo publicamos preparación coherente con cómo funciona realmente cada examen.",
    ],
    heroPrimary: "Empezar por CEH",
    heroSecondary: "Revisar primero los fundamentos",
    overviewTitle: "La ruta de un vistazo",
    legendTitle: "Cómo leer cada etapa",
    status: { available: "Disponible", next: "Próxima etapa en desarrollo", planned: "Planificada" },
    statusHelp: {
      available: "El contenido está publicado y puedes usarlo hoy.",
      next: "La etapa que estamos construyendo ahora. Sin fecha prometida.",
      planned: "Forma parte de la hoja de ruta. Aún no hay preparación publicada.",
    },
    level: { foundation: "Básico", intermediate: "Intermedio", advanced: "Avanzado" },
    nature: {
      knowledge: "Examen de conocimientos",
      mixed: "Opción múltiple + basadas en desempeño",
      practical: "Examen práctico",
    },
    natureHelp: {
      knowledge: "Preguntas de opción múltiple: practica con cuestionarios, evidencias y pruebas cronometradas.",
      mixed: "Preguntas y tareas prácticas dentro del examen.",
      practical: "Trabajas en un entorno real y entregas resultados o un informe.",
    },
    resource: {
      quiz: "Cuestionarios y entrenamiento",
      "scenario-practice": "Escenarios y evidencias",
      labs: "Laboratorios interactivos",
      "blueprint-mock": "Simulacro según el blueprint",
      "practical-prep": "Preparación práctica",
    },
    cta: {
      cert: (name) => `Resumen de ${name}`,
      quiz: (name) => `Empezar el entrenamiento ${name}`,
      mock: (name) => `Simulacro ${name}`,
      labs: (name) => `Todos los labs de ${name}`,
      lab: () => "Probar el lab gratuito",
    },
    stepLabel: (n) => `Etapa ${n}`,
    targetLabel: "Certificación objetivo",
    objectiveLabel: "Objetivo",
    skillsLabel: "Habilidades que desarrollas",
    availableNowLabel: "Disponible en CertifyQuiz",
    plannedFormatLabel: "Formato previsto",
    certsLabel: "Certificaciones de esta etapa",
    questions: "preguntas",
    scenarios: "escenarios",
    labs: "labs",
    labsListTitle: "CEH Offensive Labs",
    freeLab: "Gratis",
    premiumLab: "Premium",
    minutes: "min",
    examTypesTitle: "Los exámenes de conocimientos y los prácticos requieren preparaciones distintas",
    examTypes: [
      "CEH es un examen de opción múltiple, y PenTest+ añade preguntas basadas en desempeño a las de opción múltiple. En ambos casos demuestras que conoces técnicas, herramientas y procedimientos y que sabes interpretar correctamente las evidencias. La práctica por tema, las preguntas con evidencias y las pruebas cronometradas encajan bien con ese formato.",
      "eJPT, PNPT y OSCP son distintos: recibes un entorno y debes obtener los resultados tú mismo, y en PNPT y OSCP además redactas un informe profesional. Los cuestionarios siguen ayudando a fijar conceptos, pero la preparación que cuenta es la repetición práctica. Para estas etapas CertifyQuiz ofrecerá preparación práctica, nunca una imitación del examen hecha de preguntas.",
      "Un plan realista combina ambas cosas. Usa las etapas de conocimientos para construir vocabulario y criterio, y empieza a practicar en un entorno de laboratorio cuanto antes, incluso antes de CEH.",
    ],
    faqTitle: "Preguntas frecuentes",
    faq: [
      {
        q: "¿Necesito CEH antes de PenTest+?",
        a: "No. No existe un requisito formal entre ambas. Ponemos CEH primero porque su amplia cobertura de técnicas de ataque es un buen mapa antes de que PenTest+ profundice en cómo dirigir un encargo. Si una oferta de empleo pide PenTest+, puedes ir directamente a ella cuando tus fundamentos sean sólidos.",
      },
      {
        q: "¿Por dónde empiezo si soy totalmente nuevo?",
        a: "Empieza por la etapa de fundamentos: un punto de partida de redes y después ISC2 CC o CCST Cybersecurity. Pasa a CEH cuando los puertos, los protocolos y el control de acceso ya no te resulten nuevos, porque la mayoría de las preguntas ofensivas dan por hecho que los lees con soltura.",
      },
      {
        q: "¿Los CEH Offensive Labs son gratuitos?",
        a: "El primer lab, sobre reconocimiento y enumeración de servicios, es gratuito para todos. Los otros tres labs están incluidos en Premium. Los cuatro son ejercicios guiados basados en evidencias que se realizan en tu navegador.",
      },
      {
        q: "¿Qué significa \"Próxima etapa en desarrollo\"?",
        a: "Indica la etapa que estamos construyendo ahora, es decir, CompTIA PenTest+. No es una fecha de lanzamiento. Una etapa solo recibe enlaces cuando su contenido está realmente publicado, así que desde aquí nunca llegarás a una página vacía.",
      },
      {
        q: "¿Puede CertifyQuiz prepararme hoy para el OSCP?",
        a: "Todavía no. El OSCP es un examen práctico y la etapa figura como planificada. Cuando esté disponible será preparación práctica basada en escenarios, metodología y labs, y nunca se presentará como una réplica del examen.",
      },
    ],
    relatedTitle: "Relacionado",
    relatedRoadmap: "Ruta de ciberseguridad: SOC, seguridad cloud, GRC y más",
    relatedLabs: "Todos los laboratorios interactivos",
    disclaimer:
      "CEH es una marca de EC-Council. CompTIA, PenTest+ y Security+ son marcas de CompTIA. eJPT es una marca de INE, PNPT de TCM Security y OSCP de OffSec; los demás nombres son marcas de sus respectivos propietarios. CertifyQuiz es independiente y no está afiliada ni respaldada por estas organizaciones. Las etapas Practice entrenan las habilidades que evalúan estos exámenes y no los reproducen.",
  },
};
