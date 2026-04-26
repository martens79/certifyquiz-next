// Wrapper IT → usa la logica completa della pagina [lang]
// Evita duplicazione SEO e garantisce uso di metaTitle/metaDescription

import CertPage, {
  generateMetadata as generateLocalizedMetadata,
} from "@/app/[lang]/certificazioni/[slug]/page";

type Props = {
  params: Promise<{ slug: string }>;
};

// ✅ Usa direttamente la generateMetadata della pagina principale
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;

  return generateLocalizedMetadata({
    params: Promise.resolve({ lang: "it", slug }),
  });
}

// ✅ Render normale delegato alla pagina [lang]
export default async function Page({ params }: Props) {
  const { slug } = await params;

  return <CertPage params={Promise.resolve({ lang: "it", slug })} />;
}