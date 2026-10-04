import assert from "node:assert/strict";
import test from "node:test";

// Mock minimo di window/sessionStorage/navigator/fetch, stesso schema di
// analytics-funnel-event.test.ts. `navigator` e `crypto` sono globali nativi:
// vanno ridefiniti con Object.defineProperty.
const sessionStore = new Map<string, string>();
(globalThis as any).window = { location: { pathname: "/it/quiz/ccna", search: "", hash: "" } };
(globalThis as any).document = { referrer: "" };
(globalThis as any).sessionStorage = {
  getItem: (key: string) => sessionStore.get(key) ?? null,
  setItem: (key: string, value: string) => {
    sessionStore.set(key, value);
  },
};
(globalThis as any).localStorage = {
  getItem: () => null,
  setItem: () => undefined,
};
let uuidCounter = 0;
Object.defineProperty(globalThis, "crypto", {
  value: {
    randomUUID: () => {
      uuidCounter += 1;
      return `00000000-0000-4000-8000-${String(uuidCounter).padStart(12, "0")}`;
    },
  },
  configurable: true,
});

const beaconCalls: string[] = [];
const fetchCalls: string[] = [];
function setNavigator(value: Record<string, unknown>) {
  Object.defineProperty(globalThis, "navigator", {
    value: {
      sendBeacon: (endpoint: string) => {
        beaconCalls.push(endpoint);
        return true;
      },
      ...value,
    },
    configurable: true,
  });
}
Object.defineProperty(globalThis, "fetch", {
  value: (endpoint: string) => {
    fetchCalls.push(endpoint);
    return Promise.resolve(new Response(null, { status: 202 }));
  },
  configurable: true,
});

const detectorModule = import("../src/lib/automated-client.ts");
const analyticsModule = import("../src/lib/analytics.ts");

// --- browser reali: nessuno di questi deve essere filtrato ---------------

const REAL_BROWSER_USER_AGENTS: Record<string, string> = {
  chromeWindows:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  chromeAndroid:
    "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36",
  safariIphone:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
  safariMac:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15",
  firefox: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0",
  edge:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0",
  samsungInternet:
    "Mozilla/5.0 (Linux; Android 14; SAMSUNG SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/25.0 Chrome/121.0.0.0 Mobile Safari/537.36",
  operaGx:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 OPR/111.0.0.0",
  yandexBrowser:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 YaBrowser/24.6.0.0 Safari/537.36",
  duckDuckGoApp:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 DuckDuckGo/7 Safari/605.1.15",
  facebookInApp:
    "Mozilla/5.0 (Linux; Android 13; SM-A536B) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/125.0.0.0 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/460.0.0.0;]",
  instagramInApp:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 330.0.0.0",
  tiktokInApp:
    "Mozilla/5.0 (Linux; Android 13; SM-A346B) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/124.0.0.0 Mobile Safari/537.36 BytedanceWebview/d8a21c6",
  linkedinInApp:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 LinkedInApp/9.30.1234",
  // Telefoni il cui nome contiene "bot": un generico /bot/i li filtrerebbe.
  cubotAndroid:
    "Mozilla/5.0 (Linux; Android 13; CUBOT_NOTE_50) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36",
  cubotWithSpace:
    "Mozilla/5.0 (Linux; Android 12; Cubot P50) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
};

for (const [name, userAgent] of Object.entries(REAL_BROWSER_USER_AGENTS)) {
  test(`isAutomatedClient: real browser is not filtered (${name})`, async () => {
    const { isAutomatedClient } = await detectorModule;
    assert.equal(isAutomatedClient({ webdriver: false, userAgent }), false);
  });
}

// --- falsi positivi: generici "crawler" / "spider" / "scraper" ------------
//
// Le tre parole sono riconosciute SOLO nella forma "<parola>/<cifra>". Qui si
// verifica che compaiano senza far scattare il filtro in contesti reali:
// browser e app (anche cinesi), dispositivi, TV e console, e parole che le
// contengono. Le stringhe sintetiche sono marcate come tali.

