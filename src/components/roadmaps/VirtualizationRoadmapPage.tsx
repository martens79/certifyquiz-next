import Link from "next/link";

type Locale = "it" | "en" | "es" | "fr";

type VirtualizationQuizSlug =
  | "vmware-certified-professional"
  | "microsoft-virtualization";

type VirtualizationCertSlug = VirtualizationQuizSlug;

const quiz = (lang: Locale, slug: VirtualizationQuizSlug) =>
  `/${lang}/quiz/${slug}`;

const cert = (lang: Locale, slug: VirtualizationCertSlug) => {
  if (lang === "it") return `/it/certificazioni/${slug}`;
  if (lang === "fr") return `/fr/certifications/${slug}`;
  if (lang === "es") return `/es/certificaciones/${slug}`;
  return `/certifications/${slug}`;
};

export default function VirtualizationRoadmapPage({ lang }: { lang: Locale }) {
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
        <p className="mt-2 text-lg text-slate-600">{t.subtitle}</p>
        <p className="mt-5 text-slate-700 leading-relaxed">{t.intro}</p>

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
      ctaQuizSlug?: VirtualizationQuizSlug;
      ctaCertSlug?: VirtualizationCertSlug;
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
    title: "Virtualization Certification Roadmap 2026",
    subtitle: "From VM basics to real infrastructure skills",
    intro:
      "Virtualization is still a core part of modern infrastructure. Before cloud, before automation, you need to understand how virtual machines, storage, networking, snapshots, and recovery actually work. This roadmap helps you build practical virtualization skills and then choose a platform path.",

    ctaPrimary: "Start with VMware VCP quiz",
    ctaSecondary: "Browse virtualization certifications",
    certCta: "Explore certification",

    goalLabel: "Goal:",
    practiceCta: "Practice now",

    levels: [
      {
        title: "🟢 Level 0 — Virtualization fundamentals",
        body:
          "Start with the real basics: what a hypervisor does, how a VM differs from a physical machine, what snapshots are, how virtual networks work, and why storage performance matters. This step is less glamorous than cloud buzzwords, but it is where real understanding begins.",
        recommended: [
          "Hypervisor basics",
          "VM vs physical server",
          "Snapshots, storage, virtual networking",
        ],
        goal:
          "Understand how virtualized environments actually behave.",
      },
      {
        title: "🟡 Level 1 — Operational admin mindset",
        body:
          "Now move into day-to-day operations: provisioning virtual machines, using templates, allocating CPU and RAM properly, monitoring usage, handling backups, and recovering from common failures. This is the stage where you stop 'knowing definitions' and start thinking like an admin.",
        recommended: [
          "Provisioning & templates",
          "Performance and capacity checks",
          "Backup and restore routines",
        ],
        goal:
          "Keep a VM environment stable, recoverable, and efficient.",
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
        ctaQuizSlug: "vmware-certified-professional",
        ctaCertSlug: "vmware-certified-professional",
        ctaPrimaryText: "Start VMware quiz",
        ctaSecondaryText: "Explore VMware certification",
      },
      {
        title: "🔴 Level 3 — Automation, DR, and hybrid thinking",
        body:
          "Once your platform basics are stable, move into the higher-value layer: automation, disaster recovery logic, hybrid infrastructure thinking, and how virtualization connects to cloud migration, resilience, and operational scale. This is where virtualization stops being 'just VMs' and becomes infrastructure engineering.",
        recommended: [
          "Automation basics",
          "Disaster recovery mindset",
          "Hybrid infrastructure concepts",
        ],
        goal:
          "Operate virtualized environments with more scale and less chaos.",
        ctaQuizSlug: "microsoft-virtualization",
        ctaCertSlug: "microsoft-virtualization",
        ctaPrimaryText: "Start Microsoft virtualization quiz",
        ctaSecondaryText: "Explore Microsoft virtualization",
      },
    ],

    salaryTitle: "💰 Virtualization salary outlook (2026)",
    salaryIntro:
      "Virtualization usually pays best when it is combined with infrastructure, troubleshooting, backup strategy, and automation. Salary ranges vary a lot by country and role.",
    salaryRanges: [
      { label: "Junior", range: "$45k–$70k" },
      { label: "Mid-level", range: "$75k–$105k" },
      { label: "Senior / Infrastructure", range: "$115k+" },
    ],
    salaryDisclaimer:
      "The highest value comes when virtualization is combined with operations, reliability, and automation skills.",

    compareTitle: "🔍 VMware vs Microsoft virtualization — which path makes more sense?",
    compareIntro:
      "Both are valid. The better choice depends on the type of environments you want to work in.",
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
        left: "Mature ecosystem and tooling",
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
      "If you are unsure, start with VMware fundamentals because they transfer well. If your local market is very Microsoft-heavy, Microsoft virtualization can be the faster path.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "Is virtualization still worth learning in 2026?",
        a: "Yes. Even with cloud growth, virtualization remains fundamental in many enterprise and hybrid environments.",
      },
      {
        q: "Should I learn VMs before containers?",
        a: "Yes. Virtual machines give you stronger infrastructure foundations. Containers make more sense afterward.",
      },
      {
        q: "Is VMware still valuable?",
        a: "Yes, especially for enterprise roles, but it matters more when paired with hands-on lab work and troubleshooting ability.",
      },
      {
        q: "How do I get practical experience quickly?",
        a: "Build a small lab, create VMs, test snapshots, simulate failures, and practice backup and restore workflows.",
      },
    ],

    finalCtaTitle: "🚀 Start now (the practical way)",
    finalCtaBody:
      "Learn VM fundamentals, practice real operations, then choose a platform path. Start with a quiz and build from there.",
  },

  it: {
    title: "Roadmap Certificazioni Virtualizzazione 2026",
    subtitle: "Dalle basi VM a competenze infrastrutturali reali",
    intro:
      "La virtualizzazione è ancora una parte centrale dell'infrastruttura moderna. Prima del cloud, prima dell'automazione, devi capire davvero come funzionano macchine virtuali, storage, networking, snapshot e recovery. Questa roadmap ti aiuta a costruire competenze pratiche e poi a scegliere una piattaforma.",

    ctaPrimary: "Inizia con il quiz VMware",
    ctaSecondary: "Vedi le certificazioni Virtualizzazione",
    certCta: "Scopri certificazione",

    goalLabel: "Obiettivo:",
    practiceCta: "Allenati ora",

    levels: [
      {
        title: "🟢 Livello 0 — Fondamenta della virtualizzazione",
        body:
          "Parti dalle basi vere: cosa fa un hypervisor, in cosa una VM differisce da una macchina fisica, cosa sono gli snapshot, come funzionano le reti virtuali e perché lo storage incide così tanto sulle performance. Questa fase sembra meno 'cool' del cloud, ma è quella che crea comprensione reale.",
        recommended: [
          "Basi hypervisor",
          "VM vs server fisico",
          "Snapshot, storage e reti virtuali",
        ],
        goal:
          "Capire come si comporta davvero un ambiente virtualizzato.",
      },
      {
        title: "🟡 Livello 1 — Mentalità operativa da admin",
        body:
          "Ora entri nell'operatività: provisioning delle VM, uso dei template, allocazione corretta di CPU e RAM, controlli sulle performance, backup, restore e gestione dei guasti più comuni. Qui smetti di sapere solo le definizioni e inizi a ragionare da admin.",
        recommended: [
          "Provisioning e template",
          "Controlli di performance e capacity",
          "Routine di backup e restore",
        ],
        goal:
          "Mantenere un ambiente VM stabile, recuperabile ed efficiente.",
      },
      {
        title: "🟠 Livello 2 — Scegli la piattaforma",
        body:
          "A questo punto scegli la piattaforma più coerente con i ruoli che vuoi raggiungere. VMware è molto presente in ambienti enterprise. La virtualizzazione Microsoft è spesso più rilevante nei contesti Windows e nelle aziende già fortemente orientate allo stack Microsoft.",
        recommended: [
          "VMware Certified Professional",
          "Microsoft Virtualization",
        ],
        goal:
          "Imparare strumenti e terminologia che le aziende si aspettano davvero.",
        ctaQuizSlug: "vmware-certified-professional",
        ctaCertSlug: "vmware-certified-professional",
        ctaPrimaryText: "Inizia quiz VMware",
        ctaSecondaryText: "Scopri certificazione VMware",
      },
      {
        title: "🔴 Livello 3 — Automazione, DR e approccio hybrid",
        body:
          "Quando la piattaforma è chiara, sali di livello: automazione, logica di disaster recovery, approccio ibrido e connessione tra virtualizzazione, cloud migration, resilienza e scala operativa. Qui la virtualizzazione smette di essere 'solo VM' e diventa ingegneria infrastrutturale.",
        recommended: [
          "Basi di automazione",
          "Mentalità disaster recovery",
          "Concetti di infrastruttura ibrida",
        ],
        goal:
          "Gestire ambienti virtualizzati con più scala e meno caos.",
        ctaQuizSlug: "microsoft-virtualization",
        ctaCertSlug: "microsoft-virtualization",
        ctaPrimaryText: "Inizia quiz Microsoft virtualization",
        ctaSecondaryText: "Scopri Microsoft virtualization",
      },
    ],

    salaryTitle: "💰 Salary outlook Virtualizzazione (2026)",
    salaryIntro:
      "La virtualizzazione rende di più quando la unisci a infrastruttura, troubleshooting, backup strategy e automazione. I range dipendono molto da paese e ruolo.",
    salaryRanges: [
      { label: "Junior", range: "$45k–$70k" },
      { label: "Mid-level", range: "$75k–$105k" },
      { label: "Senior / Infrastructure", range: "$115k+" },
    ],
    salaryDisclaimer:
      "Il valore più alto arriva quando unisci virtualizzazione, operatività, affidabilità e automazione.",

    compareTitle: "🔍 VMware vs Microsoft virtualization — quale percorso ha più senso?",
    compareIntro:
      "Entrambi sono validi. La scelta migliore dipende dal tipo di ambienti in cui vuoi lavorare.",
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
        left: "Ecosistema maturo e tooling solido",
        right: "Forte integrazione con stack Microsoft",
      },
      {
        label: "Scelta migliore se…",
        left: "Vuoi più trasferibilità enterprise",
        right: "Miri a team Windows-heavy",
      },
    ],
    compareRecommendationTitle: "Consiglio pratico",
    compareRecommendationBody:
      "Se sei indeciso, parti da VMware perché le basi sono molto trasferibili. Se il tuo mercato locale è fortemente Microsoft, la virtualizzazione Microsoft può essere la strada più rapida.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "Vale ancora la pena studiare virtualizzazione nel 2026?",
        a: "Sì. Anche con la crescita del cloud, la virtualizzazione resta fondamentale in molti ambienti enterprise e ibridi.",
      },
      {
        q: "Meglio VM o container come primo passo?",
        a: "VM prima. Ti danno fondamenta infrastrutturali più solide. I container arrivano dopo.",
      },
      {
        q: "VMware è ancora valido?",
        a: "Sì, soprattutto in ruoli enterprise, ma conta molto di più se lo abbini a lab e troubleshooting reale.",
      },
      {
        q: "Come faccio pratica in fretta?",
        a: "Crea un piccolo lab, monta VM, prova snapshot, simula guasti e fai esercizi di backup e restore.",
      },
    ],

    finalCtaTitle: "🚀 Parti ora (in modo pratico)",
    finalCtaBody:
      "Impara i fondamentali delle VM, fai operazioni reali e poi scegli la piattaforma. Parti da un quiz e costruisci da lì.",
  },

  es: {
    title: "Ruta de Certificaciones de Virtualización 2026",
    subtitle: "De bases VM a habilidades reales de infraestructura",
    intro:
      "La virtualización sigue siendo una parte central de la infraestructura moderna. Antes del cloud y de la automatización, necesitas entender de verdad cómo funcionan las máquinas virtuales, el storage, las redes virtuales, los snapshots y la recuperación.",

    ctaPrimary: "Empezar con el quiz VMware",
    ctaSecondary: "Ver certificaciones de virtualización",
    certCta: "Ver certificación",

    goalLabel: "Objetivo:",
    practiceCta: "Practicar ahora",

    levels: [
      {
        title: "🟢 Nivel 0 — Fundamentos de virtualización",
        body:
          "Empieza por las bases reales: qué hace un hypervisor, en qué se diferencia una VM de un servidor físico, qué son los snapshots, cómo funcionan las redes virtuales y por qué el storage afecta tanto al rendimiento.",
        recommended: [
          "Bases de hypervisor",
          "VM vs servidor físico",
          "Snapshots, storage y redes virtuales",
        ],
        goal:
          "Entender cómo se comporta realmente un entorno virtualizado.",
      },
      {
        title: "🟡 Nivel 1 — Mentalidad operativa de admin",
        body:
          "Ahora pasas a la operación diaria: aprovisionamiento de VM, uso de templates, asignación correcta de CPU y RAM, control de rendimiento, backup, restore y fallos comunes. Aquí dejas de conocer solo definiciones y empiezas a pensar como admin.",
        recommended: [
          "Provisioning y templates",
          "Controles de rendimiento y capacidad",
          "Rutinas de backup y restore",
        ],
        goal:
          "Mantener un entorno de VM estable, recuperable y eficiente.",
      },
      {
        title: "🟠 Nivel 2 — Elige la plataforma",
        body:
          "En este punto eliges la plataforma que mejor encaje con los roles a los que apuntas. VMware es muy común en entornos enterprise. La virtualización Microsoft suele ser más relevante en contextos Windows y empresas centradas en el ecosistema Microsoft.",
        recommended: [
          "VMware Certified Professional",
          "Microsoft Virtualization",
        ],
        goal:
          "Aprender herramientas y terminología que realmente piden las empresas.",
        ctaQuizSlug: "vmware-certified-professional",
        ctaCertSlug: "vmware-certified-professional",
        ctaPrimaryText: "Empezar quiz VMware",
        ctaSecondaryText: "Ver certificación VMware",
      },
      {
        title: "🔴 Nivel 3 — Automatización, DR e híbrido",
        body:
          "Cuando ya domines la plataforma, subes de nivel: automatización, lógica de disaster recovery, enfoque híbrido y conexión entre virtualización, migración a cloud, resiliencia y escala operativa. Aquí la virtualización deja de ser 'solo VM' y se convierte en ingeniería de infraestructura.",
        recommended: [
          "Bases de automatización",
          "Mentalidad disaster recovery",
          "Conceptos de infraestructura híbrida",
        ],
        goal:
          "Gestionar entornos virtualizados con más escala y menos caos.",
        ctaQuizSlug: "microsoft-virtualization",
        ctaCertSlug: "microsoft-virtualization",
        ctaPrimaryText: "Empezar quiz Microsoft virtualization",
        ctaSecondaryText: "Ver Microsoft virtualization",
      },
    ],

    salaryTitle: "💰 Salary outlook Virtualización (2026)",
    salaryIntro:
      "La virtualización aporta más valor cuando se combina con infraestructura, troubleshooting, estrategia de backup y automatización. Los rangos dependen mucho del país y del rol.",
    salaryRanges: [
      { label: "Junior", range: "$45k–$70k" },
      { label: "Mid-level", range: "$75k–$105k" },
      { label: "Senior / Infrastructure", range: "$115k+" },
    ],
    salaryDisclaimer:
      "El mayor valor llega cuando unes virtualización, operaciones, fiabilidad y automatización.",

    compareTitle: "🔍 VMware vs Microsoft virtualization — ¿qué camino tiene más sentido?",
    compareIntro:
      "Ambos son válidos. La mejor elección depende del tipo de entornos en los que quieres trabajar.",
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
        left: "Ecosistema maduro y herramientas sólidas",
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
      "Si dudas, empieza por VMware porque sus bases son muy transferibles. Si tu mercado local es muy Microsoft, Microsoft virtualization puede ser el camino más rápido.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "¿Sigue valiendo la pena estudiar virtualización en 2026?",
        a: "Sí. Incluso con el crecimiento del cloud, la virtualización sigue siendo fundamental en muchos entornos enterprise e híbridos.",
      },
      {
        q: "¿Mejor VM o contenedores como primer paso?",
        a: "VM primero. Te dan fundamentos de infraestructura más sólidos. Los contenedores vienen después.",
      },
      {
        q: "¿VMware sigue siendo útil?",
        a: "Sí, especialmente en roles enterprise, pero vale mucho más si lo combinas con práctica real y troubleshooting.",
      },
      {
        q: "¿Cómo practico rápido?",
        a: "Monta un pequeño lab, crea VM, prueba snapshots, simula fallos y practica backup y restore.",
      },
    ],

    finalCtaTitle: "🚀 Empieza ahora (de forma práctica)",
    finalCtaBody:
      "Aprende los fundamentos de las VM, practica operaciones reales y luego elige plataforma. Empieza con un quiz y construye desde ahí.",
  },

  fr: {
    title: "Parcours Certifications Virtualisation 2026",
    subtitle: "Des bases VM aux vraies compétences d’infrastructure",
    intro:
      "La virtualisation reste une partie centrale de l’infrastructure moderne. Avant le cloud et l’automatisation, il faut vraiment comprendre le fonctionnement des machines virtuelles, du stockage, des réseaux virtuels, des snapshots et de la récupération.",

    ctaPrimary: "Commencer avec le quiz VMware",
    ctaSecondary: "Voir les certifications Virtualisation",
    certCta: "Voir la certification",

    goalLabel: "Objectif :",
    practiceCta: "S’entraîner",

    levels: [
      {
        title: "🟢 Niveau 0 — Fondamentaux de la virtualisation",
        body:
          "Commencez par les vraies bases : rôle d’un hyperviseur, différence entre une VM et un serveur physique, snapshots, réseaux virtuels et impact du stockage sur les performances.",
        recommended: [
          "Bases hyperviseur",
          "VM vs serveur physique",
          "Snapshots, stockage et réseaux virtuels",
        ],
        goal:
          "Comprendre le comportement réel d’un environnement virtualisé.",
      },
      {
        title: "🟡 Niveau 1 — Mentalité opérationnelle d’admin",
        body:
          "Vous passez ensuite aux opérations quotidiennes : provisioning des VM, templates, allocation CPU/RAM, contrôle des performances, backup, restore et pannes courantes. Ici, vous commencez à penser comme un admin.",
        recommended: [
          "Provisioning et templates",
          "Contrôles de performance et capacité",
          "Routines de backup et restore",
        ],
        goal:
          "Maintenir un environnement de VM stable, récupérable et efficace.",
      },
      {
        title: "🟠 Niveau 2 — Choisir la plateforme",
        body:
          "À ce stade, choisissez la plateforme la plus cohérente avec les rôles visés. VMware est très courant en environnement enterprise. La virtualisation Microsoft est souvent plus pertinente dans les contextes Windows.",
        recommended: [
          "VMware Certified Professional",
          "Microsoft Virtualization",
        ],
        goal:
          "Apprendre les outils et la terminologie réellement attendus en entreprise.",
        ctaQuizSlug: "vmware-certified-professional",
        ctaCertSlug: "vmware-certified-professional",
        ctaPrimaryText: "Commencer le quiz VMware",
        ctaSecondaryText: "Voir la certification VMware",
      },
      {
        title: "🔴 Niveau 3 — Automatisation, DR et hybride",
        body:
          "Quand la plateforme devient claire, passez au niveau supérieur : automatisation, logique de disaster recovery, approche hybride et lien entre virtualisation, migration cloud, résilience et échelle opérationnelle. Là, la virtualisation devient de l’ingénierie d’infrastructure.",
        recommended: [
          "Bases d’automatisation",
          "Mentalité disaster recovery",
          "Concepts d’infrastructure hybride",
        ],
        goal:
          "Gérer des environnements virtualisés avec plus d’échelle et moins de chaos.",
        ctaQuizSlug: "microsoft-virtualization",
        ctaCertSlug: "microsoft-virtualization",
        ctaPrimaryText: "Commencer le quiz Microsoft virtualization",
        ctaSecondaryText: "Voir Microsoft virtualization",
      },
    ],

    salaryTitle: "💰 Salary outlook Virtualisation (2026)",
    salaryIntro:
      "La virtualisation apporte le plus de valeur lorsqu’elle est combinée avec infrastructure, dépannage, stratégie de sauvegarde et automatisation. Les fourchettes dépendent beaucoup du pays et du rôle.",
    salaryRanges: [
      { label: "Junior", range: "$45k–$70k" },
      { label: "Mid-level", range: "$75k–$105k" },
      { label: "Senior / Infrastructure", range: "$115k+" },
    ],
    salaryDisclaimer:
      "La plus forte valeur arrive quand vous combinez virtualisation, opérations, fiabilité et automatisation.",

    compareTitle: "🔍 VMware vs Microsoft virtualization — quel chemin a le plus de sens ?",
    compareIntro:
      "Les deux sont valides. Le meilleur choix dépend du type d’environnements dans lesquels vous voulez travailler.",
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
        left: "Écosystème mature et outils solides",
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
      "Si vous hésitez, commencez par VMware car ses bases sont très transférables. Si votre marché local est très Microsoft, Microsoft virtualization peut être la voie la plus rapide.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "La virtualisation vaut-elle encore le coup en 2026 ?",
        a: "Oui. Même avec la croissance du cloud, elle reste essentielle dans beaucoup d’environnements enterprise et hybrides.",
      },
      {
        q: "VM ou conteneurs en premier ?",
        a: "VM d’abord. Elles donnent des bases d’infrastructure plus solides. Les conteneurs viennent ensuite.",
      },
      {
        q: "VMware reste-t-il utile ?",
        a: "Oui, surtout pour les rôles enterprise, mais cela vaut beaucoup plus si vous l’associez à de la vraie pratique et du dépannage.",
      },
      {
        q: "Comment pratiquer rapidement ?",
        a: "Montez un petit labo, créez des VM, testez les snapshots, simulez des pannes et pratiquez le backup/restore.",
      },
    ],

    finalCtaTitle: "🚀 Commencez maintenant (de façon pratique)",
    finalCtaBody:
      "Apprenez les bases des VM, pratiquez de vraies opérations puis choisissez une plateforme. Commencez avec un quiz et construisez à partir de là.",
  },
};