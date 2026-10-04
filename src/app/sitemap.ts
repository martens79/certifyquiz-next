// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { sanityServerClient } from "@/lib/sanity.server";
import { backendGetJson, type BackendResult } from "@/lib/server/backend-fetch";
import { isReviewSeoIntentDistinct, selectIndexableReviewClusterItems, type ReviewIndexabilityInput } from "@/lib/review-indexability";
import { isArticleIndexable } from "@/lib/seo/article-indexability";
import { isCertificationIndexable } from "@/lib/seo/certification-indexability";
import { isTopicIndexable } from "@/lib/seo/topic-indexability";

export const revalidate = 3600;

const RAW = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.certifyquiz.com";
const SITE = RAW.replace(/\/+$/, "");

// Usa API remota (no proxy)
const API_RAW = process.env.API_BASE_URL ?? "https://api.certifyquiz.com/api";
const API_BASE = API_RAW.replace(/\/+$/, "");

const langs = ["it", "es", "en", "fr"] as const;
type Lang = (typeof langs)[number];

const CERT_SEGMENT_BY_LANG: Record<Lang, string> = {
  it: "certificazioni",
  es: "certificaciones",
  en: "certifications",
  fr: "certifications",
};

const staticPages: Record<Lang, string[]> = {
  it: ["privacy", "termini", "cookie"],
  es: ["privacy", "terms", "cookies"],
  en: ["privacy", "terms", "cookies"],
  fr: ["privacy", "terms", "cookies"],
};

const BLOG_SEGMENT_BY_LANG: Record<Lang, string> = {
  it: "blog",
  es: "blog",
  en: "blog",
  fr: "blog",
};

const GAMES_SEGMENT_BY_LANG: Record<Lang, string> = {
  it: "giochi", en: "games", fr: "jeux", es: "juegos",
};

type RemoteCert = {
  id: number;
  slug: string;
  questionCountByLang: Partial<Record<Lang, number>>;
};

const SITEMAP_CERTIFICATION_ALIASES: Record<string, string> = {
  "google-tensorflow": "tensorflow",
  "microsoft-csharp": "csharp",
};

const canonicalCertificationSlug = (slug: string) =>
  SITEMAP_CERTIFICATION_ALIASES[slug] ?? slug;

type RemoteReviewListItem = { certSlug:string; topicSlug:string; topicId:number; href:string };

/**
 * Una sitemap e' una vista COMPLETA o non e' una vista: a runtime un errore del
 * backend interrompe la rigenerazione (Next continua a servire l'ultima sitemap
 * valida) invece di pubblicare per un'ora una sitemap monca.
 * Durante `next build` non esiste una sitemap precedente e un backend in 429/down
 * non deve far fallire il deploy: `noStore()` fa scartare a Next il prerender di
 * questa route (nessuna sitemap parziale nel deploy), che viene generata completa
 * alla prima richiesta runtime e poi tenuta in cache per `revalidate`.
 */
const isBuildPhase = () => process.env.NEXT_PHASE === "phase-production-build";

/** In build: la route diventa dinamica (nessun output prerenderizzato). Fuori da Next e' un no-op. */
function skipPrerender() {
  noStore();
}

function requireData<T>(result: BackendResult<T>, what: string): T | null {
  if (result.kind === "ok") return result.data;
  if (result.kind === "not_found") return null;
  const message = `sitemap: ${what} non disponibile (${result.reason}${result.status ? ` ${result.status}` : ""})`;
  if (isBuildPhase()) {
    console.warn(`${message} - build: sitemap non prerenderizzata, verra' generata a runtime`);
    skipPrerender();
    return null;
  }
  throw new Error(message);
}

/** Ogni fetch della sitemap e' in Data Cache: GET /sitemap.xml non genera chiamate per-richiesta. */
const SITEMAP_FETCH_REVALIDATE = 3600;

