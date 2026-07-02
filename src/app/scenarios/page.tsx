import { getScenariosList } from "@/lib/data";
import CertificationOverviewGrid from "@/components/CertificationOverviewGrid";

export default async function ScenariosPage() {
  const scenarios = await getScenariosList("en");

  return (
    <CertificationOverviewGrid
      lang="en"
      items={scenarios}
      mode="scenarios"
    />
  );
}