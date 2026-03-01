// src/lib/apiClient.ts
// Client HTTP tipizzato con auto-refresh (via cookie HttpOnly /api/backend)
// ⚠️ Usare SOLO lato client. Per SEO (RSC/ISR) usare i fetcher server in src/lib/server/*

export const API_PREFIX = "/api/backend";

/*─────────────────────────────── AUTH (SINGLE SOURCE OF TRUTH) ───────────────────────────────*/
import { getToken, setToken, clearToken, setUser } from "@/lib/auth";


/** Compat API: usata in giro nel codice */
export function getAccessToken(): string | null {
  return getToken();
}

/** Compat API: remember controlla localStorage vs sessionStorage */
export function setAccessToken(token: string | null, remember = true) {
  if (token) setToken(token, remember); // ✅ NO ricorsione
  else clearToken();
}

/** Pulisce token + user cache */
export function clearAuth() {
  clearToken();
  setUser(null);
}

/*─────────────────────────────── TIPI BASE ───────────────────────────────*/
export type Locale = "it" | "en" | "fr" | "es";

export type Answer = {
  id: number;
  text: string;
  is_correct: 0 | 1 | boolean;
};

export type Question = {
  id: number;
  topic_id?: number | null;
  certification_id?: number | null;
  certification_name?: string | null;
  topic_title?: string | null;
  question: string | null;
  explanation: string | null;
  answers: Answer[];
};

export type QuestionsResponse = Question[] | { questions: Question[] };

export type SaveExamRequest = {
  topicId?: number | null;
  certification_id: number;
  totalQuestions: number;
  correctAnswers: number;
  isExam: boolean;

  // ✅ NEW: per ripasso errori
  attempts?: Array<{
    question_id: number;
    selected_answer_id: number;
  }>;
};

export type QuestionsCountResponse = {
  certification_id: number;
  lang: Locale;
  total: number;
};

export type SaveExamResponse = {
  success: boolean;
  id?: number;
  percentage?: number;
  passed?: boolean;
  streakBonus?: number;
  awardedBadge?: unknown;
  updatedUser?: unknown;
  deduped?: boolean;
};

export type SaveResultRequest = {
  topic_id?: number | null;
  quiz_id?: number | null;
  certification_id?: number | null;
  category_id?: number | null;

  // score normalizzato 0–1 (come i record storici)
  score: number;

  // 🔽 CAMPI REALI DELLA TABELLA quiz_results
  percentage?: number; // 0–100
  total_questions?: number;
  correct_answers?: number;
  is_exam?: number; // 0 | 1
  passed?: number; // 0 | 1
};

export type Badge = {
  id: number;
  badge_id: number;
  title: string;
  image_url: string | null;
  description: string | null;
  earned: boolean;
  obtained_at?: string | null;
  issued_at?: string | null;
};

export type Certification = {
  id: number;
  slug: string | null;
  category_id: number | null;
  name: string | null;
  name_en: string | null;
  name_fr: string | null;
  name_es: string | null;
  description?: string | null;
  description_en?: string | null;
  description_fr?: string | null;
  description_es?: string | null;
  level?: string | null;
  level_en?: string | null;
  level_fr?: string | null;
  level_es?: string | null;
  image_url?: string | null;
  official_url?: string | null;
};

export type CertificationListItem = Pick<
  Certification,
  "id" | "slug" | "category_id" | "name" | "name_en" | "name_fr" | "name_es"
>;

export type CertificationCreatePayload = {
  slug: string;
  name: string;
  name_en?: string | null;
  name_fr?: string | null;
  name_es?: string | null;
  description?: string | null;
  description_en?: string | null;
  description_fr?: string | null;
  description_es?: string | null;
  level?: string | null;
  level_en?: string | null;
  level_fr?: string | null;
  level_es?: string | null;
  image_url?: string | null;
  official_url?: string | null;
  category_id?: number | null;
};

export type CertificationUpdatePayload = Partial<CertificationCreatePayload> & {
  slug?: string;
};

export type Topic = {
  id: number;
  certification_id: number;
  title_it: string;
  title_en: string;
  title_fr: string;
  title_es: string;
  description_it: string;
  description_en: string;
  description_fr: string;
  description_es: string;
};

