import LangCategoryPage from "@/app/[lang]/categorie/[cat]/page";

export default async function Page({
  params,
}: {
  params: Promise<{ cat: string }>;
}) {
  const { cat } = await params;
  return <LangCategoryPage params={Promise.resolve({ lang: "it", cat })} />;
}
