import AIRoadmapPage from "@/components/roadmaps/AIRoadmapPage";

type Locale = "it" | "en" | "es" | "fr";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  return <AIRoadmapPage lang={lang} />;
}
