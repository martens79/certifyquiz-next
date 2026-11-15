// src/app/pricing/page.tsx
import type { Metadata } from "next";

import PricingView from "@/app/(marketing)/pricing/PremiumComingSoonView";
import { pricingMetadata } from "@/lib/seo/pricing-metadata";

export const metadata: Metadata = pricingMetadata("en");

export default function Page() {
  return <PricingView />;
}
