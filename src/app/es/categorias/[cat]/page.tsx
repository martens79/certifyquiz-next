// src/app/es/categorias/[cat]/page.tsx
import LangCategoryPage from "@/app/[lang]/categorie/[cat]/page";

type Props = {
  params: Promise<{ cat: string }>;
};

export default async function Page({ params }: Props) {
  const { cat } = await params;

  return (
    <LangCategoryPage
      params={Promise.resolve({ lang: "es", cat })}
    />
  );
}
