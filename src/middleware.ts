import { NextResponse, type NextRequest } from "next/server";
import { resolveLegacyRedirect } from "./lib/legacyRedirects";
import { AUDITED_TOPIC_REDIRECTS } from "./lib/audited-topic-redirects";

const LOCALES = new Set(["it", "en", "fr", "es"]);

const BLOG_EDITORIAL_REDIRECTS: Record<string, string> = {
  "/fr/blog/comment-fonctionnent-les-attaques-d-acces-non-autorise-ceh-guide-pratique":
    "/fr/blog/acces-non-autorise-ceh-techniques-reelles-attaques-et-comment-s-en-defendre",
  "/it/blog/esempi-pratici-della-triade-cia-come-applicarla-nella-sicurezza-informatica-security":
    "/it/blog/triade-cia-spiegata-semplice-riservatezza-integrita-e-disponibilita-security",
  "/es/blog/vlan-separar-para-proteger":
    "/es/blog/switching-y-vlan-la-base-real-de-cualquier-red-moderna-ccnp-enterprise",
  "/blog/cia-triad-vs-real-attacks-how-hackers-break-confidentiality-integrity-and-availability-security":
    "/blog/cia-triad-explained-with-real-examples-confidentiality-integrity-and-availability-security",
  "/en/blog/cia-triad-vs-real-attacks-how-hackers-break-confidentiality-integrity-and-availability-security":
    "/blog/cia-triad-explained-with-real-examples-confidentiality-integrity-and-availability-security",
  "/blog/security-controls-and-the-cia-triad-how-to-protect-data-effectively-security":
    "/blog/cia-triad-explained-with-real-examples-confidentiality-integrity-and-availability-security",
  "/en/blog/security-controls-and-the-cia-triad-how-to-protect-data-effectively-security":
    "/blog/cia-triad-explained-with-real-examples-confidentiality-integrity-and-availability-security",
  "/es/blog/como-funcionan-los-ataques-de-acceso-no-autorizado-ceh-guia-practica":
    "/es/blog/acceso-no-autorizado-ceh-ataques-reales-y-como-defenderte",
  "/fr/blog/controles-de-securite-et-triade-cia-comment-proteger-les-donnees-efficacement-security":
    "/fr/blog/triade-cia-expliquee-avec-des-exemples-concrets-confidentialite-integrite-et-disponibilite",
  "/fr/blog/triade-cia-et-cyberattaques-comment-les-attaquants-ciblent-la-confidentialite-l-integrite-et-la":
    "/fr/blog/triade-cia-expliquee-avec-des-exemples-concrets-confidentialite-integrite-et-disponibilite",
};

function isLocale(s?: string) {
  return !!s && LOCALES.has(s);
}

function buildPath(parts: string[]) {
  return "/" + parts.filter(Boolean).join("/");
}

// Detect locale from any pathname.
// EN root canonical: if no locale prefix, assume "en".
function detectLocaleFromPath(pathname: string) {
  const first = pathname.split("/")[1];
  if (isLocale(first)) return first;
  return "en";
}

// Attach cookie used by RootLayout (<html lang>)
function withLangCookie(res: NextResponse, lang: string) {
  res.cookies.set("cq_lang", lang, { path: "/" });
  return res;
}

// 301 helper + set language cookie
function redirect301(req: NextRequest, pathname: string) {
  const url = req.nextUrl.clone();
  url.pathname = pathname;

  const res = NextResponse.redirect(url, 301);
  const lang = detectLocaleFromPath(pathname);

  return withLangCookie(res, lang);
}

