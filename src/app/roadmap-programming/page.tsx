import type { Metadata } from "next";
import ProgrammingRoadmapPage from "@/components/roadmaps/ProgrammingRoadmapPage";

export const metadata: Metadata = {
  title: "Programming Roadmap 2026 – Python, Java, C# Certifications | CertifyQuiz",
  description:
    "Step-by-step programming career roadmap: Python, Java, C#/.NET and beyond. Learn what to study, in what order, and how to become a certified developer.",
  alternates: {
    canonical: "https://www.certifyquiz.com/roadmap-programming",
  },
};

export default function Page() {
  return <ProgrammingRoadmapPage lang="en" />;
}