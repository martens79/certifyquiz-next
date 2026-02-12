// src/app/blog/page.tsx
import BlogLangPage from "@/app/[lang]/blog/page";

export default function BlogPage() {
  // forza EN per la route /blog
  return BlogLangPage({ params: Promise.resolve({ lang: "en" }) } as any);
}
