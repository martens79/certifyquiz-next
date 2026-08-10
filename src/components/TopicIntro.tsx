import { looksLikeHtml } from "@/components/TopicContent";

type TopicIntroProps = {
  text: string | null | undefined;
  className?: string;
};

/**
 * Alcuni topic hanno `intro` salvato come HTML grezzo (es. <p>...</p>),
 * altri come testo semplice. Stessa euristica di TopicContent.
 */
export default function TopicIntro({ text, className }: TopicIntroProps) {
  if (!text) return null;

  if (looksLikeHtml(text)) {
    return <div className={className} dangerouslySetInnerHTML={{ __html: text }} />;
  }

  return <p className={className}>{text}</p>;
}
