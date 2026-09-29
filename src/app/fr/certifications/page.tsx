import CertificationsListView from "@/app/[lang]/certificazioni/CertificationsListView";
import { certificationsListMetadata } from "@/app/[lang]/certificazioni/listMetadata";

export const metadata = certificationsListMetadata("fr");

export default async function Page() {
  return <CertificationsListView lang="fr" />;
}
