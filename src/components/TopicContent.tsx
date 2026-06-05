import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Locale = "it" | "en" | "fr" | "es";

type TopicContentProps = {
  content: string | null | undefined;
  quizRoute: string;
  reviewRoute?: string;
  lang: Locale;
};

const quizLabels: Record<Locale, string> = {
  it: "🚀 Vai al quiz",
  en: "🚀 Start quiz",
  fr: "🚀 Commencer le quiz",
  es: "🚀 Empezar quiz",
};

const reviewLabels: Record<Locale, string> = {
  it: "📘 Ripasso rapido",
  en: "📘 Quick review",
  fr: "📘 Révision rapide",
  es: "📘 Repaso rápido",
};

function looksLikeHtml(value: string) {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

export default function TopicContent({
  content,
  quizRoute,
  reviewRoute,
  lang,
}: TopicContentProps) {
  if (!content) return null;

  const isHtml = looksLikeHtml(content);

  return (
    <section className="mt-8">
      <div className="prose prose-slate max-w-none">
        {isHtml ? (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        ) : (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        )}
      </div>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href={quizRoute}
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          {quizLabels[lang]}
        </Link>

        {reviewRoute && (
          <Link
            href={reviewRoute}
            className="inline-flex items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-6 py-3 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-100"
          >
            {reviewLabels[lang]}
          </Link>
        )}
      </div>
    </section>
  );
}