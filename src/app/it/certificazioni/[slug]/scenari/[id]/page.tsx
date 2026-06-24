// app/it/certificazioni/[slug]/scenari/[id]/page.tsx
import ScenarioQuizPage from "@/components/ScenarioQuizPage";
import { getScenarioById } from "@/lib/data";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("rt")?.value;
  const scenario = await getScenarioById(Number(id), "it", token);
  if (!scenario) notFound();
  return <ScenarioQuizPage lang="it" scenario={scenario} />;
}