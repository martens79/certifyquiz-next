import type { Metadata } from "next";
import { notFound } from "next/navigation";
import OffensiveSecurityPathPage from "@/features/offensive-path/OffensiveSecurityPathPage";
import { buildOffensivePathMetadata } from "@/features/offensive-path/metadata";

// Live counts / CEH lab list are ISR-cached for 1h (see features/offensive-path/data.ts).
export const revalidate = 3600;

type Lang = "it" | "es" | "fr";
const LANGS: readonly Lang[] = ["it", "es", "fr"];

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!LANGS.includes(lang as Lang)) return {};
  return buildOffensivePathMetadata(lang as Lang);
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!LANGS.includes(lang as Lang)) notFound();
  return <OffensiveSecurityPathPage lang={lang as Lang} />;
}
