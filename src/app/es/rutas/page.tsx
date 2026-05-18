import Link from "next/link";

const roadmapItems = [
  {
    title: "Fundamentos IT",
    desc: "Empieza desde cero y construye bases sólidas antes de elegir una especialización.",
    href: "/es/roadmap-fundamentals",
    icon: "🧱",
    badge: "INICIO GRATIS",
    certs: ["IT Foundations", "Networking Foundations"],
    color: "from-orange-50 via-white to-white",
  },
  {
    title: "Cloud",
    desc: "Comprende los fundamentos cloud y avanza por AWS, Azure, Google Cloud y Kubernetes.",
    href: "/es/roadmap-cloud",
    icon: "☁️",
    badge: "CLOUD",
    certs: ["AWS CCP", "Azure", "Google Cloud", "Kubernetes"],
    color: "from-sky-50 via-white to-white",
  },
  {
    title: "Ciberseguridad",
    desc: "Pasa de los fundamentos de seguridad a certificaciones como ISC2 CC, Security+ y CEH.",
    href: "/es/roadmap-cybersecurity",
    icon: "🔐",
    badge: "POPULAR",
    certs: ["ISC2 CC", "Security+", "CEH", "CISSP"],
    color: "from-rose-50 via-white to-white",
  },
  {
    title: "Redes",
    desc: "Aprende redes, protocolos y troubleshooting en un orden más claro y práctico.",
    href: "/es/roadmap-networking",
    icon: "🌐",
    badge: "BEGINNER",
    certs: ["CCST", "Network+", "CCNA"],
    color: "from-cyan-50 via-white to-white",
  },
  {
    title: "IA",
    desc: "Explora fundamentos de IA, herramientas modernas y rutas orientadas a certificaciones.",
    href: "/es/roadmap-ai",
    icon: "🤖",
    badge: "TRENDING",
    certs: ["AI Foundations", "Azure AI", "AWS AI"],
    color: "from-violet-50 via-white to-white",
  },
  {
    title: "Datos y Analítica",
    desc: "Construye habilidades en SQL, Power BI, dashboards, KPI y análisis de datos.",
    href: "/es/roadmap-data-analytics",
    icon: "📊",
    badge: "NUEVO",
    certs: ["DP-900", "PL-300", "SQL"],
    color: "from-emerald-50 via-white to-white",
  },
  {
    title: "Programación",
    desc: "Aprende lógica de programación y habilidades modernas de desarrollo paso a paso.",
    href: "/es/roadmap-programming",
    icon: "💻",
    badge: "DEV",
    certs: ["Python", "C#", "JavaScript"],
    color: "from-indigo-50 via-white to-white",
  },
  {
    title: "Virtualización",
    desc: "Comprende virtualización, infraestructura y entornos modernos cloud-native.",
    href: "/es/roadmap-virtualization",
    icon: "🖥️",
    badge: "INFRA",
    certs: ["VMware", "Cloud+", "Kubernetes"],
    color: "from-slate-100 via-white to-white",
  },
  {
    title: "Management",
    desc: "Project management, Agile e IT governance para crecer hacia roles de coordinación y liderazgo.",
    href: "/es/roadmap-management",
    icon: "📋",
    badge: "CAREER",
    certs: ["PMP", "ITIL"],
    color: "from-amber-50 via-white to-white",
  },
];

export default function RutasPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <header className="mb-10 max-w-4xl">
        <p className="text-sm font-extrabold uppercase tracking-wide text-blue-700">
          Rutas
        </p>

        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950 md:text-5xl">
          Elige tu ruta IT
        </h1>

        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">
          ¿No sabes por dónde empezar? Explora rutas estructuradas y sigue las
          certificaciones en un orden más claro, realista y orientado a objetivos.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/es/roadmap-fundamentals"
            className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700"
          >
            Empezar por los fundamentos
          </Link>

          <Link
            href="/es/certificaciones"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 font-bold text-slate-800 transition hover:bg-slate-50"
          >
            Ver certificaciones
          </Link>
        </div>
      </header>

      <section className="mb-8 rounded-3xl border border-blue-100 bg-blue-50 p-5">
        <p className="text-sm font-extrabold uppercase tracking-wide text-blue-700">
          Recomendado
        </p>

        <h2 className="mt-2 text-2xl font-extrabold text-slate-950">
          Empieza gratis con Foundations
        </h2>

        <p className="mt-2 max-w-3xl leading-relaxed text-slate-700">
          Las Foundations by CertifyQuiz están pensadas para construir bases
          sólidas antes de pasar a certificaciones oficiales más avanzadas.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {[
            "AI Foundations",
            "Cloud Foundations",
            "Cybersecurity Foundations",
            "Networking Foundations",
            "Data Foundations",
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
              Abrir ruta →
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}