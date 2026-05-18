// src/app/hub/[slug]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import type { Locale } from "@/lib/i18n";
import CertificationHubPage, { type HubResolvedCert } from "@/components/CertificationHubPage";
import { CERTS_BY_SLUG } from "@/certifications/registry";

// ✅ IMPORT RELATIVO (niente @/content/...)
import { HUBS_BY_SLUG } from "../../../content/hubs/registry";
import type { HubData, HubSection } from "../../../content/hubs/vendor-domains/google-cloud";

// ✅ IMPORTANTE: evita 404 in produzione per nuovi slug
export const dynamicParams = true;

const lang: Locale = "en";

// ✅ CERT EN root: /certifications/...
const certHref = (slug: string) => `/certifications/${slug}`;

// ✅ QUIZ EN: MAI root → /en/quiz/...
const quizHref = (slug: string) => `/en/quiz/${slug}`;

// ✅ Next 15: params tipizzati come Promise nel PageProps
type Params = { slug: string };

// ✅ Override SEO manuali per hub specifici
const SEO_HUB_OVERRIDES: Record<string, { title?: string; description?: string }> = {
  oracle: {
    title: "Oracle Database Certification – Practice Test & Quiz 2026 | CertifyQuiz",
    description:
      "Prepare for Oracle Database SQL certification with exam-style questions. Practice SQL, data modeling and database objects. Start free.",
  },
  google: {
    title: "Google Certifications – Practice Tests & Quizzes 2026 | CertifyQuiz",
    description:
      "Prepare for Google certifications with practice quizzes. Covers Google Cloud, TensorFlow, and more. Start free.",
  },
  aws: {
    title: "AWS Certifications – Practice Tests & Quizzes 2026 | CertifyQuiz",
    description:
      "Prepare for AWS certifications with exam-style questions. Covers Cloud Practitioner, Solutions Architect, and more. Start free.",
  },
  microsoft: {
    title: "Microsoft Certifications – Practice Tests & Quizzes 2026 | CertifyQuiz",
    description:
      "Prepare for Microsoft certifications with practice quizzes. Covers Azure, AI, SQL Server, and more. Start free.",
  },
  cisco: {
    title: "Cisco Certifications – Practice Tests & Quizzes 2026 | CertifyQuiz",
    description:
      "Prepare for Cisco certifications with exam-style questions. Covers CCNA, CCST Networking, CCST Cybersecurity. Start free.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const hub = HUBS_BY_SLUG[slug];

  if (!hub) return { title: "CertifyQuiz" };

  const override = SEO_HUB_OVERRIDES[slug] || {};

  const title =
    override.title ??
    (hub.title?.en ? `${hub.title.en} | CertifyQuiz` : "CertifyQuiz");

  const description =
    override.description ??
    hub.description?.en ??
    "Practice for IT certifications with realistic quizzes and clear explanations.";

  return {
    title,
    description,
  };
}

export default async function HubEnRootPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;

  const hub: HubData | undefined = HUBS_BY_SLUG[slug];
  if (!hub) return notFound();

 // -------------------- Vendor overview --------------------
if (hub.hubKind === "vendor") {
  const vendorLabel = hub.vendorKey?.toUpperCase?.() ?? "VENDOR";

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      {/* HERO */}
      <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-blue-50 p-8 shadow-sm">
        <div className="max-w-3xl">
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
              {vendorLabel}
            </span>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
              CERTIFICATION HUB
            </span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 md:text-5xl">
            {hub.title.en}
          </h1>

          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            {hub.description.en}
          </p>
        </div>
      </section>

      {/* HUB SECTIONS */}
      <section className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
        {hub.sections.map((s: HubSection, idx: number) => (
          <a
            key={idx}
            href={s.hrefByLang(lang)}
            className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="text-3xl">
                {idx === 0 && "☁️"}
                {idx === 1 && "🏗️"}
                {idx === 2 && "⚙️"}
                {idx === 3 && "🔐"}
                {idx === 4 && "📊"}
              </div>

              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700">
                PATH
              </span>
            </div>

            <h2 className="mt-5 text-2xl font-extrabold text-slate-950">
              {s.title.en}
            </h2>

            {s.description?.en ? (
              <p className="mt-3 leading-relaxed text-slate-600">
                {s.description.en}
              </p>
            ) : null}

            <div className="mt-6 inline-flex items-center text-sm font-bold text-blue-700 transition group-hover:translate-x-1">
              Open path →
            </div>
          </a>
        ))}
      </section>
    </main>
  );
}
  // -------------------- Hub con certificazioni (google-cloud, ecc.) --------------------
  const resolved: HubResolvedCert[] = hub.certs
    .map((item) => {
      const cert = CERTS_BY_SLUG[item.slug];
      if (!cert) return null;

      return {
        ...item,
        name: cert.title?.en ?? item.slug,
        shortDescription: cert.description?.en ?? "",
        logoUrl: cert.imageUrl,
        certPageHref: certHref(item.slug),
        quizHref: quizHref(item.slug),
      };
    })
    .filter(Boolean) as HubResolvedCert[];

  return (
    <CertificationHubPage
      lang={lang}
      title={hub.title}
      description={hub.description}
      certs={resolved}
    />
  );
}