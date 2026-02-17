import NetworkingRoadmapPage from "@/components/roadmaps/NetworkingRoadmapPage";

type Locale = "it" | "en" | "es" | "fr";

export default function Page({ params }: { params: { lang: Locale } }) {
  return <NetworkingRoadmapPage lang={params.lang} />;
}
