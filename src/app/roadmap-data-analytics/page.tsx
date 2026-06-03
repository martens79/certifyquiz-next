import type { Metadata } from "next";
import DataAnalyticsRoadmapPage from "@/components/roadmaps/DataAnalyticsRoadmapPage";

export const metadata: Metadata = {
  title:
    "Data & Analytics Roadmap 2026 – From SQL Foundations to DP-900, PL-300 and Power BI | CertifyQuiz",
  description:
    "Step-by-step data and analytics career roadmap: SQL foundations, Microsoft DP-900, Power BI PL-300 and practical analytics skills. Learn what to study, in what order, and how to build a strong data career path.",
  alternates: {
    canonical: "https://www.certifyquiz.com/roadmap-data-analytics",
  },
};

export default function Page() {
  return <DataAnalyticsRoadmapPage lang="en" />;
}