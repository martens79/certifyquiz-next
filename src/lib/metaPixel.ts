export function trackMetaPixel(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const fbq = (window as typeof window & { fbq?: (...args: any[]) => void }).fbq;
  if (typeof fbq !== "function") return;
  fbq("track", eventName, params);
}

export const PREMIUM_PLAN_VALUES: Record<string, number> = {
  premium_monthly: 9.99,
  premium_quarterly: 19.99,
  premium_annual: 59.99,
};
