import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JobTrackDetail from "@/features/labs/JobTrackDetail";
import { interactiveLabsJobTrackPath, isLocale, type Locale } from "@/lib/paths";
import { getJobTrack } from "@/lib/server/jobTracks";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.certifyquiz.com").replace(/\/+$/, "");

type Props = { params: Promise<{ lang: string; track: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: raw, track: slug } = await params;
  if (!isLocale(raw)) return { robots: { index: false, follow: false } };

  const data = await getJobTrack(raw, slug).catch(() => null);
  if (!data) return { robots: { index: false, follow: false } };

  const canonical = raw === "en" ? `${SITE}${interactiveLabsJobTrackPath("en", slug)}` : `${SITE}${interactiveLabsJobTrackPath(raw, slug)}`;
  const title = `${data.track.title} | CertifyQuiz Job Track`;
  return {
    title,
    description: data.track.description,
    alternates: {
      canonical,
      languages: {
        it: `${SITE}${interactiveLabsJobTrackPath("it", slug)}`,
        en: `${SITE}${interactiveLabsJobTrackPath("en", slug)}`,
        fr: `${SITE}${interactiveLabsJobTrackPath("fr", slug)}`,
        es: `${SITE}${interactiveLabsJobTrackPath("es", slug)}`,
        "x-default": `${SITE}${interactiveLabsJobTrackPath("en", slug)}`,
      },
    },
    openGraph: { title, description: data.track.description, url: canonical, type: "website", siteName: "CertifyQuiz" },
  };
}

export default async function Page({ params }: Props) {
  const { lang: raw, track: slug } = await params;
  if (!isLocale(raw)) notFound();
  const lang: Locale = raw;
  const data = await getJobTrack(lang, slug).catch(() => null);
  if (!data) notFound();
  return <JobTrackDetail lang={lang} slug={slug} initialTrack={data} />;
}
