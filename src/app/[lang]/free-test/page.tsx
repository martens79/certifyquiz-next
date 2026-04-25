import { notFound } from "next/navigation";
import FreeTestPageContent from "@/components/newsletter/FreeTestPageContent";

type Lang = "it" | "en" | "fr" | "es";

const VALID_LANGS: Lang[] = ["it", "fr", "es"];

export default async function LocalizedFreeTestPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams?: Promise<{
    cert?: string;
    topic?: string;
    source?: string;
    quiz?: string;
  }>;
}) {
  const { lang } = await params;

  if (!VALID_LANGS.includes(lang as Lang)) {
    return notFound();
  }

  const query = await searchParams;

  return (
    <FreeTestPageContent
      lang={lang as Lang}
      cert={query?.cert ?? "general"}
      topic={query?.topic ?? "general"}
      source={query?.source ?? "free-test"}
      quizHref={query?.quiz ?? ""}
    />
  );
}