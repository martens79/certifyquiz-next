import type { BrowserContext, Page, Route } from "@playwright/test";

// Backend finto per i test E2E di persistenza della sessione quiz.
//
// Nessuna rete reale: ogni chiamata a /api/backend/** viene intercettata nel
// browser. Il contratto replicato e' quello delle route di Paywall Phase 1/2:
//   - il payload delle domande NON contiene la risposta corretta ne' la
//     spiegazione (le dice /answers/check dopo la risposta);
//   - /questions-mixed (shuffle=1) e /mock-exam/questions restituiscono un
//     campione CASUALE a ogni chiamata (ORDER BY RAND() lato server);
//   - /questions/:topicId con shuffle=0 e' deterministico (ORDER BY id);
//   - access token di breve durata: scaduto -> 401 -> /auth/refresh.

export const CERT_SLUG = "cisco-ccst-security";
export const CERT_ID = 12; // CCST Cybersecurity: mock 50 domande / 60 minuti
export const TOPIC_ID = 85;
export const POOL_SIZE = 330;
export const TOPIC_POOL_SIZE = 40;
export const MOCK_QUESTIONS = 50;

type UserSpec = { id: number; premium?: boolean; username?: string };

export type BackendOptions = {
  /** utente con sessione valida (token + refresh cookie). null = anonimo */
  user?: UserSpec | null;
  /** quote di spiegazioni-errore gratuite: numero, oppure "unlimited" */
  freeExplanations?: number | "unlimited";
  /** il server rifiuta il batch Training con POST_GATE_QUIZ_LIMIT_REACHED */
  hardLocked?: boolean;
  /** il server rifiuta il mock exam (MOCK_EXAM_ACCESS_REQUIRED) */
  mockDenied?: boolean;
};

function makeQuestion(id: number) {
  return {
    id,
    topic_id: TOPIC_ID,
    certification_id: CERT_ID,
    question: `Synthetic question #${id}`,
    question_type: "standard",
    answers: [1, 2, 3, 4].map((n) => ({ id: id * 10 + n, text: `Answer ${n} of ${id}` })),
  };
}

const MIXED_POOL = Array.from({ length: POOL_SIZE }, (_, i) => makeQuestion(9001 + i));
const TOPIC_POOL = Array.from({ length: TOPIC_POOL_SIZE }, (_, i) => makeQuestion(7001 + i));

function sample<T>(items: T[], n: number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

const json = (route: Route, status: number, body: unknown) =>
  route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });

export class FakeBackend {
  mixedFetches = 0;
  topicFetches = 0;
  mockFetches = 0;
  checkCalls: Array<{ question_id: number; answer_id: number }> = [];
  refreshCalls = 0;
  inbox401 = 0;
  inbox200 = 0;
  mockEvaluations = 0;
  saveExamCalls = 0;

  private validToken = "tok-0";
  private rotation = 0;
  private freeLeft: number | "unlimited";
  private firstAttempts = new Map<string, boolean>();
  private explanationsGranted = new Set<string>();
  /** sessione server lato refresh-cookie */
  private refreshCookie: boolean;

  constructor(public options: BackendOptions = {}) {
    this.freeLeft = options.freeExplanations ?? 10;
    this.refreshCookie = !!options.user;
  }

  get user() {
    return this.options.user ?? null;
  }

  /** L'access token (15 min) scade lato server mentre il browser e' fermo. */
  expireAccessToken() {
    this.rotation += 1;
    this.validToken = `tok-rotated-${this.rotation}`;
  }

  /** Imposta una nuova sessione lato server (login/cambio utente). */
  loginAs(user: UserSpec | null) {
    this.options = { ...this.options, user };
    this.refreshCookie = !!user;
    this.rotation += 1;
    this.validToken = `tok-login-${this.rotation}`;
    return this.validToken;
  }

  get currentToken() {
    return this.validToken;
  }

  /** spiegazioni gratuite rimaste (null = illimitate) */
  get freeRemaining(): number | null {
    return this.user?.premium || this.freeLeft === "unlimited" ? null : (this.freeLeft as number);
  }

