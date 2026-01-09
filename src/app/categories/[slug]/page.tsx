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

type Props = { params: Promise<{ slug: string }> };

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const mapped = EN_TO_KEY[slug] ?? slug;

  return (
    <LangCategoryPage
      params={Promise.resolve({ lang: "en", cat: mapped })}
    />
  );
}
