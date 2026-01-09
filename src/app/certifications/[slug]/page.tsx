import { CertificationDetailView } from "@/app/[lang]/certificazioni/[slug]/page";

type Props = { params: Promise<{ slug: string }> };

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <CertificationDetailView lang="en" slug={slug} />;
}
