import Link from "next/link";

type Locale = "it" | "en" | "es" | "fr";

type QuizSlug =
  | "mysql-certification"
  | "mongodb-developer"
  | "microsoft-sql-server"
  | "oracle-database-sql";

type CertSlug =
  | "mysql-certification"
  | "mongodb-developer"
  | "microsoft-sql-server"
  | "oracle-database-sql";

const quiz = (lang: Locale, slug: QuizSlug) => `/${lang}/quiz/${slug}`;

const cert = (lang: Locale, slug: CertSlug) => {
  if (lang === "it") return `/it/certificazioni/${slug}`;
  if (lang === "fr") return `/fr/certifications/${slug}`;
  if (lang === "es") return `/es/certificaciones/${slug}`;
  return `/certifications/${slug}`;
};

export default function DatabasesRoadmapPage({ lang }: { lang: Locale }) {
  const t = CONTENT[lang];

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      {/* HERO */}
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          {t.title}
        </h1>
        <p className="mt-2 text-lg text-slate-600">{t.subtitle}</p>
        <p className="mt-5 text-slate-700 leading-relaxed">{t.intro}</p>

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
      ctaQuizSlug?: QuizSlug;
      ctaCertSlug?: CertSlug;
      ctaPrimaryText?: string;
      ctaSecondaryText?: string;
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
      "Databases are everywhere: websites, apps, analytics, cloud, and AI. This roadmap helps you grow step by step: first SQL, then stronger relational skills, then administration and performance, and finally NoSQL.",

    ctaPrimary: "Start with MySQL quiz",
    ctaSecondary: "Explore SQL Server certification",
    certCta: "Explore certification",

    goalLabel: "Goal:",
    practiceCta: "Practice now",

    levels: [
      {
        title: "🟢 Level 0 — SQL fundamentals",
        body:
          "Start with the universal base: SELECT, WHERE, ORDER BY, JOIN, GROUP BY, subqueries, constraints, indexes, and basic normalization.",
        recommended: ["MySQL", "SQL fundamentals in practice"],
        goal: "Write SQL queries with confidence and understand how tables relate.",
        ctaQuizSlug: "mysql-certification",
        ctaCertSlug: "mysql-certification",
        ctaPrimaryText: "Start MySQL quiz",
        ctaSecondaryText: "Explore MySQL certification",
      },
      {
        title: "🟡 Level 1 — Relational databases (choose your path)",
        body:
          "Once SQL basics are clear, choose a relational ecosystem: MySQL for broad practical use, SQL Server for Microsoft and enterprise environments, or Oracle for classic enterprise database work.",
        recommended: ["MySQL", "Microsoft SQL Server", "Oracle Database SQL"],
        goal: "Understand transactions, locks, execution plans, and performance basics.",
        ctaQuizSlug: "microsoft-sql-server",
        ctaCertSlug: "microsoft-sql-server",
        ctaPrimaryText: "Start SQL Server quiz",
        ctaSecondaryText: "Explore SQL Server certification",
      },
      {
        title: "🟠 Level 2 — Administration, reliability & enterprise depth",
        body:
          "Go beyond queries: indexing strategy, permissions, backups, monitoring, recovery, and a more enterprise-oriented database mindset.",
        recommended: [
          "Oracle Database SQL",
          "Query optimization",
          "Backups & recovery",
          "Roles and permissions",
        ],
        goal: "Keep a database fast, safe, recoverable, and enterprise-ready.",
        ctaQuizSlug: "oracle-database-sql",
        ctaCertSlug: "oracle-database-sql",
        ctaPrimaryText: "Start Oracle Database SQL quiz",
        ctaSecondaryText: "Explore Oracle Database SQL certification",
      },
      {
        title: "🔴 Level 3 — NoSQL & modern application mindset",
        body:
          "After you understand relational models well, add NoSQL. MongoDB is useful for flexible schemas, document-based modeling, and modern application data patterns.",
        recommended: ["MongoDB Developer"],
        goal: "Understand when NoSQL fits and how to model documents properly.",
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
      "The fastest growth usually comes from combining SQL skills, performance knowledge, and a real project portfolio.",

    compareTitle: "🔍 SQL vs NoSQL — which one first?",
    compareIntro:
      "Most people should start with SQL. NoSQL makes more sense after you understand relational thinking well.",
    compareLeftTitle: "SQL (Relational)",
    compareRightTitle: "NoSQL (MongoDB)",
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
        left: "Yes (recommended)",
        right: "After SQL basics",
      },
    ],
    compareRecommendationTitle: "Recommendation",
    compareRecommendationBody:
      "Start with SQL first. Build confidence with MySQL or SQL Server, then add MongoDB later.",

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

    finalCtaTitle: "🚀 Start now (practical path)",
    finalCtaBody:
      "Start with SQL first. Practice every day. Then strengthen your relational path and add MongoDB only when the basics feel natural.",
  },

  it: {
    title: "Roadmap Certificazioni Database 2026",
    subtitle: "Dalle basi SQL a competenze reali sui database",
    intro:
      "I database sono ovunque: siti, app, analytics, cloud e AI. Questa roadmap ti fa crescere passo dopo passo: prima SQL, poi relazionale più forte, poi amministrazione e performance, infine NoSQL.",

    ctaPrimary: "Inizia con il quiz MySQL",
    ctaSecondary: "Scopri la certificazione SQL Server",
    certCta: "Scopri la certificazione",

    goalLabel: "Obiettivo:",
    practiceCta: "Allenati ora",

    levels: [
      {
        title: "🟢 Livello 0 — Fondamenti SQL",
        body:
          "Parti dalla base universale: SELECT, WHERE, ORDER BY, JOIN, GROUP BY, subquery, vincoli, indici e normalizzazione base.",
        recommended: ["MySQL", "SQL in pratica"],
        goal: "Scrivere query con sicurezza e capire le relazioni tra tabelle.",
        ctaQuizSlug: "mysql-certification",
        ctaCertSlug: "mysql-certification",
        ctaPrimaryText: "Inizia il quiz MySQL",
        ctaSecondaryText: "Scopri la certificazione MySQL",
      },
      {
        title: "🟡 Livello 1 — Relazionali (scegli il tuo percorso)",
        body:
          "Quando le basi SQL sono chiare, scegli un ecosistema relazionale: MySQL per uso ampio e pratico, SQL Server per ambienti Microsoft/enterprise, o Oracle per contesti enterprise classici.",
        recommended: ["MySQL", "Microsoft SQL Server", "Oracle Database SQL"],
        goal: "Capire transazioni, lock, execution plan e performance base.",
        ctaQuizSlug: "microsoft-sql-server",
        ctaCertSlug: "microsoft-sql-server",
        ctaPrimaryText: "Inizia il quiz SQL Server",
        ctaSecondaryText: "Scopri la certificazione SQL Server",
      },
      {
        title: "🟠 Livello 2 — Amministrazione, affidabilità e profondità enterprise",
        body:
          "Vai oltre le query: strategia indici, permessi, backup, monitoraggio, recovery e mentalità da database enterprise.",
        recommended: [
          "Oracle Database SQL",
          "Ottimizzazione query",
          "Backup & recovery",
          "Ruoli e permessi",
        ],
        goal: "Tenere un database veloce, sicuro, ripristinabile e pronto per contesti enterprise.",
        ctaQuizSlug: "oracle-database-sql",
        ctaCertSlug: "oracle-database-sql",
        ctaPrimaryText: "Inizia il quiz Oracle Database SQL",
        ctaSecondaryText: "Scopri la certificazione Oracle Database SQL",
      },
      {
        title: "🔴 Livello 3 — NoSQL e mentalità moderna",
        body:
          "Quando hai capito bene il relazionale, aggiungi NoSQL. MongoDB è utile per schemi flessibili, documenti e app moderne.",
        recommended: ["MongoDB Developer"],
        goal: "Capire quando NoSQL ha senso e modellare documenti correttamente.",
        ctaQuizSlug: "mongodb-developer",
        ctaCertSlug: "mongodb-developer",
        ctaPrimaryText: "Inizia il quiz MongoDB",
        ctaSecondaryText: "Scopri la certificazione MongoDB",
      },
    ],

    salaryTitle: "💰 Salary outlook Database (2026)",
    salaryIntro:
      "I range globali cambiano in base a paese, azienda e specializzazione. Usali come orientamento, non come promessa.",
    salaryRanges: [
      { label: "Junior", range: "$45k–$70k" },
      { label: "Mid-level", range: "$75k–$110k" },
      { label: "Senior / DBA", range: "$120k+" },
    ],
    salaryDisclaimer:
      "La crescita più veloce arriva spesso da SQL + performance + progetto reale, non solo teoria.",

    compareTitle: "🔍 SQL vs NoSQL — cosa studiare prima?",
    compareIntro:
      "Quasi tutti dovrebbero partire da SQL. NoSQL ha molto più senso dopo aver capito bene il relazionale.",
    compareLeftTitle: "SQL (Relazionale)",
    compareRightTitle: "NoSQL (MongoDB)",
    compareRows: [
      {
        label: "Ideale per",
        left: "Dati strutturati, report, consistenza",
        right: "Modelli flessibili, iterazione rapida",
      },
      {
        label: "Uso tipico",
        left: "Business app, sistemi enterprise",
        right: "App moderne, sistemi orientati a documenti",
      },
      {
        label: "Parto da qui?",
        left: "Sì (consigliato)",
        right: "Dopo le basi SQL",
      },
    ],
    compareRecommendationTitle: "Consiglio pratico",
    compareRecommendationBody:
      "Parti da SQL. Costruisci sicurezza con MySQL o SQL Server, poi aggiungi MongoDB più avanti.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "Che database studio per primo?",
        a: "Parti dalle basi SQL. MySQL è di solito il punto di ingresso più semplice e pratico.",
      },
      {
        q: "Mi serve Oracle?",
        a: "Solo se punti a contesti enterprise dove Oracle è diffuso. È utile, ma non obbligatorio per tutti.",
      },
      {
        q: "MongoDB basta per lavorare?",
        a: "Aiuta, ma SQL resta la baseline più universale e richiesta.",
      },
      {
        q: "Come divento spendibile più in fretta?",
        a: "Fai un mini progetto reale: schema, query, indici, backup plan e ragionamento sulle performance.",
      },
    ],

    finalCtaTitle: "🚀 Parti ora (percorso pratico)",
    finalCtaBody:
      "Impara prima SQL. Allenati ogni giorno. Poi rafforza il relazionale e aggiungi MongoDB solo quando le basi ti vengono naturali.",
  },

  es: {
    title: "Ruta de Certificaciones de Bases de Datos 2026",
    subtitle: "De SQL básico a habilidades reales sobre bases de datos",
    intro:
      "Las bases de datos están en todas partes: webs, apps, analítica, cloud e IA. Esta ruta te hace crecer paso a paso: primero SQL, luego una base relacional más fuerte, después administración y rendimiento, y finalmente NoSQL.",

    ctaPrimary: "Empezar con el quiz MySQL",
    ctaSecondary: "Ver certificación SQL Server",
    certCta: "Ver certificación",

    goalLabel: "Objetivo:",
    practiceCta: "Practicar ahora",

    levels: [
      {
        title: "🟢 Nivel 0 — Fundamentos SQL",
        body:
          "Empieza por la base universal: SELECT, WHERE, ORDER BY, JOIN, GROUP BY, subconsultas, constraints, índices y normalización básica.",
        recommended: ["MySQL", "SQL en práctica"],
        goal: "Escribir consultas con confianza y entender las relaciones entre tablas.",
        ctaQuizSlug: "mysql-certification",
        ctaCertSlug: "mysql-certification",
        ctaPrimaryText: "Empezar quiz MySQL",
        ctaSecondaryText: "Ver certificación MySQL",
      },
      {
        title: "🟡 Nivel 1 — Relacional (elige tu camino)",
        body:
          "Cuando las bases SQL estén claras, elige un ecosistema relacional: MySQL para uso amplio, SQL Server para entornos Microsoft/enterprise, u Oracle para contextos enterprise clásicos.",
        recommended: ["MySQL", "Microsoft SQL Server", "Oracle Database SQL"],
        goal: "Entender transacciones, locks, execution plans y rendimiento básico.",
        ctaQuizSlug: "microsoft-sql-server",
        ctaCertSlug: "microsoft-sql-server",
        ctaPrimaryText: "Empezar quiz SQL Server",
        ctaSecondaryText: "Ver certificación SQL Server",
      },
      {
        title: "🟠 Nivel 2 — Administración, fiabilidad y profundidad enterprise",
        body:
          "Ve más allá de las consultas: estrategia de índices, permisos, backups, monitorización, recovery y mentalidad de base de datos enterprise.",
        recommended: [
          "Oracle Database SQL",
          "Optimización de consultas",
          "Backup & recovery",
          "Roles y permisos",
        ],
        goal: "Mantener una base de datos rápida, segura, recuperable y preparada para entornos enterprise.",
        ctaQuizSlug: "oracle-database-sql",
        ctaCertSlug: "oracle-database-sql",
        ctaPrimaryText: "Empezar quiz Oracle Database SQL",
        ctaSecondaryText: "Ver certificación Oracle Database SQL",
      },
      {
        title: "🔴 Nivel 3 — NoSQL y mentalidad moderna",
        body:
          "Cuando entiendas bien el mundo relacional, añade NoSQL. MongoDB es útil para esquemas flexibles, documentos y aplicaciones modernas.",
        recommended: ["MongoDB Developer"],
        goal: "Entender cuándo NoSQL encaja y cómo modelar documentos correctamente.",
        ctaQuizSlug: "mongodb-developer",
        ctaCertSlug: "mongodb-developer",
        ctaPrimaryText: "Empezar quiz MongoDB",
        ctaSecondaryText: "Ver certificación MongoDB",
      },
    ],

    salaryTitle: "💰 Salary outlook DB (2026)",
    salaryIntro:
      "Los rangos globales cambian según país, empresa y especialización. Úsalos como orientación, no como promesa.",
    salaryRanges: [
      { label: "Junior", range: "$45k–$70k" },
      { label: "Mid-level", range: "$75k–$110k" },
      { label: "Senior / DBA", range: "$120k+" },
    ],
    salaryDisclaimer:
      "El crecimiento más rápido suele venir de combinar SQL + rendimiento + un proyecto real, no solo teoría.",

    compareTitle: "🔍 SQL vs NoSQL — ¿qué estudiar primero?",
    compareIntro:
      "Casi todo el mundo debería empezar por SQL. NoSQL tiene mucho más sentido después de entender bien el modelo relacional.",
    compareLeftTitle: "SQL (Relacional)",
    compareRightTitle: "NoSQL (MongoDB)",
    compareRows: [
      {
        label: "Ideal para",
        left: "Datos estructurados, reporting, consistencia",
        right: "Modelos flexibles, iteración rápida",
      },
      {
        label: "Uso típico",
        left: "Apps de negocio, sistemas enterprise",
        right: "Apps modernas, sistemas documentales",
      },
      {
        label: "¿Empiezo aquí?",
        left: "Sí (recomendado)",
        right: "Después de SQL",
      },
    ],
    compareRecommendationTitle: "Recomendación",
    compareRecommendationBody:
      "Empieza por SQL. Gana seguridad con MySQL o SQL Server y luego añade MongoDB más adelante.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "¿Qué base de datos estudiar primero?",
        a: "Empieza por fundamentos SQL. MySQL suele ser la entrada más simple y práctica.",
      },
      {
        q: "¿Necesito Oracle?",
        a: "Solo si apuntas a entornos enterprise donde Oracle sea común. Es útil, pero no obligatorio para todos.",
      },
      {
        q: "¿MongoDB basta para trabajar?",
        a: "Ayuda, pero SQL sigue siendo la base más universal y demandada.",
      },
      {
        q: "¿Cómo ser empleable más rápido?",
        a: "Haz un mini proyecto real: schema, consultas, índices, plan de backup y razonamiento de rendimiento.",
      },
    ],

    finalCtaTitle: "🚀 Empieza ahora (camino práctico)",
    finalCtaBody:
      "Aprende primero SQL. Practica cada día. Luego refuerza el camino relacional y añade MongoDB solo cuando la base sea natural.",
  },

  fr: {
    title: "Parcours Certifications Bases de Données 2026",
    subtitle: "Des bases SQL aux vraies compétences base de données",
    intro:
      "Les bases de données sont partout : sites, applis, analytics, cloud et IA. Ce parcours vous fait progresser étape par étape : d’abord SQL, puis une base relationnelle plus forte, ensuite administration et performance, et enfin NoSQL.",

    ctaPrimary: "Commencer avec le quiz MySQL",
    ctaSecondary: "Voir la certification SQL Server",
    certCta: "Voir la certification",

    goalLabel: "Objectif :",
    practiceCta: "S’entraîner",

    levels: [
      {
        title: "🟢 Niveau 0 — Fondamentaux SQL",
        body:
          "Commencez par la base universelle : SELECT, WHERE, ORDER BY, JOIN, GROUP BY, sous-requêtes, contraintes, index et normalisation de base.",
        recommended: ["MySQL", "SQL en pratique"],
        goal: "Écrire des requêtes avec confiance et comprendre les relations entre les tables.",
        ctaQuizSlug: "mysql-certification",
        ctaCertSlug: "mysql-certification",
        ctaPrimaryText: "Commencer le quiz MySQL",
        ctaSecondaryText: "Voir la certification MySQL",
      },
      {
        title: "🟡 Niveau 1 — Relationnel (choisissez votre voie)",
        body:
          "Quand les bases SQL sont claires, choisissez un écosystème relationnel : MySQL pour un usage large, SQL Server pour les environnements Microsoft/enterprise, ou Oracle pour les contextes enterprise classiques.",
        recommended: ["MySQL", "Microsoft SQL Server", "Oracle Database SQL"],
        goal: "Comprendre transactions, verrous, execution plans et performance de base.",
        ctaQuizSlug: "microsoft-sql-server",
        ctaCertSlug: "microsoft-sql-server",
        ctaPrimaryText: "Commencer le quiz SQL Server",
        ctaSecondaryText: "Voir la certification SQL Server",
      },
      {
        title: "🟠 Niveau 2 — Administration, fiabilité et profondeur enterprise",
        body:
          "Allez au-delà des requêtes : stratégie d’index, permissions, sauvegardes, monitoring, recovery et mentalité base de données enterprise.",
        recommended: [
          "Oracle Database SQL",
          "Optimisation des requêtes",
          "Backup & recovery",
          "Rôles et permissions",
        ],
        goal: "Garder une base de données rapide, sûre, récupérable et prête pour les contextes enterprise.",
        ctaQuizSlug: "oracle-database-sql",
        ctaCertSlug: "oracle-database-sql",
        ctaPrimaryText: "Commencer le quiz Oracle Database SQL",
        ctaSecondaryText: "Voir la certification Oracle Database SQL",
      },
      {
        title: "🔴 Niveau 3 — NoSQL et mentalité moderne",
        body:
          "Quand vous comprenez bien le relationnel, ajoutez NoSQL. MongoDB est utile pour les schémas flexibles, les documents et les applis modernes.",
        recommended: ["MongoDB Developer"],
        goal: "Comprendre quand NoSQL a du sens et comment modéliser correctement les documents.",
        ctaQuizSlug: "mongodb-developer",
        ctaCertSlug: "mongodb-developer",
        ctaPrimaryText: "Commencer le quiz MongoDB",
        ctaSecondaryText: "Voir la certification MongoDB",
      },
    ],

    salaryTitle: "💰 Salary outlook DB (2026)",
    salaryIntro:
      "Les fourchettes mondiales varient selon le pays, l’entreprise et la spécialisation. Utilisez-les comme repère, pas comme promesse.",
    salaryRanges: [
      { label: "Junior", range: "$45k–$70k" },
      { label: "Mid-level", range: "$75k–$110k" },
      { label: "Senior / DBA", range: "$120k+" },
    ],
    salaryDisclaimer:
      "La croissance la plus rapide vient souvent de SQL + performance + projet réel, pas seulement de la théorie.",

    compareTitle: "🔍 SQL vs NoSQL — quoi étudier d’abord ?",
    compareIntro:
      "La plupart des gens devraient commencer par SQL. NoSQL a beaucoup plus de sens après avoir bien compris le relationnel.",
    compareLeftTitle: "SQL (Relationnel)",
    compareRightTitle: "NoSQL (MongoDB)",
    compareRows: [
      {
        label: "Idéal pour",
        left: "Données structurées, reporting, cohérence",
        right: "Modèles flexibles, itération rapide",
      },
      {
        label: "Usage typique",
        left: "Applications business, systèmes enterprise",
        right: "Applis modernes, systèmes orientés documents",
      },
      {
        label: "Commencer ici ?",
        left: "Oui (recommandé)",
        right: "Après SQL",
      },
    ],
    compareRecommendationTitle: "Recommandation",
    compareRecommendationBody:
      "Commencez par SQL. Prenez confiance avec MySQL ou SQL Server, puis ajoutez MongoDB plus tard.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "Quelle base de données apprendre en premier ?",
        a: "Commencez par les fondamentaux SQL. MySQL est souvent l’entrée la plus simple et la plus pratique.",
      },
      {
        q: "Ai-je besoin d’Oracle ?",
        a: "Seulement si vous visez des environnements enterprise où Oracle est courant. C’est utile, mais pas obligatoire pour tout le monde.",
      },
      {
        q: "MongoDB suffit-il pour travailler ?",
        a: "C’est utile, mais SQL reste la base la plus universelle et la plus demandée.",
      },
      {
        q: "Comment devenir employable plus vite ?",
        a: "Faites un mini projet réel : schéma, requêtes, index, plan de sauvegarde et logique de performance.",
      },
    ],

    finalCtaTitle: "🚀 Commencez maintenant (parcours pratique)",
    finalCtaBody:
      "Apprenez d’abord SQL. Entraînez-vous chaque jour. Puis renforcez le relationnel et ajoutez MongoDB seulement quand la base devient naturelle.",
  },
};