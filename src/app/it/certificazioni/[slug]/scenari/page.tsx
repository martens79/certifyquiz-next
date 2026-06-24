// app/it/certificazioni/[slug]/scenari/page.tsx
import ScenarioIndexPage from "@/components/ScenarioIndexPage";
import { getCertBySlug } from "@/lib/data";

export default async function Page({ params }: { params: { slug: string } }) {
  const cert = await getCertBySlug(params.slug, "it");
  return (
    <ScenarioIndexPage
      lang="it"
      certSlug={params.slug}
      certTitle={cert?.title ?? params.slug}
    />
  );
}