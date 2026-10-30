// app/certifications/[slug]/scenarios/page.tsx
import { notFound } from "next/navigation";
import ScenarioIndexPage from "@/components/ScenarioIndexPage";
import { isEipassStandardSlug } from "@/lib/eipass-standard";
import { getCertBySlug } from "@/lib/data";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // EIPASS Standard is coming soon: it has no scenarios, in any language.
  if (isEipassStandardSlug(slug)) notFound();
  const cert = await getCertBySlug(slug, "en");
  return <ScenarioIndexPage lang="en" certSlug={slug} certTitle={cert?.title ?? slug} />;
}