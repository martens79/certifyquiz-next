import type { Metadata } from "next";
import QuizTopicClient from "./QuizTopicClient";

type Locale = "it" | "en" | "fr" | "es";

/* ─────────────────────────  SEO (noindex)  ───────────────────────── */

// Pagine topic quiz = area privata / utility → meglio non indicizzarle
export const metadata: Metadata = {
  title: "Quiz per argomento | CertifyQuiz",
  description:
    "Allenati sui quiz per argomento su CertifyQuiz. Accedi per svolgere i quiz dedicati alle singole certificazioni.",
  robots: {
    index: false,
    follow: false,
  },
};

type RouteParams = {
  lang: string;
  topicId: string;
};

/* ─────────────────────────  Pagina server  ───────────────────────── */

// Next 15: in alcune route `params` è async → va awaitato
export default async function Page(props: { params: Promise<RouteParams> }) {
  const params = await props.params;

  const rawLang = params.lang;
  const lang = (["it", "en", "fr", "es"].includes(rawLang) ? rawLang : "it") as Locale;

  const topicId = Number(params.topicId);

  return <QuizTopicClient lang={lang} topicId={topicId} />;
}
