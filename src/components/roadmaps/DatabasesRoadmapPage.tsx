import Link from "next/link";

type Locale = "it" | "en" | "es" | "fr";

type RoadmapQuizSlug = string;
type RoadmapCertSlug = string;

const quiz = (lang: Locale, slug: RoadmapQuizSlug) =>
  `/${lang}/quiz/${slug}`;

const cert = (lang: Locale, slug: RoadmapCertSlug) => {
  if (lang === "it") return `/it/certificazioni/${slug}`;
  if (lang === "fr") return `/fr/certifications/${slug}`;
  if (lang === "es") return `/es/certificaciones/${slug}`;
  return `/certifications/${slug}`;
};

export default function DatabasesRoadmapPage({
  lang,
}: {
  lang: Locale;
}) {
  const t = CONTENT[lang];

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      {/* HERO */}
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          {t.title}
        </h1>

        <p className="mt-2 text-lg text-slate-600">
          {t.subtitle}
        </p>

        <p className="mt-5 text-slate-700 leading-relaxed">
          {t.intro}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={quiz(lang, "mysql-certification")}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition"
          >
            {t.ctaPrimary}
          </Link>

          <Link
            href={cert(lang, "microsoft-sql-server")}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-800 hover:bg-slate-50 transition"
          >
            {t.ctaSecondary}
          </Link>
        </div>
      </header>

      {/* ROADMAP */}
      <section className="space-y-6">
        {t.levels.map((lvl) => (
          <div
            key={lvl.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h2 className="text-xl font-bold">{lvl.title}</h2>
            <p className="mt-2 text-slate-700 leading-relaxed">{lvl.body}</p>

            {lvl.recommended?.length ? (
              <ul className="mt-3 list-disc pl-5 text-slate-700">
                {lvl.recommended.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            ) : null}

            {lvl.goal ? (
              <p className="mt-3 text-slate-600">
                <span className="font-semibold">{t.goalLabel}</span> {lvl.goal}
              </p>
            ) : null}

            {lvl.ctaQuizSlug || lvl.ctaCertSlug ? (
              <div className="mt-4 flex flex-col items-start gap-2">
                {lvl.ctaQuizSlug ? (
                  <Link
                    href={quiz(lang, lvl.ctaQuizSlug)}
                    className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800 transition"
                  >
                    {lvl.ctaPrimaryText ?? t.practiceCta}
                  </Link>
                ) : null}

                {lvl.ctaCertSlug ? (
                  <Link
                    href={cert(lang, lvl.ctaCertSlug)}
                    className="text-sm font-medium text-blue-700 underline underline-offset-2 hover:text-blue-800"
                  >
                    {lvl.ctaSecondaryText ?? t.certCta}
                  </Link>
                ) : null}
              </div>
            ) : null}
          </div>
        ))}
      </section>

      {/* SALARY */}
      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-extrabold">{t.salaryTitle}</h2>
        <p className="mt-2 text-slate-700 leading-relaxed">{t.salaryIntro}</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {t.salaryRanges.map((r) => (
            <div
              key={r.label}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <p className="font-bold">{r.label}</p>
              <p className="mt-1 text-slate-700">{r.range}</p>
            </div>
          ))}
        </div>

        <p className="mt-3 text-sm text-slate-500">{t.salaryDisclaimer}</p>
      </section>

      {/* COMPARISON */}
      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-extrabold">{t.compareTitle}</h2>
        <p className="mt-2 text-slate-700 leading-relaxed">{t.compareIntro}</p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left">
                <th className="border-b border-slate-200 py-2 pr-4"></th>
                <th className="border-b border-slate-200 py-2 pr-4 font-bold">
                  {t.compareLeftTitle}
                </th>
                <th className="border-b border-slate-200 py-2 font-bold">
                  {t.compareRightTitle}
                </th>
              </tr>
            </thead>
            <tbody>
              {t.compareRows.map((row) => (
                <tr key={row.label} className="align-top">
                  <td className="border-b border-slate-100 py-3 pr-4 font-semibold text-slate-700">
                    {row.label}
                  </td>
                  <td className="border-b border-slate-100 py-3 pr-4 text-slate-700">
                    {row.left}
                  </td>
                  <td className="border-b border-slate-100 py-3 text-slate-700">
                    {row.right}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-800">
          <p className="font-semibold">{t.compareRecommendationTitle}</p>
          <p className="mt-1">{t.compareRecommendationBody}</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-10">
        <h2 className="text-2xl font-extrabold">{t.faqTitle}</h2>
        <div className="mt-4 space-y-4">
          {t.faq.map((f) => (
            <div
              key={f.q}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="font-bold text-slate-900">{f.q}</p>
              <p className="mt-2 text-slate-700 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mt-10 rounded-2xl border border-blue-200 bg-blue-50 p-5">
        <h2 className="text-xl font-extrabold text-slate-900">
          {t.finalCtaTitle}
        </h2>
        <p className="mt-2 text-slate-700">{t.finalCtaBody}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={quiz(lang, "mysql-certification")}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition"
          >
            {t.ctaPrimary}
          </Link>
          <Link
            href={cert(lang, "microsoft-sql-server")}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-800 hover:bg-slate-50 transition"
          >
            {t.ctaSecondary}
          </Link>
        </div>
      </section>
    </main>
  );
}

const CONTENT: Record<
  Locale,
  {
    title: string;
    subtitle: string;
    intro: string;

    ctaPrimary: string;
    ctaSecondary: string;
    certCta: string;

    goalLabel: string;
    practiceCta: string;

    levels: Array<{
  title: string;
  body: string;

  recommended?: string[];

  goal?: string;

  ctaQuizSlug?: RoadmapQuizSlug;
  ctaCertSlug?: RoadmapCertSlug;

  ctaPrimaryText?: string;
  ctaSecondaryText?: string;

  reality?: string;
  mistakes?: string[];
  outcomes?: string[];
}>;

    salaryTitle: string;
    salaryIntro: string;
    salaryRanges: Array<{ label: string; range: string }>;
    salaryDisclaimer: string;

    compareTitle: string;
    compareIntro: string;
    compareLeftTitle: string;
    compareRightTitle: string;
    compareRows: Array<{ label: string; left: string; right: string }>;
    compareRecommendationTitle: string;
    compareRecommendationBody: string;

    faqTitle: string;
    faq: Array<{ q: string; a: string }>;

    finalCtaTitle: string;
    finalCtaBody: string;
  }
> = {
  en: {
  title: "Database Certification Roadmap 2026",
  subtitle: "From SQL basics to real-world database skills",
  intro:
    "Databases are behind almost every serious digital product: websites, apps, analytics platforms, cloud services, business systems, and AI tools. This roadmap gives you a realistic path: first SQL fundamentals, then relational databases, then administration and performance, and finally NoSQL when the basics are solid.",

  ctaPrimary: "Start with MySQL quiz",
  ctaSecondary: "Explore SQL Server certification",
  certCta: "Explore certification",

  goalLabel: "Goal:",
  practiceCta: "Practice now",

  levels: [
    {
      title: "🟢 Level 0 — SQL fundamentals",
      body:
        "Start with the universal foundation: SELECT, WHERE, ORDER BY, JOIN, GROUP BY, subqueries, constraints, indexes, and basic normalization. Before thinking about advanced tools, you need to understand how data is stored, connected, filtered, and queried.",
      recommended: ["MySQL", "SQL fundamentals in practice"],
      goal:
        "Write SQL queries with confidence and understand how tables relate.",
      reality:
        "Many beginners underestimate SQL because it looks simple at first. In reality, weak SQL fundamentals will block you later in backend development, analytics, cloud, and database administration.",
      mistakes: [
        "Memorizing syntax without writing real queries",
        "Skipping JOINs and relationships between tables",
        "Ignoring normalization and data consistency",
        "Jumping to NoSQL before understanding relational databases",
      ],
      outcomes: [
        "Write basic and intermediate SQL queries",
        "Understand how tables, keys, and relationships work",
        "Build a strong base for backend, data, and cloud roles",
      ],
      ctaQuizSlug: "mysql-certification",
      ctaCertSlug: "mysql-certification",
      ctaPrimaryText: "Start MySQL quiz",
      ctaSecondaryText: "Explore MySQL certification",
    },
    {
      title: "🟡 Level 1 — Relational databases",
      body:
        "Once SQL basics are clear, choose a relational ecosystem. MySQL is practical and widely used, SQL Server is strong in Microsoft and enterprise environments, and Oracle is common in traditional enterprise systems.",
      recommended: ["MySQL", "Microsoft SQL Server", "Oracle Database SQL"],
      goal:
        "Understand transactions, locks, execution plans, and performance basics.",
      reality:
        "At this level, the challenge is no longer only writing queries. You need to understand how databases behave when real users, real data, and real business rules are involved.",
      mistakes: [
        "Thinking all databases work exactly the same",
        "Ignoring transactions, locks, and consistency",
        "Writing queries without checking performance",
        "Choosing a database only because it is popular",
      ],
      outcomes: [
        "Understand the main relational database ecosystems",
        "Read and reason about execution plans at a basic level",
        "Prepare for SQL Server, MySQL, or Oracle learning paths",
      ],
      ctaQuizSlug: "microsoft-sql-server",
      ctaCertSlug: "microsoft-sql-server",
      ctaPrimaryText: "Start SQL Server quiz",
      ctaSecondaryText: "Explore SQL Server certification",
    },
    {
      title: "🟠 Level 2 — Administration, reliability & performance",
      body:
        "Go beyond queries. Learn indexing strategy, permissions, backups, monitoring, recovery, roles, and performance troubleshooting. This is where database knowledge starts becoming operational and job-oriented.",
      recommended: [
        "Oracle Database SQL",
        "Query optimization",
        "Backups & recovery",
        "Roles and permissions",
      ],
      goal:
        "Keep a database fast, safe, recoverable, and ready for real environments.",
      reality:
        "Companies do not only need people who can query data. They need people who understand what happens when databases become slow, unsafe, corrupted, overloaded, or badly designed.",
      mistakes: [
        "Ignoring backups until something breaks",
        "Adding indexes randomly without understanding trade-offs",
        "Using admin privileges without security logic",
        "Treating performance as an advanced topic to study later",
      ],
      outcomes: [
        "Understand database reliability and recovery basics",
        "Recognize common performance and indexing problems",
        "Move closer to DBA, backend, and data engineering paths",
      ],
      ctaQuizSlug: "oracle-database-sql",
      ctaCertSlug: "oracle-database-sql",
      ctaPrimaryText: "Start Oracle Database SQL quiz",
      ctaSecondaryText: "Explore Oracle Database SQL certification",
    },
    {
      title: "🔴 Level 3 — NoSQL & modern application mindset",
      body:
        "After you understand relational models well, add NoSQL. MongoDB is useful for flexible schemas, document-based modeling, and modern application data patterns, but it should not replace SQL fundamentals.",
      recommended: ["MongoDB Developer"],
      goal:
        "Understand when NoSQL fits and how to model documents properly.",
      reality:
        "NoSQL is powerful, but it is often misunderstood. The goal is not to avoid structure, but to choose the right data model for the right application problem.",
      mistakes: [
        "Using MongoDB because it feels easier than SQL",
        "Creating unstructured documents with no design logic",
        "Ignoring consistency and query patterns",
        "Thinking NoSQL replaces relational databases everywhere",
      ],
      outcomes: [
        "Understand when MongoDB is a good fit",
        "Model document-based data more clearly",
        "Combine SQL and NoSQL thinking in modern applications",
      ],
      ctaQuizSlug: "mongodb-developer",
      ctaCertSlug: "mongodb-developer",
      ctaPrimaryText: "Start MongoDB quiz",
      ctaSecondaryText: "Explore MongoDB certification",
    },
  ],

  salaryTitle: "💰 Database salary outlook (2026)",
  salaryIntro:
    "Global salary ranges vary by country, company, and specialization. Use them as orientation, not as a promise.",
  salaryRanges: [
    { label: "Junior", range: "$45k–$70k" },
    { label: "Mid-level", range: "$75k–$110k" },
    { label: "Senior / DBA", range: "$120k+" },
  ],
  salaryDisclaimer:
    "The fastest growth usually comes from combining SQL skills, performance knowledge, database reliability, and real project experience.",

  compareTitle: "🔍 SQL vs NoSQL — which one first?",
  compareIntro:
    "Most people should start with SQL. NoSQL makes more sense after you understand relational thinking well.",
  compareLeftTitle: "SQL / Relational",
  compareRightTitle: "NoSQL / MongoDB",
  compareRows: [
    {
      label: "Best for",
      left: "Structured data, reporting, consistency",
      right: "Flexible models, rapid iteration",
    },
    {
      label: "Common use",
      left: "Business apps, enterprise systems",
      right: "Modern apps, document-heavy systems",
    },
    {
      label: "Start here?",
      left: "Yes, for most learners",
      right: "After SQL fundamentals",
    },
  ],
  compareRecommendationTitle: "Recommendation",
  compareRecommendationBody:
    "Start with SQL first. Build confidence with MySQL or SQL Server, then add MongoDB later when you understand data modeling better.",

  faqTitle: "FAQ",
  faq: [
    {
      q: "Which database should I learn first?",
      a: "Start with SQL fundamentals. MySQL is usually the easiest and most practical entry point.",
    },
    {
      q: "Do I need Oracle?",
      a: "Only if you aim at enterprise environments where Oracle is common. It is useful, but not mandatory for everyone.",
    },
    {
      q: "Is MongoDB enough to get hired?",
      a: "It helps, but SQL is still the more universal baseline employers expect.",
    },
    {
      q: "How do I become job-ready faster?",
      a: "Build a real mini project: schema, queries, indexes, backup plan, and performance reasoning.",
    },
  ],

  finalCtaTitle: "🚀 Start now with the practical path",
  finalCtaBody:
    "Start with SQL first. Practice every day. Then strengthen your relational skills and add MongoDB only when the fundamentals feel natural.",
},

 it: {
  title: "Roadmap Certificazioni Database 2026",
  subtitle: "Dalle basi SQL a competenze reali sui database",
  intro:
    "I database sono dietro quasi ogni prodotto digitale serio: siti web, applicazioni, analytics, cloud, sistemi aziendali e AI. Questa roadmap ti guida in un percorso realistico: prima SQL, poi relazionale, poi amministrazione e performance, infine NoSQL quando le basi sono solide.",

  ctaPrimary: "Inizia con il quiz MySQL",
  ctaSecondary: "Scopri la certificazione SQL Server",
  certCta: "Scopri la certificazione",

  goalLabel: "Obiettivo:",
  practiceCta: "Allenati ora",

  levels: [
    {
      title: "🟢 Livello 0 — Fondamenti SQL",
      body:
        "Parti dalla base universale: SELECT, WHERE, ORDER BY, JOIN, GROUP BY, subquery, vincoli, indici e normalizzazione base. Prima di pensare a strumenti avanzati, devi capire come i dati vengono salvati, collegati e interrogati.",
      recommended: ["MySQL", "SQL pratico"],
      goal:
        "Scrivere query SQL con sicurezza e capire le relazioni tra tabelle.",
      reality:
        "Molti principianti sottovalutano SQL perché sembra semplice all’inizio. In realtà, basi SQL deboli ti bloccheranno più avanti in backend, analytics, cloud e amministrazione database.",
      mistakes: [
        "Memorizzare sintassi senza fare query reali",
        "Saltare JOIN e relazioni tra tabelle",
        "Ignorare normalizzazione e consistenza dei dati",
        "Passare subito a NoSQL senza capire il relazionale",
      ],
      outcomes: [
        "Scrivere query SQL base e intermedie",
        "Comprendere tabelle, chiavi e relazioni",
        "Costruire basi solide per backend, data e cloud",
      ],
      ctaQuizSlug: "mysql-certification",
      ctaCertSlug: "mysql-certification",
      ctaPrimaryText: "Inizia il quiz MySQL",
      ctaSecondaryText: "Scopri la certificazione MySQL",
    },

    {
      title: "🟡 Livello 1 — Database relazionali",
      body:
        "Quando le basi SQL sono solide, scegli un ecosistema relazionale. MySQL è pratico e diffusissimo, SQL Server è forte negli ambienti Microsoft/enterprise, Oracle domina ancora molti contesti enterprise tradizionali.",
      recommended: [
        "MySQL",
        "Microsoft SQL Server",
        "Oracle Database SQL",
      ],
      goal:
        "Capire transazioni, lock, execution plan e basi di performance.",
      reality:
        "A questo livello la sfida non è più solo scrivere query. Devi capire come si comportano i database con utenti reali, dati reali e logiche business vere.",
      mistakes: [
        "Pensare che tutti i database funzionino allo stesso modo",
        "Ignorare transazioni e consistenza",
        "Scrivere query senza ragionare sulle performance",
        "Scegliere un database solo perché è popolare",
      ],
      outcomes: [
        "Comprendere i principali ecosistemi relazionali",
        "Leggere execution plan a livello base",
        "Prepararsi ai percorsi SQL Server, MySQL o Oracle",
      ],
      ctaQuizSlug: "microsoft-sql-server",
      ctaCertSlug: "microsoft-sql-server",
      ctaPrimaryText: "Inizia il quiz SQL Server",
      ctaSecondaryText: "Scopri la certificazione SQL Server",
    },

    {
      title: "🟠 Livello 2 — Amministrazione, affidabilità e performance",
      body:
        "Vai oltre le query. Impara strategia indici, permessi, backup, monitoraggio, recovery, ruoli e troubleshooting performance. Qui la conoscenza database diventa operativa e spendibile nel lavoro reale.",
      recommended: [
        "Oracle Database SQL",
        "Ottimizzazione query",
        "Backup & recovery",
        "Ruoli e permessi",
      ],
      goal:
        "Gestire database veloci, sicuri, recuperabili e pronti per ambienti reali.",
      reality:
        "Le aziende non cercano solo persone che sappiano interrogare dati. Cercano persone che capiscano cosa succede quando un database rallenta, si rompe o diventa instabile.",
      mistakes: [
        "Ignorare i backup finché qualcosa non si rompe",
        "Aggiungere indici a caso",
        "Usare privilegi admin senza logica di sicurezza",
        "Pensare che le performance siano un argomento avanzato da rimandare",
      ],
      outcomes: [
        "Comprendere affidabilità e recovery database",
        "Riconoscere problemi comuni di performance",
        "Avvicinarsi a percorsi DBA, backend e data engineering",
      ],
      ctaQuizSlug: "oracle-database-sql",
      ctaCertSlug: "oracle-database-sql",
      ctaPrimaryText: "Inizia il quiz Oracle Database SQL",
      ctaSecondaryText:
        "Scopri la certificazione Oracle Database SQL",
    },

    {
      title: "🔴 Livello 3 — NoSQL e mentalità moderna",
      body:
        "Quando il relazionale è chiaro, aggiungi NoSQL. MongoDB è utile per schemi flessibili, modelli documentali e applicazioni moderne, ma non sostituisce le basi SQL.",
      recommended: ["MongoDB Developer"],
      goal:
        "Capire quando NoSQL ha senso e modellare documenti correttamente.",
      reality:
        "NoSQL è potente ma spesso frainteso. L’obiettivo non è evitare struttura, ma scegliere il modello dati corretto per il problema corretto.",
      mistakes: [
        "Usare MongoDB solo perché sembra più semplice",
        "Creare documenti senza logica strutturale",
        "Ignorare consistenza e query pattern",
        "Pensare che NoSQL sostituisca sempre SQL",
      ],
      outcomes: [
        "Comprendere quando MongoDB è adatto",
        "Modellare dati documentali più chiaramente",
        "Combinare mentalità SQL e NoSQL nelle app moderne",
      ],
      ctaQuizSlug: "mongodb-developer",
      ctaCertSlug: "mongodb-developer",
      ctaPrimaryText: "Inizia il quiz MongoDB",
      ctaSecondaryText: "Scopri la certificazione MongoDB",
    },
  ],

  salaryTitle: "💰 Salary outlook Database (2026)",
  salaryIntro:
    "I range salariali globali cambiano in base a paese, azienda e specializzazione. Usali come orientamento, non come promessa.",
  salaryRanges: [
    { label: "Junior", range: "$45k–$70k" },
    { label: "Mid-level", range: "$75k–$110k" },
    { label: "Senior / DBA", range: "$120k+" },
  ],
  salaryDisclaimer:
    "La crescita più veloce arriva spesso dalla combinazione di SQL, performance, affidabilità database e progetti reali.",

  compareTitle: "🔍 SQL vs NoSQL — da cosa partire?",
  compareIntro:
    "La maggior parte delle persone dovrebbe partire da SQL. NoSQL ha molto più senso dopo aver capito bene il relazionale.",
  compareLeftTitle: "SQL / Relazionale",
  compareRightTitle: "NoSQL / MongoDB",

  compareRows: [
    {
      label: "Ideale per",
      left: "Dati strutturati, reporting, consistenza",
      right: "Modelli flessibili, iterazione veloce",
    },
    {
      label: "Uso tipico",
      left: "Business app, sistemi enterprise",
      right: "App moderne, sistemi documentali",
    },
    {
      label: "Partire da qui?",
      left: "Sì, per quasi tutti",
      right: "Dopo le basi SQL",
    },
  ],

  compareRecommendationTitle: "Consiglio",
  compareRecommendationBody:
    "Parti da SQL. Costruisci sicurezza con MySQL o SQL Server e aggiungi MongoDB solo più avanti.",

  faqTitle: "FAQ",

  faq: [
    {
      q: "Quale database dovrei studiare per primo?",
      a: "Parti dai fondamenti SQL. MySQL è di solito il punto di ingresso più semplice e pratico.",
    },
    {
      q: "Mi serve Oracle?",
      a: "Solo se punti a contesti enterprise dove Oracle è molto diffuso. È utile, ma non obbligatorio per tutti.",
    },
    {
      q: "MongoDB basta per trovare lavoro?",
      a: "Aiuta, ma SQL resta ancora la base più universale richiesta dalle aziende.",
    },
    {
      q: "Come divento spendibile più velocemente?",
      a: "Crea un mini progetto reale: schema, query, indici, backup e ragionamento sulle performance.",
    },
  ],

  finalCtaTitle: "🚀 Parti ora (percorso pratico)",

  finalCtaBody:
    "Impara prima SQL. Allenati ogni giorno. Poi rafforza il relazionale e aggiungi MongoDB solo quando le basi diventano naturali.",
},

  es: {
  title: "Ruta de Certificaciones de Bases de Datos 2026",
  subtitle: "De SQL básico a habilidades reales sobre bases de datos",
  intro:
    "Las bases de datos están detrás de casi todos los productos digitales serios: sitios web, aplicaciones, analítica, cloud, sistemas empresariales e IA. Esta ruta te guía paso a paso: primero SQL, luego bases relacionales, después administración y rendimiento, y finalmente NoSQL cuando las bases sean sólidas.",

  ctaPrimary: "Empezar con el quiz MySQL",
  ctaSecondary: "Ver certificación SQL Server",
  certCta: "Ver certificación",

  goalLabel: "Objetivo:",
  practiceCta: "Practicar ahora",

  levels: [
    {
      title: "🟢 Nivel 0 — Fundamentos SQL",
      body:
        "Empieza por la base universal: SELECT, WHERE, ORDER BY, JOIN, GROUP BY, subconsultas, constraints, índices y normalización básica. Antes de pensar en herramientas avanzadas, debes entender cómo se almacenan, conectan y consultan los datos.",
      recommended: ["MySQL", "SQL práctico"],
      goal:
        "Escribir consultas SQL con confianza y entender las relaciones entre tablas.",
      reality:
        "Muchos principiantes subestiman SQL porque parece simple al principio. En realidad, unas bases SQL débiles te bloquearán más adelante en backend, analítica, cloud y administración de bases de datos.",
      mistakes: [
        "Memorizar sintaxis sin hacer consultas reales",
        "Saltar JOINs y relaciones entre tablas",
        "Ignorar normalización y consistencia de datos",
        "Pasar a NoSQL demasiado pronto sin entender bases relacionales",
      ],
      outcomes: [
        "Escribir consultas SQL básicas e intermedias",
        "Comprender tablas, claves y relaciones",
        "Construir bases sólidas para backend, data y cloud",
      ],
      ctaQuizSlug: "mysql-certification",
      ctaCertSlug: "mysql-certification",
      ctaPrimaryText: "Empezar quiz MySQL",
      ctaSecondaryText: "Ver certificación MySQL",
    },

    {
      title: "🟡 Nivel 1 — Bases de datos relacionales",
      body:
        "Cuando las bases SQL estén claras, elige un ecosistema relacional. MySQL es práctico y muy usado, SQL Server es fuerte en entornos Microsoft/enterprise y Oracle sigue dominando muchos contextos enterprise tradicionales.",
      recommended: [
        "MySQL",
        "Microsoft SQL Server",
        "Oracle Database SQL",
      ],
      goal:
        "Comprender transacciones, locks, execution plans y fundamentos de rendimiento.",
      reality:
        "En este nivel el reto ya no es solo escribir consultas. Necesitas entender cómo se comportan las bases de datos con usuarios reales, datos reales y reglas de negocio reales.",
      mistakes: [
        "Pensar que todas las bases de datos funcionan igual",
        "Ignorar transacciones y consistencia",
        "Escribir consultas sin pensar en rendimiento",
        "Elegir una base de datos solo porque es popular",
      ],
      outcomes: [
        "Comprender los principales ecosistemas relacionales",
        "Leer execution plans a nivel básico",
        "Prepararse para rutas SQL Server, MySQL u Oracle",
      ],
      ctaQuizSlug: "microsoft-sql-server",
      ctaCertSlug: "microsoft-sql-server",
      ctaPrimaryText: "Empezar quiz SQL Server",
      ctaSecondaryText: "Ver certificación SQL Server",
    },

    {
      title: "🟠 Nivel 2 — Administración, fiabilidad y rendimiento",
      body:
        "Ve más allá de las consultas. Aprende estrategia de índices, permisos, backups, monitorización, recovery, roles y troubleshooting de rendimiento. Aquí el conocimiento de bases de datos se vuelve operativo y útil para el trabajo real.",
      recommended: [
        "Oracle Database SQL",
        "Optimización de consultas",
        "Backup & recovery",
        "Roles y permisos",
      ],
      goal:
        "Gestionar bases de datos rápidas, seguras, recuperables y preparadas para entornos reales.",
      reality:
        "Las empresas no buscan solo personas que sepan consultar datos. Buscan personas que entiendan qué ocurre cuando una base de datos se vuelve lenta, insegura o inestable.",
      mistakes: [
        "Ignorar backups hasta que algo falla",
        "Agregar índices sin entender el impacto",
        "Usar privilegios admin sin lógica de seguridad",
        "Pensar que el rendimiento es un tema avanzado para estudiar más tarde",
      ],
      outcomes: [
        "Comprender fiabilidad y recovery de bases de datos",
        "Reconocer problemas comunes de rendimiento",
        "Acercarse a caminos DBA, backend y data engineering",
      ],
      ctaQuizSlug: "oracle-database-sql",
      ctaCertSlug: "oracle-database-sql",
      ctaPrimaryText: "Empezar quiz Oracle Database SQL",
      ctaSecondaryText: "Ver certificación Oracle Database SQL",
    },

    {
      title: "🔴 Nivel 3 — NoSQL y mentalidad moderna",
      body:
        "Cuando entiendas bien el mundo relacional, añade NoSQL. MongoDB es útil para esquemas flexibles, modelos documentales y aplicaciones modernas, pero no reemplaza los fundamentos SQL.",
      recommended: ["MongoDB Developer"],
      goal:
        "Comprender cuándo NoSQL tiene sentido y cómo modelar documentos correctamente.",
      reality:
        "NoSQL es potente, pero muchas veces mal entendido. El objetivo no es evitar estructura, sino elegir el modelo de datos correcto para el problema correcto.",
      mistakes: [
        "Usar MongoDB solo porque parece más fácil",
        "Crear documentos sin lógica estructural",
        "Ignorar consistencia y patrones de consulta",
        "Pensar que NoSQL reemplaza siempre SQL",
      ],
      outcomes: [
        "Comprender cuándo MongoDB encaja bien",
        "Modelar datos documentales de forma más clara",
        "Combinar mentalidad SQL y NoSQL en apps modernas",
      ],
      ctaQuizSlug: "mongodb-developer",
      ctaCertSlug: "mongodb-developer",
      ctaPrimaryText: "Empezar quiz MongoDB",
      ctaSecondaryText: "Ver certificación MongoDB",
    },
  ],

  salaryTitle: "💰 Salarios Database (2026)",
  salaryIntro:
    "Los rangos salariales globales cambian según el país, la empresa y la especialización. Úsalos como orientación, no como promesa.",
  salaryRanges: [
    { label: "Junior", range: "$45k–$70k" },
    { label: "Mid-level", range: "$75k–$110k" },
    { label: "Senior / DBA", range: "$120k+" },
  ],
  salaryDisclaimer:
    "El crecimiento más rápido suele venir de combinar SQL, rendimiento, fiabilidad de bases de datos y proyectos reales.",

  compareTitle: "🔍 SQL vs NoSQL — ¿por dónde empezar?",
  compareIntro:
    "La mayoría de las personas debería empezar por SQL. NoSQL tiene mucho más sentido después de entender bien el modelo relacional.",
  compareLeftTitle: "SQL / Relacional",
  compareRightTitle: "NoSQL / MongoDB",

  compareRows: [
    {
      label: "Ideal para",
      left: "Datos estructurados, reporting y consistencia",
      right: "Modelos flexibles e iteración rápida",
    },
    {
      label: "Uso típico",
      left: "Apps empresariales y sistemas enterprise",
      right: "Apps modernas y sistemas documentales",
    },
    {
      label: "¿Empezar aquí?",
      left: "Sí, para la mayoría",
      right: "Después de SQL",
    },
  ],

  compareRecommendationTitle: "Recomendación",
  compareRecommendationBody:
    "Empieza primero con SQL. Gana seguridad con MySQL o SQL Server y añade MongoDB más adelante.",

  faqTitle: "FAQ",

  faq: [
    {
      q: "¿Qué base de datos debería estudiar primero?",
      a: "Empieza por fundamentos SQL. MySQL suele ser la entrada más simple y práctica.",
    },
    {
      q: "¿Necesito Oracle?",
      a: "Solo si apuntas a entornos enterprise donde Oracle sea muy común. Es útil, pero no obligatorio para todos.",
    },
    {
      q: "¿MongoDB basta para conseguir trabajo?",
      a: "Ayuda, pero SQL sigue siendo la base más universal que esperan las empresas.",
    },
    {
      q: "¿Cómo puedo ser empleable más rápido?",
      a: "Crea un mini proyecto real: esquema, consultas, índices, backups y razonamiento sobre rendimiento.",
    },
  ],

  finalCtaTitle: "🚀 Empieza ahora (camino práctico)",

  finalCtaBody:
    "Aprende primero SQL. Practica cada día. Luego refuerza el camino relacional y añade MongoDB solo cuando las bases se sientan naturales.",
},

 fr: {
  title: "Parcours Certifications Bases de Données 2026",
  subtitle: "Des bases SQL aux vraies compétences base de données",
  intro:
    "Les bases de données sont derrière presque tous les produits numériques sérieux : sites web, applications, analytics, cloud, systèmes d’entreprise et IA. Ce parcours vous guide étape par étape : d’abord SQL, puis les bases relationnelles, ensuite l’administration et les performances, et enfin NoSQL lorsque les fondations sont solides.",

  ctaPrimary: "Commencer avec le quiz MySQL",
  ctaSecondary: "Voir la certification SQL Server",
  certCta: "Voir la certification",

  goalLabel: "Objectif :",
  practiceCta: "S’entraîner maintenant",

  levels: [
    {
      title: "🟢 Niveau 0 — Fondamentaux SQL",
      body:
        "Commencez par la base universelle : SELECT, WHERE, ORDER BY, JOIN, GROUP BY, sous-requêtes, contraintes, index et normalisation de base. Avant de penser aux outils avancés, vous devez comprendre comment les données sont stockées, reliées et interrogées.",
      recommended: ["MySQL", "SQL pratique"],
      goal:
        "Écrire des requêtes SQL avec confiance et comprendre les relations entre les tables.",
      reality:
        "Beaucoup de débutants sous-estiment SQL parce qu’il semble simple au départ. En réalité, de mauvaises bases SQL vous bloqueront plus tard en backend, analytics, cloud et administration base de données.",
      mistakes: [
        "Mémoriser la syntaxe sans écrire de vraies requêtes",
        "Ignorer les JOIN et les relations entre tables",
        "Négliger la normalisation et la cohérence des données",
        "Passer à NoSQL trop tôt sans comprendre le relationnel",
      ],
      outcomes: [
        "Écrire des requêtes SQL basiques et intermédiaires",
        "Comprendre tables, clés et relations",
        "Construire des bases solides pour backend, data et cloud",
      ],
      ctaQuizSlug: "mysql-certification",
      ctaCertSlug: "mysql-certification",
      ctaPrimaryText: "Commencer le quiz MySQL",
      ctaSecondaryText: "Voir la certification MySQL",
    },

    {
      title: "🟡 Niveau 1 — Bases de données relationnelles",
      body:
        "Quand les bases SQL deviennent solides, choisissez un écosystème relationnel. MySQL est pratique et très répandu, SQL Server est fort dans les environnements Microsoft/enterprise, et Oracle reste dominant dans de nombreux contextes enterprise traditionnels.",
      recommended: [
        "MySQL",
        "Microsoft SQL Server",
        "Oracle Database SQL",
      ],
      goal:
        "Comprendre transactions, verrous, execution plans et bases des performances.",
      reality:
        "À ce niveau, le défi n’est plus seulement d’écrire des requêtes. Vous devez comprendre comment les bases de données réagissent avec de vrais utilisateurs, de vraies données et de vraies règles métier.",
      mistakes: [
        "Penser que toutes les bases fonctionnent de la même façon",
        "Ignorer transactions et cohérence",
        "Écrire des requêtes sans réfléchir aux performances",
        "Choisir une base uniquement parce qu’elle est populaire",
      ],
      outcomes: [
        "Comprendre les principaux écosystèmes relationnels",
        "Lire des execution plans à un niveau basique",
        "Se préparer aux parcours SQL Server, MySQL ou Oracle",
      ],
      ctaQuizSlug: "microsoft-sql-server",
      ctaCertSlug: "microsoft-sql-server",
      ctaPrimaryText: "Commencer le quiz SQL Server",
      ctaSecondaryText: "Voir la certification SQL Server",
    },

    {
      title: "🟠 Niveau 2 — Administration, fiabilité et performances",
      body:
        "Allez au-delà des requêtes. Apprenez la stratégie d’index, les permissions, les sauvegardes, le monitoring, le recovery, les rôles et le troubleshooting des performances. Ici, les compétences base de données deviennent réellement opérationnelles.",
      recommended: [
        "Oracle Database SQL",
        "Optimisation des requêtes",
        "Backup & recovery",
        "Rôles et permissions",
      ],
      goal:
        "Gérer des bases de données rapides, sûres, récupérables et prêtes pour des environnements réels.",
      reality:
        "Les entreprises ne recherchent pas seulement des personnes capables d’interroger des données. Elles recherchent des personnes qui comprennent ce qui se passe lorsqu’une base devient lente, instable ou dangereuse.",
      mistakes: [
        "Ignorer les sauvegardes jusqu’au problème",
        "Ajouter des index sans comprendre l’impact",
        "Utiliser des privilèges admin sans logique de sécurité",
        "Penser que les performances sont un sujet avancé à voir plus tard",
      ],
      outcomes: [
        "Comprendre fiabilité et recovery des bases",
        "Reconnaître les problèmes courants de performance",
        "Se rapprocher des parcours DBA, backend et data engineering",
      ],
      ctaQuizSlug: "oracle-database-sql",
      ctaCertSlug: "oracle-database-sql",
      ctaPrimaryText: "Commencer le quiz Oracle Database SQL",
      ctaSecondaryText:
        "Voir la certification Oracle Database SQL",
    },

    {
      title: "🔴 Niveau 3 — NoSQL et mentalité moderne",
      body:
        "Quand le relationnel devient naturel, ajoutez NoSQL. MongoDB est utile pour les schémas flexibles, les modèles documentaires et les applications modernes, mais il ne remplace pas les fondamentaux SQL.",
      recommended: ["MongoDB Developer"],
      goal:
        "Comprendre quand NoSQL est pertinent et comment modéliser correctement des documents.",
      reality:
        "NoSQL est puissant mais souvent mal compris. Le but n’est pas d’éviter toute structure, mais de choisir le bon modèle de données pour le bon problème.",
      mistakes: [
        "Utiliser MongoDB uniquement parce qu’il semble plus simple",
        "Créer des documents sans logique structurelle",
        "Ignorer cohérence et patterns de requêtes",
        "Penser que NoSQL remplace toujours SQL",
      ],
      outcomes: [
        "Comprendre quand MongoDB est adapté",
        "Modéliser des données documentaires plus clairement",
        "Combiner logique SQL et NoSQL dans les applications modernes",
      ],
      ctaQuizSlug: "mongodb-developer",
      ctaCertSlug: "mongodb-developer",
      ctaPrimaryText: "Commencer le quiz MongoDB",
      ctaSecondaryText: "Voir la certification MongoDB",
    },
  ],

  salaryTitle: "💰 Salaires Database (2026)",
  salaryIntro:
    "Les fourchettes salariales mondiales varient selon le pays, l’entreprise et la spécialisation. Utilisez-les comme repère, pas comme promesse.",
  salaryRanges: [
    { label: "Junior", range: "$45k–$70k" },
    { label: "Mid-level", range: "$75k–$110k" },
    { label: "Senior / DBA", range: "$120k+" },
  ],
  salaryDisclaimer:
    "La progression la plus rapide vient souvent de la combinaison SQL, performances, fiabilité base de données et projets réels.",

  compareTitle: "🔍 SQL vs NoSQL — par quoi commencer ?",
  compareIntro:
    "La majorité des personnes devrait commencer par SQL. NoSQL devient plus logique après avoir bien compris le relationnel.",
  compareLeftTitle: "SQL / Relationnel",
  compareRightTitle: "NoSQL / MongoDB",

  compareRows: [
    {
      label: "Idéal pour",
      left: "Données structurées, reporting, cohérence",
      right: "Modèles flexibles, itération rapide",
    },
    {
      label: "Usage typique",
      left: "Applications business et systèmes enterprise",
      right: "Applications modernes et systèmes documentaires",
    },
    {
      label: "Commencer ici ?",
      left: "Oui, pour la majorité",
      right: "Après SQL",
    },
  ],

  compareRecommendationTitle: "Recommandation",
  compareRecommendationBody:
    "Commencez par SQL. Prenez confiance avec MySQL ou SQL Server puis ajoutez MongoDB plus tard.",

  faqTitle: "FAQ",

  faq: [
    {
      q: "Quelle base de données apprendre en premier ?",
      a: "Commencez par les fondamentaux SQL. MySQL est souvent le point d’entrée le plus simple et le plus pratique.",
    },
    {
      q: "Ai-je besoin d’Oracle ?",
      a: "Seulement si vous visez des environnements enterprise où Oracle est très répandu. C’est utile, mais pas obligatoire pour tout le monde.",
    },
    {
      q: "MongoDB suffit-il pour trouver un travail ?",
      a: "C’est utile, mais SQL reste la base la plus universelle attendue par les entreprises.",
    },
    {
      q: "Comment devenir employable plus rapidement ?",
      a: "Créez un mini projet réel : schéma, requêtes, index, sauvegardes et logique de performance.",
    },
  ],

  finalCtaTitle: "🚀 Commencez maintenant (parcours pratique)",

  finalCtaBody:
    "Apprenez d’abord SQL. Entraînez-vous chaque jour. Puis renforcez le relationnel et ajoutez MongoDB seulement quand les bases deviennent naturelles.",
},
};