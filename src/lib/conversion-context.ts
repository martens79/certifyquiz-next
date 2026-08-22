export type ConversionContext = {
  source?: string | null;
  certificationSlug?: string | null;
  topicSlug?: string | null;
  score?: number | null;
  redirect?: string | null;
};

const SAFE_VALUE = /^[a-z0-9][a-z0-9_-]{0,99}$/i;
const MANAGED_QUERY_KEYS = ["source", "cert", "topic", "score", "redirect"] as const;

function safeValue(value: string | null | undefined): string | null {
  const normalized = String(value || "").trim();
  return SAFE_VALUE.test(normalized) ? normalized : null;
}

export function safeInternalRedirect(value: string | null | undefined): string | null {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return null;

  let decoded: string;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    return null;
  }

  if (decoded.startsWith("//") || decoded.includes("\\") || /[\u0000-\u001f\u007f]/.test(decoded)) {
    return null;
  }

  return value;
}

export function parseConversionScore(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === "") return null;
  const score = Number(value);
  return Number.isFinite(score) && score >= 0 && score <= 100 ? Math.round(score) : null;
}

export function readConversionContext(params: Pick<URLSearchParams, "get">): ConversionContext {
  return {
    source: safeValue(params.get("source")),
    certificationSlug: safeValue(params.get("cert")),
    topicSlug: safeValue(params.get("topic")),
    score: parseConversionScore(params.get("score")),
    redirect: safeInternalRedirect(params.get("redirect")),
  };
}

export function withConversionContext(path: string, context: ConversionContext): string {
  const [pathname, existingQuery = ""] = path.split("?", 2);
  const params = new URLSearchParams(existingQuery);
  MANAGED_QUERY_KEYS.forEach((key) => params.delete(key));
  const source = safeValue(context.source);
  const cert = safeValue(context.certificationSlug);
  const topic = safeValue(context.topicSlug);
  const score = parseConversionScore(context.score);
  const redirect = safeInternalRedirect(context.redirect);

  if (source) params.set("source", source);
  if (cert) params.set("cert", cert);
  if (topic) params.set("topic", topic);
  if (score !== null) params.set("score", String(score));
  if (redirect) params.set("redirect", redirect);

  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}
