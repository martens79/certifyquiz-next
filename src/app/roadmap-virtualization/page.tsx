import type { Metadata } from "next";
import VirtualizationRoadmapPage from "@/components/roadmaps/VirtualizationRoadmapPage";

export const metadata: Metadata = {
  title: "Virtualization Roadmap 2026 – VMware, Hyper-V Certifications | CertifyQuiz",
  description:
    "Step-by-step virtualization career roadmap: VMware VCP, Microsoft Hyper-V and beyond. Learn what to study, in what order, and how to become job-ready in virtualization.",
  alternates: {
    canonical: "https://www.certifyquiz.com/roadmap-virtualization",
  },
};

export default function Page() {
  return <VirtualizationRoadmapPage lang="en" />;
}