export async function getIndexableRemoteReviews():Promise<Record<Lang,string[]>> {
  const urls:Record<Lang,string[]>={it:[],es:[],en:[],fr:[]};
  const lists=await Promise.all(langs.map(async lang=>({lang,items:requireData(await backendGetJson<RemoteReviewListItem[]>(`${API_BASE}/topic-reviews?lang=${lang}`,{revalidate:SITEMAP_FETCH_REVALIDATE,tags:["sitemap:reviews"]}),`elenco ripassi ${lang}`)??[]})));
  // Un ripasso e' indicizzabile solo se la sua intenzione SEO e' "distinct" (vedi
  // evaluateReviewIndexability): per tutti gli altri l'esito e' gia' noto senza
  // scaricarne il contenuto. Il dettaglio si legge solo per i cluster candidati
  // (poche decine di chiamate, non ~1.500 a ogni sitemap).
  const candidates=lists.flatMap(list=>list.items.filter(item=>isReviewSeoIntentDistinct(item.certSlug,item.topicId)).map(item=>({lang:list.lang,item})));
  const clusters=new Map<string,Array<{lang:Lang;href:string;review:ReviewIndexabilityInput}>>();
  const localized=await Promise.all(candidates.map(async({lang,item})=>{
    const review=requireData(await backendGetJson<ReviewIndexabilityInput>(`${API_BASE}/certifications/${encodeURIComponent(item.certSlug)}/topics/${encodeURIComponent(item.topicSlug)}/review?lang=${lang}`,{revalidate:SITEMAP_FETCH_REVALIDATE,tags:["sitemap:reviews"]}),`ripasso ${item.certSlug}/${item.topicSlug} ${lang}`);
    return review?{key:`${item.certSlug}:${item.topicId}`,lang,href:item.href,review}:null;
  }));
  for(const item of localized){if(!item)continue;const cluster=clusters.get(item.key)||[];cluster.push(item);clusters.set(item.key,cluster)}
  for(const item of selectIndexableReviewClusterItems(clusters.values()))urls[item.lang].push(item.href);
  return urls;
}

type SanityArticle = {
  slug: string;
  lang: string;
  publishedAt: string | null;
  title?: string | null;
  excerpt?: string | null;
  body?: unknown;
};

const blogSitemapQuery = `
*[
  _type == "article" &&
  !(_id in path("drafts.**")) &&
  seo.noindex != true &&
  defined(coalesce(publishedAt, date)) &&
  dateTime(coalesce(publishedAt, date)) <= dateTime(now())
]{
  "slug": slug.current,
  "lang": lang,
  "publishedAt": coalesce(publishedAt, date)
  ,title
  ,excerpt
  ,"body": coalesce(body, content)
}`;

async function getRemoteCerts(): Promise<RemoteCert[]> {
  const list = requireData(
    await backendGetJson<Array<{ id: number; slug: string | null }>>(`${API_BASE}/certifications?lang=en`, {
      revalidate: SITEMAP_FETCH_REVALIDATE,
      tags: ["certs:list"],
    }),
    "elenco certificazioni"
  ) ?? [];

  const base = list.filter(
    (c): c is { id: number; slug: string } =>
      typeof c.id === "number" && typeof c.slug === "string" && c.slug.trim().length > 0
  );

  const enriched: RemoteCert[] = [];
  const concurrency = 8;
  for (let start = 0; start < base.length; start += concurrency) {
    const batch = base.slice(start, start + concurrency);
    const details = await Promise.all(
      batch.map(async (cert) => {
        const payload = requireData(
          await backendGetJson<{ questionCountByLang?: Partial<Record<Lang, number>> }>(
            `${API_BASE}/certifications/by-slug/${encodeURIComponent(cert.slug)}`,
            {
              // Apple inventory is the publication gate for its verified first
              // release: keep its cache short (60 s) so the count is not stale.
              revalidate: cert.slug === "apple-device-support" ? 60 : SITEMAP_FETCH_REVALIDATE,
              tags: ["certs:list", `cert:${cert.slug}`],
            }
          ),
          `certificazione ${cert.slug}`
        );
        if (!payload?.questionCountByLang) return null;
        return { ...cert, questionCountByLang: payload.questionCountByLang };
      })
    );
    enriched.push(...details.filter((item): item is RemoteCert => item !== null));
  }
  return enriched;
}

