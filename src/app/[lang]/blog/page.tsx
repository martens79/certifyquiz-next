import { sanityClient } from "@/lib/sanity.client";
import { articlesPageByLang, articlesCountByLang } from "@/lib/sanity.queries";
import { notFound } from "next/navigation";
import Link from "next/link";
import BlogCategoryBadge from "@/components/blog/BlogCategoryBadge";
import type { Locale } from "@/lib/i18n";
import type { Metadata } from "next";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com").replace(/\/+$/, "");
type BlogSearchParams = Promise<{ page?: string | string[] }>;
const PAGE_SIZE = 20;

function getPage(searchParams: { page?: string | string[] }): number {
  const raw = searchParams.page;
  if (raw === undefined) return 1;
  if (typeof raw !== "string" || !/^[1-9]\d*$/.test(raw)) return 0;
  const page = Number(raw);
  return Number.isSafeInteger(page) ? page : 0;
}

export async function generateMetadata({ params, searchParams }: {
  params: Promise<{ lang: Locale }>;
  searchParams?: BlogSearchParams;
}): Promise<Metadata> {
  const { lang } = await params;
  const page = getPage((await searchParams) ?? {});
  const base = lang === "en" ? `${SITE}/blog` : `${SITE}/${lang}/blog`;
  const canonical = page > 1 ? `${base}?page=${page}` : base;
  return {
    title: "IT Certification Study Guides and Articles | CertifyQuiz",
    description: "Practical certification study guides, exam-preparation strategies and learning resources.",
    alternates: { canonical },
  };
}

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: Locale }>;
  searchParams?: BlogSearchParams;
}) {
  const { lang } = await params;
  const page = getPage((await searchParams) ?? {});
  if (!page) notFound();

  const total = await sanityClient.fetch<number>(articlesCountByLang, { lang });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if (page > totalPages) notFound();

  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const articles = await sanityClient.fetch(articlesPageByLang, { lang, start, end });

  // EN root = /blog
  // altre lingue = /es/blog, /fr/blog, /it/blog
  const base = lang === "en" ? "" : `/${lang}`;
  const blogPath = `${base}/blog`;
  const pageHref = (n: number) => n === 1 ? blogPath : `${blogPath}?page=${n}`;

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
                  <BlogCategoryBadge category={a.category} lang={lang} />
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

      {totalPages > 1 && (
        <nav aria-label="Blog pagination" className="mt-8 flex items-center justify-center gap-4">
          {page > 1 ? (
            <Link rel="prev" href={pageHref(page - 1)} className="rounded border px-4 py-2 hover:bg-gray-50">
              Previous
            </Link>
          ) : <span />}
          <span className="text-sm text-gray-700">Page {page} of {totalPages}</span>
          {page < totalPages ? (
            <Link rel="next" href={pageHref(page + 1)} className="rounded border px-4 py-2 hover:bg-gray-50">
              Next
            </Link>
          ) : <span />}
        </nav>
      )}
    </main>
  );
}
