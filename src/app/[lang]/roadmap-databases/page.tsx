import DatabasesRoadmapPage from "@/components/roadmaps/DatabasesRoadmapPage";

type Locale = "it" | "en" | "es" | "fr";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  return <DatabasesRoadmapPage lang={lang} />;
}
