import Link from "next/link";
import { getTopicReviewsList, type Locale } from "@/lib/data";

const labels = {
  it: {
    title: "Ripassi rapidi",
    subtitle:
      "Rivedi i concetti principali prima di affrontare un quiz o una simulazione d’esame.",
    available: "ripassi disponibili",
    open: "Apri ripasso",
  },
  en: {
    title: "Quick reviews",
    subtitle:
      "Review the key concepts before taking a quiz or a mock exam.",
    available: "available reviews",
    open: "Open review",
  },
  fr: {
    title: "Révisions rapides",
    subtitle:
      "Révisez les concepts clés avant de passer un quiz ou un examen blanc.",
    available: "révisions disponibles",
    open: "Ouvrir la révision",
  },
  es: {
    title: "Repasos rápidos",
    subtitle:
      "Repasa los conceptos clave antes de hacer un quiz o una simulación de examen.",
    available: "repasos disponibles",
    open: "Abrir repaso",
  },
};

type Props = {
  lang: Locale;
};

export default async function ReviewsIndexPage({ lang }: Props) {
  const t = labels[lang];
  const reviews = await getTopicReviewsList(lang);

  const grouped = reviews.reduce<Record<string, typeof reviews>>((acc, item) => {
    if (!acc[item.certificationTitle]) acc[item.certificationTitle] = [];
    acc[item.certificationTitle].push(item);
    return acc;
  }, {});

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <section className="rounded-3xl bg-slate-950 px-6 py-10 text-white md:px-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-300">
          CertifyQuiz
        </p>

        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          {t.title}
        </h1>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-200">
          {t.subtitle}
        </p>
      </section>

      <section className="mt-10 space-y-8">
        {Object.entries(grouped).map(([certTitle, items]) => (
          <div
            key={certTitle}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-950">
                  {certTitle}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {items.length} {t.available}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="group rounded-2xl border border-slate-200 p-5 transition hover:border-blue-300 hover:bg-blue-50"
                >
                  <h3 className="font-semibold text-slate-950 group-hover:text-blue-800">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm font-semibold text-blue-700">
                    {t.open} →
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}