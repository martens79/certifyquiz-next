// app/[lang]/certifications/[slug]/head.tsx
const ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.certifyquiz.com";

function prettyDetail(lang: string, slug: string) {
  if (lang === "it") return `/it/certificazioni/${slug}`;
  if (lang === "es") return `/es/certificaciones/${slug}`;
  return `/${lang}/certifications/${slug}`; // en / fr
}

export default function Head({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const url = `${ORIGIN}${prettyDetail(params.lang, params.slug)}`;
  return (
    <>
      <meta property="og:url" content={url} />
      <meta name="og:url" content={url} />
      {/* debug facile da grep */}
      <meta name="x-og-url" content={url} />
    </>
  );
}
