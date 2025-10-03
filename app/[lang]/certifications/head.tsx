// app/[lang]/certifications/head.tsx
const ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.certifyquiz.com";

function prettyList(lang: string) {
  return lang === "it" ? "/it/certificazioni"
       : lang === "es" ? "/es/certificaciones"
       : lang === "fr" ? "/fr/certifications"
       : "/en/certifications";
}

export default function Head({
  params,
}: {
  params: { lang: string };
}) {
  const url = `${ORIGIN}${prettyList(params.lang)}`;
  return (
    <>
      <meta property="og:url" content={url} />
      <meta name="og:url" content={url} />
      {/* debug facile da grep */}
      <meta name="x-og-url" content={url} />
    </>
  );
}
