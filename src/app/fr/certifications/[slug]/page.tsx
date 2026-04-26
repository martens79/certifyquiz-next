// Wrapper FR → delega tutto alla pagina [lang]

import CertPage, {
  generateMetadata as generateLocalizedMetadata,
} from "@/app/[lang]/certificazioni/[slug]/page";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;

  return generateLocalizedMetadata({
    params: Promise.resolve({ lang: "fr", slug }),
  });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;

  return <CertPage params={Promise.resolve({ lang: "fr", slug })} />;
}