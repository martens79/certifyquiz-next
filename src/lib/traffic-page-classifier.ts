/**
 * Classifies Vercel/Next.js page requests for privacy-minimised aggregate
 * counting. No cookies, persistent visitor IDs, IP or fingerprinting.
 * One qualifying navigation is a candidate pageview, not a unique person.
 * Keep this pure; no data is transmitted until a reviewed collection backend exists.
 */
const BOT = /bot|crawler|spider|headless|lighthouse|pagespeed|uptime|monitor|pingdom|curl|wget|python-requests|axios|node-fetch|facebookexternalhit|slurp|bingpreview/i;
const FILE = /\.(?:js|css|png|jpe?g|gif|webp|svg|ico|woff2?|ttf|map|json|xml|txt|pdf|mp[34]|webm)$/i;
export type PageRequestCandidate = {
  method: string;
  pathname: string;
  accept: string | null;
  userAgent: string | null;
  purpose?: string | null;
  secPurpose?: string | null;
  fetchMode?: string | null;
  fetchDest?: string | null;
  nextRouterPrefetch?: string | null;
  nextUrl?: string | null;
};
export function classifyPageRequest(req: PageRequestCandidate): { count: boolean; reason: string } {
  const path = req.pathname;
  if (req.method.toUpperCase() !== "GET") return { count: false, reason: "method" };
  if (!path.startsWith("/") || path.startsWith("//")) return { count: false, reason: "path" };
  if (/^\/(?:api|_next|static|assets|\.well-known)(?:\/|$)/i.test(path) ||
      /^\/(?:robots\.txt|ads\.txt|favicon\.ico|sitemap(?:\.|\/))/i.test(path) ||
      FILE.test(path)) return { count: false, reason: "non_page" };
  const purpose = [req.purpose, req.secPurpose].join(" ").toLowerCase();
  if (/prefetch|prerender/.test(purpose) || req.nextRouterPrefetch === "1" || req.nextUrl === "1")
    return { count: false, reason: "prefetch" };
  if (!req.userAgent || BOT.test(req.userAgent)) return { count: false, reason: "automated_or_unknown" };
  if (!req.accept?.toLowerCase().includes("text/html")) return { count: false, reason: "non_html" };
  if (req.fetchMode && req.fetchMode !== "navigate") return { count: false, reason: "non_navigation" };
  if (req.fetchDest && req.fetchDest !== "document") return { count: false, reason: "non_document" };
  return { count: true, reason: "html_navigation" };
}
