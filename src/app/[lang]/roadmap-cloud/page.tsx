import CloudRoadmapPage from "@/components/roadmaps/CloudRoadmapPage";

type Locale = "it" | "en" | "es" | "fr";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  return <CloudRoadmapPage lang={lang} />;
}
