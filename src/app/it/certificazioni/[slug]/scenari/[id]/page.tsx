// app/it/certificazioni/[slug]/scenari/[id]/page.tsx
import ScenarioQuizPage from "@/components/ScenarioQuizPage";
import { getScenarioById } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { slug: string; id: string } }) {
  const scenario = await getScenarioById(Number(params.id), "it");
  if (!scenario) notFound();
  return <ScenarioQuizPage lang="it" scenario={scenario} />;
}