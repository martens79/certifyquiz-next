import { getScenariosList, type Locale } from "@/lib/data";
import CertificationOverviewGrid from "@/components/CertificationOverviewGrid";
import ScenarioIntro from "@/components/ScenarioIntro";

type PageProps = {
  params: Promise<{ lang: Locale }>;
};

export default async function ScenariosIndexPage({ params }: PageProps) {
  const { lang } = await params;
  const scenarios = await getScenariosList(lang);

  return (
    <>
      <ScenarioIntro lang={lang} />

      <CertificationOverviewGrid
        lang={lang}
        items={scenarios}
        mode="scenarios"
      />
    </>
  );
}