// 307 helper (non permanente) + set language cookie.
// Usato per redirect che potrebbero tornare indietro in futuro (es. pagine
// dismesse per traffico organico trascurabile, non per un errore di URL).
function redirect307(req: NextRequest, pathname: string) {
  const url = req.nextUrl.clone();
  url.pathname = pathname;

  const res = NextResponse.redirect(url, 307);
  const lang = detectLocaleFromPath(pathname);

  return withLangCookie(res, lang);
}
export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // ---------------------------------------------------------------------
  // SKIP assets / api
  // ---------------------------------------------------------------------
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/robots.txt" ||
    pathname === "/ads.txt" ||
    pathname.startsWith("/sitemap") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // ---------------------------------------------------------------------
  // QUICK TRAPS
  // Spam / crawler weird paths / broken generated URLs
  // ---------------------------------------------------------------------

  // Asset sporchi tipo /favicon.ico/undefined/database
  if (pathname.startsWith("/favicon.ico/")) {
    return redirect301(req, "/favicon.ico");
  }

  // /free-test dismessa: 9 clic in 90gg su tutta la superficie, 4 lingue
  // (dato Search Console, 25/08/2026) — indistinguibile dal rumore di fondo
  // del sito. 307 e non 301: potrebbe tornare utile come landing di
  // campagna in futuro. La query string (source/cert/topic/quiz) viene
  // preservata da redirect307 ma ignorata da quiz-home: innocua.
  if (pathname === "/free-test") {
    return redirect307(req, "/quiz-home");
  }
  if (pathname === "/it/free-test") {
    return redirect307(req, "/it/quiz-home");
  }
  if (pathname === "/fr/free-test") {
    return redirect307(req, "/fr/quiz-home");
  }
  if (pathname === "/es/free-test") {
    return redirect307(req, "/es/quiz-home");
  }

  // URL rotti con "undefined" generati/scoperti da crawler o vecchi link.
  // Esempi:
  // /roadmap-management/undefined/database
  // /how-it-works/undefined/reti
  // /privacy/undefined/virtualizzazione
  // /quiz-suggeriti/undefined/database
  // /&/undefined/cloud
// Nota: alcuni crawler richiedono l'URL con "&" percent-encoded ("%26"),
// quindi va controllato sia il pathname grezzo che quello decodificato.
if (pathname.startsWith("/&/undefined/") || pathname.startsWith("/%26/undefined/")) {
  const category = decodeURIComponent(pathname).split("/").pop();

  const map: Record<string, string> = {
    sicurezza: "/it/categorie/sicurezza",
    reti: "/it/categorie/reti",
    cloud: "/it/categorie/cloud",
    database: "/it/categorie/database",
    base: "/it/categorie/base",
    ai: "/it/categorie/intelligenza-artificiale",
    virtualizzazione: "/it/categorie/virtualizzazione",
    programmazione: "/it/categorie/programmazione",
  };

  return redirect301(req, map[category ?? ""] ?? "/it/categorie");
}

if (pathname.startsWith("/favicon.ico/undefined")) {
  return redirect301(req, "/");
}

if (pathname.startsWith("/quiz-suggeriti/undefined")) {
  return redirect301(req, "/suggested");
}

if (pathname.startsWith("/roadmap-management/undefined")) {
  return redirect301(req, "/paths");
}

if (pathname.startsWith("/how-it-works/undefined")) {
  return redirect301(req, "/");
}

if (pathname.startsWith("/privacy/undefined")) {
  return redirect301(req, "/privacy");
}

