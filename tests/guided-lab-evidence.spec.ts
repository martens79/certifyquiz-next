import { expect as baseExpect, test, type Page } from "@playwright/test";

// Il server di produzione locale idrata pagine pesanti (header, analytics, consenso): 5s di
// default sono troppo stretti sotto carico. Solo i timeout delle asserzioni, nessuna logica cambiata.
const expect = baseExpect.configure({ timeout: 15_000 });

// Il service worker dell'app (skipWaiting + clients.claim + handler fetch) prende il controllo
// della pagina a meta' caricamento: da quel momento le richieste NON passano piu' da page.route
// e uscirebbero verso il backend reale. Bloccarlo rende il test hermetico e deterministico.
test.use({ serviceWorkers: "block" });

/**
 * E2E hermetico del guided-lab engine con evidenze tecniche e UX anonima.
 *
 * Nessun lab CEH esiste nel DB: il payload e' un FIXTURE NON PERSISTENTE definito qui
 * e servito intercettando le chiamate del browser a /api/backend. Ogni richiesta NON
 * GET verso il backend (attempt, check, complete, analytics) viene bloccata o mockata:
 * il test non scrive mai su nessun database.
 */

const CEH_SLUG = "ceh-recon-service-enumeration";

// Evidenze sintetiche (TEST-NET-3 / example.test). La riga "Nmap done" e' volutamente
// larga per forzare lo scroll orizzontale dentro l'exhibit su viewport mobile.
const NMAP = [
  "$ sudo nmap -sS -sU -sV -p T:22,T:80,T:443,U:161 203.0.113.10",
  "Starting Nmap 7.94 ( https://nmap.org ) at 2026-09-21 10:02 UTC",
  "Nmap scan report for web01.example.test (203.0.113.10)",
  "",
  "PORT    STATE         SERVICE  VERSION",
  "22/tcp  open          ssh      OpenSSH 8.4p1 Debian 5+deb11u3 (protocol 2.0)",
  "80/tcp  open          http     nginx 1.22.1",
  "443/tcp filtered      https",
  "161/udp open|filtered snmp",
  "Nmap done: 1 IP address (1 host up) scanned in 118.47 seconds; note: UDP results are inconclusive when no reply is received from the target",
].join("\n");
const HTTP = [
  "GET /api/orders/10442 HTTP/1.1",
  "Host: shop.example.test",
  "Cookie: sid=REDACTED",
  "",
  "HTTP/1.1 200 OK",
  "Content-Type: application/json",
  "",
  '{"id":10442,"owner":"t1"}',
].join("\n");
const EXPLANATION = "Primo paragrafo della spiegazione.\n\nSecondo paragrafo, separato da una riga vuota.";

type Step = { id: string; title: string; instruction: string; type: "single" | "multi" | "text"; options?: { id: string; label: string }[]; placeholder?: string; evidence?: { title?: string; kind?: string; content: string }[] };

const payload = (slug: string, certificationSlug: string, steps: Step[]) => ({
  success: true,
  lab: {
    id: 9001, slug, title: "Fixture lab", description: "Fixture non persistente", difficulty: "base", estimatedMinutes: 15,
    rendererKey: "guided-steps-v1", contentVersion: 1, certificationSlug,
    content: { scenario: "Engagement autorizzato.\nAmbito 203.0.113.0/28.", objective: "Leggere l'evidenza.", prerequisites: ["Nmap"], steps },
  },
});

const CEH_STEPS: Step[] = [
  { id: "s1", title: "Leggi lo scan", instruction: "Quale affermazione è dimostrata?", type: "single", options: [{ id: "a", label: "Risposta A" }, { id: "b", label: "Risposta B" }], evidence: [{ title: "Nmap scan", kind: "cli", content: NMAP }] },
  { id: "s2", title: "Leggi la richiesta HTTP", instruction: "Seleziona le conclusioni supportate.", type: "multi", options: [{ id: "a", label: "Conclusione A" }, { id: "b", label: "Conclusione B" }], evidence: [{ title: "HTTP exchange", kind: "http", content: HTTP }, { title: "Secondo blocco", content: "riga uno\nriga due" }] },
  { id: "s3", title: "Scrivi la porta", instruction: "Quale porta UDP ha risposto?", type: "text", placeholder: "es. 161" },
];

