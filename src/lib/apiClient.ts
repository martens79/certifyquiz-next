// src/lib/apiClient.ts
// ============================================================
// 🔹 SCOPO FILE
// ============================================================
// Centralizza TUTTE le chiamate HTTP al backend CertifyQuiz.
// In client/dev usiamo il proxy interno /api/backend (niente API_BASE_URL esposta).
// In server/build/prod chiamiamo DIRETTAMENTE l'API remota (API_BASE_URL),
// così la sitemap e le build non “cadono” se il proxy non esiste ancora.

// ============================================================
// 🧭 RISOLUZIONE BASE URL
// ============================================================
function resolveBaseUrl() {
  const isServer = typeof window === "undefined";
  if (isServer) {
    // Build/SSR: usa l’API remota (env obbligatoria in build)
    const raw = process.env.API_BASE_URL || "https://api.certifyquiz.com/api";
    return raw.replace(/\/+$/, "");
  }
  // Client (browser): proxy interno (non esponiamo API_BASE_URL)
  return "/api/backend";
}

// ============================================================
// 🌐 FUNZIONI BASE GENERICHE
// ============================================================

/**
 * Effettua una richiesta GET tipizzata.
 * - Server/build: chiama API_BASE_URL
 * - Client: passa da /api/backend
 */
export async function apiGet<T = unknown>(path: string, init?: RequestInit): Promise<T> {
  const base = resolveBaseUrl();
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;

  const res = await fetch(url, {
    credentials: "include",
    ...init,
    headers: {
      accept: "application/json",
      ...(init?.headers || {}),
    },
    next: { revalidate: 60 }, // ISR 1 minuto (ok per liste/sitemap)
    cache: "no-store",
  });

  const txt = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${txt}`);

  try {
    return JSON.parse(txt) as T;
  } catch {
    return txt as unknown as T;
  }
}

/**
 * Effettua una richiesta POST tipizzata (body JSON).
 * - Server/build: chiama API_BASE_URL
 * - Client: passa da /api/backend
 */
export async function apiPost<T = unknown, B = unknown>(
  path: string,
  body: B,
  init?: RequestInit
): Promise<T> {
  const base = resolveBaseUrl();
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;

  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
      ...(init?.headers || {}),
    },
    body: JSON.stringify(body),
    ...init,
  });

  const txt = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${txt}`);

  try {
    return JSON.parse(txt) as T;
  } catch {
    return txt as unknown as T;
  }
}

// ============================================================
// 🌍 TIPI — STRUTTURE DATI DEL BACKEND
// ============================================================

export type CertListItem = {
  id: number;
  slug: string | null;
  category_id?: number | null;
  name: string | null;
  name_en?: string | null;
  name_fr?: string | null;
  name_es?: string | null;
};

export type CertDetail = {
  id: number;
  slug: string;
  name: string;
  description?: string | null;
  level?: string | null;
  topics?: Array<{
    id: number;
    title: string;
    description?: string | null;
  }>;
};

export type Topic = {
  id: number;
  certification_id: number;
  title: string;
  description?: string | null;
  quiz_id?: number | null;
};

export type TopicDetail = {
  id: number;
  certification_id: number;
  title: string;
  description?: string | null;
  quiz_id?: number | null;
  questions?: Array<{
    id: number;
    question: string;
    correct_answer_id?: number;
    answers?: Array<{
      id: number;
      answer_text: string;
    }>;
  }>;
};

// ============================================================
// 🌍 WRAPPER ENDPOINTS (GET/POST)
// ============================================================

/** Lista certificazioni per lingua. */
export async function getCertList(lang: string): Promise<CertListItem[]> {
  const list = await apiGet<CertListItem[]>(`/certifications?lang=${lang}`);
  // Safety: scarta elementi senza slug (evita URL/sitemap rotti)
  return list.filter((c) => typeof c.slug === "string" && c.slug.trim().length > 0);
}

/** Dettaglio certificazione per slug. */
export async function getCertDetail(slug: string, lang: string): Promise<CertDetail> {
  return apiGet<CertDetail>(`/certifications/${encodeURIComponent(slug)}?lang=${lang}`);
}

/** Topic per certificazione. */
export async function getTopicsByCertId(certId: number, lang: string): Promise<Topic[]> {
  return apiGet<Topic[]>(`/topics?certification_id=${certId}&lang=${lang}`);
}

/** Dettaglio topic (con eventuali domande). */
export async function getTopicDetail(topicId: number, lang: string): Promise<TopicDetail> {
  return apiGet<TopicDetail>(`/topics/${topicId}?lang=${lang}`);
}

/** Esempio: invio form contatti. */
export async function sendContactForm(data: { name: string; email: string; message: string })
: Promise<{ success: boolean; message: string }> {
  return apiPost<{ success: boolean; message: string }>("/contact", data);
}

/** Esempio: iscrizione newsletter. */
export async function subscribeNewsletter(data: { email: string })
: Promise<{ success: boolean; message: string }> {
  return apiPost<{ success: boolean; message: string }>("/newsletter", data);
}

/** Esempio: login. */
export async function loginUser(credentials: { email: string; password: string })
: Promise<{ token: string; user: { id: number; name: string } }> {
  return apiPost<{ token: string; user: { id: number; name: string } }>("/auth/login", credentials);
}
