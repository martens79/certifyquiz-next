import Link from "next/link";
import { getTopicReviewsList, type Locale } from "@/lib/data";

const labels = {
  it: {
    title: "Ripassi rapidi",
    subtitle:
      "Rivedi i concetti principali prima di affrontare un quiz o una simulazione d’esame.",
    available: "ripassi disponibili",
    open: "Apri",
    empty: "Nessun ripasso disponibile al momento.",
  },
  en: {
    title: "Quick reviews",
    subtitle: "Review the key concepts before taking a quiz or a mock exam.",
    available: "available reviews",
    open: "Open",
    empty: "No reviews available yet.",
  },
  fr: {
    title: "Révisions rapides",
    subtitle:
      "Révisez les concepts clés avant de passer un quiz ou un examen blanc.",
    available: "révisions disponibles",
    open: "Ouvrir",
    empty: "Aucune révision disponible pour le moment.",
  },
  es: {
    title: "Repasos rápidos",
    subtitle:
      "Repasa los conceptos clave antes de hacer un quiz o una simulación de examen.",
    available: "repasos disponibles",
    open: "Abrir",
    empty: "No hay repasos disponibles por el momento.",
  },
};

type Props = {
  lang: Locale;
};

function cleanReviewTitle(title: string, certTitle: string) {
  return title
    .replace(/^Ripasso rapido:\s*/i, "")
    .replace(/^Quick review:\s*/i, "")
    .replace(/^Révision rapide\s*:\s*/i, "")
    .replace(/^Repaso rápido:\s*/i, "")
    .replace(new RegExp(`\\s*[–-]\\s*${certTitle}$`, "i"), "")
    .trim();
}

function certAccent(index: number) {
  const styles = [
    "border-blue-200 bg-gradient-to-br from-blue-50 to-white",
    "border-emerald-200 bg-gradient-to-br from-emerald-50 to-white",
    "border-violet-200 bg-gradient-to-br from-violet-50 to-white",
    "border-amber-200 bg-gradient-to-br from-amber-50 to-white",
  ];

  return styles[index % styles.length];
}

export default async function ReviewsIndexPage({ lang }: Props) {
  const t = labels[lang];
  const reviews = await getTopicReviewsList(lang);

  const grouped = reviews.reduce<Record<string, typeof reviews>>((acc, item) => {
    if (!acc[item.certificationTitle]) acc[item.certificationTitle] = [];
    acc[item.certificationTitle].push(item);
    return acc;
  }, {});

  const groups = Object.entries(grouped);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:py-10">
      <section className="overflow-hidden rounded-3xl bg-slate-950 px-6 py-9 text-white shadow-sm md:px-10 md:py-12">
        <div className="max-w-3xl">
          <p className="mb-3 inline-flex rounded-full bg-blue-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-200">
            CertifyQuiz Reviews
          </p>

          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            {t.title}
          </h1>

          <p className="mt-4 text-base leading-7 text-slate-200 md:text-lg">
            {t.subtitle}
          </p>
        </div>
      </section>

      {groups.length === 0 ? (
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
          {t.empty}
        </section>
      ) : (
        <section className="mt-8 grid gap-5">
          {groups.map(([certTitle, items], index) => (
            <div
              key={certTitle}
              className={`rounded-3xl border p-5 shadow-sm md:p-6 ${certAccent(
                index
              )}`}
            >
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-950 md:text-2xl">
                    {certTitle}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {items.length} {t.available}
                  </p>
                </div>

                <span className="w-fit rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-slate-700 shadow-sm">
                  {items.length}
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="group rounded-2xl border border-white/80 bg-white/85 px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-white hover:shadow-md"
                  >
                    <h3 className="line-clamp-2 text-sm font-bold leading-6 text-slate-950 group-hover:text-blue-800">
                      {cleanReviewTitle(item.title, certTitle)}
                    </h3>

                    <p className="mt-2 text-xs font-bold text-blue-700">
                      {t.open} →
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}