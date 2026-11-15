import type { Metadata } from "next";

import PremiumComingSoonView from "@/app/(marketing)/pricing/PremiumComingSoonView";
import { pricingMetadata } from "@/lib/seo/pricing-metadata";

export const metadata: Metadata = pricingMetadata("fr");

export default function Page() {
  return <PremiumComingSoonView forceLang="fr" />;
}
