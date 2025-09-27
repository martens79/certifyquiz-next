export type Cert = {
  slug: string;
  locale: "it" | "en" | "fr" | "es";
  title: string;
  h1: string;
  intro: string;
  seoDescription: string;
  faq: { q: string; a: string }[];
};

const API = process.env.API_BASE_URL!; // su Vercel: API_BASE_URL=https://api.certifyquiz.com

function normalizeFaq(x: any): { q: string; a: string }[] {
  if (!Array.isArray(x)) return [];
  return x.map((f: any) => ({
    q: f?.q ?? f?.question ?? "",
    a: f?.a ?? f?.answer ?? "",
  }));
}

export async function getAllCertSlugs(locale: Cert["locale"] = "it"): Promise<string[]> {
  const r = await fetch(`${API}/certifications?locale=${locale}&fields=slug`, {
    next: { revalidate: 86400 },
  });
  if (!r.ok) return [];
  const data = await r.json();
  return data.map((it: any) => (typeof it === "string" ? it : it.slug)).filter(Boolean);
}

export async function getCertBySlug(slug: string, locale: Cert["locale"] = "it"): Promise<Cert | null> {
  const r = await fetch(`${API}/certifications/${slug}?locale=${locale}`, {
    next: { revalidate: 86400 },
  });
  if (!r.ok) return null;
  const x = await r.json();
  return {
    slug: x.slug ?? slug,
    locale,
    title: x.title ?? x.name ?? x.h1 ?? slug,
    h1: x.h1 ?? x.title ?? x.name ?? slug,
    intro: x.intro ?? x.description ?? "",
    seoDescription: x.seoDescription ?? x.seo ?? x.description ?? "",
    faq: normalizeFaq(x.faq),
  };
}
