import type { Metadata } from "next";
import CertificationDetailPage from "@/app/[lang]/certificazioni/[slug]/page";

const SITE =
  (process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com").replace(
    /\/+$/,
    ""
  );

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  return {
    alternates: {
      canonical: `${SITE}/certifications/${slug}`,
    },
  };
}

export default async function CertificationRootEN({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Riusa la pagina /[lang]/certificazioni/[slug] forzando EN
  // @ts-expect-error server wrapper
  return <CertificationDetailPage params={{ lang: "en", slug }} />;
}
