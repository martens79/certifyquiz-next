// app/fr/certifications/[slug]/scenarios/page.tsx
import ScenarioIndexPage from "@/components/ScenarioIndexPage";
import { getCertBySlug } from "@/lib/data";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cert = await getCertBySlug(slug, "fr");
  return <ScenarioIndexPage lang="fr" certSlug={slug} certTitle={cert?.title ?? slug} />;
}