// src/lib/automated-client.ts
//
// Riconosce i client automatizzati (crawler che eseguono JavaScript, browser
// headless, strumenti di audit) PRIMA di scrivere un evento in funnel_events.
//
// Perche': i crawler renderizzano le pagine e scatenano gli eventi di
// esposizione (study_started, assessment_started, paywall_viewed,
// pricing_viewed). Ogni visita di un bot senza localStorage diventa un nuovo
// visitor_id con un solo evento, e gonfia i denominatori del funnel.
//
// Vincoli di progetto:
// - Il valore di navigator.userAgent viene solo CONFRONTATO nel browser, mai
//   inviato, mai salvato: nessun dato personale in piu'.
// - Un segnale mancante o vuoto NON significa bot. Nel dubbio l'evento passa:
//   perdere utenti veri e' peggio che lasciar passare qualche bot.
// - Nessuna euristica comportamentale (velocita', dimensioni finestra, ecc.):
//   solo segnali dichiarati dal client.

type NavigatorLike = {
  webdriver?: unknown;
  userAgent?: unknown;
  userAgentData?: { brands?: Array<{ brand?: unknown }> } | null;
};

// Token di bot e strumenti noti. Elenco esplicito e non un generico "bot":
// "bot" da solo colpirebbe anche UA legittimi (es. telefoni con "Cubot" nel
// modello). Il caso generico `<nome>bot/<versione>` e' coperto a parte.
const KNOWN_AUTOMATION_UA = new RegExp(
  [
    // motori di ricerca
    "googlebot", "adsbot-google", "mediapartners-google", "google-inspectiontool",
    "googleother", "storebot-google", "apis-google", "feedfetcher-google",
    "bingbot", "bingpreview", "msnbot", "adidxbot", "duckduckbot",
    "baiduspider", "yandexbot", "yandexmobilebot", "yandeximages", "slurp",
    "applebot", "seznambot", "exabot", "petalbot",
    // crawler AI
    "gptbot", "chatgpt-user", "oai-searchbot", "claudebot", "claude-web",
    "claude-user", "anthropic-ai", "perplexitybot", "perplexity-user",
    "bytespider", "amazonbot", "ccbot", "cohere-ai", "diffbot",
    // SEO / archivio
    "ahrefsbot", "semrushbot", "mj12bot", "dotbot", "screaming frog",
    "ia_archiver", "archive\\.org_bot",
    // browser headless e strumenti di audit/monitoraggio
    "headlesschrome", "phantomjs", "puppeteer", "playwright", "selenium",
    "lighthouse", "chrome-lighthouse", "pagespeed", "gtmetrix", "pingdom",
    "uptimerobot", "statuscake", "site24x7",
    // client HTTP e scraper
    "python-requests", "python-httpx", "aiohttp", "scrapy", "go-http-client",
    "curl\\/", "wget\\/",
  ].join("|"),
  "i"
);

// Forma standard dei crawler dichiarati: "<Nome>bot/<versione>" (Googlebot/2.1,
// AhrefsBot/7.0, ...). Richiede la barra e una cifra, quindi non colpisce
// modelli di telefono come "CUBOT_NOTE_7" o "Cubot P50".
const NAMED_BOT_WITH_VERSION = /\b[a-z0-9-]{2,}bot\/\d/i;

// Generici "crawler" / "spider" / "scraper" SOLO nella forma standard del
// prodotto HTTP, con barra e versione ("Baiduspider/2.0", "Sogou web spider/4.0",
// "SomeCrawler/1.0"). Le parole nude non bastano: potrebbero comparire nel nome
// di un dispositivo o di un'app ("Spider X1", "Skyscraper"). Il browser Sogou
// Mobile ("SogouMobileBrowser/5.x") e' reale e non deve essere toccato.
const GENERIC_CRAWLER_PRODUCT = /(?:crawler|spider|scraper)\/\d/i;

function readNavigator(): NavigatorLike | undefined {
  if (typeof navigator === "undefined") return undefined;
  return navigator as unknown as NavigatorLike;
}

export function isAutomatedClient(nav: NavigatorLike | undefined = readNavigator()): boolean {
  if (!nav) return false;

  // Segnale ufficiale (WebDriver spec): true solo se il browser e' controllato
  // da un'automazione. I browser normali espongono false o undefined.
  if (nav.webdriver === true) return true;

  const ua = typeof nav.userAgent === "string" ? nav.userAgent : "";
  if (ua) {
    if (KNOWN_AUTOMATION_UA.test(ua)) return true;
    if (NAMED_BOT_WITH_VERSION.test(ua)) return true;
    if (GENERIC_CRAWLER_PRODUCT.test(ua)) return true;
  }

  // Client Hints: i Chrome headless dichiarano il brand "HeadlessChrome".
  const brands = nav.userAgentData?.brands;
  if (Array.isArray(brands)) {
    for (const entry of brands) {
      if (typeof entry?.brand === "string" && /headless/i.test(entry.brand)) return true;
    }
  }

  return false;
}
