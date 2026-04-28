import type { Metadata } from "next";
import DatabasesRoadmapPage from "@/components/roadmaps/DatabasesRoadmapPage";

export const metadata: Metadata = {
  title: "Database Roadmap 2026 – SQL Server, Oracle, MySQL Certifications | CertifyQuiz",
  description:
    "Step-by-step database career roadmap: SQL Server, Oracle, MySQL and beyond. Learn what to study, in what order, and how to become job-ready in databases.",
  alternates: {
    canonical: "https://www.certifyquiz.com/roadmap-databases",
  },
};

export default function Page() {
  return <DatabasesRoadmapPage lang="en" />;
}