if (pathname.includes("/undefined/") || pathname.endsWith("/undefined")) {
  return redirect301(req, "/");
}

  // ---------------------------------------------------------------------
  // LEGACY REDIRECTS (src/lib/legacyRedirects.ts)
  // Prima degli alias, dei prefix generici e della normalizzazione /en:
  // le destinazioni sono già finali (un solo salto).
  // ---------------------------------------------------------------------
  const auditedTarget = AUDITED_TOPIC_REDIRECTS[pathname];
  if (auditedTarget) return redirect301(req, auditedTarget);

  const legacyTarget = resolveLegacyRedirect(pathname);
  if (legacyTarget) {
    return redirect301(req, legacyTarget);
  }


  // ---------------------------------------------------------------------
  // HARD ALIASES
  // Redirect stabili
  // ---------------------------------------------------------------------

  if (pathname === "/inizia") {
    return redirect301(req, "/quiz-home");
  }
  if (pathname === "/it/inizia") {
    return redirect301(req, "/it/quiz-home");
  }
  if (pathname === "/fr/inizia") {
    return redirect301(req, "/fr/quiz-home");
  }
  if (pathname === "/es/inizia") {
    return redirect301(req, "/es/quiz-home");
  }
  if (pathname === "/quiz-suggeriti") {
    return redirect301(req, "/suggested");
  }

  // IT: C# alias
  if (pathname === "/it/certificazioni/microsoft-csharp") {
    return redirect301(req, "/it/certificazioni/csharp");
  }

  // IT: Terms slug EN dentro IT
  if (pathname === "/it/terms") {
    return redirect301(req, "/it/termini");
  }

  if (pathname === "/it/terms-conditions") {
    return redirect301(req, "/it/termini");
  }

  // Slug legacy certificazioni
  if (pathname === "/certifications/tensorflow-developer") {
    return redirect301(req, "/certifications/tensorflow");
  }

  if (pathname === "/it/certificazioni/tensorflow-developer") {
    return redirect301(req, "/it/certificazioni/tensorflow");
  }

  if (pathname === "/certifications/mysql-certification") {
  return redirect301(req, "/certifications/mysql");
}

if (pathname === "/en/certifications/mysql-certification") {
  return redirect301(req, "/certifications/mysql");
}

if (pathname === "/it/certificazioni/mysql-certification") {
  return redirect301(req, "/it/certificazioni/mysql");
}

if (pathname === "/it/certifications/mysql-certification") {
  return redirect301(req, "/it/certificazioni/mysql");
}

if (pathname === "/fr/certifications/mysql-certification") {
  return redirect301(req, "/fr/certifications/mysql");
}

if (pathname === "/es/certificaciones/mysql-certification") {
  return redirect301(req, "/es/certificaciones/mysql");
}

if (pathname.startsWith("/certifications/mysql-certification/")) {
  return redirect301(
    req,
    pathname.replace("/certifications/mysql-certification/", "/certifications/mysql/")
  );
}

if (pathname.startsWith("/it/certificazioni/mysql-certification/")) {
  return redirect301(
    req,
    pathname.replace("/it/certificazioni/mysql-certification/", "/it/certificazioni/mysql/")
  );
}

if (pathname.startsWith("/es/certificaciones/mysql-certification/")) {
  return redirect301(
    req,
    pathname.replace("/es/certificaciones/mysql-certification/", "/es/certificaciones/mysql/")
  );
}

  if (pathname === "/certifications/csharp-certification") {
    return redirect301(req, "/certifications/csharp");
  }

  if (pathname === "/it/certificazioni/csharp-certification") {
    return redirect301(req, "/it/certificazioni/csharp");
  }

  if (pathname === "/certifications/microsoft-csharp") {
    return redirect301(req, "/certifications/csharp");
  }

  if (pathname === "/certifications/vmware-certified-professional") {
    return redirect301(req, "/certifications/vmware-vcp");
  }

  if (pathname === "/it/certificazioni/vmware-certified-professional") {
    return redirect301(req, "/it/certificazioni/vmware-vcp");
  }
  
  
  // ---------------------------------------------------------------------
// RECENT 404 FIXES
// ---------------------------------------------------------------------

if (pathname.startsWith("/it/quiz/data-analytics-foundations/")) {
  const topicSlug = pathname.replace(
    "/it/quiz/data-analytics-foundations/",
    ""
  );

  return redirect301(
    req,
    `/it/certificazioni/data-analytics-foundations/${topicSlug}`
  );
}
// Legacy hub IBM Security
if (pathname === "/hub/ibm-security") {
  return redirect301(req, "/categories/security");
}

if (pathname === "/it/hub/ibm-security") {
  return redirect301(req, "/it/hub/ibm");
}

if (pathname === "/fr/hub/ibm-security") {
  return redirect301(req, "/fr/hub/ibm");
}

if (pathname === "/es/hub/ibm-security") {
  return redirect301(req, "/es/hub/ibm");
}

// Legacy hub Security
if (pathname === "/hub/security") {
  return redirect301(req, "/categories/security");
}

