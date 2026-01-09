import LangCategoryPage from "@/app/[lang]/categorie/[cat]/page";

type Props = {
  params: Promise<{ cat: string }>;
};

export default async function Page({ params }: Props) {
  const { cat } = await params; // ✅ Next 15: await params
  return <LangCategoryPage params={{ lang: "es", cat }} />; // ✅ TS: params sync
}

