import Link from "next/link";

type Locale = "it" | "en" | "es" | "fr";

type RoadmapQuizSlug = string;
type RoadmapCertSlug = string;

export default function NetworkingRoadmapPage({
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

  const categoryNet =
    lang === "en"
      ? "/categories/networking"
      : lang === "it"
      ? "/it/categorie/reti"
      : lang === "es"
      ? "/es/categorias/redes"
      : "/fr/categories/reseaux";

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
            href={quiz("comptia-network-plus")}
            className="btn-primary"
          >
            {t.ctaPrimary}
          </Link>

          <Link
            href={categoryNet}
            className="btn-secondary"
          >
            {t.ctaSecondary}
          </Link>
        </div>
      </header>

      {/* ROADMAP */}
      <section className="space-y-6">
        {t.levels.map((lvl) => (
          <div key={lvl.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
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
                {lvl.ctaQuizSlug && (
                  <Link
                    href={quiz(lvl.ctaQuizSlug)}
                    className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800 transition"
                  >
                    {lvl.ctaPrimaryText ?? t.practiceCta}
                  </Link>
                )}

                {lvl.ctaCertSlug && (
                  <Link
                    href={cert(lvl.ctaCertSlug)}
                    className="text-sm font-medium text-blue-700 underline underline-offset-2 hover:text-blue-800"
                  >
                    {lvl.ctaSecondaryText ?? t.certCta}
                  </Link>
                )}
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
            <div key={r.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
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
                <th></th>
                <th className="font-bold">{t.compareLeftTitle}</th>
                <th className="font-bold">{t.compareRightTitle}</th>
              </tr>
            </thead>
            <tbody>
              {t.compareRows.map((row) => (
                <tr key={row.label}>
                  <td className="font-semibold">{row.label}</td>
                  <td>{row.left}</td>
                  <td>{row.right}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="font-semibold">{t.compareRecommendationTitle}</p>
          <p>{t.compareRecommendationBody}</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-10">
        <h2 className="text-2xl font-extrabold">{t.faqTitle}</h2>
        <div className="mt-4 space-y-4">
          {t.faq.map((f) => (
            <div key={f.q} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="font-bold text-slate-900">{f.q}</p>
              <p className="mt-2 text-slate-700 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mt-10 rounded-2xl border border-blue-200 bg-blue-50 p-5">
        <h2 className="text-xl font-extrabold text-slate-900">{t.finalCtaTitle}</h2>
        <p className="mt-2 text-slate-700">{t.finalCtaBody}</p>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link href={quiz("comptia-network-plus")} className="btn-primary">
            {t.ctaPrimary}
          </Link>

          <Link href={categoryNet} className="btn-secondary">
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
    title: "Networking Certification Roadmap 2026",
    subtitle: "From basic networking to real infrastructure skills",
    intro:
      "Networking is the foundation behind cloud, cybersecurity, systems, DevOps, and almost every modern IT role. This roadmap gives you a realistic path: first understand how networks work, then build troubleshooting skills, then move into CCNA-level operations and finally specialize.",

    ctaPrimary: "Start with Network+",
    ctaSecondary: "Browse Networking certifications",
    certCta: "Explore certification",

    goalLabel: "Goal:",
    practiceCta: "Practice now",

    levels: [
      {
        title: "🟢 Level 0 — No networking background",
        body:
          "Start by understanding what really happens when a device connects to the internet: IP addresses, DNS, gateway, Wi-Fi, cables, routers, and basic troubleshooting. Before memorizing protocols, you need to understand the daily logic of networks.",
        recommended: [
          "Basic IT concepts",
          "How home and office networks work",
          "IP, DNS, gateway, and Wi-Fi basics",
        ],
        goal:
          "Understand what is happening when a simple network connection fails.",
        reality:
          "Many beginners jump into CCNA too early and get buried in terminology. If you cannot explain IP, DNS, and gateway in simple words, advanced networking will feel painful.",
        mistakes: [
          "Starting directly with advanced routing",
          "Memorizing acronyms without real examples",
          "Ignoring basic troubleshooting",
          "Thinking Wi-Fi issues and network issues are always the same thing",
        ],
        outcomes: [
          "Understand basic network vocabulary",
          "Recognize common home and office network problems",
          "Prepare for Network+ or CCST Networking with fewer gaps",
        ],
      },
      {
        title: "🟡 Level 1 — Core networking fundamentals",
        body:
          "This is where the real foundation starts: IP addressing, subnetting, DNS, DHCP, routing, switching, ports, protocols, and network troubleshooting. Network+ and CCST Networking are good entry points because they build structure before deeper vendor-specific study.",
        recommended: ["CompTIA Network+", "Cisco CCST Networking"],
        goal:
          "Troubleshoot basic network issues with method instead of guessing.",
        reality:
          "This is the level most people rush, but it is also the level that decides everything. Weak fundamentals make CCNA, cybersecurity, and cloud networking much harder later.",
        mistakes: [
          "Skipping subnetting because it feels annoying",
          "Studying only definitions without packet-level logic",
          "Ignoring DNS and DHCP troubleshooting",
          "Moving to CCNA before the basics are stable",
        ],
        outcomes: [
          "Understand how devices communicate across networks",
          "Diagnose common connectivity problems",
          "Build a strong base for CCNA, cloud, and cybersecurity",
        ],
        ctaQuizSlug: "comptia-network-plus",
        ctaCertSlug: "comptia-network-plus",
        ctaPrimaryText: "Start Network+ quiz",
        ctaSecondaryText: "Explore Network+ certification",
      },
      {
        title: "🟠 Level 2 — Operational networking with CCNA",
        body:
          "CCNA is where networking becomes practical and operational. You move into VLANs, routing, switching, ACLs, NAT, wireless basics, troubleshooting, and real device configuration. This is the point where you stop only understanding networks and start working with them.",
        recommended: ["CCNA"],
        goal:
          "Become operational with real network configuration and troubleshooting.",
        reality:
          "CCNA is not just a theory exam. To get real value from it, you need labs, commands, mistakes, and repetition. Reading alone is not enough.",
        mistakes: [
          "Studying CCNA without lab practice",
          "Memorizing commands without understanding why they work",
          "Avoiding troubleshooting scenarios",
          "Underestimating VLANs, routing, and ACLs",
        ],
        outcomes: [
          "Configure and reason about real network scenarios",
          "Prepare for junior network or infrastructure roles",
          "Build practical confidence with Cisco-style networking",
        ],
        ctaQuizSlug: "ccna",
        ctaCertSlug: "ccna",
        ctaPrimaryText: "Start CCNA quiz",
        ctaSecondaryText: "Explore CCNA certification",
      },
      {
        title: "🔴 Level 3 — Enterprise networking specialization",
        body:
          "After CCNA-level skills, you can specialize. Enterprise routing, switching, SD-WAN, automation, load balancing, and advanced troubleshooting become more important. This is where paths like CCNP, Juniper, and F5 start making sense.",
        recommended: [
          "CCNP Enterprise",
          "Juniper JNCIE",
          "F5 load balancing",
          "Network automation basics",
        ],
        goal:
          "Move from general networking knowledge to specialist-level infrastructure skills.",
        reality:
          "Specialization only works if the foundation is already strong. Advanced certifications do not fix weak fundamentals; they expose them.",
        mistakes: [
          "Chasing advanced certs without real network experience",
          "Ignoring automation and modern enterprise patterns",
          "Studying vendor commands without architecture thinking",
          "Avoiding complex troubleshooting",
        ],
        outcomes: [
          "Understand enterprise networking at a deeper level",
          "Prepare for specialist or senior infrastructure paths",
          "Increase value in cloud, security, and enterprise environments",
        ],
        ctaQuizSlug: "ccnp-enterprise",
        ctaCertSlug: "ccnp-enterprise",
        ctaPrimaryText: "Start CCNP Enterprise quiz",
        ctaSecondaryText: "Explore CCNP Enterprise certification",
      },
    ],

    salaryTitle: "💰 Networking salary outlook (2026)",
    salaryIntro:
      "Networking salaries vary by country, company, and experience. The strongest growth usually comes from combining troubleshooting, routing/switching, cloud networking, and security awareness.",
    salaryRanges: [
      { label: "Entry-level", range: "$40k–$65k" },
      { label: "Mid-level", range: "$70k–$100k" },
      { label: "Senior / Specialist", range: "$110k+" },
    ],
    salaryDisclaimer:
      "Certifications help, but real progress comes from labs, troubleshooting practice, and hands-on experience.",

    compareTitle: "🔍 Network+ vs CCNA — which one first?",
    compareIntro:
      "Network+ and CCNA are useful at different stages. The mistake is jumping into CCNA before your basic networking logic is ready.",
    compareLeftTitle: "Network+",
    compareRightTitle: "CCNA",
    compareRows: [
      {
        label: "Best for",
        left: "Core networking foundations",
        right: "Operational Cisco-style networking",
      },
      {
        label: "Difficulty",
        left: "Beginner to intermediate",
        right: "Intermediate with hands-on practice",
      },
      {
        label: "Best timing",
        left: "Early in the path",
        right: "After fundamentals are solid",
      },
    ],
    compareRecommendationTitle: "Recommendation",
    compareRecommendationBody:
      "Start with Network+ or CCST Networking if your foundations are weak. Move to CCNA when you are ready for configuration, labs, and real troubleshooting.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "Is networking still important in 2026?",
        a: "Yes. Cloud, cybersecurity, DevOps, systems, and infrastructure all depend on networking fundamentals.",
      },
      {
        q: "Can I skip Network+ and go straight to CCNA?",
        a: "Yes, but only if you already understand IP, subnetting, DNS, DHCP, routing, switching, and basic troubleshooting.",
      },
      {
        q: "Do I need labs for networking?",
        a: "Absolutely. Networking becomes real only when you practice configuration and troubleshooting.",
      },
      {
        q: "What should I study after CCNA?",
        a: "Choose a direction: CCNP Enterprise, cloud networking, security, automation, Juniper, or load balancing.",
      },
    ],

    finalCtaTitle: "🚀 Start now with the practical path",
    finalCtaBody:
      "Do not jump randomly between certifications. Build foundations with Network+, practice consistently, then move into CCNA and specialization.",
  },

  it: {
    title: "Roadmap Certificazioni Networking 2026",
    subtitle: "Dalle basi di rete a competenze infrastrutturali reali",
    intro:
      "Il networking è la base di cloud, cybersecurity, sistemi, DevOps e quasi ogni ruolo IT moderno. Questa roadmap ti dà un percorso realistico: prima capisci come funzionano le reti, poi sviluppi troubleshooting, poi passi al livello operativo CCNA e infine scegli una specializzazione.",

    ctaPrimary: "Inizia con Network+",
    ctaSecondary: "Vedi le certificazioni Networking",
    certCta: "Scopri certificazione",

    goalLabel: "Obiettivo:",
    practiceCta: "Allenati ora",

    levels: [
      {
        title: "🟢 Livello 0 — Nessuna base networking",
        body:
          "Parti da cosa succede davvero quando un dispositivo si collega a internet: indirizzi IP, DNS, gateway, Wi-Fi, cavi, router e troubleshooting base. Prima di memorizzare protocolli, devi capire la logica quotidiana delle reti.",
        recommended: [
          "Concetti IT di base",
          "Come funzionano reti domestiche e aziendali",
          "Basi di IP, DNS, gateway e Wi-Fi",
        ],
        goal:
          "Capire cosa succede quando una connessione di rete semplice non funziona.",
        reality:
          "Molti principianti saltano troppo presto su CCNA e si perdono nella terminologia. Se non sai spiegare IP, DNS e gateway in parole semplici, il networking avanzato sarà pesante.",
        mistakes: [
          "Partire direttamente dal routing avanzato",
          "Memorizzare acronimi senza esempi reali",
          "Ignorare il troubleshooting base",
          "Pensare che problemi Wi-Fi e problemi di rete siano sempre la stessa cosa",
        ],
        outcomes: [
          "Comprendere il vocabolario base delle reti",
          "Riconoscere problemi comuni in reti domestiche e aziendali",
          "Prepararti a Network+ o CCST Networking con meno lacune",
        ],
      },
      {
        title: "🟡 Livello 1 — Fondamenta networking reali",
        body:
          "Qui inizia la base vera: IP addressing, subnetting, DNS, DHCP, routing, switching, porte, protocolli e troubleshooting. Network+ e CCST Networking sono ottimi punti di ingresso perché danno struttura prima dello studio vendor-specific.",
        recommended: ["CompTIA Network+", "Cisco CCST Networking"],
        goal:
          "Risolvere problemi di rete base con metodo, non andando a tentativi.",
        reality:
          "Questo è il livello che molti vogliono saltare, ma è quello che decide tutto. Fondamenta deboli rendono più difficili CCNA, cybersecurity e cloud networking.",
        mistakes: [
          "Saltare il subnetting perché sembra fastidioso",
          "Studiare solo definizioni senza logica dei pacchetti",
          "Ignorare troubleshooting DNS e DHCP",
          "Passare a CCNA prima che le basi siano solide",
        ],
        outcomes: [
          "Capire come comunicano i dispositivi in rete",
          "Diagnosticare problemi comuni di connettività",
          "Costruire una base forte per CCNA, cloud e cybersecurity",
        ],
        ctaQuizSlug: "comptia-network-plus",
        ctaCertSlug: "comptia-network-plus",
        ctaPrimaryText: "Inizia il quiz Network+",
        ctaSecondaryText: "Scopri Network+",
      },
      {
        title: "🟠 Livello 2 — Networking operativo con CCNA",
        body:
          "CCNA è il punto in cui il networking diventa pratico e operativo. Entri in VLAN, routing, switching, ACL, NAT, wireless base, troubleshooting e configurazioni reali. Qui smetti solo di capire le reti e inizi a lavorarci davvero.",
        recommended: ["CCNA"],
        goal:
          "Diventare operativo con configurazioni e troubleshooting di rete reali.",
        reality:
          "CCNA non è solo teoria. Per ottenere valore reale servono lab, comandi, errori e ripetizione. Leggere soltanto non basta.",
        mistakes: [
          "Studiare CCNA senza laboratori",
          "Memorizzare comandi senza capire perché funzionano",
          "Evitare scenari di troubleshooting",
          "Sottovalutare VLAN, routing e ACL",
        ],
        outcomes: [
          "Configurare e ragionare su scenari di rete reali",
          "Prepararti a ruoli junior network o infrastructure",
          "Costruire sicurezza pratica nel networking stile Cisco",
        ],
        ctaQuizSlug: "ccna",
        ctaCertSlug: "ccna",
        ctaPrimaryText: "Inizia il quiz CCNA",
        ctaSecondaryText: "Scopri CCNA",
      },
      {
        title: "🔴 Livello 3 — Specializzazione networking enterprise",
        body:
          "Dopo competenze da livello CCNA puoi specializzarti. Routing enterprise, switching avanzato, SD-WAN, automazione, load balancing e troubleshooting complesso diventano più importanti. Qui iniziano ad avere senso percorsi come CCNP, Juniper e F5.",
        recommended: [
          "CCNP Enterprise",
          "Juniper JNCIE",
          "F5 load balancing",
          "Basi di network automation",
        ],
        goal:
          "Passare da conoscenze networking generali a competenze infrastrutturali specialistiche.",
        reality:
          "La specializzazione funziona solo se la base è già forte. Le certificazioni avanzate non correggono fondamenta deboli: le mettono in evidenza.",
        mistakes: [
          "Inseguire certificazioni avanzate senza esperienza reale",
          "Ignorare automazione e pattern enterprise moderni",
          "Studiare comandi vendor senza ragionare sull’architettura",
          "Evitare troubleshooting complesso",
        ],
        outcomes: [
          "Comprendere il networking enterprise a un livello più profondo",
          "Prepararti a percorsi specialistici o senior infrastructure",
          "Aumentare valore in ambienti cloud, security ed enterprise",
        ],
        ctaQuizSlug: "ccnp-enterprise",
        ctaCertSlug: "ccnp-enterprise",
        ctaPrimaryText: "Inizia il quiz CCNP Enterprise",
        ctaSecondaryText: "Scopri CCNP Enterprise",
      },
    ],

    salaryTitle: "💰 Stipendi Networking (2026)",
    salaryIntro:
      "Gli stipendi nel networking cambiano molto in base a paese, azienda ed esperienza. La crescita più forte arriva combinando troubleshooting, routing/switching, cloud networking e mentalità security.",
    salaryRanges: [
      { label: "Entry-level", range: "$40k–$65k" },
      { label: "Mid-level", range: "$70k–$100k" },
      { label: "Senior / Specialist", range: "$110k+" },
    ],
    salaryDisclaimer:
      "Le certificazioni aiutano, ma il salto reale arriva con laboratori, troubleshooting e pratica concreta.",

    compareTitle: "🔍 Network+ vs CCNA — cosa fare prima?",
    compareIntro:
      "Network+ e CCNA servono in momenti diversi. L’errore è buttarsi su CCNA quando la logica networking di base non è ancora stabile.",
    compareLeftTitle: "Network+",
    compareRightTitle: "CCNA",
    compareRows: [
      {
        label: "Ideale per",
        left: "Fondamenta networking",
        right: "Networking operativo stile Cisco",
      },
      {
        label: "Difficoltà",
        left: "Base → intermedio",
        right: "Intermedio con molta pratica",
      },
      {
        label: "Quando farla",
        left: "All’inizio del percorso",
        right: "Dopo fondamenta solide",
      },
    ],
    compareRecommendationTitle: "Consiglio",
    compareRecommendationBody:
      "Parti da Network+ o CCST Networking se le basi sono deboli. Passa a CCNA quando sei pronto per configurazioni, lab e troubleshooting reale.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "Il networking è ancora importante nel 2026?",
        a: "Sì. Cloud, cybersecurity, DevOps, sistemi e infrastruttura dipendono tutti dalle fondamenta networking.",
      },
      {
        q: "Posso saltare Network+ e andare subito su CCNA?",
        a: "Sì, ma solo se conosci già IP, subnetting, DNS, DHCP, routing, switching e troubleshooting base.",
      },
      {
        q: "Servono laboratori per imparare networking?",
        a: "Assolutamente sì. Il networking diventa reale quando configuri, rompi, sistemi e fai troubleshooting.",
      },
      {
        q: "Cosa studio dopo CCNA?",
        a: "Scegli una direzione: CCNP Enterprise, cloud networking, security, automazione, Juniper o load balancing.",
      },
    ],

    finalCtaTitle: "🚀 Parti ora con il percorso pratico",
    finalCtaBody:
      "Non saltare a caso tra certificazioni. Costruisci fondamenta con Network+, pratica con costanza, poi passa a CCNA e alla specializzazione.",
  },

  es: {
    title: "Ruta de Certificaciones Networking 2026",
    subtitle: "De fundamentos de red a habilidades reales de infraestructura",
    intro:
      "El networking es la base de cloud, ciberseguridad, sistemas, DevOps y casi cualquier rol IT moderno. Esta ruta te da un camino realista: primero entender cómo funcionan las redes, luego desarrollar troubleshooting, después pasar al nivel operativo de CCNA y finalmente especializarte.",

    ctaPrimary: "Empieza con Network+",
    ctaSecondary: "Ver certificaciones Networking",
    certCta: "Ver certificación",

    goalLabel: "Objetivo:",
    practiceCta: "Practicar ahora",

    levels: [
      {
        title: "🟢 Nivel 0 — Sin base networking",
        body:
          "Empieza entendiendo qué ocurre realmente cuando un dispositivo se conecta a internet: direcciones IP, DNS, gateway, Wi-Fi, cables, routers y troubleshooting básico. Antes de memorizar protocolos, debes entender la lógica diaria de las redes.",
        recommended: [
          "Conceptos IT básicos",
          "Cómo funcionan redes domésticas y de oficina",
          "Bases de IP, DNS, gateway y Wi-Fi",
        ],
        goal:
          "Entender qué ocurre cuando una conexión de red simple falla.",
        reality:
          "Muchos principiantes saltan demasiado pronto a CCNA y se pierden en terminología. Si no puedes explicar IP, DNS y gateway con palabras simples, el networking avanzado será pesado.",
        mistakes: [
          "Empezar directamente con routing avanzado",
          "Memorizar acrónimos sin ejemplos reales",
          "Ignorar troubleshooting básico",
          "Pensar que problemas Wi-Fi y problemas de red siempre son lo mismo",
        ],
        outcomes: [
          "Comprender vocabulario básico de redes",
          "Reconocer problemas comunes en redes domésticas y de oficina",
          "Prepararte para Network+ o CCST Networking con menos vacíos",
        ],
      },
      {
        title: "🟡 Nivel 1 — Fundamentos reales de networking",
        body:
          "Aquí empieza la base real: IP addressing, subnetting, DNS, DHCP, routing, switching, puertos, protocolos y troubleshooting. Network+ y CCST Networking son buenos puntos de entrada porque dan estructura antes del estudio específico de un proveedor.",
        recommended: ["CompTIA Network+", "Cisco CCST Networking"],
        goal:
          "Resolver problemas básicos de red con método, no por intuición.",
        reality:
          "Este es el nivel que muchos quieren saltar, pero es el que decide todo. Fundamentos débiles hacen mucho más difíciles CCNA, ciberseguridad y cloud networking.",
        mistakes: [
          "Saltar subnetting porque parece molesto",
          "Estudiar solo definiciones sin lógica de paquetes",
          "Ignorar troubleshooting de DNS y DHCP",
          "Pasar a CCNA antes de tener bases estables",
        ],
        outcomes: [
          "Entender cómo se comunican los dispositivos en red",
          "Diagnosticar problemas comunes de conectividad",
          "Construir una base sólida para CCNA, cloud y ciberseguridad",
        ],
        ctaQuizSlug: "comptia-network-plus",
        ctaCertSlug: "comptia-network-plus",
        ctaPrimaryText: "Empezar quiz Network+",
        ctaSecondaryText: "Ver Network+",
      },
      {
        title: "🟠 Nivel 2 — Networking operativo con CCNA",
        body:
          "CCNA es donde el networking se vuelve práctico y operativo. Entras en VLANs, routing, switching, ACLs, NAT, wireless básico, troubleshooting y configuración real. Aquí dejas de solo entender redes y empiezas a trabajar con ellas.",
        recommended: ["CCNA"],
        goal:
          "Ser operativo con configuración y troubleshooting real de redes.",
        reality:
          "CCNA no es solo teoría. Para sacarle valor necesitas labs, comandos, errores y repetición. Leer solamente no basta.",
        mistakes: [
          "Estudiar CCNA sin laboratorios",
          "Memorizar comandos sin entender por qué funcionan",
          "Evitar escenarios de troubleshooting",
          "Subestimar VLANs, routing y ACLs",
        ],
        outcomes: [
          "Configurar y razonar sobre escenarios reales de red",
          "Prepararte para roles junior network o infrastructure",
          "Construir confianza práctica con networking estilo Cisco",
        ],
        ctaQuizSlug: "ccna",
        ctaCertSlug: "ccna",
        ctaPrimaryText: "Empezar quiz CCNA",
        ctaSecondaryText: "Ver CCNA",
      },
      {
        title: "🔴 Nivel 3 — Especialización networking enterprise",
        body:
          "Después de habilidades nivel CCNA puedes especializarte. Routing enterprise, switching avanzado, SD-WAN, automatización, load balancing y troubleshooting complejo se vuelven más importantes. Aquí empiezan a tener sentido caminos como CCNP, Juniper y F5.",
        recommended: [
          "CCNP Enterprise",
          "Juniper JNCIE",
          "F5 load balancing",
          "Bases de network automation",
        ],
        goal:
          "Pasar de conocimiento general de redes a habilidades especializadas de infraestructura.",
        reality:
          "La especialización solo funciona si la base ya es fuerte. Las certificaciones avanzadas no arreglan fundamentos débiles: los exponen.",
        mistakes: [
          "Perseguir certificaciones avanzadas sin experiencia real",
          "Ignorar automatización y patrones enterprise modernos",
          "Estudiar comandos de proveedor sin pensar en arquitectura",
          "Evitar troubleshooting complejo",
        ],
        outcomes: [
          "Comprender networking enterprise a un nivel más profundo",
          "Prepararte para caminos specialist o senior infrastructure",
          "Aumentar valor en entornos cloud, security y enterprise",
        ],
        ctaQuizSlug: "ccnp-enterprise",
        ctaCertSlug: "ccnp-enterprise",
        ctaPrimaryText: "Empezar quiz CCNP Enterprise",
        ctaSecondaryText: "Ver CCNP Enterprise",
      },
    ],

    salaryTitle: "💰 Salarios Networking (2026)",
    salaryIntro:
      "Los salarios en networking cambian mucho según país, empresa y experiencia. El mayor crecimiento suele venir de combinar troubleshooting, routing/switching, cloud networking y mentalidad security.",
    salaryRanges: [
      { label: "Entry-level", range: "$40k–$65k" },
      { label: "Mid-level", range: "$70k–$100k" },
      { label: "Senior / Specialist", range: "$110k+" },
    ],
    salaryDisclaimer:
      "Las certificaciones ayudan, pero el avance real llega con laboratorios, troubleshooting y práctica concreta.",

    compareTitle: "🔍 Network+ vs CCNA — ¿qué hacer primero?",
    compareIntro:
      "Network+ y CCNA sirven en momentos distintos. El error es lanzarse a CCNA cuando la lógica básica de redes aún no está estable.",
    compareLeftTitle: "Network+",
    compareRightTitle: "CCNA",
    compareRows: [
      {
        label: "Ideal para",
        left: "Fundamentos de networking",
        right: "Networking operativo estilo Cisco",
      },
      {
        label: "Dificultad",
        left: "Básico → intermedio",
        right: "Intermedio con mucha práctica",
      },
      {
        label: "Cuándo hacerla",
        left: "Al inicio del camino",
        right: "Después de fundamentos sólidos",
      },
    ],
    compareRecommendationTitle: "Recomendación",
    compareRecommendationBody:
      "Empieza con Network+ o CCST Networking si tus bases son débiles. Pasa a CCNA cuando estés listo para configuraciones, labs y troubleshooting real.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "¿El networking sigue siendo importante en 2026?",
        a: "Sí. Cloud, ciberseguridad, DevOps, sistemas e infraestructura dependen de fundamentos de networking.",
      },
      {
        q: "¿Puedo saltar Network+ e ir directo a CCNA?",
        a: "Sí, pero solo si ya entiendes IP, subnetting, DNS, DHCP, routing, switching y troubleshooting básico.",
      },
      {
        q: "¿Necesito laboratorios para aprender networking?",
        a: "Totalmente. El networking se vuelve real cuando configuras, rompes, reparas y haces troubleshooting.",
      },
      {
        q: "¿Qué estudio después de CCNA?",
        a: "Elige una dirección: CCNP Enterprise, cloud networking, security, automatización, Juniper o load balancing.",
      },
    ],

    finalCtaTitle: "🚀 Empieza ahora con el camino práctico",
    finalCtaBody:
      "No saltes al azar entre certificaciones. Construye fundamentos con Network+, practica con constancia, luego pasa a CCNA y a la especialización.",
  },

  fr: {
    title: "Parcours Certifications Networking 2026",
    subtitle: "Des bases réseau aux vraies compétences infrastructure",
    intro:
      "Le networking est la base du cloud, de la cybersécurité, des systèmes, du DevOps et de presque tous les rôles IT modernes. Ce parcours vous donne une voie réaliste : comprendre d’abord comment fonctionnent les réseaux, développer le troubleshooting, passer ensuite au niveau opérationnel CCNA, puis vous spécialiser.",

    ctaPrimary: "Commencer avec Network+",
    ctaSecondary: "Voir les certifications Networking",
    certCta: "Voir la certification",

    goalLabel: "Objectif :",
    practiceCta: "S’entraîner maintenant",

    levels: [
      {
        title: "🟢 Niveau 0 — Aucune base networking",
        body:
          "Commencez par comprendre ce qui se passe réellement lorsqu’un appareil se connecte à internet : adresses IP, DNS, passerelle, Wi-Fi, câbles, routeurs et dépannage de base. Avant de mémoriser des protocoles, vous devez comprendre la logique quotidienne des réseaux.",
        recommended: [
          "Concepts IT de base",
          "Fonctionnement des réseaux domestiques et professionnels",
          "Bases IP, DNS, passerelle et Wi-Fi",
        ],
        goal:
          "Comprendre ce qui se passe lorsqu’une connexion réseau simple échoue.",
        reality:
          "Beaucoup de débutants passent trop vite à CCNA et se perdent dans la terminologie. Si vous ne pouvez pas expliquer IP, DNS et passerelle simplement, le networking avancé sera difficile.",
        mistakes: [
          "Commencer directement par le routage avancé",
          "Mémoriser des acronymes sans exemples réels",
          "Ignorer le dépannage de base",
          "Penser que les problèmes Wi-Fi et réseau sont toujours identiques",
        ],
        outcomes: [
          "Comprendre le vocabulaire réseau de base",
          "Reconnaître les problèmes courants des réseaux domestiques et professionnels",
          "Se préparer à Network+ ou CCST Networking avec moins de lacunes",
        ],
      },
      {
        title: "🟡 Niveau 1 — Fondamentaux networking réels",
        body:
          "C’est ici que commence la vraie base : adressage IP, subnetting, DNS, DHCP, routage, switching, ports, protocoles et dépannage. Network+ et CCST Networking sont de bons points d’entrée car ils donnent une structure avant l’étude spécifique à un fournisseur.",
        recommended: ["CompTIA Network+", "Cisco CCST Networking"],
        goal:
          "Résoudre des problèmes réseau de base avec méthode, pas au hasard.",
        reality:
          "C’est le niveau que beaucoup veulent sauter, mais c’est celui qui décide de tout. Des bases faibles rendent CCNA, cybersécurité et cloud networking beaucoup plus difficiles.",
        mistakes: [
          "Sauter le subnetting parce qu’il semble pénible",
          "Étudier seulement des définitions sans logique des paquets",
          "Ignorer le dépannage DNS et DHCP",
          "Passer à CCNA avant que les bases soient stables",
        ],
        outcomes: [
          "Comprendre comment les appareils communiquent sur un réseau",
          "Diagnostiquer les problèmes courants de connectivité",
          "Construire une base solide pour CCNA, cloud et cybersécurité",
        ],
        ctaQuizSlug: "comptia-network-plus",
        ctaCertSlug: "comptia-network-plus",
        ctaPrimaryText: "Commencer le quiz Network+",
        ctaSecondaryText: "Voir Network+",
      },
      {
        title: "🟠 Niveau 2 — Networking opérationnel avec CCNA",
        body:
          "CCNA est le moment où le networking devient pratique et opérationnel. Vous entrez dans les VLANs, le routage, le switching, les ACL, le NAT, les bases wireless, le troubleshooting et la configuration réelle. Ici, vous ne faites plus que comprendre les réseaux : vous commencez à travailler avec eux.",
        recommended: ["CCNA"],
        goal:
          "Devenir opérationnel avec la configuration et le dépannage réseau réels.",
        reality:
          "CCNA n’est pas seulement théorique. Pour en tirer une vraie valeur, il faut des labs, des commandes, des erreurs et de la répétition. Lire ne suffit pas.",
        mistakes: [
          "Étudier CCNA sans laboratoires",
          "Mémoriser des commandes sans comprendre pourquoi elles fonctionnent",
          "Éviter les scénarios de troubleshooting",
          "Sous-estimer VLANs, routage et ACL",
        ],
        outcomes: [
          "Configurer et raisonner sur des scénarios réseau réels",
          "Se préparer à des rôles junior network ou infrastructure",
          "Construire une confiance pratique avec le networking type Cisco",
        ],
        ctaQuizSlug: "ccna",
        ctaCertSlug: "ccna",
        ctaPrimaryText: "Commencer le quiz CCNA",
        ctaSecondaryText: "Voir CCNA",
      },
      {
        title: "🔴 Niveau 3 — Spécialisation networking enterprise",
        body:
          "Après les compétences de niveau CCNA, vous pouvez vous spécialiser. Routage enterprise, switching avancé, SD-WAN, automatisation, load balancing et troubleshooting complexe deviennent plus importants. C’est ici que des parcours comme CCNP, Juniper et F5 prennent du sens.",
        recommended: [
          "CCNP Enterprise",
          "Juniper JNCIE",
          "F5 load balancing",
          "Bases de network automation",
        ],
        goal:
          "Passer d’une connaissance réseau générale à des compétences infrastructure spécialisées.",
        reality:
          "La spécialisation fonctionne seulement si la base est déjà forte. Les certifications avancées ne corrigent pas des fondamentaux faibles : elles les exposent.",
        mistakes: [
          "Poursuivre des certifications avancées sans expérience réelle",
          "Ignorer l’automatisation et les patterns enterprise modernes",
          "Étudier des commandes fournisseur sans pensée architecture",
          "Éviter le troubleshooting complexe",
        ],
        outcomes: [
          "Comprendre le networking enterprise à un niveau plus profond",
          "Se préparer à des parcours specialist ou senior infrastructure",
          "Augmenter sa valeur en cloud, sécurité et environnements enterprise",
        ],
        ctaQuizSlug: "ccnp-enterprise",
        ctaCertSlug: "ccnp-enterprise",
        ctaPrimaryText: "Commencer le quiz CCNP Enterprise",
        ctaSecondaryText: "Voir CCNP Enterprise",
      },
    ],

    salaryTitle: "💰 Salaires Networking (2026)",
    salaryIntro:
      "Les salaires en networking varient beaucoup selon le pays, l’entreprise et l’expérience. La plus forte progression vient souvent de la combinaison troubleshooting, routing/switching, cloud networking et culture sécurité.",
    salaryRanges: [
      { label: "Entry-level", range: "$40k–$65k" },
      { label: "Mid-level", range: "$70k–$100k" },
      { label: "Senior / Specialist", range: "$110k+" },
    ],
    salaryDisclaimer:
      "Les certifications aident, mais la vraie progression vient des labs, du troubleshooting et de la pratique concrète.",

    compareTitle: "🔍 Network+ vs CCNA — que faire d’abord ?",
    compareIntro:
      "Network+ et CCNA servent à des moments différents. L’erreur est de se lancer dans CCNA lorsque la logique réseau de base n’est pas encore stable.",
    compareLeftTitle: "Network+",
    compareRightTitle: "CCNA",
    compareRows: [
      {
        label: "Idéal pour",
        left: "Fondamentaux networking",
        right: "Networking opérationnel type Cisco",
      },
      {
        label: "Difficulté",
        left: "Débutant → intermédiaire",
        right: "Intermédiaire avec beaucoup de pratique",
      },
      {
        label: "Quand la passer",
        left: "Au début du parcours",
        right: "Après des bases solides",
      },
    ],
    compareRecommendationTitle: "Recommandation",
    compareRecommendationBody:
      "Commencez par Network+ ou CCST Networking si vos bases sont faibles. Passez à CCNA lorsque vous êtes prêt pour la configuration, les labs et le troubleshooting réel.",

    faqTitle: "FAQ",
    faq: [
      {
        q: "Le networking est-il encore important en 2026 ?",
        a: "Oui. Cloud, cybersécurité, DevOps, systèmes et infrastructure dépendent tous des fondamentaux networking.",
      },
      {
        q: "Puis-je sauter Network+ et aller directement vers CCNA ?",
        a: "Oui, mais seulement si vous comprenez déjà IP, subnetting, DNS, DHCP, routage, switching et dépannage de base.",
      },
      {
        q: "Faut-il des laboratoires pour apprendre le networking ?",
        a: "Absolument. Le networking devient réel quand vous configurez, cassez, réparez et faites du troubleshooting.",
      },
      {
        q: "Que dois-je étudier après CCNA ?",
        a: "Choisissez une direction : CCNP Enterprise, cloud networking, sécurité, automatisation, Juniper ou load balancing.",
      },
    ],

    finalCtaTitle: "🚀 Commencez maintenant avec le parcours pratique",
    finalCtaBody:
      "Ne sautez pas au hasard entre les certifications. Construisez vos bases avec Network+, pratiquez régulièrement, puis passez à CCNA et à la spécialisation.",
  },
};