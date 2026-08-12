// src/lib/rewarded-ads.ts
//
// Client verso il flusso Rewarded Ads server-side. Nessuna decisione di
// eligibility/cap/rollout viene presa qui: questo file chiama il backend e
// riporta quello che risponde. Il kill-switch NEXT_PUBLIC_REWARDED_ADS_UI_ENABLED
// è una seconda barriera lato client (oltre a REWARDED_ADS_ENABLED lato
// server, che resta l'unica fonte autorevole): finché non è "true", il
// componente CTA non chiama nemmeno /rewarded-ads/state.

import { apiFetch, apiFetchJson } from "@/lib/auth";

export type RewardedPlacement = "locked_wrong_explanation";
export type RewardType = "single_explanation";

export type RewardedAdsState = {
  enabled: boolean;
  eligible: boolean;
  reason:
    | "eligible"
    | "disabled"
    | "excluded_user"
    | "package_full_access"
    | "not_in_treatment"
    | "holdout"
    | "cap_reached_daily"
    | "cap_reached_weekly"
    | "cooldown";
  variant: "treatment" | "control" | "holdout" | "unassigned" | null;
  caps?: { dailyUsed: number; dailyCap: number; weeklyUsed: number; weeklyCap: number; cooldownRemainingSec: number };
  rewardType?: RewardType;
};

export function isRewardedAdsUiEnabled(): boolean {
  return process.env.NEXT_PUBLIC_REWARDED_ADS_UI_ENABLED === "true";
}

export async function fetchRewardedAdsState(certificationId?: number | null): Promise<RewardedAdsState | null> {
  if (!isRewardedAdsUiEnabled()) return null;
  try {
    const qs = certificationId ? `?certification_id=${encodeURIComponent(certificationId)}` : "";
    return await apiFetchJson<RewardedAdsState>(`/rewarded-ads/state${qs}`);
  } catch {
    return null;
  }
}

export async function createRewardIntent(input: {
  certificationId: number;
  questionId?: number | null;
  sessionId?: string | null;
  placement?: RewardedPlacement;
}) {
  return apiFetchJson<{ intentId: string; expiresAt: string; variant: string; reused: boolean }>(
    "/rewarded-ads/intent",
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) }
  );
}

export async function markAdStarted(intentId: string) {
  return apiFetchJson<{ intentId: string; status: string }>("/rewarded-ads/ad-started", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ intentId }),
  });
}

export async function markAdCompleted(intentId: string, providerPayload: Record<string, unknown> = {}) {
  return apiFetchJson<{ grantId: number; intentId: string; expiresAt: string; questionId: number | null }>(
    "/rewarded-ads/ad-completed",
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ intentId, providerPayload }) }
  );
}

export async function markAdFailed(intentId: string, reason: string) {
  await apiFetch("/rewarded-ads/ad-failed", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ intentId, reason }),
  }).catch(() => {});
}

export async function consumeRewardGrant(grantId: number, questionId: number) {
  return apiFetchJson<{ consumed: boolean; questionId: number | null; reused: boolean }>("/rewarded-ads/consume", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ grantId, questionId }),
  });
}
