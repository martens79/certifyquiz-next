import type { Metadata } from "next";
import NetworkingRoadmapPage from "@/components/roadmaps/NetworkingRoadmapPage";

export const metadata: Metadata = {
  title: "Networking Roadmap 2026 – From Zero to CCNA and Beyond | CertifyQuiz",
  description:
    "Step-by-step networking career roadmap: Network+, CCNA, and specializations. Learn what to study, in what order, and how to become job-ready in networking.",
  alternates: {
    canonical: "https://www.certifyquiz.com/roadmap-networking",
  },
};

export default function Page() {
  return <NetworkingRoadmapPage lang="en" />;
}