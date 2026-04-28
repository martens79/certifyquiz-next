import type { Metadata } from "next";
import FundamentalsRoadmapPage from "@/components/roadmaps/FundamentalsRoadmapPage";

export const metadata: Metadata = {
  title: "IT Fundamentals Roadmap 2026 – CompTIA A+, ITF+ and Beyond | CertifyQuiz",
  description:
    "Step-by-step IT fundamentals roadmap: CompTIA ITF+, A+ and entry-level certifications. The right starting point for anyone new to IT.",
  alternates: {
    canonical: "https://www.certifyquiz.com/roadmap-fundamentals",
  },
};

export default function Page() {
  return <FundamentalsRoadmapPage lang="en" />;
}