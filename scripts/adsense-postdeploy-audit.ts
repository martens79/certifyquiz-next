import { chromium } from "playwright";
import { loadEnvConfig } from "@next/env";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

loadEnvConfig(process.cwd());
const SITE = "https://www.certifyquiz.com";
const LOCALES = ["it", "en", "fr", "es"] as const;
type Locale = (typeof LOCALES)[number];

function words(text: string) { return text.trim().split(/\s+/).filter(Boolean).length; }
function collectStrings(value: unknown, out: string[]): void {
  if (typeof value === "string") { out.push(value); return; }
  if (Array.isArray(value)) { for (const item of value) collectStrings(item, out); return; }
  if (value && typeof value === "object") for (const [key, item] of Object.entries(value)) if (!["_key", "_type", "asset", "markDefs"].includes(key)) collectStrings(item, out);
}
function bodyWords(value: unknown) { const out: string[] = []; collectStrings(value, out); return words(out.join(" ")); }
const pause = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
function localeOf(url: string): Locale {
  const first = new URL(url).pathname.split("/").filter(Boolean)[0];
  return (LOCALES.includes(first as Locale) ? first : "en") as Locale;
}
function slugOf(url: string) { return new URL(url).pathname.split("/").filter(Boolean).at(-1) || ""; }
function articleSignature(title: string, slug: string) {
  const s = `${title} ${slug}`.toLowerCase();
  const rules: Array<[string, RegExp]> = [
    ["cia-triad", /cia|triad[ea]/], ["network-concepts", /network.concepts|concetti.di.rete|conceptos.de.red|concepts.r.seau/],
    ["aws-cloud-fundamentals", /aws.cloud.fundament/], ["covering-tracks", /covering.tracks/],
    ["unauthorized-access", /unauthorized.access|accesso.non.autorizzato|acceso.no.autorizado|acc.s.non.autoris/],
    ["incident-response", /incident.response/], ["risk-management", /risk.management|gestione.dei.rischi|gesti.n.de.riesgos|gestion.des.risques/],
    ["ccna-troubleshooting", /ccna.troubleshooting.*7/], ["ccna-technical-support", /ccna.technical.support/],
    ["ceh-worth", /ceh.2026.*worth|ceh.2026.*utile|ceh.2026.*utile/], ["cissp-worth", /cissp.*worth|cissp.*vale|cissp.*vaut/],
    ["how-certifyquiz", /how.certifyquiz|come.funziona.certifyquiz/], ["ports-protocols", /ports.and.protocols|porte.e.protocolli|puertos.y.protocolos|ports.et.protocoles/],
    ["vlan", /(^|\W)vlan(\W|$)/],
  ];
  return rules.find(([, re]) => re.test(s))?.[0] || "";
}
function gaps(category: string) {
  const common = "Aggiungere spiegazioni originali, esempi applicati, errori comuni, fonti ufficiali e collegamenti a certificazione/quiz pertinenti.";
  const specific: Record<string, string> = {
    security: "Includere scenario di minaccia/difesa, controlli compensativi e limiti delle tecniche descritte.",
    networking: "Includere diagramma o flusso, esempio di configurazione/troubleshooting e confronto tra protocolli.",
    cloud: "Includere architettura d'esempio, responsabilità condivisa, scelta del servizio e considerazioni costo/sicurezza.",
  };
  return `${common} ${specific[category] || "Includere un caso pratico e una checklist di studio verificabile."}`;
}
function topicCertification(title: string, slug: string, category: string) {
  const s = `${title} ${slug}`.toLowerCase();
  const keys = ["ccna", "ccst", "security+", "security-plus", "cissp", "isc2 cc", "ceh", "aws cloud practitioner", "azure fundamentals", "itil", "comptia", "eipass", "pekit"];
  return keys.find(k => s.includes(k)) || category || "general IT/career";
}