export type TopicMeta = {
  topic: {
    id: number;
    certification_id: number;
    title_it: string;
    title_en: string;
    title_fr: string;
    title_es: string;
  };
  certification: {
    id: number;
    name: string;
    name_it: string;
    name_en: string;
    name_fr: string;
    name_es: string;
  };
};

export type QuizResultRow = {
  id: number;
  topic_id: number | null;
  quiz_id: number | null;
  certification_id: number | null;
  category_id?: number | null;
  total_questions: number;
  correct_answers: number;
  percentage: number;
  score?: number | null; // compatibilità exam-history
  passed: 0 | 1 | boolean;
  is_exam?: 0 | 1 | boolean;
  date_taken?: string;
  created_at?: string;
  certification_name?: string | null;
};

export type TranslationAvailabilityItem = {
  certification_id: number;
  slug: string;
  topics_total: number;
  topics_with_translations: number;
};

/*─────────────────────────────── FETCH WRAPPER ───────────────────────────────*/
type FetchOpts = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: any;
  auth?: boolean;
  retry?: boolean;
  signal?: AbortSignal;
  withCredentials?: boolean;
  headers?: Record<string, string>;
};

function joinUrl(prefix: string, path: string) {
  const a = prefix.replace(/\/+$/, "");
  const b = path.startsWith("/") ? path : `/${path}`;
  return `${a}${b}`;
}

import { isTokenRemembered } from "@/lib/auth";

async function refreshAccessToken(): Promise<{ token: string | null; status: number | null }> {
  const attempt = async () => {
    const res = await fetch(joinUrl(API_PREFIX, "/auth/refresh"), {
      method: "POST",
      credentials: "include",
      headers: { accept: "application/json" },
    });

    if (!res.ok) return { ok: false as const, status: res.status };

    const data = (await res.json()) as { ok?: boolean; token?: string };
    return { ok: true as const, status: res.status, token: data?.token ?? null };
  };

  try {
    const r1 = await attempt();

    if (r1.ok && r1.token) {
      setAccessToken(r1.token, isTokenRemembered());
      return { token: r1.token, status: r1.status };
    }

    // retry solo su 5xx
    if (!r1.ok && r1.status >= 500) {
      await new Promise((r) => setTimeout(r, 400));
      const r2 = await attempt();

      if (r2.ok && r2.token) {
        setAccessToken(r2.token, isTokenRemembered());
        return { token: r2.token, status: r2.status };
      }

      // retry fallito: ritorna lo status del secondo tentativo
      return { token: null, status: r2.ok ? r2.status : r2.status };
    }

    // fallimento non-5xx (es: 401/403)
    return { token: null, status: r1.ok ? r1.status : r1.status };
  } catch {
    // rete KO
    return { token: null, status: null };
  }
}

async function apiFetch<T>(path: string, opts: FetchOpts = {}): Promise<T> {
  const {
    method = "GET",
    body,
    auth = false,
    retry = true,
    signal,
    withCredentials = false,
    headers = {},
  } = opts;

  const url = joinUrl(API_PREFIX, path);
  const isForm = typeof FormData !== "undefined" && body instanceof FormData;

  const h = new Headers(headers);
  h.set("accept", h.get("accept") ?? "application/json");
  if (!isForm && body != null && !h.has("content-type")) {
    h.set("content-type", "application/json");
  }

  // ✅ Attacca SEMPRE il bearer se presente (molti endpoint lo richiedono)
  const token = getAccessToken();
  if (token) h.set("authorization", `Bearer ${token}`);

  const init: RequestInit = { method, headers: h, signal };

// ✅ Se auth=true, includi SEMPRE i cookie (rt) per refresh/rotate/sessione stabile
// Se vuoi forzare include anche su endpoint pubblici, puoi passare withCredentials=true.
if (auth || withCredentials) init.credentials = "include";
  if (body != null) init.body = isForm ? body : JSON.stringify(body);

  const res = await fetch(url, init);

  // 401 → tenta refresh una volta (solo se auth=true)
 // 401 → tenta refresh una volta (solo se auth=true)
if (res.status === 401 && auth && retry) {
  const { token: newTok, status: refreshStatus } = await refreshAccessToken();

  if (newTok) {
    const h2 = new Headers(h);
    h2.set("authorization", `Bearer ${newTok}`);
    const res2 = await fetch(url, { ...init, headers: h2 });
    if (!res2.ok) throw await toApiError(res2);
    return parseJson<T>(res2);
  }

  // ✅ logout SOLO se refresh è davvero “non autorizzato” (rt scaduto/revocato)
  if (refreshStatus === 401 || refreshStatus === 403) {
    clearAuth();
  }
}

  if (!res.ok) throw await toApiError(res);
  return parseJson<T>(res);
}

