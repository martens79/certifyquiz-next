import type { Metadata } from "next";
import PricingPage from "@/app/[lang]/(marketing)/_pricing/PricingPage";
import { generatePricingMetadata } from "@/app/[lang]/(marketing)/_pricing/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return generatePricingMetadata("en");
}

export default function Page() {
  return <PricingPage lang="en" />;
}
