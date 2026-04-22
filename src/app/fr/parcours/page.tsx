import Link from "next/link";

const roadmapItems = [
  {
    title: "Cloud",
    desc: "Un parcours pratique pour comprendre les bases du cloud et s’orienter entre AWS, Azure et Google Cloud.",
    href: "/fr/roadmap-cloud",
    icon: "☁️",
  },
  {
    title: "Cybersécurité",
    desc: "Commencez par les fondamentaux de la sécurité et progressez vers des certifications comme Security+, CEH et d’autres objectifs avancés.",
    href: "/fr/roadmap-cybersecurity",
    icon: "🔐",
  },
  {
    title: "Réseaux",
    desc: "Apprenez les bases des réseaux, les protocoles et les concepts clés dans un ordre plus clair vers des certifications comme le CCNA.",
    href: "/fr/roadmap-networking",
    icon: "🌐",
  },
  {
    title: "IA",
    desc: "Un parcours d’introduction pour comprendre les bases de l’IA, les outils et les certifications utiles.",
    href: "/fr/roadmap-ai",
    icon: "🤖",
  },
  {
    title: "Bases de données",
    desc: "Construisez une base solide sur les bases de données et explorez des parcours plus techniques et orientés métier.",
    href: "/fr/roadmap-databases",
    icon: "🗄️",
  },
  {
    title: "Programmation",
    desc: "Commencez par la logique de programmation et développez un parcours plus solide autour des langages modernes et des compétences pratiques.",
    href: "/fr/roadmap-programming",
    icon: "💻",
  },
  {
    title: "Virtualisation",
    desc: "Découvrez les technologies de virtualisation et leur lien avec les infrastructures modernes et le cloud.",
    href: "/fr/roadmap-virtualization",
    icon: "🧱",
  },
  {
    title: "Fondamentaux IT",
    desc: "Un excellent point de départ pour construire des bases solides avant de choisir une spécialisation.",
    href: "/fr/roadmap-fundamentals",
    icon: "🧠",
  },
];

export default function ParcoursPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8 md:py-10">
      <header className="max-w-3xl mb-8">
        <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">
          Parcours
        </p>

        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2">
          Choisissez votre parcours IT
        </h1>

        <p className="text-slate-600 mt-3 text-base">
          Vous ne savez pas par où commencer ? Vous trouverez ici des parcours
          structurés pour comprendre quelles certifications étudier, dans quel
          ordre les aborder et quels quiz utiliser pour mieux vous entraîner.
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
              Ouvrir le parcours →
            </div>
          </Link>
        ))}
      </section>

      <section className="mt-10 rounded-2xl border border-blue-200 bg-blue-50 p-5 md:p-6">
        <h2 className="text-xl font-bold text-slate-900">
          Vous voulez passer directement aux quiz ?
        </h2>

        <p className="text-slate-600 mt-2">
          Si vous préférez commencer immédiatement par la pratique, explorez les
          certifications disponibles et entraînez-vous avec des quiz réalistes.
        </p>

        <div className="mt-4">
          <Link
            href="/fr/quiz-home"
            className="inline-flex items-center rounded-xl bg-blue-600 px-5 py-3 text-white font-semibold hover:bg-blue-700 transition"
          >
            Explorer les quiz
          </Link>
        </div>
      </section>
    </main>
  );
}