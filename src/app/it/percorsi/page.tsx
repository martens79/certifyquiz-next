import Link from "next/link";

const roadmapItems = [
  {
    title: "Fundamentals",
    desc: "Il punto di partenza perfetto per iniziare da zero nel mondo IT.",
    href: "/it/roadmap-fundamentals",
    icon: "🧱",
  },
  {
    title: "Cloud",
    desc: "Un percorso per orientarti tra basi cloud, AWS, Azure e Google Cloud.",
    href: "/it/roadmap-cloud",
    icon: "☁️",
  },
  {
    title: "Cybersecurity",
    desc: "Dalle basi della sicurezza fino a Security+, CEH e percorsi più avanzati.",
    href: "/it/roadmap-cybersecurity",
    icon: "🔐",
  },
  {
    title: "Networking",
    desc: "Reti, protocolli e certificazioni come CCNA in un ordine più chiaro.",
    href: "/it/roadmap-networking",
    icon: "🌐",
  },
  {
    title: "AI",
    desc: "Un percorso introduttivo per capire AI, strumenti e certificazioni utili.",
    href: "/it/roadmap-ai",
    icon: "🤖",
  },
];

export default function PercorsiPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8 md:py-10">
      <header className="max-w-3xl mb-8">
        <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">
          Percorsi
        </p>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2">
          Scegli il tuo percorso IT
        </h1>
        <p className="text-slate-600 mt-3">
          Qui trovi una raccolta ordinata dei percorsi disponibili per capire da dove partire
          e quali certificazioni seguire in base ai tuoi obiettivi.
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
            <p className="text-sm text-slate-600 mt-2">{item.desc}</p>
            <div className="mt-4 text-sm font-semibold text-blue-600">
              Apri percorso →
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}