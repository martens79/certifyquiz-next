import Link from "next/link";

type Locale = "it" | "en" | "es" | "fr";

type RoadmapQuizSlug = string;
type RoadmapCertSlug = string;

export default function ProgrammingRoadmapPage({
  lang,
}: {
  lang: Locale;
}) {
  const t = CONTENT[lang];

  const quiz = (slug: RoadmapQuizSlug) =>
    `/${lang}/quiz/${slug}`;

  const cert = (slug: RoadmapCertSlug) => {
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

        <p className="mt-2 text-lg text-slate-600">
          {t.subtitle}
        </p>

        <p className="mt-5 text-slate-700 leading-relaxed">
          {t.intro}
        </p>

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

            {/* REALITY CHECK */}
{lvl.reality ? (
  <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
    <p className="text-sm font-bold text-amber-900">Reality check</p>
    <p className="mt-1 text-sm leading-relaxed text-amber-900">
      {lvl.reality}
    </p>
  </div>
) : null}

{/* COMMON MISTAKES */}
{lvl.mistakes?.length ? (
  <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4">
    <p className="text-sm font-bold text-rose-900">Common mistakes</p>
    <ul className="mt-2 list-disc pl-5 text-sm leading-relaxed text-rose-900">
      {lvl.mistakes.map((mistake) => (
        <li key={mistake}>{mistake}</li>
      ))}
    </ul>
  </div>
) : null}

{/* OUTCOMES */}
{lvl.outcomes?.length ? (
  <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
    <p className="text-sm font-bold text-emerald-900">Outcomes</p>
    <ul className="mt-2 list-disc pl-5 text-sm leading-relaxed text-emerald-900">
      {lvl.outcomes.map((outcome) => (
        <li key={outcome}>{outcome}</li>
      ))}
    </ul>
  </div>
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
    title: "Programming Certification Roadmap 2026",
    subtitle: "From zero to real developer skills",
    intro:
      "Programming is not about collecting languages. It is about learning how to think, solve problems, write maintainable code, and build real software. This roadmap gives you a practical path: logic first, one language, clean structure, then real projects.",

    ctaPrimary: "Start with Python",
    ctaSecondary: "Browse Programming certifications",
    certCta: "Explore certification",

    goalLabel: "Goal:",
    practiceCta: "Practice now",

    levels: [
      {
        title: "🟢 Level 0 — Logic and fundamentals",
        body:
          "Before choosing a language, learn how code works: variables, conditions, loops, functions, inputs, outputs, and basic problem solving. These concepts matter more than the language name.",
        recommended: [
          "Programming logic",
          "Problem solving",
          "Small daily exercises",
        ],
        goal:
          "Learn to think like a programmer before worrying about frameworks.",
        reality:
          "Many beginners waste months switching languages. The real problem is usually not Python or JavaScript — it is weak logic and lack of practice.",
        mistakes: [
          "Changing language every week",
          "Watching tutorials without writing code",
          "Skipping basic logic exercises",
          "Trying frameworks before understanding functions and loops",
        ],
        outcomes: [
          "Understand basic programming concepts",
          "Solve small problems with code",
          "Prepare for Python or JavaScript with less confusion",
        ],
      },
      {
        title: "🟡 Level 1 — First language",
        body:
          "Choose one language and stay with it long enough to build confidence. Python is excellent for beginners, automation, data and AI basics. JavaScript is better if your main goal is web development.",
        recommended: ["Python", "JavaScript"],
        goal:
          "Write simple programs without feeling lost every few lines.",
        reality:
          "The best first language is the one you actually practice. A consistent beginner with Python beats someone who studies five languages superficially.",
        mistakes: [
          "Choosing a language only because it is trending",
          "Copying code without understanding it",
          "Avoiding debugging",
          "Skipping small projects because they seem too simple",
        ],
        outcomes: [
          "Write basic scripts and programs",
          "Understand variables, functions and data structures",
          "Build confidence with real coding practice",
        ],
        ctaQuizSlug: "python",
        ctaCertSlug: "python",
        ctaPrimaryText: "Start Python quiz",
        ctaSecondaryText: "Explore Python certification",
      },
      {
        title: "🟠 Level 2 — Structure, OOP and clean code",
        body:
          "Once the basics are stable, move into structure: classes, objects, modules, error handling, clean code, testing basics and maintainability. This is where hobby coding starts becoming professional development.",
        recommended: ["Java", "C#", "Object-oriented programming"],
        goal:
          "Write code that is structured, readable and easier to maintain.",
        reality:
          "A lot of beginners can make code work once. Fewer can organize it so another person can understand, change and maintain it later.",
        mistakes: [
          "Writing everything in one file",
          "Avoiding object-oriented concepts completely",
          "Ignoring errors and edge cases",
          "Thinking clean code is only for senior developers",
        ],
        outcomes: [
          "Understand OOP and structured programming",
          "Write cleaner and more maintainable code",
          "Prepare for Java, C# and backend development paths",
        ],
        ctaQuizSlug: "microsoft-csharp",
        ctaCertSlug: "microsoft-csharp",
        ctaPrimaryText: "Start C# quiz",
        ctaSecondaryText: "Explore C# certification",
      },
      {
        title: "🔴 Level 3 — Real projects and developer workflow",
        body:
          "This is where you become credible: APIs, databases, authentication, Git, deployment, debugging, documentation and real project structure. Certifications help, but projects prove that you can build.",
        recommended: [
          "REST APIs",
          "SQL databases",
          "Git and GitHub",
          "Deployment",
        ],
        goal:
          "Build a portfolio that shows real developer ability.",
        reality:
          "Employers and clients rarely care that you watched a course. They care whether you can build, debug, explain and improve real software.",
        mistakes: [
          "Only building tutorial copies",
          "Avoiding Git and deployment",
          "Never connecting code to a database",
          "Waiting too long before building real projects",
        ],
        outcomes: [
          "Create portfolio-ready projects",
          "Understand basic developer workflow",
          "Move closer to junior developer readiness",
        ],
      },
    ],

    salaryTitle: "💰 Developer salary outlook (2026)",
    salaryIntro:
      "Developer salaries vary widely by country, stack, experience and portfolio. The fastest growth usually comes from combining programming fundamentals, real projects, Git, databases and deployment skills.",
    salaryRanges: [
      { label: "Junior", range: "$45k–$70k" },
      { label: "Mid-level", range: "$75k–$115k" },
      { label: "Senior", range: "$120k+" },
    ],
    salaryDisclaimer:
      "Certifications can support your path, but real projects and practical problem solving usually matter more.",

    compareTitle: "🔍 Python vs JavaScript — which one first?",
    compareIntro:
      "Both are excellent, but they fit different goals. The mistake is switching constantly instead of building depth.",
    compareLeftTitle: "Python",
    compareRightTitle: "JavaScript",
    compareRows: [
      {
        label: "Best for",
        left: "Beginners, automation, data, AI basics",
        right: "Web development and interactive apps",
      },
      {
        label: "Learning curve",
        left: "Cleaner and easier at the start",
        right: "More flexible but more chaotic",
      },
      {
        label: "Start here?",
        left: "Yes, if you want clean fundamentals",
        right: "Yes, if your goal is web",
      },
    ],
    compareRecommendationTitle: "Recommendation",
    compareRecommendationBody:
      "If you are unsure, start with Python. If your goal is web development, choose JavaScript and build small web projects immediately.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "Do I need a programming certification to get hired?",
        a: "Not always. Certifications can help structure your study, but projects, GitHub and practical skills are usually more important.",
      },
      {
        q: "How many languages should I learn first?",
        a: "One. Pick one language, practice consistently, and build projects before adding another.",
      },
      {
        q: "Is Python enough for a beginner?",
        a: "Yes. Python is excellent for fundamentals, automation, data basics and AI-related learning.",
      },
      {
        q: "When should I build projects?",
        a: "As soon as possible. Start small, then gradually add databases, APIs, authentication and deployment.",
      },
    ],

    finalCtaTitle: "🚀 Start now with one language",
    finalCtaBody:
      "Do not wait until you feel ready. Choose one language, practice every day, and build small real projects as early as possible.",
  },

  it: {
    title: "Roadmap Certificazioni Programmazione 2026",
    subtitle: "Da zero a competenze reali da developer",
    intro:
      "Programmare non significa collezionare linguaggi. Significa imparare a ragionare, risolvere problemi, scrivere codice mantenibile e costruire software reale. Questa roadmap ti dà un percorso pratico: prima logica, poi un linguaggio, poi struttura pulita, infine progetti reali.",

    ctaPrimary: "Inizia con Python",
    ctaSecondary: "Vedi le certificazioni Programmazione",
    certCta: "Scopri certificazione",

    goalLabel: "Obiettivo:",
    practiceCta: "Allenati ora",

    levels: [
      {
        title: "🟢 Livello 0 — Logica e fondamenta",
        body:
          "Prima di scegliere un linguaggio, devi capire come funziona il codice: variabili, condizioni, cicli, funzioni, input, output e problem solving base. Questi concetti contano più del nome del linguaggio.",
        recommended: [
          "Logica di programmazione",
          "Problem solving",
          "Piccoli esercizi quotidiani",
        ],
        goal:
          "Imparare a pensare da programmatore prima di preoccuparti dei framework.",
        reality:
          "Molti principianti perdono mesi cambiando linguaggio. Il vero problema spesso non è Python o JavaScript: sono logica debole e poca pratica.",
        mistakes: [
          "Cambiare linguaggio ogni settimana",
          "Guardare tutorial senza scrivere codice",
          "Saltare esercizi di logica base",
          "Provare framework prima di capire funzioni e cicli",
        ],
        outcomes: [
          "Comprendere i concetti base della programmazione",
          "Risolvere piccoli problemi con il codice",
          "Prepararti a Python o JavaScript con meno confusione",
        ],
      },
      {
        title: "🟡 Livello 1 — Primo linguaggio",
        body:
          "Scegli un linguaggio e restaci abbastanza da costruire sicurezza. Python è ottimo per principianti, automazione, dati e basi AI. JavaScript è più indicato se il tuo obiettivo principale è lo sviluppo web.",
        recommended: ["Python", "JavaScript"],
        goal:
          "Scrivere programmi semplici senza perderti ogni poche righe.",
        reality:
          "Il miglior primo linguaggio è quello che pratichi davvero. Un principiante costante con Python vale più di chi studia cinque linguaggi in superficie.",
        mistakes: [
          "Scegliere un linguaggio solo perché è di moda",
          "Copiare codice senza capirlo",
          "Evitare il debugging",
          "Saltare i piccoli progetti perché sembrano troppo semplici",
        ],
        outcomes: [
          "Scrivere script e programmi base",
          "Capire variabili, funzioni e strutture dati",
          "Costruire fiducia con pratica reale",
        ],
        ctaQuizSlug: "python",
        ctaCertSlug: "python",
        ctaPrimaryText: "Inizia il quiz Python",
        ctaSecondaryText: "Scopri Python",
      },
      {
        title: "🟠 Livello 2 — Struttura, OOP e codice pulito",
        body:
          "Quando le basi sono stabili, passa alla struttura: classi, oggetti, moduli, gestione errori, clean code, basi di testing e manutenibilità. Qui il coding da hobby inizia a diventare sviluppo professionale.",
        recommended: ["Java", "C#", "Programmazione orientata agli oggetti"],
        goal:
          "Scrivere codice strutturato, leggibile e più facile da mantenere.",
        reality:
          "Molti principianti riescono a far funzionare il codice una volta. Molti meno riescono a organizzarlo perché un’altra persona possa capirlo, modificarlo e mantenerlo.",
        mistakes: [
          "Scrivere tutto in un solo file",
          "Evitare completamente la programmazione a oggetti",
          "Ignorare errori e casi limite",
          "Pensare che il clean code sia solo per senior developer",
        ],
        outcomes: [
          "Comprendere OOP e programmazione strutturata",
          "Scrivere codice più pulito e mantenibile",
          "Prepararti a percorsi Java, C# e backend development",
        ],
        ctaQuizSlug: "microsoft-csharp",
        ctaCertSlug: "microsoft-csharp",
        ctaPrimaryText: "Inizia il quiz C#",
        ctaSecondaryText: "Scopri C#",
      },
      {
        title: "🔴 Livello 3 — Progetti reali e workflow developer",
        body:
          "Qui diventi credibile: API, database, autenticazione, Git, deploy, debugging, documentazione e struttura reale dei progetti. Le certificazioni aiutano, ma i progetti dimostrano che sai costruire.",
        recommended: [
          "API REST",
          "Database SQL",
          "Git e GitHub",
          "Deploy online",
        ],
        goal:
          "Costruire un portfolio che mostri vere capacità da developer.",
        reality:
          "Aziende e clienti raramente si interessano al fatto che hai guardato un corso. Vogliono capire se sai costruire, correggere, spiegare e migliorare software reale.",
        mistakes: [
          "Creare solo copie di tutorial",
          "Evitare Git e deploy",
          "Non collegare mai il codice a un database",
          "Aspettare troppo prima di costruire progetti reali",
        ],
        outcomes: [
          "Creare progetti adatti al portfolio",
          "Comprendere il workflow base da developer",
          "Avvicinarti alla preparazione da junior developer",
        ],
      },
    ],

    salaryTitle: "💰 Stipendi Developer (2026)",
    salaryIntro:
      "Gli stipendi developer cambiano molto in base a paese, stack, esperienza e portfolio. La crescita più veloce arriva combinando fondamenta, progetti reali, Git, database e deploy.",
    salaryRanges: [
      { label: "Junior", range: "$45k–$70k" },
      { label: "Mid-level", range: "$75k–$115k" },
      { label: "Senior", range: "$120k+" },
    ],
    salaryDisclaimer:
      "Le certificazioni possono aiutare, ma progetti reali e problem solving pratico contano di più.",

    compareTitle: "🔍 Python vs JavaScript — da cosa partire?",
    compareIntro:
      "Entrambi sono ottimi, ma servono obiettivi diversi. L’errore è cambiare continuamente invece di costruire profondità.",
    compareLeftTitle: "Python",
    compareRightTitle: "JavaScript",
    compareRows: [
      {
        label: "Ideale per",
        left: "Principianti, automazione, dati, basi AI",
        right: "Sviluppo web e app interattive",
      },
      {
        label: "Curva di apprendimento",
        left: "Più pulita e semplice all’inizio",
        right: "Più flessibile ma più caotica",
      },
      {
        label: "Partire da qui?",
        left: "Sì, se vuoi fondamenta pulite",
        right: "Sì, se il tuo obiettivo è il web",
      },
    ],
    compareRecommendationTitle: "Consiglio",
    compareRecommendationBody:
      "Se sei indeciso, parti da Python. Se il tuo obiettivo è il web development, scegli JavaScript e costruisci subito piccoli progetti web.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "Serve una certificazione di programmazione per lavorare?",
        a: "Non sempre. Le certificazioni aiutano a strutturare lo studio, ma progetti, GitHub e skill pratiche contano spesso di più.",
      },
      {
        q: "Quanti linguaggi devo imparare all’inizio?",
        a: "Uno. Scegli un linguaggio, pratica con costanza e costruisci progetti prima di aggiungerne un altro.",
      },
      {
        q: "Python basta per iniziare?",
        a: "Sì. Python è ottimo per fondamenta, automazione, basi dati e apprendimento legato all’AI.",
      },
      {
        q: "Quando devo iniziare a fare progetti?",
        a: "Il prima possibile. Parti piccolo, poi aggiungi database, API, autenticazione e deploy.",
      },
    ],

    finalCtaTitle: "🚀 Parti ora con un solo linguaggio",
    finalCtaBody:
      "Non aspettare di sentirti pronto. Scegli un linguaggio, pratica ogni giorno e costruisci piccoli progetti reali il prima possibile.",
  },

  es: {
    title: "Ruta de Certificaciones Programación 2026",
    subtitle: "De cero a habilidades reales de developer",
    intro:
      "Programar no significa coleccionar lenguajes. Significa aprender a pensar, resolver problemas, escribir código mantenible y construir software real. Esta ruta te da un camino práctico: primero lógica, luego un lenguaje, después estructura limpia y finalmente proyectos reales.",

    ctaPrimary: "Empieza con Python",
    ctaSecondary: "Ver certificaciones de Programación",
    certCta: "Ver certificación",

    goalLabel: "Objetivo:",
    practiceCta: "Practicar ahora",

    levels: [
      {
        title: "🟢 Nivel 0 — Lógica y fundamentos",
        body:
          "Antes de elegir un lenguaje, aprende cómo funciona el código: variables, condiciones, bucles, funciones, entradas, salidas y problem solving básico. Estos conceptos importan más que el nombre del lenguaje.",
        recommended: [
          "Lógica de programación",
          "Problem solving",
          "Pequeños ejercicios diarios",
        ],
        goal:
          "Aprender a pensar como programador antes de preocuparte por frameworks.",
        reality:
          "Muchos principiantes pierden meses cambiando de lenguaje. El verdadero problema normalmente no es Python o JavaScript: es lógica débil y poca práctica.",
        mistakes: [
          "Cambiar de lenguaje cada semana",
          "Ver tutoriales sin escribir código",
          "Saltar ejercicios básicos de lógica",
          "Probar frameworks antes de entender funciones y bucles",
        ],
        outcomes: [
          "Comprender conceptos básicos de programación",
          "Resolver pequeños problemas con código",
          "Prepararte para Python o JavaScript con menos confusión",
        ],
      },
      {
        title: "🟡 Nivel 1 — Primer lenguaje",
        body:
          "Elige un lenguaje y mantente con él el tiempo suficiente para ganar confianza. Python es excelente para principiantes, automatización, datos y bases de IA. JavaScript es mejor si tu objetivo principal es desarrollo web.",
        recommended: ["Python", "JavaScript"],
        goal:
          "Escribir programas simples sin perderte cada pocas líneas.",
        reality:
          "El mejor primer lenguaje es el que realmente practicas. Un principiante constante con Python vale más que alguien que estudia cinco lenguajes de forma superficial.",
        mistakes: [
          "Elegir un lenguaje solo porque está de moda",
          "Copiar código sin entenderlo",
          "Evitar el debugging",
          "Saltar proyectos pequeños porque parecen demasiado simples",
        ],
        outcomes: [
          "Escribir scripts y programas básicos",
          "Entender variables, funciones y estructuras de datos",
          "Construir confianza con práctica real",
        ],
        ctaQuizSlug: "python",
        ctaCertSlug: "python",
        ctaPrimaryText: "Empezar quiz Python",
        ctaSecondaryText: "Ver Python",
      },
      {
        title: "🟠 Nivel 2 — Estructura, OOP y código limpio",
        body:
          "Cuando las bases sean estables, pasa a la estructura: clases, objetos, módulos, manejo de errores, clean code, bases de testing y mantenibilidad. Aquí el coding de hobby empieza a convertirse en desarrollo profesional.",
        recommended: ["Java", "C#", "Programación orientada a objetos"],
        goal:
          "Escribir código estructurado, legible y más fácil de mantener.",
        reality:
          "Muchos principiantes consiguen que el código funcione una vez. Menos personas consiguen organizarlo para que otra persona pueda entenderlo, cambiarlo y mantenerlo.",
        mistakes: [
          "Escribir todo en un solo archivo",
          "Evitar completamente la programación orientada a objetos",
          "Ignorar errores y casos límite",
          "Pensar que clean code es solo para developers senior",
        ],
        outcomes: [
          "Comprender OOP y programación estructurada",
          "Escribir código más limpio y mantenible",
          "Prepararte para rutas Java, C# y backend development",
        ],
        ctaQuizSlug: "microsoft-csharp",
        ctaCertSlug: "microsoft-csharp",
        ctaPrimaryText: "Empezar quiz C#",
        ctaSecondaryText: "Ver C#",
      },
      {
        title: "🔴 Nivel 3 — Proyectos reales y workflow developer",
        body:
          "Aquí te vuelves creíble: APIs, bases de datos, autenticación, Git, deploy, debugging, documentación y estructura real de proyectos. Las certificaciones ayudan, pero los proyectos demuestran que sabes construir.",
        recommended: [
          "API REST",
          "Bases de datos SQL",
          "Git y GitHub",
          "Deploy online",
        ],
        goal:
          "Construir un portfolio que muestre habilidades reales de developer.",
        reality:
          "A empresas y clientes rara vez les importa que hayas visto un curso. Les importa si puedes construir, depurar, explicar y mejorar software real.",
        mistakes: [
          "Crear solo copias de tutoriales",
          "Evitar Git y deploy",
          "No conectar nunca el código a una base de datos",
          "Esperar demasiado antes de construir proyectos reales",
        ],
        outcomes: [
          "Crear proyectos listos para portfolio",
          "Comprender el workflow básico de developer",
          "Acercarte a preparación de junior developer",
        ],
      },
    ],

    salaryTitle: "💰 Salarios Developer (2026)",
    salaryIntro:
      "Los salarios developer varían mucho según país, stack, experiencia y portfolio. El crecimiento más rápido suele venir de combinar fundamentos, proyectos reales, Git, bases de datos y deploy.",
    salaryRanges: [
      { label: "Junior", range: "$45k–$70k" },
      { label: "Mid-level", range: "$75k–$115k" },
      { label: "Senior", range: "$120k+" },
    ],
    salaryDisclaimer:
      "Las certificaciones pueden ayudar, pero los proyectos reales y el problem solving práctico suelen importar más.",

    compareTitle: "🔍 Python vs JavaScript — ¿por dónde empezar?",
    compareIntro:
      "Ambos son excelentes, pero encajan con objetivos diferentes. El error es cambiar constantemente en vez de construir profundidad.",
    compareLeftTitle: "Python",
    compareRightTitle: "JavaScript",
    compareRows: [
      {
        label: "Ideal para",
        left: "Principiantes, automatización, datos, bases de IA",
        right: "Desarrollo web y apps interactivas",
      },
      {
        label: "Curva de aprendizaje",
        left: "Más limpia y sencilla al inicio",
        right: "Más flexible pero más caótica",
      },
      {
        label: "¿Empezar aquí?",
        left: "Sí, si quieres fundamentos limpios",
        right: "Sí, si tu objetivo es web",
      },
    ],
    compareRecommendationTitle: "Recomendación",
    compareRecommendationBody:
      "Si dudas, empieza con Python. Si tu objetivo es desarrollo web, elige JavaScript y construye pequeños proyectos web desde el principio.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "¿Necesito una certificación de programación para trabajar?",
        a: "No siempre. Las certificaciones ayudan a estructurar el estudio, pero proyectos, GitHub y habilidades prácticas suelen pesar más.",
      },
      {
        q: "¿Cuántos lenguajes debo aprender al principio?",
        a: "Uno. Elige un lenguaje, practica con constancia y construye proyectos antes de añadir otro.",
      },
      {
        q: "¿Python basta para empezar?",
        a: "Sí. Python es excelente para fundamentos, automatización, bases de datos y aprendizaje relacionado con IA.",
      },
      {
        q: "¿Cuándo debería empezar proyectos?",
        a: "Lo antes posible. Empieza pequeño y luego añade bases de datos, APIs, autenticación y deploy.",
      },
    ],

    finalCtaTitle: "🚀 Empieza ahora con un solo lenguaje",
    finalCtaBody:
      "No esperes a sentirte listo. Elige un lenguaje, practica cada día y construye pequeños proyectos reales cuanto antes.",
  },

  fr: {
    title: "Parcours Certifications Programmation 2026",
    subtitle: "De zéro à de vraies compétences développeur",
    intro:
      "Programmer ne signifie pas collectionner les langages. Cela signifie apprendre à réfléchir, résoudre des problèmes, écrire du code maintenable et construire de vrais logiciels. Ce parcours vous donne une voie pratique : logique d’abord, un langage, structure propre, puis projets réels.",

    ctaPrimary: "Commencer avec Python",
    ctaSecondary: "Voir les certifications Programmation",
    certCta: "Voir la certification",

    goalLabel: "Objectif :",
    practiceCta: "S’entraîner maintenant",

    levels: [
      {
        title: "🟢 Niveau 0 — Logique et fondamentaux",
        body:
          "Avant de choisir un langage, apprenez comment fonctionne le code : variables, conditions, boucles, fonctions, entrées, sorties et résolution de problèmes de base. Ces concepts comptent plus que le nom du langage.",
        recommended: [
          "Logique de programmation",
          "Résolution de problèmes",
          "Petits exercices quotidiens",
        ],
        goal:
          "Apprendre à penser comme un programmeur avant de vous préoccuper des frameworks.",
        reality:
          "Beaucoup de débutants perdent des mois à changer de langage. Le vrai problème n’est souvent pas Python ou JavaScript : c’est une logique faible et trop peu de pratique.",
        mistakes: [
          "Changer de langage chaque semaine",
          "Regarder des tutoriels sans écrire de code",
          "Sauter les exercices de logique de base",
          "Tester des frameworks avant de comprendre fonctions et boucles",
        ],
        outcomes: [
          "Comprendre les concepts de base de la programmation",
          "Résoudre de petits problèmes avec du code",
          "Se préparer à Python ou JavaScript avec moins de confusion",
        ],
      },
      {
        title: "🟡 Niveau 1 — Premier langage",
        body:
          "Choisissez un langage et restez avec lui assez longtemps pour gagner en confiance. Python est excellent pour les débutants, l’automatisation, les données et les bases de l’IA. JavaScript est préférable si votre objectif principal est le développement web.",
        recommended: ["Python", "JavaScript"],
        goal:
          "Écrire des programmes simples sans vous perdre toutes les quelques lignes.",
        reality:
          "Le meilleur premier langage est celui que vous pratiquez vraiment. Un débutant régulier avec Python vaut mieux qu’une personne qui étudie cinq langages superficiellement.",
        mistakes: [
          "Choisir un langage uniquement parce qu’il est tendance",
          "Copier du code sans le comprendre",
          "Éviter le debugging",
          "Sauter les petits projets parce qu’ils semblent trop simples",
        ],
        outcomes: [
          "Écrire des scripts et programmes de base",
          "Comprendre variables, fonctions et structures de données",
          "Construire de la confiance avec une vraie pratique",
        ],
        ctaQuizSlug: "python",
        ctaCertSlug: "python",
        ctaPrimaryText: "Commencer le quiz Python",
        ctaSecondaryText: "Voir Python",
      },
      {
        title: "🟠 Niveau 2 — Structure, OOP et code propre",
        body:
          "Quand les bases sont stables, passez à la structure : classes, objets, modules, gestion des erreurs, clean code, bases des tests et maintenabilité. Ici, le code de hobby commence à devenir du développement professionnel.",
        recommended: ["Java", "C#", "Programmation orientée objet"],
        goal:
          "Écrire du code structuré, lisible et plus facile à maintenir.",
        reality:
          "Beaucoup de débutants arrivent à faire fonctionner du code une fois. Moins nombreux sont ceux qui savent l’organiser pour qu’une autre personne puisse le comprendre, le modifier et le maintenir.",
        mistakes: [
          "Tout écrire dans un seul fichier",
          "Éviter complètement la programmation orientée objet",
          "Ignorer les erreurs et les cas limites",
          "Penser que le clean code est seulement pour les développeurs senior",
        ],
        outcomes: [
          "Comprendre OOP et programmation structurée",
          "Écrire du code plus propre et maintenable",
          "Se préparer aux parcours Java, C# et backend development",
        ],
        ctaQuizSlug: "microsoft-csharp",
        ctaCertSlug: "microsoft-csharp",
        ctaPrimaryText: "Commencer le quiz C#",
        ctaSecondaryText: "Voir C#",
      },
      {
        title: "🔴 Niveau 3 — Projets réels et workflow développeur",
        body:
          "C’est ici que vous devenez crédible : APIs, bases de données, authentification, Git, déploiement, debugging, documentation et vraie structure de projet. Les certifications aident, mais les projets prouvent que vous savez construire.",
        recommended: [
          "API REST",
          "Bases de données SQL",
          "Git et GitHub",
          "Déploiement",
        ],
        goal:
          "Construire un portfolio qui montre de vraies compétences développeur.",
        reality:
          "Les entreprises et clients se soucient rarement du fait que vous avez regardé un cours. Ils veulent savoir si vous pouvez construire, débugger, expliquer et améliorer un vrai logiciel.",
        mistakes: [
          "Créer seulement des copies de tutoriels",
          "Éviter Git et le déploiement",
          "Ne jamais connecter le code à une base de données",
          "Attendre trop longtemps avant de construire de vrais projets",
        ],
        outcomes: [
          "Créer des projets adaptés à un portfolio",
          "Comprendre le workflow développeur de base",
          "Se rapprocher du niveau junior developer",
        ],
      },
    ],

    salaryTitle: "💰 Salaires Développeur (2026)",
    salaryIntro:
      "Les salaires développeur varient beaucoup selon le pays, la stack, l’expérience et le portfolio. La progression la plus rapide vient souvent de la combinaison fondamentaux, projets réels, Git, bases de données et déploiement.",
    salaryRanges: [
      { label: "Junior", range: "$45k–$70k" },
      { label: "Mid-level", range: "$75k–$115k" },
      { label: "Senior", range: "$120k+" },
    ],
    salaryDisclaimer:
      "Les certifications peuvent aider, mais les projets réels et la résolution pratique de problèmes comptent souvent davantage.",

    compareTitle: "🔍 Python vs JavaScript — par quoi commencer ?",
    compareIntro:
      "Les deux sont excellents, mais ils correspondent à des objectifs différents. L’erreur est de changer constamment au lieu de construire de la profondeur.",
    compareLeftTitle: "Python",
    compareRightTitle: "JavaScript",
    compareRows: [
      {
        label: "Idéal pour",
        left: "Débutants, automatisation, données, bases IA",
        right: "Développement web et applications interactives",
      },
      {
        label: "Courbe d’apprentissage",
        left: "Plus claire et plus simple au départ",
        right: "Plus flexible mais plus chaotique",
      },
      {
        label: "Commencer ici ?",
        left: "Oui, si vous voulez des bases propres",
        right: "Oui, si votre objectif est le web",
      },
    ],
    compareRecommendationTitle: "Recommandation",
    compareRecommendationBody:
      "Si vous hésitez, commencez avec Python. Si votre objectif est le développement web, choisissez JavaScript et construisez rapidement de petits projets web.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "Faut-il une certification de programmation pour travailler ?",
        a: "Pas toujours. Les certifications aident à structurer l’étude, mais les projets, GitHub et les compétences pratiques comptent souvent davantage.",
      },
      {
        q: "Combien de langages apprendre au début ?",
        a: "Un seul. Choisissez un langage, pratiquez régulièrement et construisez des projets avant d’en ajouter un autre.",
      },
      {
        q: "Python suffit-il pour commencer ?",
        a: "Oui. Python est excellent pour les fondamentaux, l’automatisation, les bases de données et l’apprentissage lié à l’IA.",
      },
      {
        q: "Quand commencer les projets ?",
        a: "Le plus tôt possible. Commencez petit, puis ajoutez bases de données, APIs, authentification et déploiement.",
      },
    ],

    finalCtaTitle: "🚀 Commencez maintenant avec un seul langage",
    finalCtaBody:
      "N’attendez pas de vous sentir prêt. Choisissez un langage, pratiquez chaque jour et construisez de petits projets réels dès que possible.",
  },
};