// src/app/[lang]/profile/page.tsx
import ProfileClient from "./profile-client";

type Lang = "it" | "en" | "fr" | "es";

export default function Page({ params }: { params: { lang: Lang } }) {
  return <ProfileClient lang={params.lang} />;
}
