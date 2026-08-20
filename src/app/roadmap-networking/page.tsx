import type { Metadata } from "next";
import NetworkingRoadmapPage from "@/components/roadmaps/NetworkingRoadmapPage";
import { buildRoadmapMetadata } from "@/lib/roadmap-metadata";

export const metadata: Metadata = buildRoadmapMetadata({
  lang: "en",
  area: "networking",
  title: "Networking Roadmap 2026 – From Zero to CCNA and Beyond | CertifyQuiz",
  description:
    "Step-by-step networking career roadmap: Network+, CCNA, and specializations. Learn what to study, in what order, and how to become job-ready in networking.",
});

export default function Page() {
  return <NetworkingRoadmapPage lang="en" />;
}
