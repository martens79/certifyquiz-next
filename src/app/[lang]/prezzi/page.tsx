// src/app/[lang]/prezzi/page.tsx
import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";

import PricingPage from "../(marketing)/_pricing/PricingPage";
import { generatePricingMetadata } from "../(marketing)/_pricing/metadata";

export async function generateMetadata(props: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await props.params;
  return generatePricingMetadata(lang);
}

// ✅ Next page wrapper (PageProps-friendly)
export default async function Page(props: { params: Promise<{ lang: Locale }> }) {
  return <PricingPage {...props} />;
}
