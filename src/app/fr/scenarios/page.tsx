import { getScenariosList } from "@/lib/data";
import CertificationOverviewGrid from "@/components/CertificationOverviewGrid";

export default async function ScenariosFrPage() {
  const scenarios = await getScenariosList("fr");

  return (
    <CertificationOverviewGrid
      lang="fr"
      items={scenarios}
      mode="scenarios"
    />
  );
}