// src/certifications/editorial/p1-landing-overrides.ts
//
// Revisione editoriale delle landing con segnali "contenuto generico" (2026-10-04).
// Regole: ogni affermazione e' (a) un fatto sul nostro catalogo letto dal backend live
// il 2026-10-04, oppure (b) un fatto ufficiale verificato su pagina primaria alla stessa
// data (fonte indicata nei commenti), oppure (c) un consiglio di studio esplicito.
// Niente affermazioni di mercato ("molto richiesta", "riconosciuta") non documentate.
//
// L'overlay SOSTITUISCE i campi indicati (description, meta*, extraContent, ...) sull'oggetto
// del registry; topics, route e immagini restano quelli dei file in ./data.

import type { CertificationData, GuideSection, Lang, LocalizedText } from "../types";

const t = (it: string, en: string, fr: string, es: string): LocalizedText => ({ it, en, fr, es });
const byLang = <T,>(it: T, en: T, fr: T, es: T): Record<Lang, T> => ({ it, en, fr, es });

type Override = Partial<
  Pick<
    CertificationData,
    "title" | "level" | "description" | "metaTitle" | "metaDescription" | "officialUrl" | "examBlueprint" | "extraContent"
  >
>;

/* ------------------------------------------------------------------ PenTest+ */
// Fonte: https://www.comptia.org/en-us/certifications/pentest/ (verificata 2026-10-04):
// PT0-003, max 90 domande (scelta multipla + performance-based), 165 min, 750 su 100-900,
// lanciato 2024-12-17, PT0-002 ritirato 2025-06-17, 5 domini con pesi 13/21/17/35/14.
// Conteggi per dominio: dataset PT0-003 pubblicato (39/63/51/105/42 = 300).
const pentestPlus: Override = {
  description: t(
    "300 domande di pratica in 20 argomenti per CompTIA PenTest+ PT0-003, distribuite secondo i cinque domini ufficiali dell'esame. Materiale indipendente, non un prodotto CompTIA.",
    "300 practice questions in 20 topics for CompTIA PenTest+ PT0-003, distributed across the five official exam domains. Independent practice material, not a CompTIA product.",
    "300 questions d'entraînement réparties en 20 sujets pour CompTIA PenTest+ PT0-003, selon les cinq domaines officiels de l'examen. Matériel indépendant, pas un produit CompTIA.",
    "300 preguntas de práctica en 20 temas para CompTIA PenTest+ PT0-003, distribuidas según los cinco dominios oficiales del examen. Material independiente, no es un producto de CompTIA.",
  ),
  metaTitle: t(
    "CompTIA PenTest+ PT0-003 – 300 Domande di Pratica | CertifyQuiz",
    "CompTIA PenTest+ PT0-003 Practice Questions | CertifyQuiz",
    "CompTIA PenTest+ PT0-003 – 300 questions | CertifyQuiz",
    "CompTIA PenTest+ PT0-003 – 300 preguntas | CertifyQuiz",
  ),
  metaDescription: t(
    "300 domande PT0-003 sui cinque domini ufficiali, con exhibit, output di comando e spiegazioni. Materiale di pratica indipendente.",
    "300 PT0-003 practice questions across the five official domains, with exhibits, command output and explanations. Independent practice material.",
    "300 questions PT0-003 sur les cinq domaines officiels, avec captures, sorties de commande et explications. Matériel d'entraînement indépendant.",
    "300 preguntas PT0-003 sobre los cinco dominios oficiales, con imágenes, salidas de comandos y explicaciones. Material de práctica independiente.",
  ),
  examBlueprint: {
    examName: "CompTIA PenTest+",
    examCode: "PT0-003",
    examVersion: "V3, launched December 17, 2024",
    provider: "CompTIA",
    officialSourceName: "CompTIA PenTest+ certification page",
    officialSourceUrl: "https://www.comptia.org/en-us/certifications/pentest/",
    officialExamPageUrl: "https://www.comptia.org/en-us/certifications/pentest/",
    lastVerifiedAt: "2026-10-04",
    note: "Official format: up to 90 questions (multiple-choice and performance-based), 165 minutes, passing score 750 on a 100-900 scale. CompTIA recommends 3-4 years of penetration-testing experience and Network+ and Security+ or equivalent knowledge.",
    domains: [
      { name: "Engagement Management", percentage: 13 },
      { name: "Reconnaissance and Enumeration", percentage: 21 },
      { name: "Vulnerability Discovery and Analysis", percentage: 17 },
      { name: "Attacks and Exploits", percentage: 35 },
      { name: "Post-exploitation and Lateral Movement", percentage: 14 },
    ],
  },
  extraContent: {
    learn: byLang(
      [
        "Ambito, autorizzazione, regole di ingaggio, comunicazione e reportistica di un incarico (Engagement Management, 39 domande).",
        "Ricognizione passiva e attiva, enumerazione di servizi, web e identità, scripting della ricognizione (Reconnaissance and Enumeration, 63).",
        "Vulnerability scanning, validazione e prioritizzazione dei finding, discovery di codice e segreti (Vulnerability Discovery and Analysis, 51).",
        "Attacchi a rete, identità, host, web/API, cloud, wireless e fattore umano, più scripting offensivo (Attacks and Exploits, 105).",
        "Persistenza, movimento laterale, staging, esfiltrazione e cleanup (Post-exploitation and Lateral Movement, 42).",
      ],
      [
        "Scope, authorization, rules of engagement, communication and reporting for an engagement (Engagement Management, 39 questions).",
        "Passive and active reconnaissance, service, web and identity enumeration, recon scripting (Reconnaissance and Enumeration, 63).",
        "Vulnerability scanning, validation and prioritization of findings, code and secret discovery (Vulnerability Discovery and Analysis, 51).",
        "Attacks on networks, identities, hosts, web/APIs, cloud, wireless and people, plus attack scripting (Attacks and Exploits, 105).",
        "Persistence, lateral movement, staging, exfiltration and cleanup (Post-exploitation and Lateral Movement, 42).",
      ],
      [
        "Périmètre, autorisation, règles d'engagement, communication et rapports d'une mission (Engagement Management, 39 questions).",
        "Reconnaissance passive et active, énumération des services, du web et des identités, scripts de reconnaissance (Reconnaissance and Enumeration, 63).",
        "Analyse de vulnérabilités, validation et priorisation des constats, découverte de code et de secrets (Vulnerability Discovery and Analysis, 51).",
        "Attaques sur réseaux, identités, hôtes, web/API, cloud, sans-fil et facteur humain, plus scripts offensifs (Attacks and Exploits, 105).",
        "Persistance, mouvement latéral, préparation, exfiltration et nettoyage (Post-exploitation and Lateral Movement, 42).",
      ],
      [
        "Alcance, autorización, reglas de compromiso, comunicación e informes de un encargo (Engagement Management, 39 preguntas).",
        "Reconocimiento pasivo y activo, enumeración de servicios, web e identidades, scripts de reconocimiento (Reconnaissance and Enumeration, 63).",
        "Análisis de vulnerabilidades, validación y priorización de hallazgos, descubrimiento de código y secretos (Vulnerability Discovery and Analysis, 51).",
        "Ataques a redes, identidades, hosts, web/API, nube, inalámbrico y factor humano, más scripts ofensivos (Attacks and Exploits, 105).",
        "Persistencia, movimiento lateral, preparación, exfiltración y limpieza (Post-exploitation and Lateral Movement, 42).",
      ],
    ),
    guideSections: byLang<ReadonlyArray<GuideSection>>(
      [
        {
          title: "Cosa copre davvero questo quiz",
          paragraphs: [
            "300 domande in 20 argomenti, in italiano, inglese, francese e spagnolo, tutte a quattro opzioni con spiegazione. La distribuzione per dominio segue i pesi pubblicati da CompTIA per PT0-003: Engagement Management 39, Reconnaissance and Enumeration 63, Vulnerability Discovery and Analysis 51, Attacks and Exploits 105, Post-exploitation and Lateral Movement 42. Circa un terzo (95 domande) usa un exhibit o un output di comando da interpretare.",
          ],
        },
        {
          title: "Cosa NON copre",
          items: [
            "Non include simulazioni o laboratori performance-based: nell'esame reale ce ne sono, qui le domande sono a scelta multipla.",
            "Non sostituisce la pratica in un laboratorio con scanner, scripting e strumenti di exploitation.",
            "È materiale di pratica indipendente: non riproduce domande d'esame reali e non è approvato da CompTIA. Le domande sono state controllate con test automatici di coerenza ma non hanno avuto una revisione tecnica umana esterna: non vanno considerate una garanzia di copertura di ogni obiettivo PT0-003.",
          ],
        },
        {
          title: "Prerequisiti e fonti",
          paragraphs: [
            "Nessun prerequisito formale; CompTIA raccomanda 3-4 anni di esperienza nel penetration testing e conoscenze Network+ e Security+ o equivalenti. Formato ufficiale, versione e pesi dei domini sono nel riquadro dell'esame e provengono dalla pagina CompTIA ufficiale (verificata il 04/10/2026). Il PT0-002 è stato ritirato il 17 giugno 2025: questa pagina riguarda solo PT0-003.",
          ],
        },
      ],
      [
        {
          title: "What this question bank actually covers",
          paragraphs: [
            "300 questions in 20 topics, in English, Italian, French and Spanish, each with four options and an explanation. The split by domain follows the weights CompTIA publishes for PT0-003: Engagement Management 39, Reconnaissance and Enumeration 63, Vulnerability Discovery and Analysis 51, Attacks and Exploits 105, Post-exploitation and Lateral Movement 42. About a third (95 questions) ask you to interpret an exhibit or command output.",
          ],
        },
        {
          title: "What it does NOT cover",
          items: [
            "No performance-based simulations or labs: the real exam includes them, these questions are multiple-choice.",
            "It does not replace hands-on practice in a lab with scanners, scripting and exploitation tools.",
            "It is independent practice material: it does not reproduce live exam questions and is not endorsed by CompTIA. The questions went through automated consistency checks but have not had an external human technical review, so do not treat them as a guarantee of coverage of every PT0-003 objective.",
          ],
        },
        {
          title: "Prerequisites and sources",
          paragraphs: [
            "There is no formal prerequisite; CompTIA recommends 3-4 years of penetration-testing experience and Network+ and Security+ or equivalent knowledge. The official format, version and domain weights are in the exam box and come from the official CompTIA page (checked on 2026-10-04). PT0-002 was retired on June 17, 2025: this page is about PT0-003 only.",
          ],
        },
      ],
      [
        {
          title: "Ce que couvre réellement ce quiz",
          paragraphs: [
            "300 questions en 20 sujets, en français, anglais, italien et espagnol, à quatre options avec explication. La répartition par domaine suit les pondérations publiées par CompTIA pour PT0-003 : Engagement Management 39, Reconnaissance and Enumeration 63, Vulnerability Discovery and Analysis 51, Attacks and Exploits 105, Post-exploitation and Lateral Movement 42. Environ un tiers (95 questions) demande d'interpréter une capture ou une sortie de commande.",
          ],
        },
        {
          title: "Ce qu'il ne couvre PAS",
          items: [
            "Pas de simulations ni de laboratoires performance-based : l'examen réel en contient, ici les questions sont à choix multiple.",
            "Il ne remplace pas la pratique en laboratoire avec scanners, scripts et outils d'exploitation.",
            "C'est un matériel d'entraînement indépendant : il ne reproduit pas de vraies questions d'examen et n'est pas approuvé par CompTIA. Les questions ont subi des contrôles de cohérence automatisés mais pas de relecture technique humaine externe : ne les considérez pas comme une garantie de couverture de chaque objectif PT0-003.",
          ],
        },
        {
          title: "Prérequis et sources",
          paragraphs: [
            "Aucun prérequis formel ; CompTIA recommande 3 à 4 ans d'expérience en tests d'intrusion et des connaissances Network+ et Security+ ou équivalentes. Le format officiel, la version et les pondérations figurent dans l'encadré de l'examen et proviennent de la page officielle CompTIA (vérifiée le 04/10/2026). PT0-002 a été retiré le 17 juin 2025 : cette page ne concerne que PT0-003.",
          ],
        },
      ],
      [
        {
          title: "Qué cubre realmente este cuestionario",
          paragraphs: [
            "300 preguntas en 20 temas, en español, inglés, italiano y francés, cada una con cuatro opciones y explicación. El reparto por dominio sigue los pesos que CompTIA publica para PT0-003: Engagement Management 39, Reconnaissance and Enumeration 63, Vulnerability Discovery and Analysis 51, Attacks and Exploits 105, Post-exploitation and Lateral Movement 42. Alrededor de un tercio (95 preguntas) pide interpretar una imagen o la salida de un comando.",
          ],
        },
        {
          title: "Qué NO cubre",
          items: [
            "No incluye simulaciones ni laboratorios performance-based: el examen real los tiene, aquí las preguntas son de opción múltiple.",
            "No sustituye la práctica en un laboratorio con escáneres, scripts y herramientas de explotación.",
            "Es material de práctica independiente: no reproduce preguntas reales del examen ni está avalado por CompTIA. Las preguntas pasaron controles automáticos de coherencia pero no una revisión técnica humana externa: no las considere una garantía de cobertura de cada objetivo de PT0-003.",
          ],
        },
        {
          title: "Requisitos y fuentes",
          paragraphs: [
            "No hay requisito formal; CompTIA recomienda 3-4 años de experiencia en pruebas de penetración y conocimientos de Network+ y Security+ o equivalentes. El formato oficial, la versión y los pesos están en el recuadro del examen y proceden de la página oficial de CompTIA (verificada el 04/10/2026). PT0-002 se retiró el 17 de junio de 2025: esta página trata solo de PT0-003.",
          ],
        },
      ],
    ),
    examReference: byLang(
      [{ text: "Pagina ufficiale CompTIA PenTest+ (PT0-003)", url: "https://www.comptia.org/en-us/certifications/pentest/" }],
      [{ text: "Official CompTIA PenTest+ (PT0-003) page", url: "https://www.comptia.org/en-us/certifications/pentest/" }],
      [{ text: "Page officielle CompTIA PenTest+ (PT0-003)", url: "https://www.comptia.org/en-us/certifications/pentest/" }],
      [{ text: "Página oficial de CompTIA PenTest+ (PT0-003)", url: "https://www.comptia.org/en-us/certifications/pentest/" }],
    ),
    faq: byLang(
      [
        { q: "A quale versione dell'esame si riferisce?", a: "A PT0-003 (V3), lanciato il 17 dicembre 2024. PT0-002 è stato ritirato il 17 giugno 2025 (CompTIA, verificato il 04/10/2026)." },
        { q: "Il quiz include le domande performance-based?", a: "No. L'esame reale include domande performance-based; qui trovi domande a scelta multipla, con exhibit e output di comando, ma nessuna simulazione." },
        { q: "Le domande sono state revisionate da un esperto esterno?", a: "No: sono state controllate con test automatici di coerenza, senza una revisione umana tecnica esterna. Usale come pratica, non come garanzia di copertura." },
      ],
      [
        { q: "Which exam version does this refer to?", a: "PT0-003 (V3), launched on December 17, 2024. PT0-002 was retired on June 17, 2025 (CompTIA, checked on 2026-10-04)." },
        { q: "Does the quiz include performance-based questions?", a: "No. The real exam includes performance-based questions; here you get multiple-choice questions, including exhibits and command output, but no simulations." },
        { q: "Were the questions reviewed by an external expert?", a: "No: they went through automated consistency checks without an external human technical review. Use them as practice, not as a guarantee of coverage." },
      ],
      [
        { q: "À quelle version de l'examen cela correspond-il ?", a: "À PT0-003 (V3), lancé le 17 décembre 2024. PT0-002 a été retiré le 17 juin 2025 (CompTIA, vérifié le 04/10/2026)." },
        { q: "Le quiz inclut-il des questions performance-based ?", a: "Non. L'examen réel en inclut ; ici, vous avez des questions à choix multiple, avec captures et sorties de commande, mais aucune simulation." },
        { q: "Les questions ont-elles été relues par un expert externe ?", a: "Non : elles ont subi des contrôles de cohérence automatisés, sans relecture technique humaine externe. Utilisez-les comme entraînement, pas comme garantie de couverture." },
      ],
      [
        { q: "¿A qué versión del examen se refiere?", a: "A PT0-003 (V3), lanzado el 17 de diciembre de 2024. PT0-002 se retiró el 17 de junio de 2025 (CompTIA, verificado el 04/10/2026)." },
        { q: "¿El cuestionario incluye preguntas performance-based?", a: "No. El examen real las incluye; aquí hay preguntas de opción múltiple, con imágenes y salidas de comandos, pero ninguna simulación." },
        { q: "¿Las preguntas fueron revisadas por un experto externo?", a: "No: pasaron controles automáticos de coherencia, sin revisión técnica humana externa. Úselas como práctica, no como garantía de cobertura." },
      ],
    ),
  },
};

