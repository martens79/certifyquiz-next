// src/app/blog/page.tsx
import BlogLangPage from "@/app/[lang]/blog/page";
import type { Metadata } from "next";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com").replace(/\/+$/, "");
export const metadata: Metadata = {
  title: "IT Certification Study Guides and Articles | CertifyQuiz",
  description: "Practical IT certification study guides, exam-preparation strategies and learning resources from CertifyQuiz.",
  alternates: { canonical: `${SITE}/blog` },
};

export default function BlogPage() {
  // forza EN per la route /blog
  return BlogLangPage({ params: Promise.resolve({ lang: "en" }) } as any);
}
