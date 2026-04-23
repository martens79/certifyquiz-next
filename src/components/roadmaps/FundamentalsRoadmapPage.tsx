import Link from "next/link";

type Locale = "it" | "en" | "es" | "fr";

type FundamentalsQuizSlug =
  | "comptia-itf-plus"
  | "comptia-a-plus"
  | "eipass"
  | "icdl"
  | "pekit";

type FundamentalsCertSlug = FundamentalsQuizSlug;

const quiz = (lang: Locale, slug: FundamentalsQuizSlug) => `/${lang}/quiz/${slug}`;

const cert = (lang: Locale, slug: FundamentalsCertSlug) => {
  if (lang === "it") return `/it/certificazioni/${slug}`;
  if (lang === "fr") return `/fr/certifications/${slug}`;
  if (lang === "es") return `/es/certificaciones/${slug}`;
  return `/certifications/${slug}`;
};

export default function FundamentalsRoadmapPage({ lang }: { lang: Locale }) {
  const t = CONTENT[lang];

  const categoryFundamentals =
    lang === "en"
      ? "/categories/base"
      : lang === "it"
      ? "/it/categorie/base"
      : lang === "es"
      ? "/es/categorias/base"
      : "/fr/categories/base";

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
            href={quiz(lang, "comptia-itf-plus")}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition"
          >
            {t.ctaPrimary}
          </Link>

          <Link
            href={categoryFundamentals}
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
            href={quiz(lang, "comptia-itf-plus")}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition"
          >
            {t.ctaPrimary}
          </Link>
          <Link
            href={categoryFundamentals}
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
      ctaQuizSlug?: FundamentalsQuizSlug;
      ctaCertSlug?: FundamentalsCertSlug;
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
    title: "IT Fundamentals Roadmap 2026",
    subtitle: "Start from zero and build solid IT foundations",
    intro:
      "If you're new to IT, your fastest win is building real foundations first. This roadmap takes you from digital basics to a practical IT base before you specialize in networking, cybersecurity, cloud, databases, or programming.",

    ctaPrimary: "Start with CompTIA ITF+",
    ctaSecondary: "Browse fundamentals certifications",
    certCta: "Explore certification",

    goalLabel: "Goal:",
    practiceCta: "Practice now",

    levels: [
      {
        title: "🟢 Level 0 — Absolute beginner",
        body:
          "Start with digital basics: files, folders, devices, browsers, simple troubleshooting, and everyday IT vocabulary. If this feels new, don't skip it. Strong basics make every next certification easier.",
        recommended: [
          "ICDL",
          "EIPASS",
          "PEKIT",
        ],
        goal:
          "Feel comfortable with basic computer tasks and common digital concepts.",
        ctaQuizSlug: "icdl",
        ctaCertSlug: "icdl",
        ctaPrimaryText: "Start ICDL quiz",
        ctaSecondaryText: "Explore ICDL",
      },
      {
        title: "🟡 Level 1 — First real IT foundations",
        body:
          "This is where you move from digital literacy to IT thinking. You start understanding operating systems, simple security habits, files, memory, storage, and basic networking concepts.",
        recommended: [
          "CompTIA ITF+",
          "PEKIT",
        ],
        goal:
          "Understand how a computer system works at a basic but real level.",
        ctaQuizSlug: "comptia-itf-plus",
        ctaCertSlug: "comptia-itf-plus",
        ctaPrimaryText: "Start ITF+ quiz",
        ctaSecondaryText: "Explore ITF+",
      },
      {
        title: "🟠 Level 2 — First job-oriented skills",
        body:
          "Now you move into practical support skills: common hardware and software issues, updates, installations, user support, peripherals, and basic troubleshooting patterns that show up in real environments.",
        recommended: [
          "CompTIA A+",
          "EIPASS",
        ],
        goal:
          "Handle common beginner IT tasks with more confidence and structure.",
        ctaQuizSlug: "comptia-a-plus",
        ctaCertSlug: "comptia-a-plus",
        ctaPrimaryText: "Start A+ quiz",
        ctaSecondaryText: "Explore A+",
      },
      {
        title: "🔴 Level 3 — Consolidate digital confidence",
        body:
          "Certifications like ICDL, EIPASS, and PEKIT can still help here if you want stronger office, document, productivity, and digital workflow confidence. They are not 'advanced IT', but they are useful if your base is still fragile.",
        recommended: [
          "ICDL",
          "EIPASS",
          "PEKIT",
        ],
        goal:
          "Become more fluent and reliable in everyday digital work.",
        ctaQuizSlug: "eipass",
        ctaCertSlug: "eipass",
        ctaPrimaryText: "Start EIPASS quiz",
        ctaSecondaryText: "Explore EIPASS",
      },
      {
        title: "⚫ Level 4 — Choose your direction",
        body:
          "Once your fundamentals are stable, pick a path and stop staying at the 'general basics' stage forever. Networking, cybersecurity, cloud, databases, and programming all become easier once fundamentals are clear.",
        recommended: [
          "Networking",
          "Cybersecurity",
          "Cloud",
          "Databases",
          "Programming",
        ],
        goal:
          "Specialize faster, with less confusion and fewer gaps.",
      },
    ],

    salaryTitle: "💰 Entry-level IT salary outlook (2026)",
    salaryIntro:
      "Foundations alone do not create high salaries, but they unlock the paths that do. Entry-level roles vary a lot by country and job type.",
    salaryRanges: [
      { label: "Entry-level", range: "$30k–$50k" },
      { label: "Mid-level", range: "$50k–$75k" },
      { label: "Specialized", range: "$80k+" },
    ],
    salaryDisclaimer:
      "Real growth usually comes after you use fundamentals to move into a specialization.",

    compareTitle: "🔍 CompTIA ITF+ vs CompTIA A+ — what should you do first?",
    compareIntro:
      "ITF+ is lighter and better for real beginners. A+ is broader and more job-oriented, but harder if your basics are weak.",
    compareLeftTitle: "CompTIA ITF+",
    compareRightTitle: "CompTIA A+",
    compareRows: [
      {
        label: "Best for",
        left: "Starting from zero",
        right: "Becoming job-ready faster",
      },
      {
        label: "Difficulty",
        left: "Easier and lighter",
        right: "Broader and deeper",
      },
      {
        label: "Recommendation",
        left: "If you still feel lost",
        right: "If you already have some basics",
      },
    ],
    compareRecommendationTitle: "Recommendation",
    compareRecommendationBody:
      "If you're unsure, start with ITF+. If you already have confidence with computers, move to A+ and practice consistently.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "I'm starting from zero. Where should I begin?",
        a: "If even basic computer concepts feel shaky, start with ICDL, EIPASS, or PEKIT, then move to ITF+.",
      },
      {
        q: "Do I need ITF+ before A+?",
        a: "Not always. ITF+ is useful if your fundamentals are weak. If you already understand basics, you can move directly to A+.",
      },
      {
        q: "Are ICDL, EIPASS, and PEKIT still useful?",
        a: "Yes, especially if you need stronger confidence with general digital skills, office tools, and structured daily workflows.",
      },
      {
        q: "What should I do after fundamentals?",
        a: "Choose one direction and stay focused for a few weeks: networking, cybersecurity, cloud, programming, or databases.",
      },
    ],

    finalCtaTitle: "🚀 Start now (simple plan)",
    finalCtaBody:
      "Build your fundamentals first, then specialize. Start with ITF+ if you want a clean IT path, or ICDL if you're completely new.",
  },

  it: {
    title: "Roadmap Fondamenta IT 2026",
    subtitle: "Parti da zero e costruisci basi solide davvero utili",
    intro:
      "Se sei all'inizio, la mossa più intelligente è costruire fondamenta vere. Questa roadmap ti porta dalle competenze digitali base a una prima base IT concreta, prima di specializzarti in reti, cybersecurity, cloud, database o programmazione.",

    ctaPrimary: "Inizia con CompTIA ITF+",
    ctaSecondary: "Vedi le certificazioni Base",
    certCta: "Scopri certificazione",

    goalLabel: "Obiettivo:",
    practiceCta: "Allenati ora",

    levels: [
      {
        title: "🟢 Livello 0 — Principiante assoluto",
        body:
          "Parti da file, cartelle, browser, dispositivi, uso base del PC e troubleshooting semplice. Se queste cose non sono ancora naturali, non saltarle. Una base debole rallenta tutto il resto.",
        recommended: [
          "ICDL",
          "EIPASS",
          "PEKIT",
        ],
        goal:
          "Sentirti a tuo agio con le attività digitali più comuni e con il linguaggio base.",
        ctaQuizSlug: "icdl",
        ctaCertSlug: "icdl",
        ctaPrimaryText: "Inizia quiz ICDL",
        ctaSecondaryText: "Scopri ICDL",
      },
      {
        title: "🟡 Livello 1 — Prime vere fondamenta IT",
        body:
          "Qui inizi a passare dall'uso del computer alla comprensione di come funziona. Sistemi operativi, file system, sicurezza base, memoria, storage e concetti iniziali di rete.",
        recommended: [
          "CompTIA ITF+",
          "PEKIT",
        ],
        goal:
          "Capire davvero come funziona un sistema informatico a livello base.",
        ctaQuizSlug: "comptia-itf-plus",
        ctaCertSlug: "comptia-itf-plus",
        ctaPrimaryText: "Inizia quiz ITF+",
        ctaSecondaryText: "Scopri ITF+",
      },
      {
        title: "🟠 Livello 2 — Prime competenze spendibili",
        body:
          "Ora entri nel pratico: problemi comuni hardware/software, installazioni, aggiornamenti, periferiche, supporto utenti e pattern di troubleshooting che servono davvero nel mondo reale.",
        recommended: [
          "CompTIA A+",
          "EIPASS",
        ],
        goal:
          "Gestire problemi comuni e attività base di supporto con più sicurezza.",
        ctaQuizSlug: "comptia-a-plus",
        ctaCertSlug: "comptia-a-plus",
        ctaPrimaryText: "Inizia quiz A+",
        ctaSecondaryText: "Scopri A+",
      },
      {
        title: "🔴 Livello 3 — Rafforza la sicurezza digitale",
        body:
          "ICDL, EIPASS e PEKIT possono ancora aiutarti qui se senti che ti manca scioltezza su strumenti d'ufficio, produttività, documenti e flussi digitali quotidiani. Non sono cert avanzate IT, ma sono utili se la base è ancora fragile.",
        recommended: [
          "ICDL",
          "EIPASS",
          "PEKIT",
        ],
        goal:
          "Diventare più fluido e affidabile nelle attività digitali quotidiane.",
        ctaQuizSlug: "eipass",
        ctaCertSlug: "eipass",
        ctaPrimaryText: "Inizia quiz EIPASS",
        ctaSecondaryText: "Scopri EIPASS",
      },
      {
        title: "⚫ Livello 4 — Scegli una direzione",
        body:
          "Quando le basi sono stabili, devi smettere di restare fermo sul livello 'generico'. Networking, cybersecurity, cloud, database e programmazione diventano molto più facili se le fondamenta sono chiare.",
        recommended: [
          "Reti",
          "Cybersecurity",
          "Cloud",
          "Database",
          "Programmazione",
        ],
        goal:
          "Specializzarti più velocemente, con meno confusione e meno lacune.",
      },
    ],

    salaryTitle: "💰 Salary outlook entry-level IT (2026)",
    salaryIntro:
      "Le fondamenta da sole non ti fanno guadagnare tanto, ma sbloccano i percorsi che poi pagano meglio. I ruoli entry-level cambiano molto in base al paese e al tipo di lavoro.",
    salaryRanges: [
      { label: "Entry-level", range: "$30k–$50k" },
      { label: "Mid-level", range: "$50k–$75k" },
      { label: "Specializzato", range: "$80k+" },
    ],
    salaryDisclaimer:
      "La crescita vera arriva quando usi le fondamenta per entrare in una specializzazione.",

    compareTitle: "🔍 CompTIA ITF+ vs CompTIA A+ — cosa fare prima?",
    compareIntro:
      "ITF+ è più leggero ed è perfetto per chi parte da zero. A+ è più ampio e più orientato al lavoro, ma può essere più duro se le basi sono deboli.",
    compareLeftTitle: "CompTIA ITF+",
    compareRightTitle: "CompTIA A+",
    compareRows: [
      {
        label: "Ideale per",
        left: "Partire da zero",
        right: "Diventare spendibile più in fretta",
      },
      {
        label: "Difficoltà",
        left: "Più facile e leggero",
        right: "Più ampio e più profondo",
      },
      {
        label: "Consiglio",
        left: "Se ti senti ancora perso",
        right: "Se hai già un minimo di basi",
      },
    ],
    compareRecommendationTitle: "Consiglio pratico",
    compareRecommendationBody:
      "Se sei indeciso, parti da ITF+. Se hai già dimestichezza con il PC, puoi passare ad A+ e fare molta pratica.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "Parto da zero: da dove comincio?",
        a: "Se anche i concetti base del PC non ti sono ancora naturali, parti da ICDL, EIPASS o PEKIT, poi passa a ITF+.",
      },
      {
        q: "Serve fare ITF+ prima di A+?",
        a: "Non sempre. ITF+ serve se ti mancano le basi. Se hai già un po' di confidenza, puoi andare direttamente su A+.",
      },
      {
        q: "ICDL, EIPASS e PEKIT sono ancora utili?",
        a: "Sì, soprattutto se ti serve più sicurezza su competenze digitali generali, strumenti d'ufficio e flussi di lavoro quotidiani.",
      },
      {
        q: "Dopo le fondamenta cosa faccio?",
        a: "Scegli una direzione e resta focalizzato per alcune settimane: reti, cybersecurity, cloud, programmazione o database.",
      },
    ],

    finalCtaTitle: "🚀 Parti ora (piano semplice)",
    finalCtaBody:
      "Costruisci prima le fondamenta, poi specializzati. Inizia da ITF+ se vuoi una base IT pulita, oppure da ICDL se sei davvero all'inizio.",
  },

  es: {
    title: "Ruta Fundamentos IT 2026",
    subtitle: "Empieza desde cero y construye una base sólida de verdad",
    intro:
      "Si estás empezando, la mejor jugada es construir fundamentos reales. Esta ruta te lleva desde habilidades digitales básicas hasta una base IT útil antes de especializarte en redes, ciberseguridad, cloud, bases de datos o programación.",

    ctaPrimary: "Empezar con CompTIA ITF+",
    ctaSecondary: "Ver certificaciones base",
    certCta: "Ver certificación",

    goalLabel: "Objetivo:",
    practiceCta: "Practicar ahora",

    levels: [
      {
        title: "🟢 Nivel 0 — Principiante absoluto",
        body:
          "Empieza con archivos, carpetas, navegador, dispositivos, uso básico del PC y troubleshooting simple. Si esto todavía no te resulta natural, no lo saltes.",
        recommended: [
          "ICDL",
          "EIPASS",
          "PEKIT",
        ],
        goal:
          "Sentirte cómodo con las tareas digitales más comunes.",
        ctaQuizSlug: "icdl",
        ctaCertSlug: "icdl",
        ctaPrimaryText: "Empezar quiz ICDL",
        ctaSecondaryText: "Ver ICDL",
      },
      {
        title: "🟡 Nivel 1 — Primeros fundamentos IT reales",
        body:
          "Aquí pasas del uso del ordenador a entender cómo funciona. Sistemas operativos, seguridad básica, memoria, almacenamiento y conceptos iniciales de red.",
        recommended: [
          "CompTIA ITF+",
          "PEKIT",
        ],
        goal:
          "Entender cómo funciona un sistema informático a nivel básico.",
        ctaQuizSlug: "comptia-itf-plus",
        ctaCertSlug: "comptia-itf-plus",
        ctaPrimaryText: "Empezar quiz ITF+",
        ctaSecondaryText: "Ver ITF+",
      },
      {
        title: "🟠 Nivel 2 — Primeras habilidades empleables",
        body:
          "Ahora entras en la práctica: problemas comunes de hardware y software, instalaciones, actualizaciones, periféricos y soporte a usuarios.",
        recommended: [
          "CompTIA A+",
          "EIPASS",
        ],
        goal:
          "Resolver tareas comunes de soporte con más seguridad.",
        ctaQuizSlug: "comptia-a-plus",
        ctaCertSlug: "comptia-a-plus",
        ctaPrimaryText: "Empezar quiz A+",
        ctaSecondaryText: "Ver A+",
      },
      {
        title: "🔴 Nivel 3 — Refuerza tu seguridad digital",
        body:
          "ICDL, EIPASS y PEKIT siguen siendo útiles si todavía te falta soltura con herramientas de oficina, productividad, documentos y flujos digitales cotidianos.",
        recommended: [
          "ICDL",
          "EIPASS",
          "PEKIT",
        ],
        goal:
          "Ser más fluido y fiable en el trabajo digital diario.",
        ctaQuizSlug: "eipass",
        ctaCertSlug: "eipass",
        ctaPrimaryText: "Empezar quiz EIPASS",
        ctaSecondaryText: "Ver EIPASS",
      },
      {
        title: "⚫ Nivel 4 — Elige una dirección",
        body:
          "Cuando tus bases sean sólidas, deja de quedarte en el nivel generalista. Redes, ciberseguridad, cloud, bases de datos y programación serán mucho más fáciles.",
        recommended: [
          "Networking",
          "Cybersecurity",
          "Cloud",
          "Databases",
          "Programming",
        ],
        goal:
          "Especializarte más rápido y con menos confusión.",
      },
    ],

    salaryTitle: "💰 Salary outlook entry-level IT (2026)",
    salaryIntro:
      "Los fundamentos no pagan por sí solos, pero abren las puertas a caminos que sí lo hacen. Los puestos entry-level varían mucho según país y rol.",
    salaryRanges: [
      { label: "Entry-level", range: "$30k–$50k" },
      { label: "Mid-level", range: "$50k–$75k" },
      { label: "Especializado", range: "$80k+" },
    ],
    salaryDisclaimer:
      "El crecimiento real llega cuando usas la base para entrar en una especialización.",

    compareTitle: "🔍 CompTIA ITF+ vs CompTIA A+ — ¿qué hacer primero?",
    compareIntro:
      "ITF+ es más ligero y perfecto si empiezas desde cero. A+ es más amplio y más orientado al trabajo.",
    compareLeftTitle: "CompTIA ITF+",
    compareRightTitle: "CompTIA A+",
    compareRows: [
      {
        label: "Mejor para",
        left: "Empezar desde cero",
        right: "Ser empleable más rápido",
      },
      {
        label: "Dificultad",
        left: "Más fácil y ligero",
        right: "Más amplio y profundo",
      },
      {
        label: "Recomendación",
        left: "Si aún te sientes perdido",
        right: "Si ya tienes algo de base",
      },
    ],
    compareRecommendationTitle: "Recomendación",
    compareRecommendationBody:
      "Si dudas, empieza con ITF+. Si ya tienes confianza con el ordenador, pasa a A+ y practica mucho.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "Empiezo desde cero, ¿por dónde voy?",
        a: "Si incluso los conceptos básicos del ordenador aún te cuestan, empieza con ICDL, EIPASS o PEKIT y luego pasa a ITF+.",
      },
      {
        q: "¿Necesito ITF+ antes de A+?",
        a: "No siempre. ITF+ sirve si te faltan bases. Si ya tienes algo de confianza, puedes ir directo a A+.",
      },
      {
        q: "¿ICDL, EIPASS y PEKIT siguen siendo útiles?",
        a: "Sí, sobre todo si necesitas más soltura con competencias digitales generales y herramientas de oficina.",
      },
      {
        q: "¿Qué hago después de los fundamentos?",
        a: "Elige una dirección y mantente enfocado unas semanas: redes, ciberseguridad, cloud, programación o bases de datos.",
      },
    ],

    finalCtaTitle: "🚀 Empieza ahora (plan simple)",
    finalCtaBody:
      "Primero fundamentos, después especialización. Empieza con ITF+ si quieres una base IT clara, o con ICDL si estás totalmente al inicio.",
  },

  fr: {
    title: "Parcours Fondamentaux IT 2026",
    subtitle: "Commencer de zéro et construire une vraie base solide",
    intro:
      "Si vous débutez, la meilleure stratégie est de construire de vrais fondamentaux. Ce parcours vous amène des compétences numériques de base vers une base IT utile avant de vous spécialiser en réseau, cybersécurité, cloud, bases de données ou programmation.",

    ctaPrimary: "Commencer avec CompTIA ITF+",
    ctaSecondary: "Voir les certifications de base",
    certCta: "Voir la certification",

    goalLabel: "Objectif :",
    practiceCta: "S’entraîner",

    levels: [
      {
        title: "🟢 Niveau 0 — Débutant absolu",
        body:
          "Commencez par les fichiers, dossiers, navigateur, appareils, usage basique du PC et dépannage simple. Si cela n’est pas encore naturel, ne sautez pas cette étape.",
        recommended: [
          "ICDL",
          "EIPASS",
          "PEKIT",
        ],
        goal:
          "Être à l’aise avec les tâches numériques les plus courantes.",
        ctaQuizSlug: "icdl",
        ctaCertSlug: "icdl",
        ctaPrimaryText: "Commencer le quiz ICDL",
        ctaSecondaryText: "Voir ICDL",
      },
      {
        title: "🟡 Niveau 1 — Premiers vrais fondamentaux IT",
        body:
          "Ici, vous passez de l’usage de l’ordinateur à la compréhension de son fonctionnement. Systèmes d’exploitation, sécurité de base, mémoire, stockage et notions réseau initiales.",
        recommended: [
          "CompTIA ITF+",
          "PEKIT",
        ],
        goal:
          "Comprendre comment fonctionne un système informatique à un niveau de base mais réel.",
        ctaQuizSlug: "comptia-itf-plus",
        ctaCertSlug: "comptia-itf-plus",
        ctaPrimaryText: "Commencer le quiz ITF+",
        ctaSecondaryText: "Voir ITF+",
      },
      {
        title: "🟠 Niveau 2 — Premières compétences employables",
        body:
          "Vous passez maintenant au concret : problèmes matériels et logiciels courants, installations, mises à jour, périphériques et support utilisateur.",
        recommended: [
          "CompTIA A+",
          "EIPASS",
        ],
        goal:
          "Gérer des tâches de support courantes avec plus d’assurance.",
        ctaQuizSlug: "comptia-a-plus",
        ctaCertSlug: "comptia-a-plus",
        ctaPrimaryText: "Commencer le quiz A+",
        ctaSecondaryText: "Voir A+",
      },
      {
        title: "🔴 Niveau 3 — Renforcez votre aisance numérique",
        body:
          "ICDL, EIPASS et PEKIT restent utiles si vous manquez encore de fluidité avec les outils bureautiques, la productivité, les documents et les flux de travail numériques quotidiens.",
        recommended: [
          "ICDL",
          "EIPASS",
          "PEKIT",
        ],
        goal:
          "Devenir plus fluide et plus fiable dans le travail numérique quotidien.",
        ctaQuizSlug: "eipass",
        ctaCertSlug: "eipass",
        ctaPrimaryText: "Commencer le quiz EIPASS",
        ctaSecondaryText: "Voir EIPASS",
      },
      {
        title: "⚫ Niveau 4 — Choisissez une direction",
        body:
          "Quand vos bases sont stables, arrêtez de rester bloqué au niveau généraliste. Réseau, cybersécurité, cloud, bases de données et programmation deviennent bien plus accessibles.",
        recommended: [
          "Networking",
          "Cybersecurity",
          "Cloud",
          "Databases",
          "Programming",
        ],
        goal:
          "Vous spécialiser plus vite, avec moins de confusion et moins de lacunes.",
      },
    ],

    salaryTitle: "💰 Salary outlook entry-level IT (2026)",
    salaryIntro:
      "Les fondamentaux ne paient pas à eux seuls, mais ils ouvrent les parcours qui paient mieux. Les rôles débutants varient beaucoup selon le pays et le poste.",
    salaryRanges: [
      { label: "Entry-level", range: "$30k–$50k" },
      { label: "Mid-level", range: "$50k–$75k" },
      { label: "Spécialisé", range: "$80k+" },
    ],
    salaryDisclaimer:
      "La vraie progression arrive quand vous utilisez ces bases pour entrer dans une spécialisation.",

    compareTitle: "🔍 CompTIA ITF+ vs CompTIA A+ — que faire d’abord ?",
    compareIntro:
      "ITF+ est plus léger et parfait si vous partez de zéro. A+ est plus large et plus orienté vers le travail.",
    compareLeftTitle: "CompTIA ITF+",
    compareRightTitle: "CompTIA A+",
    compareRows: [
      {
        label: "Idéal pour",
        left: "Commencer de zéro",
        right: "Être employable plus vite",
      },
      {
        label: "Difficulté",
        left: "Plus facile et plus léger",
        right: "Plus large et plus profond",
      },
      {
        label: "Recommandation",
        left: "Si vous vous sentez encore perdu",
        right: "Si vous avez déjà quelques bases",
      },
    ],
    compareRecommendationTitle: "Recommandation",
    compareRecommendationBody:
      "Si vous hésitez, commencez par ITF+. Si vous avez déjà confiance avec l’ordinateur, passez à A+ et pratiquez beaucoup.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "Je pars de zéro, par où commencer ?",
        a: "Si même les concepts de base du PC ne sont pas encore naturels, commencez par ICDL, EIPASS ou PEKIT, puis passez à ITF+.",
      },
      {
        q: "Faut-il faire ITF+ avant A+ ?",
        a: "Pas toujours. ITF+ est utile si les bases manquent. Si vous avez déjà un peu d’aisance, vous pouvez aller directement vers A+.",
      },
      {
        q: "ICDL, EIPASS et PEKIT sont-ils encore utiles ?",
        a: "Oui, surtout si vous avez besoin de plus d’aisance sur les compétences numériques générales et les outils bureautiques.",
      },
      {
        q: "Que faire après les fondamentaux ?",
        a: "Choisissez une direction et restez concentré quelques semaines : réseau, cybersécurité, cloud, programmation ou bases de données.",
      },
    ],

    finalCtaTitle: "🚀 Commencez maintenant (plan simple)",
    finalCtaBody:
      "Fondamentaux d’abord, spécialisation ensuite. Commencez par ITF+ si vous voulez une base IT claire, ou par ICDL si vous débutez vraiment.",
  },
};