/* ------------------------------------------------------------ MongoDB Developer */
// Catalogo: 5 argomenti x 30 domande = 150 (it/en/fr/es). Pesi e formato dell'esame ufficiale non
// verificabili da fonte primaria (pagina learn.mongodb.com renderizzata via JS): non vengono citati.
const mongodb: Override = {
  title: t("MongoDB Developer Associate", "MongoDB Developer Associate", "MongoDB Developer Associate", "MongoDB Developer Associate"),
  description: t(
    "150 domande di pratica in 5 argomenti sulle competenze base di uno sviluppatore MongoDB: CRUD, modellazione dei dati, indici e aggregazioni, replica e sharding, sicurezza e backup.",
    "150 practice questions in 5 topics on core MongoDB developer skills: CRUD, data modeling, indexes and aggregations, replication and sharding, security and backup.",
    "150 questions d'entraînement en 5 sujets sur les compétences de base d'un développeur MongoDB : CRUD, modélisation, index et agrégations, réplication et sharding, sécurité et sauvegarde.",
    "150 preguntas de práctica en 5 temas sobre las competencias básicas de un desarrollador MongoDB: CRUD, modelado de datos, índices y agregaciones, replicación y sharding, seguridad y copias de seguridad.",
  ),
  metaTitle: t(
    "MongoDB Developer Associate Quiz – 150 Domande | CertifyQuiz",
    "MongoDB Developer Associate Practice Questions | CertifyQuiz",
    "MongoDB Developer Associate – 150 questions | CertifyQuiz",
    "MongoDB Developer Associate – 150 preguntas | CertifyQuiz",
  ),
  metaDescription: t(
    "150 domande su CRUD, modellazione dei documenti, indici, aggregazioni, replica, sharding e sicurezza di MongoDB, con spiegazioni. Quiz gratuito.",
    "150 questions on MongoDB CRUD, document modeling, indexes, aggregation, replication, sharding and security, with explanations. Free quiz.",
    "150 questions sur le CRUD, la modélisation des documents, les index, l'agrégation, la réplication, le sharding et la sécurité de MongoDB, avec explications.",
    "150 preguntas sobre CRUD, modelado de documentos, índices, agregación, replicación, sharding y seguridad de MongoDB, con explicaciones. Cuestionario gratuito.",
  ),
  extraContent: {
    learn: byLang(
      [
        "Scrivere operazioni CRUD e filtri di query.",
        "Scegliere tra documenti embedded e riferimenti nel modello dei dati.",
        "Costruire pipeline di aggregazione e scegliere indici adatti.",
        "Capire replica set, elezioni e le basi dello sharding.",
        "Applicare autenticazione, ruoli e concetti di backup e ripristino.",
      ],
      [
        "Write CRUD operations and query filters.",
        "Choose between embedded documents and references when modeling data.",
        "Build aggregation pipelines and pick suitable indexes.",
        "Understand replica sets, elections and the basics of sharding.",
        "Apply authentication, roles and backup/restore concepts.",
      ],
      [
        "Écrire des opérations CRUD et des filtres de requête.",
        "Choisir entre documents imbriqués et références dans la modélisation.",
        "Construire des pipelines d'agrégation et choisir des index adaptés.",
        "Comprendre les replica sets, les élections et les bases du sharding.",
        "Appliquer l'authentification, les rôles et les notions de sauvegarde et restauration.",
      ],
      [
        "Escribir operaciones CRUD y filtros de consulta.",
        "Elegir entre documentos incrustados y referencias al modelar datos.",
        "Construir pipelines de agregación y elegir índices adecuados.",
        "Entender replica sets, elecciones y los fundamentos del sharding.",
        "Aplicar autenticación, roles y conceptos de copia de seguridad y restauración.",
      ],
    ),
    guideSections: byLang<ReadonlyArray<GuideSection>>(
      [
        { title: "Cosa copre davvero questo quiz", items: ["CRUD Operations: 30 domande", "Data Modeling: 30 domande", "Indexes and Aggregations: 30 domande", "Replication and Sharding: 30 domande", "Security and Backup: 30 domande"] },
        {
          title: "Cosa NON copre e a quale esame si riferisce",
          items: [
            "L'esame di riferimento è MongoDB Associate Developer di MongoDB University; versione, durata, numero di domande e pesi vanno letti sulla pagina ufficiale, perché le domande non sono mappate sugli obiettivi ufficiali uno a uno.",
            "Le domande non sono legate a una versione specifica del server né a un linguaggio di driver, e non includono laboratori pratici.",
            "Per il codice con un driver (ad esempio Python o Node.js) serve pratica su un database reale, ad esempio un cluster gratuito su Atlas.",
          ],
        },
        { title: "Prerequisiti", paragraphs: ["Nessuno formale. Aiutano la familiarità con JSON e le basi di un linguaggio di programmazione. Contenuti e riferimenti controllati il 04/10/2026."] },
      ],
      [
        { title: "What this question bank actually covers", items: ["CRUD Operations: 30 questions", "Data Modeling: 30 questions", "Indexes and Aggregations: 30 questions", "Replication and Sharding: 30 questions", "Security and Backup: 30 questions"] },
        {
          title: "What it does NOT cover, and which exam it refers to",
          items: [
            "The reference exam is MongoDB University's MongoDB Associate Developer; version, duration, number of questions and weights are on the official page, because our questions are not mapped one-to-one to the official objectives.",
            "The questions are not tied to a specific server version or driver language, and do not include hands-on labs.",
            "For code written with a driver (for example Python or Node.js) you need practice on a real database, such as a free Atlas cluster.",
          ],
        },
        { title: "Prerequisites", paragraphs: ["None formally. Familiarity with JSON and the basics of a programming language help. Content and references checked on 2026-10-04."] },
      ],
      [
        { title: "Ce que couvre réellement ce quiz", items: ["CRUD Operations : 30 questions", "Data Modeling : 30 questions", "Indexes and Aggregations : 30 questions", "Replication and Sharding : 30 questions", "Security and Backup : 30 questions"] },
        {
          title: "Ce qu'il ne couvre PAS et l'examen visé",
          items: [
            "L'examen de référence est MongoDB Associate Developer de MongoDB University ; version, durée, nombre de questions et pondérations sont sur la page officielle, car nos questions ne sont pas alignées une à une sur les objectifs officiels.",
            "Les questions ne sont liées ni à une version précise du serveur ni à un langage de pilote, et ne comprennent pas de laboratoires pratiques.",
            "Pour le code avec un pilote (par exemple Python ou Node.js), il faut pratiquer sur une vraie base, par exemple un cluster Atlas gratuit.",
          ],
        },
        { title: "Prérequis", paragraphs: ["Aucun prérequis formel. La familiarité avec JSON et les bases d'un langage de programmation aident. Contenu et références vérifiés le 04/10/2026."] },
      ],
      [
        { title: "Qué cubre realmente este cuestionario", items: ["CRUD Operations: 30 preguntas", "Data Modeling: 30 preguntas", "Indexes and Aggregations: 30 preguntas", "Replication and Sharding: 30 preguntas", "Security and Backup: 30 preguntas"] },
        {
          title: "Qué NO cubre y a qué examen se refiere",
          items: [
            "El examen de referencia es MongoDB Associate Developer de MongoDB University; versión, duración, número de preguntas y pesos están en la página oficial, porque nuestras preguntas no están alineadas una a una con los objetivos oficiales.",
            "Las preguntas no están ligadas a una versión concreta del servidor ni a un lenguaje de driver, y no incluyen laboratorios prácticos.",
            "Para el código con un driver (por ejemplo Python o Node.js) hace falta practicar en una base real, como un clúster gratuito de Atlas.",
          ],
        },
        { title: "Requisitos", paragraphs: ["Ninguno formal. Ayudan la familiaridad con JSON y las bases de un lenguaje de programación. Contenido y referencias verificados el 04/10/2026."] },
      ],
    ),
    examReference: byLang(
      [{ text: "MongoDB Associate Developer — pagina ufficiale MongoDB University", url: "https://learn.mongodb.com/pages/certification-associate-developer" }],
      [{ text: "MongoDB Associate Developer — official MongoDB University page", url: "https://learn.mongodb.com/pages/certification-associate-developer" }],
      [{ text: "MongoDB Associate Developer — page officielle MongoDB University", url: "https://learn.mongodb.com/pages/certification-associate-developer" }],
      [{ text: "MongoDB Associate Developer — página oficial de MongoDB University", url: "https://learn.mongodb.com/pages/certification-associate-developer" }],
    ),
    faq: byLang(
      [
        { q: "Serve conoscere altri database?", a: "No, ma aiuta conoscere le basi dei database relazionali per confrontare i due modelli." },
        { q: "Devo saper programmare?", a: "Sì, almeno le basi di un linguaggio: le domande usano sintassi di query e documenti JSON." },
        { q: "L'esame MongoDB è ufficiale? CertifyQuiz è affiliato?", a: "L'esame Associate Developer è offerto da MongoDB University. CertifyQuiz è indipendente e non è affiliato a MongoDB." },
      ],
      [
        { q: "Do I need prior knowledge of other databases?", a: "No, but knowing relational basics helps you compare the two models." },
        { q: "Do I need to know how to code?", a: "Yes, at least the basics of a programming language: the questions use query syntax and JSON documents." },
        { q: "Is the MongoDB exam official? Is CertifyQuiz affiliated?", a: "The Associate Developer exam is offered by MongoDB University. CertifyQuiz is independent and not affiliated with MongoDB." },
      ],
      [
        { q: "Faut-il connaître d'autres bases de données ?", a: "Non, mais connaître les bases du relationnel aide à comparer les deux modèles." },
        { q: "Faut-il savoir programmer ?", a: "Oui, au moins les bases d'un langage : les questions utilisent la syntaxe des requêtes et des documents JSON." },
        { q: "L'examen MongoDB est-il officiel ? CertifyQuiz est-il affilié ?", a: "L'examen Associate Developer est proposé par MongoDB University. CertifyQuiz est indépendant et non affilié à MongoDB." },
      ],
      [
        { q: "¿Necesito conocer otras bases de datos?", a: "No, pero conocer las bases de lo relacional ayuda a comparar ambos modelos." },
        { q: "¿Necesito saber programar?", a: "Sí, al menos las bases de un lenguaje: las preguntas usan sintaxis de consultas y documentos JSON." },
        { q: "¿El examen de MongoDB es oficial? ¿CertifyQuiz está afiliado?", a: "El examen Associate Developer lo ofrece MongoDB University. CertifyQuiz es independiente y no está afiliado a MongoDB." },
      ],
    ),
  },
};

