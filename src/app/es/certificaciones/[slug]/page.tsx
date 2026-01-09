import LangDetail from "@/app/[lang]/certificazioni/[slug]/page";

type Props = { params: { slug: string } };

export default function Page({ params }: Props) {
  return <LangDetail params={{ lang: "es", slug: params.slug }} />;
}
