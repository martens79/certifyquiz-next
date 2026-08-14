"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { Locale } from "@/lib/paths";
import { trackEvent, userStatusFrom } from "@/lib/analytics";
import { useAuth } from "@/components/auth/AuthProvider";

type Props = {
  href: string;
  className: string;
  children: ReactNode;
  lang: Locale;
  certificationId: number | null;
  certificationSlug: string;
  resourceType: "quiz" | "reviews" | "guide" | "map" | "labs" | "scenarios";
};

/**
 * Wrapper client-only intorno a next/link, solo per l'evento
 * study_resource_clicked sulla griglia "Materiale di studio".
 *
 * StudyMaterialGrid resta un Server Component (niente client boundary per
 * il resto della pagina certificazione): Next.js non permette di passare un
 * onClick a un elemento renderizzato in un Server Component, quindi solo il
 * link cliccabile diventa client, non l'intera griglia.
 */
export default function TrackedResourceLink({
  href,
  className,
  children,
  lang,
  certificationId,
  certificationSlug,
  resourceType,
}: Props) {
  const { loading, user } = useAuth();

  return (
    <Link
      href={href}
      className={className}
      onClick={() =>
        trackEvent("study_resource_clicked", {
          certification_id: certificationId,
          certification_slug: certificationSlug,
          language: lang,
          user_status: userStatusFrom(loading ? null : user),
          source: "certification_page",
          resource_type: resourceType,
        })
      }
    >
      {children}
    </Link>
  );
}
