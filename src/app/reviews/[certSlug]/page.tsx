import type { Metadata } from "next";
import ReviewsCertificationIndexPage, {
  generateReviewsCertificationMetadata,
} from "@/components/ReviewsCertificationIndexPage";

type PageProps = {
  params: Promise<{ certSlug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { certSlug } = await params;
  return generateReviewsCertificationMetadata({ lang: "en", certSlug });
}

export default async function Page({ params }: PageProps) {
  const { certSlug } = await params;
  return <ReviewsCertificationIndexPage lang="en" certSlug={certSlug} />;
}
