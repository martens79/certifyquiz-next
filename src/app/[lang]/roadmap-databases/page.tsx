import DatabasesRoadmapPage from "@/components/roadmaps/DatabasesRoadmapPage";

type Locale = "it" | "en" | "es" | "fr";

export default function Page({ params }: { params: { lang: Locale } }) {
  return <DatabasesRoadmapPage lang={params.lang} />;
}