/* ------------------------------------------------------------- Oracle SQL */
// Catalogo: 3 argomenti x 30 = 90. Esame di riferimento 1Z0-071 (pagina Oracle: nessun dato di
// formato citato; fonti secondarie discordanti sul numero di domande -> si rimanda alla pagina Oracle).
const oracleSql: Override = {
  description: t(
    "90 domande di pratica in 3 argomenti su SQL per Oracle: fondamenti SQL, modellazione dei dati e gestione degli oggetti del database. Esame di riferimento: Oracle Database SQL (1Z0-071).",
    "90 practice questions in 3 topics on SQL for Oracle: SQL fundamentals, data modeling and database object management. Reference exam: Oracle Database SQL (1Z0-071).",
    "90 questions d'entraînement en 3 sujets sur le SQL pour Oracle : fondamentaux SQL, modélisation des données et gestion des objets de base de données. Examen de référence : Oracle Database SQL (1Z0-071).",
    "90 preguntas de práctica en 3 temas sobre SQL para Oracle: fundamentos de SQL, modelado de datos y gestión de objetos de la base de datos. Examen de referencia: Oracle Database SQL (1Z0-071).",
  ),
  metaTitle: t(
    "Oracle Database SQL 1Z0-071 – 90 Domande | CertifyQuiz",
    "Oracle Database SQL 1Z0-071 Practice Questions | CertifyQuiz",
    "Oracle Database SQL 1Z0-071 – 90 questions | CertifyQuiz",
    "Oracle Database SQL 1Z0-071 – 90 preguntas | CertifyQuiz",
  ),
  metaDescription: t(
    "90 domande di pratica su SQL per Oracle: fondamenti, modellazione dei dati e oggetti del database, con spiegazioni. Riferimento: esame 1Z0-071.",
    "90 practice questions on Oracle SQL: fundamentals, data modeling and database objects, with explanations. Reference: exam 1Z0-071.",
    "90 questions d'entraînement sur le SQL Oracle : fondamentaux, modélisation et objets de base de données, avec explications. Référence : examen 1Z0-071.",
    "90 preguntas de práctica sobre SQL de Oracle: fundamentos, modelado de datos y objetos de la base de datos, con explicaciones. Referencia: examen 1Z0-071.",
  ),
  extraContent: {
    learn: byLang(
      [
        "Scrivere query SELECT con filtri, ordinamenti, funzioni e join.",
        "Usare sottoquery e funzioni di gruppo per analizzare i dati.",
        "Creare e modificare tabelle, viste, indici e sequenze.",
        "Capire vincoli di integrità e concetti base di modellazione relazionale.",
      ],
      [
        "Write SELECT queries with filters, sorting, functions and joins.",
        "Use subqueries and group functions to analyze data.",
        "Create and alter tables, views, indexes and sequences.",
        "Understand integrity constraints and basic relational modeling concepts.",
      ],
      [
        "Écrire des requêtes SELECT avec filtres, tris, fonctions et jointures.",
        "Utiliser les sous-requêtes et les fonctions de groupe pour analyser les données.",
        "Créer et modifier des tables, vues, index et séquences.",
        "Comprendre les contraintes d'intégrité et les bases de la modélisation relationnelle.",
      ],
      [
        "Escribir consultas SELECT con filtros, ordenación, funciones y joins.",
        "Usar subconsultas y funciones de grupo para analizar datos.",
        "Crear y modificar tablas, vistas, índices y secuencias.",
        "Entender las restricciones de integridad y los conceptos básicos del modelado relacional.",
      ],
    ),
    guideSections: byLang<ReadonlyArray<GuideSection>>(
      [
        { title: "Cosa copre davvero questo quiz", items: ["SQL fundamentals: 30 domande", "Data modeling: 30 domande", "Database object management: 30 domande"] },
        {
          title: "Cosa NON copre",
          items: [
            "Non copre PL/SQL, l'amministrazione del database (DBA) né l'architettura Oracle: è un ripasso di SQL.",
            "Con 90 domande è un banco più ridotto dell'ambito completo dell'esame: le domande non sono mappate uno a uno sugli obiettivi ufficiali.",
            "Numero di domande, durata e punteggio minimo sono definiti da Oracle e possono cambiare: consulta la pagina ufficiale dell'esame.",
          ],
        },
        { title: "Prerequisiti", paragraphs: ["Nessuno formale. Conviene aver già scritto qualche query: per esercitarti su un database vero puoi usare un'istanza Oracle di prova. Contenuti e riferimenti controllati il 04/10/2026."] },
      ],
      [
        { title: "What this question bank actually covers", items: ["SQL fundamentals: 30 questions", "Data modeling: 30 questions", "Database object management: 30 questions"] },
        {
          title: "What it does NOT cover",
          items: [
            "It does not cover PL/SQL, database administration (DBA) or Oracle architecture: it is an SQL review.",
            "With 90 questions it is a smaller bank than the full exam scope: the questions are not mapped one-to-one to the official objectives.",
            "Number of questions, duration and passing score are set by Oracle and may change: check the official exam page.",
          ],
        },
        { title: "Prerequisites", paragraphs: ["None formally. It helps to have written a few queries already: to practice on a real database you can use a trial Oracle instance. Content and references checked on 2026-10-04."] },
      ],
      [
        { title: "Ce que couvre réellement ce quiz", items: ["SQL fundamentals : 30 questions", "Data modeling : 30 questions", "Database object management : 30 questions"] },
        {
          title: "Ce qu'il ne couvre PAS",
          items: [
            "Il ne couvre ni PL/SQL, ni l'administration de base de données (DBA), ni l'architecture Oracle : c'est une révision de SQL.",
            "Avec 90 questions, c'est une banque plus restreinte que le périmètre complet de l'examen : les questions ne sont pas alignées une à une sur les objectifs officiels.",
            "Le nombre de questions, la durée et la note de passage sont fixés par Oracle et peuvent changer : consultez la page officielle de l'examen.",
          ],
        },
        { title: "Prérequis", paragraphs: ["Aucun prérequis formel. Mieux vaut avoir déjà écrit quelques requêtes : pour pratiquer sur une vraie base, vous pouvez utiliser une instance Oracle d'essai. Contenu et références vérifiés le 04/10/2026."] },
      ],
      [
        { title: "Qué cubre realmente este cuestionario", items: ["SQL fundamentals: 30 preguntas", "Data modeling: 30 preguntas", "Database object management: 30 preguntas"] },
        {
          title: "Qué NO cubre",
          items: [
            "No cubre PL/SQL, la administración de bases de datos (DBA) ni la arquitectura de Oracle: es un repaso de SQL.",
            "Con 90 preguntas es un banco más reducido que el alcance completo del examen: las preguntas no están alineadas una a una con los objetivos oficiales.",
            "El número de preguntas, la duración y la nota de aprobado los fija Oracle y pueden cambiar: consulte la página oficial del examen.",
          ],
        },
        { title: "Requisitos", paragraphs: ["Ninguno formal. Conviene haber escrito ya algunas consultas: para practicar en una base real puede usar una instancia de prueba de Oracle. Contenido y referencias verificados el 04/10/2026."] },
      ],
    ),
    examReference: byLang(
      [{ text: "1Z0-071 — Oracle Database SQL (pagina ufficiale dell'esame)", url: "https://education.oracle.com/oracle-database-sql/pexam_1Z0-071" }],
      [{ text: "1Z0-071 — Oracle Database SQL (official exam page)", url: "https://education.oracle.com/oracle-database-sql/pexam_1Z0-071" }],
      [{ text: "1Z0-071 — Oracle Database SQL (page officielle de l'examen)", url: "https://education.oracle.com/oracle-database-sql/pexam_1Z0-071" }],
      [{ text: "1Z0-071 — Oracle Database SQL (página oficial del examen)", url: "https://education.oracle.com/oracle-database-sql/pexam_1Z0-071" }],
    ),
    faq: byLang(
      [
        { q: "È adatto a chi parte da zero?", a: "Meglio avere già scritto qualche query SELECT: le domande presuppongono le basi del linguaggio." },
        { q: "Serve una versione Oracle specifica?", a: "Le domande riguardano SQL standard e funzioni Oracle comuni e non sono legate a una versione precisa; per esercitarti usa una versione recente." },
        { q: "Dove trovo numero di domande, durata e punteggio minimo?", a: "Sulla pagina ufficiale Oracle dell'esame 1Z0-071: questi valori sono definiti da Oracle e possono cambiare." },
      ],
      [
        { q: "Is it suitable if I am starting from zero?", a: "Better to have written a few SELECT queries first: the questions assume the basics of the language." },
        { q: "Do I need a specific Oracle version?", a: "The questions cover standard SQL and common Oracle functions and are not tied to one version; for practice use a recent release." },
        { q: "Where do I find the number of questions, duration and passing score?", a: "On Oracle's official page for exam 1Z0-071: these values are defined by Oracle and may change." },
      ],
      [
        { q: "Est-ce adapté à quelqu'un qui part de zéro ?", a: "Mieux vaut avoir déjà écrit quelques requêtes SELECT : les questions supposent les bases du langage." },
        { q: "Faut-il une version Oracle précise ?", a: "Les questions portent sur le SQL standard et des fonctions Oracle courantes, sans version précise ; pour pratiquer, utilisez une version récente." },
        { q: "Où trouver le nombre de questions, la durée et la note de passage ?", a: "Sur la page officielle Oracle de l'examen 1Z0-071 : ces valeurs sont fixées par Oracle et peuvent changer." },
      ],
      [
        { q: "¿Sirve si parto de cero?", a: "Mejor haber escrito ya algunas consultas SELECT: las preguntas suponen las bases del lenguaje." },
        { q: "¿Necesito una versión concreta de Oracle?", a: "Las preguntas tratan SQL estándar y funciones comunes de Oracle, sin una versión concreta; para practicar use una versión reciente." },
        { q: "¿Dónde encuentro el número de preguntas, la duración y la nota de aprobado?", a: "En la página oficial de Oracle del examen 1Z0-071: Oracle define estos valores y pueden cambiar." },
      ],
    ),
  },
};

