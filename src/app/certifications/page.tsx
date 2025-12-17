import type { Metadata } from "next";
import CertificationsPage from "@/app/[lang]/certificazioni/page";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.certifyquiz.com/certifications",
  },
};

export default function CertificationsRootEN() {
  // riuso totale della pagina /[lang]/certificazioni
  // forzando lang = "en"
  // @ts-expect-error server wrapper
  return <CertificationsPage params={{ lang: "en" }} />;
}
