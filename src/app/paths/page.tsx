import Link from "next/link";

const roadmapItems = [
  {
    title: "Cloud",
    desc: "A practical path to understand cloud fundamentals and navigate AWS, Azure and Google Cloud certifications.",
    href: "/roadmap-cloud",
    icon: "☁️",
  },
  {
    title: "Cybersecurity",
    desc: "Start from security fundamentals and move toward certifications like Security+, CEH and more advanced goals.",
    href: "/roadmap-cybersecurity",
    icon: "🔐",
  },
  {
    title: "Networking",
    desc: "Learn networking basics, protocols and concepts in a clearer order toward certifications such as CCNA.",
    href: "/roadmap-networking",
    icon: "🌐",
  },
  {
    title: "AI",
    desc: "An introductory path to understand AI fundamentals, tools and useful certification directions.",
    href: "/roadmap-ai",
    icon: "🤖",
  },
  {
    title: "Database",
    desc: "Build a solid understanding of databases and explore more job-oriented and technical certification paths.",
    href: "/roadmap-databases",
    icon: "🗄️",
  },
  {
    title: "Programming",
    desc: "Start from programming logic and build a stronger path around modern languages and practical skills.",
    href: "/roadmap-programming",
    icon: "💻",
  },
  {
    title: "Virtualization",
    desc: "Explore virtualization technologies and how they connect with modern infrastructure and cloud environments.",
    href: "/roadmap-virtualization",
    icon: "🧱",
  },
  {
    title: "IT Fundamentals",
    desc: "A strong starting point if you want to build core knowledge before choosing a specialization.",
    href: "/roadmap-fundamentals",
    icon: "🧠",
  },
];

export default function PathsPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8 md:py-10">
      <header className="max-w-3xl mb-8">
        <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">
          Paths
        </p>

        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2">
          Choose your IT learning path
        </h1>

        <p className="text-slate-600 mt-3 text-base">
          Not sure where to start? Here you can find structured paths to help
          you understand which certifications to study, in what order to approach
          them and which quizzes to use for practice.
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
              Open path →
            </div>
          </Link>
        ))}
      </section>

      <section className="mt-10 rounded-2xl border border-blue-200 bg-blue-50 p-5 md:p-6">
        <h2 className="text-xl font-bold text-slate-900">
          Want to jump straight into quizzes?
        </h2>

        <p className="text-slate-600 mt-2">
          If you prefer to start with practice right away, explore the available
          certifications and train with realistic quizzes.
        </p>

        <div className="mt-4">
          <Link
            href="/quiz-home"
            className="inline-flex items-center rounded-xl bg-blue-600 px-5 py-3 text-white font-semibold hover:bg-blue-700 transition"
          >
            Explore quizzes
          </Link>
        </div>
      </section>
    </main>
  );
}