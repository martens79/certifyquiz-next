// src/app/blog/page.tsx
import BlogLangPage, { generateMetadata as generateBlogMetadata } from "@/app/[lang]/blog/page";
import type { Metadata } from "next";

export async function generateMetadata({ searchParams }: {
  searchParams: Promise<{ page?: string | string[] }>;
}): Promise<Metadata> {
  return generateBlogMetadata({ params: Promise.resolve({ lang: "en" }), searchParams });
}

export default function BlogPage({ searchParams }: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  // Root /blog is EN, including paginated URLs.
  return BlogLangPage({ params: Promise.resolve({ lang: "en" }), searchParams });
}
