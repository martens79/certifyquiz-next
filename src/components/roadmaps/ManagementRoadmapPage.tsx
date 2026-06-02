import Link from "next/link";
import RoadmapStepCard from "@/components/roadmaps/RoadmapStepCard";

type Locale = "it" | "en" | "es" | "fr";

type RoadmapQuizSlug = string;
type RoadmapCertSlug = string;

export default function ManagementRoadmapPage({
  lang,
}: {
  lang: Locale;
}) {
  const t = CONTENT[lang];

  const quiz = (slug: RoadmapQuizSlug) => `/${lang}/quiz/${slug}`;

  const cert = (slug: RoadmapCertSlug) => {
    if (lang === "it") return `/it/certificazioni/${slug}`;
    if (lang === "fr") return `/fr/certifications/${slug}`;
    if (lang === "es") return `/es/certificaciones/${slug}`;
    return `/certifications/${slug}`;
  };

  const categoryManagement =
    lang === "en"
      ? "/categories/management"
      : lang === "it"
      ? "/it/categorie/management"
      : lang === "es"
      ? "/es/categorias/gestion-management"
      : "/fr/categories/management";

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
            href={quiz("project-management-foundations")}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition"
          >
            {t.ctaPrimary}
          </Link>

          <Link
            href={categoryManagement}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-800 hover:bg-slate-50 transition"
          >
            {t.ctaSecondary}
          </Link>
        </div>
      </header>

      <section className="relative mt-10">
        <div className="absolute bottom-0 left-5 top-0 hidden w-px bg-slate-200 md:block" />

        <div className="space-y-6 md:pl-10">
          {t.levels.map((lvl, index) => (
            <RoadmapStepCard
              key={lvl.title}
              level={lvl}
              index={index}
              lang={lang}
              quizHref={(l, slug) => quiz(slug)}
              certHref={(l, slug) => cert(slug)}
              goalLabel={t.goalLabel}
              practiceCta={t.practiceCta}
              certCta={t.certCta}
            />
          ))}
        </div>
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
            href={quiz("project-management-foundations")}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition"
          >
            {t.ctaPrimary}
          </Link>
          <Link
            href={categoryManagement}
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
    title: "IT Management Certification Roadmap 2026",
    subtitle: "From project basics to service management and agile leadership",
    intro:
      "IT management is not only about managing people. It means understanding projects, services, processes, value delivery, risk, stakeholders, and continuous improvement. This roadmap helps you move from basic project management concepts to more structured frameworks such as ITIL, Agile, Scrum, PMP, and related certifications.",

    ctaPrimary: "Start with Project Management Foundations",
    ctaSecondary: "Browse management certifications",
    certCta: "Explore certification",

    goalLabel: "Goal:",
    practiceCta: "Practice now",

    levels: [
      {
        title: "🟢 Level 0 — Management foundations",
        body:
          "If you are new to management, start with the basics: projects, tasks, stakeholders, deadlines, risks, communication, scope, and value. Before choosing a framework, you need to understand what management is trying to organize.",
        recommended: [
          "Project Management Foundations",
          "Basic project terminology",
          "Stakeholders and communication",
          "Risk and scope basics",
        ],
        goal: "Understand the language of projects and organizational work.",
        reality:
          "Many beginners jump directly into PMP or Agile terminology without understanding basic project logic. That makes the frameworks feel abstract.",
        mistakes: [
          "Starting with advanced certifications too early",
          "Memorizing framework terms without context",
          "Ignoring communication and stakeholder management",
          "Thinking management is only planning tasks",
        ],
        outcomes: [
          "Understand basic project vocabulary",
          "Follow ITIL, Agile, and PMP topics more easily",
          "Build a base for service and project management certifications",
        ],
        ctaQuizSlug: "project-management-foundations",
        ctaCertSlug: "project-management-foundations",
        ctaPrimaryText: "Start Foundations quiz",
        ctaSecondaryText: "Explore Project Management Foundations",
      },
      {
        title: "🟡 Level 1 — IT service management",
        body:
          "ITIL is one of the most useful starting points for IT management. It focuses on value, services, practices, incidents, changes, continual improvement, and the way IT supports business outcomes.",
        recommended: ["ITIL 4 Foundation"],
        goal: "Understand how IT services are designed, delivered, supported, and improved.",
        reality:
          "ITIL is not just theory. It becomes useful when you connect concepts such as incidents, changes, service requests, value streams, and continual improvement to real IT work.",
        mistakes: [
          "Studying ITIL as a list of definitions",
          "Ignoring the Service Value System",
          "Confusing processes, practices, and value streams",
          "Not connecting ITIL concepts to real service scenarios",
        ],
        outcomes: [
          "Understand IT service management logic",
          "Prepare for ITIL 4 Foundation",
          "Improve support, operations, and service thinking",
        ],
        ctaQuizSlug: "itil-4-foundation",
        ctaCertSlug: "itil-4-foundation",
        ctaPrimaryText: "Start ITIL quiz",
        ctaSecondaryText: "Explore ITIL 4 Foundation",
      },
      {
        title: "🟠 Level 2 — Agile and Scrum",
        body:
          "Agile and Scrum help teams work iteratively, adapt to change, improve delivery, and focus on customer value. This level is useful for product teams, software teams, and modern IT environments.",
        recommended: ["Scrum", "Agile Fundamentals"],
        goal: "Understand iterative delivery, roles, events, artifacts, and agile collaboration.",
        reality:
          "Agile is not just daily meetings and sticky notes. Without real product thinking and feedback loops, Scrum becomes empty ceremony.",
        mistakes: [
          "Thinking Agile means no planning",
          "Treating Scrum events as bureaucracy",
          "Ignoring product ownership",
          "Using velocity as a pressure tool",
        ],
        outcomes: [
          "Understand agile delivery",
          "Work better with product and development teams",
          "Prepare for Scrum and Agile certifications",
        ],
        ctaQuizSlug: "scrum",
        ctaCertSlug: "scrum",
        ctaPrimaryText: "Start Scrum quiz",
        ctaSecondaryText: "Explore Scrum certification",
      },
      {
        title: "🔴 Level 3 — Professional project management",
        body:
          "At this level you move toward formal project management: planning, scope, schedule, cost, quality, resources, procurement, stakeholders, and risk. PMP is stronger when you already understand real project environments.",
        recommended: ["PMP", "PRINCE2"],
        goal: "Develop structured project management thinking for larger initiatives.",
        reality:
          "PMP and PRINCE2 are not entry-level shortcuts. They require maturity, scenario thinking, and an understanding of how projects work under constraints.",
        mistakes: [
          "Trying PMP before understanding project basics",
          "Studying only formulas and definitions",
          "Ignoring stakeholder and risk scenarios",
          "Forgetting that projects operate under constraints",
        ],
        outcomes: [
          "Understand structured project governance",
          "Prepare for more advanced management certifications",
          "Improve planning, risk, and stakeholder management",
        ],
        ctaQuizSlug: "pmp",
        ctaCertSlug: "pmp",
        ctaPrimaryText: "Start PMP quiz",
        ctaSecondaryText: "Explore PMP certification",
      },
      {
        title: "⚫ Level 4 — Leadership and strategic management",
        body:
          "Senior management requires more than frameworks. You need decision-making, prioritization, portfolio thinking, governance, change leadership, and the ability to align technology work with business value.",
        recommended: ["PMI-ACP", "SAFe", "Advanced IT management"],
        goal: "Move from managing tasks to leading systems, teams, and value streams.",
        reality:
          "Leadership is not a certificate. Certifications help, but real credibility comes from judgment, communication, prioritization, and consistent delivery.",
        mistakes: [
          "Collecting certifications without applying them",
          "Ignoring business value",
          "Managing activity instead of outcomes",
          "Avoiding difficult communication with stakeholders",
        ],
        outcomes: [
          "Think beyond single projects",
          "Understand portfolio and value management",
          "Prepare for leadership and senior IT management paths",
        ],
      },
    ],

    salaryTitle: "💰 IT management salary outlook (2026)",
    salaryIntro:
      "Typical ranges vary widely by country, company size, industry, and responsibility level. Use them as orientation, not as a promise.",
    salaryRanges: [
      { label: "Entry-level / Coordinator", range: "$45k–$70k" },
      { label: "Project / Service Manager", range: "$75k–$115k" },
      { label: "Senior / Program Manager", range: "$120k+" },
    ],
    salaryDisclaimer:
      "Disclaimer: certifications help more when combined with real projects, stakeholder communication, delivery experience, and leadership maturity.",

    compareTitle: "🔍 ITIL vs Scrum vs PMP — what should you do first?",
    compareIntro:
      "These certifications solve different problems. The mistake is choosing a famous certification without understanding your role or career direction.",
    compareLeftTitle: "Progressive path",
    compareRightTitle: "Random choice",
    compareRows: [
      { label: "Clarity", left: "Start from your role and goals", right: "Choose only by popularity" },
      { label: "Skills", left: "Service + agile + project foundation", right: "Disconnected terminology" },
      { label: "Outcome", left: "Better long-term growth", right: "Harder to apply knowledge" },
    ],
    compareRecommendationTitle: "Recommendation",
    compareRecommendationBody:
      "Start with Project Management Foundations, then ITIL if you work in IT services, Scrum/Agile if you work with product or software teams, and PMP later when project complexity increases.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "Should I start with ITIL or PMP?",
        a: "If you are in IT support, operations, or service delivery, ITIL is often a better first step. PMP is better when you already manage structured projects.",
      },
      {
        q: "Is Scrum useful outside software development?",
        a: "Yes, but it is most useful when teams work iteratively, receive feedback, and deliver increments of value.",
      },
      {
        q: "Do I need experience before PMP?",
        a: "Yes. PMP is designed for people with project experience and is more effective when you can connect concepts to real scenarios.",
      },
    ],

    finalCtaTitle: "🚀 Start your management path now",
    finalCtaBody:
      "Start with the foundations, then choose ITIL, Agile/Scrum, or PMP based on your real role and career direction.",
  },

  it: {
    title: "Roadmap Certificazioni Management IT 2026",
    subtitle: "Dalle basi di project management a ITIL, Agile e leadership",
    intro:
      "Il management IT non significa solo gestire persone. Significa capire progetti, servizi, processi, valore, rischio, stakeholder e miglioramento continuo. Questa roadmap ti aiuta a partire dalle basi e a muoverti verso framework come ITIL, Agile, Scrum, PMP e certificazioni collegate.",

    ctaPrimary: "Inizia con Project Management Foundations",
    ctaSecondary: "Esplora certificazioni Management",
    certCta: "Scopri la certificazione",

    goalLabel: "Obiettivo:",
    practiceCta: "Allenati ora",

    levels: [
      {
        title: "🟢 Livello 0 — Fondamenti di management",
        body:
          "Se parti da zero, inizia dalle basi: progetti, attività, stakeholder, scadenze, rischi, comunicazione, ambito e valore. Prima di scegliere un framework devi capire cosa il management cerca di organizzare.",
        recommended: [
          "Project Management Foundations",
          "Terminologia base di progetto",
          "Stakeholder e comunicazione",
          "Rischio e ambito",
        ],
        goal: "Comprendere il linguaggio dei progetti e del lavoro organizzato.",
        reality:
          "Molti principianti saltano direttamente a PMP o Agile senza capire la logica base dei progetti. Così i framework sembrano astratti.",
        mistakes: [
          "Partire da certificazioni avanzate troppo presto",
          "Memorizzare termini senza contesto",
          "Ignorare comunicazione e stakeholder",
          "Pensare che management significhi solo pianificare task",
        ],
        outcomes: [
          "Capire il vocabolario base del project management",
          "Seguire meglio ITIL, Agile e PMP",
          "Costruire una base per certificazioni service/project management",
        ],
        ctaQuizSlug: "project-management-foundations",
        ctaCertSlug: "project-management-foundations",
        ctaPrimaryText: "Inizia quiz Foundations",
        ctaSecondaryText: "Scopri Project Management Foundations",
      },
      {
        title: "🟡 Livello 1 — IT Service Management",
        body:
          "ITIL è uno dei punti di partenza più utili per il management IT. Si concentra su valore, servizi, pratiche, incidenti, change, miglioramento continuo e sul modo in cui l’IT supporta gli obiettivi di business.",
        recommended: ["ITIL 4 Foundation"],
        goal: "Capire come i servizi IT vengono progettati, erogati, supportati e migliorati.",
        reality:
          "ITIL non è solo teoria. Diventa utile quando colleghi incident, change, service request, value stream e continual improvement al lavoro IT reale.",
        mistakes: [
          "Studiare ITIL come lista di definizioni",
          "Ignorare il Service Value System",
          "Confondere processi, pratiche e value stream",
          "Non collegare ITIL a scenari reali di servizio",
        ],
        outcomes: [
          "Comprendere la logica dell’IT service management",
          "Prepararti a ITIL 4 Foundation",
          "Migliorare supporto, operation e mentalità di servizio",
        ],
        ctaQuizSlug: "itil-4-foundation",
        ctaCertSlug: "itil-4-foundation",
        ctaPrimaryText: "Inizia quiz ITIL",
        ctaSecondaryText: "Scopri ITIL 4 Foundation",
      },
      {
        title: "🟠 Livello 2 — Agile e Scrum",
        body:
          "Agile e Scrum aiutano i team a lavorare in modo iterativo, adattarsi al cambiamento, migliorare la delivery e concentrarsi sul valore per il cliente. È un livello utile per team prodotto, software e ambienti IT moderni.",
        recommended: ["Scrum", "Agile Fundamentals"],
        goal: "Capire delivery iterativa, ruoli, eventi, artifact e collaborazione agile.",
        reality:
          "Agile non significa solo daily meeting e post-it. Senza product thinking e feedback loop, Scrum diventa cerimonia vuota.",
        mistakes: [
          "Pensare che Agile significhi assenza di pianificazione",
          "Trattare gli eventi Scrum come burocrazia",
          "Ignorare il product ownership",
          "Usare la velocity come strumento di pressione",
        ],
        outcomes: [
          "Capire la delivery agile",
          "Collaborare meglio con team prodotto e sviluppo",
          "Prepararti a certificazioni Scrum e Agile",
        ],
        ctaQuizSlug: "scrum",
        ctaCertSlug: "scrum",
        ctaPrimaryText: "Inizia quiz Scrum",
        ctaSecondaryText: "Scopri Scrum",
      },
      {
        title: "🔴 Livello 3 — Project management professionale",
        body:
          "Qui entri nel project management strutturato: pianificazione, scope, tempi, costi, qualità, risorse, procurement, stakeholder e rischio. PMP è più forte quando hai già capito ambienti di progetto reali.",
        recommended: ["PMP", "PRINCE2"],
        goal: "Sviluppare pensiero strutturato per iniziative più grandi.",
        reality:
          "PMP e PRINCE2 non sono scorciatoie entry-level. Richiedono maturità, scenari e comprensione dei vincoli reali dei progetti.",
        mistakes: [
          "Tentare PMP prima delle basi",
          "Studiare solo formule e definizioni",
          "Ignorare stakeholder e rischio",
          "Dimenticare che i progetti lavorano sotto vincoli",
        ],
        outcomes: [
          "Capire la governance di progetto",
          "Prepararti a certificazioni management avanzate",
          "Migliorare pianificazione, rischio e stakeholder management",
        ],
        ctaQuizSlug: "pmp",
        ctaCertSlug: "pmp",
        ctaPrimaryText: "Inizia quiz PMP",
        ctaSecondaryText: "Scopri PMP",
      },
      {
        title: "⚫ Livello 4 — Leadership e management strategico",
        body:
          "Il management senior richiede più dei framework. Servono decisioni, priorità, portfolio thinking, governance, change leadership e capacità di collegare il lavoro tecnologico al valore di business.",
        recommended: ["PMI-ACP", "SAFe", "Management IT avanzato"],
        goal: "Passare dalla gestione delle attività alla guida di sistemi, team e value stream.",
        reality:
          "La leadership non è un certificato. Le certificazioni aiutano, ma la credibilità arriva da giudizio, comunicazione, priorità e delivery costante.",
        mistakes: [
          "Collezionare certificazioni senza applicarle",
          "Ignorare il valore di business",
          "Gestire attività invece di risultati",
          "Evitare conversazioni difficili con gli stakeholder",
        ],
        outcomes: [
          "Pensare oltre il singolo progetto",
          "Capire portfolio e value management",
          "Prepararti a percorsi senior di IT management",
        ],
      },
    ],

    salaryTitle: "💰 Stipendi Management IT (2026)",
    salaryIntro:
      "Le fasce variano molto in base a paese, dimensione aziendale, settore e livello di responsabilità. Usale come orientamento, non come promessa.",
    salaryRanges: [
      { label: "Entry-level / Coordinator", range: "$45k–$70k" },
      { label: "Project / Service Manager", range: "$75k–$115k" },
      { label: "Senior / Program Manager", range: "$120k+" },
    ],
    salaryDisclaimer:
      "Disclaimer: le certificazioni aiutano di più se combinate con progetti reali, comunicazione con stakeholder, esperienza di delivery e maturità di leadership.",

    compareTitle: "🔍 ITIL vs Scrum vs PMP — da cosa partire?",
    compareIntro:
      "Queste certificazioni risolvono problemi diversi. L’errore è scegliere quella più famosa senza capire ruolo e direzione professionale.",
    compareLeftTitle: "Percorso progressivo",
    compareRightTitle: "Scelta casuale",
    compareRows: [
      { label: "Chiarezza", left: "Parti dal tuo ruolo e obiettivo", right: "Scegli solo per popolarità" },
      { label: "Competenze", left: "Servizi + agile + project foundation", right: "Terminologia scollegata" },
      { label: "Risultato", left: "Crescita più solida", right: "Più difficile applicare ciò che studi" },
    ],
    compareRecommendationTitle: "Consiglio",
    compareRecommendationBody:
      "Inizia con Project Management Foundations, poi ITIL se lavori in servizi IT, Scrum/Agile se lavori con team prodotto o software, e PMP più avanti quando aumenta la complessità dei progetti.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "Meglio partire da ITIL o PMP?",
        a: "Se lavori in supporto IT, operation o service delivery, ITIL è spesso il primo passo migliore. PMP è più adatta quando gestisci già progetti strutturati.",
      },
      {
        q: "Scrum serve anche fuori dallo sviluppo software?",
        a: "Sì, ma è più utile quando i team lavorano in modo iterativo, ricevono feedback e rilasciano incrementi di valore.",
      },
      {
        q: "Serve esperienza prima di PMP?",
        a: "Sì. PMP è pensata per persone con esperienza di progetto ed è più efficace quando puoi collegare i concetti a scenari reali.",
      },
    ],

    finalCtaTitle: "🚀 Inizia ora il tuo percorso management",
    finalCtaBody:
      "Parti dalle basi, poi scegli ITIL, Agile/Scrum o PMP in base al tuo ruolo reale e alla direzione professionale.",
  },

  es: {
    title: "Roadmap Certificaciones Management IT 2026",
    subtitle: "De fundamentos de project management a ITIL, Agile y liderazgo",
    intro:
      "El management IT no consiste solo en gestionar personas. Significa entender proyectos, servicios, procesos, valor, riesgo, stakeholders y mejora continua. Esta roadmap te ayuda a empezar desde las bases y avanzar hacia frameworks como ITIL, Agile, Scrum, PMP y certificaciones relacionadas.",

    ctaPrimary: "Empieza con Project Management Foundations",
    ctaSecondary: "Explorar certificaciones Management",
    certCta: "Descubrir certificación",

    goalLabel: "Objetivo:",
    practiceCta: "Practicar ahora",

    levels: [
      {
        title: "🟢 Nivel 0 — Fundamentos de management",
        body:
          "Si empiezas desde cero, comienza con proyectos, tareas, stakeholders, plazos, riesgos, comunicación, alcance y valor. Antes de elegir un framework, debes entender qué intenta organizar el management.",
        recommended: [
          "Project Management Foundations",
          "Terminología básica de proyectos",
          "Stakeholders y comunicación",
          "Riesgo y alcance",
        ],
        goal: "Comprender el lenguaje de los proyectos y del trabajo organizado.",
        reality:
          "Muchos principiantes saltan directamente a PMP o Agile sin entender la lógica básica de los proyectos. Así los frameworks parecen abstractos.",
        mistakes: [
          "Empezar con certificaciones avanzadas demasiado pronto",
          "Memorizar términos sin contexto",
          "Ignorar comunicación y stakeholders",
          "Pensar que management solo significa planificar tareas",
        ],
        outcomes: [
          "Entender vocabulario básico de project management",
          "Seguir mejor ITIL, Agile y PMP",
          "Construir una base para certificaciones service/project management",
        ],
        ctaQuizSlug: "project-management-foundations",
        ctaCertSlug: "project-management-foundations",
        ctaPrimaryText: "Empezar quiz Foundations",
        ctaSecondaryText: "Descubrir Project Management Foundations",
      },
      {
        title: "🟡 Nivel 1 — IT Service Management",
        body:
          "ITIL es uno de los mejores puntos de partida para management IT. Se centra en valor, servicios, prácticas, incidentes, cambios, mejora continua y en cómo IT apoya los objetivos de negocio.",
        recommended: ["ITIL 4 Foundation"],
        goal: "Entender cómo se diseñan, entregan, soportan y mejoran los servicios IT.",
        reality:
          "ITIL no es solo teoría. Se vuelve útil cuando conectas incidentes, cambios, solicitudes de servicio, value streams y mejora continua con trabajo IT real.",
        mistakes: [
          "Estudiar ITIL como una lista de definiciones",
          "Ignorar el Service Value System",
          "Confundir procesos, prácticas y value streams",
          "No conectar ITIL con escenarios reales de servicio",
        ],
        outcomes: [
          "Comprender la lógica de IT service management",
          "Prepararte para ITIL 4 Foundation",
          "Mejorar soporte, operaciones y pensamiento de servicio",
        ],
        ctaQuizSlug: "itil-4-foundation",
        ctaCertSlug: "itil-4-foundation",
        ctaPrimaryText: "Empezar quiz ITIL",
        ctaSecondaryText: "Descubrir ITIL 4 Foundation",
      },
      {
        title: "🟠 Nivel 2 — Agile y Scrum",
        body:
          "Agile y Scrum ayudan a los equipos a trabajar de forma iterativa, adaptarse al cambio, mejorar la delivery y enfocarse en el valor para el cliente.",
        recommended: ["Scrum", "Agile Fundamentals"],
        goal: "Entender delivery iterativa, roles, eventos, artefactos y colaboración agile.",
        reality:
          "Agile no significa solo daily meetings y post-its. Sin product thinking y feedback loops, Scrum se convierte en ceremonia vacía.",
        mistakes: [
          "Pensar que Agile significa no planificar",
          "Tratar los eventos Scrum como burocracia",
          "Ignorar product ownership",
          "Usar velocity como herramienta de presión",
        ],
        outcomes: [
          "Comprender agile delivery",
          "Colaborar mejor con equipos producto y desarrollo",
          "Prepararte para certificaciones Scrum y Agile",
        ],
        ctaQuizSlug: "scrum",
        ctaCertSlug: "scrum",
        ctaPrimaryText: "Empezar quiz Scrum",
        ctaSecondaryText: "Descubrir Scrum",
      },
      {
        title: "🔴 Nivel 3 — Project management profesional",
        body:
          "Aquí entras en project management estructurado: planificación, scope, tiempo, coste, calidad, recursos, procurement, stakeholders y riesgo.",
        recommended: ["PMP", "PRINCE2"],
        goal: "Desarrollar pensamiento estructurado para iniciativas más grandes.",
        reality:
          "PMP y PRINCE2 no son atajos entry-level. Requieren madurez, escenarios y comprensión de las restricciones reales de los proyectos.",
        mistakes: [
          "Intentar PMP antes de entender las bases",
          "Estudiar solo fórmulas y definiciones",
          "Ignorar stakeholders y riesgo",
          "Olvidar que los proyectos operan bajo restricciones",
        ],
        outcomes: [
          "Entender governance de proyectos",
          "Prepararte para certificaciones management avanzadas",
          "Mejorar planificación, riesgo y stakeholder management",
        ],
        ctaQuizSlug: "pmp",
        ctaCertSlug: "pmp",
        ctaPrimaryText: "Empezar quiz PMP",
        ctaSecondaryText: "Descubrir PMP",
      },
    ],

    salaryTitle: "💰 Salarios Management IT (2026)",
    salaryIntro:
      "Los rangos varían mucho según país, tamaño de empresa, sector y nivel de responsabilidad. Úsalos como orientación, no como promesa.",
    salaryRanges: [
      { label: "Entry-level / Coordinator", range: "$45k–$70k" },
      { label: "Project / Service Manager", range: "$75k–$115k" },
      { label: "Senior / Program Manager", range: "$120k+" },
    ],
    salaryDisclaimer:
      "Disclaimer: las certificaciones ayudan más cuando se combinan con proyectos reales, comunicación con stakeholders, experiencia de delivery y madurez de liderazgo.",

    compareTitle: "🔍 ITIL vs Scrum vs PMP — ¿por dónde empezar?",
    compareIntro:
      "Estas certificaciones resuelven problemas distintos. El error es elegir la más famosa sin entender tu rol ni tu dirección profesional.",
    compareLeftTitle: "Ruta progresiva",
    compareRightTitle: "Elección aleatoria",
    compareRows: [
      { label: "Claridad", left: "Empiezas desde tu rol y objetivo", right: "Eliges solo por popularidad" },
      { label: "Habilidades", left: "Servicios + agile + project foundation", right: "Terminología desconectada" },
      { label: "Resultado", left: "Crecimiento más sólido", right: "Más difícil aplicar lo aprendido" },
    ],
    compareRecommendationTitle: "Recomendación",
    compareRecommendationBody:
      "Empieza con Project Management Foundations, luego ITIL si trabajas en servicios IT, Scrum/Agile si trabajas con equipos producto o software, y PMP más adelante.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "¿Mejor empezar con ITIL o PMP?",
        a: "Si trabajas en soporte IT, operaciones o service delivery, ITIL suele ser mejor primer paso. PMP es más adecuada cuando ya gestionas proyectos estructurados.",
      },
      {
        q: "¿Scrum sirve fuera del desarrollo software?",
        a: "Sí, pero es más útil cuando los equipos trabajan de forma iterativa, reciben feedback y entregan incrementos de valor.",
      },
    ],

    finalCtaTitle: "🚀 Empieza ahora tu ruta management",
    finalCtaBody:
      "Empieza por las bases y luego elige ITIL, Agile/Scrum o PMP según tu rol real y tu dirección profesional.",
  },

  fr: {
    title: "Roadmap Certifications Management IT 2026",
    subtitle: "Des bases du project management à ITIL, Agile et leadership",
    intro:
      "Le management IT ne consiste pas seulement à gérer des personnes. Il signifie comprendre les projets, services, processus, valeur, risques, parties prenantes et amélioration continue. Cette roadmap vous aide à partir des bases et à avancer vers ITIL, Agile, Scrum, PMP et certifications associées.",

    ctaPrimary: "Commencer avec Project Management Foundations",
    ctaSecondary: "Explorer les certifications Management",
    certCta: "Découvrir la certification",

    goalLabel: "Objectif :",
    practiceCta: "S'entraîner maintenant",

    levels: [
      {
        title: "🟢 Niveau 0 — Fondamentaux du management",
        body:
          "Si vous débutez, commencez par les bases : projets, tâches, parties prenantes, délais, risques, communication, périmètre et valeur.",
        recommended: [
          "Project Management Foundations",
          "Terminologie projet de base",
          "Parties prenantes et communication",
          "Risque et périmètre",
        ],
        goal: "Comprendre le langage des projets et du travail organisé.",
        reality:
          "Beaucoup de débutants vont directement vers PMP ou Agile sans comprendre la logique de base des projets.",
        mistakes: [
          "Commencer par des certifications avancées trop tôt",
          "Mémoriser des termes sans contexte",
          "Ignorer communication et parties prenantes",
          "Penser que management signifie seulement planifier des tâches",
        ],
        outcomes: [
          "Comprendre le vocabulaire de base du project management",
          "Mieux suivre ITIL, Agile et PMP",
          "Construire une base pour les certifications service/project management",
        ],
        ctaQuizSlug: "project-management-foundations",
        ctaCertSlug: "project-management-foundations",
        ctaPrimaryText: "Commencer le quiz Foundations",
        ctaSecondaryText: "Découvrir Project Management Foundations",
      },
      {
        title: "🟡 Niveau 1 — IT Service Management",
        body:
          "ITIL est l’un des meilleurs points de départ pour le management IT. Il se concentre sur la valeur, les services, les pratiques, les incidents, les changements, l’amélioration continue et la façon dont l’IT soutient le business.",
        recommended: ["ITIL 4 Foundation"],
        goal: "Comprendre comment les services IT sont conçus, fournis, supportés et améliorés.",
        reality:
          "ITIL n’est pas seulement théorique. Il devient utile lorsqu’on relie incidents, changements, demandes de service et amélioration continue au travail IT réel.",
        mistakes: [
          "Étudier ITIL comme une liste de définitions",
          "Ignorer le Service Value System",
          "Confondre processus, pratiques et value streams",
          "Ne pas relier ITIL à des scénarios réels",
        ],
        outcomes: [
          "Comprendre la logique IT service management",
          "Se préparer à ITIL 4 Foundation",
          "Améliorer support, opérations et mentalité service",
        ],
        ctaQuizSlug: "itil-4-foundation",
        ctaCertSlug: "itil-4-foundation",
        ctaPrimaryText: "Commencer le quiz ITIL",
        ctaSecondaryText: "Découvrir ITIL 4 Foundation",
      },
      {
        title: "🟠 Niveau 2 — Agile et Scrum",
        body:
          "Agile et Scrum aident les équipes à travailler de manière itérative, à s’adapter au changement, à améliorer la delivery et à se concentrer sur la valeur client.",
        recommended: ["Scrum", "Agile Fundamentals"],
        goal: "Comprendre la delivery itérative, les rôles, événements, artefacts et la collaboration agile.",
        reality:
          "Agile ne signifie pas seulement daily meetings et post-it. Sans product thinking ni feedback loops, Scrum devient une cérémonie vide.",
        mistakes: [
          "Penser qu’Agile signifie absence de planification",
          "Traiter les événements Scrum comme de la bureaucratie",
          "Ignorer le product ownership",
          "Utiliser la vélocité comme outil de pression",
        ],
        outcomes: [
          "Comprendre la delivery agile",
          "Mieux collaborer avec les équipes produit et développement",
          "Se préparer aux certifications Scrum et Agile",
        ],
        ctaQuizSlug: "scrum",
        ctaCertSlug: "scrum",
        ctaPrimaryText: "Commencer le quiz Scrum",
        ctaSecondaryText: "Découvrir Scrum",
      },
      {
        title: "🔴 Niveau 3 — Project management professionnel",
        body:
          "Ici vous entrez dans le project management structuré : planification, périmètre, délais, coûts, qualité, ressources, procurement, parties prenantes et risques.",
        recommended: ["PMP", "PRINCE2"],
        goal: "Développer une pensée structurée pour des initiatives plus importantes.",
        reality:
          "PMP et PRINCE2 ne sont pas des raccourcis entry-level. Ils nécessitent de la maturité, des scénarios et une compréhension des contraintes réelles.",
        mistakes: [
          "Tenter PMP avant les bases",
          "Étudier uniquement formules et définitions",
          "Ignorer parties prenantes et risques",
          "Oublier que les projets travaillent sous contraintes",
        ],
        outcomes: [
          "Comprendre la gouvernance de projet",
          "Se préparer aux certifications management avancées",
          "Améliorer planification, risque et stakeholder management",
        ],
        ctaQuizSlug: "pmp",
        ctaCertSlug: "pmp",
        ctaPrimaryText: "Commencer le quiz PMP",
        ctaSecondaryText: "Découvrir PMP",
      },
    ],

    salaryTitle: "💰 Salaires Management IT (2026)",
    salaryIntro:
      "Les fourchettes varient fortement selon le pays, la taille de l’entreprise, le secteur et le niveau de responsabilité.",
    salaryRanges: [
      { label: "Entry-level / Coordinateur", range: "$45k–$70k" },
      { label: "Project / Service Manager", range: "$75k–$115k" },
      { label: "Senior / Program Manager", range: "$120k+" },
    ],
    salaryDisclaimer:
      "Disclaimer : les certifications sont plus utiles lorsqu’elles sont combinées à des projets réels, de la communication stakeholder, de l’expérience delivery et de la maturité leadership.",

    compareTitle: "🔍 ITIL vs Scrum vs PMP — par quoi commencer ?",
    compareIntro:
      "Ces certifications répondent à des besoins différents. L’erreur est de choisir la plus célèbre sans comprendre son rôle ni sa direction professionnelle.",
    compareLeftTitle: "Parcours progressif",
    compareRightTitle: "Choix aléatoire",
    compareRows: [
      { label: "Clarté", left: "Vous partez de votre rôle et objectif", right: "Vous choisissez seulement par popularité" },
      { label: "Compétences", left: "Services + agile + project foundation", right: "Terminologie déconnectée" },
      { label: "Résultat", left: "Progression plus solide", right: "Plus difficile à appliquer" },
    ],
    compareRecommendationTitle: "Recommandation",
    compareRecommendationBody:
      "Commencez avec Project Management Foundations, puis ITIL si vous travaillez dans les services IT, Scrum/Agile si vous êtes proche produit ou logiciel, puis PMP plus tard.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "Vaut-il mieux commencer par ITIL ou PMP ?",
        a: "Si vous travaillez en support IT, opérations ou service delivery, ITIL est souvent le meilleur premier pas. PMP convient mieux quand vous gérez déjà des projets structurés.",
      },
      {
        q: "Scrum est-il utile hors développement logiciel ?",
        a: "Oui, mais il est surtout utile quand les équipes travaillent de façon itérative, reçoivent du feedback et livrent des incréments de valeur.",
      },
    ],

    finalCtaTitle: "🚀 Commencez maintenant votre parcours management",
    finalCtaBody:
      "Commencez par les bases, puis choisissez ITIL, Agile/Scrum ou PMP selon votre rôle réel et votre direction professionnelle.",
  },
};