const GENERIC_WORD_NEGATIVES: Record<string, string> = {
  // Sogou Mobile Browser: browser reale (non e' il crawler "Sogou web spider").
  sogouMobileBrowser:
    "Mozilla/5.0 (Linux; Android 11; V2073A Build/RP1A.200720.012; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/90.0.4430.210 Mobile Safari/537.36 SogouMobileBrowser/5.22.8",
  // Browser e app reali di vari ecosistemi.
  huaweiBrowser:
    "Mozilla/5.0 (Linux; Android 12; ELS-NX9; HMSCore 6.12.0.302) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.88 HuaweiBrowser/14.0.0.311 Mobile Safari/537.36",
  miuiBrowser:
    "Mozilla/5.0 (Linux; U; Android 13; it-it; 2201123G Build/TKQ1.221114.001) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/112.0.5615.136 Mobile Safari/537.36 XiaoMi/MiuiBrowser/14.2.0",
  ucBrowser:
    "Mozilla/5.0 (Linux; U; Android 10; en-US; RMX2001 Build/QKQ1.200209.002) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/78.0.3904.108 UCBrowser/13.4.0.1306 Mobile Safari/537.36",
  vivaldi:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Vivaldi/6.8.3381.55",
  chromeIos:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/126.0.6478.153 Mobile/15E148 Safari/604.1",
  firefoxIos:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/127.0 Mobile/15E148 Safari/605.1.15",
  operaMini: "Opera/9.80 (Android; Opera Mini/36.2.2254/119.132; U; id) Presto/2.12.423 Version/12.16",
  weChat:
    "Mozilla/5.0 (Linux; Android 13; PHB110 Build/TP1A.220905.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/116.0.0.0 Mobile Safari/537.36 XWEB/1160065 MMWEBSDK/20231201 MicroMessenger/8.0.44",
  telegramInApp:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
  snapchatInApp:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Snapchat/12.90.0.38 (like Safari/8618.2.12.0.6, panda)",
  pinterestInApp:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [Pinterest/iOS]",
  // TV, console, e-reader, dispositivi non convenzionali.
  samsungSmartTv:
    "Mozilla/5.0 (SMART-TV; Linux; Tizen 7.0) AppleWebKit/537.36 (KHTML, like Gecko) 94.0.4606.31/7.0 TV Safari/537.36",
  lgWebOs:
    "Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36 WebAppManager",
  playstation: "Mozilla/5.0 (PlayStation; PlayStation 5/2.26) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Safari/605.1.15",
  nintendoSwitch: "Mozilla/5.0 (Nintendo Switch; WifiWebAuthApplet) AppleWebKit/601.6 (KHTML, like Gecko) NF/4.0.0.5.10 NintendoBrowser/5.1.0.13343",
  kindleSilk:
    "Mozilla/5.0 (Linux; Android 9; KFTRWI) AppleWebKit/537.36 (KHTML, like Gecko) Silk/118.5.1 like Chrome/118.0.0.0 Safari/537.36",
  steamDeck:
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  // Sintetici: le tre parole dentro nomi di dispositivi, app o parole composte.
  // (Stringhe inventate: servono a fissare il confine del pattern, non sono UA reali.)
  syntheticDeviceNamedSpider:
    "Mozilla/5.0 (Linux; Android 13; Spider X1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36",
  syntheticAppSkyscraper: "SkyscraperApp/1.0 CFNetwork/1485 Darwin/23.1.0",
  syntheticAppSpiderman: "Spiderman/1.0 (iPhone; iOS 17.5; Scale/3.00)",
  syntheticAppWebCrawlerFan: "WebCrawlerFan/3 (Android 14)",
  syntheticCrawlerEditionNoVersion:
    "Mozilla/5.0 (Linux; Android 12; Crawler Edition) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
  syntheticScraperWordInText: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36 skyscraper-theme",
  syntheticSpiderThenSlashNoDigit: "Mozilla/5.0 (X11; Linux x86_64) Spider/ Chrome/126.0.0.0",
};

