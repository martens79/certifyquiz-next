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
  "/certifications/sap-successfactors",
  "/it/certificazioni/sap-successfactors",
  "/fr/certifications/sap-successfactors",
  "/es/certificaciones/sap-successfactors",
  "/it/terms",
  "/it/termini",
];

const PLACEHOLDER_MARKERS = [
  "content in preparation",
  "contenuto in preparazione",
  "contenu en préparation",
  "contenido en preparación",
  "will be added later",
];

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  page.setDefaultTimeout(5_000);
  await page.goto(`${base}/sitemap.xml`, { waitUntil: "domcontentloaded", timeout: 30_000 });
  const sitemapUrls = await page.locator("loc").allTextContents();
  const sitemapViolations = [];
  for (const url of sitemapUrls) {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });
    const mainText = (await page.locator("main").last().innerText().catch(() => ""))
      .replace(/\s+/g, " ")
      .trim();
    const normalized = mainText.toLocaleLowerCase();
    const marker = PLACEHOLDER_MARKERS.find((value) => normalized.includes(value));
    if (marker) sitemapViolations.push({ url, reason: `placeholder marker: ${marker}` });
  }

  if (sitemapViolations.length) {
    throw new Error(`AdSense sitemap policy failed:\n${JSON.stringify(sitemapViolations, null, 2)}`);
  }

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

  for (const row of rows.filter((item) => item.path.includes("sap-successfactors"))) {
    if (!row.robots?.includes("noindex")) {
      throw new Error(`Expected noindex on ${row.path}, received ${row.robots ?? "no robots meta"}`);
    }
  }

  const termsAlias = rows.find((row) => row.path === "/it/terms");
  if (termsAlias?.finalUrl !== `${base}/it/termini`) {
    throw new Error(`Expected /it/terms to redirect to /it/termini, received ${termsAlias?.finalUrl}`);
  }
  await browser.close();
  await writeFile(path.resolve(process.cwd(), "..", "docs", "adsense-final-route-check.json"), JSON.stringify(rows, null, 2));
  console.log(JSON.stringify(rows, null, 2));
}

main().catch(error => { console.error(error); process.exitCode = 1; });
