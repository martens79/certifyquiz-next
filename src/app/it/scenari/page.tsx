import { getScenariosList } from "@/lib/data";
import CertificationOverviewGrid from "@/components/CertificationOverviewGrid";

export default async function ScenariPage() {
  const scenarios = await getScenariosList("it");

  return (
    <CertificationOverviewGrid
      lang="it"
      items={scenarios}
      mode="scenarios"
    />
  );
}