/* -------------------------------------------------------------- VMware VCP */
// Catalogo: 6 argomenti x 30 = 180, tutti vSphere. Le vecchie tracce VCP-NV/CMA/DTM/SEC non sono
// coperte e Broadcom ha riorganizzato il programma VCP (documento dei percorsi, verificato).
const vmware: Override = {
  title: t("VMware vSphere (percorso VCP)", "VMware vSphere (VCP path)", "VMware vSphere (parcours VCP)", "VMware vSphere (ruta VCP)"),
  description: t(
    "180 domande di pratica in 6 argomenti sull'amministrazione di VMware vSphere: infrastruttura, storage, reti virtuali, gestione delle VM, backup e ripristino, prestazioni. Non mappato su un codice d'esame VCP specifico.",
    "180 practice questions in 6 topics on VMware vSphere administration: infrastructure, storage, virtual networking, VM management, backup and recovery, performance. Not mapped to a specific VCP exam code.",
    "180 questions d'entraînement en 6 sujets sur l'administration de VMware vSphere : infrastructure, stockage, réseaux virtuels, gestion des VM, sauvegarde et restauration, performances. Non aligné sur un code d'examen VCP précis.",
    "180 preguntas de práctica en 6 temas sobre la administración de VMware vSphere: infraestructura, almacenamiento, redes virtuales, gestión de VM, copia de seguridad y recuperación, rendimiento. No alineado con un código de examen VCP concreto.",
  ),
  metaTitle: t(
    "VMware vSphere VCP – 180 Domande | CertifyQuiz",
    "VMware vSphere (VCP path) – 180 Practice Questions | CertifyQuiz",
    "VMware vSphere (VCP) – 180 questions | CertifyQuiz",
    "VMware vSphere (VCP) – 180 preguntas | CertifyQuiz",
  ),
  metaDescription: t(
    "180 domande su ESXi, vCenter, storage, reti virtuali, gestione VM, backup e prestazioni in vSphere, con spiegazioni. Non mappato su un esame VCP specifico.",
    "180 questions on ESXi, vCenter, storage, virtual networking, VM management, backup and performance in vSphere, with explanations. Not mapped to one VCP exam.",
    "180 questions sur ESXi, vCenter, le stockage, les réseaux virtuels, la gestion des VM, la sauvegarde et les performances dans vSphere, avec explications.",
    "180 preguntas sobre ESXi, vCenter, almacenamiento, redes virtuales, gestión de VM, copias de seguridad y rendimiento en vSphere, con explicaciones.",
  ),
  extraContent: {
    learn: byLang(
      [
        "Architettura di vSphere: host ESXi, vCenter, cluster e risorse.",
        "Storage in vSphere: datastore e criteri di storage.",
        "Reti virtuali: switch standard e distribuiti, port group.",
        "Creazione e gestione delle macchine virtuali, snapshot e modelli.",
        "Backup, ripristino e ottimizzazione delle prestazioni.",
      ],
      [
        "vSphere architecture: ESXi hosts, vCenter, clusters and resources.",
        "Storage in vSphere: datastores and storage policies.",
        "Virtual networking: standard and distributed switches, port groups.",
        "Creating and managing virtual machines, snapshots and templates.",
        "Backup, recovery and performance optimization.",
      ],
      [
        "Architecture vSphere : hôtes ESXi, vCenter, clusters et ressources.",
        "Stockage dans vSphere : datastores et stratégies de stockage.",
        "Réseaux virtuels : commutateurs standard et distribués, groupes de ports.",
        "Création et gestion des machines virtuelles, instantanés et modèles.",
        "Sauvegarde, restauration et optimisation des performances.",
      ],
      [
        "Arquitectura de vSphere: hosts ESXi, vCenter, clústeres y recursos.",
        "Almacenamiento en vSphere: datastores y políticas de almacenamiento.",
        "Redes virtuales: conmutadores estándar y distribuidos, grupos de puertos.",
        "Creación y gestión de máquinas virtuales, instantáneas y plantillas.",
        "Copia de seguridad, recuperación y optimización del rendimiento.",
      ],
    ),
    guideSections: byLang<ReadonlyArray<GuideSection>>(
      [
        { title: "Cosa copre davvero questo quiz", items: ["vSphere Infrastructure: 30 domande", "Storage Solutions in vSphere: 30 domande", "Virtual Networks in vSphere: 30 domande", "Virtual Machines Management: 30 domande", "Backup and Recovery Strategies: 30 domande", "Performance Optimization in vSphere: 30 domande"] },
        {
          title: "Cosa NON copre e a quale esame si riferisce",
          items: [
            "Copre solo l'amministrazione di vSphere. Non copre NSX (virtualizzazione di rete), Horizon, la gestione cloud, la sicurezza né le architetture VMware Cloud Foundation.",
            "Broadcom ha riorganizzato il programma VCP in percorsi basati su VMware Cloud Foundation e vSphere Foundation (vedi il documento ufficiale dei percorsi): le nostre domande non sono state mappate sugli obiettivi di quei singoli esami, quindi non vanno lette come preparazione a un codice d'esame preciso.",
            "Non include laboratori pratici.",
          ],
        },
        { title: "Prerequisiti", paragraphs: ["Per rispondere bene a domande su storage, reti e risoluzione dei problemi serve esperienza pratica: il modo più efficace è un laboratorio con un host ESXi e vCenter. Contenuti e riferimenti controllati il 04/10/2026."] },
      ],
      [
        { title: "What this question bank actually covers", items: ["vSphere Infrastructure: 30 questions", "Storage Solutions in vSphere: 30 questions", "Virtual Networks in vSphere: 30 questions", "Virtual Machines Management: 30 questions", "Backup and Recovery Strategies: 30 questions", "Performance Optimization in vSphere: 30 questions"] },
        {
          title: "What it does NOT cover, and which exam it refers to",
          items: [
            "It covers vSphere administration only. It does not cover NSX (network virtualization), Horizon, cloud management, security or VMware Cloud Foundation architectures.",
            "Broadcom has reorganized the VCP program into paths built on VMware Cloud Foundation and vSphere Foundation (see the official certification paths document): our questions have not been mapped to the objectives of those individual exams, so do not read them as preparation for one specific exam code.",
            "It does not include hands-on labs.",
          ],
        },
        { title: "Prerequisites", paragraphs: ["Questions on storage, networking and troubleshooting need hands-on experience: the most effective way is a lab with an ESXi host and vCenter. Content and references checked on 2026-10-04."] },
      ],
      [
        { title: "Ce que couvre réellement ce quiz", items: ["vSphere Infrastructure : 30 questions", "Storage Solutions in vSphere : 30 questions", "Virtual Networks in vSphere : 30 questions", "Virtual Machines Management : 30 questions", "Backup and Recovery Strategies : 30 questions", "Performance Optimization in vSphere : 30 questions"] },
        {
          title: "Ce qu'il ne couvre PAS et l'examen visé",
          items: [
            "Il ne couvre que l'administration de vSphere. Il ne couvre ni NSX (virtualisation réseau), ni Horizon, ni la gestion du cloud, ni la sécurité, ni les architectures VMware Cloud Foundation.",
            "Broadcom a réorganisé le programme VCP en parcours fondés sur VMware Cloud Foundation et vSphere Foundation (voir le document officiel des parcours) : nos questions n'ont pas été alignées sur les objectifs de ces examens, il ne faut donc pas les lire comme une préparation à un code d'examen précis.",
            "Il ne comprend pas de laboratoires pratiques.",
          ],
        },
        { title: "Prérequis", paragraphs: ["Les questions sur le stockage, le réseau et le dépannage demandent de l'expérience pratique : le plus efficace est un laboratoire avec un hôte ESXi et vCenter. Contenu et références vérifiés le 04/10/2026."] },
      ],
      [
        { title: "Qué cubre realmente este cuestionario", items: ["vSphere Infrastructure: 30 preguntas", "Storage Solutions in vSphere: 30 preguntas", "Virtual Networks in vSphere: 30 preguntas", "Virtual Machines Management: 30 preguntas", "Backup and Recovery Strategies: 30 preguntas", "Performance Optimization in vSphere: 30 preguntas"] },
        {
          title: "Qué NO cubre y a qué examen se refiere",
          items: [
            "Solo cubre la administración de vSphere. No cubre NSX (virtualización de red), Horizon, gestión de la nube, seguridad ni arquitecturas de VMware Cloud Foundation.",
            "Broadcom ha reorganizado el programa VCP en rutas basadas en VMware Cloud Foundation y vSphere Foundation (véase el documento oficial de rutas): nuestras preguntas no se han alineado con los objetivos de esos exámenes, así que no deben leerse como preparación para un código de examen concreto.",
            "No incluye laboratorios prácticos.",
          ],
        },
        { title: "Requisitos", paragraphs: ["Las preguntas sobre almacenamiento, redes y resolución de problemas requieren experiencia práctica: lo más eficaz es un laboratorio con un host ESXi y vCenter. Contenido y referencias verificados el 04/10/2026."] },
      ],
    ),
    examReference: byLang(
      [{ text: "Percorsi di certificazione VMware (Broadcom)", url: "https://docs.broadcom.com/doc/vmw-certification-paths" }],
      [{ text: "VMware certification paths (Broadcom)", url: "https://docs.broadcom.com/doc/vmw-certification-paths" }],
      [{ text: "Parcours de certification VMware (Broadcom)", url: "https://docs.broadcom.com/doc/vmw-certification-paths" }],
      [{ text: "Rutas de certificación de VMware (Broadcom)", url: "https://docs.broadcom.com/doc/vmw-certification-paths" }],
    ),
    faq: byLang(
      [
        { q: "Il quiz prepara a un esame VCP preciso?", a: "No: copre le competenze di amministrazione vSphere ma non è mappato su un codice d'esame. Per i percorsi attuali consulta il documento ufficiale Broadcom." },
        { q: "Serve esperienza pratica?", a: "Sì, per le domande su storage, reti e troubleshooting è molto utile avere un laboratorio con ESXi e vCenter." },
        { q: "Copre NSX, Horizon o VMware Cloud Foundation?", a: "No. Gli argomenti sono solo quelli di vSphere elencati sopra." },
      ],
      [
        { q: "Does the quiz prepare for one specific VCP exam?", a: "No: it covers vSphere administration skills but is not mapped to an exam code. For the current paths see Broadcom's official document." },
        { q: "Is hands-on experience needed?", a: "Yes, for the storage, networking and troubleshooting questions a lab with ESXi and vCenter is very helpful." },
        { q: "Does it cover NSX, Horizon or VMware Cloud Foundation?", a: "No. The topics are only the vSphere ones listed above." },
      ],
      [
        { q: "Le quiz prépare-t-il à un examen VCP précis ?", a: "Non : il couvre l'administration de vSphere mais n'est pas aligné sur un code d'examen. Pour les parcours actuels, consultez le document officiel de Broadcom." },
        { q: "Faut-il de l'expérience pratique ?", a: "Oui, pour les questions de stockage, de réseau et de dépannage, un laboratoire avec ESXi et vCenter est très utile." },
        { q: "Couvre-t-il NSX, Horizon ou VMware Cloud Foundation ?", a: "Non. Les sujets sont uniquement ceux de vSphere listés ci-dessus." },
      ],
      [
        { q: "¿El cuestionario prepara para un examen VCP concreto?", a: "No: cubre competencias de administración de vSphere pero no está alineado con un código de examen. Para las rutas actuales consulte el documento oficial de Broadcom." },
        { q: "¿Hace falta experiencia práctica?", a: "Sí, para las preguntas de almacenamiento, redes y resolución de problemas es muy útil un laboratorio con ESXi y vCenter." },
        { q: "¿Cubre NSX, Horizon o VMware Cloud Foundation?", a: "No. Los temas son solo los de vSphere indicados arriba." },
      ],
    ),
  },
};

