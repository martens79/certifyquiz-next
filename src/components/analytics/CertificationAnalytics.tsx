"use client";

import { useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { analyticsUserStateFrom, trackEventOnce } from "@/lib/analytics";

export default function CertificationAnalytics({ slug, id, language }: { slug: string; id?: number; language: string }) {
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
  }, [loading, user, slug, id, language]);
  return null;
}
