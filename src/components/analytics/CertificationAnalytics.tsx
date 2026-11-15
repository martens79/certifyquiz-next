"use client";

import { useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { analyticsUserStateFrom, trackEventOnce, trackFunnelEventOnce } from "@/lib/analytics";

import { useConsent } from "./ConsentProvider";

export default function CertificationAnalytics({ slug, id, language }: { slug: string; id?: number; language: string }) {
  const { status: consentStatus } = useConsent();
  const { loading, user } = useAuth();
  useEffect(() => {
    if (loading) return;
    trackEventOnce(`certification_viewed:${slug}:${language}`, "certification_viewed", {
      certification_slug: slug,
      certification_id: id,
      language,
      user_state: analyticsUserStateFrom(user),
      source_page: "certification",
    });
    trackFunnelEventOnce(`certification_viewed:${slug}:${language}`, {
      event: "certification_viewed", cert_slug: slug, lang: language,
    });
  }, [loading, user, slug, id, language, consentStatus]);
  return null;
}