/* ------------------------------------------------------------------- JNCIE */
// Catalogo: EN 120 domande (4 argomenti), IT 150 (5 argomenti, incl. Advanced Troubleshooting), FR/ES 0.
// Fonte: pagina Juniper JNCIE-ENT (learningportal.juniper.net, verificata 2026-10-04): esame pratico
// in laboratorio di 6 ore, codice JPR-946, richiede JNCIP-ENT.
const jncie: Override = {
  description: t(
    "150 domande a scelta multipla in 5 argomenti (routing avanzato, switching, sicurezza, MPLS e VPN, troubleshooting) per ripassare la teoria. Non simulano il laboratorio pratico JNCIE.",
    "120 multiple-choice questions in 4 topics (advanced routing, switching, security, MPLS and VPN) to review the theory. They do not simulate the hands-on JNCIE lab exam.",
    "Quiz à choix multiple pour réviser la théorie JNCIE (routage avancé, commutation, sécurité, MPLS et VPN). Ils ne simulent pas l'examen pratique en laboratoire. Il n'existe pas encore de questions en français.",
    "Cuestionarios de opción múltiple para repasar la teoría de JNCIE (enrutamiento avanzado, conmutación, seguridad, MPLS y VPN). No simulan el examen práctico de laboratorio. Aún no existen preguntas en español.",
  ),
  metaTitle: t(
    "JNCIE Quiz Teorici – Routing, MPLS, Sicurezza | CertifyQuiz",
    "JNCIE Theory Practice Questions – Not a Lab | CertifyQuiz",
    "JNCIE – Questions de théorie Juniper | CertifyQuiz",
    "JNCIE – Preguntas de teoría de Juniper | CertifyQuiz",
  ),
  metaDescription: t(
    "150 domande di teoria Juniper su routing avanzato, switching, sicurezza, MPLS/VPN e troubleshooting. Non sostituiscono il laboratorio JNCIE.",
    "120 Juniper theory questions on advanced routing, switching, security and MPLS/VPN. They do not replace the JNCIE hands-on lab.",
    "Questions de théorie Juniper sur le routage avancé, la commutation, la sécurité et MPLS/VPN. Elles ne remplacent pas le laboratoire JNCIE.",
    "Preguntas de teoría de Juniper sobre enrutamiento avanzado, conmutación, seguridad y MPLS/VPN. No sustituyen el laboratorio JNCIE.",
  ),
  extraContent: {
    learn: byLang(
      [
        "Ripasso teorico del routing avanzato su reti Juniper.",
        "Switching e VLAN.",
        "Concetti di sicurezza di rete e policy.",
        "Servizi MPLS e VPN.",
        "Troubleshooting avanzato (solo in italiano).",
      ],
      [
        "Theory review of advanced routing on Juniper networks.",
        "Switching and VLANs.",
        "Network security and policy concepts.",
        "MPLS and VPN services.",
      ],
      [
        "Révision théorique du routage avancé sur les réseaux Juniper.",
        "Commutation et VLAN.",
        "Notions de sécurité réseau et de politiques.",
        "Services MPLS et VPN.",
      ],
      [
        "Repaso teórico del enrutamiento avanzado en redes Juniper.",
        "Conmutación y VLAN.",
        "Conceptos de seguridad de red y políticas.",
        "Servicios MPLS y VPN.",
      ],
    ),
    guideSections: byLang<ReadonlyArray<GuideSection>>(
      [
        { title: "Cosa copre davvero questo quiz", items: ["Advanced Routing, Switching and VLAN, Network Security, MPLS and VPN Services: 30 domande ciascuno", "Advanced Troubleshooting: 30 domande, disponibili solo in italiano", "Totale: 150 domande in italiano, 120 in inglese. Per il francese e lo spagnolo non esistono ancora domande JNCIE"] },
        {
          title: "Cosa NON è: JNCIE è un esame pratico",
          items: [
            "Gli esami JNCIE sono prove pratiche in laboratorio. Per JNCIE-ENT, Juniper indica una prova di 6 ore (codice JPR-946) con prerequisito JNCIP-ENT.",
            "Domande a scelta multipla non possono simulare la configurazione di una rete reale: servono a ripassare i concetti, non a sostituire la pratica su dispositivi Junos reali o virtuali.",
            "Le domande non sono mappate sugli obiettivi di un singolo percorso (SP, ENT, SEC, DC).",
          ],
        },
        { title: "Prerequisiti e fonti", paragraphs: ["Juniper richiede la certificazione JNCIP del relativo percorso prima del laboratorio JNCIE (verificato per ENT il 04/10/2026). Le pagine ufficiali dei quattro percorsi sono linkate sotto."] },
      ],
      [
        { title: "What this question bank actually covers", items: ["Advanced Routing, Switching and VLAN, Network Security, MPLS and VPN Services: 30 questions each", "Advanced Troubleshooting: 30 questions, available in Italian only", "Total: 120 questions in English, 150 in Italian. No French or Spanish JNCIE questions exist yet"] },
        {
          title: "What it is NOT: JNCIE is a hands-on lab exam",
          items: [
            "JNCIE exams are hands-on lab exams. For JNCIE-ENT, Juniper lists a 6-hour lab (exam code JPR-946) with JNCIP-ENT as a prerequisite.",
            "Multiple-choice questions cannot simulate configuring a live network: use them to review concepts, not as a replacement for practice on real or virtual Junos devices.",
            "The questions are not mapped to the objectives of a single track (SP, ENT, SEC, DC).",
          ],
        },
        { title: "Prerequisites and sources", paragraphs: ["Juniper requires the JNCIP certification of the same track before the JNCIE lab (checked for ENT on 2026-10-04). The official pages of the four tracks are linked below."] },
      ],
      [
        { title: "Ce que couvre réellement ce quiz", items: ["Advanced Routing, Switching and VLAN, Network Security, MPLS and VPN Services : 30 questions chacun", "Advanced Troubleshooting : 30 questions, disponibles uniquement en italien", "Total : 120 questions en anglais, 150 en italien. Il n'existe pas encore de questions JNCIE en français ni en espagnol"] },
        {
          title: "Ce que ce n'est PAS : JNCIE est un examen pratique",
          items: [
            "Les examens JNCIE sont des épreuves pratiques en laboratoire. Pour JNCIE-ENT, Juniper indique une épreuve de 6 heures (code JPR-946) avec JNCIP-ENT comme prérequis.",
            "Des questions à choix multiple ne peuvent pas simuler la configuration d'un réseau réel : elles servent à réviser les concepts, pas à remplacer la pratique sur des équipements Junos réels ou virtuels.",
            "Les questions ne sont pas alignées sur les objectifs d'un seul parcours (SP, ENT, SEC, DC).",
          ],
        },
        { title: "Prérequis et sources", paragraphs: ["Juniper exige la certification JNCIP du même parcours avant le laboratoire JNCIE (vérifié pour ENT le 04/10/2026). Les pages officielles des quatre parcours sont liées ci-dessous."] },
      ],
      [
        { title: "Qué cubre realmente este cuestionario", items: ["Advanced Routing, Switching and VLAN, Network Security, MPLS and VPN Services: 30 preguntas cada uno", "Advanced Troubleshooting: 30 preguntas, solo disponibles en italiano", "Total: 120 preguntas en inglés, 150 en italiano. Aún no existen preguntas JNCIE en francés ni en español"] },
        {
          title: "Qué NO es: JNCIE es un examen práctico",
          items: [
            "Los exámenes JNCIE son pruebas prácticas de laboratorio. Para JNCIE-ENT, Juniper indica un laboratorio de 6 horas (código JPR-946) con JNCIP-ENT como requisito.",
            "Las preguntas de opción múltiple no pueden simular la configuración de una red real: sirven para repasar conceptos, no para sustituir la práctica con dispositivos Junos reales o virtuales.",
            "Las preguntas no están alineadas con los objetivos de una sola ruta (SP, ENT, SEC, DC).",
          ],
        },
        { title: "Requisitos y fuentes", paragraphs: ["Juniper exige la certificación JNCIP de la misma ruta antes del laboratorio JNCIE (verificado para ENT el 04/10/2026). Las páginas oficiales de las cuatro rutas se enlazan abajo."] },
      ],
    ),
    examReference: byLang(
      [
        { text: "JNCIE-SP — Service Provider (esame pratico)", url: "https://www.juniper.net/us/en/training/certification/tracks/service-provider-routing-switching/jncie-sp.html" },
        { text: "JNCIE-ENT — Enterprise (esame pratico, JPR-946)", url: "https://www.juniper.net/us/en/training/certification/tracks/enterprise-routing-switching/jncie-ent.html" },
        { text: "JNCIE-SEC — Security (esame pratico)", url: "https://www.juniper.net/us/en/training/certification/tracks/security/jncie-sec.html" },
        { text: "JNCIE-DC — Data Center (esame pratico)", url: "https://www.juniper.net/us/en/training/certification/tracks/data-center/jncie-dc.html" },
      ],
      [
        { text: "JNCIE-SP — Service Provider (lab exam)", url: "https://www.juniper.net/us/en/training/certification/tracks/service-provider-routing-switching/jncie-sp.html" },
        { text: "JNCIE-ENT — Enterprise (lab exam, JPR-946)", url: "https://www.juniper.net/us/en/training/certification/tracks/enterprise-routing-switching/jncie-ent.html" },
        { text: "JNCIE-SEC — Security (lab exam)", url: "https://www.juniper.net/us/en/training/certification/tracks/security/jncie-sec.html" },
        { text: "JNCIE-DC — Data Center (lab exam)", url: "https://www.juniper.net/us/en/training/certification/tracks/data-center/jncie-dc.html" },
      ],
      [
        { text: "JNCIE-SP — Service Provider (examen pratique)", url: "https://www.juniper.net/us/en/training/certification/tracks/service-provider-routing-switching/jncie-sp.html" },
        { text: "JNCIE-ENT — Enterprise (examen pratique, JPR-946)", url: "https://www.juniper.net/us/en/training/certification/tracks/enterprise-routing-switching/jncie-ent.html" },
        { text: "JNCIE-SEC — Security (examen pratique)", url: "https://www.juniper.net/us/en/training/certification/tracks/security/jncie-sec.html" },
        { text: "JNCIE-DC — Data Center (examen pratique)", url: "https://www.juniper.net/us/en/training/certification/tracks/data-center/jncie-dc.html" },
      ],
      [
        { text: "JNCIE-SP — Service Provider (examen práctico)", url: "https://www.juniper.net/us/en/training/certification/tracks/service-provider-routing-switching/jncie-sp.html" },
        { text: "JNCIE-ENT — Enterprise (examen práctico, JPR-946)", url: "https://www.juniper.net/us/en/training/certification/tracks/enterprise-routing-switching/jncie-ent.html" },
        { text: "JNCIE-SEC — Security (examen práctico)", url: "https://www.juniper.net/us/en/training/certification/tracks/security/jncie-sec.html" },
        { text: "JNCIE-DC — Data Center (examen práctico)", url: "https://www.juniper.net/us/en/training/certification/tracks/data-center/jncie-dc.html" },
      ],
    ),
    faq: byLang(
      [
        { q: "Questi quiz simulano l'esame JNCIE?", a: "No. JNCIE è un esame pratico in laboratorio; qui trovi domande teoriche a scelta multipla utili per ripassare i concetti." },
        { q: "Serve un corso ufficiale Juniper?", a: "Non lo richiediamo noi; Juniper indica corsi e un bundle di autoformazione per il percorso ENT e richiede JNCIP-ENT come prerequisito del laboratorio." },
        { q: "Perché in francese e spagnolo non ci sono quiz?", a: "Le domande esistono per ora solo in italiano e inglese; non esistono ancora versioni in francese e in spagnolo." },
      ],
      [
        { q: "Do these quizzes simulate the JNCIE exam?", a: "No. JNCIE is a hands-on lab exam; here you get multiple-choice theory questions that are useful to review concepts." },
        { q: "Do I need an official Juniper course?", a: "We do not require it; Juniper lists training courses and a self-study bundle for the ENT track and requires JNCIP-ENT as a prerequisite to the lab." },
        { q: "Why are there no quizzes in French and Spanish?", a: "The questions currently exist only in Italian and English; no French or Spanish versions exist yet." },
      ],
      [
        { q: "Ces quiz simulent-ils l'examen JNCIE ?", a: "Non. JNCIE est un examen pratique en laboratoire ; vous trouvez ici des questions théoriques à choix multiple utiles pour réviser les concepts." },
        { q: "Faut-il suivre une formation Juniper officielle ?", a: "Nous ne l'exigeons pas ; Juniper propose des formations et un pack d'auto-formation pour le parcours ENT et exige JNCIP-ENT comme prérequis du laboratoire." },
        { q: "Pourquoi n'y a-t-il pas de quiz en français et en espagnol ?", a: "Les questions n'existent pour l'instant qu'en italien et en anglais ; il n'existe pas encore de versions en français ni en espagnol." },
      ],
      [
        { q: "¿Estos cuestionarios simulan el examen JNCIE?", a: "No. JNCIE es un examen práctico de laboratorio; aquí hay preguntas teóricas de opción múltiple útiles para repasar conceptos." },
        { q: "¿Hace falta un curso oficial de Juniper?", a: "No lo exigimos nosotros; Juniper ofrece cursos y un paquete de autoestudio para la ruta ENT y exige JNCIP-ENT como requisito del laboratorio." },
        { q: "¿Por qué no hay cuestionarios en francés y español?", a: "Las preguntas existen por ahora solo en italiano e inglés; aún no existen versiones en francés ni en español." },
      ],
    ),
  },
};

