import { RecommendedResourcesView, recommendedResourcesMetadata } from "@/app/_views/recommendedResourcesPage";

export const metadata = recommendedResourcesMetadata("es");

export default function Page() {
  return <RecommendedResourcesView lang="es" />;
}