// Microsoft AI Fundamentals vecchio slug con topic figli
if (pathname.startsWith("/certifications/microsoft-ai-fundamentals/")) {
  return redirect301(req, "/certifications/microsoft-ai");
}

if (pathname.startsWith("/it/certificazioni/microsoft-ai-fundamentals/")) {
  return redirect301(req, "/it/certificazioni/microsoft-ai");
}

if (pathname.startsWith("/fr/certifications/microsoft-ai-fundamentals/")) {
  return redirect301(req, "/fr/certifications/microsoft-ai");
}

if (pathname.startsWith("/es/certificaciones/microsoft-ai-fundamentals/")) {
  return redirect301(req, "/es/certificaciones/microsoft-ai");
}

// Networking roadmap legacy

if (pathname === "/roadmaps/networking") {
  return redirect301(req, "/roadmap-networking");
}

if (pathname === "/it/roadmaps/networking") {
  return redirect301(req, "/it/roadmap-networking");
}

if (pathname === "/fr/roadmaps/networking") {
  return redirect301(req, "/fr/roadmap-networking");
}

if (pathname === "/es/roadmaps/networking") {
  return redirect301(req, "/es/roadmap-networking");
}

// Kubernetes legacy -> KCNA

if (pathname === "/certifications/kubernetes") {
  return redirect301(req, "/certifications/kcna-kubernetes-cloud-native");
}

if (pathname === "/it/certificazioni/kubernetes") {
  return redirect301(req, "/it/certificazioni/kcna-kubernetes-cloud-native");
}

if (pathname === "/fr/certifications/kubernetes") {
  return redirect301(req, "/fr/certifications/kcna-kubernetes-cloud-native");
}

if (pathname === "/es/certificaciones/kubernetes") {
  return redirect301(req, "/es/certificaciones/kcna-kubernetes-cloud-native");
}

if (pathname.startsWith("/es/quiz/aws-cloud-practitioner/")) {
  const topicSlug = pathname.replace(
    "/es/quiz/aws-cloud-practitioner/",
    ""
  );

  // "mixed" e "mock-exam" sono pagine quiz reali (non slug di topic SEO):
  // non vanno redirette altrimenti finiscono su uno slug inesistente.
  const QUIZ_MODE_SEGMENTS = new Set(["mixed", "mock-exam"]);
  if (!QUIZ_MODE_SEGMENTS.has(topicSlug)) {
    return redirect301(
      req,
      `/es/certificaciones/aws-cloud-practitioner/${topicSlug}`
    );
  }
}

// Cookie Policy legacy -> cookie pages

if (pathname === "/cookie-policy") {
  return redirect301(req, "/cookies");
}

if (pathname === "/en/cookie-policy") {
  return redirect301(req, "/cookies");
}

if (pathname === "/it/cookie-policy") {
  return redirect301(req, "/it/cookie");
}

if (pathname === "/fr/cookie-policy") {
  return redirect301(req, "/fr/cookie");
}

if (pathname === "/es/cookie-policy") {
  return redirect301(req, "/es/cookie");
}
// Google Cloud Digital Leader old IT topic slug
if (
  pathname ===
  "/it/certificazioni/google-cloud-digital-leader/infrastruttura-sicurezza-costi-cloud"
) {
  return redirect301(
    req,
    "/it/certificazioni/google-cloud-digital-leader/sicurezza-e-operazioni-con-google-cloud"
  );
}

// CEH — topic 353 rinominato/split: sniffing-session-hijacking -> sniffing
if (pathname === "/it/certificazioni/ceh/sniffing-session-hijacking") {
  return redirect301(req, "/it/certificazioni/ceh/sniffing");
}
if (pathname === "/it/certificazioni/ceh/sniffing-session-hijacking/ripasso") {
  return redirect301(req, "/it/certificazioni/ceh/sniffing/ripasso");
}