for (const [name, userAgent] of Object.entries(GENERIC_WORD_NEGATIVES)) {
  test(`isAutomatedClient: generic words do not flag a real browser/app/device (${name})`, async () => {
    const { isAutomatedClient } = await detectorModule;
    assert.equal(isAutomatedClient({ webdriver: false, userAgent }), false);
  });
}

test("isAutomatedClient: the generic pattern matches only <word>/<digit>, case-insensitively", async () => {
  const { isAutomatedClient } = await detectorModule;
  for (const userAgent of ["Foo-Crawler/1.0", "FOO-SPIDER/9", "x scraper/2", "baiduspider/2.0"]) {
    assert.equal(isAutomatedClient({ userAgent }), true, userAgent);
  }
  for (const userAgent of ["Foo Crawler 1.0", "spider", "Spider-Man", "scrapers/1", "crawlers/2", "Spider/x"]) {
    assert.equal(isAutomatedClient({ userAgent }), false, userAgent);
  }
});

test("isAutomatedClient: missing or empty signals never mean bot", async () => {
  const { isAutomatedClient } = await detectorModule;
  assert.equal(isAutomatedClient(undefined as any), false);
  assert.equal(isAutomatedClient({}), false);
  assert.equal(isAutomatedClient({ userAgent: "" }), false);
  assert.equal(isAutomatedClient({ userAgent: 42 as any }), false);
  assert.equal(isAutomatedClient({ webdriver: undefined, userAgent: undefined }), false);
  assert.equal(isAutomatedClient({ webdriver: false }), false);
  // Solo il booleano true e' un segnale: valori "truthy" ma diversi non contano.
  assert.equal(isAutomatedClient({ webdriver: "true" }), false);
  assert.equal(isAutomatedClient({ webdriver: 1 }), false);
});

test("isAutomatedClient: unexpected value shapes are fail-open", async () => {
  const { isAutomatedClient } = await detectorModule;
  assert.equal(isAutomatedClient(null as any), false);
  assert.equal(isAutomatedClient({ userAgent: {} as any }), false);
  assert.equal(isAutomatedClient({ userAgentData: 7 as any }), false);
  assert.equal(isAutomatedClient({ userAgentData: { brands: "x" as any } }), false);
  assert.equal(isAutomatedClient({ userAgentData: { brands: [null, undefined, 3, {}] as any } }), false);
});

test("isAutomatedClient: a navigator whose properties throw is fail-open (never throws, never bot)", async () => {
  const { isAutomatedClient } = await detectorModule;
  for (const property of ["webdriver", "userAgent", "userAgentData"]) {
    const hostile = {};
    Object.defineProperty(hostile, property, {
      get() {
        throw new Error(`blocked: ${property}`);
      },
    });
    assert.doesNotThrow(() => isAutomatedClient(hostile as any), property);
    assert.equal(isAutomatedClient(hostile as any), false, property);
  }
  const revoked = Proxy.revocable({}, {});
  revoked.revoke();
  assert.doesNotThrow(() => isAutomatedClient(revoked.proxy as any));
  assert.equal(isAutomatedClient(revoked.proxy as any), false);
});

test("isAutomatedClient: Chrome Client Hints without a headless brand are not filtered", async () => {
  const { isAutomatedClient } = await detectorModule;
  assert.equal(
    isAutomatedClient({
      userAgent: REAL_BROWSER_USER_AGENTS.chromeWindows,
      userAgentData: { brands: [{ brand: "Chromium" }, { brand: "Google Chrome" }, { brand: "Not.A/Brand" }] },
    }),
    false
  );
  assert.equal(isAutomatedClient({ userAgentData: null }), false);
  assert.equal(isAutomatedClient({ userAgentData: { brands: [] } }), false);
});

// --- client automatizzati: questi devono essere filtrati -----------------

test("isAutomatedClient: navigator.webdriver === true is filtered", async () => {
  const { isAutomatedClient } = await detectorModule;
  assert.equal(
    isAutomatedClient({ webdriver: true, userAgent: REAL_BROWSER_USER_AGENTS.chromeWindows }),
    true
  );
});

