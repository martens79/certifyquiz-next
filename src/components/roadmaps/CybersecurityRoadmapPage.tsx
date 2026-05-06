import Link from "next/link";

type Locale = "it" | "en" | "es" | "fr";

type RoadmapQuizSlug = string;
type RoadmapCertSlug = string;

export default function CybersecurityRoadmapPage({
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

  const categoryCyber =
    lang === "en"
      ? "/categories/security"
      : lang === "it"
      ? "/it/categorie/sicurezza"
      : lang === "es"
      ? "/es/categorias/seguridad"
      : "/fr/categories/securite";

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          {t.title}
        </h1>
        <p className="mt-2 text-lg text-slate-600">{t.subtitle}</p>
        <p className="mt-5 text-slate-700 leading-relaxed">{t.intro}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={quiz("isc2-cc")}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition"
          >
            {t.ctaPrimary}
          </Link>

          <Link
            href={categoryCyber}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-800 hover:bg-slate-50 transition"
          >
            {t.ctaSecondary}
          </Link>
        </div>
      </header>

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

      <section className="mt-10 rounded-2xl border border-blue-200 bg-blue-50 p-5">
        <h2 className="text-xl font-extrabold text-slate-900">
          {t.finalCtaTitle}
        </h2>
        <p className="mt-2 text-slate-700">{t.finalCtaBody}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={quiz("isc2-cc")}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition"
          >
            {t.ctaPrimary}
          </Link>
          <Link
            href={categoryCyber}
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
    title: "Cybersecurity Certification Roadmap 2026",
    subtitle: "From beginner to real cybersecurity skills",
    intro:
      "Cybersecurity is not just hacking. First you need fundamentals, then an entry certification, then stronger practical and defensive skills. This roadmap gives you a practical order based on the cybersecurity certifications already available on CertifyQuiz.",

    ctaPrimary: "Start with ISC2 CC quiz",
    ctaSecondary: "Browse cybersecurity certifications",
    certCta: "Explore certification",

    goalLabel: "Goal:",
    practiceCta: "Practice now",

levels: [
  {
    title: "🟢 Level 0 — No IT / security basics",
    body:
      "If you are completely new, do not start with hacking tools. First understand how networks, operating systems, accounts, permissions, and basic security concepts work. Cybersecurity makes sense only when you understand what you are trying to protect.",
    recommended: [
      "Basic networking: IP, DNS, routing",
      "Operating systems basics",
      "Accounts, permissions and access control",
      "Basic security concepts",
    ],
    goal: "Understand systems before trying to secure or attack them.",
    reality:
      "Most beginners want to jump straight into ethical hacking. In reality, weak fundamentals make every cybersecurity topic harder later.",
    mistakes: [
      "Starting with hacking tools too early",
      "Skipping networking fundamentals",
      "Ignoring operating system basics",
      "Watching random videos without a path",
    ],
    outcomes: [
      "Understand the basic language of IT security",
      "Follow cybersecurity lessons with less confusion",
      "Prepare for ISC2 CC or Cisco CCST Cybersecurity",
    ],
  },
  {
    title: "🟡 Level 1 — Cybersecurity fundamentals",
    body:
      "Start with a beginner-friendly cybersecurity certification. ISC2 CC gives you a clear theoretical foundation, while Cisco CCST Cybersecurity is useful if you want a more practical entry point.",
    recommended: [
      "ISC2 Certified in Cybersecurity",
      "Cisco CCST Cybersecurity",
    ],
    goal: "Build your first real cybersecurity foundation.",
    reality:
      "This level is not about becoming a hacker. It is about learning the language, logic, and core principles of security.",
    mistakes: [
      "Memorizing definitions without understanding them",
      "Choosing advanced certifications too early",
      "Ignoring risk management and access control",
      "Thinking one beginner cert is enough for a job",
    ],
    outcomes: [
      "Understand core cybersecurity concepts",
      "Build confidence with security terminology",
      "Prepare for Security+ with stronger foundations",
      "Start moving toward junior SOC or support paths",
    ],
    ctaQuizSlug: "isc2-cc",
    ctaCertSlug: "isc2-cc",
    ctaPrimaryText: "Start ISC2 CC quiz",
    ctaSecondaryText: "Explore ISC2 CC certification",
  },
  {
    title: "🟠 Level 2 — Core security skills",
    body:
      "Security+ is where the path becomes more complete. You move into threats, vulnerabilities, identity, architecture, operations, monitoring, and practical defensive thinking.",
    recommended: ["CompTIA Security+"],
    goal: "Develop practical, job-oriented cybersecurity knowledge.",
    reality:
      "Security+ is respected, but it does not replace labs and practice. Employers still expect you to understand real scenarios, not just exam terms.",
    mistakes: [
      "Studying only exam dumps",
      "Skipping hands-on labs",
      "Neglecting networking and operating systems",
      "Rushing the exam without understanding scenarios",
    ],
    outcomes: [
      "Understand modern security operations",
      "Prepare for SOC analyst and junior security roles",
      "Build a stronger base for CEH or cloud security",
      "Recognize real-world threats and controls",
    ],
    ctaQuizSlug: "security-plus",
    ctaCertSlug: "security-plus",
    ctaPrimaryText: "Start Security+ quiz",
    ctaSecondaryText: "Explore Security+ certification",
  },
  {
    title: "🔴 Level 3 — Offensive security",
    body:
      "At this stage you can start studying attack techniques, reconnaissance, vulnerabilities, web attacks, and penetration testing methodology. The goal is to understand how attackers think, not just collect tools.",
    recommended: ["CEH"],
    goal: "Understand offensive security workflows and attacker methodology.",
    reality:
      "CEH gives broad exposure to offensive security, but real pentesting skills come from labs, repetition, and practical experimentation.",
    mistakes: [
      "Thinking CEH alone guarantees a pentesting job",
      "Learning tools without understanding methodology",
      "Ignoring Linux and networking basics",
      "Avoiding practical lab platforms",
    ],
    outcomes: [
      "Understand offensive security terminology",
      "Recognize common attack techniques",
      "Prepare for practical lab-based learning",
      "Strengthen your ethical hacking foundation",
    ],
    ctaQuizSlug: "ceh",
    ctaCertSlug: "ceh",
    ctaPrimaryText: "Start CEH quiz",
    ctaSecondaryText: "Explore CEH certification",
  },
  {
    title: "⚫ Level 4 — Senior / architecture",
    body:
      "CISSP is for professionals moving toward security architecture, governance, risk management, leadership, and enterprise security strategy. It is less about tools and more about mature decision-making.",
    recommended: ["CISSP"],
    goal: "Think like a security architect and enterprise security leader.",
    reality:
      "CISSP is not an entry-level certification. Many people underestimate how much governance, risk, and business judgment matter in this exam.",
    mistakes: [
      "Approaching CISSP like a purely technical exam",
      "Trying CISSP too early",
      "Ignoring governance and risk management",
      "Memorizing content without understanding scenarios",
    ],
    outcomes: [
      "Understand enterprise-level cybersecurity",
      "Prepare for senior security and architecture paths",
      "Develop governance and risk management thinking",
      "Increase long-term career credibility",
    ],
    ctaQuizSlug: "cissp",
    ctaCertSlug: "cissp",
    ctaPrimaryText: "Start CISSP quiz",
    ctaSecondaryText: "Explore CISSP certification",
  },
],

    salaryTitle: "💰 Cybersecurity salary outlook (2026)",
    salaryIntro:
      "Typical global ranges vary a lot depending on country, company, and experience. Use them as orientation, not as a promise.",
    salaryRanges: [
      { label: "Entry-level", range: "$50k–$75k" },
      { label: "Mid-level", range: "$80k–$120k" },
      { label: "Senior / Specialist", range: "$130k+" },
    ],
    salaryDisclaimer:
      "Disclaimer: ranges vary widely. Certifications help more when combined with labs, practical exercises, and consistent study.",

    compareTitle: "🔍 Security+ vs CEH vs CISSP — what should you do first?",
    compareIntro:
      "These certifications are useful at different stages. The mistake is choosing a higher-level cert too early.",
    compareLeftTitle: "Progressive path",
    compareRightTitle: "Jump too fast",
    compareRows: [
      { label: "Clarity", left: "Clear growth path", right: "More confusion" },
      { label: "Skills", left: "Stronger foundations", right: "Weak gaps remain" },
      { label: "Outcome", left: "Better long-term growth", right: "Harder progression" },
    ],
    compareRecommendationTitle: "Recommendation",
    compareRecommendationBody:
      "Start with ISC2 CC, then Security+, then expand with CEH or CCST Cybersecurity. Leave CISSP for later.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "Do I need to know networking before cybersecurity?",
        a: "Yes, at least the basics. Without networking, many cyber concepts stay abstract and confusing.",
      },
      {
        q: "Is Security+ better than ISC2 CC?",
        a: "Security+ is broader and stronger, but ISC2 CC is often a better first step for complete beginners.",
      },
      {
        q: "Should I do CEH before Security+?",
        a: "Usually no. Build your defensive and core security foundation first, then move into more offensive content.",
      },
      {
        q: "When should I aim for CISSP?",
        a: "Later, after you already have strong fundamentals and more maturity in security topics.",
      },
    ],

    finalCtaTitle: "🚀 Start now (the practical way)",
    finalCtaBody:
      "Don't overthink it. Start with ISC2 CC, then build step by step into stronger cybersecurity skills.",
  },

  it: {
  title: "Roadmap Certificazioni Cybersecurity 2026",
  subtitle: "Da principiante a competenze cyber reali",
  intro:
    "La cybersecurity non significa solo hacking. Prima servono basi solide su reti, sistemi e sicurezza, poi certificazioni entry-level, poi competenze più pratiche e difensive. Questa roadmap ti mostra un percorso realistico basato sulle certificazioni già disponibili su CertifyQuiz.",

  ctaPrimary: "Inizia col quiz ISC2 CC",
  ctaSecondary: "Esplora le certificazioni Cybersecurity",
  certCta: "Scopri la certificazione",

  goalLabel: "Obiettivo:",
  practiceCta: "Allenati ora",

  levels: [
    {
      title: "🟢 Livello 0 — Nessuna base IT / sicurezza",
      body:
        "Se sei completamente all’inizio, non partire dagli strumenti di hacking. Prima devi capire come funzionano reti, sistemi operativi, account, permessi e concetti base di sicurezza. La cybersecurity ha senso solo se comprendi cosa stai cercando di proteggere.",
      recommended: [
        "Networking base: IP, DNS, routing",
        "Fondamenti di sistemi operativi",
        "Account, permessi e controllo accessi",
        "Concetti base di sicurezza",
      ],
      goal: "Capire i sistemi prima di cercare di proteggerli o attaccarli.",
      reality:
        "Molti principianti vogliono saltare subito all’ethical hacking. In realtà, basi deboli rendono ogni argomento cybersecurity molto più difficile in seguito.",
      mistakes: [
        "Iniziare troppo presto con strumenti di hacking",
        "Saltare le basi di networking",
        "Ignorare i sistemi operativi",
        "Guardare video casuali senza un percorso chiaro",
      ],
      outcomes: [
        "Comprendere il linguaggio base della sicurezza IT",
        "Seguire corsi cybersecurity con meno confusione",
        "Prepararsi meglio per ISC2 CC o Cisco CCST Cybersecurity",
      ],
    },
    {
      title: "🟡 Livello 1 — Fondamenta della cybersecurity",
      body:
        "Inizia con una certificazione cybersecurity adatta ai principianti. ISC2 CC offre una base teorica molto chiara, mentre Cisco CCST Cybersecurity è utile se preferisci un approccio più pratico.",
      recommended: [
        "ISC2 Certified in Cybersecurity",
        "Cisco CCST Cybersecurity",
      ],
      goal: "Costruire la tua prima vera base cybersecurity.",
      reality:
        "Questo livello non serve a diventare un hacker. Serve a imparare il linguaggio, la logica e i principi fondamentali della sicurezza.",
      mistakes: [
        "Memorizzare definizioni senza capirle",
        "Scegliere certificazioni avanzate troppo presto",
        "Ignorare gestione del rischio e controllo accessi",
        "Pensare che una sola certificazione entry-level basti per trovare lavoro",
      ],
      outcomes: [
        "Comprendere i concetti chiave della cybersecurity",
        "Aumentare sicurezza con la terminologia tecnica",
        "Prepararsi meglio per Security+",
        "Iniziare il percorso verso ruoli SOC junior o supporto IT security",
      ],
      ctaQuizSlug: "isc2-cc",
      ctaCertSlug: "isc2-cc",
      ctaPrimaryText: "Inizia quiz ISC2 CC",
      ctaSecondaryText: "Scopri certificazione ISC2 CC",
    },
    {
      title: "🟠 Livello 2 — Competenze core di sicurezza",
      body:
        "Security+ è il punto in cui il percorso diventa più completo. Inizi a lavorare su minacce, vulnerabilità, identità, architettura, operazioni, monitoraggio e ragionamento difensivo pratico.",
      recommended: ["CompTIA Security+"],
      goal: "Sviluppare competenze cybersecurity pratiche e orientate al lavoro.",
      reality:
        "Security+ è molto rispettata, ma non sostituisce laboratori e pratica reale. Le aziende si aspettano che tu capisca scenari concreti, non solo termini d’esame.",
      mistakes: [
        "Studiare solo exam dump",
        "Saltare i laboratori pratici",
        "Trascurare networking e sistemi operativi",
        "Affrontare l’esame senza capire gli scenari",
      ],
      outcomes: [
        "Comprendere le moderne operazioni di sicurezza",
        "Prepararsi a ruoli SOC analyst o security junior",
        "Costruire una base forte per CEH o cloud security",
        "Riconoscere minacce e controlli reali",
      ],
      ctaQuizSlug: "security-plus",
      ctaCertSlug: "security-plus",
      ctaPrimaryText: "Inizia quiz Security+",
      ctaSecondaryText: "Scopri certificazione Security+",
    },
    {
      title: "🔴 Livello 3 — Offensive security",
      body:
        "A questo punto puoi iniziare a studiare tecniche di attacco, reconnaissance, vulnerabilità, web attack e metodologie di penetration testing. L’obiettivo è capire come ragiona un attaccante, non solo usare tool.",
      recommended: ["CEH"],
      goal: "Comprendere workflow offensivi e metodologie degli attaccanti.",
      reality:
        "CEH offre una panoramica ampia della offensive security, ma le vere competenze di pentesting arrivano con laboratori, ripetizione e pratica reale.",
      mistakes: [
        "Pensare che CEH garantisca automaticamente un lavoro da pentester",
        "Studiare tool senza capire la metodologia",
        "Ignorare Linux e networking",
        "Evitare piattaforme pratiche di laboratorio",
      ],
      outcomes: [
        "Comprendere la terminologia offensive security",
        "Riconoscere tecniche di attacco comuni",
        "Prepararsi a percorsi pratici basati su lab",
        "Rafforzare le basi di ethical hacking",
      ],
      ctaQuizSlug: "ceh",
      ctaCertSlug: "ceh",
      ctaPrimaryText: "Inizia quiz CEH",
      ctaSecondaryText: "Scopri certificazione CEH",
    },
    {
      title: "⚫ Livello 4 — Senior / architettura",
      body:
        "CISSP è pensata per professionisti che vogliono evolvere verso architettura security, governance, gestione del rischio, leadership e strategia enterprise. Qui conta meno il tool e molto di più la capacità decisionale.",
      recommended: ["CISSP"],
      goal: "Ragionare come un security architect o leader enterprise.",
      reality:
        "CISSP non è una certificazione entry-level. Molti sottovalutano quanto governance, rischio e visione business siano centrali nell’esame.",
      mistakes: [
        "Affrontare CISSP come un esame puramente tecnico",
        "Tentare CISSP troppo presto",
        "Ignorare governance e risk management",
        "Memorizzare contenuti senza capire gli scenari",
      ],
      outcomes: [
        "Comprendere la cybersecurity enterprise",
        "Prepararsi a ruoli senior e di architettura",
        "Sviluppare mentalità governance e risk management",
        "Aumentare credibilità professionale a lungo termine",
      ],
      ctaQuizSlug: "cissp",
      ctaCertSlug: "cissp",
      ctaPrimaryText: "Inizia quiz CISSP",
      ctaSecondaryText: "Scopri certificazione CISSP",
    },
  ],

  salaryTitle: "💰 Stipendi cybersecurity (2026)",
  salaryIntro:
    "Le fasce salariali globali variano molto in base a paese, azienda ed esperienza. Usale come orientamento, non come promessa.",
  salaryRanges: [
    { label: "Entry-level", range: "$50k–$75k" },
    { label: "Mid-level", range: "$80k–$120k" },
    { label: "Senior / Specialist", range: "$130k+" },
  ],
  salaryDisclaimer:
    "Disclaimer: gli stipendi variano molto. Le certificazioni aiutano di più se combinate con laboratori, pratica e studio costante.",

  compareTitle: "🔍 Security+ vs CEH vs CISSP — da cosa partire?",
  compareIntro:
    "Queste certificazioni sono utili in fasi diverse del percorso. L’errore più comune è scegliere una certificazione avanzata troppo presto.",
  compareLeftTitle: "Percorso progressivo",
  compareRightTitle: "Saltare troppo avanti",
  compareRows: [
    { label: "Chiarezza", left: "Crescita chiara", right: "Più confusione" },
    { label: "Competenze", left: "Basi solide", right: "Lacune importanti" },
    { label: "Risultato", left: "Crescita migliore nel lungo periodo", right: "Percorso più difficile" },
  ],
  compareRecommendationTitle: "Consiglio",
  compareRecommendationBody:
    "Inizia con ISC2 CC, poi Security+, poi amplia con CEH o CCST Cybersecurity. Lascia CISSP per più avanti.",

  faqTitle: "FAQ",
  faq: [
    {
      q: "Serve conoscere il networking prima della cybersecurity?",
      a: "Sì, almeno le basi. Senza networking molti concetti cyber restano astratti e difficili da capire.",
    },
    {
      q: "Security+ è migliore di ISC2 CC?",
      a: "Security+ è più ampia e forte, ma ISC2 CC è spesso un punto di partenza migliore per chi parte completamente da zero.",
    },
    {
      q: "Dovrei fare CEH prima di Security+?",
      a: "Di solito no. Prima costruisci basi solide difensive e di sicurezza generale, poi passa ai contenuti offensivi.",
    },
    {
      q: "Quando dovrei puntare a CISSP?",
      a: "Più avanti, quando hai già basi forti ed esperienza maggiore sugli argomenti security.",
    },
  ],

  finalCtaTitle: "🚀 Inizia ora (nel modo giusto)",
  finalCtaBody:
    "Non complicarti troppo le cose. Parti da ISC2 CC e costruisci passo dopo passo competenze cybersecurity sempre più solide.",
},
  es: {
  title: "Roadmap Certificaciones Ciberseguridad 2026",
  subtitle: "De principiante a habilidades reales en ciberseguridad",
  intro:
    "La ciberseguridad no es solo hacking. Primero necesitas bases sólidas en redes, sistemas y seguridad, luego una certificación inicial y después habilidades más prácticas y defensivas. Esta roadmap te muestra un camino realista basado en las certificaciones ya disponibles en CertifyQuiz.",

  ctaPrimary: "Empieza con el quiz ISC2 CC",
  ctaSecondary: "Explorar certificaciones de Ciberseguridad",
  certCta: "Descubrir certificación",

  goalLabel: "Objetivo:",
  practiceCta: "Practicar ahora",

  levels: [
    {
      title: "🟢 Nivel 0 — Sin bases IT / seguridad",
      body:
        "Si empiezas desde cero, no comiences con herramientas de hacking. Primero debes entender cómo funcionan las redes, los sistemas operativos, las cuentas, los permisos y los conceptos básicos de seguridad. La ciberseguridad solo tiene sentido cuando entiendes qué estás intentando proteger.",
      recommended: [
        "Networking básico: IP, DNS, routing",
        "Fundamentos de sistemas operativos",
        "Cuentas, permisos y control de acceso",
        "Conceptos básicos de seguridad",
      ],
      goal:
        "Comprender los sistemas antes de intentar protegerlos o atacarlos.",
      reality:
        "Muchos principiantes quieren saltar directamente al ethical hacking. En realidad, unas bases débiles hacen que todos los temas de ciberseguridad sean mucho más difíciles después.",
      mistakes: [
        "Empezar demasiado pronto con herramientas de hacking",
        "Saltar los fundamentos de redes",
        "Ignorar los sistemas operativos",
        "Ver videos aleatorios sin una ruta clara",
      ],
      outcomes: [
        "Comprender el lenguaje básico de la seguridad IT",
        "Seguir cursos de ciberseguridad con menos confusión",
        "Prepararse mejor para ISC2 CC o Cisco CCST Cybersecurity",
      ],
    },

    {
      title: "🟡 Nivel 1 — Fundamentos de ciberseguridad",
      body:
        "Empieza con una certificación de ciberseguridad apta para principiantes. ISC2 CC ofrece una base teórica clara, mientras que Cisco CCST Cybersecurity es útil si prefieres un enfoque más práctico.",
      recommended: [
        "ISC2 Certified in Cybersecurity",
        "Cisco CCST Cybersecurity",
      ],
      goal:
        "Construir tu primera base real de ciberseguridad.",
      reality:
        "Este nivel no trata de convertirse en hacker. Trata de aprender el lenguaje, la lógica y los principios fundamentales de la seguridad.",
      mistakes: [
        "Memorizar definiciones sin entenderlas",
        "Elegir certificaciones avanzadas demasiado pronto",
        "Ignorar la gestión de riesgos y el control de acceso",
        "Pensar que una sola certificación básica basta para conseguir trabajo",
      ],
      outcomes: [
        "Comprender los conceptos principales de ciberseguridad",
        "Ganar confianza con la terminología de seguridad",
        "Prepararse mejor para Security+",
        "Comenzar el camino hacia roles SOC junior o soporte de seguridad",
      ],
      ctaQuizSlug: "isc2-cc",
      ctaCertSlug: "isc2-cc",
      ctaPrimaryText: "Empezar quiz ISC2 CC",
      ctaSecondaryText: "Descubrir certificación ISC2 CC",
    },

    {
      title: "🟠 Nivel 2 — Habilidades core de seguridad",
      body:
        "Security+ es el punto donde el camino se vuelve más completo. Empiezas a trabajar con amenazas, vulnerabilidades, identidad, arquitectura, operaciones, monitoreo y pensamiento defensivo práctico.",
      recommended: ["CompTIA Security+"],
      goal:
        "Desarrollar conocimientos prácticos de ciberseguridad orientados al trabajo.",
      reality:
        "Security+ es muy respetada, pero no reemplaza laboratorios ni práctica real. Las empresas esperan que entiendas escenarios reales, no solo términos de examen.",
      mistakes: [
        "Estudiar solo dumps de examen",
        "Evitar laboratorios prácticos",
        "Descuidar redes y sistemas operativos",
        "Presentar el examen sin entender los escenarios",
      ],
      outcomes: [
        "Comprender operaciones modernas de seguridad",
        "Prepararse para roles SOC analyst o seguridad junior",
        "Construir una base fuerte para CEH o cloud security",
        "Reconocer amenazas y controles reales",
      ],
      ctaQuizSlug: "security-plus",
      ctaCertSlug: "security-plus",
      ctaPrimaryText: "Empezar quiz Security+",
      ctaSecondaryText: "Descubrir certificación Security+",
    },

    {
      title: "🔴 Nivel 3 — Seguridad ofensiva",
      body:
        "En esta etapa puedes empezar a estudiar técnicas de ataque, reconocimiento, vulnerabilidades, ataques web y metodologías de penetration testing. El objetivo es entender cómo piensa un atacante, no solo coleccionar herramientas.",
      recommended: ["CEH"],
      goal:
        "Comprender workflows ofensivos y metodologías de ataque.",
      reality:
        "CEH ofrece una visión amplia de la seguridad ofensiva, pero las verdaderas habilidades de pentesting vienen de laboratorios, repetición y práctica real.",
      mistakes: [
        "Pensar que CEH garantiza automáticamente un trabajo de pentester",
        "Aprender herramientas sin entender la metodología",
        "Ignorar Linux y networking",
        "Evitar plataformas prácticas de laboratorio",
      ],
      outcomes: [
        "Comprender terminología offensive security",
        "Reconocer técnicas comunes de ataque",
        "Prepararse para aprendizaje práctico basado en labs",
        "Fortalecer la base de ethical hacking",
      ],
      ctaQuizSlug: "ceh",
      ctaCertSlug: "ceh",
      ctaPrimaryText: "Empezar quiz CEH",
      ctaSecondaryText: "Descubrir certificación CEH",
    },

    {
      title: "⚫ Nivel 4 — Senior / arquitectura",
      body:
        "CISSP está pensada para profesionales que quieren evolucionar hacia arquitectura de seguridad, gobernanza, gestión de riesgos, liderazgo y estrategia enterprise. Aquí importan más las decisiones maduras que las herramientas.",
      recommended: ["CISSP"],
      goal:
        "Pensar como un arquitecto de seguridad o líder enterprise.",
      reality:
        "CISSP no es una certificación de nivel inicial. Muchas personas subestiman cuánto importan la gobernanza, el riesgo y la visión de negocio en este examen.",
      mistakes: [
        "Tratar CISSP como un examen puramente técnico",
        "Intentar CISSP demasiado pronto",
        "Ignorar governance y risk management",
        "Memorizar contenido sin entender escenarios",
      ],
      outcomes: [
        "Comprender la ciberseguridad enterprise",
        "Prepararse para roles senior y de arquitectura",
        "Desarrollar mentalidad de governance y risk management",
        "Aumentar la credibilidad profesional a largo plazo",
      ],
      ctaQuizSlug: "cissp",
      ctaCertSlug: "cissp",
      ctaPrimaryText: "Empezar quiz CISSP",
      ctaSecondaryText: "Descubrir certificación CISSP",
    },
  ],

  salaryTitle: "💰 Salarios en ciberseguridad (2026)",
  salaryIntro:
    "Los rangos salariales globales varían mucho según el país, la empresa y la experiencia. Úsalos como orientación, no como promesa.",
  salaryRanges: [
    { label: "Entry-level", range: "$50k–$75k" },
    { label: "Mid-level", range: "$80k–$120k" },
    { label: "Senior / Specialist", range: "$130k+" },
  ],
  salaryDisclaimer:
    "Disclaimer: los salarios varían mucho. Las certificaciones ayudan más cuando se combinan con laboratorios, práctica real y estudio constante.",

  compareTitle:
    "🔍 Security+ vs CEH vs CISSP — ¿con cuál deberías empezar?",
  compareIntro:
    "Estas certificaciones son útiles en diferentes etapas del camino. El error más común es elegir una certificación avanzada demasiado pronto.",
  compareLeftTitle: "Camino progresivo",
  compareRightTitle: "Ir demasiado rápido",

  compareRows: [
    {
      label: "Claridad",
      left: "Crecimiento claro",
      right: "Más confusión",
    },
    {
      label: "Habilidades",
      left: "Bases más sólidas",
      right: "Quedan vacíos importantes",
    },
    {
      label: "Resultado",
      left: "Mejor crecimiento a largo plazo",
      right: "Progresión más difícil",
    },
  ],

  compareRecommendationTitle: "Recomendación",
  compareRecommendationBody:
    "Empieza con ISC2 CC, luego Security+, y después amplía con CEH o CCST Cybersecurity. Deja CISSP para más adelante.",

  faqTitle: "FAQ",

  faq: [
    {
      q: "¿Necesito saber networking antes de estudiar ciberseguridad?",
      a: "Sí, al menos lo básico. Sin networking muchos conceptos cyber siguen siendo abstractos y difíciles de entender.",
    },
    {
      q: "¿Security+ es mejor que ISC2 CC?",
      a: "Security+ es más amplia y potente, pero ISC2 CC suele ser un mejor primer paso para principiantes absolutos.",
    },
    {
      q: "¿Debería hacer CEH antes de Security+?",
      a: "Normalmente no. Primero construye bases defensivas y fundamentos sólidos de seguridad, luego pasa al contenido ofensivo.",
    },
    {
      q: "¿Cuándo debería apuntar a CISSP?",
      a: "Más adelante, cuando ya tengas buenas bases y más madurez en temas de seguridad.",
    },
  ],

  finalCtaTitle: "🚀 Empieza ahora (de forma práctica)",

  finalCtaBody:
    "No lo pienses demasiado. Empieza con ISC2 CC y construye paso a paso habilidades de ciberseguridad cada vez más sólidas.",
},

  fr: {
  title: "Roadmap Certifications Cybersécurité 2026",
  subtitle: "De débutant à de vraies compétences en cybersécurité",
  intro:
    "La cybersécurité ne se limite pas au hacking. Il faut d’abord construire des bases solides en réseaux, systèmes et sécurité, puis obtenir une certification d’entrée, avant de développer des compétences plus pratiques et défensives. Cette roadmap vous montre un parcours réaliste basé sur les certifications déjà disponibles sur CertifyQuiz.",

  ctaPrimary: "Commencer avec le quiz ISC2 CC",
  ctaSecondary: "Explorer les certifications Cybersécurité",
  certCta: "Découvrir la certification",

  goalLabel: "Objectif :",
  practiceCta: "S'entraîner maintenant",

  levels: [
    {
      title: "🟢 Niveau 0 — Aucune base IT / sécurité",
      body:
        "Si vous débutez complètement, ne commencez pas par les outils de hacking. Vous devez d’abord comprendre comment fonctionnent les réseaux, les systèmes d’exploitation, les comptes, les permissions et les concepts fondamentaux de sécurité. La cybersécurité n’a de sens que si vous comprenez ce que vous essayez de protéger.",
      recommended: [
        "Bases réseau : IP, DNS, routage",
        "Fondamentaux des systèmes d’exploitation",
        "Comptes, permissions et contrôle d’accès",
        "Concepts de base en sécurité",
      ],
      goal:
        "Comprendre les systèmes avant d’essayer de les protéger ou de les attaquer.",
      reality:
        "Beaucoup de débutants veulent aller directement vers l’ethical hacking. En réalité, de mauvaises bases rendent tous les sujets cybersécurité beaucoup plus difficiles ensuite.",
      mistakes: [
        "Commencer trop tôt avec des outils de hacking",
        "Ignorer les fondamentaux réseau",
        "Négliger les bases des systèmes d’exploitation",
        "Regarder des vidéos aléatoires sans véritable parcours",
      ],
      outcomes: [
        "Comprendre le vocabulaire de base de la sécurité IT",
        "Suivre les cours cybersécurité avec moins de confusion",
        "Mieux se préparer à ISC2 CC ou Cisco CCST Cybersecurity",
      ],
    },

    {
      title: "🟡 Niveau 1 — Fondamentaux cybersécurité",
      body:
        "Commencez avec une certification cybersécurité adaptée aux débutants. ISC2 CC offre une base théorique claire, tandis que Cisco CCST Cybersecurity convient mieux à ceux qui préfèrent une approche plus pratique.",
      recommended: [
        "ISC2 Certified in Cybersecurity",
        "Cisco CCST Cybersecurity",
      ],
      goal:
        "Construire votre première vraie base en cybersécurité.",
      reality:
        "Ce niveau ne sert pas à devenir hacker. Il sert à apprendre le langage, la logique et les principes fondamentaux de la sécurité.",
      mistakes: [
        "Mémoriser des définitions sans les comprendre",
        "Choisir des certifications avancées trop tôt",
        "Ignorer la gestion des risques et le contrôle d’accès",
        "Penser qu’une seule certification débutant suffit pour obtenir un emploi",
      ],
      outcomes: [
        "Comprendre les concepts clés de cybersécurité",
        "Gagner en confiance avec la terminologie sécurité",
        "Mieux se préparer à Security+",
        "Commencer à évoluer vers des postes SOC junior ou support sécurité",
      ],
      ctaQuizSlug: "isc2-cc",
      ctaCertSlug: "isc2-cc",
      ctaPrimaryText: "Commencer le quiz ISC2 CC",
      ctaSecondaryText: "Découvrir la certification ISC2 CC",
    },

    {
      title: "🟠 Niveau 2 — Compétences essentielles sécurité",
      body:
        "Security+ est le moment où le parcours devient plus complet. Vous abordez les menaces, vulnérabilités, identités, architectures, opérations, surveillance et réflexion défensive pratique.",
      recommended: ["CompTIA Security+"],
      goal:
        "Développer des compétences cybersécurité pratiques et orientées métier.",
      reality:
        "Security+ est respectée, mais elle ne remplace pas les laboratoires et la pratique réelle. Les entreprises attendent encore que vous compreniez des scénarios concrets, pas seulement des termes d’examen.",
      mistakes: [
        "Étudier uniquement avec des dumps d’examen",
        "Ignorer les laboratoires pratiques",
        "Négliger les réseaux et systèmes d’exploitation",
        "Passer l’examen sans comprendre les scénarios",
      ],
      outcomes: [
        "Comprendre les opérations modernes de sécurité",
        "Se préparer à des postes SOC analyst ou sécurité junior",
        "Construire une base solide pour CEH ou la sécurité cloud",
        "Reconnaître les menaces et contrôles réels",
      ],
      ctaQuizSlug: "security-plus",
      ctaCertSlug: "security-plus",
      ctaPrimaryText: "Commencer le quiz Security+",
      ctaSecondaryText: "Découvrir la certification Security+",
    },

    {
      title: "🔴 Niveau 3 — Sécurité offensive",
      body:
        "À ce stade, vous pouvez commencer à étudier les techniques d’attaque, la reconnaissance, les vulnérabilités, les attaques web et les méthodologies de pentest. L’objectif est de comprendre la logique des attaquants, pas seulement d’utiliser des outils.",
      recommended: ["CEH"],
      goal:
        "Comprendre les workflows offensifs et la méthodologie des attaquants.",
      reality:
        "CEH donne une bonne vue d’ensemble de la sécurité offensive, mais les vraies compétences de pentesting viennent des laboratoires, de la répétition et de la pratique réelle.",
      mistakes: [
        "Croire que CEH garantit automatiquement un poste de pentester",
        "Apprendre des outils sans comprendre la méthodologie",
        "Ignorer Linux et les bases réseau",
        "Éviter les plateformes pratiques de laboratoire",
      ],
      outcomes: [
        "Comprendre la terminologie offensive security",
        "Reconnaître les techniques d’attaque courantes",
        "Se préparer à des parcours basés sur des laboratoires pratiques",
        "Renforcer les bases de l’ethical hacking",
      ],
      ctaQuizSlug: "ceh",
      ctaCertSlug: "ceh",
      ctaPrimaryText: "Commencer le quiz CEH",
      ctaSecondaryText: "Découvrir la certification CEH",
    },

    {
      title: "⚫ Niveau 4 — Senior / architecture",
      body:
        "CISSP s’adresse aux professionnels qui veulent évoluer vers l’architecture sécurité, la gouvernance, la gestion des risques, le leadership et la stratégie sécurité d’entreprise. Ici, les décisions comptent plus que les outils.",
      recommended: ["CISSP"],
      goal:
        "Penser comme un architecte sécurité ou un leader cybersécurité.",
      reality:
        "CISSP n’est pas une certification débutant. Beaucoup sous-estiment l’importance de la gouvernance, du risque et de la vision business dans cet examen.",
      mistakes: [
        "Aborder CISSP comme un examen purement technique",
        "Tenter CISSP trop tôt",
        "Ignorer la gouvernance et la gestion des risques",
        "Mémoriser le contenu sans comprendre les scénarios",
      ],
      outcomes: [
        "Comprendre la cybersécurité au niveau entreprise",
        "Se préparer à des postes senior et d’architecture",
        "Développer une vision gouvernance et risk management",
        "Augmenter sa crédibilité professionnelle à long terme",
      ],
      ctaQuizSlug: "cissp",
      ctaCertSlug: "cissp",
      ctaPrimaryText: "Commencer le quiz CISSP",
      ctaSecondaryText: "Découvrir la certification CISSP",
    },
  ],

  salaryTitle: "💰 Perspectives salariales en cybersécurité (2026)",
  salaryIntro:
    "Les fourchettes salariales globales varient beaucoup selon le pays, l’entreprise et l’expérience. Utilisez-les comme orientation, pas comme promesse.",
  salaryRanges: [
    { label: "Débutant", range: "$50k–$75k" },
    { label: "Intermédiaire", range: "$80k–$120k" },
    { label: "Senior / Spécialiste", range: "$130k+" },
  ],
  salaryDisclaimer:
    "Disclaimer : les salaires varient fortement. Les certifications sont plus utiles lorsqu’elles sont combinées avec des laboratoires, des exercices pratiques et une étude régulière.",

  compareTitle:
    "🔍 Security+ vs CEH vs CISSP — par quoi commencer ?",
  compareIntro:
    "Ces certifications sont utiles à différentes étapes du parcours. L’erreur est de choisir une certification trop avancée trop tôt.",
  compareLeftTitle: "Parcours progressif",
  compareRightTitle: "Aller trop vite",
  compareRows: [
    {
      label: "Clarté",
      left: "Progression claire",
      right: "Plus de confusion",
    },
    {
      label: "Compétences",
      left: "Bases plus solides",
      right: "Des lacunes restent",
    },
    {
      label: "Résultat",
      left: "Meilleure croissance à long terme",
      right: "Progression plus difficile",
    },
  ],

  compareRecommendationTitle: "Recommandation",
  compareRecommendationBody:
    "Commencez avec ISC2 CC, puis Security+, puis élargissez avec CEH ou CCST Cybersecurity. Gardez CISSP pour plus tard.",

  faqTitle: "FAQ",

  faq: [
    {
      q: "Faut-il connaître les réseaux avant la cybersécurité ?",
      a: "Oui, au moins les bases. Sans réseaux, beaucoup de concepts cyber restent abstraits et difficiles à comprendre.",
    },
    {
      q: "Security+ est-elle meilleure que ISC2 CC ?",
      a: "Security+ est plus large et plus avancée, mais ISC2 CC est souvent un meilleur premier pas pour les débutants complets.",
    },
    {
      q: "Faut-il passer CEH avant Security+ ?",
      a: "En général, non. Construisez d’abord vos bases défensives et vos fondamentaux de sécurité, puis passez au contenu offensif.",
    },
    {
      q: "Quand viser CISSP ?",
      a: "Plus tard, quand vous avez déjà de bonnes bases et plus de maturité sur les sujets de sécurité.",
    },
  ],

  finalCtaTitle: "🚀 Commencez maintenant, de façon pratique",

  finalCtaBody:
    "Ne compliquez pas trop les choses. Commencez avec ISC2 CC, puis progressez étape par étape vers des compétences cybersécurité plus solides.",
},

};