// NOTA: il redirect "topic 80 -> scansione-delle-reti" introdotto in c3975ab4
// (2026-09-02) anticipava uno split del topic 80 (Scansione delle reti +
// Vulnerability Analysis + Exploitation Techniques) mai eseguito sul DB.
// "scansione-delle-reti" non corrisponde a nessun topic reale: la regola
// mandava in 404 l'unico slug realmente esistente del topic 80
// (scansione-delle-vulnerabilita-e-exploit). Rimossa il 2026-09-17 — nessun
// nuovo slug creato, nessuno split effettuato: il topic 80 resta un unico
// topic con lo slug canonico originale finché lo split non verrà deciso ed
// eseguito separatamente (vedi audit blueprint CEH).

// Microsoft AI-901: 5 topic legacy soft-ritirati nel cutover 2026-09-07
// (0 domande attive nel DB) -> redirect alla pagina certificazione.
// NOTA: il vecchio next.config.ts non è mai stato caricato da Next (ordine di
// risoluzione next.config.js → .mjs → .ts: vinceva sempre next.config.mjs),
// per questo le sue regole "non scattavano". Rimosso il 2026-09-29: i
// redirect legacy vivono qui o in src/lib/legacyRedirects.ts.
if (pathname === "/it/certificazioni/microsoft-ai/concetti-di-ai") {
  return redirect301(req, "/it/certificazioni/microsoft-ai");
}
if (pathname === "/it/certificazioni/microsoft-ai/concetti-di-ai/ripasso") {
  return redirect301(req, "/it/certificazioni/microsoft-ai");
}
if (pathname === "/certifications/microsoft-ai/ai-concepts") {
  return redirect301(req, "/certifications/microsoft-ai");
}
if (pathname === "/certifications/microsoft-ai/ai-concepts/review") {
  return redirect301(req, "/certifications/microsoft-ai");
}
if (pathname === "/fr/certifications/microsoft-ai/concepts-de-lia") {
  return redirect301(req, "/fr/certifications/microsoft-ai");
}
if (pathname === "/fr/certifications/microsoft-ai/concepts-de-lia/revision") {
  return redirect301(req, "/fr/certifications/microsoft-ai");
}
if (pathname === "/es/certificaciones/microsoft-ai/conceptos-de-ia") {
  return redirect301(req, "/es/certificaciones/microsoft-ai");
}
if (pathname === "/es/certificaciones/microsoft-ai/conceptos-de-ia/repaso") {
  return redirect301(req, "/es/certificaciones/microsoft-ai");
}

if (pathname === "/it/certificazioni/microsoft-ai/machine-learning-su-azure") {
  return redirect301(req, "/it/certificazioni/microsoft-ai");
}
if (pathname === "/it/certificazioni/microsoft-ai/machine-learning-su-azure/ripasso") {
  return redirect301(req, "/it/certificazioni/microsoft-ai");
}
if (pathname === "/certifications/microsoft-ai/machine-learning-on-azure") {
  return redirect301(req, "/certifications/microsoft-ai");
}
if (pathname === "/certifications/microsoft-ai/machine-learning-on-azure/review") {
  return redirect301(req, "/certifications/microsoft-ai");
}
if (pathname === "/fr/certifications/microsoft-ai/apprentissage-automatique-sur-azure") {
  return redirect301(req, "/fr/certifications/microsoft-ai");
}
if (pathname === "/fr/certifications/microsoft-ai/apprentissage-automatique-sur-azure/revision") {
  return redirect301(req, "/fr/certifications/microsoft-ai");
}
if (pathname === "/es/certificaciones/microsoft-ai/aprendizaje-automatico-en-azure") {
  return redirect301(req, "/es/certificaciones/microsoft-ai");
}
if (pathname === "/es/certificaciones/microsoft-ai/aprendizaje-automatico-en-azure/repaso") {
  return redirect301(req, "/es/certificaciones/microsoft-ai");
}

