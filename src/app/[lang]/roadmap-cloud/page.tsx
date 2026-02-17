import CloudRoadmapPage from "@/components/roadmaps/CloudRoadmapPage";

type Locale = "it" | "en" | "es" | "fr";

export default function Page({ params }: { params: { lang: Locale } }) {
  return <CloudRoadmapPage lang={params.lang} />;
}
