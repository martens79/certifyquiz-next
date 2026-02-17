import AIRoadmapPage from "@/components/roadmaps/AIRoadmapPage";

type Locale = "it" | "en" | "es" | "fr";

export default function Page({ params }: { params: { lang: Locale } }) {
  return <AIRoadmapPage lang={params.lang} />;
}
