import type { Locale } from "@/lib/paths";
import type { GuideDetail } from "@/lib/data";
import GuideDownloadPanel from "./GuideDownloadPanel";

type Props = {
  lang: Locale;
  guide: GuideDetail;
};

const LABELS = {
  it: { badge: "CertifyQuiz Guide", previewTitle: "Anteprima", pages: "pagine" },
  en: { badge: "CertifyQuiz Guides", previewTitle: "Preview", pages: "pages" },
  fr: { badge: "CertifyQuiz Guides", previewTitle: "Aperçu", pages: "pages" },
  es: { badge: "CertifyQuiz Guías", previewTitle: "Vista previa", pages: "páginas" },
} as const;

export default function GuideDetailView({ lang, guide }: Props) {
  const t = LABELS[lang];

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <p className="mb-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-800">
        {t.badge}
      </p>

      <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 md:text-4xl">
        {guide.title}
      </h1>

      <p className="mt-2 text-sm font-semibold text-slate-500">
        {guide.certification_name}
        {guide.page_count ? ` · ${guide.page_count} ${t.pages}` : ""}
      </p>

      <div className="mt-8 grid gap-8 md:grid-cols-[2fr_1fr]">
        <section>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
            {t.previewTitle}
          </h2>

          <div
            className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm"
            style={{ height: "70vh" }}
          >
            <iframe
              src={`/api/backend/guides/${encodeURIComponent(guide.slug)}/preview?lang=${lang}`}
              title={`${guide.title} preview`}
              className="h-full w-full"
            />
          </div>
        </section>

        <section>
          <GuideDownloadPanel lang={lang} slug={guide.slug} price={guide.price} />
        </section>
      </div>
    </main>
  );
}
