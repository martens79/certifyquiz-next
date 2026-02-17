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
  const mapped = EN_TO_KEY[params.slug] ?? params.slug;

  return <LangCategoryPage params={{ lang: "en", cat: mapped }} />;
}
