import { RecommendedResourcesView, recommendedResourcesMetadata } from "@/app/_views/recommendedResourcesPage";

export const metadata = recommendedResourcesMetadata("fr");

export default function Page() {
  return <RecommendedResourcesView lang="fr" />;
}