if (pathname === "/it/certificazioni/microsoft-ai/visione-artificiale") {
  return redirect301(req, "/it/certificazioni/microsoft-ai");
}
if (pathname === "/it/certificazioni/microsoft-ai/visione-artificiale/ripasso") {
  return redirect301(req, "/it/certificazioni/microsoft-ai");
}
if (pathname === "/certifications/microsoft-ai/computer-vision") {
  return redirect301(req, "/certifications/microsoft-ai");
}
if (pathname === "/certifications/microsoft-ai/computer-vision/review") {
  return redirect301(req, "/certifications/microsoft-ai");
}
if (pathname === "/fr/certifications/microsoft-ai/vision-par-ordinateur") {
  return redirect301(req, "/fr/certifications/microsoft-ai");
}
if (pathname === "/fr/certifications/microsoft-ai/vision-par-ordinateur/revision") {
  return redirect301(req, "/fr/certifications/microsoft-ai");
}
if (pathname === "/es/certificaciones/microsoft-ai/vision-por-computadora") {
  return redirect301(req, "/es/certificaciones/microsoft-ai");
}
if (pathname === "/es/certificaciones/microsoft-ai/vision-por-computadora/repaso") {
  return redirect301(req, "/es/certificaciones/microsoft-ai");
}

if (pathname === "/it/certificazioni/microsoft-ai/elaborazione-del-linguaggio-naturale") {
  return redirect301(req, "/it/certificazioni/microsoft-ai");
}
if (pathname === "/it/certificazioni/microsoft-ai/elaborazione-del-linguaggio-naturale/ripasso") {
  return redirect301(req, "/it/certificazioni/microsoft-ai");
}
if (pathname === "/certifications/microsoft-ai/natural-language-processing") {
  return redirect301(req, "/certifications/microsoft-ai");
}
if (pathname === "/certifications/microsoft-ai/natural-language-processing/review") {
  return redirect301(req, "/certifications/microsoft-ai");
}
if (pathname === "/fr/certifications/microsoft-ai/traitement-du-langage-naturel") {
  return redirect301(req, "/fr/certifications/microsoft-ai");
}
if (pathname === "/fr/certifications/microsoft-ai/traitement-du-langage-naturel/revision") {
  return redirect301(req, "/fr/certifications/microsoft-ai");
}
if (pathname === "/es/certificaciones/microsoft-ai/procesamiento-de-lenguaje-natural") {
  return redirect301(req, "/es/certificaciones/microsoft-ai");
}
if (pathname === "/es/certificaciones/microsoft-ai/procesamiento-de-lenguaje-natural/repaso") {
  return redirect301(req, "/es/certificaciones/microsoft-ai");
}

