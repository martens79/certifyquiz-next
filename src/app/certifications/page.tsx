import type { Metadata } from "next";
import CertificationsPage from "@/app/[lang]/certificazioni/page";

const SITE =
  (process.env.NEXT_PUBLIC_SITE_URL || "https://www.certifyquiz.com").replace(
    /\/+$/,
    ""
  );

export const metadata: Metadata = {
  alternates: { canonical: `${SITE}/certifications` },
};

export default function CertificationsRootEN() {
  // @ts-expect-error server wrapper
  return <CertificationsPage params={{ lang: "en" }} />;
}
