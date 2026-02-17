import CybersecurityRoadmapPage from "@/components/roadmaps/CybersecurityRoadmapPage";
import { notFound } from "next/navigation";

type Lang = "it" | "es" | "fr";

export default function Page({ params }: { params: { lang: string } }) {
  const lang = params.lang as Lang;

  if (!["it", "es", "fr"].includes(lang)) notFound();

  return <CybersecurityRoadmapPage lang={lang} />;
}
