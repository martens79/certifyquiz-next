import Link from "next/link";

type Lang = "it" | "en" | "fr" | "es";

type Props = {
  lang: Lang;
};

const pathBase = {
  it: "/it/percorsi",
  en: "/paths",
  fr: "/fr/parcours",
  es: "/es/rutas",
};

const content = {
  it: {
    eyebrow: "🎯 PERCORSI GUIDATI",
    title: "Non sai quale porta aprire per prima?",
    subtitle:
      "Scegli l'area verso cui vuoi muoverti — cybersecurity, cloud, networking, dati o programmazione — e segui un percorso che ti dice quale certificazione viene prima, e perché.",
    cta: "Vedi tutti i percorsi",
    items: [
      { label: "Cybersecurity", href: "/it/roadmap-cybersecurity" },
      { label: "Cloud", href: "/it/roadmap-cloud" },
      { label: "Networking", href: "/it/roadmap-networking" },
      { label: "AI", href: "/it/roadmap-ai" },
    ],
    go: "Vai al percorso",
  },
  en: {
    eyebrow: "🎯 GUIDED PATHS",
    title: "Don't know which door to open first?",
    subtitle:
      "Pick the area you want to move toward — cybersecurity, cloud, networking, data or programming — and follow a path that says which certification comes first, and why.",
    cta: "Explore all paths",
    items: [
      { label: "Cybersecurity", href: "/roadmap-cybersecurity" },
      { label: "Cloud", href: "/roadmap-cloud" },
      { label: "Networking", href: "/roadmap-networking" },
      { label: "AI", href: "/roadmap-ai" },
    ],
    go: "View path",
  },
  fr: {
    eyebrow: "🎯 PARCOURS GUIDÉS",
    title: "Vous ne savez pas quelle porte ouvrir en premier ?",
    subtitle:
      "Choisissez le domaine vers lequel vous voulez aller — cybersécurité, cloud, réseaux, données ou programmation — et suivez un parcours qui vous dit quelle certification vient en premier, et pourquoi.",
    cta: "Voir tous les parcours",
    items: [
      { label: "Cybersécurité", href: "/fr/roadmap-cybersecurity" },
      { label: "Cloud", href: "/fr/roadmap-cloud" },
      { label: "Réseaux", href: "/fr/roadmap-networking" },
      { label: "IA", href: "/fr/roadmap-ai" },
    ],
    go: "Voir le parcours",
  },
  es: {
    eyebrow: "🎯 RUTAS GUIADAS",
    title: "¿No sabes qué puerta abrir primero?",
    subtitle:
      "Elige el área hacia la que quieres moverte — ciberseguridad, cloud, redes, datos o programación — y sigue una ruta que te dice qué certificación va primero, y por qué.",
    cta: "Ver todas las rutas",
    items: [
      { label: "Cybersecurity", href: "/es/roadmap-cybersecurity" },
      { label: "Cloud", href: "/es/roadmap-cloud" },
      { label: "Networking", href: "/es/roadmap-networking" },
      { label: "IA", href: "/es/roadmap-ai" },
    ],
    go: "Ver ruta",
  },
};

export default function PathBox({ lang }: Props) {
  const t = content[lang] ?? content.en;

  return (
    <section className="mx-auto mt-8 w-full max-w-5xl rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 shadow-sm">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-blue-700">
            {t.eyebrow}
          </p>

          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
            {t.title}
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-700 md:text-base">
            {t.subtitle}
          </p>
        </div>

        <Link
          href={pathBase[lang]}
          className="inline-flex shrink-0 items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700"
        >
          {t.cta} →
        </Link>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {t.items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
          >
            <div className="font-bold text-slate-900">{item.label}</div>
            <div className="mt-2 text-xs font-semibold text-blue-600">
              → {t.go}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}