"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/auth";
import { useAuth } from "@/components/auth/AuthProvider";
import { cleanReviewTitle } from "@/lib/text";
import type { CertReviewItem, Locale } from "@/lib/data";

const status = {
  it:{free:"FREE",premium:"PREMIUM",unlocked:"SBLOCCATA"}, en:{free:"FREE",premium:"PREMIUM",unlocked:"UNLOCKED"},
  fr:{free:"GRATUITE",premium:"PREMIUM",unlocked:"DÉBLOQUÉE"}, es:{free:"GRATIS",premium:"PREMIUM",unlocked:"DESBLOQUEADO"},
} as const;

export default function ReviewAccessList({lang,certSlug,certificationName,initialItems,keyConceptsLabel,openLabel}:{lang:Locale;certSlug:string;certificationName:string;initialItems:CertReviewItem[];keyConceptsLabel:string;openLabel:string}) {
  const [items,setItems]=useState(initialItems);
  const { user,loading }=useAuth();
  useEffect(()=>{
    if(loading||!user) return;
    let alive=true;
    apiFetch(`/certifications/${encodeURIComponent(certSlug)}/topic-reviews?lang=${lang}`).then(r=>r.ok?r.json():null).then(v=>{if(alive&&Array.isArray(v?.items))setItems(v.items)}).catch(()=>{});
    return()=>{alive=false};
  },[certSlug,lang,loading,user]);
  return <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">{items.map(item=>{
    const badge=item.access||"premium";
    const badgeClass=badge==="free"?"bg-emerald-100 text-emerald-800":badge==="unlocked"?"bg-blue-100 text-blue-800":"bg-amber-100 text-amber-900";
    return <li key={item.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:p-5">
      <span className={`mb-3 w-fit rounded-full px-2.5 py-1 text-[11px] font-black tracking-wide ${badgeClass}`}>{badge==="free"?status[lang].free:badge==="unlocked"?status[lang].unlocked:<>🔒 {status[lang].premium}</>}</span>
      <div className="font-semibold text-slate-950">{cleanReviewTitle(item.title,certificationName)}</div>
      {item.keyConcepts.length>0&&<div className="mt-1 text-sm text-slate-600">{keyConceptsLabel}: {item.keyConcepts.join(", ")}</div>}
      <Link href={item.href} className="mt-3 inline-flex text-sm font-extrabold text-blue-700 hover:text-blue-900">{openLabel} →</Link>
    </li>})}</ul>;
}