const AUTOMATED_USER_AGENTS: Record<string, string> = {
  googlebot:
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/126.0.0.0 Safari/537.36",
  googlebotMobile:
    "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  googleInspection: "Mozilla/5.0 (compatible; Google-InspectionTool/1.0)",
  bingbot: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm) Chrome/116.0.1938.76 Safari/537.36",
  duckduckbot: "Mozilla/5.0 (compatible; DuckDuckBot-Https/1.1; https://duckduckgo.com/duckduckbot)",
  applebot: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15 (Applebot/0.1; +http://www.apple.com/go/applebot)",
  gptbot: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.1; +https://openai.com/gptbot",
  claudebot: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +claudebot@anthropic.com)",
  perplexity: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)",
  ahrefs: "Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)",
  semrush: "Mozilla/5.0 (compatible; SemrushBot/7~bl; +http://www.semrush.com/bot.html)",
  headlessChrome:
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/126.0.0.0 Safari/537.36",
  lighthouse:
    "Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Mobile Safari/537.36 Chrome-Lighthouse",
  pageSpeed: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 PTST/240101.0 PageSpeed",
  pythonRequests: "python-requests/2.31.0",
  curl: "curl/8.4.0",
  genericNamedBot: "Mozilla/5.0 (compatible; ExampleSearchbot/3.2; +https://example.org/bot)",
  // Generici nella forma standard "<nome>/<versione>".
  genericCrawlerProduct: "Mozilla/5.0 (compatible; SomeCrawler/1.0; +https://example.org/crawler)",
  genericSpiderProduct: "Mozilla/5.0 (compatible; ExampleSpider/2.3)",
  genericScraperProduct: "Mozilla/5.0 (compatible; PriceScraper/0.9)",
  baiduspider: "Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)",
  sogouWebSpider: "Sogou web spider/4.0(+http://www.sogou.com/docs/help/webmasters.htm#07)",
  scrapy: "Scrapy/2.11.0 (+https://scrapy.org)",
};

for (const [name, userAgent] of Object.entries(AUTOMATED_USER_AGENTS)) {
  test(`isAutomatedClient: known automation is filtered (${name})`, async () => {
    const { isAutomatedClient } = await detectorModule;
    assert.equal(isAutomatedClient({ webdriver: false, userAgent }), true);
  });
}

test("isAutomatedClient: a HeadlessChrome Client Hints brand is filtered", async () => {
  const { isAutomatedClient } = await detectorModule;
  assert.equal(
    isAutomatedClient({
      userAgent: REAL_BROWSER_USER_AGENTS.chromeWindows,
      userAgentData: { brands: [{ brand: "HeadlessChrome" }, { brand: "Chromium" }] },
    }),
    true
  );
});

// --- integrazione con il punto di scrittura del funnel DB ----------------

test("trackFunnelEvent: writes nothing for an automated client", async () => {
  const { trackFunnelEvent } = await analyticsModule;
  beaconCalls.length = 0;
  fetchCalls.length = 0;
  setNavigator({ webdriver: true, userAgent: REAL_BROWSER_USER_AGENTS.chromeWindows });

  trackFunnelEvent({ event: "paywall_viewed", cert_slug: "ccna", lang: "it" });
  trackFunnelEvent({ event: "pricing_viewed", lang: "it" });
  trackFunnelEvent({ event: "premium_clicked", lang: "it" });

  assert.equal(beaconCalls.length, 0);
  assert.equal(fetchCalls.length, 0);
});

test("trackFunnelEvent: a known crawler user agent writes nothing", async () => {
  const { trackFunnelEvent } = await analyticsModule;
  beaconCalls.length = 0;
  fetchCalls.length = 0;
  setNavigator({ webdriver: false, userAgent: AUTOMATED_USER_AGENTS.googlebot });

  trackFunnelEvent({ event: "study_started", lang: "en" });

  assert.equal(beaconCalls.length, 0);
  assert.equal(fetchCalls.length, 0);
});

