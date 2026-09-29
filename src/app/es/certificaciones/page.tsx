import CertificationsListView from "@/app/[lang]/certificazioni/CertificationsListView";
import { certificationsListMetadata } from "@/app/[lang]/certificazioni/listMetadata";

export const metadata = certificationsListMetadata("es");

export default async function Page() {
  return <CertificationsListView lang="es" />;
}
