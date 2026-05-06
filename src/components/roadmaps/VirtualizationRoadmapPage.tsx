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

export default function VirtualizationRoadmapPage({
  lang,
}: {
  lang: Locale;
}) {
  const t = CONTENT[lang];

  const categoryVirtualization =
    lang === "en"
      ? "/categories/virtualization"
      : lang === "it"
      ? "/it/categorie/virtualizzazione"
      : lang === "es"
      ? "/es/categorias/virtualizacion"
      : "/fr/categories/virtualisation";

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
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
            href={quiz(lang, "vmware-certified-professional")}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition"
          >
            {t.ctaPrimary}
          </Link>

          <Link
            href={categoryVirtualization}
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
            href={quiz(lang, "vmware-certified-professional")}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition"
          >
            {t.ctaPrimary}
          </Link>
          <Link
            href={categoryVirtualization}
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
    title: "Virtualization Certification Roadmap 2026",
    subtitle: "From VM basics to real infrastructure skills",
    intro:
      "Virtualization is still a core part of modern infrastructure. Before cloud, containers, or automation, you need to understand how virtual machines, storage, networking, snapshots, backups, and recovery actually work. This roadmap helps you build practical virtualization skills and then choose a platform path.",

    ctaPrimary: "Start with VMware VCP quiz",
    ctaSecondary: "Browse virtualization certifications",
    certCta: "Explore certification",

    goalLabel: "Goal:",
    practiceCta: "Practice now",

    levels: [
      {
        title: "🟢 Level 0 — Virtualization fundamentals",
        body:
          "Start with the real basics: what a hypervisor does, how a VM differs from a physical machine, what snapshots are, how virtual networks work, and why storage performance matters. This step is less glamorous than cloud buzzwords, but it is where real infrastructure understanding begins.",
        recommended: [
          "Hypervisor basics",
          "VM vs physical server",
          "Snapshots and storage",
          "Virtual networking basics",
        ],
        goal:
          "Understand how virtualized environments actually behave.",
        reality:
          "Many beginners treat virtualization as just 'running another computer inside a computer'. In real infrastructure, resource allocation, storage, networking, and recovery decisions matter a lot.",
        mistakes: [
          "Thinking snapshots are the same as backups",
          "Ignoring storage performance",
          "Allocating CPU and RAM randomly",
          "Skipping virtual networking fundamentals",
        ],
        outcomes: [
          "Understand what a hypervisor actually does",
          "Recognize the difference between VM, host, storage, and network layers",
          "Prepare for VMware or Microsoft virtualization with fewer gaps",
        ],
      },
      {
        title: "🟡 Level 1 — Operational admin mindset",
        body:
          "Now move into day-to-day operations: provisioning virtual machines, using templates, allocating CPU and RAM properly, monitoring usage, handling backups, and recovering from common failures. This is where you stop knowing definitions and start thinking like an admin.",
        recommended: [
          "Provisioning and templates",
          "Performance and capacity checks",
          "Backup and restore routines",
          "Basic monitoring",
        ],
        goal:
          "Keep a VM environment stable, recoverable, and efficient.",
        reality:
          "Real virtualization work is often operational. You are not only creating VMs; you are preventing outages, controlling resources, and making sure recovery is possible.",
        mistakes: [
          "Overprovisioning every VM",
          "Forgetting backup and restore testing",
          "Ignoring monitoring until there is a problem",
          "Treating templates as optional instead of operational tools",
        ],
        outcomes: [
          "Manage VM lifecycle more confidently",
          "Understand capacity and performance basics",
          "Build an admin mindset for real infrastructure environments",
        ],
      },
      {
        title: "🟠 Level 2 — Choose your platform",
        body:
          "At this point you choose the platform that matches your target jobs. VMware is common in enterprise infrastructure. Microsoft virtualization is often more relevant in Windows-based environments and organizations already centered around Microsoft ecosystems.",
        recommended: [
          "VMware Certified Professional",
          "Microsoft Virtualization",
        ],
        goal:
          "Learn the tools and terminology employers actually expect.",
        reality:
          "The platform matters, but the fundamentals matter more. If you understand virtualization concepts well, moving between VMware, Hyper-V, and hybrid environments becomes much easier.",
        mistakes: [
          "Studying a platform without understanding the concepts behind it",
          "Ignoring the local job market",
          "Learning console clicks without understanding architecture",
          "Avoiding lab practice",
        ],
        outcomes: [
          "Choose a platform path with more clarity",
          "Understand VMware and Microsoft virtualization expectations",
          "Prepare for infrastructure or systems admin roles",
        ],
        ctaQuizSlug: "vmware-certified-professional",
        ctaCertSlug: "vmware-certified-professional",
        ctaPrimaryText: "Start VMware quiz",
        ctaSecondaryText: "Explore VMware certification",
      },
      {
        title: "🔴 Level 3 — Automation, DR, and hybrid thinking",
        body:
          "Once your platform basics are stable, move into the higher-value layer: automation, disaster recovery logic, hybrid infrastructure thinking, and how virtualization connects to cloud migration, resilience, and operational scale. This is where virtualization stops being just VMs and becomes infrastructure engineering.",
        recommended: [
          "Automation basics",
          "Disaster recovery mindset",
          "Hybrid infrastructure concepts",
          "Cloud migration basics",
        ],
        goal:
          "Operate virtualized environments with more scale and less chaos.",
        reality:
          "Senior infrastructure work is not about manually clicking through every task. It is about repeatability, recovery planning, monitoring, automation, and reducing operational risk.",
        mistakes: [
          "Avoiding automation completely",
          "Having disaster recovery plans only on paper",
          "Ignoring hybrid cloud patterns",
          "Thinking infrastructure engineering is only platform administration",
        ],
        outcomes: [
          "Understand disaster recovery and resilience logic",
          "Connect virtualization skills to cloud and hybrid infrastructure",
          "Move closer to infrastructure engineering responsibilities",
        ],
        ctaQuizSlug: "microsoft-virtualization",
        ctaCertSlug: "microsoft-virtualization",
        ctaPrimaryText: "Start Microsoft virtualization quiz",
        ctaSecondaryText: "Explore Microsoft virtualization",
      },
    ],

    salaryTitle: "💰 Virtualization salary outlook (2026)",
    salaryIntro:
      "Virtualization usually pays best when it is combined with infrastructure, troubleshooting, backup strategy, monitoring, and automation. Salary ranges vary a lot by country and role.",
    salaryRanges: [
      { label: "Junior", range: "$45k–$70k" },
      { label: "Mid-level", range: "$75k–$105k" },
      { label: "Senior / Infrastructure", range: "$115k+" },
    ],
    salaryDisclaimer:
      "The highest value comes when virtualization is combined with operations, reliability, disaster recovery, and automation skills.",

    compareTitle:
      "🔍 VMware vs Microsoft virtualization — which path makes more sense?",
    compareIntro:
      "Both are valid. The better choice depends on the environments you want to work in and the job market around you.",
    compareLeftTitle: "VMware",
    compareRightTitle: "Microsoft Virtualization",
    compareRows: [
      {
        label: "Typical environment",
        left: "Enterprise datacenters",
        right: "Windows-centered infrastructures",
      },
      {
        label: "Main strength",
        left: "Mature ecosystem and broad enterprise adoption",
        right: "Strong Microsoft stack integration",
      },
      {
        label: "Best choice if…",
        left: "You want broad enterprise portability",
        right: "You target Windows-heavy teams",
      },
    ],
    compareRecommendationTitle: "Recommendation",
    compareRecommendationBody:
      "If you are unsure, start with virtualization fundamentals and VMware concepts because they transfer well. If your market is very Microsoft-heavy, Microsoft virtualization can be the faster practical path.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "Is virtualization still worth learning in 2026?",
        a: "Yes. Even with cloud and containers, virtualization remains fundamental in many enterprise, hybrid, and infrastructure environments.",
      },
      {
        q: "Should I learn VMs before containers?",
        a: "Yes. Virtual machines give you stronger infrastructure foundations. Containers make more sense once you understand systems, networking, and resource isolation.",
      },
      {
        q: "Is VMware still valuable?",
        a: "Yes, especially for enterprise infrastructure roles. It becomes much more valuable when paired with hands-on labs and troubleshooting ability.",
      },
      {
        q: "How do I get practical experience quickly?",
        a: "Build a small lab, create VMs, test snapshots, simulate failures, and practice backup and restore workflows.",
      },
    ],

    finalCtaTitle: "🚀 Start now with the practical path",
    finalCtaBody:
      "Learn VM fundamentals, practice real operations, then choose a platform path. Start with a quiz and build from there.",
  },

  it: {
    title: "Roadmap Certificazioni Virtualizzazione 2026",
    subtitle: "Dalle basi VM a competenze infrastrutturali reali",
    intro:
      "La virtualizzazione è ancora una parte centrale dell’infrastruttura moderna. Prima del cloud, dei container o dell’automazione, devi capire davvero come funzionano macchine virtuali, storage, networking, snapshot, backup e recovery. Questa roadmap ti aiuta a costruire competenze pratiche e poi a scegliere una piattaforma.",

    ctaPrimary: "Inizia con il quiz VMware",
    ctaSecondary: "Vedi le certificazioni Virtualizzazione",
    certCta: "Scopri certificazione",

    goalLabel: "Obiettivo:",
    practiceCta: "Allenati ora",

    levels: [
      {
        title: "🟢 Livello 0 — Fondamenta della virtualizzazione",
        body:
          "Parti dalle basi vere: cosa fa un hypervisor, in cosa una VM differisce da una macchina fisica, cosa sono gli snapshot, come funzionano le reti virtuali e perché lo storage incide così tanto sulle performance. Questa fase sembra meno affascinante del cloud, ma è quella che crea comprensione infrastrutturale reale.",
        recommended: [
          "Basi hypervisor",
          "VM vs server fisico",
          "Snapshot e storage",
          "Basi di networking virtuale",
        ],
        goal:
          "Capire come si comporta davvero un ambiente virtualizzato.",
        reality:
          "Molti principianti pensano che virtualizzazione significhi solo 'far girare un computer dentro un altro computer'. Nella realtà infrastrutturale, allocazione risorse, storage, rete e recovery contano moltissimo.",
        mistakes: [
          "Pensare che gli snapshot siano backup",
          "Ignorare le performance dello storage",
          "Allocare CPU e RAM a caso",
          "Saltare le basi di networking virtuale",
        ],
        outcomes: [
          "Capire cosa fa davvero un hypervisor",
          "Distinguere VM, host, storage e layer di rete",
          "Prepararti a VMware o Microsoft virtualization con meno lacune",
        ],
      },
      {
        title: "🟡 Livello 1 — Mentalità operativa da admin",
        body:
          "Ora entri nell’operatività quotidiana: provisioning delle VM, uso dei template, allocazione corretta di CPU e RAM, monitoraggio, backup e recovery dai guasti più comuni. Qui smetti di sapere solo le definizioni e inizi a ragionare da admin.",
        recommended: [
          "Provisioning e template",
          "Controlli di performance e capacity",
          "Routine di backup e restore",
          "Monitoraggio base",
        ],
        goal:
          "Mantenere un ambiente VM stabile, recuperabile ed efficiente.",
        reality:
          "Il lavoro reale sulla virtualizzazione è spesso operativo. Non stai solo creando VM: stai prevenendo downtime, controllando risorse e garantendo possibilità di recovery.",
        mistakes: [
          "Fare overprovisioning su ogni VM",
          "Dimenticare di testare backup e restore",
          "Ignorare il monitoraggio finché non c’è un problema",
          "Trattare i template come opzionali invece che come strumenti operativi",
        ],
        outcomes: [
          "Gestire meglio il ciclo di vita delle VM",
          "Capire basi di capacity e performance",
          "Costruire mentalità da admin per ambienti infrastrutturali reali",
        ],
      },
      {
        title: "🟠 Livello 2 — Scegli la piattaforma",
        body:
          "A questo punto scegli la piattaforma più coerente con i ruoli che vuoi raggiungere. VMware è molto presente in ambienti enterprise. La virtualizzazione Microsoft è spesso più rilevante nei contesti Windows e nelle aziende già orientate allo stack Microsoft.",
        recommended: [
          "VMware Certified Professional",
          "Microsoft Virtualization",
        ],
        goal:
          "Imparare strumenti e terminologia che le aziende si aspettano davvero.",
        reality:
          "La piattaforma conta, ma le fondamenta contano di più. Se capisci bene i concetti di virtualizzazione, muoverti tra VMware, Hyper-V e ambienti hybrid diventa molto più semplice.",
        mistakes: [
          "Studiare una piattaforma senza capire i concetti dietro",
          "Ignorare il mercato del lavoro locale",
          "Imparare click nella console senza ragionare sull’architettura",
          "Evitare la pratica in laboratorio",
        ],
        outcomes: [
          "Scegliere una piattaforma con più chiarezza",
          "Capire le aspettative su VMware e Microsoft virtualization",
          "Prepararti a ruoli infrastructure o systems admin",
        ],
        ctaQuizSlug: "vmware-certified-professional",
        ctaCertSlug: "vmware-certified-professional",
        ctaPrimaryText: "Inizia quiz VMware",
        ctaSecondaryText: "Scopri certificazione VMware",
      },
      {
        title: "🔴 Livello 3 — Automazione, DR e approccio hybrid",
        body:
          "Quando la piattaforma è chiara, sali di livello: automazione, logica di disaster recovery, approccio hybrid e connessione tra virtualizzazione, cloud migration, resilienza e scala operativa. Qui la virtualizzazione smette di essere solo VM e diventa ingegneria infrastrutturale.",
        recommended: [
          "Basi di automazione",
          "Mentalità disaster recovery",
          "Concetti di infrastruttura hybrid",
          "Basi di cloud migration",
        ],
        goal:
          "Gestire ambienti virtualizzati con più scala e meno caos.",
        reality:
          "Il lavoro infrastrutturale senior non consiste nel cliccare manualmente ogni attività. Consiste in ripetibilità, recovery planning, monitoraggio, automazione e riduzione del rischio operativo.",
        mistakes: [
          "Evitare completamente l’automazione",
          "Avere piani di disaster recovery solo sulla carta",
          "Ignorare i pattern hybrid cloud",
          "Pensare che infrastructure engineering sia solo amministrazione piattaforma",
        ],
        outcomes: [
          "Comprendere logiche di disaster recovery e resilienza",
          "Collegare virtualizzazione, cloud e infrastruttura hybrid",
          "Avvicinarti a responsabilità da infrastructure engineer",
        ],
        ctaQuizSlug: "microsoft-virtualization",
        ctaCertSlug: "microsoft-virtualization",
        ctaPrimaryText: "Inizia quiz Microsoft virtualization",
        ctaSecondaryText: "Scopri Microsoft virtualization",
      },
    ],

    salaryTitle: "💰 Salary outlook Virtualizzazione (2026)",
    salaryIntro:
      "La virtualizzazione rende di più quando la unisci a infrastruttura, troubleshooting, backup strategy, monitoraggio e automazione. I range dipendono molto da paese e ruolo.",
    salaryRanges: [
      { label: "Junior", range: "$45k–$70k" },
      { label: "Mid-level", range: "$75k–$105k" },
      { label: "Senior / Infrastructure", range: "$115k+" },
    ],
    salaryDisclaimer:
      "Il valore più alto arriva quando unisci virtualizzazione, operatività, affidabilità, disaster recovery e automazione.",

    compareTitle:
      "🔍 VMware vs Microsoft virtualization — quale percorso ha più senso?",
    compareIntro:
      "Entrambi sono validi. La scelta migliore dipende dagli ambienti in cui vuoi lavorare e dal mercato intorno a te.",
    compareLeftTitle: "VMware",
    compareRightTitle: "Microsoft Virtualization",
    compareRows: [
      {
        label: "Ambiente tipico",
        left: "Datacenter enterprise",
        right: "Infrastrutture orientate a Windows",
      },
      {
        label: "Punto forte",
        left: "Ecosistema maturo e ampia adozione enterprise",
        right: "Forte integrazione con stack Microsoft",
      },
      {
        label: "Scelta migliore se…",
        left: "Vuoi più trasferibilità enterprise",
        right: "Miri a team Windows-heavy",
      },
    ],
    compareRecommendationTitle: "Consiglio",
    compareRecommendationBody:
      "Se sei indeciso, parti dalle fondamenta e dai concetti VMware perché sono molto trasferibili. Se il tuo mercato è fortemente Microsoft, Microsoft virtualization può essere la strada pratica più veloce.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "Vale ancora la pena studiare virtualizzazione nel 2026?",
        a: "Sì. Anche con cloud e container, la virtualizzazione resta fondamentale in molti ambienti enterprise, hybrid e infrastrutturali.",
      },
      {
        q: "Meglio imparare VM prima dei container?",
        a: "Sì. Le VM ti danno fondamenta infrastrutturali più solide. I container hanno più senso dopo aver capito sistemi, rete e isolamento risorse.",
      },
      {
        q: "VMware è ancora utile?",
        a: "Sì, soprattutto per ruoli enterprise infrastructure. Diventa molto più utile se lo abbini a laboratori e capacità di troubleshooting.",
      },
      {
        q: "Come faccio esperienza pratica velocemente?",
        a: "Crea un piccolo lab, monta VM, prova snapshot, simula guasti e pratica backup e restore.",
      },
    ],

    finalCtaTitle: "🚀 Parti ora con il percorso pratico",
    finalCtaBody:
      "Impara i fondamentali delle VM, fai operazioni reali e poi scegli la piattaforma. Parti da un quiz e costruisci da lì.",
  },

  es: {
    title: "Ruta de Certificaciones de Virtualización 2026",
    subtitle: "De bases VM a habilidades reales de infraestructura",
    intro:
      "La virtualización sigue siendo una parte central de la infraestructura moderna. Antes del cloud, los contenedores o la automatización, necesitas entender de verdad cómo funcionan las máquinas virtuales, el storage, las redes virtuales, los snapshots, los backups y la recuperación.",

    ctaPrimary: "Empezar con el quiz VMware",
    ctaSecondary: "Ver certificaciones de virtualización",
    certCta: "Ver certificación",

    goalLabel: "Objetivo:",
    practiceCta: "Practicar ahora",

    levels: [
      {
        title: "🟢 Nivel 0 — Fundamentos de virtualización",
        body:
          "Empieza por las bases reales: qué hace un hypervisor, en qué se diferencia una VM de una máquina física, qué son los snapshots, cómo funcionan las redes virtuales y por qué el storage afecta tanto al rendimiento. Esta fase parece menos atractiva que el cloud, pero aquí empieza la comprensión real de infraestructura.",
        recommended: [
          "Bases de hypervisor",
          "VM vs servidor físico",
          "Snapshots y storage",
          "Bases de networking virtual",
        ],
        goal:
          "Entender cómo se comporta realmente un entorno virtualizado.",
        reality:
          "Muchos principiantes piensan que virtualización significa solo 'ejecutar un ordenador dentro de otro'. En infraestructura real, la asignación de recursos, el storage, la red y la recuperación importan muchísimo.",
        mistakes: [
          "Pensar que los snapshots son backups",
          "Ignorar el rendimiento del storage",
          "Asignar CPU y RAM al azar",
          "Saltar fundamentos de networking virtual",
        ],
        outcomes: [
          "Entender qué hace realmente un hypervisor",
          "Distinguir VM, host, storage y capas de red",
          "Prepararte para VMware o Microsoft virtualization con menos vacíos",
        ],
      },
      {
        title: "🟡 Nivel 1 — Mentalidad operativa de admin",
        body:
          "Ahora pasas a la operación diaria: provisioning de VM, uso de templates, asignación correcta de CPU y RAM, monitorización, backups y recuperación ante fallos comunes. Aquí dejas de conocer definiciones y empiezas a pensar como admin.",
        recommended: [
          "Provisioning y templates",
          "Controles de rendimiento y capacidad",
          "Rutinas de backup y restore",
          "Monitorización básica",
        ],
        goal:
          "Mantener un entorno de VM estable, recuperable y eficiente.",
        reality:
          "El trabajo real con virtualización suele ser operativo. No solo creas VM: previenes downtime, controlas recursos y aseguras que la recuperación sea posible.",
        mistakes: [
          "Hacer overprovisioning en cada VM",
          "Olvidar probar backup y restore",
          "Ignorar la monitorización hasta que hay un problema",
          "Tratar los templates como opcionales en vez de herramientas operativas",
        ],
        outcomes: [
          "Gestionar mejor el ciclo de vida de las VM",
          "Comprender fundamentos de capacidad y rendimiento",
          "Construir mentalidad de admin para entornos reales de infraestructura",
        ],
      },
      {
        title: "🟠 Nivel 2 — Elige la plataforma",
        body:
          "En este punto eliges la plataforma que mejor encaje con los roles a los que apuntas. VMware es muy común en entornos enterprise. La virtualización Microsoft suele ser más relevante en contextos Windows y empresas centradas en el stack Microsoft.",
        recommended: [
          "VMware Certified Professional",
          "Microsoft Virtualization",
        ],
        goal:
          "Aprender herramientas y terminología que realmente esperan las empresas.",
        reality:
          "La plataforma importa, pero los fundamentos importan más. Si entiendes bien los conceptos de virtualización, moverte entre VMware, Hyper-V y entornos hybrid será mucho más fácil.",
        mistakes: [
          "Estudiar una plataforma sin entender los conceptos detrás",
          "Ignorar el mercado laboral local",
          "Aprender clics de consola sin pensar en arquitectura",
          "Evitar práctica en laboratorio",
        ],
        outcomes: [
          "Elegir una ruta de plataforma con más claridad",
          "Comprender expectativas sobre VMware y Microsoft virtualization",
          "Prepararte para roles de infrastructure o systems admin",
        ],
        ctaQuizSlug: "vmware-certified-professional",
        ctaCertSlug: "vmware-certified-professional",
        ctaPrimaryText: "Empezar quiz VMware",
        ctaSecondaryText: "Ver certificación VMware",
      },
      {
        title: "🔴 Nivel 3 — Automatización, DR e híbrido",
        body:
          "Cuando la plataforma ya esté clara, subes de nivel: automatización, lógica de disaster recovery, enfoque hybrid y conexión entre virtualización, cloud migration, resiliencia y escala operativa. Aquí la virtualización deja de ser solo VM y se convierte en ingeniería de infraestructura.",
        recommended: [
          "Bases de automatización",
          "Mentalidad disaster recovery",
          "Conceptos de infraestructura hybrid",
          "Bases de cloud migration",
        ],
        goal:
          "Gestionar entornos virtualizados con más escala y menos caos.",
        reality:
          "El trabajo senior de infraestructura no consiste en hacer clic manualmente en cada tarea. Consiste en repetibilidad, recovery planning, monitorización, automatización y reducción del riesgo operativo.",
        mistakes: [
          "Evitar completamente la automatización",
          "Tener planes de disaster recovery solo en papel",
          "Ignorar patrones hybrid cloud",
          "Pensar que infrastructure engineering es solo administración de plataforma",
        ],
        outcomes: [
          "Comprender lógica de disaster recovery y resiliencia",
          "Conectar virtualización con cloud e infraestructura hybrid",
          "Acercarte a responsabilidades de infrastructure engineer",
        ],
        ctaQuizSlug: "microsoft-virtualization",
        ctaCertSlug: "microsoft-virtualization",
        ctaPrimaryText: "Empezar quiz Microsoft virtualization",
        ctaSecondaryText: "Ver Microsoft virtualization",
      },
    ],

    salaryTitle: "💰 Salarios Virtualización (2026)",
    salaryIntro:
      "La virtualización aporta más valor cuando se combina con infraestructura, troubleshooting, estrategia de backup, monitorización y automatización. Los rangos dependen mucho del país y del rol.",
    salaryRanges: [
      { label: "Junior", range: "$45k–$70k" },
      { label: "Mid-level", range: "$75k–$105k" },
      { label: "Senior / Infrastructure", range: "$115k+" },
    ],
    salaryDisclaimer:
      "El mayor valor llega cuando combinas virtualización, operaciones, fiabilidad, disaster recovery y automatización.",

    compareTitle:
      "🔍 VMware vs Microsoft virtualization — ¿qué camino tiene más sentido?",
    compareIntro:
      "Ambos son válidos. La mejor elección depende de los entornos en los que quieres trabajar y del mercado a tu alrededor.",
    compareLeftTitle: "VMware",
    compareRightTitle: "Microsoft Virtualization",
    compareRows: [
      {
        label: "Entorno típico",
        left: "Datacenters enterprise",
        right: "Infraestructuras orientadas a Windows",
      },
      {
        label: "Punto fuerte",
        left: "Ecosistema maduro y amplia adopción enterprise",
        right: "Gran integración con stack Microsoft",
      },
      {
        label: "Mejor elección si…",
        left: "Quieres más portabilidad enterprise",
        right: "Apuntas a equipos muy centrados en Windows",
      },
    ],
    compareRecommendationTitle: "Recomendación",
    compareRecommendationBody:
      "Si dudas, empieza por fundamentos y conceptos VMware porque son muy transferibles. Si tu mercado es muy Microsoft, Microsoft virtualization puede ser la ruta práctica más rápida.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "¿Sigue valiendo la pena estudiar virtualización en 2026?",
        a: "Sí. Incluso con cloud y contenedores, la virtualización sigue siendo fundamental en muchos entornos enterprise, hybrid e infraestructurales.",
      },
      {
        q: "¿Debería aprender VM antes que contenedores?",
        a: "Sí. Las VM te dan fundamentos de infraestructura más sólidos. Los contenedores tienen más sentido después de entender sistemas, redes y aislamiento de recursos.",
      },
      {
        q: "¿VMware sigue siendo útil?",
        a: "Sí, especialmente para roles de enterprise infrastructure. Se vuelve mucho más útil si lo combinas con laboratorios y troubleshooting.",
      },
      {
        q: "¿Cómo consigo experiencia práctica rápidamente?",
        a: "Crea un pequeño lab, monta VM, prueba snapshots, simula fallos y practica backup y restore.",
      },
    ],

    finalCtaTitle: "🚀 Empieza ahora con el camino práctico",
    finalCtaBody:
      "Aprende los fundamentos de las VM, practica operaciones reales y luego elige plataforma. Empieza con un quiz y construye desde ahí.",
  },

  fr: {
    title: "Parcours Certifications Virtualisation 2026",
    subtitle: "Des bases VM aux vraies compétences d’infrastructure",
    intro:
      "La virtualisation reste une partie centrale de l’infrastructure moderne. Avant le cloud, les conteneurs ou l’automatisation, il faut vraiment comprendre le fonctionnement des machines virtuelles, du stockage, des réseaux virtuels, des snapshots, des sauvegardes et de la récupération.",

    ctaPrimary: "Commencer avec le quiz VMware",
    ctaSecondary: "Voir les certifications Virtualisation",
    certCta: "Voir la certification",

    goalLabel: "Objectif :",
    practiceCta: "S’entraîner maintenant",

    levels: [
      {
        title: "🟢 Niveau 0 — Fondamentaux de la virtualisation",
        body:
          "Commencez par les vraies bases : rôle d’un hyperviseur, différence entre une VM et une machine physique, snapshots, réseaux virtuels et impact du stockage sur les performances. Cette étape semble moins attirante que le cloud, mais c’est là que commence la vraie compréhension infrastructure.",
        recommended: [
          "Bases hyperviseur",
          "VM vs serveur physique",
          "Snapshots et stockage",
          "Bases de networking virtuel",
        ],
        goal:
          "Comprendre le comportement réel d’un environnement virtualisé.",
        reality:
          "Beaucoup de débutants pensent que la virtualisation consiste seulement à 'faire tourner un ordinateur dans un autre'. En vraie infrastructure, l’allocation des ressources, le stockage, le réseau et la récupération comptent énormément.",
        mistakes: [
          "Penser que les snapshots sont des sauvegardes",
          "Ignorer les performances du stockage",
          "Allouer CPU et RAM au hasard",
          "Sauter les bases du networking virtuel",
        ],
        outcomes: [
          "Comprendre ce que fait réellement un hyperviseur",
          "Distinguer VM, hôte, stockage et couches réseau",
          "Se préparer à VMware ou Microsoft virtualization avec moins de lacunes",
        ],
      },
      {
        title: "🟡 Niveau 1 — Mentalité opérationnelle d’admin",
        body:
          "Vous passez maintenant aux opérations quotidiennes : provisioning des VM, templates, allocation correcte CPU/RAM, monitoring, sauvegardes et récupération après pannes courantes. Ici, vous cessez de connaître seulement les définitions et commencez à penser comme un admin.",
        recommended: [
          "Provisioning et templates",
          "Contrôles de performance et capacité",
          "Routines de backup et restore",
          "Monitoring de base",
        ],
        goal:
          "Maintenir un environnement de VM stable, récupérable et efficace.",
        reality:
          "Le vrai travail en virtualisation est souvent opérationnel. Vous ne créez pas seulement des VM : vous prévenez les interruptions, contrôlez les ressources et garantissez une récupération possible.",
        mistakes: [
          "Faire de l’overprovisioning sur chaque VM",
          "Oublier de tester backup et restore",
          "Ignorer le monitoring jusqu’au problème",
          "Traiter les templates comme optionnels plutôt que comme outils opérationnels",
        ],
        outcomes: [
          "Mieux gérer le cycle de vie des VM",
          "Comprendre les bases de capacité et performance",
          "Construire une mentalité admin pour de vrais environnements infrastructure",
        ],
      },
      {
        title: "🟠 Niveau 2 — Choisir la plateforme",
        body:
          "À ce stade, choisissez la plateforme la plus cohérente avec les rôles visés. VMware est très courant en environnement enterprise. La virtualisation Microsoft est souvent plus pertinente dans les contextes Windows et les entreprises centrées sur le stack Microsoft.",
        recommended: [
          "VMware Certified Professional",
          "Microsoft Virtualization",
        ],
        goal:
          "Apprendre les outils et la terminologie réellement attendus en entreprise.",
        reality:
          "La plateforme compte, mais les fondamentaux comptent davantage. Si vous comprenez bien les concepts de virtualisation, passer entre VMware, Hyper-V et environnements hybrid devient beaucoup plus simple.",
        mistakes: [
          "Étudier une plateforme sans comprendre les concepts derrière",
          "Ignorer le marché de l’emploi local",
          "Apprendre des clics de console sans penser architecture",
          "Éviter la pratique en laboratoire",
        ],
        outcomes: [
          "Choisir une voie plateforme avec plus de clarté",
          "Comprendre les attentes autour de VMware et Microsoft virtualization",
          "Se préparer à des rôles infrastructure ou systems admin",
        ],
        ctaQuizSlug: "vmware-certified-professional",
        ctaCertSlug: "vmware-certified-professional",
        ctaPrimaryText: "Commencer le quiz VMware",
        ctaSecondaryText: "Voir la certification VMware",
      },
      {
        title: "🔴 Niveau 3 — Automatisation, DR et hybride",
        body:
          "Quand la plateforme devient claire, passez au niveau supérieur : automatisation, logique de disaster recovery, approche hybrid et lien entre virtualisation, cloud migration, résilience et échelle opérationnelle. Là, la virtualisation cesse d’être seulement des VM et devient de l’ingénierie infrastructure.",
        recommended: [
          "Bases d’automatisation",
          "Mentalité disaster recovery",
          "Concepts d’infrastructure hybrid",
          "Bases de cloud migration",
        ],
        goal:
          "Gérer des environnements virtualisés avec plus d’échelle et moins de chaos.",
        reality:
          "Le travail infrastructure senior ne consiste pas à cliquer manuellement chaque tâche. Il consiste en répétabilité, recovery planning, monitoring, automatisation et réduction du risque opérationnel.",
        mistakes: [
          "Éviter complètement l’automatisation",
          "Avoir des plans de disaster recovery seulement sur le papier",
          "Ignorer les patterns hybrid cloud",
          "Penser que l’infrastructure engineering est seulement de l’administration plateforme",
        ],
        outcomes: [
          "Comprendre les logiques de disaster recovery et de résilience",
          "Relier virtualisation, cloud et infrastructure hybrid",
          "Se rapprocher de responsabilités infrastructure engineer",
        ],
        ctaQuizSlug: "microsoft-virtualization",
        ctaCertSlug: "microsoft-virtualization",
        ctaPrimaryText: "Commencer le quiz Microsoft virtualization",
        ctaSecondaryText: "Voir Microsoft virtualization",
      },
    ],

    salaryTitle: "💰 Salaires Virtualisation (2026)",
    salaryIntro:
      "La virtualisation apporte le plus de valeur lorsqu’elle est combinée avec infrastructure, dépannage, stratégie de sauvegarde, monitoring et automatisation. Les fourchettes dépendent beaucoup du pays et du rôle.",
    salaryRanges: [
      { label: "Junior", range: "$45k–$70k" },
      { label: "Mid-level", range: "$75k–$105k" },
      { label: "Senior / Infrastructure", range: "$115k+" },
    ],
    salaryDisclaimer:
      "La plus forte valeur arrive quand vous combinez virtualisation, opérations, fiabilité, disaster recovery et automatisation.",

    compareTitle:
      "🔍 VMware vs Microsoft virtualization — quel chemin a le plus de sens ?",
    compareIntro:
      "Les deux sont valides. Le meilleur choix dépend des environnements dans lesquels vous voulez travailler et du marché autour de vous.",
    compareLeftTitle: "VMware",
    compareRightTitle: "Microsoft Virtualization",
    compareRows: [
      {
        label: "Environnement typique",
        left: "Datacenters enterprise",
        right: "Infrastructures orientées Windows",
      },
      {
        label: "Point fort",
        left: "Écosystème mature et large adoption enterprise",
        right: "Forte intégration avec le stack Microsoft",
      },
      {
        label: "Meilleur choix si…",
        left: "Vous voulez plus de portabilité enterprise",
        right: "Vous ciblez des équipes très Windows",
      },
    ],
    compareRecommendationTitle: "Recommandation",
    compareRecommendationBody:
      "Si vous hésitez, commencez par les fondamentaux et les concepts VMware car ils sont très transférables. Si votre marché est très Microsoft, Microsoft virtualization peut être la voie pratique la plus rapide.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "La virtualisation vaut-elle encore le coup en 2026 ?",
        a: "Oui. Même avec cloud et conteneurs, la virtualisation reste essentielle dans beaucoup d’environnements enterprise, hybrid et infrastructure.",
      },
      {
        q: "Faut-il apprendre les VM avant les conteneurs ?",
        a: "Oui. Les VM donnent des bases infrastructure plus solides. Les conteneurs ont plus de sens après avoir compris systèmes, réseau et isolation des ressources.",
      },
      {
        q: "VMware reste-t-il utile ?",
        a: "Oui, surtout pour les rôles enterprise infrastructure. Il devient beaucoup plus utile avec des labs et une vraie capacité de troubleshooting.",
      },
      {
        q: "Comment obtenir de l’expérience pratique rapidement ?",
        a: "Montez un petit lab, créez des VM, testez les snapshots, simulez des pannes et pratiquez backup et restore.",
      },
    ],

    finalCtaTitle: "🚀 Commencez maintenant avec le parcours pratique",
    finalCtaBody:
      "Apprenez les fondamentaux des VM, pratiquez de vraies opérations puis choisissez une plateforme. Commencez avec un quiz et construisez à partir de là.",
  },
};