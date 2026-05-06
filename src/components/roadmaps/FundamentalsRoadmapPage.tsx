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

export default function FundamentalsRoadmapPage({
  lang,
}: {
  lang: Locale;
}) {
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

        <p className="mt-2 text-lg text-slate-600">
          {t.subtitle}
        </p>

        <p className="mt-5 text-slate-700 leading-relaxed">
          {t.intro}
        </p>

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
    title: "IT Fundamentals Roadmap 2026",
    subtitle: "Start from zero and build solid IT foundations",
    intro:
      "If you are new to IT, your fastest progress comes from building real foundations before chasing advanced certifications. This roadmap helps you move from digital confidence to practical IT basics, then choose a clear direction in networking, cybersecurity, cloud, databases, or programming.",

    ctaPrimary: "Start with CompTIA ITF+",
    ctaSecondary: "Browse fundamentals certifications",
    certCta: "Explore certification",

    goalLabel: "Goal:",
    practiceCta: "Practice now",

    levels: [
      {
        title: "🟢 Level 0 — Absolute beginner",
        body:
          "Start with the basics: files, folders, devices, browsers, simple troubleshooting, online safety, and everyday IT vocabulary. If these concepts are still unclear, do not skip them. Weak digital basics make every later IT topic harder.",
        recommended: ["ICDL", "EIPASS", "PEKIT"],
        goal:
          "Feel comfortable with common computer tasks and basic digital concepts.",
        reality:
          "Many beginners want to jump directly into cybersecurity, cloud, or programming. In reality, if basic computer use is still shaky, every advanced path becomes slower and more frustrating.",
        mistakes: [
          "Skipping basic computer concepts",
          "Trying advanced certifications too early",
          "Learning random topics without a path",
          "Ignoring simple troubleshooting habits",
        ],
        outcomes: [
          "Use computers and digital tools with more confidence",
          "Understand basic IT vocabulary",
          "Prepare for ITF+ or A+ with fewer gaps",
        ],
        ctaQuizSlug: "icdl",
        ctaCertSlug: "icdl",
        ctaPrimaryText: "Start ICDL quiz",
        ctaSecondaryText: "Explore ICDL",
      },
      {
        title: "🟡 Level 1 — First real IT foundations",
        body:
          "This is where you move from digital literacy to IT thinking. You start understanding operating systems, filesystems, basic security, storage, memory, hardware, software, and introductory networking concepts.",
        recommended: ["CompTIA ITF+", "PEKIT"],
        goal:
          "Understand how a computer system works at a basic but real level.",
        reality:
          "ITF+ is not glamorous, but it is useful. It gives structure to concepts that many people use every day without really understanding.",
        mistakes: [
          "Treating fundamentals as useless theory",
          "Memorizing terms without understanding real examples",
          "Ignoring hardware and operating system basics",
          "Moving to A+ without knowing basic IT language",
        ],
        outcomes: [
          "Understand the building blocks of IT systems",
          "Follow technical lessons with less confusion",
          "Build a cleaner path toward A+, networking, or cybersecurity",
        ],
        ctaQuizSlug: "comptia-itf-plus",
        ctaCertSlug: "comptia-itf-plus",
        ctaPrimaryText: "Start ITF+ quiz",
        ctaSecondaryText: "Explore ITF+",
      },
      {
        title: "🟠 Level 2 — First job-oriented IT skills",
        body:
          "Now you move into practical support skills: hardware and software issues, updates, installations, peripherals, user support, basic diagnostics, and troubleshooting patterns that appear in real workplaces.",
        recommended: ["CompTIA A+", "EIPASS"],
        goal:
          "Handle common beginner IT tasks with more confidence and structure.",
        reality:
          "Entry-level IT work is often practical, repetitive, and problem-solving oriented. You need patience, troubleshooting logic, and the ability to explain simple fixes clearly.",
        mistakes: [
          "Studying only theory without touching real systems",
          "Ignoring troubleshooting methodology",
          "Underestimating user support and communication",
          "Skipping practice with hardware, software, and peripherals",
        ],
        outcomes: [
          "Understand common support scenarios",
          "Prepare for help desk or junior IT support paths",
          "Build stronger confidence with real IT problems",
        ],
        ctaQuizSlug: "comptia-a-plus",
        ctaCertSlug: "comptia-a-plus",
        ctaPrimaryText: "Start A+ quiz",
        ctaSecondaryText: "Explore A+",
      },
      {
        title: "🔴 Level 3 — Consolidate digital confidence",
        body:
          "Certifications like ICDL, EIPASS, and PEKIT can still help if you need stronger confidence with office tools, productivity, documents, collaboration, and everyday digital workflows. They are not advanced IT certifications, but they can strengthen weak foundations.",
        recommended: ["ICDL", "EIPASS", "PEKIT"],
        goal:
          "Become more fluent and reliable in everyday digital work.",
        reality:
          "Not everyone needs to become a systems engineer immediately. For many learners, becoming reliable with digital work is already a major step forward.",
        mistakes: [
          "Feeling ashamed of revisiting basics",
          "Ignoring office and productivity tools",
          "Confusing digital confidence with advanced IT skill",
          "Collecting certificates without practicing daily tasks",
        ],
        outcomes: [
          "Work more confidently with digital tools",
          "Improve productivity and daily workflows",
          "Reduce anxiety around basic technology tasks",
        ],
        ctaQuizSlug: "eipass",
        ctaCertSlug: "eipass",
        ctaPrimaryText: "Start EIPASS quiz",
        ctaSecondaryText: "Explore EIPASS",
      },
      {
        title: "⚫ Level 4 — Choose your direction",
        body:
          "Once your fundamentals are stable, choose a direction. Networking, cybersecurity, cloud, databases, and programming all become easier when your basic IT foundation is clear. Do not stay forever in the general beginner stage.",
        recommended: [
          "Networking",
          "Cybersecurity",
          "Cloud",
          "Databases",
          "Programming",
        ],
        goal:
          "Specialize faster, with less confusion and fewer gaps.",
        reality:
          "The biggest mistake after fundamentals is drifting. At some point you need to choose one path and stay focused long enough to build real momentum.",
        mistakes: [
          "Studying five paths at the same time",
          "Changing direction every week",
          "Avoiding practice because you feel unready",
          "Staying forever in beginner content",
        ],
        outcomes: [
          "Pick a clearer specialization",
          "Move toward job-oriented skills",
          "Build a more serious long-term IT learning plan",
        ],
      },
    ],

    salaryTitle: "💰 Entry-level IT salary outlook (2026)",
    salaryIntro:
      "Fundamentals alone do not create high salaries, but they unlock the paths that do. Entry-level roles vary a lot by country, company, and job type.",
    salaryRanges: [
      { label: "Entry-level", range: "$30k–$50k" },
      { label: "Mid-level", range: "$50k–$75k" },
      { label: "Specialized", range: "$80k+" },
    ],
    salaryDisclaimer:
      "Real growth usually comes after you use fundamentals to move into a specialization such as networking, cybersecurity, cloud, programming, or databases.",

    compareTitle: "🔍 CompTIA ITF+ vs CompTIA A+ — what should you do first?",
    compareIntro:
      "ITF+ is lighter and better for complete beginners. A+ is broader and more job-oriented, but harder if your basics are weak.",
    compareLeftTitle: "CompTIA ITF+",
    compareRightTitle: "CompTIA A+",
    compareRows: [
      {
        label: "Best for",
        left: "Starting from zero",
        right: "Moving toward IT support roles",
      },
      {
        label: "Difficulty",
        left: "Easier and lighter",
        right: "Broader and more practical",
      },
      {
        label: "Recommendation",
        left: "Choose it if you still feel lost",
        right: "Choose it if you already know the basics",
      },
    ],
    compareRecommendationTitle: "Recommendation",
    compareRecommendationBody:
      "If you are unsure, start with ITF+. If you already feel confident with computers, move to A+ and practice consistently.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "I am starting from zero. Where should I begin?",
        a: "If basic computer concepts still feel confusing, start with ICDL, EIPASS, or PEKIT, then move to ITF+.",
      },
      {
        q: "Do I need ITF+ before A+?",
        a: "Not always. ITF+ is useful if your foundations are weak. If you already understand basic computer concepts, you can move directly to A+.",
      },
      {
        q: "Are ICDL, EIPASS, and PEKIT still useful?",
        a: "Yes, especially if you need more confidence with general digital skills, office tools, documents, and daily workflows.",
      },
      {
        q: "What should I do after fundamentals?",
        a: "Choose one direction and stay focused for a few weeks: networking, cybersecurity, cloud, programming, or databases.",
      },
    ],

    finalCtaTitle: "🚀 Start now with a simple plan",
    finalCtaBody:
      "Build your fundamentals first, then specialize. Start with ITF+ if you want a clean IT path, or ICDL if you are completely new.",
  },

  it: {
    title: "Roadmap Fondamenta IT 2026",
    subtitle: "Parti da zero e costruisci basi IT solide",
    intro:
      "Se sei all’inizio, il progresso più veloce arriva costruendo vere fondamenta prima di inseguire certificazioni avanzate. Questa roadmap ti porta dalla sicurezza digitale di base a competenze IT pratiche, poi ti aiuta a scegliere una direzione chiara tra reti, cybersecurity, cloud, database o programmazione.",

    ctaPrimary: "Inizia con CompTIA ITF+",
    ctaSecondary: "Vedi le certificazioni Base",
    certCta: "Scopri certificazione",

    goalLabel: "Obiettivo:",
    practiceCta: "Allenati ora",

    levels: [
      {
        title: "🟢 Livello 0 — Principiante assoluto",
        body:
          "Parti dalle basi: file, cartelle, dispositivi, browser, troubleshooting semplice, sicurezza online e linguaggio IT quotidiano. Se questi concetti non sono ancora chiari, non saltarli. Basi digitali deboli rendono più difficile ogni percorso successivo.",
        recommended: ["ICDL", "EIPASS", "PEKIT"],
        goal:
          "Sentirti a tuo agio con le attività comuni al computer e i concetti digitali di base.",
        reality:
          "Molti principianti vogliono saltare subito a cybersecurity, cloud o programmazione. In realtà, se l’uso base del computer è ancora incerto, ogni percorso avanzato diventa più lento e frustrante.",
        mistakes: [
          "Saltare i concetti base del computer",
          "Provare certificazioni avanzate troppo presto",
          "Studiare argomenti casuali senza percorso",
          "Ignorare le abitudini di troubleshooting semplice",
        ],
        outcomes: [
          "Usare computer e strumenti digitali con più sicurezza",
          "Comprendere il linguaggio IT di base",
          "Prepararti a ITF+ o A+ con meno lacune",
        ],
        ctaQuizSlug: "icdl",
        ctaCertSlug: "icdl",
        ctaPrimaryText: "Inizia quiz ICDL",
        ctaSecondaryText: "Scopri ICDL",
      },
      {
        title: "🟡 Livello 1 — Prime vere fondamenta IT",
        body:
          "Qui passi dalla semplice alfabetizzazione digitale al ragionamento IT. Inizi a capire sistemi operativi, filesystem, sicurezza base, storage, memoria, hardware, software e primi concetti di networking.",
        recommended: ["CompTIA ITF+", "PEKIT"],
        goal:
          "Capire come funziona un sistema informatico a livello base ma reale.",
        reality:
          "ITF+ non è spettacolare, ma è utile. Ti dà struttura su concetti che molte persone usano ogni giorno senza capirli davvero.",
        mistakes: [
          "Trattare le fondamenta come teoria inutile",
          "Memorizzare termini senza esempi reali",
          "Ignorare hardware e sistemi operativi",
          "Passare ad A+ senza conoscere il linguaggio IT base",
        ],
        outcomes: [
          "Comprendere i mattoni fondamentali dei sistemi IT",
          "Seguire lezioni tecniche con meno confusione",
          "Costruire un percorso più pulito verso A+, reti o cybersecurity",
        ],
        ctaQuizSlug: "comptia-itf-plus",
        ctaCertSlug: "comptia-itf-plus",
        ctaPrimaryText: "Inizia quiz ITF+",
        ctaSecondaryText: "Scopri ITF+",
      },
      {
        title: "🟠 Livello 2 — Prime competenze IT orientate al lavoro",
        body:
          "Ora entri nel pratico: problemi hardware e software, aggiornamenti, installazioni, periferiche, supporto utenti, diagnostica base e schemi di troubleshooting che compaiono nei veri ambienti di lavoro.",
        recommended: ["CompTIA A+", "EIPASS"],
        goal:
          "Gestire attività IT comuni con più sicurezza e metodo.",
        reality:
          "Il lavoro IT entry-level è spesso pratico, ripetitivo e basato sulla risoluzione problemi. Servono pazienza, logica di troubleshooting e capacità di spiegare soluzioni semplici.",
        mistakes: [
          "Studiare solo teoria senza toccare sistemi reali",
          "Ignorare la metodologia di troubleshooting",
          "Sottovalutare supporto utenti e comunicazione",
          "Saltare pratica su hardware, software e periferiche",
        ],
        outcomes: [
          "Comprendere scenari comuni di supporto IT",
          "Prepararti a ruoli help desk o junior IT support",
          "Aumentare fiducia davanti a problemi tecnici reali",
        ],
        ctaQuizSlug: "comptia-a-plus",
        ctaCertSlug: "comptia-a-plus",
        ctaPrimaryText: "Inizia quiz A+",
        ctaSecondaryText: "Scopri A+",
      },
      {
        title: "🔴 Livello 3 — Consolida la sicurezza digitale",
        body:
          "Certificazioni come ICDL, EIPASS e PEKIT possono ancora aiutarti se vuoi più sicurezza con strumenti d’ufficio, produttività, documenti, collaborazione e flussi digitali quotidiani. Non sono certificazioni IT avanzate, ma rafforzano basi fragili.",
        recommended: ["ICDL", "EIPASS", "PEKIT"],
        goal:
          "Diventare più fluido e affidabile nel lavoro digitale quotidiano.",
        reality:
          "Non tutti devono diventare subito system engineer. Per molti studenti, diventare affidabili nel lavoro digitale è già un passo enorme.",
        mistakes: [
          "Vergognarsi di ripassare le basi",
          "Ignorare strumenti office e produttività",
          "Confondere sicurezza digitale con skill IT avanzate",
          "Collezionare certificati senza praticare attività quotidiane",
        ],
        outcomes: [
          "Lavorare meglio con strumenti digitali",
          "Migliorare produttività e flussi quotidiani",
          "Ridurre l’ansia davanti a compiti tecnologici base",
        ],
        ctaQuizSlug: "eipass",
        ctaCertSlug: "eipass",
        ctaPrimaryText: "Inizia quiz EIPASS",
        ctaSecondaryText: "Scopri EIPASS",
      },
      {
        title: "⚫ Livello 4 — Scegli una direzione",
        body:
          "Quando le fondamenta sono stabili, scegli una direzione. Reti, cybersecurity, cloud, database e programmazione diventano molto più semplici quando la base IT è chiara. Non restare per sempre nella fase principiante generica.",
        recommended: [
          "Reti",
          "Cybersecurity",
          "Cloud",
          "Database",
          "Programmazione",
        ],
        goal:
          "Specializzarti più velocemente, con meno confusione e meno lacune.",
        reality:
          "L’errore più grande dopo le fondamenta è vagare. A un certo punto devi scegliere un percorso e restarci abbastanza da creare slancio reale.",
        mistakes: [
          "Studiare cinque percorsi insieme",
          "Cambiare direzione ogni settimana",
          "Evitare la pratica perché non ti senti pronto",
          "Restare per sempre nei contenuti da principiante",
        ],
        outcomes: [
          "Scegliere una specializzazione più chiara",
          "Avvicinarti a competenze spendibili",
          "Costruire un piano IT più serio sul lungo periodo",
        ],
      },
    ],

    salaryTitle: "💰 Salary outlook entry-level IT (2026)",
    salaryIntro:
      "Le fondamenta da sole non creano stipendi alti, ma sbloccano i percorsi che lo fanno. I ruoli entry-level cambiano molto in base a paese, azienda e tipo di lavoro.",
    salaryRanges: [
      { label: "Entry-level", range: "$30k–$50k" },
      { label: "Mid-level", range: "$50k–$75k" },
      { label: "Specializzato", range: "$80k+" },
    ],
    salaryDisclaimer:
      "La crescita reale arriva quando usi le fondamenta per entrare in una specializzazione come reti, cybersecurity, cloud, programmazione o database.",

    compareTitle: "🔍 CompTIA ITF+ vs CompTIA A+ — cosa fare prima?",
    compareIntro:
      "ITF+ è più leggero e adatto ai principianti completi. A+ è più ampio e più orientato al lavoro, ma è più difficile se le basi sono deboli.",
    compareLeftTitle: "CompTIA ITF+",
    compareRightTitle: "CompTIA A+",
    compareRows: [
      {
        label: "Ideale per",
        left: "Partire da zero",
        right: "Avvicinarsi al supporto IT",
      },
      {
        label: "Difficoltà",
        left: "Più facile e leggero",
        right: "Più ampio e pratico",
      },
      {
        label: "Consiglio",
        left: "Sceglilo se ti senti ancora perso",
        right: "Sceglilo se conosci già le basi",
      },
    ],
    compareRecommendationTitle: "Consiglio",
    compareRecommendationBody:
      "Se sei indeciso, parti da ITF+. Se hai già sicurezza con il computer, passa ad A+ e pratica con costanza.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "Parto da zero. Da dove comincio?",
        a: "Se anche i concetti base del computer ti sembrano confusi, parti da ICDL, EIPASS o PEKIT, poi passa a ITF+.",
      },
      {
        q: "Devo fare ITF+ prima di A+?",
        a: "Non sempre. ITF+ è utile se le fondamenta sono deboli. Se conosci già i concetti base del computer, puoi passare direttamente ad A+.",
      },
      {
        q: "ICDL, EIPASS e PEKIT sono ancora utili?",
        a: "Sì, soprattutto se vuoi più sicurezza con competenze digitali generali, strumenti d’ufficio, documenti e workflow quotidiani.",
      },
      {
        q: "Cosa faccio dopo le fondamenta?",
        a: "Scegli una direzione e resta concentrato per qualche settimana: reti, cybersecurity, cloud, programmazione o database.",
      },
    ],

    finalCtaTitle: "🚀 Parti ora con un piano semplice",
    finalCtaBody:
      "Costruisci prima le fondamenta, poi specializzati. Inizia da ITF+ se vuoi una base IT pulita, oppure da ICDL se sei davvero all’inizio.",
  },

  es: {
    title: "Ruta Fundamentos IT 2026",
    subtitle: "Empieza desde cero y construye bases IT sólidas",
    intro:
      "Si estás empezando, el progreso más rápido llega construyendo fundamentos reales antes de perseguir certificaciones avanzadas. Esta ruta te lleva desde confianza digital básica hasta fundamentos IT prácticos, y luego te ayuda a elegir una dirección clara: redes, ciberseguridad, cloud, bases de datos o programación.",

    ctaPrimary: "Empezar con CompTIA ITF+",
    ctaSecondary: "Ver certificaciones base",
    certCta: "Ver certificación",

    goalLabel: "Objetivo:",
    practiceCta: "Practicar ahora",

    levels: [
      {
        title: "🟢 Nivel 0 — Principiante absoluto",
        body:
          "Empieza por lo básico: archivos, carpetas, dispositivos, navegador, troubleshooting simple, seguridad online y vocabulario IT cotidiano. Si estos conceptos aún no están claros, no los saltes. Unas bases digitales débiles hacen más difícil todo lo que viene después.",
        recommended: ["ICDL", "EIPASS", "PEKIT"],
        goal:
          "Sentirte cómodo con tareas comunes del ordenador y conceptos digitales básicos.",
        reality:
          "Muchos principiantes quieren saltar directamente a ciberseguridad, cloud o programación. En realidad, si el uso básico del ordenador todavía es inseguro, cualquier camino avanzado se vuelve más lento y frustrante.",
        mistakes: [
          "Saltar conceptos básicos del ordenador",
          "Intentar certificaciones avanzadas demasiado pronto",
          "Estudiar temas aleatorios sin una ruta",
          "Ignorar hábitos simples de troubleshooting",
        ],
        outcomes: [
          "Usar ordenadores y herramientas digitales con más confianza",
          "Comprender vocabulario IT básico",
          "Prepararte para ITF+ o A+ con menos vacíos",
        ],
        ctaQuizSlug: "icdl",
        ctaCertSlug: "icdl",
        ctaPrimaryText: "Empezar quiz ICDL",
        ctaSecondaryText: "Ver ICDL",
      },
      {
        title: "🟡 Nivel 1 — Primeros fundamentos IT reales",
        body:
          "Aquí pasas de la alfabetización digital al pensamiento IT. Empiezas a entender sistemas operativos, filesystem, seguridad básica, almacenamiento, memoria, hardware, software y conceptos iniciales de networking.",
        recommended: ["CompTIA ITF+", "PEKIT"],
        goal:
          "Comprender cómo funciona un sistema informático a nivel básico pero real.",
        reality:
          "ITF+ no es espectacular, pero es útil. Da estructura a conceptos que muchas personas usan cada día sin entenderlos realmente.",
        mistakes: [
          "Tratar los fundamentos como teoría inútil",
          "Memorizar términos sin ejemplos reales",
          "Ignorar hardware y sistemas operativos",
          "Pasar a A+ sin conocer el lenguaje IT básico",
        ],
        outcomes: [
          "Comprender los componentes principales de los sistemas IT",
          "Seguir clases técnicas con menos confusión",
          "Construir una ruta más clara hacia A+, redes o ciberseguridad",
        ],
        ctaQuizSlug: "comptia-itf-plus",
        ctaCertSlug: "comptia-itf-plus",
        ctaPrimaryText: "Empezar quiz ITF+",
        ctaSecondaryText: "Ver ITF+",
      },
      {
        title: "🟠 Nivel 2 — Primeras habilidades IT orientadas al trabajo",
        body:
          "Ahora entras en la parte práctica: problemas de hardware y software, actualizaciones, instalaciones, periféricos, soporte a usuarios, diagnóstico básico y patrones de troubleshooting que aparecen en entornos reales.",
        recommended: ["CompTIA A+", "EIPASS"],
        goal:
          "Gestionar tareas IT comunes con más seguridad y método.",
        reality:
          "El trabajo IT entry-level suele ser práctico, repetitivo y basado en resolución de problemas. Necesitas paciencia, lógica de troubleshooting y capacidad para explicar soluciones simples.",
        mistakes: [
          "Estudiar solo teoría sin tocar sistemas reales",
          "Ignorar la metodología de troubleshooting",
          "Subestimar soporte a usuarios y comunicación",
          "Saltar práctica con hardware, software y periféricos",
        ],
        outcomes: [
          "Comprender escenarios comunes de soporte IT",
          "Prepararte para help desk o soporte IT junior",
          "Ganar confianza ante problemas técnicos reales",
        ],
        ctaQuizSlug: "comptia-a-plus",
        ctaCertSlug: "comptia-a-plus",
        ctaPrimaryText: "Empezar quiz A+",
        ctaSecondaryText: "Ver A+",
      },
      {
        title: "🔴 Nivel 3 — Consolida tu confianza digital",
        body:
          "Certificaciones como ICDL, EIPASS y PEKIT pueden ayudarte si necesitas más confianza con herramientas de oficina, productividad, documentos, colaboración y flujos digitales diarios. No son certificaciones IT avanzadas, pero fortalecen bases débiles.",
        recommended: ["ICDL", "EIPASS", "PEKIT"],
        goal:
          "Ser más fluido y fiable en el trabajo digital diario.",
        reality:
          "No todo el mundo necesita convertirse en system engineer de inmediato. Para muchos estudiantes, ser fiable en el trabajo digital ya es un gran paso.",
        mistakes: [
          "Avergonzarse de repasar bases",
          "Ignorar herramientas de oficina y productividad",
          "Confundir confianza digital con habilidad IT avanzada",
          "Coleccionar certificados sin practicar tareas diarias",
        ],
        outcomes: [
          "Trabajar mejor con herramientas digitales",
          "Mejorar productividad y workflows diarios",
          "Reducir ansiedad ante tareas tecnológicas básicas",
        ],
        ctaQuizSlug: "eipass",
        ctaCertSlug: "eipass",
        ctaPrimaryText: "Empezar quiz EIPASS",
        ctaSecondaryText: "Ver EIPASS",
      },
      {
        title: "⚫ Nivel 4 — Elige una dirección",
        body:
          "Cuando tus fundamentos estén estables, elige una dirección. Redes, ciberseguridad, cloud, bases de datos y programación se vuelven mucho más fáciles cuando la base IT está clara. No te quedes para siempre en la etapa de principiante generalista.",
        recommended: [
          "Networking",
          "Cybersecurity",
          "Cloud",
          "Databases",
          "Programming",
        ],
        goal:
          "Especializarte más rápido, con menos confusión y menos vacíos.",
        reality:
          "El mayor error después de los fundamentos es divagar. En algún momento tienes que elegir una ruta y mantenerte el tiempo suficiente para crear impulso real.",
        mistakes: [
          "Estudiar cinco caminos al mismo tiempo",
          "Cambiar de dirección cada semana",
          "Evitar la práctica porque no te sientes listo",
          "Quedarte para siempre en contenido de principiante",
        ],
        outcomes: [
          "Elegir una especialización más clara",
          "Acercarte a habilidades orientadas al trabajo",
          "Construir un plan IT más serio a largo plazo",
        ],
      },
    ],

    salaryTitle: "💰 Salarios IT entry-level (2026)",
    salaryIntro:
      "Los fundamentos por sí solos no crean salarios altos, pero desbloquean los caminos que sí lo hacen. Los roles entry-level varían mucho según país, empresa y tipo de trabajo.",
    salaryRanges: [
      { label: "Entry-level", range: "$30k–$50k" },
      { label: "Mid-level", range: "$50k–$75k" },
      { label: "Especializado", range: "$80k+" },
    ],
    salaryDisclaimer:
      "El crecimiento real suele llegar cuando usas los fundamentos para entrar en una especialización como redes, ciberseguridad, cloud, programación o bases de datos.",

    compareTitle: "🔍 CompTIA ITF+ vs CompTIA A+ — ¿qué hacer primero?",
    compareIntro:
      "ITF+ es más ligero y mejor para principiantes completos. A+ es más amplio y más orientado al trabajo, pero más difícil si tus bases son débiles.",
    compareLeftTitle: "CompTIA ITF+",
    compareRightTitle: "CompTIA A+",
    compareRows: [
      {
        label: "Mejor para",
        left: "Empezar desde cero",
        right: "Acercarse a soporte IT",
      },
      {
        label: "Dificultad",
        left: "Más fácil y ligero",
        right: "Más amplio y práctico",
      },
      {
        label: "Recomendación",
        left: "Elígelo si aún te sientes perdido",
        right: "Elígelo si ya conoces las bases",
      },
    ],
    compareRecommendationTitle: "Recomendación",
    compareRecommendationBody:
      "Si dudas, empieza con ITF+. Si ya tienes confianza con el ordenador, pasa a A+ y practica de forma constante.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "Empiezo desde cero. ¿Por dónde comienzo?",
        a: "Si incluso los conceptos básicos del ordenador te parecen confusos, empieza con ICDL, EIPASS o PEKIT, y luego pasa a ITF+.",
      },
      {
        q: "¿Necesito ITF+ antes de A+?",
        a: "No siempre. ITF+ es útil si tus fundamentos son débiles. Si ya entiendes conceptos básicos del ordenador, puedes pasar directamente a A+.",
      },
      {
        q: "¿ICDL, EIPASS y PEKIT siguen siendo útiles?",
        a: "Sí, sobre todo si necesitas más confianza con competencias digitales generales, herramientas de oficina, documentos y workflows diarios.",
      },
      {
        q: "¿Qué hago después de los fundamentos?",
        a: "Elige una dirección y mantente enfocado unas semanas: redes, ciberseguridad, cloud, programación o bases de datos.",
      },
    ],

    finalCtaTitle: "🚀 Empieza ahora con un plan simple",
    finalCtaBody:
      "Primero construye fundamentos, luego especialízate. Empieza con ITF+ si quieres una ruta IT clara, o con ICDL si empiezas completamente desde cero.",
  },

  fr: {
    title: "Parcours Fondamentaux IT 2026",
    subtitle: "Commencer de zéro et construire des bases IT solides",
    intro:
      "Si vous débutez, les progrès les plus rapides viennent de vraies fondations avant de poursuivre des certifications avancées. Ce parcours vous mène de la confiance numérique de base aux fondamentaux IT pratiques, puis vous aide à choisir une direction claire : réseau, cybersécurité, cloud, bases de données ou programmation.",

    ctaPrimary: "Commencer avec CompTIA ITF+",
    ctaSecondary: "Voir les certifications de base",
    certCta: "Voir la certification",

    goalLabel: "Objectif :",
    practiceCta: "S’entraîner maintenant",

    levels: [
      {
        title: "🟢 Niveau 0 — Débutant absolu",
        body:
          "Commencez par les bases : fichiers, dossiers, appareils, navigateur, dépannage simple, sécurité en ligne et vocabulaire IT courant. Si ces concepts ne sont pas encore clairs, ne les sautez pas. Des bases numériques faibles rendent tout le reste plus difficile.",
        recommended: ["ICDL", "EIPASS", "PEKIT"],
        goal:
          "Être à l’aise avec les tâches courantes sur ordinateur et les concepts numériques de base.",
        reality:
          "Beaucoup de débutants veulent passer directement à la cybersécurité, au cloud ou à la programmation. En réalité, si l’usage de base de l’ordinateur est fragile, chaque parcours avancé devient plus lent et frustrant.",
        mistakes: [
          "Sauter les concepts de base de l’ordinateur",
          "Tenter des certifications avancées trop tôt",
          "Étudier des sujets au hasard sans parcours",
          "Ignorer les habitudes simples de dépannage",
        ],
        outcomes: [
          "Utiliser ordinateurs et outils numériques avec plus de confiance",
          "Comprendre le vocabulaire IT de base",
          "Se préparer à ITF+ ou A+ avec moins de lacunes",
        ],
        ctaQuizSlug: "icdl",
        ctaCertSlug: "icdl",
        ctaPrimaryText: "Commencer le quiz ICDL",
        ctaSecondaryText: "Voir ICDL",
      },
      {
        title: "🟡 Niveau 1 — Premiers vrais fondamentaux IT",
        body:
          "Ici, vous passez de la culture numérique au raisonnement IT. Vous commencez à comprendre systèmes d’exploitation, fichiers, sécurité de base, stockage, mémoire, matériel, logiciel et premières notions de réseau.",
        recommended: ["CompTIA ITF+", "PEKIT"],
        goal:
          "Comprendre comment fonctionne un système informatique à un niveau basique mais réel.",
        reality:
          "ITF+ n’est pas spectaculaire, mais c’est utile. Il donne une structure à des concepts que beaucoup utilisent chaque jour sans vraiment les comprendre.",
        mistakes: [
          "Traiter les fondamentaux comme une théorie inutile",
          "Mémoriser des termes sans exemples réels",
          "Ignorer matériel et systèmes d’exploitation",
          "Passer à A+ sans connaître le vocabulaire IT de base",
        ],
        outcomes: [
          "Comprendre les blocs principaux des systèmes IT",
          "Suivre des cours techniques avec moins de confusion",
          "Construire une voie plus claire vers A+, réseau ou cybersécurité",
        ],
        ctaQuizSlug: "comptia-itf-plus",
        ctaCertSlug: "comptia-itf-plus",
        ctaPrimaryText: "Commencer le quiz ITF+",
        ctaSecondaryText: "Voir ITF+",
      },
      {
        title: "🟠 Niveau 2 — Premières compétences IT orientées métier",
        body:
          "Vous passez maintenant au concret : problèmes matériels et logiciels, mises à jour, installations, périphériques, support utilisateur, diagnostic de base et méthodes de dépannage présentes dans les vrais environnements de travail.",
        recommended: ["CompTIA A+", "EIPASS"],
        goal:
          "Gérer des tâches IT courantes avec plus de confiance et de méthode.",
        reality:
          "Le travail IT entry-level est souvent pratique, répétitif et orienté résolution de problèmes. Il faut de la patience, une logique de dépannage et la capacité d’expliquer clairement des solutions simples.",
        mistakes: [
          "Étudier seulement la théorie sans toucher de vrais systèmes",
          "Ignorer la méthode de dépannage",
          "Sous-estimer le support utilisateur et la communication",
          "Sauter la pratique sur matériel, logiciel et périphériques",
        ],
        outcomes: [
          "Comprendre les scénarios courants de support IT",
          "Se préparer à des rôles help desk ou support IT junior",
          "Gagner en confiance face aux problèmes techniques réels",
        ],
        ctaQuizSlug: "comptia-a-plus",
        ctaCertSlug: "comptia-a-plus",
        ctaPrimaryText: "Commencer le quiz A+",
        ctaSecondaryText: "Voir A+",
      },
      {
        title: "🔴 Niveau 3 — Consolider la confiance numérique",
        body:
          "Des certifications comme ICDL, EIPASS et PEKIT peuvent encore aider si vous voulez plus d’aisance avec les outils bureautiques, la productivité, les documents, la collaboration et les flux numériques quotidiens. Ce ne sont pas des certifications IT avancées, mais elles renforcent des bases fragiles.",
        recommended: ["ICDL", "EIPASS", "PEKIT"],
        goal:
          "Devenir plus fluide et fiable dans le travail numérique quotidien.",
        reality:
          "Tout le monde n’a pas besoin de devenir immédiatement ingénieur système. Pour beaucoup d’apprenants, devenir fiable dans le travail numérique est déjà une étape énorme.",
        mistakes: [
          "Avoir honte de revoir les bases",
          "Ignorer les outils bureautiques et la productivité",
          "Confondre confiance numérique et compétence IT avancée",
          "Collectionner des certificats sans pratiquer les tâches quotidiennes",
        ],
        outcomes: [
          "Mieux travailler avec les outils numériques",
          "Améliorer productivité et flux quotidiens",
          "Réduire l’anxiété face aux tâches technologiques de base",
        ],
        ctaQuizSlug: "eipass",
        ctaCertSlug: "eipass",
        ctaPrimaryText: "Commencer le quiz EIPASS",
        ctaSecondaryText: "Voir EIPASS",
      },
      {
        title: "⚫ Niveau 4 — Choisir une direction",
        body:
          "Lorsque vos bases sont stables, choisissez une direction. Réseau, cybersécurité, cloud, bases de données et programmation deviennent beaucoup plus accessibles quand les fondamentaux IT sont clairs. Ne restez pas bloqué pour toujours au niveau débutant généraliste.",
        recommended: [
          "Networking",
          "Cybersecurity",
          "Cloud",
          "Databases",
          "Programming",
        ],
        goal:
          "Vous spécialiser plus vite, avec moins de confusion et moins de lacunes.",
        reality:
          "La plus grosse erreur après les fondamentaux est de se disperser. À un moment, il faut choisir une voie et rester concentré assez longtemps pour créer une vraie progression.",
        mistakes: [
          "Étudier cinq parcours en même temps",
          "Changer de direction chaque semaine",
          "Éviter la pratique parce que vous ne vous sentez pas prêt",
          "Rester bloqué dans le contenu débutant",
        ],
        outcomes: [
          "Choisir une spécialisation plus claire",
          "Se rapprocher de compétences orientées emploi",
          "Construire un plan IT plus sérieux à long terme",
        ],
      },
    ],

    salaryTitle: "💰 Salaires IT entry-level (2026)",
    salaryIntro:
      "Les fondamentaux seuls ne créent pas de hauts salaires, mais ils débloquent les parcours qui le font. Les rôles entry-level varient beaucoup selon le pays, l’entreprise et le type de poste.",
    salaryRanges: [
      { label: "Entry-level", range: "$30k–$50k" },
      { label: "Mid-level", range: "$50k–$75k" },
      { label: "Spécialisé", range: "$80k+" },
    ],
    salaryDisclaimer:
      "La vraie progression arrive généralement lorsque vous utilisez ces bases pour entrer dans une spécialisation comme réseau, cybersécurité, cloud, programmation ou bases de données.",

    compareTitle: "🔍 CompTIA ITF+ vs CompTIA A+ — que faire d’abord ?",
    compareIntro:
      "ITF+ est plus léger et mieux adapté aux débutants complets. A+ est plus large et plus orienté métier, mais plus difficile si vos bases sont faibles.",
    compareLeftTitle: "CompTIA ITF+",
    compareRightTitle: "CompTIA A+",
    compareRows: [
      {
        label: "Idéal pour",
        left: "Commencer de zéro",
        right: "Se rapprocher du support IT",
      },
      {
        label: "Difficulté",
        left: "Plus facile et plus léger",
        right: "Plus large et plus pratique",
      },
      {
        label: "Recommandation",
        left: "Choisissez-le si vous êtes encore perdu",
        right: "Choisissez-le si vous connaissez déjà les bases",
      },
    ],
    compareRecommendationTitle: "Recommandation",
    compareRecommendationBody:
      "Si vous hésitez, commencez avec ITF+. Si vous êtes déjà à l’aise avec l’ordinateur, passez à A+ et pratiquez régulièrement.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "Je pars de zéro. Par où commencer ?",
        a: "Si même les concepts de base de l’ordinateur semblent confus, commencez avec ICDL, EIPASS ou PEKIT, puis passez à ITF+.",
      },
      {
        q: "Faut-il faire ITF+ avant A+ ?",
        a: "Pas toujours. ITF+ est utile si vos bases sont faibles. Si vous comprenez déjà les concepts de base de l’ordinateur, vous pouvez passer directement à A+.",
      },
      {
        q: "ICDL, EIPASS et PEKIT sont-ils encore utiles ?",
        a: "Oui, surtout si vous voulez plus de confiance avec les compétences numériques générales, les outils bureautiques, les documents et les workflows quotidiens.",
      },
      {
        q: "Que faire après les fondamentaux ?",
        a: "Choisissez une direction et restez concentré quelques semaines : réseau, cybersécurité, cloud, programmation ou bases de données.",
      },
    ],

    finalCtaTitle: "🚀 Commencez maintenant avec un plan simple",
    finalCtaBody:
      "Construisez d’abord vos fondamentaux, puis spécialisez-vous. Commencez avec ITF+ si vous voulez une voie IT claire, ou avec ICDL si vous débutez complètement.",
  },
};