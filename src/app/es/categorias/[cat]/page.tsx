// src/app/es/categorias/[cat]/page.tsx
import LangCategoryPage from "@/app/[lang]/categorie/[cat]/page";

type Props = {
  params: { cat: string };
};

export default function Page({ params }: Props) {
  return <LangCategoryPage params={{ lang: "es", cat: params.cat }} />;
}