const PLAIN_STEPS: Step[] = [
  { id: "p1", title: "Passo uno", instruction: "Scegli.", type: "single", options: [{ id: "a", label: "Opzione A" }, { id: "b", label: "Opzione B" }] },
  { id: "p2", title: "Passo due", instruction: "Scegli ancora.", type: "single", options: [{ id: "a", label: "Opzione A" }, { id: "b", label: "Opzione B" }] },
  { id: "p3", title: "Passo tre", instruction: "Ultimo passo.", type: "single", options: [{ id: "a", label: "Opzione A" }, { id: "b", label: "Opzione B" }] },
];

type Mode = { attempts: 201 | 401; check?: "correct" | "wrong" | 500 };

async function mockLab(page: Page, slug: string, body: ReturnType<typeof payload>, mode: Mode) {
  const writes: string[] = [];
  const labPath = `/api/backend/labs/${slug}`;
  await page.route((url) => url.pathname === `${labPath}/preview`, (route) => route.fulfill({ json: { success: true, lab: { title: body.lab.title, description: body.lab.description, difficulty: "base", estimatedMinutes: 15, locked: false, accessReason: "free_lab" } } }));
  await page.route((url) => url.pathname === `${labPath}/content`, (route) => route.fulfill({ json: body }));
  await page.route((url) => url.pathname === `${labPath}/attempts`, (route) => {
    writes.push("POST attempts (mock)");
    return mode.attempts === 401 ? route.fulfill({ status: 401, json: { error: "UNAUTHORIZED" } }) : route.fulfill({ status: 201, json: { success: true, attemptId: 1, contentVersion: 1 } });
  });
  await page.route((url) => url.pathname === `${labPath}/attempts/1/check`, (route) => {
    writes.push("POST check (mock)");
    if (mode.check === 500) return route.fulfill({ status: 500, json: { error: "SERVER_ERROR" } });
    return route.fulfill({ json: { success: true, correct: mode.check !== "wrong" } });
  });
  await page.route((url) => url.pathname === `${labPath}/attempts/1/complete`, (route) => {
    writes.push("POST complete (mock)");
    return route.fulfill({ json: { success: true, score: 100, passed: true, correct: body.lab.content.steps.length, total: body.lab.content.steps.length, solution: { explanation: EXPLANATION } } });
  });
  return writes;
}

// Isolamento totale dal backend: NESSUNA richiesta a /api/backend esce dal browser.
// Le route specifiche di mockLab (registrate dopo) hanno priorita' su questa. Il resto risponde
// come per un visitatore anonimo: auth 401 JSON, altre GET 404 JSON, scritture 204. Cosi' il test
// e' hermetico (nessuna dipendenza dalla latenza o dal rate limit di produzione) e non puo'
// scrivere su nessun database, analytics incluse.
test.beforeEach(async ({ page }) => {
  // Nessuna richiesta a host esterni (gtag, pixel, Turnstile, Sanity...): piu' veloce e hermetico.
  await page.route((url) => url.hostname !== "localhost" && url.hostname !== "127.0.0.1", (route) => route.abort());
  await page.route((url) => url.pathname.startsWith("/api/backend/"), (route) => {
    const request = route.request();
    if (new URL(request.url()).pathname.startsWith("/api/backend/auth/")) return route.fulfill({ status: 401, json: { error: "UNAUTHORIZED" } });
    if (request.method() === "GET" || request.method() === "HEAD") return route.fulfill({ status: 404, json: { error: "NOT_MOCKED" } });
    return route.fulfill({ status: 204, body: "" });
  });
});

const answerCurrentStep = async (page: Page, type: Step["type"]) => {
  if (type === "single") await page.getByRole("radio").first().check();
  else if (type === "multi") await page.getByRole("checkbox").first().check();
  else await page.getByPlaceholder("es. 161").fill("161");
};

