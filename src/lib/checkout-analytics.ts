// Only pseudonymous identifiers, and only after the site's existing consent.
const CONSENT_ID_KEY = "cq_conversion_consent_id";
export function checkoutRequestId(scope: string): string {
  const key = `cq_checkout_request:${scope}`;
  try {
    const previous = JSON.parse(sessionStorage.getItem(key) || "null");
    if (previous?.id && previous.expires > Date.now()) return previous.id;
    const id = crypto.randomUUID();
    sessionStorage.setItem(key,JSON.stringify({id,expires:Date.now()+30*60*1000}));
    return id;
  } catch { return crypto.randomUUID(); }
}
export function readStoredAnalyticsConsent(): "granted" | "denied" | "unknown" {
  try {
    const current = JSON.parse(localStorage.getItem("cq_cookie_consent") || "{}");
    if (typeof current.accepted === "boolean") return current.accepted ? "granted" : "denied";
    const legacy = JSON.parse(localStorage.getItem("cq:cookie-consent") || "{}");
    if (legacy.status === "accepted" || legacy.status === "rejected") return legacy.status === "accepted" ? "granted" : "denied";
    const text = localStorage.getItem("cookie-consent");
    if (text === "accepted" || text === "rejected") return text === "accepted" ? "granted" : "denied";
  } catch { return "denied"; }
  return "unknown";
}
export function analyticsConsentGranted(): boolean { return readStoredAnalyticsConsent() === "granted"; }
export async function checkoutAnalyticsContext(): Promise<Record<string, unknown>> {
  if (typeof window === "undefined" || !analyticsConsentGranted()) return {analytics_consent:false,marketing_consent:false};
  let consentId: string;
  try {
    consentId = localStorage.getItem(CONSENT_ID_KEY) || crypto.randomUUID();
    localStorage.setItem(CONSENT_ID_KEY,consentId);
  } catch { return {analytics_consent:false,marketing_consent:false}; }
  const gtag = (window as typeof window & {gtag?: (...args: unknown[]) => void}).gtag;
  const measurement = process.env.NEXT_PUBLIC_GA_ID;
  const read = (field: string): Promise<string | null> => new Promise(resolve => {
    if (!gtag || !measurement) { resolve(null); return; }
    const timeout = setTimeout(() => resolve(null),400);
    gtag("get",measurement,field,(value: unknown) => {clearTimeout(timeout);resolve(typeof value === "string" || typeof value === "number" ? String(value) : null);});
  });
  const [client,session] = await Promise.all([read("client_id"),read("session_id")]);
  // Consent may have changed while waiting for the Google tag.
  if (!analyticsConsentGranted()) return {analytics_consent:false,marketing_consent:false};
  const fbp = document.cookie.split(";").map(x=>x.trim()).find(x=>x.startsWith("_fbp="))?.slice(5) || null;
  return {consent_id:consentId,analytics_consent:true,marketing_consent:true,ga_client_id:client,ga_session_id:session,fbp};
}

export function revokeConversionConsent() {
  try {
    const consentId = localStorage.getItem(CONSENT_ID_KEY);
    if (!consentId) return;
    // Revocation-only endpoint cannot grant consent or query a customer's data.
    void fetch("/api/backend/billing/analytics-consent/revoke",{method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({consent_id:consentId}),keepalive:true}).then(response=>{
        if (response.ok && localStorage.getItem(CONSENT_ID_KEY) === consentId) localStorage.removeItem(CONSENT_ID_KEY);
      }).catch(()=>{});
  } catch {}
}
