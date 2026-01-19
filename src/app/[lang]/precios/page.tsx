import type { Metadata } from "next";
import type { Locale } from "@/lib/paths";

import PricingPage from "../(marketing)/_pricing/PricingPage";
import { generatePricingMetadata } from "../(marketing)/_pricing/metadata";

type Params = Promise<{ lang: Locale }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang } = await params;
  return generatePricingMetadata(lang);
}

export default async function Page({ params }: { params: Params }) {
  const { lang } = await params;
  return <PricingPage lang={lang} />;
}
