import { chromium } from "playwright";
import { writeFile } from "node:fs/promises";
import path from "node:path";

const base = "https://www.certifyquiz.com";
const paths = [
  "/en/quiz/ccna",
  "/en/quiz/ccna/mock-exam",
  "/login",
  "/register",
  "/profile",
  "/admin",
  "/premium/success",
  "/premium/cancel",
  "/packages/success",
  "/certifications/ccna",
  "/it/certificazioni/ccna",
  "/fr/certifications/ccna",
  "/es/certificaciones/ccna",
  "/blog/cia-triad-explained-with-real-examples-confidentiality-integrity-and-availability-security",
  "/it/blog/triade-cia-spiegata-semplice-riservatezza-integrita-e-disponibilita-security",
  "/fr/blog/triade-cia-expliquee-avec-des-exemples-concrets-confidentialite-integrite-et-disponibilite",
  "/es/blog/switching-y-vlan-la-base-real-de-cualquier-red-moderna-ccnp-enterprise",
];

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  page.setDefaultTimeout(5_000);
  const rows = [];
  for (const path of paths) {
    const response = await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded", timeout: 30_000 });
    rows.push({
      path,
      status: response?.status(),
      finalUrl: page.url(),
      title: await page.title(),
      robots: await page.locator('meta[name="robots"]').count() ? await page.locator('meta[name="robots"]').first().getAttribute("content") : null,
      canonical: await page.locator('link[rel="canonical"]').count() ? await page.locator('link[rel="canonical"]').first().getAttribute("href") : null,
      articleJsonLd: await page.locator('script[type="application/ld+json"]').evaluateAll(nodes => nodes.filter(node => node.textContent?.includes('"@type":"Article"') || node.textContent?.includes('"@type": "Article"')).length),
    });
  }
  await browser.close();
  await writeFile(path.resolve(process.cwd(), "..", "docs", "adsense-final-route-check.json"), JSON.stringify(rows, null, 2));
  console.log(JSON.stringify(rows, null, 2));
}

main().catch(error => { console.error(error); process.exitCode = 1; });
