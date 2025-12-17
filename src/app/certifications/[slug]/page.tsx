import type { Metadata } from "next";
import CertificationDetailPage from "@/app/[lang]/certificazioni/[slug]/page";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.certifyquiz.com/certifications/[slug]",
  },
};

export default function CertificationRootEN({
  params,
}: {
  params: { slug: string };
}) {
  // @ts-expect-error server wrapper
  return <CertificationDetailPage params={{ lang: "en", slug: params.slug }} />;
}