async function getBlogEntries(): Promise<MetadataRoute.Sitemap> {
  // Un errore di Sanity interrompe la rigenerazione (si resta sull'ultima sitemap
  // valida): non si pubblica per un'ora una sitemap senza articoli (in build: vedi sopra).
  let articles: SanityArticle[];
  try {
    articles = await sanityServerClient.fetch<SanityArticle[]>(blogSitemapQuery);
  } catch (error) {
    if (!isBuildPhase()) throw error;
    console.warn("sitemap: articoli non disponibili - build: sitemap non prerenderizzata, verra' generata a runtime");
    skipPrerender();
    return [];
  }

  return articles
    .filter((a) => a.slug && a.lang && isArticleIndexable(a))
    .map((a) => {
      const lang = a.lang as Lang;
      const base = lang === "en" ? SITE : `${SITE}/${lang}`;
      const segment = BLOG_SEGMENT_BY_LANG[lang] ?? "blog";

      return {
        url: `${base}/${segment}/${a.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.7,
        lastModified: a.publishedAt ? new Date(a.publishedAt) : new Date(),
      };
    });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [indexableReviews, certs, blogEntries] = await Promise.all([
    getIndexableRemoteReviews(),
    getRemoteCerts(),
    getBlogEntries(),
  ]);
  // Only this reviewed release supplies verified localized topic content.
  // Other active database rows remain excluded by the existing policy.
  const appleTopics: Record<Lang, string[]> = { en: [], it: [], fr: [], es: [] };
  const apple = certs.find(c => c.slug === "apple-device-support");
  if (apple && langs.every(lang => (apple.questionCountByLang[lang] ?? 0) >= 45)) {
    const topics = requireData(
      await backendGetJson<Array<Record<string, string>>>(`${API_BASE}/topics/${apple.id}`, { revalidate: 300, tags: ["cert:apple-device-support"] }),
      "topic Apple"
    ) ?? [];
    if (topics.length === 9) {
      const checked = await Promise.all(langs.flatMap(lang => topics.map(async topic => {
        const slug = topic[`slug_${lang}`];
        if (!slug) return null;
        const page = requireData(
          await backendGetJson<{ questionCount: number; topic: Record<string, unknown> }>(`${API_BASE}/topic-pages/apple-device-support/${encodeURIComponent(slug)}?lang=${lang}`, { revalidate: 300, tags: ["cert:apple-device-support"] }),
          `topic Apple ${slug} ${lang}`
        );
        if (!page) return null;
        return page.questionCount >= 5 && isTopicIndexable({ ...(page.topic as object), questionCount: page.questionCount } as Parameters<typeof isTopicIndexable>[0]) ? { lang, slug } : null;
      })));
      // Fail closed: if any localized topic cannot be verified (content, not transport), publish none.
      if (checked.every(Boolean)) for (const item of checked) if (item) appleTopics[item.lang].push(item.slug);
    }
  }

  // The API still exposes two legacy registry slugs. Publish only their final
  // public destinations so every certification URL in the sitemap is a 200.
  const canonicalCerts = Array.from(
    new Map(
      certs.map((cert) => {
        const slug = canonicalCertificationSlug(cert.slug);
        return [slug, { ...cert, slug }] as const;
      })
    ).values()
  );

  const perLang = langs.map((lang) => {

        const base = lang === "en" ? SITE : `${SITE}/${lang}`;
        const listSegment = CERT_SEGMENT_BY_LANG[lang];

        const entries: MetadataRoute.Sitemap = [
          // Home lingua
          {
            url: base,
            changeFrequency: "weekly",
            priority: 0.9,
          },

          // Lista certificazioni lingua
          {
            url: `${base}/${listSegment}`,
            changeFrequency: "weekly",
            priority: 0.8,
          },
          // Lista ripassi
{
  url:
    lang === "en"
      ? `${SITE}/reviews`
      : lang === "it"
      ? `${SITE}/it/ripassi`
      : lang === "fr"
      ? `${SITE}/fr/revisions`
      : `${SITE}/es/repasos`,
  changeFrequency: "weekly",
  priority: 0.75,
},

// Lista scenari
{
  url:
    lang === "en"
      ? `${SITE}/scenarios`
      : lang === "it"
      ? `${SITE}/it/scenari`
      : lang === "fr"
      ? `${SITE}/fr/scenarios`
      : `${SITE}/es/escenarios`,
  changeFrequency: "weekly",
  priority: 0.75,
},
          // Statiche lingua
          {
            url: `${base}/${GAMES_SEGMENT_BY_LANG[lang]}`,
            changeFrequency: "weekly" as const,
            priority: 0.75,
          },
          {
            url: lang === "en" ? `${SITE}/interactive-labs` : `${SITE}/${lang}/interactive-labs`,
            changeFrequency: "monthly" as const,
            priority: 0.75,
          },
          {
            url: lang === "en" ? `${SITE}/roadmap-networking` : `${SITE}/${lang}/roadmap-networking`,
            changeFrequency: "monthly" as const,
            priority: 0.8,
          },
          {
            url: lang === "en" ? `${SITE}/roadmap-cybersecurity` : `${SITE}/${lang}/roadmap-cybersecurity`,
            changeFrequency: "monthly" as const,
            priority: 0.8,
          },
          {
            url: lang === "en" ? `${SITE}/offensive-security` : `${SITE}/${lang}/offensive-security`,
            changeFrequency: "monthly" as const,
            priority: 0.8,
          },
          // NB: /materiale-consigliato (e varianti EN/FR/ES) sono noindex finché
          // il catalogo risorse resta vuoto: escluse di proposito dalla sitemap.
          {
            url:
              lang === "en"
                ? `${SITE}/categories/business-applications/sap`
                : lang === "it"
                ? `${SITE}/it/categorie/business-applications/sap`
                : lang === "es"
                ? `${SITE}/es/categorias/business-applications/sap`
                : `${SITE}/fr/categories/business-applications/sap`,
            changeFrequency: "monthly" as const,
            priority: 0.7,
          },
          {
            url: `${base}/${GAMES_SEGMENT_BY_LANG[lang]}/binary-rush`,
            changeFrequency: "monthly" as const,
            priority: 0.8,
          },
          {
            url: `${base}/${GAMES_SEGMENT_BY_LANG[lang]}/port-hunter`,
            changeFrequency: "monthly" as const,
            priority: 0.8,
          },
          {
            url: `${base}/${GAMES_SEGMENT_BY_LANG[lang]}/packet-defender`,
            changeFrequency: "monthly" as const,
            priority: 0.85,
          },
          {
            url: `${base}/${GAMES_SEGMENT_BY_LANG[lang]}/hex-blitz`,
            changeFrequency: "monthly" as const,
            priority: 0.8,
          },
          ...staticPages[lang].map((p) => ({
            url: `${base}/${p}`,
            changeFrequency: "monthly" as const,
            priority: 0.6,
          })),

          // Dettagli certificazioni lingua
          ...canonicalCerts.filter((c) => isCertificationIndexable({
            slug: c.slug,
            questionCount: c.questionCountByLang[lang] ?? null,
          })).map((c) => ({
            url: `${base}/${listSegment}/${c.slug}`,
            changeFrequency: "weekly" as const,
            priority: 0.8,
          })),

          ...appleTopics[lang].map(slug => ({
            url: `${base}/${listSegment}/apple-device-support/${slug}`,
            changeFrequency: "monthly" as const,
            priority: 0.7,
          })),
          // Other topic URLs are intentionally omitted until the backend sitemap feed
          // exposes the same editorial-quality signal used by topic metadata.
          // Publishing every active DB row previously added ~1,700 mostly
          // templated URLs without proving that localized guide content exists.
          ...indexableReviews[lang].map((href)=>({
            url: `${SITE}${href}`,
            changeFrequency: "monthly" as const,
            priority: 0.65,
          })),
        ];

        return entries;
      });

  return [...perLang.flat(), ...blogEntries];
}
