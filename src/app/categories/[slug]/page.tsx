// src/app/categories/[slug]/page.tsx
import LangCategoryPage from "@/app/[lang]/categorie/[cat]/page";

const EN_TO_KEY: Record<string, string> = {
  fundamentals: "base",
  basics: "base",
  security: "sicurezza",
  networking: "reti",
  cloud: "cloud",
  databases: "database",
  programming: "programmazione",
  virtualization: "virtualizzazione",
  "artificial-intelligence": "ai",
};

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const mapped = EN_TO_KEY[slug] ?? slug; // fallback se arriva già la key interna

  // la pagina [lang]/categorie/[cat] vuole params come Promise con { lang, cat }
  return <LangCategoryPage params={Promise.resolve({ lang: "en", cat: mapped })} />;
}
