// src/app/blog/[slug]/page.tsx
import BlogArticleLangPage, {
  generateMetadata as generateLangMetadata,
} from "@/app/[lang]/blog/[slug]/page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return generateLangMetadata({
    params: Promise.resolve({ lang: "en", slug }),
  });
}

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