test.describe("CEH guided lab: evidence rendering", () => {
  test("multiline Nmap evidence is verbatim, monospace, whitespace-preserving and scrollable", async ({ page }) => {
    await mockLab(page, CEH_SLUG, payload(CEH_SLUG, "ceh", CEH_STEPS), { attempts: 201 });
    await page.goto(`/it/interactive-labs/${CEH_SLUG}`);
    await expect(page.getByRole("heading", { name: "Leggi lo scan" })).toBeVisible();

    const evidence = page.locator("[data-lab-evidence] figure");
    await expect(evidence).toHaveCount(1);
    await expect(evidence.locator("figcaption")).toHaveText("Nmap scan");
    const pre = evidence.locator("pre");
    expect(await pre.evaluate((el) => el.textContent)).toBe(NMAP);
    const style = await pre.evaluate((el) => { const s = getComputedStyle(el); return { family: s.fontFamily, whiteSpace: s.whiteSpace, overflowX: s.overflowX }; });
    expect(style.family.toLowerCase()).toMatch(/mono|courier|consolas/);
    expect(style.whiteSpace).toBe("pre");
    expect(style.overflowX).toBe("auto");
    await expect(page.getByText("Nmap done: 1 IP address")).toBeVisible();
  });

  test("on mobile the exhibit scrolls inside itself and the page does not overflow horizontally", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await mockLab(page, CEH_SLUG, payload(CEH_SLUG, "ceh", CEH_STEPS), { attempts: 201 });
    await page.goto(`/it/interactive-labs/${CEH_SLUG}`);
    const pre = page.locator("[data-lab-evidence] pre");
    await expect(pre).toBeVisible();
    const m = await pre.evaluate((el) => ({ scroll: el.scrollWidth, client: el.clientWidth }));
    expect(m.scroll).toBeGreaterThan(m.client);
    const page_ = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, inner: window.innerWidth }));
    expect(page_.scroll).toBeLessThanOrEqual(page_.inner);
  });

  test("full flow: HTML exchange + second block on step 2, no evidence on step 3, multi-paragraph final explanation", async ({ page }) => {
    const writes = await mockLab(page, CEH_SLUG, payload(CEH_SLUG, "ceh", CEH_STEPS), { attempts: 201, check: "correct" });
    await page.goto(`/it/interactive-labs/${CEH_SLUG}`);

    await answerCurrentStep(page, "single");
    await page.getByRole("button", { name: "Verifica" }).click();
    await expect(page.getByText("Risposta corretta")).toBeVisible();
    await page.getByRole("button", { name: "Continua" }).click();

    await expect(page.getByRole("heading", { name: "Leggi la richiesta HTTP" })).toBeVisible();
    await expect(page.locator("[data-lab-evidence] figure")).toHaveCount(2);
    expect(await page.locator("[data-lab-evidence] pre").first().evaluate((el) => el.textContent)).toBe(HTTP);
    await expect(page.locator("[data-lab-evidence] figcaption").nth(1)).toHaveText("Secondo blocco");
    await answerCurrentStep(page, "multi");
    await page.getByRole("button", { name: "Verifica" }).click();
    await page.getByRole("button", { name: "Continua" }).click();

    await expect(page.getByRole("heading", { name: "Scrivi la porta" })).toBeVisible();
    await expect(page.locator("[data-lab-evidence]")).toHaveCount(0);
    await expect(page.locator("figure")).toHaveCount(0);
    await answerCurrentStep(page, "text");
    await page.getByRole("button", { name: "Verifica" }).click();
    await page.getByRole("button", { name: "Completa laboratorio" }).click();

    await expect(page.getByText("100% — Laboratorio superato")).toBeVisible();
    const explanation = page.getByText("Primo paragrafo della spiegazione.");
    await expect(explanation).toBeVisible();
    expect(await explanation.evaluate((el) => getComputedStyle(el).whiteSpace)).toBe("pre-line");
    expect(await explanation.evaluate((el) => (el as HTMLElement).innerText)).toContain("\n\n");
    // solo richieste mockate: nessuna scrittura reale
    expect(writes.every((w) => w.includes("(mock)"))).toBe(true);
  });

  test("evidence containing HTML is rendered as text, never as markup", async ({ page }) => {
    const steps: Step[] = [{ ...CEH_STEPS[0], evidence: [{ title: "x", content: '<img src=x onerror="window.__pwned=1"><script>window.__pwned=1</script>' }] }, ...CEH_STEPS.slice(1)];
    await mockLab(page, CEH_SLUG, payload(CEH_SLUG, "ceh", steps), { attempts: 201 });
    await page.goto(`/it/interactive-labs/${CEH_SLUG}`);
    await expect(page.locator("[data-lab-evidence] pre")).toContainText("<img src=x");
    await expect(page.locator("[data-lab-evidence] img")).toHaveCount(0);
    expect(await page.evaluate(() => (window as unknown as { __pwned?: number }).__pwned)).toBeUndefined();
  });
});

