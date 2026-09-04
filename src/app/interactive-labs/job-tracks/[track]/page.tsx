import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JobTrackDetail from "@/features/labs/JobTrackDetail";
import { interactiveLabsJobTrackPath } from "@/lib/paths";
import { getJobTrack } from "@/lib/server/jobTracks";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.certifyquiz.com").replace(/\/+$/, "");

type Props = { params: Promise<{ track: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { track: slug } = await params;
  const data = await getJobTrack("en", slug).catch(() => null);
  if (!data) return { robots: { index: false, follow: false } };

  const canonical = `${SITE}${interactiveLabsJobTrackPath("en", slug)}`;
  const title = `${data.track.title} | CertifyQuiz Job Track`;
  return {
    title,
    description: data.track.description,
    alternates: {
      canonical,
      languages: {
        it: `${SITE}${interactiveLabsJobTrackPath("it", slug)}`,
        en: canonical,
        fr: `${SITE}${interactiveLabsJobTrackPath("fr", slug)}`,
        es: `${SITE}${interactiveLabsJobTrackPath("es", slug)}`,
        "x-default": canonical,
      },
    },
    openGraph: { title, description: data.track.description, url: canonical, type: "website", siteName: "CertifyQuiz" },
  };
}

export default async function Page({ params }: Props) {
  const { track: slug } = await params;
  const data = await getJobTrack("en", slug).catch(() => null);
  if (!data) notFound();
  return <JobTrackDetail lang="en" slug={slug} initialTrack={data} />;
}
