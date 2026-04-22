import Link from "next/link";

const roadmapItems = [
  {
    title: "Cloud",
    desc: "Una ruta práctica para comprender los fundamentos del cloud y orientarte entre AWS, Azure y Google Cloud.",
    href: "/es/roadmap-cloud",
    icon: "☁️",
  },
  {
    title: "Ciberseguridad",
    desc: "Empieza por los fundamentos de seguridad y avanza hacia certificaciones como Security+, CEH y otros objetivos más avanzados.",
    href: "/es/roadmap-cybersecurity",
    icon: "🔐",
  },
  {
    title: "Redes",
    desc: "Aprende bases de redes, protocolos y conceptos clave en un orden más claro hacia certificaciones como CCNA.",
    href: "/es/roadmap-networking",
    icon: "🌐",
  },
  {
    title: "IA",
    desc: "Una ruta introductoria para comprender fundamentos de IA, herramientas y direcciones de certificación útiles.",
    href: "/es/roadmap-ai",
    icon: "🤖",
  },
  {
    title: "Bases de datos",
    desc: "Construye una base sólida sobre bases de datos y explora rutas más técnicas y orientadas al trabajo.",
    href: "/es/roadmap-databases",
    icon: "🗄️",
  },
  {
    title: "Programación",
    desc: "Empieza por la lógica de programación y construye una ruta más sólida alrededor de lenguajes modernos y habilidades prácticas.",
    href: "/es/roadmap-programming",
    icon: "💻",
  },
  {
    title: "Virtualización",
    desc: "Explora tecnologías de virtualización y cómo se conectan con infraestructuras modernas y entornos cloud.",
    href: "/es/roadmap-virtualization",
    icon: "🧱",
  },
  {
    title: "Fundamentos IT",
    desc: "Un gran punto de partida si quieres construir conocimientos sólidos antes de elegir una especialización.",
    href: "/es/roadmap-fundamentals",
    icon: "🧠",
  },
];

export default function RutasPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8 md:py-10">
      <header className="max-w-3xl mb-8">
        <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">
          Rutas
        </p>

        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2">
          Elige tu ruta IT
        </h1>

        <p className="text-slate-600 mt-3 text-base">
          ¿No sabes por dónde empezar? Aquí encontrarás rutas estructuradas para
          entender qué certificaciones estudiar, en qué orden abordarlas y qué
          cuestionarios usar para practicar mejor.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roadmapItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition"
          >
            <div className="text-3xl mb-3">{item.icon}</div>

            <h2 className="text-xl font-bold text-slate-900">{item.title}</h2>

            <p className="text-sm text-slate-600 mt-2 leading-6">
              {item.desc}
            </p>

            <div className="mt-4 text-sm font-semibold text-blue-600">
              Abrir ruta →
            </div>
          </Link>
        ))}
      </section>

      <section className="mt-10 rounded-2xl border border-blue-200 bg-blue-50 p-5 md:p-6">
        <h2 className="text-xl font-bold text-slate-900">
          ¿Quieres ir directamente a los cuestionarios?
        </h2>

        <p className="text-slate-600 mt-2">
          Si prefieres empezar directamente con la práctica, explora las
          certificaciones disponibles y entrena con cuestionarios realistas.
        </p>

        <div className="mt-4">
          <Link
            href="/es/quiz-home"
            className="inline-flex items-center rounded-xl bg-blue-600 px-5 py-3 text-white font-semibold hover:bg-blue-700 transition"
          >
            Explorar cuestionarios
          </Link>
        </div>
      </section>
    </main>
  );
}