// src/app/blog/[slug]/page.tsx
import BlogArticleLangPage from "@/app/[lang]/blog/[slug]/page";

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return BlogArticleLangPage({
    params: Promise.resolve({ lang: "en", slug }),
  } as any);
}
