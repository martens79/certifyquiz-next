import FundamentalsRoadmapPage from "@/components/roadmaps/FundamentalsRoadmapPage";

type Locale = "it" | "en" | "es" | "fr";

export default function Page({ params }: { params: { lang: Locale } }) {
  return <FundamentalsRoadmapPage lang={params.lang} />;
}
