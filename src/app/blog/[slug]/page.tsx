// src/app/blog/[slug]/page.tsx
import BlogArticleLangPage from "@/app/[lang]/blog/[slug]/page";

export default function BlogArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  // forza EN per la route /blog/[slug]
  return BlogArticleLangPage({
    params: Promise.resolve({ lang: "en", slug: params.slug }),
  } as any);
}
