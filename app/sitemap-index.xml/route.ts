// app/sitemap-index.xml/route.ts
export const dynamic = "force-dynamic";
export const revalidate = 0;

type Lang = "it" | "en" | "fr" | "es";
type UnknownRecord = Record<string, unknown>;

function isRecord(v: unknown): v is UnknownRecord {
  return v !== null && typeof v === "object";
}
function arrayFromUnknown(u: unknown): unknown[] {
  if (Array.isArray(u)) return u;
  if (isRecord(u)) {
    const keys = ["data","items","results","rows","list","payload","certifications"] as const;
    for (const k of keys) {
      const v = (u as UnknownRecord)[k];
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
    else if (isRecord(x) && typeof (x as UnknownRecord).slug === "string") out.push(String((x as UnknownRecord).slug));
  }
  return out;
}
async function fetchJSON(url: string, init?: RequestInit) {
  const r = await fetch(url, { cache: "no-store", next: { revalidate: 0 }, ...init });
  if (!r.ok) {
    const body = await r.text().catch(() => "");
    throw new Error(`HTTP ${r.status} ${r.statusText} | ${body.slice(0,200)}`);
  }
  return (await r.json()) as unknown;
}

export async function GET() {
  const site = "https://www.certifyquiz.com";
  const langs: Lang[] = ["it","en","fr","es"];
  const base: Record<Lang,string> = {
    it: "certificazioni",
    en: "certifications",
    fr: "certifications",
    es: "certificaciones",
  };

  const API    = (process.env.API_BASE_URL || "").replace(/\/+$/, "");
  const SECRET = process.env.REVALIDATE_SECRET || "";

  let source: "admin" | "public" | "empty" = "empty";
  let slugs: string[] = [];
  const tried: string[] = [];
  const rawCounts: number[] = [];

  // 🔍 debug vars
  let adminUrl = "";
  let adminStatus = "";   // es. "HTTP 401 Unauthorized"
  let adminError  = "";   // primi 200 char del body/errore

  if (API) {
    adminUrl = API + "/admin/all-cert-slugs";
    tried.push(adminUrl);
    try {
      const data = await fetchJSON(adminUrl, {
        headers: SECRET ? { "x-revalidate-secret": SECRET } : {},
      });
      const arr = Array.isArray(data) ? data : [];
      slugs = Array.from(new Set(arr.filter((s): s is string => typeof s === "string"))).sort();
      source = "admin";
      adminStatus = "OK";
    } catch (e: unknown) {
      if (e instanceof Error) {
        adminStatus = e.message.split("|")[0].trim();         // "HTTP 401 Unauthorized"
        adminError  = (e.message.split("|")[1] || "").trim(); // body (breve)
      }
      const publicUrl = API + "/certifications?locale=it&fields=slug";
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

  urls.push(
    `<url><loc>${site}/</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>`
  );
  for (const l of langs) {
    urls.push(
      `<url><loc>${site}/${l}</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`
    );
    urls.push(
      `<url><loc>${site}/${l}/${base[l]}</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`
    );
  }
  for (const slug of slugs) {
    const map: Record<Lang,string> = {
      it: `${site}/it/${base.it}/${slug}`,
      en: `${site}/en/${base.en}/${slug}`,
      fr: `${site}/fr/${base.fr}/${slug}`,
      es: `${site}/es/${base.es}/${slug}`,
    };
    urls.push(
      `<url><loc>${map.it}</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority>` +
      `${langs.map((x)=>`<xhtml:link rel="alternate" hreflang="${x}" href="${map[x]}"/>`).join("")}` +
      `<xhtml:link rel="alternate" hreflang="x-default" href="${map.it}"/></url>`
    );
  }

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" data-build="${Date.now()}">` +
    urls.join("\n") +
    `</urlset>`;

  const headers = new Headers({
    "Content-Type": "application/xml; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Api-Base-Url": API || "EMPTY",
    "X-Secret-Present": SECRET ? "yes" : "no",
    "X-Source": source,
    "X-Slugs-Len": String(slugs.length),
    "X-Raw-Attempts": String(rawCounts.join(",")),
    "X-Tried-Count": String(tried.length),
    // 🧪 admin fetch debug
    "X-Admin-Url": adminUrl || "none",
    "X-Admin-Status": adminStatus || "n/a",
    "X-Admin-Error": adminError || "",
  });

  return new Response(xml, { headers });
}
