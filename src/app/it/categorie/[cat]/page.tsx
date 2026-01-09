// src/app/it/categorie/[cat]/page.tsx
import LangCategoryPage from "@/app/[lang]/categorie/[cat]/page";

type Props = {
  params: Promise<{ cat: string }>;
};

export default async function Page({ params }: Props) {
  const { cat } = await params; // ✅ Next 15
  return <LangCategoryPage params={Promise.resolve({ lang: "it", cat })} />;
}