  /** Token e utente nel localStorage, come dopo un login riuscito. */
  async seedBrowserSession(context: BrowserContext, user = this.user) {
    if (!user) return;
    const token = this.validToken;
    await context.addInitScript(
      ({ token, user }) => {
        // Solo al primo caricamento: un logout (che svuota lo storage) o un
        // cambio utente fatto dal test non deve essere annullato dal reload.
        if (sessionStorage.getItem("__e2e_seeded")) return;
        sessionStorage.setItem("__e2e_seeded", "1");
        localStorage.setItem("cq:access", token);
        localStorage.setItem(
          "cq_user",
          JSON.stringify({ id: user.id, username: user.username ?? "tester", email: "t@example.test", role: "user", premium: !!user.premium, trial: false })
        );
      },
      { token, user }
    );
  }

  async install(page: Page) {
    const bearer = (route: Route) =>
      (route.request().headers()["authorization"] || "").replace(/^Bearer /, "");
    const tokenOk = (route: Route) => !!this.user && bearer(route) === this.validToken;

    // tutto cio' che non e' localhost (analytics, font, ads) -> abort
    await page.route(/^https?:\/\/(?!localhost)/, (r) => r.abort());

    // default: ok vuoto
    await page.route("**/api/backend/**", (route) => json(route, 200, {}));

    await page.route("**/api/backend/certifications/by-slug/**", (route) =>
      json(route, 200, { id: CERT_ID, slug: CERT_SLUG, name: "Cisco CCST Cybersecurity" })
    );

    await page.route("**/api/backend/question-pool/**", (route) =>
      json(route, 200, { poolTotal: POOL_SIZE })
    );
    await page.route("**/api/backend/topics/meta/by-topic/**", (route) =>
      json(route, 200, {
        topic: { id: TOPIC_ID, certification_id: CERT_ID, title_it: "T", title_en: "Topic", title_fr: "T", title_es: "T" },
        certification: { id: CERT_ID, name: "CCST", name_it: "CCST", name_en: "CCST", name_fr: "CCST", name_es: "CCST" },
      })
    );

    // ---- bank routes -----------------------------------------------------
    const hardLockedBody = { error: "POST_GATE_QUIZ_LIMIT_REACHED", hardLocked: true, limit: 5, used: 5, remaining: 0 };

    await page.route("**/api/backend/questions-mixed/**", (route) => {
      this.mixedFetches++;
      if (this.options.hardLocked) return json(route, 403, hardLockedBody);
      const url = new URL(route.request().url());
      const limit = Number(url.searchParams.get("limit") || 30);
      const shuffle = url.searchParams.get("shuffle") === "1";
      const picked = shuffle ? sample(MIXED_POOL, limit) : MIXED_POOL.slice(0, limit);
      return json(route, 200, { poolTotal: POOL_SIZE, questions: picked });
    });

    await page.route("**/api/backend/questions/**", (route) => {
      this.topicFetches++;
      if (this.options.hardLocked) return json(route, 403, hardLockedBody);
      return json(route, 200, { poolTotal: TOPIC_POOL_SIZE, questions: TOPIC_POOL });
    });

    await page.route("**/api/backend/mock-exam/questions/**", (route) => {
      this.mockFetches++;
      if (this.options.mockDenied) return json(route, 403, { error: "MOCK_EXAM_ACCESS_REQUIRED" });
      return json(route, 200, {
        poolTotal: POOL_SIZE,
        questions: sample(MIXED_POOL, MOCK_QUESTIONS),
        purpose: "mock_exam",
        spec: { questions: MOCK_QUESTIONS, served: MOCK_QUESTIONS, durationSec: 3600 },
      });
    });

    // ---- answers (server-authoritative) -----------------------------------
    await page.route("**/api/backend/answers/check", async (route) => {
      const body = JSON.parse(route.request().postData() || "{}");
      const qId = Number(body.question_id);
      const aId = Number(body.answer_id);
      this.checkCalls.push({ question_id: qId, answer_id: aId });
      const correctId = qId * 10 + 1;
      const correct = aId === correctId;
      const attemptKey = `${this.user?.id ?? "anon"}:${qId}`;

      const unlimited = !!this.user?.premium || this.freeLeft === "unlimited";
      if (!this.firstAttempts.has(attemptKey)) this.firstAttempts.set(attemptKey, correct);
      const firstCorrect = this.firstAttempts.get(attemptKey)!;

      let granted = true;
      let reason = "correct_answer";
      let consumed = false;
      if (unlimited) {
        reason = "unlimited";
      } else if (!firstCorrect && !this.explanationsGranted.has(attemptKey)) {
        if (typeof this.freeLeft === "number" && this.freeLeft > 0) {
          this.freeLeft -= 1;
          consumed = true;
          reason = "free_quota";
        } else {
          granted = false;
          reason = "quota_exhausted";
        }
      } else if (!firstCorrect) {
        reason = "already_granted";
      }
      if (granted) this.explanationsGranted.add(attemptKey);

      return json(route, 200, {
        question_id: qId,
        correct,
        correct_answer_id: correctId,
        explanation: granted ? `Explanation for question ${qId}` : null,
        explanation_access: {
          granted,
          reason,
          unlimited,
          consumed,
          remaining: unlimited ? null : this.freeLeft,
          limit: 10,
        },
      });
    });

    await page.route("**/api/backend/answers/evaluate", (route) => json(route, 200, { results: [], summary: { total: 0, correct: 0 } }));
    await page.route("**/api/backend/mock-exam/evaluate/**", (route) => {
      this.mockEvaluations++;
      return json(route, 200, {
        summary: { total: MOCK_QUESTIONS, answered: 0, correct: 0, wrong: 0, percentage: 0, passed: false },
        reviewAvailable: true,
        reviewReason: "stub",
        details: [],
      });
    });
    await page.route("**/api/backend/save-exam", (route) => {
      this.saveExamCalls++;
      return json(route, 200, { success: true });
    });

    await page.route("**/api/backend/me/explanation-status**", (route) => {
      const unlimited = !!this.user?.premium || this.freeLeft === "unlimited";
      return json(route, 200, {
        unlimited,
        remaining: unlimited ? null : this.freeLeft,
        limit: 10,
        postGate: { hardLocked: !!this.options.hardLocked, used: this.options.hardLocked ? 5 : 0, limit: 5 },
      });
    });
    await page.route("**/api/backend/me/quiz-progress/**", (route) =>
      route.request().method() === "GET" ? json(route, 200, { row: null }) : json(route, 200, { row: { rev: 1 } })
    );

    // ---- auth --------------------------------------------------------------
    await page.route("**/api/backend/auth/me", (route) => {
      if (!tokenOk(route) || !this.user) return json(route, 401, { error: "UNAUTHORIZED" });
      return json(route, 200, {
        user: { id: this.user.id, username: this.user.username ?? "tester", email: "t@example.test", role: "user", premium: !!this.user.premium },
      });
    });
    await page.route("**/api/backend/auth/refresh", (route) => {
      this.refreshCalls++;
      if (!this.refreshCookie || !this.user) return json(route, 401, { error: "NO_REFRESH" });
      this.rotation += 1;
      this.validToken = `tok-refreshed-${this.rotation}`;
      return json(route, 200, { ok: true, token: this.validToken });
    });
    await page.route("**/api/backend/push/inbox", (route) => {
      if (!tokenOk(route)) {
        this.inbox401++;
        return json(route, 401, { error: "UNAUTHORIZED" });
      }
      this.inbox200++;
      return json(route, 200, { items: [], unread: 0 });
    });
  }
}

