import FundamentalsRoadmapPage from "@/components/roadmaps/FundamentalsRoadmapPage";

type Locale = "it" | "en" | "es" | "fr";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  return <FundamentalsRoadmapPage lang={lang} />;
}
