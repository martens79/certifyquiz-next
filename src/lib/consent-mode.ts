export type AnalyticsConsentStatus = "unknown" | "granted" | "denied";

// The current banner collects one analytics preference, not advertising opt-ins.
export function googleConsentState(status: AnalyticsConsentStatus) {
  return {
    analytics_storage: status === "granted" ? "granted" : "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  } as const;
}

// Fail closed until the UI actually collects an explicit marketing preference.
export function marketingConsentGranted(): boolean { return false; }
