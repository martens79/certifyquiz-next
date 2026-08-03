import { notFound } from "next/navigation";
import InteractiveLabDetail, { labSlugs, type LabSlug } from "@/features/labs/InteractiveLabDetail";
type Props={params:Promise<{lab:string}>};
export function generateStaticParams(){return labSlugs.map(lab=>({lab}))}
export default async function Page({params}:Props){const {lab}=await params;if(!labSlugs.includes(lab as LabSlug))notFound();return <InteractiveLabDetail lang="en" lab={lab as LabSlug}/>}
