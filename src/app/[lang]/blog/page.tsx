import { sanityClient } from "@/lib/sanity.client";
import { articlesListByLang } from "@/lib/sanity.queries";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;

  const articles = await sanityClient.fetch(articlesListByLang, { lang });

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">Blog</h1>

      {articles.length === 0 ? (
        <p className="text-gray-600">Nessun articolo disponibile al momento.</p>
      ) : (
        <ul className="space-y-6">
          {articles.map((a: any) => (
            <li key={a.id} className="rounded-xl border p-4">
              <h2 className="text-xl font-semibold">
                <Link href={`/${lang}/blog/${a.slug}`} className="hover:underline">
                  {a.title}
                </Link>
              </h2>
              {a.excerpt && <p className="mt-2 text-gray-700">{a.excerpt}</p>}
              {a.publishedAt && (
                <p className="mt-1 text-sm text-gray-500">
                  {new Date(a.publishedAt).toLocaleDateString(lang)}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