/* -------------------------------------------------------------- JavaScript */
// Catalogo: 6 argomenti, 177 domande (5 x 30 + 27). Non esiste un esame unico: percorso di pratica.
const javascript: Override = {
  title: t("JavaScript — percorso di pratica", "JavaScript — practice path", "JavaScript — parcours d'entraînement", "JavaScript — ruta de práctica"),
  level: t("Base", "Beginner", "Débutant", "Básico"),
  description: t(
    "177 domande di pratica in 6 argomenti sul linguaggio JavaScript: tipi e variabili, oggetti e funzioni, browser ed eventi, debug, programmazione asincrona, test e deploy. Non prepara a un singolo esame di certificazione.",
    "177 practice questions in 6 topics on the JavaScript language: types and variables, objects and functions, browser and events, debugging, asynchronous programming, testing and deployment. It does not prepare for a single certification exam.",
    "177 questions d'entraînement en 6 sujets sur le langage JavaScript : types et variables, objets et fonctions, navigateur et événements, débogage, programmation asynchrone, tests et déploiement. Ne prépare pas à un examen de certification unique.",
    "177 preguntas de práctica en 6 temas sobre el lenguaje JavaScript: tipos y variables, objetos y funciones, navegador y eventos, depuración, programación asíncrona, pruebas y despliegue. No prepara para un único examen de certificación.",
  ),
  metaTitle: t(
    "JavaScript Quiz – 177 Domande di Pratica | CertifyQuiz",
    "JavaScript Practice Questions – 177 Quiz | CertifyQuiz",
    "JavaScript – 177 questions d'entraînement | CertifyQuiz",
    "JavaScript – 177 preguntas de práctica | CertifyQuiz",
  ),
  metaDescription: t(
    "177 domande su JavaScript: tipi, oggetti e funzioni, DOM ed eventi, debug, async e test, con spiegazioni. Percorso di pratica, non un singolo esame.",
    "177 JavaScript questions: types, objects and functions, DOM and events, debugging, async and testing, with explanations. A practice path, not a single exam.",
    "177 questions sur JavaScript : types, objets et fonctions, DOM et événements, débogage, async et tests, avec explications. Un parcours d'entraînement, pas un examen unique.",
    "177 preguntas sobre JavaScript: tipos, objetos y funciones, DOM y eventos, depuración, async y pruebas, con explicaciones. Una ruta de práctica, no un único examen.",
  ),
  extraContent: {
    topicsHeading: t("Argomenti del percorso", "Practice path topics", "Sujets du parcours", "Temas de la ruta"),
    examReferenceHeading: t("Programmi di certificazione indipendenti", "Independent certification programs", "Programmes de certification indépendants", "Programas de certificación independientes"),
    learn: byLang(
      [
        "Tipi di dato, variabili, operatori e conversioni di tipo.",
        "Oggetti, array e funzioni (closure, scope, this).",
        "DOM ed eventi nel browser.",
        "Debug e gestione degli errori.",
        "Programmazione asincrona: callback, Promise, async/await.",
        "Test e basi del deploy di applicazioni JavaScript.",
      ],
      [
        "Data types, variables, operators and type conversion.",
        "Objects, arrays and functions (closures, scope, this).",
        "DOM and events in the browser.",
        "Debugging and error handling.",
        "Asynchronous programming: callbacks, Promises, async/await.",
        "Testing and deployment basics for JavaScript applications.",
      ],
      [
        "Types de données, variables, opérateurs et conversions de type.",
        "Objets, tableaux et fonctions (fermetures, portée, this).",
        "DOM et événements dans le navigateur.",
        "Débogage et gestion des erreurs.",
        "Programmation asynchrone : callbacks, Promises, async/await.",
        "Tests et bases du déploiement d'applications JavaScript.",
      ],
      [
        "Tipos de datos, variables, operadores y conversiones de tipo.",
        "Objetos, arrays y funciones (closures, ámbito, this).",
        "DOM y eventos en el navegador.",
        "Depuración y gestión de errores.",
        "Programación asíncrona: callbacks, Promises, async/await.",
        "Pruebas y bases del despliegue de aplicaciones JavaScript.",
      ],
    ),
    guideSections: byLang<ReadonlyArray<GuideSection>>(
      [
        { title: "Cosa copre davvero questo percorso", items: ["Variables and Types in JavaScript: 30 domande", "Objects and Functions in JavaScript: 27 domande", "Browser and Events: 30 domande", "Debugging and Error Handling: 30 domande", "Asynchronous Programming in JavaScript: 30 domande", "Testing and Deployment in JavaScript: 30 domande"] },
        {
          title: "Perché non è la preparazione a un esame unico",
          items: [
            "JavaScript non ha una certificazione unica di un singolo produttore. Esistono programmi indipendenti, ad esempio gli esami JSE e JSA di OpenEDG JS Institute e il certificato di W3Schools, elencati sotto.",
            "Queste domande non sono state mappate sul programma di nessuno di quegli esami: usale per esercitarti sul linguaggio, non come preparazione a un codice d'esame preciso. Gli argomenti su browser, asincronia e test vanno oltre il nucleo del linguaggio.",
            "Non include esercizi di scrittura di codice né progetti.",
          ],
        },
        { title: "Prerequisiti", paragraphs: ["Nessuno formale. Qualche nozione di HTML aiuta negli argomenti su browser ed eventi. Contenuti e riferimenti controllati il 04/10/2026."] },
      ],
      [
        { title: "What this practice path actually covers", items: ["Variables and Types in JavaScript: 30 questions", "Objects and Functions in JavaScript: 27 questions", "Browser and Events: 30 questions", "Debugging and Error Handling: 30 questions", "Asynchronous Programming in JavaScript: 30 questions", "Testing and Deployment in JavaScript: 30 questions"] },
        {
          title: "Why it is not preparation for a single exam",
          items: [
            "JavaScript has no single vendor-owned certification. Independent programs exist, such as the OpenEDG JS Institute JSE and JSA exams and the W3Schools certificate, listed below.",
            "These questions have not been mapped to the syllabus of any of those exams: use them to practice the language, not as preparation for one specific exam code. The browser, asynchrony and testing topics go beyond the core language.",
            "It does not include coding exercises or projects.",
          ],
        },
        { title: "Prerequisites", paragraphs: ["None formally. A little HTML helps with the browser and events topics. Content and references checked on 2026-10-04."] },
      ],
      [
        { title: "Ce que couvre réellement ce parcours", items: ["Variables and Types in JavaScript : 30 questions", "Objects and Functions in JavaScript : 27 questions", "Browser and Events : 30 questions", "Debugging and Error Handling : 30 questions", "Asynchronous Programming in JavaScript : 30 questions", "Testing and Deployment in JavaScript : 30 questions"] },
        {
          title: "Pourquoi ce n'est pas la préparation à un examen unique",
          items: [
            "JavaScript n'a pas de certification unique d'un éditeur. Des programmes indépendants existent, comme les examens JSE et JSA d'OpenEDG JS Institute et le certificat W3Schools, listés ci-dessous.",
            "Ces questions n'ont pas été alignées sur le programme de ces examens : utilisez-les pour pratiquer le langage, pas comme préparation à un code d'examen précis. Les sujets sur le navigateur, l'asynchronie et les tests vont au-delà du cœur du langage.",
            "Il ne comprend pas d'exercices de code ni de projets.",
          ],
        },
        { title: "Prérequis", paragraphs: ["Aucun prérequis formel. Quelques notions de HTML aident pour les sujets sur le navigateur et les événements. Contenu et références vérifiés le 04/10/2026."] },
      ],
      [
        { title: "Qué cubre realmente esta ruta", items: ["Variables and Types in JavaScript: 30 preguntas", "Objects and Functions in JavaScript: 27 preguntas", "Browser and Events: 30 preguntas", "Debugging and Error Handling: 30 preguntas", "Asynchronous Programming in JavaScript: 30 preguntas", "Testing and Deployment in JavaScript: 30 preguntas"] },
        {
          title: "Por qué no es la preparación para un único examen",
          items: [
            "JavaScript no tiene una certificación única de un fabricante. Existen programas independientes, como los exámenes JSE y JSA de OpenEDG JS Institute y el certificado de W3Schools, que se listan abajo.",
            "Estas preguntas no se han alineado con el programa de ninguno de esos exámenes: úselas para practicar el lenguaje, no como preparación para un código de examen concreto. Los temas de navegador, asincronía y pruebas van más allá del núcleo del lenguaje.",
            "No incluye ejercicios de código ni proyectos.",
          ],
        },
        { title: "Requisitos", paragraphs: ["Ninguno formal. Algo de HTML ayuda en los temas de navegador y eventos. Contenido y referencias verificados el 04/10/2026."] },
      ],
    ),
    examReference: byLang(
      [
        { text: "OpenEDG JS Institute — percorsi JSE e JSA", url: "https://js.institute/certification-tracks" },
        { text: "W3Schools — certificato JavaScript", url: "https://www.w3schools.com/js/js_exam.asp" },
        { text: "MDN — documentazione JavaScript", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
      ],
      [
        { text: "OpenEDG JS Institute — JSE and JSA tracks", url: "https://js.institute/certification-tracks" },
        { text: "W3Schools — JavaScript certificate", url: "https://www.w3schools.com/js/js_exam.asp" },
        { text: "MDN — JavaScript documentation", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
      ],
      [
        { text: "OpenEDG JS Institute — parcours JSE et JSA", url: "https://js.institute/certification-tracks" },
        { text: "W3Schools — certificat JavaScript", url: "https://www.w3schools.com/js/js_exam.asp" },
        { text: "MDN — documentation JavaScript", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
      ],
      [
        { text: "OpenEDG JS Institute — rutas JSE y JSA", url: "https://js.institute/certification-tracks" },
        { text: "W3Schools — certificado de JavaScript", url: "https://www.w3schools.com/js/js_exam.asp" },
        { text: "MDN — documentación de JavaScript", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
      ],
    ),
    faq: byLang(
      [
        { q: "Esiste una certificazione ufficiale JavaScript?", a: "Non una unica di un singolo produttore. Esistono programmi indipendenti (OpenEDG JSE/JSA, W3Schools); questa pagina è un percorso di pratica sul linguaggio." },
        { q: "Questo quiz prepara a JSE o JSA?", a: "Non è mappato sul loro programma: puoi usarlo per esercitarti sul linguaggio, ma verifica i contenuti degli esami sul sito di OpenEDG." },
        { q: "Devo conoscere HTML e CSS prima?", a: "Non è obbligatorio; qualche nozione di HTML è utile per gli argomenti su browser ed eventi." },
      ],
      [
        { q: "Is there an official JavaScript certification?", a: "Not a single one from one vendor. Independent programs exist (OpenEDG JSE/JSA, W3Schools); this page is a practice path on the language." },
        { q: "Does this quiz prepare for JSE or JSA?", a: "It is not mapped to their syllabus: you can use it to practice the language, but check the exam contents on the OpenEDG site." },
        { q: "Do I need HTML and CSS first?", a: "Not mandatory; a little HTML helps with the browser and events topics." },
      ],
      [
        { q: "Existe-t-il une certification JavaScript officielle ?", a: "Pas une seule, d'un seul éditeur. Des programmes indépendants existent (OpenEDG JSE/JSA, W3Schools) ; cette page est un parcours d'entraînement sur le langage." },
        { q: "Ce quiz prépare-t-il à JSE ou JSA ?", a: "Il n'est pas aligné sur leur programme : vous pouvez l'utiliser pour pratiquer le langage, mais vérifiez le contenu des examens sur le site d'OpenEDG." },
        { q: "Faut-il connaître HTML et CSS avant ?", a: "Ce n'est pas obligatoire ; quelques notions de HTML aident pour les sujets sur le navigateur et les événements." },
      ],
      [
        { q: "¿Existe una certificación oficial de JavaScript?", a: "No una única de un solo fabricante. Existen programas independientes (OpenEDG JSE/JSA, W3Schools); esta página es una ruta de práctica del lenguaje." },
        { q: "¿Este cuestionario prepara para JSE o JSA?", a: "No está alineado con su programa: puede usarlo para practicar el lenguaje, pero compruebe el contenido de los exámenes en el sitio de OpenEDG." },
        { q: "¿Necesito saber HTML y CSS antes?", a: "No es obligatorio; algo de HTML ayuda en los temas de navegador y eventos." },
      ],
    ),
  },
};

/* ------------------------------------------------------ Microsoft Virtualization */
// Catalogo: 7 argomenti x 30 = 210. Nessun esame Microsoft dedicato a Hyper-V; il programma AZ-802
// (study guide Microsoft, in repo: dominio "Manage virtual machines" 10-15%) ha sostituito AZ-800/801,
// ritirati il 2026-09-30.
const msVirtualization: Override = {
  description: t(
    "210 domande di pratica in 7 argomenti su Hyper-V: gestione, switch virtuali, storage, replica, checkpoint, servizi di integrazione, backup e disaster recovery. Non è la preparazione a un esame Microsoft dedicato.",
    "210 practice questions in 7 topics on Hyper-V: management, virtual switches, storage, replication, checkpoints, integration services, backup and disaster recovery. It is not preparation for a dedicated Microsoft exam.",
    "210 questions d'entraînement en 7 sujets sur Hyper-V : gestion, commutateurs virtuels, stockage, réplication, points de contrôle, services d'intégration, sauvegarde et reprise après sinistre. Ce n'est pas la préparation à un examen Microsoft dédié.",
    "210 preguntas de práctica en 7 temas sobre Hyper-V: administración, conmutadores virtuales, almacenamiento, replicación, puntos de control, servicios de integración, copia de seguridad y recuperación ante desastres. No es la preparación para un examen de Microsoft dedicado.",
  ),
  metaTitle: t(
    "Hyper-V Quiz – 210 Domande di Virtualizzazione | CertifyQuiz",
    "Hyper-V Practice Questions – 210 Virtualization Quiz | CertifyQuiz",
    "Hyper-V – 210 questions de virtualisation | CertifyQuiz",
    "Hyper-V – 210 preguntas de virtualización | CertifyQuiz",
  ),
  metaDescription: t(
    "210 domande su Hyper-V: switch virtuali, storage, replica, checkpoint, integration services, backup e disaster recovery. Non è un esame Microsoft dedicato.",
    "210 questions on Hyper-V: virtual switches, storage, replication, checkpoints, integration services, backup and disaster recovery. Not a dedicated Microsoft exam.",
    "210 questions sur Hyper-V : commutateurs virtuels, stockage, réplication, points de contrôle, services d'intégration, sauvegarde et reprise. Pas un examen Microsoft dédié.",
    "210 preguntas sobre Hyper-V: conmutadores virtuales, almacenamiento, replicación, puntos de control, servicios de integración, copias de seguridad y recuperación. No es un examen de Microsoft dedicado.",
  ),
  extraContent: {
    examReferenceHeading: t("Riferimenti Microsoft", "Microsoft references", "Références Microsoft", "Referencias de Microsoft"),
    learn: byLang(
      [
        "Installare e gestire host Hyper-V e macchine virtuali.",
        "Configurare switch virtuali e reti per le VM.",
        "Scegliere le opzioni di storage per i dischi virtuali.",
        "Usare replica, checkpoint e servizi di integrazione.",
        "Pianificare backup e disaster recovery di ambienti virtualizzati.",
      ],
      [
        "Install and manage Hyper-V hosts and virtual machines.",
        "Configure virtual switches and networking for VMs.",
        "Choose storage options for virtual disks.",
        "Use replication, checkpoints and integration services.",
        "Plan backup and disaster recovery for virtualized environments.",
      ],
      [
        "Installer et gérer des hôtes Hyper-V et des machines virtuelles.",
        "Configurer les commutateurs virtuels et le réseau des VM.",
        "Choisir les options de stockage des disques virtuels.",
        "Utiliser la réplication, les points de contrôle et les services d'intégration.",
        "Planifier la sauvegarde et la reprise après sinistre d'environnements virtualisés.",
      ],
      [
        "Instalar y administrar hosts Hyper-V y máquinas virtuales.",
        "Configurar conmutadores virtuales y redes para las VM.",
        "Elegir las opciones de almacenamiento de los discos virtuales.",
        "Usar replicación, puntos de control y servicios de integración.",
        "Planificar copias de seguridad y recuperación ante desastres de entornos virtualizados.",
      ],
    ),
    guideSections: byLang<ReadonlyArray<GuideSection>>(
      [
        { title: "Cosa copre davvero questo quiz", items: ["Introduction and Management of Hyper-V: 30 domande", "Configuration of Virtual Switches: 30 domande", "Storage Options in Virtual Environments: 30 domande", "Replication Features for High Availability: 30 domande", "Creation and Management of Checkpoints: 30 domande", "Integration Services for Virtual Machines: 30 domande", "Backup and Disaster Recovery Solutions: 30 domande"] },
        {
          title: "A quale esame si riferisce, e cosa NON copre",
          items: [
            "Microsoft non ha un esame dedicato a Hyper-V. Il tema compare nell'esame AZ-802 (Administering Windows Server), nel dominio «Manage virtual machines» (10-15%). AZ-802 ha sostituito AZ-800 e AZ-801, ritirati il 30 settembre 2026 secondo la guida Microsoft.",
            "Questo quiz copre solo Hyper-V: non copre gli altri domini di AZ-802 (Active Directory, rete, storage e file server, sicurezza, monitoraggio). Per quelli c'è la landing AZ-802 di questo sito.",
            "Non include laboratori pratici.",
          ],
        },
        { title: "Prerequisiti", paragraphs: ["Nessuno formale. Aiuta conoscere le basi di Windows Server e delle reti. Hyper-V è disponibile anche su Windows 10/11 Pro, quindi puoi fare pratica senza un server dedicato. Contenuti e riferimenti controllati il 04/10/2026."] },
      ],
      [
        { title: "What this question bank actually covers", items: ["Introduction and Management of Hyper-V: 30 questions", "Configuration of Virtual Switches: 30 questions", "Storage Options in Virtual Environments: 30 questions", "Replication Features for High Availability: 30 questions", "Creation and Management of Checkpoints: 30 questions", "Integration Services for Virtual Machines: 30 questions", "Backup and Disaster Recovery Solutions: 30 questions"] },
        {
          title: "Which exam it relates to, and what it does NOT cover",
          items: [
            "Microsoft has no exam dedicated to Hyper-V. The topic appears in the AZ-802 exam (Administering Windows Server), in the \"Manage virtual machines\" domain (10-15%). AZ-802 replaced AZ-800 and AZ-801, retired on September 30, 2026 according to Microsoft's guide.",
            "This quiz covers Hyper-V only: it does not cover the other AZ-802 domains (Active Directory, networking, storage and file services, security, monitoring). For those, see the AZ-802 landing on this site.",
            "It does not include hands-on labs.",
          ],
        },
        { title: "Prerequisites", paragraphs: ["None formally. Knowing the basics of Windows Server and networking helps. Hyper-V is also available on Windows 10/11 Pro, so you can practice without a dedicated server. Content and references checked on 2026-10-04."] },
      ],
      [
        { title: "Ce que couvre réellement ce quiz", items: ["Introduction and Management of Hyper-V : 30 questions", "Configuration of Virtual Switches : 30 questions", "Storage Options in Virtual Environments : 30 questions", "Replication Features for High Availability : 30 questions", "Creation and Management of Checkpoints : 30 questions", "Integration Services for Virtual Machines : 30 questions", "Backup and Disaster Recovery Solutions : 30 questions"] },
        {
          title: "À quel examen il se rattache, et ce qu'il ne couvre PAS",
          items: [
            "Microsoft n'a pas d'examen dédié à Hyper-V. Le sujet apparaît dans l'examen AZ-802 (Administering Windows Server), dans le domaine « Manage virtual machines » (10-15 %). AZ-802 a remplacé AZ-800 et AZ-801, retirés le 30 septembre 2026 selon le guide Microsoft.",
            "Ce quiz ne couvre qu'Hyper-V : pas les autres domaines d'AZ-802 (Active Directory, réseau, stockage et serveurs de fichiers, sécurité, supervision). Pour ceux-ci, voyez la page AZ-802 de ce site.",
            "Il ne comprend pas de laboratoires pratiques.",
          ],
        },
        { title: "Prérequis", paragraphs: ["Aucun prérequis formel. Connaître les bases de Windows Server et des réseaux aide. Hyper-V est aussi disponible sur Windows 10/11 Pro : vous pouvez pratiquer sans serveur dédié. Contenu et références vérifiés le 04/10/2026."] },
      ],
      [
        { title: "Qué cubre realmente este cuestionario", items: ["Introduction and Management of Hyper-V: 30 preguntas", "Configuration of Virtual Switches: 30 preguntas", "Storage Options in Virtual Environments: 30 preguntas", "Replication Features for High Availability: 30 preguntas", "Creation and Management of Checkpoints: 30 preguntas", "Integration Services for Virtual Machines: 30 preguntas", "Backup and Disaster Recovery Solutions: 30 preguntas"] },
        {
          title: "Con qué examen se relaciona y qué NO cubre",
          items: [
            "Microsoft no tiene un examen dedicado a Hyper-V. El tema aparece en el examen AZ-802 (Administering Windows Server), en el dominio «Manage virtual machines» (10-15 %). AZ-802 sustituyó a AZ-800 y AZ-801, retirados el 30 de septiembre de 2026 según la guía de Microsoft.",
            "Este cuestionario solo cubre Hyper-V: no cubre los otros dominios de AZ-802 (Active Directory, redes, almacenamiento y servidores de archivos, seguridad, supervisión). Para ellos, consulte la página de AZ-802 de este sitio.",
            "No incluye laboratorios prácticos.",
          ],
        },
        { title: "Requisitos", paragraphs: ["Ninguno formal. Conocer las bases de Windows Server y de redes ayuda. Hyper-V también está disponible en Windows 10/11 Pro, así que puede practicar sin un servidor dedicado. Contenido y referencias verificados el 04/10/2026."] },
      ],
    ),
    examReference: byLang(
      [
        { text: "AZ-802 • Administering Windows Server (esame che include Hyper-V)", url: "https://learn.microsoft.com/en-us/credentials/certifications/exams/az-802/" },
        { text: "Documentazione Hyper-V su Windows Server", url: "https://learn.microsoft.com/en-us/windows-server/virtualization/hyper-v/hyper-v-on-windows-server" },
      ],
      [
        { text: "AZ-802 • Administering Windows Server (the exam that includes Hyper-V)", url: "https://learn.microsoft.com/en-us/credentials/certifications/exams/az-802/" },
        { text: "Hyper-V on Windows Server documentation", url: "https://learn.microsoft.com/en-us/windows-server/virtualization/hyper-v/hyper-v-on-windows-server" },
      ],
      [
        { text: "AZ-802 • Administering Windows Server (l'examen qui inclut Hyper-V)", url: "https://learn.microsoft.com/en-us/credentials/certifications/exams/az-802/" },
        { text: "Documentation Hyper-V sur Windows Server", url: "https://learn.microsoft.com/en-us/windows-server/virtualization/hyper-v/hyper-v-on-windows-server" },
      ],
      [
        { text: "AZ-802 • Administering Windows Server (el examen que incluye Hyper-V)", url: "https://learn.microsoft.com/en-us/credentials/certifications/exams/az-802/" },
        { text: "Documentación de Hyper-V en Windows Server", url: "https://learn.microsoft.com/en-us/windows-server/virtualization/hyper-v/hyper-v-on-windows-server" },
      ],
    ),
    faq: byLang(
      [
        { q: "Quale esame Microsoft include Hyper-V?", a: "AZ-802 (Administering Windows Server), nel dominio sulle macchine virtuali. Non esiste un esame solo su Hyper-V." },
        { q: "Serve Windows Server per usare Hyper-V?", a: "No: Hyper-V è disponibile anche su Windows 10/11 Pro." },
        { q: "AZ-800 e AZ-801 sono ancora validi?", a: "Secondo la guida Microsoft ad AZ-802, sono stati ritirati il 30 settembre 2026 e sostituiti da AZ-802." },
      ],
      [
        { q: "Which Microsoft exam includes Hyper-V?", a: "AZ-802 (Administering Windows Server), in its virtual machines domain. There is no exam solely about Hyper-V." },
        { q: "Do I need Windows Server to use Hyper-V?", a: "No: Hyper-V is also available on Windows 10/11 Pro." },
        { q: "Are AZ-800 and AZ-801 still current?", a: "According to Microsoft's AZ-802 guide, they were retired on September 30, 2026 and replaced by AZ-802." },
      ],
      [
        { q: "Quel examen Microsoft inclut Hyper-V ?", a: "AZ-802 (Administering Windows Server), dans son domaine sur les machines virtuelles. Il n'existe pas d'examen uniquement sur Hyper-V." },
        { q: "Faut-il Windows Server pour utiliser Hyper-V ?", a: "Non : Hyper-V est aussi disponible sur Windows 10/11 Pro." },
        { q: "AZ-800 et AZ-801 sont-ils encore valables ?", a: "Selon le guide Microsoft d'AZ-802, ils ont été retirés le 30 septembre 2026 et remplacés par AZ-802." },
      ],
      [
        { q: "¿Qué examen de Microsoft incluye Hyper-V?", a: "AZ-802 (Administering Windows Server), en su dominio de máquinas virtuales. No existe un examen solo sobre Hyper-V." },
        { q: "¿Necesito Windows Server para usar Hyper-V?", a: "No: Hyper-V también está disponible en Windows 10/11 Pro." },
        { q: "¿AZ-800 y AZ-801 siguen vigentes?", a: "Según la guía de Microsoft de AZ-802, se retiraron el 30 de septiembre de 2026 y los sustituye AZ-802." },
      ],
    ),
  },
};

/* ---------------------------------------------------------------------- C# */
// Catalogo: 4 argomenti x 30 = 120 (linguaggio C#). Il contenuto NON e' AZ-204 (ritirato il
// 2026-07-31, vedi nota storica nel file dati): titolo/meta/descrizione descrivono il contenuto reale.
const csharp: Override = {
  title: t(
    "Programmazione C# — domande di pratica",
    "C# Programming — practice questions",
    "Programmation C# — questions d'entraînement",
    "Programación en C# — preguntas de práctica",
  ),
  officialUrl: "https://learn.microsoft.com/en-us/dotnet/csharp/",
  description: t(
    "120 domande di pratica in 4 argomenti sul linguaggio C#: sintassi e costrutti, programmazione a oggetti, gestione degli errori e debug, dati e collezioni. Non prepara ad AZ-204 né a un esame Microsoft attuale.",
    "120 practice questions in 4 topics on the C# language: syntax and constructs, object-oriented programming, error handling and debugging, data and collections. It does not prepare for AZ-204 or a current Microsoft exam.",
    "120 questions d'entraînement en 4 sujets sur le langage C# : syntaxe et constructions, programmation orientée objet, gestion des erreurs et débogage, données et collections. Ne prépare ni à AZ-204 ni à un examen Microsoft actuel.",
    "120 preguntas de práctica en 4 temas sobre el lenguaje C#: sintaxis y construcciones, programación orientada a objetos, gestión de errores y depuración, datos y colecciones. No prepara para AZ-204 ni para un examen actual de Microsoft.",
  ),
  metaTitle: t(
    "C# Quiz – Sintassi, OOP, Collezioni | CertifyQuiz",
    "C# Practice Questions – Syntax, OOP, Collections | CertifyQuiz",
    "C# – Syntaxe, POO, collections | CertifyQuiz",
    "C# – Sintaxis, POO, colecciones | CertifyQuiz",
  ),
  metaDescription: t(
    "120 domande su C#: sintassi, programmazione a oggetti, gestione degli errori, dati e collezioni, con spiegazioni. Non è una preparazione ad AZ-204.",
    "120 C# practice questions on syntax, object-oriented programming, error handling, data and collections, with explanations. Not AZ-204 preparation.",
    "120 questions sur C# : syntaxe, programmation orientée objet, gestion des erreurs, données et collections, avec explications. Pas une préparation à AZ-204.",
    "120 preguntas sobre C#: sintaxis, programación orientada a objetos, gestión de errores, datos y colecciones, con explicaciones. No es preparación para AZ-204.",
  ),
  extraContent: {
    topicsHeading: t("Argomenti del percorso", "Practice topics", "Sujets d'entraînement", "Temas de práctica"),
    examReferenceHeading: t("Risorse Microsoft e programmi correlati", "Microsoft resources and related programs", "Ressources Microsoft et programmes associés", "Recursos de Microsoft y programas relacionados"),
    learn: byLang(
      [
        "Sintassi di C#, tipi, variabili, operatori e controllo di flusso.",
        "Classi, ereditarietà, interfacce e polimorfismo.",
        "Eccezioni, gestione degli errori e debug.",
        "Array, liste, dizionari e altre collezioni.",
      ],
      [
        "C# syntax, types, variables, operators and control flow.",
        "Classes, inheritance, interfaces and polymorphism.",
        "Exceptions, error handling and debugging.",
        "Arrays, lists, dictionaries and other collections.",
      ],
      [
        "Syntaxe C#, types, variables, opérateurs et structures de contrôle.",
        "Classes, héritage, interfaces et polymorphisme.",
        "Exceptions, gestion des erreurs et débogage.",
        "Tableaux, listes, dictionnaires et autres collections.",
      ],
      [
        "Sintaxis de C#, tipos, variables, operadores y control de flujo.",
        "Clases, herencia, interfaces y polimorfismo.",
        "Excepciones, gestión de errores y depuración.",
        "Arrays, listas, diccionarios y otras colecciones.",
      ],
    ),
    guideSections: byLang<ReadonlyArray<GuideSection>>(
      [
        { title: "Cosa copre davvero questo quiz", items: ["C# syntax and constructs: 30 domande", "Object-oriented programming: 30 domande", "Error handling and debugging: 30 domande", "Data and collections: 30 domande"] },
        {
          title: "Cosa NON è: non è AZ-204",
          items: [
            "Il contenuto è il linguaggio C#, non i servizi Azure: niente compute, storage, identità o monitoraggio su Azure.",
            "L'esame Microsoft AZ-204 (Azure Developer) è stato ritirato il 31 luglio 2026 senza un sostituto annunciato; questo quiz non lo preparava e non lo prepara.",
            "Non è mappato su un programma di certificazione, incluso il Foundational C# Certification di Microsoft e freeCodeCamp. Non include esercizi di scrittura di codice né progetti.",
          ],
        },
        { title: "Prerequisiti", paragraphs: ["Nessuno formale; basta una prima esperienza con un linguaggio di programmazione. Contenuti e riferimenti controllati il 04/10/2026."] },
      ],
      [
        { title: "What this question bank actually covers", items: ["C# syntax and constructs: 30 questions", "Object-oriented programming: 30 questions", "Error handling and debugging: 30 questions", "Data and collections: 30 questions"] },
        {
          title: "What it is NOT: it is not AZ-204",
          items: [
            "The content is the C# language, not Azure services: no Azure compute, storage, identity or monitoring.",
            "Microsoft's AZ-204 (Azure Developer) exam was retired on July 31, 2026 with no announced replacement; this quiz did not prepare for it and does not now.",
            "It is not mapped to any certification program, including the Foundational C# Certification from Microsoft and freeCodeCamp. It does not include coding exercises or projects.",
          ],
        },
        { title: "Prerequisites", paragraphs: ["None formally; a first experience with any programming language is enough. Content and references checked on 2026-10-04."] },
      ],
      [
        { title: "Ce que couvre réellement ce quiz", items: ["C# syntax and constructs : 30 questions", "Object-oriented programming : 30 questions", "Error handling and debugging : 30 questions", "Data and collections : 30 questions"] },
        {
          title: "Ce que ce n'est PAS : ce n'est pas AZ-204",
          items: [
            "Le contenu est le langage C#, pas les services Azure : ni calcul, ni stockage, ni identité, ni supervision Azure.",
            "L'examen Microsoft AZ-204 (Azure Developer) a été retiré le 31 juillet 2026 sans remplaçant annoncé ; ce quiz n'y préparait pas et n'y prépare pas.",
            "Il n'est aligné sur aucun programme de certification, y compris la Foundational C# Certification de Microsoft et freeCodeCamp. Il ne comprend pas d'exercices de code ni de projets.",
          ],
        },
        { title: "Prérequis", paragraphs: ["Aucun prérequis formel ; une première expérience d'un langage de programmation suffit. Contenu et références vérifiés le 04/10/2026."] },
      ],
      [
        { title: "Qué cubre realmente este cuestionario", items: ["C# syntax and constructs: 30 preguntas", "Object-oriented programming: 30 preguntas", "Error handling and debugging: 30 preguntas", "Data and collections: 30 preguntas"] },
        {
          title: "Qué NO es: no es AZ-204",
          items: [
            "El contenido es el lenguaje C#, no los servicios de Azure: ni cómputo, ni almacenamiento, ni identidad, ni supervisión en Azure.",
            "El examen AZ-204 (Azure Developer) de Microsoft se retiró el 31 de julio de 2026 sin sustituto anunciado; este cuestionario no preparaba para él ni lo hace ahora.",
            "No está alineado con ningún programa de certificación, incluida la Foundational C# Certification de Microsoft y freeCodeCamp. No incluye ejercicios de código ni proyectos.",
          ],
        },
        { title: "Requisitos", paragraphs: ["Ninguno formal; basta una primera experiencia con algún lenguaje de programación. Contenido y referencias verificados el 04/10/2026."] },
      ],
    ),
    examReference: byLang(
      [
        { text: "Documentazione del linguaggio C# (Microsoft Learn)", url: "https://learn.microsoft.com/en-us/dotnet/csharp/" },
        { text: "Percorso «Get started with C#» (Microsoft Learn)", url: "https://learn.microsoft.com/en-us/training/paths/get-started-c-sharp-part-1/" },
        { text: "Foundational C# Certification (freeCodeCamp e Microsoft)", url: "https://www.freecodecamp.org/learn/foundational-c-sharp-with-microsoft/" },
      ],
      [
        { text: "C# language documentation (Microsoft Learn)", url: "https://learn.microsoft.com/en-us/dotnet/csharp/" },
        { text: "\"Get started with C#\" learning path (Microsoft Learn)", url: "https://learn.microsoft.com/en-us/training/paths/get-started-c-sharp-part-1/" },
        { text: "Foundational C# Certification (freeCodeCamp and Microsoft)", url: "https://www.freecodecamp.org/learn/foundational-c-sharp-with-microsoft/" },
      ],
      [
        { text: "Documentation du langage C# (Microsoft Learn)", url: "https://learn.microsoft.com/en-us/dotnet/csharp/" },
        { text: "Parcours « Get started with C# » (Microsoft Learn)", url: "https://learn.microsoft.com/en-us/training/paths/get-started-c-sharp-part-1/" },
        { text: "Foundational C# Certification (freeCodeCamp et Microsoft)", url: "https://www.freecodecamp.org/learn/foundational-c-sharp-with-microsoft/" },
      ],
      [
        { text: "Documentación del lenguaje C# (Microsoft Learn)", url: "https://learn.microsoft.com/en-us/dotnet/csharp/" },
        { text: "Ruta «Get started with C#» (Microsoft Learn)", url: "https://learn.microsoft.com/en-us/training/paths/get-started-c-sharp-part-1/" },
        { text: "Foundational C# Certification (freeCodeCamp y Microsoft)", url: "https://www.freecodecamp.org/learn/foundational-c-sharp-with-microsoft/" },
      ],
    ),
    faq: byLang(
      [
        { q: "Questo quiz prepara ad AZ-204?", a: "No. Il contenuto è il linguaggio C# (sintassi, OOP, errori, collezioni), non i servizi Azure. AZ-204 è stato ritirato da Microsoft il 31 luglio 2026 senza un sostituto annunciato." },
        { q: "C'è un esame di certificazione per C#?", a: "Microsoft e freeCodeCamp offrono la Foundational C# Certification; questo quiz non è mappato sul suo programma." },
        { q: "Devo già saper programmare?", a: "Basta una prima esperienza con un linguaggio di programmazione." },
      ],
      [
        { q: "Does this quiz prepare for AZ-204?", a: "No. The content is the C# language (syntax, OOP, errors, collections), not Azure services. Microsoft retired AZ-204 on July 31, 2026 with no announced replacement." },
        { q: "Is there a certification exam for C#?", a: "Microsoft and freeCodeCamp offer the Foundational C# Certification; this quiz is not mapped to its syllabus." },
        { q: "Do I already need to know how to program?", a: "A first experience with any programming language is enough." },
      ],
      [
        { q: "Ce quiz prépare-t-il à AZ-204 ?", a: "Non. Le contenu est le langage C# (syntaxe, POO, erreurs, collections), pas les services Azure. Microsoft a retiré AZ-204 le 31 juillet 2026 sans remplaçant annoncé." },
        { q: "Existe-t-il un examen de certification pour C# ?", a: "Microsoft et freeCodeCamp proposent la Foundational C# Certification ; ce quiz n'est pas aligné sur son programme." },
        { q: "Faut-il déjà savoir programmer ?", a: "Une première expérience d'un langage de programmation suffit." },
      ],
      [
        { q: "¿Este cuestionario prepara para AZ-204?", a: "No. El contenido es el lenguaje C# (sintaxis, POO, errores, colecciones), no los servicios de Azure. Microsoft retiró AZ-204 el 31 de julio de 2026 sin sustituto anunciado." },
        { q: "¿Hay un examen de certificación para C#?", a: "Microsoft y freeCodeCamp ofrecen la Foundational C# Certification; este cuestionario no está alineado con su programa." },
        { q: "¿Necesito ya saber programar?", a: "Basta una primera experiencia con algún lenguaje de programación." },
      ],
    ),
  },
};

export const P1_LANDING_OVERRIDES: Readonly<Record<string, Override>> = {
  "pentest-plus": pentestPlus,
  "mongodb-developer": mongodb,
  "oracle-database-sql": oracleSql,
  "vmware-vcp": vmware,
  jncie,
  "javascript-developer": javascript,
  "microsoft-virtualization": msVirtualization,
  csharp,
};
