import type { Metadata } from "next";
import CloudRoadmapPage from "@/components/roadmaps/CloudRoadmapPage";

export const metadata: Metadata = {
  title: "Cloud Computing Roadmap 2026 – AWS, Azure, GCP Certifications | CertifyQuiz",
  description:
    "Step-by-step cloud career roadmap: AWS Cloud Practitioner, Azure Fundamentals, GCP and beyond. Learn what to study, in what order, and how to become cloud job-ready.",
  alternates: {
    canonical: "https://www.certifyquiz.com/roadmap-cloud",
  },
};

export default function Page() {
  return <CloudRoadmapPage lang="en" />;
}