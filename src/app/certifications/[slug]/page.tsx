import { hasQuizInventory } from "@/lib/quiz-availability";
// src/app/certifications/[slug]/page.tsx
import type { Metadata } from "next";
import { CertificationDetailView } from "@/app/_views/CertificationDetailView";
import { getCertificationDetailResult } from "@/lib/server/certs";
import { locales } from "@/lib/i18n";
import { enRootDetailPath, localizedDetailPath, toHreflang } from "@/lib/paths";
import { getCertBySlug as getRegistryCertBySlug } from "@/certifications/registry";
import { P1_LANDING_OVERRIDES } from "@/certifications/editorial/p1-landing-overrides";
import { isCertificationIndexable } from "@/lib/seo/certification-indexability";
import { resolveQuestionCountTokens } from "@/lib/question-count-tokens";

// Robots and canonical metadata depend on live, per-language inventory.
// Keep the route cached, but never retain an obsolete publication decision
// for the 24-hour lifetime used by slower-changing certification content.
export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

// Alias → slug PUBBLICO canonico. Coerente con middleware.ts: chi arriva
// con uno di questi slug deve risolvere sullo stesso slug che middleware.ts
// impone come URL stabile (tensorflow, csharp — non le varianti registry/DB).
const normalizeCertSlug = (slug: string) => {
  if (slug === "network-plus") return "comptia-network-plus";
  if (slug === "comptia-network") return "comptia-network-plus";
  if (slug === "tensorflow-developer") return "tensorflow";
  if (slug === "google-tensorflow") return "tensorflow";
  if (slug === "microsoft-csharp") return "csharp";
  if (slug === "microsoft-c") return "csharp";
  if (slug === "comptia-a") return "comptia-a-plus";
  if (slug === "comptia-cloud") return "comptia-cloud-plus";
  if (slug === "comptia-security") return "security-plus";
  if (slug === "cisco-ccst-security") return "cisco-ccst-cybersecurity";
  return slug;
};

// Slug pubblico → chiave registry/DB, solo dove le due cose differiscono
// (tensorflow/csharp sono lo slug pubblico canonico, ma DB e registry
// interno usano ancora google-tensorflow/microsoft-csharp come chiave).
const PUBLIC_TO_REGISTRY_KEY: Record<string, string> = {
  tensorflow: "google-tensorflow",
  csharp: "microsoft-csharp",
};
const toRegistryKey = (publicSlug: string) =>
  PUBLIC_TO_REGISTRY_KEY[publicSlug] ?? publicSlug;

// Revisione editoriale 2026-10-04: titoli/meta EN coerenti con il contenuto reale (vedi overlay).
const P1_SEO_OVERRIDES: Record<string, { title?: string; description?: string }> = Object.fromEntries(
  Object.entries(P1_LANDING_OVERRIDES).map(([slug, o]) => [slug, { title: o.metaTitle?.en, description: o.metaDescription?.en }])
);

const SEO_OVERRIDES: Record<string, { title?: string; description?: string }> = {
  ...P1_SEO_OVERRIDES,
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
    title: "CCNA 200-301 Practice Test 2026: 1,400+ Exam Questions & Labs | CertifyQuiz",
    description:
      "Practice CCNA 200-301 exam questions: 1,400+ questions with explanations, a full CCNA mock test and 18 interactive labs. Start free.",
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
    title: "CEH Practice Exam 2026 – 1,800+ Questions & 312-50 Simulation | CertifyQuiz",
    description:
      "Prepare for CEH 312-50 with 1,800+ exam-style questions, a timed 125-question simulation and offensive labs. Covers recon, network and web attacks. Start free.",
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
  "tensorflow": {
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
  const registryCert = getRegistryCertBySlug(toRegistryKey(canonicalSlug));

  if (canonicalSlug !== "apple-device-support" && !isCertificationIndexable(canonicalSlug)) {
    return { robots: { index: false, follow: true } };
  }

  if (registryCert?.publicationStatus === "planned") {
    return { robots: { index: false, follow: false } };
  }

  // Metadata controls robots and sitemap eligibility, so do not retain a stale
  // per-language inventory for a full day after a backend content release.
  const detail = await getCertificationDetailResult(toRegistryKey(canonicalSlug), 300);

  // Solo un 404 del backend significa "questa certificazione non esiste".
  if (detail.kind === "not_found") {
    return {
      title: "IT Certification | CertifyQuiz",
      description:
        "Prepare for IT certifications with realistic quizzes and clear explanations.",
      robots: { index: false, follow: true },
    };
  }

  // 429/timeout/5xx: inventario SCONOSCIUTO (non zero). Si prosegue con i dati del
  // registry e senza noindex per inventario; mai un 500 per i metadata.
  const data = detail.kind === "ok" ? detail.data : null;
  const knownCount = data?.questionCountByLang?.en;

  if (
    !isCertificationIndexable({
      slug: canonicalSlug,
      questionCount: knownCount ?? null,
      inventoryUnknown: typeof knownCount !== "number",
    })
  ) {
    return { robots: { index: false, follow: true } };
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com";

  // Il titolo del registry puo' contenere `{questionCount|soglia}`: va risolto, altrimenti
  // con l'API giu' finirebbe grezzo in og:image:alt e nell'URL dell'immagine OG.
  const registryTitle = registryCert?.title?.en
    ? resolveQuestionCountTokens(registryCert.title.en, knownCount, "en")
    : undefined;
  const certName = data?.name_en || data?.name || registryTitle || canonicalSlug;
  const override = SEO_OVERRIDES[canonicalSlug] || {};

  const title =
    override.title ||
    `${certName}: practice exam and quiz preparation | CertifyQuiz`;

  const description =
    override.description ||
    data?.description_en ||
    data?.description ||
    `Prepare for ${certName} with realistic quizzes, exam-style questions and clear explanations.`;

  const pageUrl = `${siteUrl}/certifications/${canonicalSlug}`;
  const category = getCategoryFromSlug(canonicalSlug);

  const ogImage = `${siteUrl}/api/og?type=certification&title=${encodeURIComponent(
    certName
  )}&subtitle=${encodeURIComponent(
    "Practice exam and quiz preparation"
  )}&category=${category}`;

  // Hreflang reciproco: stesso mapping usato da [lang]/certificazioni/[slug]/page.tsx
  // (IT/FR/ES), così il cluster punta in entrambe le direzioni.
  const languages: Record<string, string> = {};
  for (const l of locales) {
    if (!hasQuizInventory(data?.questionCountByLang?.[l])) continue;
    languages[toHreflang(l)] =
      l === "en"
        ? new URL(enRootDetailPath(canonicalSlug), siteUrl).toString()
        : new URL(localizedDetailPath(l, canonicalSlug), siteUrl).toString();
  }
  if (hasQuizInventory(data?.questionCountByLang?.en)) {
    languages["x-default"] = new URL(enRootDetailPath(canonicalSlug), siteUrl).toString();
  }

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
      languages,
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

  // CertificationDetailView fa il proprio fetch/lookup sulla chiave
  // registry/DB (vedi normalizeDbSlug in _views/CertificationDetailView.tsx),
  // non sullo slug pubblico: le passiamo la stessa chiave di sempre.
  return <CertificationDetailView lang="en" slug={toRegistryKey(canonicalSlug)} />;
}
