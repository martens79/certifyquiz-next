import Link from "next/link";

const roadmapItems = [
  {
    title: "Fondamentaux IT",
    desc: "Commencez depuis zéro et construisez des bases solides avant de choisir une spécialisation.",
    href: "/fr/roadmap-fundamentals",
    icon: "🧱",
    badge: "DÉPART GRATUIT",
    certs: ["IT Foundations", "Networking Foundations"],
    color: "from-orange-50 via-white to-white",
  },
  {
    title: "Cloud",
    desc: "Comprenez les fondamentaux du cloud et progressez à travers AWS, Azure, Google Cloud et Kubernetes.",
    href: "/fr/roadmap-cloud",
    icon: "☁️",
    badge: "CLOUD",
    certs: ["AWS CCP", "Azure", "Google Cloud", "Kubernetes"],
    color: "from-sky-50 via-white to-white",
  },
  {
    title: "Cybersécurité",
    desc: "Passez des bases de la sécurité aux certifications comme ISC2 CC, Security+ et CEH.",
    href: "/fr/roadmap-cybersecurity",
    icon: "🔐",
    badge: "POPULAIRE",
    certs: ["ISC2 CC", "Security+", "CEH", "CISSP"],
    color: "from-rose-50 via-white to-white",
  },
  {
    title: "Réseaux",
    desc: "Apprenez les réseaux, protocoles et techniques de troubleshooting dans un ordre plus clair.",
    href: "/fr/roadmap-networking",
    icon: "🌐",
    badge: "DÉBUTANT",
    certs: ["CCST", "Network+", "CCNA"],
    color: "from-cyan-50 via-white to-white",
  },
  {
    title: "IA",
    desc: "Découvrez les fondamentaux de l’IA, les outils modernes et les parcours orientés certifications.",
    href: "/fr/roadmap-ai",
    icon: "🤖",
    badge: "TRENDING",
    certs: ["AI Foundations", "Azure AI", "AWS AI"],
    color: "from-violet-50 via-white to-white",
  },
  {
    title: "Data & Analytics",
    desc: "Développez des compétences en SQL, Power BI, KPI, dashboards et analyse de données.",
    href: "/fr/roadmap-data-analytics",
    icon: "📊",
    badge: "NOUVEAU",
    certs: ["DP-900", "PL-300", "SQL"],
    color: "from-emerald-50 via-white to-white",
  },
  {
    title: "Programmation",
    desc: "Apprenez la logique de programmation et les compétences modernes de développement étape par étape.",
    href: "/fr/roadmap-programming",
    icon: "💻",
    badge: "DEV",
    certs: ["Python", "C#", "JavaScript"],
    color: "from-indigo-50 via-white to-white",
  },
  {
    title: "Virtualisation",
    desc: "Comprenez la virtualisation, l’infrastructure et les environnements cloud-native modernes.",
    href: "/fr/roadmap-virtualization",
    icon: "🖥️",
    badge: "INFRA",
    certs: ["VMware", "Cloud+", "Kubernetes"],
    color: "from-slate-100 via-white to-white",
  },
  {
    title: "Management",
    desc: "Project management, Agile et gouvernance IT pour évoluer vers des rôles de coordination et leadership.",
    href: "/fr/roadmap-management",
    icon: "📋",
    badge: "CAREER",
    certs: ["PMP", "ITIL"],
    color: "from-amber-50 via-white to-white",
  },
];

export default function ParcoursPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <header className="mb-10 max-w-4xl">
        <p className="text-sm font-extrabold uppercase tracking-wide text-blue-700">
          Parcours
        </p>

        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950 md:text-5xl">
          Choisissez votre parcours IT
        </h1>

        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">
          Vous ne savez pas par où commencer ? Explorez des parcours structurés
          et suivez les certifications dans un ordre plus clair, réaliste et
          orienté carrière.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/fr/roadmap-fundamentals"
            className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700"
          >
            Commencer par les fondamentaux
          </Link>

          <Link
            href="/fr/certifications"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 font-bold text-slate-800 transition hover:bg-slate-50"
          >
            Voir les certifications
          </Link>
        </div>
      </header>

      <section className="mb-8 rounded-3xl border border-blue-100 bg-blue-50 p-5">
        <p className="text-sm font-extrabold uppercase tracking-wide text-blue-700">
          Recommandé
        </p>

        <h2 className="mt-2 text-2xl font-extrabold text-slate-950">
          Commencez gratuitement avec les Foundations
        </h2>

        <p className="mt-2 max-w-3xl leading-relaxed text-slate-700">
          Les Foundations by CertifyQuiz sont conçues pour construire des bases
          solides avant de passer aux certifications officielles plus avancées.
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
              Ouvrir le parcours →
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}