async function parseJson<T>(res: Response): Promise<T> {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return (await res.json()) as T;
  const text = await res.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}

async function toApiError(res: Response) {
  let detail: unknown = null;
  try {
    detail = await res.clone().json();
  } catch {
    try {
      detail = await res.text();
    } catch {}
  }
  const err = new Error(`HTTP ${res.status} ${res.statusText}`);
  (err as any).status = res.status;
  (err as any).detail = detail;
  return err;
}

/*─────────────────────────────── SHORTHAND ───────────────────────────────*/
export const apiGet = <T>(path: string, auth = false, signal?: AbortSignal) =>
  apiFetch<T>(path, { method: "GET", auth, signal });

export const apiPost = <T>(path: string, body?: any, auth = false, withCreds = false) =>
  apiFetch<T>(path, { method: "POST", body, auth, withCredentials: withCreds });

export const apiPut = <T>(path: string, body?: any, auth = false) =>
  apiFetch<T>(path, { method: "PUT", body, auth });

export const apiPatch = <T>(path: string, body?: any, auth = false) =>
  apiFetch<T>(path, { method: "PATCH", body, auth });

export const apiDel = <T>(path: string, auth = false) =>
  apiFetch<T>(path, { method: "DELETE", auth });

/*─────────────────────────────── AUTH ───────────────────────────────*/
export type LoginResponse = {
  ok: boolean;
  token: string;
  user: { id: number; username: string; email: string; premium: boolean; role: string };
};

export async function authLogin(email: string, password: string, remember = false) {
  const data = await apiPost<LoginResponse>(
    "/auth/login",
    { email, password, remember },
    false,
    true
  );

  // ✅ token + user cache (stabile per header)
  if (data?.token) setAccessToken(data.token, remember);
  if (data?.user) {
    setUser(
      {
        id: data.user.id,
        email: data.user.email,
        username: data.user.username,
        role: data.user.role,
        premium: data.user.premium,
      },
      remember
    );
  }

  return data;
}

export async function authLogout() {
  try {
    await apiPost<{ ok: true }>("/auth/logout", {}, false, true);
  } finally {
    clearAuth();
  }
}

export const authRegister = (payload: { email: string; password: string; username: string; role?: string }) =>
  apiPost<{ success: true }>("/auth/register", payload, false, false);

export const authMe = () =>
  apiFetch<{ user: { id: number; username: string; email: string; role: string; premium: boolean } }>(
    "/auth/me",
    { method: "GET", auth: true, withCredentials: true }
  );

/*─────────────────────────────── CERTIFICATIONS ───────────────────────────────*/
export const listCertifications = () => apiGet<CertificationListItem[]>("/certifications");
export const getCertificationById = (id: number | string) => apiGet<Certification>(`/certifications/${id}`);
export const getCertificationBySlug = (slug: string) =>
  apiGet<Certification>(`/certifications/by-slug/${encodeURIComponent(slug)}`);
export const createCertification = (payload: CertificationCreatePayload) =>
  apiPost<{ ok: true; id: number; slug: string }>(`/certifications`, payload, true);
export const updateCertification = (id: number | string, payload: CertificationUpdatePayload) =>
  apiPut<{ ok: true; slug: string }>(`/certifications/${id}`, payload, true);
export const deleteCertification = (id: number | string) =>
  apiDel<{ ok: true; deleted: number; slug: string }>(`/certifications/${id}`, true);

/*─────────────────────────────── TOPICS ───────────────────────────────*/
export const getTopicsByCertification = (certificationId: number | string) =>
  apiGet<Topic[]>(`/topics/${certificationId}`);
export const listTopicsByQuery = (certificationId: number | string) =>
  apiGet<Topic[]>(`/topics?certificationId=${encodeURIComponent(String(certificationId))}`);
