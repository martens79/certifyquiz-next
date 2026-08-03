import { notFound } from "next/navigation";
import InteractiveLabDetail from "@/features/labs/InteractiveLabDetail";
import { labSlugs, type LabSlug } from "@/features/labs/lab-config";
import { isLocale } from "@/lib/paths";
type Props={params:Promise<{lang:string;lab:string}>};
export function generateStaticParams(){return ["it","fr","es"].flatMap(lang=>labSlugs.map(lab=>({lang,lab})))}
export default async function Page({params}:Props){const {lang,lab}=await params;if(!isLocale(lang)||!labSlugs.includes(lab as LabSlug))notFound();return <InteractiveLabDetail lang={lang} lab={lab as LabSlug}/>}
