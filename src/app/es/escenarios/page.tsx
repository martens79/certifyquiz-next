import { getScenariosList } from "@/lib/data";
import CertificationOverviewGrid from "@/components/CertificationOverviewGrid";

export default async function EscenariosPage() {
  const scenarios = await getScenariosList("es");

  return (
    <CertificationOverviewGrid
      lang="es"
      items={scenarios}
      mode="scenarios"
    />
  );
}