import { RecommendedResourcesView, recommendedResourcesMetadata } from "@/app/_views/recommendedResourcesPage";

export const metadata = recommendedResourcesMetadata("it");

export default function Page() {
  return <RecommendedResourcesView lang="it" />;
}
