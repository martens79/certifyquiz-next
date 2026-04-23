import Link from "next/link";

type Locale = "it" | "en" | "es" | "fr";

type ProgQuizSlug =
  | "python"
  | "javascript-developer"
  | "microsoft-csharp";

type ProgCertSlug =
  | "python"
  | "javascript-developer"
  | "microsoft-csharp";

export default function ProgrammingRoadmapPage({ lang }: { lang: Locale }) {
  const t = CONTENT[lang];

  const quiz = (slug: ProgQuizSlug) => `/${lang}/quiz/${slug}`;

  const cert = (slug: ProgCertSlug) => {
    if (lang === "it") return `/it/certificazioni/${slug}`;
    if (lang === "fr") return `/fr/certifications/${slug}`;
    if (lang === "es") return `/es/certificaciones/${slug}`;
    return `/certifications/${slug}`;
  };

  const categoryProgramming =
    lang === "en"
      ? "/categories/programming"
      : lang === "it"
      ? "/it/categorie/programmazione"
      : lang === "es"
      ? "/es/categorias/programacion"
      : "/fr/categories/programming";

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
            href={quiz("python")}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition"
          >
            {t.ctaPrimary}
          </Link>

          <Link
            href={categoryProgramming}
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
                    href={quiz(lvl.ctaQuizSlug)}
                    className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800 transition"
                  >
                    {lvl.ctaPrimaryText ?? t.practiceCta}
                  </Link>
                ) : null}

                {lvl.ctaCertSlug ? (
                  <Link
                    href={cert(lvl.ctaCertSlug)}
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
                <tr key={row.label}>
                  <td className="border-b py-3 pr-4 font-semibold">
                    {row.label}
                  </td>
                  <td className="border-b py-3 pr-4">{row.left}</td>
                  <td className="border-b py-3">{row.right}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mt-10 rounded-2xl border border-blue-200 bg-blue-50 p-5">
        <h2 className="text-xl font-extrabold">{t.finalCtaTitle}</h2>
        <p className="mt-2">{t.finalCtaBody}</p>
        <div className="mt-4 flex gap-3">
          <Link
            href={quiz("python")}
            className="rounded-xl bg-blue-600 px-5 py-3 text-white"
          >
            {t.ctaPrimary}
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
      ctaQuizSlug?: ProgQuizSlug;
      ctaCertSlug?: ProgCertSlug;
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
  it: {
    title: "Roadmap Programmazione 2026",
    subtitle: "Da zero a developer davvero occupabile",
    intro:
      "Programmare non significa imparare 10 linguaggi. Significa imparare a ragionare, risolvere problemi e costruire software reale. Questa roadmap ti dà un percorso chiaro: basi → primo linguaggio → struttura → progetti reali.",

    ctaPrimary: "Inizia con Python",
    ctaSecondary: "Vedi tutte le certificazioni",
    certCta: "Scopri certificazione",

    goalLabel: "Obiettivo:",
    practiceCta: "Allenati ora",

    levels: [
      {
        title: "🟢 Livello 0 — Logica e basi",
        body:
          "Prima del linguaggio, devi capire come funziona il codice: variabili, condizioni, cicli e funzioni. Questo è il vero acceleratore.",
        recommended: [
          "Logica base",
          "Problem solving",
          "Esercizi quotidiani",
        ],
        goal:
          "Imparare a ragionare da programmatore.",
      },
      {
        title: "🟡 Livello 1 — Primo linguaggio",
        body:
          "Scegli un linguaggio e non cambiarlo ogni settimana. Python è perfetto per iniziare, JavaScript se vuoi web.",
        recommended: ["Python", "JavaScript"],
        goal:
          "Scrivere codice base senza confusione.",
        ctaQuizSlug: "python",
        ctaCertSlug: "python",
        ctaPrimaryText: "Inizia Python",
        ctaSecondaryText: "Scopri Python",
      },
      {
        title: "🟠 Livello 2 — Struttura e OOP",
        body:
          "Qui diventi più serio: classi, oggetti, gestione errori, codice pulito. È il passaggio da hobby a developer.",
        recommended: ["Java", "C#"],
        goal:
          "Scrivere codice mantenibile e strutturato.",
        ctaQuizSlug: "microsoft-csharp",
        ctaCertSlug: "microsoft-csharp",
        ctaPrimaryText: "Vai su C#",
        ctaSecondaryText: "Scopri C#",
      },
      {
        title: "🔴 Livello 3 — Progetti reali",
        body:
          "Qui fai la differenza: API, database, deploy, Git. Le certificazioni contano meno dei progetti.",
        recommended: [
          "API REST",
          "Database SQL",
          "Deploy online",
        ],
        goal:
          "Costruire un portfolio reale.",
      },
    ],

    salaryTitle: "💰 Quanto guadagna un developer",
    salaryIntro:
      "Il mercato è enorme. Ma la differenza la fanno le skill reali, non solo i certificati.",
    salaryRanges: [
      { label: "Junior", range: "€30k–€45k" },
      { label: "Mid", range: "€50k–€80k" },
      { label: "Senior", range: "€90k+" },
    ],
    salaryDisclaimer:
      "Progetti reali > certificazioni.",

    compareTitle: "🔍 Python vs JavaScript",
    compareIntro:
      "Entrambi validi. Dipende da cosa vuoi fare.",
    compareLeftTitle: "Python",
    compareRightTitle: "JavaScript",
    compareRows: [
      {
        label: "Ideale per",
        left: "Basi pulite",
        right: "Web development",
      },
      {
        label: "Difficoltà",
        left: "Più semplice",
        right: "Più caotico",
      },
    ],
    compareRecommendationTitle: "Consiglio",
    compareRecommendationBody:
      "Se sei indeciso: Python. Se vuoi web: JavaScript.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "Serve certificazione?",
        a: "No, servono progetti.",
      },
      {
        q: "Quante ore studiare?",
        a: "Anche 30 min al giorno bastano se sei costante.",
      },
    ],

    finalCtaTitle: "🚀 Parti subito",
    finalCtaBody:
      "Scegli un linguaggio e non fermarti.",
  },

  en: {
    title: "Programming Roadmap 2026",
    subtitle: "From zero to job-ready developer",
    intro:
      "Programming is not about learning many languages. It’s about solving problems and building real software.",

    ctaPrimary: "Start with Python",
    ctaSecondary: "Browse certifications",
    certCta: "Explore certification",

    goalLabel: "Goal:",
    practiceCta: "Practice now",

    levels: [
      {
        title: "🟢 Level 0 — Fundamentals",
        body:
          "Learn logic first: variables, loops, conditions.",
        goal: "Think like a programmer.",
      },
      {
        title: "🟡 Level 1 — First language",
        body:
          "Choose one language and stick to it.",
        ctaQuizSlug: "python",
        ctaCertSlug: "python",
      },
      {
        title: "🟠 Level 2 — Structure",
        body:
          "Move to structured programming and OOP.",
        ctaQuizSlug: "microsoft-csharp",
        ctaCertSlug: "microsoft-csharp",
      },
      {
        title: "🔴 Level 3 — Real projects",
        body:
          "Build APIs, databases, and real apps.",
      },
    ],

    salaryTitle: "💰 Salary",
    salaryIntro: "Depends on skills.",
    salaryRanges: [
      { label: "Junior", range: "$45k–$70k" },
      { label: "Senior", range: "$120k+" },
    ],
    salaryDisclaimer: "",

    compareTitle: "Python vs JavaScript",
    compareIntro: "",
    compareLeftTitle: "Python",
    compareRightTitle: "JavaScript",
    compareRows: [],
    compareRecommendationTitle: "",
    compareRecommendationBody: "",

    faqTitle: "FAQ",
    faq: [],

    finalCtaTitle: "Start now",
    finalCtaBody: "Start coding today.",
  },

  
    es: {
    title: "Ruta Programación 2026",
    subtitle: "De cero a desarrollador listo para trabajar",
    intro:
      "Programar no es aprender muchos lenguajes. Es aprender a pensar, resolver problemas y construir software real. Esta ruta te guía paso a paso: fundamentos → primer lenguaje → estructura → proyectos reales.",

    ctaPrimary: "Empieza con Python",
    ctaSecondary: "Ver todas las certificaciones",
    certCta: "Ver certificación",

    goalLabel: "Objetivo:",
    practiceCta: "Practicar ahora",

    levels: [
      {
        title: "🟢 Nivel 0 — Lógica y fundamentos",
        body:
          "Antes de elegir un lenguaje, necesitas entender cómo funciona el código: variables, condicionales, bucles y funciones. Esto es lo que realmente acelera tu aprendizaje.",
        recommended: [
          "Lógica básica",
          "Resolución de problemas",
          "Ejercicios diarios",
        ],
        goal:
          "Aprender a pensar como programador.",
      },
      {
        title: "🟡 Nivel 1 — Primer lenguaje",
        body:
          "Elige un lenguaje y no cambies cada semana. Python es ideal para empezar; JavaScript si quieres desarrollo web.",
        recommended: ["Python", "JavaScript"],
        goal:
          "Escribir código básico sin confusión.",
        ctaQuizSlug: "python",
        ctaCertSlug: "python",
        ctaPrimaryText: "Empezar Python",
        ctaSecondaryText: "Ver Python",
      },
      {
        title: "🟠 Nivel 2 — Estructura y OOP",
        body:
          "Aquí te vuelves más serio: clases, objetos, manejo de errores y código limpio. Es el paso de principiante a desarrollador.",
        recommended: ["Java", "C#"],
        goal:
          "Escribir código estructurado y mantenible.",
        ctaQuizSlug: "microsoft-csharp",
        ctaCertSlug: "microsoft-csharp",
        ctaPrimaryText: "Ir a C#",
        ctaSecondaryText: "Ver C#",
      },
      {
        title: "🔴 Nivel 3 — Proyectos reales",
        body:
          "Aquí es donde marcas la diferencia: APIs, bases de datos, deploy, Git. Los proyectos valen más que las certificaciones.",
        recommended: [
          "API REST",
          "Bases de datos SQL",
          "Deploy online",
        ],
        goal:
          "Construir un portfolio real.",
      },
    ],

    salaryTitle: "💰 Salario developer (2026)",
    salaryIntro:
      "El mercado es enorme, pero la diferencia real la hacen las habilidades prácticas.",
    salaryRanges: [
      { label: "Junior", range: "$40k–$65k" },
      { label: "Mid", range: "$70k–$100k" },
      { label: "Senior", range: "$110k+" },
    ],
    salaryDisclaimer:
      "Los proyectos reales importan más que los certificados.",

    compareTitle: "🔍 Python vs JavaScript",
    compareIntro:
      "Ambos son válidos. Depende de tu objetivo.",
    compareLeftTitle: "Python",
    compareRightTitle: "JavaScript",
    compareRows: [
      {
        label: "Ideal para",
        left: "Fundamentos claros",
        right: "Desarrollo web",
      },
      {
        label: "Dificultad",
        left: "Más sencillo",
        right: "Más caótico",
      },
    ],
    compareRecommendationTitle: "Recomendación",
    compareRecommendationBody:
      "Si dudas: Python. Si quieres web: JavaScript.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "¿Necesito certificaciones?",
        a: "No siempre. Los proyectos reales suelen ser más importantes.",
      },
      {
        q: "¿Cuánto estudiar?",
        a: "Incluso 30 minutos al día funcionan si eres constante.",
      },
    ],

    finalCtaTitle: "🚀 Empieza ahora",
    finalCtaBody:
      "Elige un lenguaje y empieza hoy mismo.",
  },

  fr: {
    title: "Parcours Programmation 2026",
    subtitle: "De zéro à développeur employable",
    intro:
      "Programmer, ce n’est pas apprendre beaucoup de langages. C’est apprendre à réfléchir, résoudre des problèmes et créer du logiciel réel. Ce parcours te guide étape par étape.",

    ctaPrimary: "Commencer avec Python",
    ctaSecondary: "Voir toutes les certifications",
    certCta: "Voir certification",

    goalLabel: "Objectif :",
    practiceCta: "S’entraîner",

    levels: [
      {
        title: "🟢 Niveau 0 — Logique et bases",
        body:
          "Avant le langage, il faut comprendre comment fonctionne le code : variables, conditions, boucles et fonctions.",
        recommended: [
          "Logique de base",
          "Résolution de problèmes",
          "Exercices quotidiens",
        ],
        goal:
          "Penser comme un développeur.",
      },
      {
        title: "🟡 Niveau 1 — Premier langage",
        body:
          "Choisis un langage et reste constant. Python pour les bases, JavaScript pour le web.",
        recommended: ["Python", "JavaScript"],
        goal:
          "Écrire du code simple sans confusion.",
        ctaQuizSlug: "python",
        ctaCertSlug: "python",
        ctaPrimaryText: "Commencer Python",
        ctaSecondaryText: "Voir Python",
      },
      {
        title: "🟠 Niveau 2 — Structure et OOP",
        body:
          "Classes, objets, gestion des erreurs et code propre. C’est le passage vers un niveau professionnel.",
        recommended: ["Java", "C#"],
        goal:
          "Écrire du code structuré et maintenable.",
        ctaQuizSlug: "microsoft-csharp",
        ctaCertSlug: "microsoft-csharp",
        ctaPrimaryText: "Aller sur C#",
        ctaSecondaryText: "Voir C#",
      },
      {
        title: "🔴 Niveau 3 — Projets réels",
        body:
          "API, bases de données, déploiement, Git. Les projets comptent plus que les certifications.",
        recommended: [
          "API REST",
          "Bases de données SQL",
          "Déploiement",
        ],
        goal:
          "Construire un vrai portfolio.",
      },
    ],

    salaryTitle: "💰 Salaire développeur (2026)",
    salaryIntro:
      "Le marché est énorme, mais les compétences pratiques font la différence.",
    salaryRanges: [
      { label: "Junior", range: "$40k–$65k" },
      { label: "Mid", range: "$70k–$100k" },
      { label: "Senior", range: "$110k+" },
    ],
    salaryDisclaimer:
      "Les projets réels sont plus importants que les certifications.",

    compareTitle: "🔍 Python vs JavaScript",
    compareIntro:
      "Les deux sont valides. Tout dépend de ton objectif.",
    compareLeftTitle: "Python",
    compareRightTitle: "JavaScript",
    compareRows: [
      {
        label: "Idéal pour",
        left: "Bases claires",
        right: "Développement web",
      },
      {
        label: "Difficulté",
        left: "Plus simple",
        right: "Plus complexe",
      },
    ],
    compareRecommendationTitle: "Conseil",
    compareRecommendationBody:
      "Si tu hésites : Python. Si tu veux le web : JavaScript.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "Faut-il des certifications ?",
        a: "Pas toujours. Les projets sont souvent plus importants.",
      },
      {
        q: "Combien de temps étudier ?",
        a: "Même 30 minutes par jour suffisent avec régularité.",
      },
    ],

    finalCtaTitle: "🚀 Commence maintenant",
    finalCtaBody:
      "Choisis un langage et commence aujourd’hui.",
  },
};