import { notFound } from "next/navigation";
import InteractiveLabDetail from "@/features/labs/InteractiveLabDetail";
import { labSlugs, type LabSlug } from "@/features/labs/lab-config";
type Props={params:Promise<{lab:string}>};
export function generateStaticParams(){return labSlugs.map(lab=>({lab}))}
export default async function Page({params}:Props){const {lab}=await params;if(!labSlugs.includes(lab as LabSlug))notFound();return <InteractiveLabDetail lang="en" lab={lab as LabSlug}/>}
