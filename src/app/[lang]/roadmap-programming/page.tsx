import ProgrammingRoadmapPage from "@/components/roadmaps/ProgrammingRoadmapPage";

type Locale = "it" | "en" | "es" | "fr";

export default function Page({ params }: { params: { lang: Locale } }) {
  return <ProgrammingRoadmapPage lang={params.lang} />;
}
