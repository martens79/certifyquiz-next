// app/certifications/[slug]/scenarios/page.tsx
import ScenarioIndexPage from "@/components/ScenarioIndexPage";
import { getCertBySlug } from "@/lib/data";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cert = await getCertBySlug(slug, "en");
  return <ScenarioIndexPage lang="en" certSlug={slug} certTitle={cert?.title ?? slug} />;
}