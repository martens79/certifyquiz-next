import VendorsIndexView from "../../../_views/VendorsIndexView";
import type { Locale } from "@/lib/i18n";

export default async function Page(
  props: { params: Promise<{ lang: Locale }> }
) {
  const { lang } = await props.params;
  return <VendorsIndexView lang={lang} />;
}
