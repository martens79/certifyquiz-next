import VirtualizationRoadmapPage from "@/components/roadmaps/VirtualizationRoadmapPage";

type Locale = "it" | "en" | "es" | "fr";

export default function Page({ params }: { params: { lang: Locale } }) {
  return <VirtualizationRoadmapPage lang={params.lang} />;
}
