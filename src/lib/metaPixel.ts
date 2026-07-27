export function trackMetaPixel(
  eventName: string,
  params?: Record<string, unknown>,
  attempt = 0
) {
  if (typeof window === "undefined") return;
  const fbq = (window as typeof window & { fbq?: (...args: any[]) => void }).fbq;

  if (typeof fbq === "function") {
    fbq("track", eventName, params);
    return;
  }

  // fbq loads asynchronously after consent is granted, and can lag behind
  // effects that fire earlier in the tree (e.g. on /premium/success). Retry
  // for a few seconds instead of silently dropping the event.
  if (attempt >= 50) return;
  setTimeout(() => trackMetaPixel(eventName, params, attempt + 1), 100);
}

export const PREMIUM_PLAN_VALUES: Record<string, number> = {
  premium_monthly: 9.99,
  premium_quarterly: 19.99,
  premium_annual: 59.99,
};
