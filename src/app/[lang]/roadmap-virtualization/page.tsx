import VirtualizationRoadmapPage from "@/components/roadmaps/VirtualizationRoadmapPage";

type Locale = "it" | "en" | "es" | "fr";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  return <VirtualizationRoadmapPage lang={lang} />;
}