test("trackFunnelEvent: a normal browser still writes every one of the four exposure events", async () => {
  const { trackFunnelEvent } = await analyticsModule;
  beaconCalls.length = 0;
  setNavigator({ webdriver: false, userAgent: REAL_BROWSER_USER_AGENTS.chromeWindows });

  for (const event of ["study_started", "assessment_started", "paywall_viewed", "pricing_viewed"]) {
    trackFunnelEvent({ event, lang: "it" });
  }

  assert.equal(beaconCalls.length, 4);
});

test("trackFunnelEvent: a browser with no navigator signals still writes (missing signal is not a bot)", async () => {
  const { trackFunnelEvent } = await analyticsModule;
  beaconCalls.length = 0;
  setNavigator({});

  trackFunnelEvent({ event: "checkout_started", lang: "it" });

  assert.equal(beaconCalls.length, 1);
});

function hostileNavigator(property: string) {
  const nav: Record<string, unknown> = {
    sendBeacon: (endpoint: string) => {
      beaconCalls.push(endpoint);
      return true;
    },
  };
  Object.defineProperty(nav, property, {
    get() {
      throw new Error(`blocked: ${property}`);
    },
  });
  Object.defineProperty(globalThis, "navigator", { value: nav, configurable: true });
}

test("trackFunnelEvent / trackFunnelEventOnce: a navigator that throws on read still tracks the event (fail-open)", async () => {
  const { trackFunnelEvent, trackFunnelEventOnce } = await analyticsModule;
  for (const property of ["webdriver", "userAgent", "userAgentData"]) {
    beaconCalls.length = 0;
    sessionStore.clear();
    hostileNavigator(property);

    assert.doesNotThrow(() => trackFunnelEvent({ event: "checkout_started", lang: "it" }), property);
    assert.doesNotThrow(
      () => trackFunnelEventOnce(`k:${property}`, { event: "pricing_viewed", lang: "it" }),
      property
    );

    assert.equal(beaconCalls.length, 2, `${property}: both events must still be sent`);
  }
});

test("trackFunnelEventOnce: the filter runs before the in-memory and storage dedupe", async () => {
  const { trackFunnelEventOnce } = await analyticsModule;
  beaconCalls.length = 0;
  sessionStore.clear();

  // 1) un client automatizzato non "brucia" la chiave: un browser normale che usa
  //    la stessa chiave nello stesso processo deve ancora poter registrare.
  setNavigator({ webdriver: true });
  trackFunnelEventOnce("pricing_viewed:/pricing:shared-key", { event: "pricing_viewed", lang: "it" });
  assert.equal(beaconCalls.length, 0);

  setNavigator({ webdriver: false, userAgent: REAL_BROWSER_USER_AGENTS.chromeWindows });
  trackFunnelEventOnce("pricing_viewed:/pricing:shared-key", { event: "pricing_viewed", lang: "it" });
  assert.equal(beaconCalls.length, 1);
});

test("trackFunnelEventOnce: an automated client leaves no dedupe key and writes nothing", async () => {
  const { trackFunnelEventOnce } = await analyticsModule;
  beaconCalls.length = 0;
  fetchCalls.length = 0;
  sessionStore.clear();
  setNavigator({ webdriver: true });

  trackFunnelEventOnce("pricing_viewed:/pricing:ccna", { event: "pricing_viewed", lang: "it" });

  assert.equal(beaconCalls.length, 0);
  assert.equal(fetchCalls.length, 0);
  assert.equal([...sessionStore.keys()].some((key) => key.startsWith("cq_funnel_once:")), false);
});

test("trackFunnelEventOnce: after an automated attempt a real browser session still records the event once", async () => {
  const { trackFunnelEventOnce } = await analyticsModule;
  beaconCalls.length = 0;
  sessionStore.clear();

  setNavigator({ webdriver: false, userAgent: REAL_BROWSER_USER_AGENTS.safariIphone });
  trackFunnelEventOnce("paywall_viewed:review:ccna", { event: "paywall_viewed", lang: "it" });
  trackFunnelEventOnce("paywall_viewed:review:ccna", { event: "paywall_viewed", lang: "it" });

  assert.equal(beaconCalls.length, 1);
});
