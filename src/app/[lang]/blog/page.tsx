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

  // EN root = /blog
  // altre lingue = /es/blog, /fr/blog, /it/blog
  const base = lang === "en" ? "" : `/${lang}`;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">Blog</h1>

      {articles.length === 0 ? (
        <p className="text-gray-600">
          Nessun articolo disponibile al momento.
        </p>
      ) : (
        <ul className="space-y-6">
          {articles.map((a: any) => (
            <li
              key={a.id}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <Link
                href={`${base}/blog/${a.slug}`}
                className="group block md:flex"
              >
                {a.coverUrl && (
                  <div className="h-52 w-full shrink-0 overflow-hidden bg-gray-100 md:h-auto md:w-72">
                    <img
                      src={a.coverUrl}
                      alt={a.title || "Immagine articolo"}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                )}

                <div className="flex-1 p-5">
                  <h2 className="text-xl font-semibold text-gray-900 transition group-hover:text-blue-600">
                    {a.title}
                  </h2>

                  {a.excerpt && (
                    <p className="mt-2 leading-relaxed text-gray-700">
                      {a.excerpt}
                    </p>
                  )}

                  {a.publishedAt && (
                    <p className="mt-3 text-sm text-gray-500">
                      {new Date(a.publishedAt).toLocaleDateString(lang)}
                    </p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}