/* ------------------------------ UI helpers -------------------------------- */

export type QuizHeader = { index: number; total: number; answered: number };

/**
 * Chiude i banner fissi (cookie, suggerimento lingua, PWA) che su mobile
 * coprono i bottoni del quiz e intercettano i click.
 */
export async function dismissCookieBanner(page: Page) {
  for (let i = 0; i < 5; i++) {
    const notice = page.locator("[data-cq-notice]").first();
    if (!(await notice.count()) || !(await notice.isVisible().catch(() => false))) return;

    const reject = notice.getByRole("button", { name: /Rifiuta|Reject|Refuser|Rechazar|Decline/i });
    if (await reject.count()) {
      await reject.first().click().catch(() => undefined);
    } else {
      const buttons = notice.getByRole("button");
      const n = await buttons.count();
      if (!n) return;
      await buttons.nth(n - 1).click().catch(() => undefined);
    }
    await page.waitForTimeout(250);
  }
}

export async function readHeader(page: Page): Promise<QuizHeader | null> {
  return page.evaluate(() => {
    const t = document.body.innerText;
    const q = t.match(/Question\s+(\d+)\s*\/\s*(\d+)/i);
    const a = t.match(/Answered\s+(\d+)/i);
    if (!q) return null;
    return { index: Number(q[1]), total: Number(q[2]), answered: a ? Number(a[1]) : 0 };
  });
}

