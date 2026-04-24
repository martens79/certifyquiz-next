import type { Metadata } from "next";
import CertPage from "@/app/[lang]/certificazioni/[slug]/page";
import { getCertificationDetailRSC } from "@/lib/server/certs";

type Props = {
  params: Promise<{ slug: string }>;
};

function getCategoryFromSlug(slug: string) {
  if (
    slug.includes("security") ||
    slug.includes("ceh") ||
    slug.includes("cissp") ||
    slug.includes("isc2")
  ) {
    return "security";
  }

  if (
    slug.includes("aws") ||
    slug.includes("azure") ||
    slug.includes("google-cloud")
  ) {
    return "cloud";
  }

  if (slug.includes("ccna") || slug.includes("network")) {
    return "networking";
  }

  if (slug.includes("ai") || slug.includes("artificial")) {
    return "ai";
  }

  return "default";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const data = await getCertificationDetailRSC(slug);

  if (!data) {
    return {
      title: "Certificazione IT | CertifyQuiz",
      description:
        "Preparati alle certificazioni IT con quiz realistici e spiegazioni chiare.",
    };
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com";

  const certName = data.name || data.name_en || slug;

  const title = `${certName}: quiz pratici e preparazione esame | CertifyQuiz`;

  const description =
    data.description ||
    data.description_en ||
    `Preparati alla certificazione ${certName} con quiz realistici, domande pratiche e spiegazioni chiare.`;

  const pageUrl = `${siteUrl}/it/certificazioni/${slug}`;

  const category = getCategoryFromSlug(slug);

  const ogImage = `${siteUrl}/api/og?type=certification&title=${encodeURIComponent(
    certName
  )}&subtitle=${encodeURIComponent(
    "Quiz pratici e preparazione esame"
  )}&category=${category}`;

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "CertifyQuiz",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${certName} - CertifyQuiz`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;

  return <CertPage params={Promise.resolve({ lang: "it", slug })} />;
}