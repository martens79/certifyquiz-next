import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { sanityClient } from "@/lib/sanity.client";
import { articleBySlugLang } from "@/lib/sanity.queries";
import { portableTextComponents } from "@/components/blog/PortableTextComponents";
import type { Locale } from "@/lib/i18n";

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ lang: Locale; slug: string }>;
}) {
  const { lang, slug } = await params;

  const article = await sanityClient.fetch<any>(articleBySlugLang, { lang, slug });
  if (!article) return notFound();

  const value = article.body ?? article.content ?? [];

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900">{article.title}</h1>

      <p className="mt-2 text-sm text-gray-500">
        {new Date(article.publishedAt ?? article.date).toLocaleDateString(lang)}
      </p>

      {article.excerpt && <p className="mt-4 text-gray-700">{article.excerpt}</p>}

      <div className="mt-8">
        <PortableText value={value} components={portableTextComponents} />
      </div>
    </main>
  );
}