export const getTopicMetaById = (topicId: number | string) =>
  apiGet<TopicMeta>(`/topics/meta/by-topic/${topicId}`);

/*─────────────────────────────── QUESTIONS ───────────────────────────────*/
export const getQuestionsByTopic = (
  topicId: number | string,
  lang: Locale = "it",
  opts?: { limit?: number; shuffle?: boolean; strict?: boolean }
) => {
  const params = new URLSearchParams({ lang });

  const limit = Math.max(1, Math.min(opts?.limit ?? 30, 500));
  params.set("limit", String(limit));

  params.set("shuffle", (opts?.shuffle ?? true) ? "1" : "0");

  const strict = opts?.strict ?? (lang === "es" || lang === "fr");
  if (strict) params.set("strict", "1");

  return apiGet<QuestionsResponse>(`/questions/${topicId}?${params.toString()}`, false);
};

export const getMixedQuestions = (
  id: number | string,
  lang: Locale = "it",
  opts?: { limit?: number; shuffle?: boolean; strict?: boolean }
) => {
  const params = new URLSearchParams({ lang });
  if (opts?.limit != null) params.set("limit", String(opts.limit));
  if (opts?.shuffle != null) params.set("shuffle", opts.shuffle ? "1" : "0");
  if (opts?.strict != null) params.set("strict", opts.strict ? "1" : "0");

  return apiGet<{ poolTotal?: number; questions: Question[] }>(
    `/questions-mixed/${id}?${params.toString()}`,
    false
  );
};

/*─────────────────────────────── RESULTS / STATS ───────────────────────────────*/
export const saveExam = (payload: SaveExamRequest) => apiPost<SaveExamResponse>("/save-exam", payload, true);
export const saveResult = (payload: SaveResultRequest) =>
  apiPost<{ success: boolean; streakUpdated?: boolean }>("/save-result", payload, true);

export const getQuizResults = () => apiGet<QuizResultRow[]>("/quiz-results", true);

// ✅ Tipo esplicito per evitare l'errore con Pick<...>
export type ExamHistoryRow = {
  score: number | null;
  created_at?: string;
  topic_id: number | null;
  quiz_id: number | null;
  certification_id: number | null;
  percentage: number;
  passed: boolean | 0 | 1;
  certification_name?: string | null;
};
export const getExamHistory = () => apiGet<ExamHistoryRow[]>("/exam-history", true);

// ⚠️ Percorsi corretti: SENZA il prefisso extra '/api'
export const getUserHistory = () => apiGet<QuizResultRow[]>("/user/user-history", true);

export const getUserCategoriesProgress = (lang: Locale = "it") =>
  apiGet<
    Array<{
      category_id: number;
      category: string;
      total_topics: number;
      quizTaken: number;
      totalQuestions: number;
      quizTotaliEseguiti: number;
    }>
  >(`/user/user-categories-progress?lang=${encodeURIComponent(lang)}`, true);

/*─────────────────────────────── BADGES ───────────────────────────────*/
// ⚠️ Percorsi corretti (niente '/api' duplicato)
export const getBadgesForMe = () => apiGet<Badge[]>("/user/user-badges", true);
export const getBadgesForUser = (userId: number | string) =>
  apiGet<Badge[]>(`/user/user-badges/${userId}`, true);

/*─────────────────────────────── AVAILABILITY ───────────────────────────────*/
export const getQuizTranslationAvailability = (lang: Exclude<Locale, "it">, strict = false) =>
  apiGet<{ items: TranslationAvailabilityItem[] }>(
    `/quiz-translation-availability?lang=${lang}${strict ? "&strict=1" : ""}`
  );
export const getLangAvailabilityForCert = (certId: number | string, lang: Locale) =>
  apiGet<{ topicIds: number[] }>(`/lang-availability?cert=${certId}&lang=${lang}`);

/*─────────────────────────────── UTILITY ───────────────────────────────*/
export function withAuthHeaders(init?: RequestInit): RequestInit {
  const token = getAccessToken();
  return {
    ...init,
    headers: { ...(init?.headers || {}), ...(token ? { authorization: `Bearer ${token}` } : {}) },
  };
}