if (pathname === "/it/certificazioni/microsoft-ai/ai-generativa") {
  return redirect301(req, "/it/certificazioni/micr…3389 tokens truncated… headers: { "content-type": "application/json" } });

test("internalApiHeaders: header solo se INTERNAL_SERVER_TOKEN è impostato", async () => {
  const { internalApiHeaders, INTERNAL_TOKEN_HEADER } = await import("../src/lib/server/internal-api");
  delete process.env.INTERNAL_SERVER_TOKEN;
  assert.deepEqual(internalApiHeaders(), {});
  process.env.INTERNAL_SERVER_TOKEN = SECRET;
  assert.deepEqual(internalApiHeaders(), { [INTERNAL_TOKEN_HEADER]: SECRET });
  assert.equal(INTERNAL_TOKEN_HEADER, "X-Internal-Server-Token");
});

test("getTopicPageData invia l'header interno e non mette il secret nell'URL", async () => {
  process.env.INTERNAL_SERVER_TOKEN = SECRET;
  const { getTopicPageData } = await import("../src/lib/server/topic-page");
  calls.length = 0;
  nextResponse = () =>
    json(200, {
      topic: { id: 1, quiz_id: null, slug: "t", title: "T", description: "" },
      certification: { id: 2, slug: "c", title: "C" },
      relatedTopics: [],
      questionCount: 3,
    });
  const data = await getTopicPageData({ certSlug: "c", topicSlug: "t", lang: "en" });
  assert.equal(data?.topic.id, 1);
  assert.deepEqual(data?.topic.faq, []);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "https://api.example.test/api/topic-pages/c/t?lang=en");
  assert.equal(calls[0].headers["X-Internal-Server-Token"], SECRET);
  assert.ok(!calls[0].url.includes(SECRET));
});

test("getTopicPageData: 404 → null, ma 429 e 5xx restano errori (mai 404)", async () => {
  const { getTopicPageData } = await import("../src/lib/server/topic-page");

  nextResponse = () => json(404, { error: "TOPIC_PAGE_NOT_FOUND" });
  assert.equal(await getTopicPageData({ certSlug: "c", topicSlug: "missing", lang: "en" }), null);

  for (const status of [429, 500, 503]) {
    nextResponse = () => json(status, { error: "x" });
    await assert.rejects(
      getTopicPageData({ certSlug: "c", topicSlug: "t", lang: "it" }),
      (err: Error) => {
        assert.match(err.message, new RegExp(`HTTP ${status}`));
        assert.ok(!err.message.includes(SECRET), "il secret non deve finire nel messaggio d'errore");
        return true;
      },
    );
  }
});

test("topic resolver uses the real DB key for public TensorFlow/C# aliases in every language", async () => {
  const { getTopicPageData } = await import("../src/lib/server/topic-page");
  const previousFetch = globalThis.fetch;
  const cases = [
    ["tensorflow", "google-tensorflow", "neural-networks"],
    ["google-tensorflow", "google-tensorflow", "neural-networks"],
    ["tensorflow-developer", "google-tensorflow", "neural-networks"],
    ["csharp", "microsoft-csharp", "object-oriented-programming"],
    ["microsoft-csharp", "microsoft-csharp", "object-oriented-programming"],
  ];
  try {
  for (const lang of ["en", "it", "fr", "es"] as const) {
    for (const [certSlug, dbSlug, topicSlug] of cases) {
      calls.length = 0;
      globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        calls.push({ url, headers: { ...(init?.headers as Record<string, string>) } });
        return url === `https://api.example.test/api/topic-pages/${dbSlug}/${topicSlug}?lang=${lang}`
          ? json(200, { topic: { id: 145, faq: [] }, certification: { slug: dbSlug }, relatedTopics: [], questionCount: 5 })
          : json(404, { error: "TOPIC_PAGE_NOT_FOUND" });
      }) as typeof fetch;
      assert.equal((await getTopicPageData({ certSlug, topicSlug, lang }))?.topic.id, 145);
      assert.equal(calls.length, 1);
    }
  }
  } finally {
    globalThis.fetch = previousFetch;
  }
});

test("getTopicsByCertSlug (by-cert) invia l'header interno", async () => {
  process.env.INTERNAL_SERVER_TOKEN = SECRET;
  const { getTopicsByCertSlug } = await import("../src/lib/data");
  calls.length = 0;
  nextResponse = () => json(200, { topics: [{ id: 1, slug_en: "a", title_en: "A", slug: "a", title: "A" }] });
  await getTopicsByCertSlug("ccna", "en");
  const call = calls.find((c) => c.url.includes("/topic-pages/by-cert/"));
  assert.ok(call, "fetch by-cert non eseguita");
  assert.equal(call.headers["X-Internal-Server-Token"], SECRET);
  assert.ok(!call.url.includes(SECRET));
});

test("il secret non è esposto come NEXT_PUBLIC_* e il modulo resta server-only", () => {
  const src = fs.readFileSync(path.resolve(process.cwd(), "src/lib/server/internal-api.ts"), "utf8");
  assert.match(src, /^import "server-only";/m);
  assert.ok(!/NEXT_PUBLIC_INTERNAL/.test(src));

  const offenders: string[] = [];
  const walk = (dir: string) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (/\.(ts|tsx)$/.test(e.name)) {
        const t = fs.readFileSync(p, "utf8");
        if (/NEXT_PUBLIC_INTERNAL_SERVER_TOKEN/.test(t)) offenders.push(p);
        if (/^["']use client["']/m.test(t) && /INTERNAL_SERVER_TOKEN|server\/internal-api/.test(t)) offenders.push(p);
      }
    }
  };
  walk(path.resolve(process.cwd(), "src"));
  assert.deepEqual(offenders, []);
});
