import ProgrammingRoadmapPage from "@/components/roadmaps/ProgrammingRoadmapPage";

type Locale = "it" | "en" | "es" | "fr";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  return <ProgrammingRoadmapPage lang={lang} />;
}
