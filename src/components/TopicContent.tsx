import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Locale = "it" | "en" | "fr" | "es";

type TopicContentProps = {
  content: string | null | undefined;
  quizRoute: string;
  lang: Locale;
};

const quizLabels: Record<Locale, string> = {
  it: "🚀 Vai al quiz",
  en: "🚀 Start quiz",
  fr: "🚀 Commencer le quiz",
  es: "🚀 Empezar quiz",
};

export default function TopicContent({
  content,
  quizRoute,
  lang,
}: TopicContentProps) {
  if (!content) return null;

  return (
    <section className="mt-8">
      {/* Renderizza il contenuto del topic in Markdown:
          ## diventa titolo, - diventa lista, ecc. */}
      <div className="prose prose-slate max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </div>

      {/* CTA verso il quiz collegato al topic/certificazione */}
      <div className="mt-8 text-center">
        <Link
          href={quizRoute}
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          {quizLabels[lang]}
        </Link>
      </div>
    </section>
  );
}