async function main() {
  const outDir = path.resolve(process.cwd(), "..", "docs");
  const previous = await readFile(path.join(outDir, "adsense-postdeploy-evidence.json"), "utf8").then(JSON.parse).catch(() => null);
  const previousTopics = new Map<string, any>((previous?.topics || []).map((x: any) => [`${x.lang}:${x.certification_slug}:${x.slug}`, x]));
  const previousArticles = new Map<string, any>((previous?.articleAudit || []).map((x: any) => [x.url, x]));
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(`${SITE}/sitemap.xml`, { waitUntil: "domcontentloaded" });
  const sitemapUrls = await page.locator("loc").allTextContents();

  const family = (url: string) => {
    const p = new URL(url).pathname;
    if (/\/blog\/[^/]+$/.test(p)) return "blog-article";
    if (/\/(certifications|certificazioni|certificaciones)\/[^/]+\/[^/]+/.test(p)) return "topic-or-review";
    if (/\/(certifications|certificazioni|certificaciones)\/[^/]+$/.test(p)) return "certification-detail";
    if (/\/(certifications|certificazioni|certificaciones)$/.test(p)) return "certification-index";
    if (/\/(giochi|games|jeux|juegos)(\/|$)/.test(p)) return "games";
    if (p.includes("interactive-labs")) return "labs";
    if (/roadmap|\/paths|\/percorsi|\/parcours|\/rutas/.test(p)) return "learning-path";
    if (/review|ripass|revision|repaso/.test(p)) return "reviews";
    if (/scenario|scenari|escenario/.test(p)) return "scenarios";
    if (/privacy|cookie|terms|termini/.test(p)) return "legal";
    return "other";
  };
  const sitemapBreakdown: Record<string, Record<string, number>> = {};
  for (const url of sitemapUrls) {
    const l = localeOf(url), f = family(url);
    sitemapBreakdown[l] ||= {};
    sitemapBreakdown[l][f] = (sitemapBreakdown[l][f] || 0) + 1;
  }

  const articleQuery = `*[_type=="article" && !(_id in path("drafts.**"))]{"slug":slug.current,title,excerpt,lang,category,"publishedAt":coalesce(publishedAt,date),"body":coalesce(body,content),"noindex":seo.noindex}`;
  const project = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";
  await page.goto(`https://${project}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(articleQuery)}&perspective=published`, { waitUntil: "domcontentloaded" });
  const sanityPayload = JSON.parse(await page.locator("body").innerText());
  const articles = sanityPayload.result as any[];
  const articleUrls = articles.map(a => `${a.lang === "en" ? SITE : `${SITE}/${a.lang}`}/blog/${a.slug}`);
  const rendered: any[] = [];
  let next = 0;
  await Promise.all(Array.from({ length: 2 }, async () => {
    const p = await context.newPage();
    while (next < articleUrls.length) {
      const i = next++, url = articleUrls[i];
      try {
        for (let attempt = 0; attempt < 4; attempt++) {
          const response = await p.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });
          if (response?.ok()) break;
          if (attempt === 3) throw new Error(`HTTP ${response?.status()}`);
          await pause(700 * (attempt + 1));
        }
        const mainText = await p.locator("main").last().innerText();
        rendered[i] = { url, wordCount: words(mainText), documentTitle: await p.title(), canonical: await p.locator('link[rel="canonical"]').getAttribute("href"), robots: await p.locator('meta[name="robots"]').getAttribute("content"), jsonLd: await p.locator('script[type="application/ld+json"]').count() };
      } catch (error) { rendered[i] = { url, error: String(error) }; }
    }
    await p.close();
  }));
  const bySlug = new Map(articles.map(a => [`${a.lang}:${a.slug}`, a]));
  const enriched = rendered.map(r => { const article = bySlug.get(`${localeOf(r.url)}:${slugOf(r.url)}`); return { ...r, ...article, renderedWordCount: r.wordCount, editorialBodyWordCount: bodyWords(article?.body) }; });
  const thin = enriched.filter(r => r.renderedWordCount < 500).map(r => ({ ...r, wordCount: r.renderedWordCount }));
  for (const item of thin) item.signature = articleSignature(item.title || "", item.slug || "");
  for (const item of thin) {
    const alternates = articles.filter(a => a.lang !== item.lang && articleSignature(a.title || "", a.slug || "") && articleSignature(a.title || "", a.slug || "") === item.signature);
    item.alternates = alternates.map(a => `${a.lang}:${a.slug}`);
    item.topicCertification = topicCertification(item.title || "", item.slug || "", item.category || "");
    const sameLocale = item.signature ? articles.filter(a => a.lang === item.lang && a.slug !== item.slug && articleSignature(a.title || "", a.slug || "") === item.signature) : [];
    if (sameLocale.length) { item.recommendation = "B) MERGE/REDIRECT"; item.target = sameLocale.sort((a,b) => JSON.stringify(b.body).length - JSON.stringify(a.body).length)[0].slug; item.reason = "Sovrapposizione tematica nella stessa lingua: consolidare segnali e contenuto nella versione più completa."; }
    else if (item.wordCount < 250) { item.recommendation = "C) KEEP NOINDEX"; item.reason = "Contenuto molto breve; mantenerlo fuori dall'indice finché non esiste un piano editoriale verificato."; }
    else { item.recommendation = "A) EXPAND"; item.reason = "Tema utile e distinto, ma profondità insufficiente per una landing editoriale forte."; }
    item.contentGaps = item.recommendation.startsWith("A") ? gaps(item.category || "") : "";
  }

  const topicRows: any[] = [];
  if (process.env.SKIP_TOPIC_CRAWL === "1") {
    topicRows.push(...previousTopics.values());
  } else for (const lang of LOCALES) {
    let list: any[] | undefined;
    for (let attempt = 0; attempt < 6 && !list; attempt++) {
      await pause(600 + attempt * 1000);
      await page.goto(`${SITE}/api/backend/sitemap/topics?lang=${lang}`, { waitUntil: "domcontentloaded" });
      try { list = JSON.parse(await page.locator("body").innerText()); } catch { /* retry */ }
    }
    list ||= [...previousTopics.values()].filter(x => x.lang === lang);
    for (const t of list) topicRows.push({ lang, ...t, url: `${lang === "en" ? SITE : `${SITE}/${lang}`}/${lang === "it" ? "certificazioni" : lang === "es" ? "certificaciones" : "certifications"}/${t.certification_slug}/${t.slug}` });
  }
  let topicNext = 0;
  const apiBase = (process.env.API_BASE_URL || `${SITE}/api/backend`).replace(/\/$/, "");
  if (process.env.SKIP_TOPIC_CRAWL !== "1") await Promise.all(Array.from({ length: 2 }, async () => {
    const p = await context.newPage();
    while (topicNext < topicRows.length) {
      const item = topicRows[topicNext++];
      const prior = previousTopics.get(`${item.lang}:${item.certification_slug}:${item.slug}`);
      if (prior && !prior.error) { Object.assign(item, prior); continue; }
      const api = `${apiBase}/topic-pages/${encodeURIComponent(item.certification_slug)}/${encodeURIComponent(item.slug)}?lang=${item.lang}`;
      try {
        let raw = "", data: any;
        for (let attempt = 0; attempt < 6; attempt++) {
          await pause(300 + attempt * 700);
          await p.goto(api, { waitUntil: "domcontentloaded", timeout: 30_000 });
          raw = await p.locator("body").innerText();
          try { data = JSON.parse(raw); break; } catch { if (attempt === 5) throw new Error(`API non-JSON after retries: ${raw.slice(0,80)}`); }
        }
        const topic = data.topic || {}, prose = [topic.description,topic.intro,topic.content,...(topic.faq || []).flatMap((x:any)=>[x.q,x.a])].filter(Boolean).join(" ").replace(/[#*_>`~\[\]()|-]/g," ").replace(/\s+/g," ").trim();
        item.wordCount = words(prose); item.contentChars = (topic.content || "").trim().length; item.introChars = (topic.intro || "").trim().length; item.faqCount = (topic.faq || []).length;
        item.indexable = !!topic.title?.trim() && item.wordCount >= 300 && item.contentChars >= 1500 && (item.introChars >= 180 || item.faqCount >= 2);
        item.inSitemap = sitemapUrls.includes(item.url);
      } catch (error) { item.error = String(error); item.indexable = false; item.inSitemap = sitemapUrls.includes(item.url); }
    }
    await p.close();
  }));

  await browser.close();
  await mkdir(outDir, { recursive: true });
  const report = { generatedAt: new Date().toISOString(), oldSitemapCount: 2163, newSitemapCount: sitemapUrls.length, sitemapBreakdown, thinArticleCount: thin.length, thinArticles: thin, articleAudit: enriched, topicSummary: { total: topicRows.length, indexable: topicRows.filter(x=>x.indexable).length, noindex: topicRows.filter(x=>!x.indexable).length, inSitemap: topicRows.filter(x=>x.inSitemap).length, removedFromSitemap: topicRows.filter(x=>!x.inSitemap).length, recoverable: topicRows.filter(x=>x.indexable && !x.inSitemap).length, errors: topicRows.filter(x=>x.error).length }, topics: topicRows };
  await writeFile(path.join(outDir, "adsense-postdeploy-evidence.json"), JSON.stringify(report, null, 2), "utf8");
  const lines = ["# Blog editorial backlog (<500 main-content words)", "", `Generated: ${report.generatedAt}`, "", `Total: ${thin.length}`, "", "| Locale | Title | Slug | Words | Translations / alternates | Topic / certification | Recommendation | Reason | Merge target | Suggested gaps |", "|---|---|---|---:|---|---|---|---|---|---|"];
  const esc=(v:any)=>String(v??"").replace(/\|/g,"\\|").replace(/\s+/g," ");
  for(const a of thin.sort((a,b)=>a.lang.localeCompare(b.lang)||a.wordCount-b.wordCount)) lines.push(`| ${esc(a.lang)} | ${esc(a.title)} | ${esc(a.slug)} | ${a.wordCount} | ${esc(a.alternates.join(", ")||"—")} | ${esc(a.topicCertification)} | ${esc(a.recommendation)} | ${esc(a.reason)} | ${esc(a.target||"—")} | ${esc(a.contentGaps||"—")} |`);
  await writeFile(path.join(outDir, "adsense-blog-editorial-backlog.generated.md"), lines.join("\n"), "utf8");
  console.log(JSON.stringify({ evidence: path.join(outDir,"adsense-postdeploy-evidence.json"), backlog: path.join(outDir,"adsense-blog-editorial-backlog.generated.md"), ...report.topicSummary, old:2163, new:sitemapUrls.length, thin:thin.length, sitemapBreakdown }, null, 2));
}
main().catch(e=>{console.error(e);process.exitCode=1});
