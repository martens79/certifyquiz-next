import type { Metadata } from "next";
import CybersecurityRoadmapPage from "@/components/roadmaps/CybersecurityRoadmapPage";
import { buildRoadmapMetadata } from "@/lib/roadmap-metadata";

export const metadata: Metadata = buildRoadmapMetadata({
  lang: "en",
  area: "cybersecurity",
  title: "Cybersecurity Roadmap 2026 – From Zero to CEH, CISSP and Beyond | CertifyQuiz",
  description:
    "Step-by-step cybersecurity career roadmap: CompTIA Security+, CEH, CISSP and more. Learn what to study, in what order, and how to break into cybersecurity.",
});

export default function Page() {
  return <CybersecurityRoadmapPage lang="en" />;
}
