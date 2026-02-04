import { CertificationDetailView } from "@/app/_views/CertificationDetailView";


type Props = { params: Promise<{ slug: string }> };

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <CertificationDetailView lang="es" slug={slug} />;
}
