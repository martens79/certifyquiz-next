import CertPage from "@/app/[lang]/certificazioni/[slug]/page";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: Props) {
  const { slug } = await params;

  // CertPage nel tuo progetto vuole params PROMISE (Next 15 style)
  return <CertPage params={Promise.resolve({ lang: "it", slug })} />;
}
