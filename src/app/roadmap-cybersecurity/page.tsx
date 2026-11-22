import type { Metadata } from "next";
import CybersecurityRoadmapPage from "@/components/roadmaps/CybersecurityRoadmapPage";
import { buildRoadmapMetadata } from "@/lib/roadmap-metadata";

export const metadata: Metadata = buildRoadmapMetadata({
  lang: "en",
  area: "cybersecurity",
  title: "Cybersecurity Certification Roadmap 2026: Beginner to CISSP | CertifyQuiz",
  description:
    "Step-by-step cybersecurity career roadmap: CompTIA Security+, CEH, CISSP and more. Learn what to study, in what order, and how to break into cybersecurity.",
});

export default function Page() {
  return <CybersecurityRoadmapPage lang="en" />;
}
