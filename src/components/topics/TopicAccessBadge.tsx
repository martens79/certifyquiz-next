// src/components/topics/TopicAccessBadge.tsx
// Free / Premium / Locked label for topics of certifications with a topic gate
// (PLC Fundamentals). Backend contract: docs/plc-fundamentals/PLC_FUNDAMENTALS_TOPIC_ACCESS_GATE.md
//
// - The static tier (`access_tier`) comes from the cached topic list, so the first paint is
//   already correct for a guest: "Free" or "Premium".
// - The per-user status is fetched client-side from GET /topics/:certId/access (never cached)
//   and can only upgrade "Premium" to "Premium · unlocked", or confirm "Locked".
// - Ordinary certifications (access_tier null) render nothing and cause no request.
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiGet } from "@/lib/apiClient";

export type AccessTier = "free" | "premium" | null | undefined;
type Status = "open" | "free" | "unlocked" | "locked";
type AccessPayload = { entitled?: boolean; topics?: Array<{ id: number; status: Status }> };
type Lang = "it" | "en" | "fr" | "es";

const requests = new Map<number, Promise<Map<number, Status>>>();

function loadStatuses(certId: number): Promise<Map<number, Status>> {
  let p = requests.get(certId);
  if (!p) {
    p = apiGet<AccessPayload>(`/topics/${certId}/access`)
      .then((data) => new Map((data.topics ?? []).map((t) => [t.id, t.status] as const)))
      .catch(() => new Map<number, Status>());
    requests.set(certId, p);
  }
  return p;
}

const LABELS: Record<Lang, { free: string; premium: string; unlocked: string; locked: string; cta: string }> = {
  it: { free: "Gratis", premium: "Premium", unlocked: "Premium · sbloccato", locked: "Bloccato · Premium", cta: "Passa a Premium" },
  en: { free: "Free", premium: "Premium", unlocked: "Premium · unlocked", locked: "Locked · Premium", cta: "Go Premium" },
  fr: { free: "Gratuit", premium: "Premium", unlocked: "Premium · débloqué", locked: "Verrouillé · Premium", cta: "Passer à Premium" },
  es: { free: "Gratis", premium: "Premium", unlocked: "Premium · desbloqueado", locked: "Bloqueado · Premium", cta: "Pasar a Premium" },
};

export function premiumHref(lang: Lang): string {
  return lang === "en" ? "/premium" : `/${lang}/premium`;
}

export default function TopicAccessBadge({
  certId,
  topicId,
  tier,
  lang,
}: {
  certId: number;
  topicId: number;
  tier: AccessTier;
  lang: Lang;
}) {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    if (tier !== "free" && tier !== "premium") return;
    let alive = true;
    loadStatuses(certId).then((m) => {
      if (alive) setStatus(m.get(topicId) ?? null);
    });
    return () => {
      alive = false;
    };
  }, [certId, topicId, tier]);

  if (tier !== "free" && tier !== "premium") return null;

  const t = LABELS[lang] ?? LABELS.en;
  const effective: "free" | "premium" | "unlocked" | "locked" =
    status === "unlocked" ? "unlocked" : status === "locked" ? "locked" : tier === "free" ? "free" : "premium";

  const style =
    effective === "free"
      ? "bg-emerald-100 text-emerald-800 border-emerald-300"
      : effective === "unlocked"
      ? "bg-amber-100 text-amber-900 border-amber-300"
      : "bg-slate-100 text-slate-800 border-slate-300";
  const text = effective === "free" ? t.free : effective === "unlocked" ? t.unlocked : effective === "locked" ? t.locked : t.premium;

  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <span
        data-topic-access={effective}
        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${style}`}
      >
        {effective === "locked" ? <span aria-hidden="true">🔒</span> : null}
        {text}
      </span>
      {effective === "locked" ? (
        <Link href={premiumHref(lang)} className="text-xs font-semibold text-blue-700 underline">
          {t.cta}
        </Link>
      ) : null}
    </span>
  );
}
