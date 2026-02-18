import NetworkingRoadmapPage from "@/components/roadmaps/NetworkingRoadmapPage";

type Locale = "it" | "en" | "es" | "fr";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  return <NetworkingRoadmapPage lang={lang} />;
}
