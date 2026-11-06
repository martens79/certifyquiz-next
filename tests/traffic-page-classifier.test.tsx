import { test } from "node:test";
import assert from "node:assert/strict";
import { classifyPageRequest, type PageRequestCandidate } from "../src/lib/traffic-page-classifier";

const normal: PageRequestCandidate = {
  method: "GET", pathname: "/it/ccna", accept: "text/html,application/xhtml+xml",
  userAgent: "Mozilla/5.0 Chrome/120 Safari/537.36",
  fetchMode: "navigate", fetchDest: "document",
};
test("counts a candidate HTML page navigation, not a unique user", () => {
  assert.deepEqual(classifyPageRequest(normal), { count: true, reason: "html_navigation" });
});
for (const [name, changes] of Object.entries<Partial<PageRequestCandidate>>({
  post: { method: "POST" },
  api: { pathname: "/api/auth/me" },
  assets: { pathname: "/_next/static/chunk.js" },
  pdf: { pathname: "/it/guides/test.pdf" },
  robots: { pathname: "/robots.txt" },
  prefetch: { purpose: "prefetch" },
  routerPrefetch: { nextRouterPrefetch: "1" },
  nextData: { nextUrl: "1" },
  bot: { userAgent: "Googlebot/2.1" },
  headless: { userAgent: "HeadlessChrome" },
  missingUA: { userAgent: null },
  json: { accept: "application/json" },
  xhr: { fetchMode: "cors" },
  image: { fetchDest: "image" },
})) {
  test("rejects " + name, () => {
    assert.equal(classifyPageRequest({ ...normal, ...changes }).count, false);
  });
}