test.describe("guided lab: anonymous visitor on a FREE lab", () => {
  test("401 on attempts shows a login/register CTA instead of the generic error, and keeps the lab visible", async ({ page }) => {
    const writes = await mockLab(page, CEH_SLUG, payload(CEH_SLUG, "ceh", CEH_STEPS), { attempts: 401 });
    await page.goto(`/it/interactive-labs/${CEH_SLUG}`);
    await answerCurrentStep(page, "single");
    await page.getByRole("button", { name: "Verifica" }).click();

    const prompt = page.locator("[data-lab-auth-required]");
    await expect(prompt).toBeVisible();
    await expect(prompt).toContainText("Accedi per verificare le risposte");
    const target = encodeURIComponent(`/it/interactive-labs/${CEH_SLUG}`);
    await expect(prompt.getByRole("link", { name: "Accedi" })).toHaveAttribute("href", `/it/login?redirect=${target}`);
    await expect(prompt.getByRole("link", { name: "Registrati gratis" })).toHaveAttribute("href", `/it/register?redirect=${target}`);
    // non e' l'errore generico e il lab resta leggibile (evidenza e domanda ancora sullo schermo)
    await expect(page.getByText("momentaneamente disponibile")).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Leggi lo scan" })).toBeVisible();
    await expect(page.locator("[data-lab-evidence] figure")).toHaveCount(1);
    // nessun check e' stato inviato: l'accesso anonimo non diventa eseguibile
    expect(writes.some((w) => w.includes("check"))).toBe(false);
  });

  test("English route redirects back to the English lab path", async ({ page }) => {
    await mockLab(page, CEH_SLUG, payload(CEH_SLUG, "ceh", CEH_STEPS), { attempts: 401 });
    await page.goto(`/interactive-labs/${CEH_SLUG}`);
    await page.getByRole("radio").first().check();
    await page.getByRole("button", { name: "Check" }).click();
    const prompt = page.locator("[data-lab-auth-required]");
    await expect(prompt).toContainText("Sign in to check your answers");
    await expect(prompt.getByRole("link", { name: "Sign in" })).toHaveAttribute("href", `/en/login?redirect=${encodeURIComponent(`/interactive-labs/${CEH_SLUG}`)}`);
  });

  test("a non-401 failure still shows the generic error (no regression)", async ({ page }) => {
    await mockLab(page, CEH_SLUG, payload(CEH_SLUG, "ceh", CEH_STEPS), { attempts: 201, check: 500 });
    await page.goto(`/it/interactive-labs/${CEH_SLUG}`);
    await answerCurrentStep(page, "single");
    await page.getByRole("button", { name: "Verifica" }).click();
    await expect(page.locator("main").getByRole("alert")).toContainText("momentaneamente disponibile");
    await expect(page.locator("[data-lab-auth-required]")).toHaveCount(0);
  });
});

test.describe("existing guided labs (CCST Networking, CCST Cybersecurity, CCNA) are unchanged", () => {
  const families = [
    { slug: "ccst-networking-ip-configuration", cert: "cisco-ccst-networking", label: "Cisco CCST Networking" },
    { slug: "ccst-cybersecurity-classify-the-incident", cert: "cisco-ccst-cybersecurity", label: "Cisco CCST Cybersecurity" },
    { slug: "ccna-static-routing", cert: "ccna", label: "Cisco CCNA" },
  ];
  for (const { slug, cert, label } of families) {
    test(`${slug}: no evidence UI, header label, step flow and final explanation`, async ({ page }) => {
      await mockLab(page, slug, payload(slug, cert, PLAIN_STEPS), { attempts: 201, check: "correct" });
      await page.goto(`/it/interactive-labs/${slug}`);
      await expect(page.getByText(label, { exact: true })).toBeVisible();
      await expect(page.locator("figure")).toHaveCount(0);
      await expect(page.locator("[data-lab-evidence]")).toHaveCount(0);
      for (const title of ["Passo uno", "Passo due", "Passo tre"]) {
        await expect(page.getByRole("heading", { name: title })).toBeVisible();
        await answerCurrentStep(page, "single");
        await page.getByRole("button", { name: "Verifica" }).click();
        await expect(page.getByText("Risposta corretta")).toBeVisible();
        await page.getByRole("button", { name: title === "Passo tre" ? "Completa laboratorio" : "Continua" }).click();
      }
      await expect(page.getByText("100% — Laboratorio superato")).toBeVisible();
    });
  }

  test("only the four approved ceh-* slugs are routable", async ({ page }) => {
    const ok = await page.goto(`/it/interactive-labs/${CEH_SLUG}`);
    expect(ok?.status()).toBe(200);
    const unknown = await page.goto("/it/interactive-labs/ceh-not-approved");
    expect(unknown?.status()).toBe(404);
  });
});
