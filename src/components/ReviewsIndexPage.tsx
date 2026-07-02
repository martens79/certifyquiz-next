import { getTopicReviewsList, type Locale } from "@/lib/data";
import CertificationOverviewGrid from "@/components/CertificationOverviewGrid";

type Props = {
  lang: Locale;
};

export default async function ReviewsIndexPage({ lang }: Props) {
  const reviews = await getTopicReviewsList(lang);

  return <CertificationOverviewGrid lang={lang} items={reviews} />;
}