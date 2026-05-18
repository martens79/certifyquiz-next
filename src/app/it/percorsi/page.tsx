import Link from "next/link";

const roadmapItems = [
  {
    title: "Fundamentals",
    desc: "Il punto di partenza per iniziare da zero nel mondo IT: basi, logica, reti e sicurezza essenziale.",
    href: "/it/roadmap-fundamentals",
    icon: "🧱",
    badge: "FREE START",
    certs: ["IT Foundations", "Networking Foundations", "Security Basics"],
    color: "from-orange-50 via-white to-white",
  },
  {
    title: "Cloud",
    desc: "Un percorso ordinato tra cloud basics, AWS, Azure, Google Cloud, Kubernetes e operations.",
    href: "/it/roadmap-cloud",
    icon: "☁️",
    badge: "CLOUD",
    certs: ["AWS CCP", "Azure", "Google Cloud", "Kubernetes"],
    color: "from-sky-50 via-white to-white",
  },
  {
    title: "Cybersecurity",
    desc: "Dalle basi della sicurezza fino a ISC2 CC, Security+, CEH e percorsi più avanzati.",
    href: "/it/roadmap-cybersecurity",
    icon: "🔐",
    badge: "POPULAR",
    certs: ["ISC2 CC", "Security+", "CEH", "CISSP"],
    color: "from-rose-50 via-white to-white",
  },
  {
    title: "Networking",
    desc: "Reti, protocolli, troubleshooting e certificazioni come CCST, Network+ e CCNA.",
    href: "/it/roadmap-networking",
    icon: "🌐",
    badge: "BEGINNER",
    certs: ["CCST", "Network+", "CCNA"],
    color: "from-cyan-50 via-white to-white",
  },
  {
    title: "AI",
    desc: "AI Foundations, concetti chiave, strumenti moderni e certificazioni introduttive.",
    href: "/it/roadmap-ai",
    icon: "🤖",
    badge: "TRENDING",
    certs: ["AI Foundations", "Microsoft AI", "AWS AI"],
    color: "from-violet-50 via-white to-white",
  },
  {
    title: "Data & Analytics",
    desc: "SQL, Power BI, dashboard, KPI, analytics e prime certificazioni data.",
    href: "/it/roadmap-data-analytics",
    icon: "📊",
    badge: "NEW",
    certs: ["Data Foundations", "DP-900", "PL-300", "SQL"],
    color: "from-emerald-50 via-white to-white",
  },
  {
    title: "Management",
    desc: "Project management, ITIL, Agile, PMP e competenze per guidare progetti IT.",
    href: "/it/roadmap-management",
    icon: "📋",
    badge: "CAREER",
    certs: ["PM Foundations", "ITIL", "PMP"],
    color: "from-amber-50 via-white to-white",
  },
];

export default function PercorsiPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <header className="mb-10 max-w-4xl">
        <p className="text-sm font-extrabold uppercase tracking-wide text-blue-700">
          Percorsi
        </p>

        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950 md:text-5xl">
          Scegli il tuo percorso IT
        </h1>

        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">
          Non sai da dove iniziare? Qui trovi roadmap ordinate per obiettivo:
          parti dalle basi, scegli una direzione e segui le certificazioni nel
          giusto ordine.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/it/roadmap-fundamentals"
            className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700"
          >
            Inizia dalle basi
          </Link>

          <Link
            href="/it/certificazioni"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 font-bold text-slate-800 transition hover:bg-slate-50"
          >
            Vedi tutte le certificazioni
          </Link>
        </div>
      </header>

      <section className="mb-8 rounded-3xl border border-blue-100 bg-blue-50 p-5">
        <p className="text-sm font-extrabold uppercase tracking-wide text-blue-700">
          Consigliato
        </p>

        <h2 className="mt-2 text-2xl font-extrabold text-slate-950">
          Parti gratis con le Foundations
        </h2>

        <p className="mt-2 max-w-3xl leading-relaxed text-slate-700">
          Le certificazioni Foundations by CertifyQuiz sono pensate per
          costruire le basi prima di passare alle certificazioni ufficiali più
          avanzate.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {[
            "AI Foundations",
            "Cloud Foundations",
            "Cybersecurity Foundations",
            "Networking Foundations",
            "Data Analytics Foundations",
          ].map((x) => (
            <span
              key={x}
              className="rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-bold text-blue-800"
            >
              {x}
            </span>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {roadmapItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`group rounded-3xl border border-slate-200 bg-gradient-to-br ${item.color} p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="text-4xl">{item.icon}</div>

              <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-extrabold text-slate-700">
                {item.badge}
              </span>
            </div>

            <h2 className="mt-5 text-2xl font-extrabold text-slate-950">
              {item.title}
            </h2>

            <p className="mt-3 leading-relaxed text-slate-600">{item.desc}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              {item.certs.map((cert) => (
                <span
                  key={cert}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700"
                >
                  {cert}
                </span>
              ))}
            </div>

            <div className="mt-6 inline-flex items-center text-sm font-extrabold text-blue-700 transition group-hover:translate-x-1">
              Apri percorso →
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}