import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import PremiumComingSoonView from "../../(marketing)/pricing/PremiumComingSoonView";
import { pricingMetadata, pricingSlugRedirect } from "@/lib/seo/pricing-metadata";

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

// "prezzi" e' lo slug italiano: fr/es/en hanno route proprie (/fr/prix, /es/precios, /pricing). /fr/prezzi e
// /es/prezzi rimandano alla pagina canonica (query commerciale conservata), ogni altro segmento e' un 404.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return lang === "it" ? pricingMetadata("it") : { robots: { index: false, follow: false } };
}

export default async function Page({ params, searchParams }: Props) {
  const { lang } = await params;
  const target = pricingSlugRedirect(lang);
  if (target) {
    const qs = new URLSearchParams();
    for (const [key, value] of Object.entries(await searchParams)) {
      for (const v of Array.isArray(value) ? value : value === undefined ? [] : [value]) qs.append(key, v);
    }
    permanentRedirect(qs.size ? `${target}?${qs}` : target);
  }
  if (lang !== "it") notFound();
  return <PremiumComingSoonView />;
}
