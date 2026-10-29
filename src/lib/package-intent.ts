// Functional purchase choice only; no identity, price or analytics identifiers.
// A return never creates a checkout: the current server offer needs a new click.
import { safeInternalRedirect } from "@/lib/conversion-context";
import { type Locale } from "@/lib/paths";

const KEY = "cq_package_intent";
export const PACKAGE_INTENT_TTL = 30 * 60 * 1000;
type StorageLike = Pick<Storage, "getItem" | "setItem">;
type Intent = { offerCode: string; certificationSlug: string; lang: Locale; at: number };
const valid = (s: unknown): s is string => typeof s === "string" && /^[a-z0-9][a-z0-9_-]{0,99}$/i.test(s);
function storage(): StorageLike | null {
  try { return sessionStorage; } catch { return null; }
}
export function savePackageIntent(intent: Omit<Intent, "at">, target = storage(), now = Date.now()) {
  if (!valid(intent.offerCode) || !valid(intent.certificationSlug)) return;
  try { target?.setItem(KEY, JSON.stringify({ ...intent, at: now })); } catch { /* URL still offers manual selection. */ }
}
export function readPackageIntent(certificationSlug: string, lang: Locale, target = storage(), now = Date.now()): string | null {
  try {
    const p = JSON.parse(target?.getItem(KEY) || "null");
    return p && valid(p.offerCode) && p.certificationSlug === certificationSlug && p.lang === lang &&
      Number.isFinite(p.at) && p.at <= now && now - p.at <= PACKAGE_INTENT_TTL ? p.offerCode : null;
  } catch { return null; }
}
export function packageReturnPath(pathname: string, search: string, offerCode: string): string | null {
  const path = safeInternalRedirect(pathname);
  if (!path || !valid(offerCode)) return null;
  const input = new URLSearchParams(search);
  const out = new URLSearchParams();
  for (const key of ["source", "cta", "certification_slug"]) {
    const v = input.get(key);
    if (valid(v)) out.set(key, v);
  }
  out.set("package_offer", offerCode);
  return `${path}?${out}#package-resume`;
}
