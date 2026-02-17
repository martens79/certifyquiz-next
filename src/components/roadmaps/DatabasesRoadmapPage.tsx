import Link from "next/link";

type Locale = "it" | "en" | "es" | "fr";

type QuizSlug =
  | "mysql"
  | "mongodb-developer"
  | "microsoft-sql-server"
  | "oracle-database-sql";

const quiz = (lang: Locale, slug: QuizSlug) => `/${lang}/quiz/${slug}`;

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
            href={quiz(lang, "mysql")}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition"
          >
            {t.ctaPrimary}
          </Link>

          <Link
            href={quiz(lang, "microsoft-sql-server")}
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

            {lvl.ctaQuizSlug ? (
              <div className="mt-4">
                <Link
                  href={quiz(lang, lvl.ctaQuizSlug)}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800 transition"
                >
                  {lvl.ctaText ?? t.practiceCta}
                </Link>
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
            href={quiz(lang, "mysql")}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition"
          >
            {t.ctaPrimary}
          </Link>
          <Link
            href={quiz(lang, "microsoft-sql-server")}
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

    goalLabel: string;
    practiceCta: string;

    levels: Array<{
      title: string;
      body: string;
      recommended?: string[];
      goal?: string;
      ctaQuizSlug?: QuizSlug;
      ctaText?: string;
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
      "Databases are everywhere: websites, apps, analytics, cloud, AI. This roadmap helps you build a practical database foundation—starting with SQL, then choosing a direction (MySQL, SQL Server, Oracle, MongoDB).",

    ctaPrimary: "Start with MySQL quiz",
    ctaSecondary: "Or practice SQL Server",

    goalLabel: "Goal:",
    practiceCta: "Practice now",

    levels: [
      {
        title: "🟢 Level 0 — SQL fundamentals",
        body:
          "Start with core SQL: SELECT, JOIN, GROUP BY, subqueries, constraints, indexes, and basic normalization. This is the universal base.",
        recommended: ["MySQL (SQL basics)", "SQL fundamentals in practice"],
        goal: "Write queries confidently and understand how tables relate.",
        ctaQuizSlug: "mysql",
        ctaText: "Practice MySQL",
      },
      {
        title: "🟡 Level 1 — Relational databases (pick your ecosystem)",
        body:
          "Now choose a path based on where you want to work: enterprise (SQL Server/Oracle) or general web/business (MySQL).",
        recommended: ["Microsoft SQL Server", "Oracle Database SQL", "MySQL"],
        goal: "Learn transactions, locks, execution plans, and performance basics.",
        ctaQuizSlug: "microsoft-sql-server",
        ctaText: "Practice SQL Server",
      },
      {
        title: "🟠 Level 2 — Performance, reliability & admin mindset",
        body:
          "Real jobs require more than queries: backups, permissions, monitoring, indexing strategy, and troubleshooting slow queries.",
        recommended: ["Indexing & query optimization", "Backups & recovery", "Roles/permissions"],
        goal: "Keep a database fast, safe, and recoverable.",
      },
      {
        title: "🔴 Level 3 — NoSQL & modern data needs",
        body:
          "When you understand relational well, you can add NoSQL. MongoDB is common for flexible data models and modern apps.",
        recommended: ["MongoDB Developer"],
        goal: "Know when NoSQL fits—and how to model documents properly.",
        ctaQuizSlug: "mongodb-developer",
        ctaText: "Practice MongoDB",
      },
    ],

    salaryTitle: "💰 Database salary outlook (2026)",
    salaryIntro:
      "Global ranges vary a lot by country and role. Use as orientation.",
    salaryRanges: [
      { label: "Junior", range: "$45k–$70k" },
      { label: "Mid-level", range: "$75k–$110k" },
      { label: "Senior / DBA", range: "$120k+" },
    ],
    salaryDisclaimer:
      "The fastest growth usually comes from combining SQL + performance + a real project (not only theory).",

    compareTitle: "🔍 SQL vs NoSQL — which one first?",
    compareIntro:
      "Most people should start with SQL. NoSQL makes more sense after you understand relational models.",
    compareLeftTitle: "SQL (Relational)",
    compareRightTitle: "NoSQL (MongoDB)",
    compareRows: [
      { label: "Best for", left: "Structured data, reporting, consistency", right: "Flexible models, rapid iteration" },
      { label: "Common use", left: "Business apps, enterprise systems", right: "Modern apps, event-like data" },
      { label: "Start here?", left: "Yes (recommended)", right: "After SQL basics" },
    ],
    compareRecommendationTitle: "Recommendation",
    compareRecommendationBody:
      "Start with SQL (MySQL/SQL Server). Add MongoDB later when you can explain normalization and joins without pain.",

    faqTitle: "FAQ",
    faq: [
      { q: "Which database should I learn first?", a: "Start with SQL fundamentals. MySQL is a great entry point." },
      { q: "Do I need Oracle?", a: "Only if you aim for enterprise environments where Oracle is common." },
      { q: "Is MongoDB enough to work?", a: "It helps, but SQL is still the most requested baseline." },
      { q: "How do I get job-ready fast?", a: "Build a small project: schema + queries + indexes + backup plan. Show it." },
    ],

    finalCtaTitle: "🚀 Start now (practical plan)",
    finalCtaBody:
      "Learn SQL first. Practice daily. Then pick an ecosystem (SQL Server/Oracle/MySQL) and add MongoDB when you’re stable.",
  },

  it: {
    title: "Roadmap Certificazioni Database 2026",
    subtitle: "Dalle basi SQL a competenze reali da database",
    intro:
      "I database sono ovunque: siti, app, analytics, cloud, AI. Questa roadmap ti guida in modo pratico: prima SQL, poi scegli un percorso (MySQL, SQL Server, Oracle, MongoDB).",

    ctaPrimary: "Inizia con il quiz MySQL",
    ctaSecondary: "Oppure allenati con SQL Server",

    goalLabel: "Obiettivo:",
    practiceCta: "Allenati ora",

    levels: [
      {
        title: "🟢 Livello 0 — Fondamenti SQL",
        body:
          "Parti da SQL: SELECT, JOIN, GROUP BY, subquery, vincoli, indici e normalizzazione base. È la base universale.",
        recommended: ["MySQL (basi SQL)", "SQL in pratica"],
        goal: "Scrivere query con sicurezza e capire le relazioni tra tabelle.",
        ctaQuizSlug: "mysql",
        ctaText: "Quiz MySQL",
      },
      {
        title: "🟡 Livello 1 — Relazionali (scegli ecosistema)",
        body:
          "Scegli in base al contesto: enterprise (SQL Server/Oracle) oppure web/business (MySQL).",
        recommended: ["Microsoft SQL Server", "Oracle Database SQL", "MySQL"],
        goal: "Capire transazioni, lock, execution plan e performance base.",
        ctaQuizSlug: "microsoft-sql-server",
        ctaText: "Quiz SQL Server",
      },
      {
        title: "🟠 Livello 2 — Performance, affidabilità, mentalità da DBA",
        body:
          "Nel lavoro servono anche: backup, permessi, monitoraggio, strategia indici e troubleshooting query lente.",
        recommended: ["Ottimizzazione query", "Backup & recovery", "Ruoli e permessi"],
        goal: "Tenere un database veloce, sicuro e ripristinabile.",
      },
      {
        title: "🔴 Livello 3 — NoSQL e bisogni moderni",
        body:
          "Quando hai capito bene il relazionale, aggiungi NoSQL. MongoDB è comune per modelli flessibili e app moderne.",
        recommended: ["MongoDB Developer"],
        goal: "Capire quando NoSQL ha senso e modellare documenti correttamente.",
        ctaQuizSlug: "mongodb-developer",
        ctaText: "Quiz MongoDB",
      },
    ],

    salaryTitle: "💰 Salary outlook Database (2026)",
    salaryIntro:
      "Range globali indicativi (variano molto per paese e ruolo).",
    salaryRanges: [
      { label: "Junior", range: "$45k–$70k" },
      { label: "Mid-level", range: "$75k–$110k" },
      { label: "Senior / DBA", range: "$120k+" },
    ],
    salaryDisclaimer:
      "Cresci più velocemente se unisci SQL + performance + un progetto reale (non solo teoria).",

    compareTitle: "🔍 SQL vs NoSQL — cosa studiare prima?",
    compareIntro:
      "Quasi tutti dovrebbero partire da SQL. NoSQL ha più senso dopo aver capito bene il relazionale.",
    compareLeftTitle: "SQL (Relazionale)",
    compareRightTitle: "NoSQL (MongoDB)",
    compareRows: [
      { label: "Ideale per", left: "Dati strutturati, report, consistenza", right: "Modelli flessibili, iterazione rapida" },
      { label: "Uso tipico", left: "Business ed enterprise", right: "App moderne, dati evento" },
      { label: "Parto da qui?", left: "Sì (consigliato)", right: "Dopo le basi SQL" },
    ],
    compareRecommendationTitle: "Consiglio pratico",
    compareRecommendationBody:
      "Parti da SQL (MySQL/SQL Server). Aggiungi MongoDB dopo, quando normalizzazione e join non ti spaventano.",

    faqTitle: "FAQ",
    faq: [
      { q: "Che database studio per primo?", a: "Basi SQL. MySQL è un ottimo punto di partenza." },
      { q: "Mi serve Oracle?", a: "Solo se punti a contesti enterprise dove Oracle è diffuso." },
      { q: "MongoDB basta per lavorare?", a: "Aiuta, ma SQL resta la baseline più richiesta." },
      { q: "Come divento spendibile più in fretta?", a: "Fai un progetto: schema + query + indici + backup plan." },
    ],

    finalCtaTitle: "🚀 Parti ora (piano pratico)",
    finalCtaBody:
      "Impara SQL prima. Allenati ogni giorno. Poi scegli ecosistema (SQL Server/Oracle/MySQL) e aggiungi MongoDB quando sei stabile.",
  },

  es: {
    title: "Ruta de Certificaciones de Bases de Datos 2026",
    subtitle: "De SQL básico a habilidades reales",
    intro:
      "Las bases de datos están en todas partes. Esta ruta es práctica: primero SQL, luego eliges un camino (MySQL, SQL Server, Oracle, MongoDB).",

    ctaPrimary: "Empieza con MySQL",
    ctaSecondary: "O practica SQL Server",

    goalLabel: "Objetivo:",
    practiceCta: "Practicar",

    levels: [
      {
        title: "🟢 Nivel 0 — Fundamentos de SQL",
        body:
          "SELECT, JOIN, GROUP BY, subconsultas, constraints, índices y normalización básica.",
        recommended: ["MySQL (SQL básico)"],
        goal: "Escribir consultas con confianza.",
        ctaQuizSlug: "mysql",
        ctaText: "Quiz MySQL",
      },
      {
        title: "🟡 Nivel 1 — Relacional (elige ecosistema)",
        body:
          "Enterprise (SQL Server/Oracle) o web/business (MySQL).",
        recommended: ["Microsoft SQL Server", "Oracle Database SQL", "MySQL"],
        goal: "Transacciones, locks y performance básica.",
        ctaQuizSlug: "microsoft-sql-server",
        ctaText: "Quiz SQL Server",
      },
      {
        title: "🟠 Nivel 2 — Performance y fiabilidad",
        body:
          "Backups, permisos, monitoreo, estrategia de índices y troubleshooting.",
        recommended: ["Optimización", "Backup & recovery", "Roles/permisos"],
        goal: "Mantener el DB rápido y seguro.",
      },
      {
        title: "🔴 Nivel 3 — NoSQL (MongoDB)",
        body:
          "Después de SQL, añade MongoDB para modelos flexibles.",
        recommended: ["MongoDB Developer"],
        goal: "Saber cuándo NoSQL encaja.",
        ctaQuizSlug: "mongodb-developer",
        ctaText: "Quiz MongoDB",
      },
    ],

    salaryTitle: "💰 Salary outlook DB (2026)",
    salaryIntro: "Rangos orientativos globales.",
    salaryRanges: [
      { label: "Junior", range: "$45k–$70k" },
      { label: "Mid-level", range: "$75k–$110k" },
      { label: "Senior / DBA", range: "$120k+" },
    ],
    salaryDisclaimer: "SQL + performance + proyecto real = más valor.",

    compareTitle: "🔍 SQL vs NoSQL — ¿qué primero?",
    compareIntro: "Empieza con SQL. NoSQL después.",
    compareLeftTitle: "SQL",
    compareRightTitle: "NoSQL (MongoDB)",
    compareRows: [
      { label: "Mejor para", left: "Estructura y consistencia", right: "Flexibilidad" },
      { label: "Uso típico", left: "Enterprise y negocio", right: "Apps modernas" },
      { label: "Empezar", left: "Sí", right: "Después de SQL" },
    ],
    compareRecommendationTitle: "Recomendación",
    compareRecommendationBody:
      "Primero SQL (MySQL/SQL Server). Luego MongoDB.",

    faqTitle: "FAQ",
    faq: [
      { q: "¿Qué aprender primero?", a: "SQL. MySQL es un buen inicio." },
      { q: "¿Oracle es obligatorio?", a: "Solo si apuntas a enterprise." },
      { q: "¿MongoDB basta?", a: "Ayuda, pero SQL sigue siendo base." },
      { q: "¿Cómo ser empleable rápido?", a: "Proyecto real con schema + índices + backup." },
    ],

    finalCtaTitle: "🚀 Empieza ahora",
    finalCtaBody: "Empieza con SQL y practica cada día.",
  },

  fr: {
    title: "Parcours Certifications Bases de Données 2026",
    subtitle: "Des bases SQL aux compétences concrètes",
    intro:
      "Les bases de données sont partout. Ce parcours est simple : d’abord SQL, puis choisissez un chemin (MySQL, SQL Server, Oracle, MongoDB).",

    ctaPrimary: "Commencer avec MySQL",
    ctaSecondary: "Ou s’entraîner sur SQL Server",

    goalLabel: "Objectif :",
    practiceCta: "S’entraîner",

    levels: [
      {
        title: "🟢 Niveau 0 — Fondamentaux SQL",
        body:
          "SELECT, JOIN, GROUP BY, sous-requêtes, contraintes, index, normalisation.",
        recommended: ["MySQL (bases SQL)"],
        goal: "Écrire des requêtes avec confiance.",
        ctaQuizSlug: "mysql",
        ctaText: "Quiz MySQL",
      },
      {
        title: "🟡 Niveau 1 — Relationnel (écosystème)",
        body:
          "Enterprise (SQL Server/Oracle) ou web/business (MySQL).",
        recommended: ["Microsoft SQL Server", "Oracle Database SQL", "MySQL"],
        goal: "Transactions, verrous, performance de base.",
        ctaQuizSlug: "microsoft-sql-server",
        ctaText: "Quiz SQL Server",
      },
      {
        title: "🟠 Niveau 2 — Performance & fiabilité",
        body:
          "Backups, permissions, monitoring, stratégie d’index, dépannage.",
        recommended: ["Optimisation", "Backup & recovery", "Rôles/permissions"],
        goal: "Garder le DB rapide et sûr.",
      },
      {
        title: "🔴 Niveau 3 — NoSQL (MongoDB)",
        body:
          "Après SQL, ajoutez MongoDB pour des modèles flexibles.",
        recommended: ["MongoDB Developer"],
        goal: "Savoir quand NoSQL est pertinent.",
        ctaQuizSlug: "mongodb-developer",
        ctaText: "Quiz MongoDB",
      },
    ],

    salaryTitle: "💰 Salary outlook DB (2026)",
    salaryIntro: "Fourchettes indicatives mondiales.",
    salaryRanges: [
      { label: "Junior", range: "$45k–$70k" },
      { label: "Mid-level", range: "$75k–$110k" },
      { label: "Senior / DBA", range: "$120k+" },
    ],
    salaryDisclaimer: "SQL + performance + projet réel = impact.",

    compareTitle: "🔍 SQL vs NoSQL — quoi d’abord ?",
    compareIntro: "Commencez par SQL. NoSQL ensuite.",
    compareLeftTitle: "SQL",
    compareRightTitle: "NoSQL (MongoDB)",
    compareRows: [
      { label: "Idéal pour", left: "Structure et cohérence", right: "Flexibilité" },
      { label: "Usage", left: "Enterprise et business", right: "Apps modernes" },
      { label: "Démarrer", left: "Oui", right: "Après SQL" },
    ],
    compareRecommendationTitle: "Recommandation",
    compareRecommendationBody:
      "SQL d’abord (MySQL/SQL Server), puis MongoDB.",

    faqTitle: "FAQ",
    faq: [
      { q: "Quoi apprendre en premier ?", a: "SQL. MySQL est un bon départ." },
      { q: "Oracle obligatoire ?", a: "Seulement si vous visez l’enterprise." },
      { q: "MongoDB suffit ?", a: "Utile, mais SQL reste la base." },
      { q: "Devenir employable vite ?", a: "Projet réel : schéma + index + backup." },
    ],

    finalCtaTitle: "🚀 Commencez maintenant",
    finalCtaBody: "Commencez par SQL et pratiquez chaque jour.",
  },
};
