import { RecommendedResourcesView, recommendedResourcesMetadata } from "@/app/_views/recommendedResourcesPage";

export const metadata = recommendedResourcesMetadata("en");

export default function Page() {
  return <RecommendedResourcesView lang="en" />;
}
