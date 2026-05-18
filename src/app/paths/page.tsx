import Link from "next/link";

const roadmapItems = [
  {
    title: "IT Fundamentals",
    desc: "Start from the basics and build solid foundations before choosing a specialization.",
    href: "/roadmap-fundamentals",
    icon: "🧱",
    badge: "FREE START",
    certs: ["IT Foundations", "Networking Foundations"],
    color: "from-orange-50 via-white to-white",
  },
  {
    title: "Cloud",
    desc: "Understand cloud fundamentals and move through AWS, Azure, Google Cloud and Kubernetes paths.",
    href: "/roadmap-cloud",
    icon: "☁️",
    badge: "CLOUD",
    certs: ["AWS CCP", "Azure", "Google Cloud", "Kubernetes"],
    color: "from-sky-50 via-white to-white",
  },
  {
    title: "Cybersecurity",
    desc: "Go from security fundamentals to certifications such as ISC2 CC, Security+ and CEH.",
    href: "/roadmap-cybersecurity",
    icon: "🔐",
    badge: "POPULAR",
    certs: ["ISC2 CC", "Security+", "CEH", "CISSP"],
    color: "from-rose-50 via-white to-white",
  },
  {
    title: "Networking",
    desc: "Learn networking concepts, protocols and troubleshooting in a more structured order.",
    href: "/roadmap-networking",
    icon: "🌐",
    badge: "BEGINNER",
    certs: ["CCST", "Network+", "CCNA"],
    color: "from-cyan-50 via-white to-white",
  },
  {
    title: "AI",
    desc: "Explore AI fundamentals, modern tools and certification-oriented learning paths.",
    href: "/roadmap-ai",
    icon: "🤖",
    badge: "TRENDING",
    certs: ["AI Foundations", "Azure AI", "AWS AI"],
    color: "from-violet-50 via-white to-white",
  },
  {
    title: "Database & Analytics",
    desc: "Build SQL, analytics and Power BI skills with practical and career-oriented certifications.",
    href: "/roadmap-data-analytics",
    icon: "📊",
    badge: "NEW",
    certs: ["DP-900", "PL-300", "SQL"],
    color: "from-emerald-50 via-white to-white",
  },
  {
    title: "Programming",
    desc: "Learn programming logic and modern development skills with practical learning paths.",
    href: "/roadmap-programming",
    icon: "💻",
    badge: "DEV",
    certs: ["Python", "C#", "JavaScript"],
    color: "from-indigo-50 via-white to-white",
  },
  {
    title: "Virtualization",
    desc: "Understand virtualization, infrastructure and modern cloud-native environments.",
    href: "/roadmap-virtualization",
    icon: "🖥️",
    badge: "INFRA",
    certs: ["VMware", "Cloud+", "Kubernetes"],
    color: "from-slate-100 via-white to-white",
  },

  {
    title: "Management",
    desc: "Project management, Agile and IT governance certifications for career growth.",
    href: "/roadmap-management",
    icon: "📋",
    badge: "CAREER",
    certs: ["PMP", "ITIL"],
    color: "from-amber-50 via-white to-white",
  },
];

export default function PathsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <header className="mb-10 max-w-4xl">
        <p className="text-sm font-extrabold uppercase tracking-wide text-blue-700">
          Paths
        </p>

        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950 md:text-5xl">
          Choose your IT learning path
        </h1>

        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">
          Not sure where to begin? Explore structured learning paths and follow
          certifications in a clearer and more realistic order.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/roadmap-fundamentals"
            className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700"
          >
            Start from fundamentals
          </Link>

          <Link
            href="/certifications"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 font-bold text-slate-800 transition hover:bg-slate-50"
          >
            Explore certifications
          </Link>
        </div>
      </header>

      <section className="mb-8 rounded-3xl border border-blue-100 bg-blue-50 p-5">
        <p className="text-sm font-extrabold uppercase tracking-wide text-blue-700">
          Recommended
        </p>

        <h2 className="mt-2 text-2xl font-extrabold text-slate-950">
          Start free with Foundations
        </h2>

        <p className="mt-2 max-w-3xl leading-relaxed text-slate-700">
          Foundations by CertifyQuiz are designed to help beginners build solid
          fundamentals before moving into official certifications.
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

            <p className="mt-3 leading-relaxed text-slate-600">
              {item.desc}
            </p>

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
              Open path →
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}