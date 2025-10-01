// app/sitemap-index.xml/route.ts
export const dynamic = "force-dynamic";
export const revalidate = 0;

type Lang = "it" | "en" | "fr" | "es";
type UnknownRecord = Record<string, unknown>;

function isRecord(v: unknown): v is UnknownRecord {
  return v !== null && typeof v === "object";
}

// Estrae un array da varie chiavi comuni (senza usare `any`)
function arrayFromUnknown(u: unknown): unknown[] {
  if (Array.isArray(u)) return u;
  if (isRecord(u)) {
    for (const k of ["data", "items", "results", "rows", "list", "payload", "certifications"] as const) {
      const v = (u as UnknownRecord)[k as keyof UnknownRecord];
      if (Array.isArray(v)) return v as unknown[];
    }
  }
  return [];
}

function pickSlugs(u: unknown): string[] {
  const arr = arrayFromUnknown(u);
  const out: string[] = [];
  for (const x of arr) {
    if (typeof x === "string") out.push(x);
    else if (isRecord(x) && typeof x.slug === "string") out.push(String(x.slug));
  }
  return out;
}

async function fetchJSON(url: string, init?: RequestInit) {
  const r = await fetch(url, { cache: "no-store", next: { revalidate: 0 }, ...init });
  if (!r.ok) throw new Error(`Fetch ${url} -> ${r.status}`);
  return (await r.json()) as unknown;
}

export async function GET() {
  const site = "https://www.certifyquiz.com";
  const langs: Lang[] = ["it", "en", "fr", "es"];
  const base: Record<Lang, string> = {
    it: "certificazioni",
    en: "certifications",
    fr: "certifications",
    es: "certificaciones",
  };

  // ⚠️ deve finire con /api (es: https://api.certifyquiz.com/api)
  const API = (process.env.API_BASE_URL || "").replace(/\/+$/, "");
  const SECRET = process.env.REVALIDATE_SECRET || "";

  let source: "admin" | "public" | "empty" = "empty";
  let slugs: string[] = [];
  const tried: string[] = [];
  const rawCounts: number[] = [];

  if (API) {
    // 1) Endpoint admin senza paging
    const adminUrl = `${API}/admin/all-cert-slugs`;
    tried.push(adminUrl);
    try {
      const data = await fetchJSON(adminUrl, {
        headers: SECRET ? { "x-revalidate-secret": SECRET } : {},
      });
      const arr = Array.isArray(data) ? data : [];
      slugs = Array.from(new Set(arr.filter((s): s is string => typeof s === "string"))).sort();
      source = "admin";
    } catch {
      // 2) Fallback: endpoint pubblico (potrebbe restare a 4)
      const publicUrl = `${API}/certifications?locale=it&fields=slug`;
      tried.push(publicUrl);
      try {
        const data = await fetchJSON(publicUrl);
        const picked = pickSlugs(data);
        rawCounts.push(picked.length);
        slugs = Array.from(new Set(picked)).sort();
        source = "public";
      } catch {
        slugs = [];
        source = "empty";
      }
    }
  }

  const lastmod = new Date().toISOString();
  const urls: string[] = [];

  // Home
  urls.push(`
    <url>
      <loc>${site}/</loc>
      <lastmod>${lastmod}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>1.0</priority>
    </url>`);

  // Lingue + liste
  for (const l of langs) {
    urls.push(`
      <url>
        <loc>${site}/${l}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>`);
    urls.push(`
      <url>
        <loc>${site}/${l}/${base[l]}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>`);
  }

  // 1 blocco per slug (loc IT) + hreflang reciproci + x-default
  for (const slug of slugs) {
    const map = Object.fromEntries(
      langs.map((l) => [l, `${site}/${l}/${base[l]}/${slug}`] as const)
    ) as Record<Lang, string>;

    urls.push(`
      <url>
        <loc>${map.it}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
        ${langs.map((x) => `<xhtml:link rel="alternate" hreflang="${x}" href="${map[x]}"/>`).join("\n")}
        <xhtml:link rel="alternate" hreflang="x-default" href="${map.it}"/>
      </url>`);
  }

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  data-build="${Date.now()}">
  ${urls.join("\n")}
</urlset>`;

  const headers = new Headers({
    "Content-Type": "application/xml; charset=utf-8",
    "Cache-Control": "no-store", // metti s-maxage dopo i test
    "X-Api-Base-Url": API || "EMPTY",
    "X-Slugs-Len": String(slugs.length),
    "X-Source": source,               // "admin" | "public" | "empty"
    "X-Raw-Attempts": String(rawCounts.join(",")),
    "X-Tried-Count": String(tried.length),
  });

  xml += `\n<!-- tried=${tried.length} source=${source} -->`;

  return new Response(xml, { headers });
}
