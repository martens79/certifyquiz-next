import CybersecurityRoadmapPage from "@/components/roadmaps/CybersecurityRoadmapPage";
import { notFound } from "next/navigation";

type Lang = "it" | "es" | "fr";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!["it", "es", "fr"].includes(lang)) notFound();

  return <CybersecurityRoadmapPage lang={lang as Lang} />;
}
