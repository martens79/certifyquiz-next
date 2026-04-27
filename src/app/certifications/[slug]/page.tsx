// src/app/certifications/[slug]/page.tsx
import type { Metadata } from "next";
import { CertificationDetailView } from "@/app/_views/CertificationDetailView";
import { getCertificationDetailRSC } from "@/lib/server/certs";

type Props = { params: Promise<{ slug: string }> };

// ✅ Override SEO manuali per slug specifici (EN root)
// Usare quando il DB non ha meta title/description ottimizzati.
// Aggiungere nuovi slug qui man mano che si ottimizzano le pagine.
const SEO_OVERRIDES: Record<string, { title?: string; description?: string }> = {
  "microsoft-sql-server": {
    title: "SQL Server Certification – Practice Test 2026 | CertifyQuiz",
    description:
      "Practice for SQL Server certification with 760 exam-style questions. T-SQL, database design, backup, security and performance. Start free.",
  },
  // 👇 AGGIUNGI QUESTO
  "isc2-cc": {
    title: "ISC2 CC Certified in Cybersecurity – Practice Test 2026 | CertifyQuiz",
    description:
      "Prepare for the ISC2 Certified in Cybersecurity exam with free practice questions. Covers risk, security controls, compliance and incident response. Start free.",
  },
  "ccna": {
  title: "CCNA Practice Test 2026 – 600 Exam Questions 200-301 | CertifyQuiz",
  description:
    "Practice for Cisco CCNA 200-301 with 600 exam-style questions. Covers routing, switching, subnetting, VLANs, OSPF and security. Start free.",
},
"cissp": {
  title: "CISSP Practice Test 2026 – Exam-Style Questions | CertifyQuiz",
  description:
    "Practice for the CISSP exam with advanced questions across all 8 domains: risk, cryptography, IAM, network security and operations. For senior professionals.",
},
};

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
      title: "IT Certification | CertifyQuiz",
      description:
        "Prepare for IT certifications with realistic quizzes and clear explanations.",
    };
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com";

  const certName = data.name_en || data.name || slug;
  const override = SEO_OVERRIDES[slug] || {};

  // ✅ Usa override se disponibile, altrimenti template generico
  const title =
    override.title ||
    `${certName}: practice exam and quiz preparation | CertifyQuiz`;

  const description =
    override.description ||
    data.description_en ||
    data.description ||
    `Prepare for ${certName} with realistic quizzes, exam-style questions and clear explanations.`;

  const pageUrl = `${siteUrl}/certifications/${slug}`;
  const category = getCategoryFromSlug(slug);

  const ogImage = `${siteUrl}/api/og?type=certification&title=${encodeURIComponent(
    certName
  )}&subtitle=${encodeURIComponent(
    "Practice exam and quiz preparation"
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
  return <CertificationDetailView lang="en" slug={slug} />;
}
