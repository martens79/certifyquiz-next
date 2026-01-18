import type { Metadata } from "next";
import type { Locale } from "@/lib/paths";

import PricingPage from "../(marketing)/_pricing/PricingPage";
import { generatePricingMetadata } from "../(marketing)/_pricing/metadata";

export async function generateMetadata({
  params,
}: {
  params: { lang: Locale };
}): Promise<Metadata> {
  return generatePricingMetadata(params.lang);
}

export default function Page({ params }: { params: { lang: Locale } }) {
  return <PricingPage lang={params.lang} />;
}
