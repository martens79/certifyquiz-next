// src/app/certifications/[slug]/page.tsx
import type { Metadata } from "next";
import { CertificationDetailView } from "@/app/_views/CertificationDetailView";
import { getCertificationDetailRSC } from "@/lib/server/certs";

type Props = { params: Promise<{ slug: string }> };

const normalizeCertSlug = (slug: string) => {
  if (slug === "network-plus") return "comptia-network-plus";
  if (slug === "tensorflow") return "google-tensorflow";
  if (slug === "tensorflow-developer") return "google-tensorflow";
  return slug;
};

const SEO_OVERRIDES: Record<string, { title?: string; description?: string }> = {
  "microsoft-sql-server": {
    title: "SQL Server Certification – Practice Test 2026 | CertifyQuiz",
    description:
      "Practice for SQL Server certification with 760 exam-style questions. T-SQL, database design, backup, security and performance. Start free.",
  },
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
  "cisco-ccst-networking": {
    title: "Cisco CCST Networking – Practice Test 2026 | CertifyQuiz",
    description:
      "Prepare for Cisco CCST Networking with practice questions covering protocols, devices, IP addressing, security and troubleshooting. Start free.",
  },
  "cisco-ccst-cybersecurity": {
    title: "Cisco CCST Cybersecurity – Practice Test 2026 | CertifyQuiz",
    description:
      "Prepare for Cisco CCST Cybersecurity with practice questions covering threats, malware, network security and social engineering. Start free.",
  },
  "ccst": {
    title: "Cisco CCST Certification – Networking & Cybersecurity Practice Test | CertifyQuiz",
    description:
      "Prepare for Cisco CCST with practice questions on networking, cybersecurity and IT support. Choose your specialization and start free.",
  },
  "ceh": {
    title: "CEH Practice Test 2026 – 1000+ Ethical Hacking Questions | CertifyQuiz",
    description:
      "Prepare for CEH 312-50 with 1000+ exam-style questions. Covers ethical hacking, network attacks, web vulnerabilities and exploitation. Start free.",
  },
  "csharp": {
    title: "C# / AZ-204 Practice Test 2026 – Azure Developer Exam Prep | CertifyQuiz",
    description:
      "Prepare for the AZ-204 Azure Developer exam with C#/.NET practice questions. Covers compute, storage, security, APIs and monitoring. Start free.",
  },
  "microsoft-ai": {
    title: "Microsoft AI-900 Practice Test 2026 – Azure AI Fundamentals | CertifyQuiz",
    description:
      "Prepare for the Microsoft AI-900 exam with practice questions on AI concepts, machine learning, computer vision, NLP and generative AI. Start free.",
  },
  "comptia-network-plus": {
    title: "CompTIA Network+ Practice Test 2026 – Network+ Quiz | CertifyQuiz",
    description:
      "Prepare for the CompTIA Network+ N10-009 exam with practice questions, network troubleshooting quizzes, security topics and clear explanations.",
  },
  "google-tensorflow": {
    title: "Google TensorFlow Practice Test 2026 – TensorFlow Quiz | CertifyQuiz",
    description:
      "Practice TensorFlow with quiz questions on machine learning, neural networks, model training, evaluation and deployment.",
  },
};

function getCategoryFromSlug(slug: string) {
  if (
    slug.includes("security") ||
    slug.includes("ceh") ||
    slug.includes("cissp") ||
    slug.includes("isc2")
  )
    return "security";

  if (
    slug.includes("aws") ||
    slug.includes("azure") ||
    slug.includes("google-cloud")
  )
    return "cloud";

  if (slug.includes("ccna") || slug.includes("network")) return "networking";

  if (slug.includes("ai") || slug.includes("artificial") || slug.includes("tensorflow"))
    return "ai";

  return "default";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const canonicalSlug = normalizeCertSlug(slug);

  const data = await getCertificationDetailRSC(canonicalSlug);

  if (!data) {
    return {
      title: "IT Certification | CertifyQuiz",
      description:
        "Prepare for IT certifications with realistic quizzes and clear explanations.",
    };
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com";

  const certName = data.name_en || data.name || canonicalSlug;
  const override = SEO_OVERRIDES[canonicalSlug] || {};

  const title =
    override.title ||
    `${certName}: practice exam and quiz preparation | CertifyQuiz`;

  const description =
    override.description ||
    data.description_en ||
    data.description ||
    `Prepare for ${certName} with realistic quizzes, exam-style questions and clear explanations.`;

  const pageUrl = `${siteUrl}/certifications/${canonicalSlug}`;
  const category = getCategoryFromSlug(canonicalSlug);

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
  const canonicalSlug = normalizeCertSlug(slug);

  return <CertificationDetailView lang="en" slug={canonicalSlug} />;
}