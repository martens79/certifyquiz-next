// Quiz surfaces (topic list, mixed quiz, timed practice) of a certification that is not launched do not exist.
// EIPASS Standard has no question inventory and no DB certification: its quiz routes answer 404 in every mode.
// The Italian landing is the only public Standard page.
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { getCertBySlug } from "@/certifications/registry";
import { isPlannedCertification, isPlannedPreviewEnabled } from "@/certifications/publication";
import { isEipassStandardSlug } from "@/lib/eipass-standard";

export default async function QuizSlugLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { slug } = await params;
  if (isEipassStandardSlug(slug)) notFound();
  if (isPlannedCertification(getCertBySlug(slug)) && !isPlannedPreviewEnabled()) notFound();
  return children;
}
