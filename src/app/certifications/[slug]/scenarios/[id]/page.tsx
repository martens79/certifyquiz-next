// app/certifications/[slug]/scenarios/[id]/page.tsx
import ScenarioQuizPage from "@/components/ScenarioQuizPage";

export default async function Page({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await params;
  return <ScenarioQuizPage lang="en" certSlug={slug} scenarioId={Number(id)} />;
}