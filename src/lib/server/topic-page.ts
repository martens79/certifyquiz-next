import "server-only";
import { internalApiHeaders } from "./internal-api";
import { isEipassStandardSlug } from "@/lib/eipass-standard";
import { EIPASS_USER_COPY, eipassLocalizedText, getEipassUserModule, orderEipassTopics } from "@/lib/eipass-user-release";

export type Lang = "it" | "en" | "fr" | "es";

// 🔹 FAQ item tipizzato
export type TopicFaqItem = {
  q: string;
  a: string;
};

export type TopicPageData = {
  topic: {
    id: number;
    quiz_id: number | null;
    slug: string;
    title: string;
    description: string;

    // 🔥 NUOVI CAMPI SEO / CONTENT
    intro?: string | null;
    seoTitle?: string | null;
    seoDescription?: string | null;
    content?: string | null;
    faq?: TopicFaqItem[];
  };

  certification: {
    id: number;
    slug: string;
    title: string;
  };

  relatedTopics: Array<{
    id: number;
    slug: string;
    title: string;
    description: string;
  }>;

  questionCount: number | null;
  /** Release 1: no dedicated EIPASS reviews have been verified. */
  reviewAvailable?: boolean;
};

const API_BASE_URL = process.env.API_BASE_URL!;

const CERT_SLUG_ALIASES: Record<string, string> = {
  "vmware-certified-professional": "vmware-vcp",
  "tensorflow-developer": "google-tensorflow",
  "tensorflow": "google-tensorflow",
  "google-tensorflow": "google-tensorflow",
  "network-plus": "comptia-network-plus",
  "cisco-ccst-security": "cisco-ccst-cybersecurity",
  "microsoft-csharp": "microsoft-csharp",
  "csharp": "microsoft-csharp",
};

export function normalizeCertSlug(slug: string) {
  return CERT_SLUG_ALIASES[slug] ?? slug;
}

export async function getTopicPageData({
  certSlug,
  topicSlug,
  lang,
}: {
  certSlug: string;
  topicSlug: string;
  lang: Lang;
}): Promise<TopicPageData | null> {
  const normalizedCertSlug = normalizeCertSlug(certSlug);

  // EIPASS Standard is "coming soon": it has NO topic pages, in any language. Fail closed with no backend call.
  if (isEipassStandardSlug(normalizedCertSlug)) return null;

  const res = await fetch(
    `${API_BASE_URL}/topic-pages/${normalizedCertSlug}/${topicSlug}?lang=${lang}`,
    {
      headers: internalApiHeaders(),
      // Inventory controls robots and quiz actions: do not reuse a stale pool
      // after questions are withdrawn or a certification is cut over.
      cache: "no-store",
    }
  );

  // 404 → pagina 404. Qualsiasi altro errore (429 rate limit, 5xx) resta un
  // errore: NON va trasformato in 404, o Google deindicizzerebbe pagine vere.
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(
      `Failed topic page fetch (HTTP ${res.status}) for ${normalizedCertSlug}/${topicSlug}?lang=${lang}`
    );
  }

  const data = await res.json();

  // 🧠 Safety: normalizziamo FAQ se backend non è ancora aggiornato
  if (data?.topic) {
    if (!Array.isArray(data.topic.faq)) {
      data.topic.faq = [];
    }
  }

  if (normalizedCertSlug === "eipass" && data?.certification?.id === 3) {
    const userModule = getEipassUserModule(Number(data.topic?.id));
    if (userModule) {
      data.reviewAvailable = false;
      data.topic.title = userModule.title[lang];
      // Normalize the real localized payload; use editorial copy for missing text.
      data.topic.description = eipassLocalizedText(data.topic.description, lang) || userModule.description[lang];
      data.topic.seoTitle = `${userModule.title[lang]} | ${EIPASS_USER_COPY.name[lang]} | CertifyQuiz`;
      data.topic.seoDescription = userModule.description[lang];
      data.certification.title = EIPASS_USER_COPY.name[lang];
      data.relatedTopics = orderEipassTopics<TopicPageData["relatedTopics"][number]>(data.relatedTopics ?? []).map((topic) => {
        const related = getEipassUserModule(Number(topic.id));
        return related ? { ...topic, title: related.title[lang], description: eipassLocalizedText(topic.description, lang) || related.description[lang] } : topic;
      });
    }
  }
  return data;
}
