import type { Metadata } from "next";
import AIRoadmapPage from "@/components/roadmaps/AIRoadmapPage";

export const metadata: Metadata = {
  title: "AI & Machine Learning Roadmap 2026 – AWS ML, Azure AI, TensorFlow | CertifyQuiz",
  description:
    "Step-by-step AI and machine learning career roadmap: AWS ML Specialty, Azure AI-102, Google TensorFlow and beyond. Learn what to study and how to break into AI.",
  alternates: {
    canonical: "https://www.certifyquiz.com/roadmap-ai",
  },
};

export default function Page() {
  return <AIRoadmapPage lang="en" />;
}