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

export default function Page({ params }: { params: { slug: string } }) {
  const incoming = params.slug;
  const mapped = EN_TO_KEY[incoming] ?? incoming; // fallback se arriva già la key interna

  // la pagina [lang]/categorie/[cat] vuole params come Promise con { lang, cat }

  return <LangCategoryPage params={Promise.resolve({ lang: "en", cat: mapped })} />;
}
