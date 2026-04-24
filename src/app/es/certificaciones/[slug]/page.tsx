import type { Metadata } from "next";
import { CertificationDetailView } from "@/app/_views/CertificationDetailView";
import { getCertificationDetailRSC } from "@/lib/server/certs";

type Props = { params: Promise<{ slug: string }> };

function getCategoryFromSlug(slug: string) {
  if (
    slug.includes("security") ||
    slug.includes("ceh") ||
    slug.includes("cissp") ||
    slug.includes("isc2")
  ) return "security";

  if (
    slug.includes("aws") ||
    slug.includes("azure") ||
    slug.includes("google-cloud")
  ) return "cloud";

  if (slug.includes("ccna") || slug.includes("network")) return "networking";

  if (slug.includes("ai") || slug.includes("artificial")) return "ai";

  return "default";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const data = await getCertificationDetailRSC(slug);

  if (!data) {
    return {
      title: "Certificación IT | CertifyQuiz",
      description:
        "Prepárate para certificaciones IT con quizzes realistas y explicaciones claras.",
    };
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com";

  const certName = data.name_es || data.name_en || data.name || slug;

  const title = `${certName}: quizzes prácticos y preparación de examen | CertifyQuiz`;

  const description =
    data.description_es ||
    data.description_en ||
    data.description ||
    `Prepárate para la certificación ${certName} con quizzes realistas, preguntas tipo examen y explicaciones claras.`;

  const pageUrl = `${siteUrl}/es/certificaciones/${slug}`;
  const category = getCategoryFromSlug(slug);

  const ogImage = `${siteUrl}/api/og?type=certification&title=${encodeURIComponent(
    certName
  )}&subtitle=${encodeURIComponent(
    "Quizzes prácticos y preparación de examen"
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
  return <CertificationDetailView lang="es" slug={slug} />;
}