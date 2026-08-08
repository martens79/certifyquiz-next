import { Suspense } from "react";
import PackageSuccess from "@/components/packages/PackageSuccess";
export default async function Page({params}:{params:Promise<{lang:string}>}){const{lang}=await params;const safe=(['it','fr','es'].includes(lang)?lang:'en') as 'it'|'en'|'fr'|'es';return <Suspense><PackageSuccess lang={safe}/></Suspense>}