/** id della domanda mostrata ("Synthetic question #9123") */
export async function readQuestionId(page: Page): Promise<number | null> {
  return page.evaluate(() => {
    const m = document.body.innerText.match(/Synthetic question #(\d+)/);
    return m ? Number(m[1]) : null;
  });
}

/** Timer exam "Time remaining: 59:48" -> secondi */
export async function readTimerSec(page: Page): Promise<number | null> {
  return page.evaluate(() => {
    const m = document.body.innerText.match(/Time remaining:?\s*(\d+):(\d{2})/i);
    return m ? Number(m[1]) * 60 + Number(m[2]) : null;
  });
}

export async function clickNext(page: Page) {
  const cont = page.getByRole("button", { name: /Continue with the next/i });
  if (await cont.count()) {
    await cont.first().click();
    return;
  }
  await page.getByRole("button", { name: /^Next/ }).first().click();
}

/** Avanza (senza rispondere) fino alla domanda `target` (1-based). */
export async function advanceTo(page: Page, target: number) {
  for (let guard = 0; guard < 200; guard++) {
    const h = await readHeader(page);
    if (h && h.index >= target) return;
    await clickNext(page);
    await page.waitForTimeout(60);
  }
  throw new Error(`advanceTo(${target}) non raggiunta`);
}

/** Clicca la risposta n-esima (1..4) della domanda corrente. */
export async function answerCurrent(page: Page, n = 1) {
  await page.getByRole("button", { name: new RegExp(`^Answer ${n} of \\d+`) }).first().click();
  await page.waitForTimeout(150);
}

/** Contenuto grezzo del salvataggio locale di una sessione. */
export async function readStoredProgress(page: Page, scope: string) {
  return page.evaluate((k) => {
    try {
      const raw = localStorage.getItem(`cq:quiz:${k}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, scope);
}

/** Eventi di ciclo di vita come li emette un browser mobile. */
export async function simulateBackgroundAndReturn(page: Page, opts: { bfcache?: boolean } = {}) {
  await page.evaluate(({ bfcache }) => {
    const setVis = (v: "hidden" | "visible") => {
      Object.defineProperty(document, "visibilityState", { configurable: true, get: () => v });
      Object.defineProperty(document, "hidden", { configurable: true, get: () => v === "hidden" });
      document.dispatchEvent(new Event("visibilitychange"));
    };
    setVis("hidden");
    window.dispatchEvent(new PageTransitionEvent("pagehide", { persisted: !!bfcache }));
    document.dispatchEvent(new Event("freeze"));
    document.dispatchEvent(new Event("resume"));
    window.dispatchEvent(new PageTransitionEvent("pageshow", { persisted: !!bfcache }));
    setVis("visible");
    window.dispatchEvent(new Event("online"));
    window.dispatchEvent(new Event("focus"));
  }, { bfcache: !!opts.bfcache });
}

/** Chiavi quiz presenti in localStorage (progresso e snapshot). */
export async function readQuizKeys(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith("cq:quiz:")) keys.push(k);
    }
    return keys.sort();
  });
}

/**
 * Simula "il telefono e' rimasto fermo N secondi": chiude la pagina (che
 * scrive l'ultimo salvataggio) e retrodata savedAt da una pagina neutra
 * dello stesso origin. Ritorna una pagina nuova gia' collegata al backend.
 */
export async function closeAwayAndReopen(
  context: BrowserContext,
  page: Page,
  backend: FakeBackend,
  scope: string,
  awaySec: number
): Promise<Page> {
  await page.close();
  const neutral = await context.newPage();
  await neutral.goto("/robots.txt");
  await neutral.evaluate(
    ({ key, awayMs }) => {
      const raw = localStorage.getItem(key);
      if (!raw) return;
      const o = JSON.parse(raw);
      o.savedAt = (o.savedAt ?? Date.now()) - awayMs;
      localStorage.setItem(key, JSON.stringify(o));
      const snapKey = key.replace("cq:quiz:", "cq:quiz:snap:");
      const sraw = localStorage.getItem(snapKey);
      if (sraw) {
        const sn = JSON.parse(sraw);
        sn.savedAt = (sn.savedAt ?? Date.now()) - awayMs;
        localStorage.setItem(snapKey, JSON.stringify(sn));
      }
    },
    { key: `cq:quiz:${scope}`, awayMs: awaySec * 1000 }
  );
  await neutral.close();
  const fresh = await context.newPage();
  await backend.install(fresh);
  return fresh;
}
