"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/auth";
import type { Locale } from "@/lib/paths";
import { trackEventOnce } from "@/lib/analytics";
import { activeUntilLabel, packageDisplayName } from "@/lib/commercial-packages";

type Order = {
  status: string; tier: string; certification_name: string; certification_slug: string;
  total_minor?: number; currency?: string; expires_at?: string | null;
};

const T={it:{wait:"Verifica del pagamento…",ok:"Accesso attivato",pending:"Pagamento in elaborazione",fail:"Non è stato possibile verificare l'ordine.",profile:"Vai ai miei pacchetti",study:"Continua a studiare"},en:{wait:"Checking payment…",ok:"Access activated",pending:"Payment is processing",fail:"We could not verify this order.",profile:"View my packages",study:"Continue studying"},fr:{wait:"Vérification du paiement…",ok:"Accès activé",pending:"Paiement en cours",fail:"Impossible de vérifier la commande.",profile:"Voir mes packs",study:"Continuer à étudier"},es:{wait:"Verificando el pago…",ok:"Acceso activado",pending:"Pago en proceso",fail:"No se pudo verificar el pedido.",profile:"Ver mis paquetes",study:"Seguir estudiando"}} as const;

export default function PackageSuccess({lang}:{lang:Locale}){
  const q=useSearchParams();const id=q.get("order_id");
  const pathname=usePathname();
  const[data,setData]=useState<Order|null>(null);const[failed,setFailed]=useState(false);
  const[loginRequired,setLoginRequired]=useState(false);
  useEffect(()=>{
    setData(null);setFailed(false);setLoginRequired(false);
    if(!id){setFailed(true);return}
    let alive=true;
    let stopped=false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const controller=new AbortController();
    const load=async()=>{
      try {
        // apiFetch attempts refresh first; a returned 401 is definitive.
        const response=await apiFetch(`/packages/orders/${encodeURIComponent(id)}`,{signal:controller.signal},{redirectOnUnauthorized:false});
        if(!alive)return;
        if(response.status===401){stopped=true;setLoginRequired(true);return}
        if(!response.ok)throw new Error("Order temporarily unavailable");
        const value=await response.json();
        if(!alive)return;
        setData(value.order);setFailed(false);
        stopped=value.order?.status==="paid";
      } catch {
        if(alive)setFailed(true);
      }
      // Schedule only after completion: slow requests cannot overlap.
      if(alive&&!stopped)timer=setTimeout(load,2500);
    };
    void load();
    return()=>{alive=false;stopped=true;clearTimeout(timer);controller.abort()}
  },[id]);
  useEffect(()=>{
    // Il purchase_completed autorevole e' scritto dal webhook in funnel_events;
    // qui solo il riscontro GA4, una volta per ordine.
    if(data?.status!=="paid"||!id)return;
    trackEventOnce(`package_purchase_viewed:${id}`,"package_purchase_viewed",{language:lang,certification_slug:data.certification_slug,product_type:data.tier});
  },[data,id,lang]);
  const t=T[lang];const prefix=lang==="en"?"":`/${lang}`;
  if(loginRequired){
    const labels={it:"Accedi per verificare il tuo ordine",en:"Log in to verify your order",fr:"Connectez-vous pour vérifier votre commande",es:"Inicia sesión para verificar tu pedido"};
    const returnTo=`${pathname||`${prefix}/packages/success`}${q.toString()?`?${q.toString()}`:""}`;
    return <main className="mx-auto max-w-xl p-6"><h1 className="text-2xl font-black">{labels[lang]}</h1><Link className="mt-5 inline-block rounded-lg bg-blue-700 px-4 py-3 font-bold text-white" href={`${prefix}/login?redirect=${encodeURIComponent(returnTo)}`}>{labels[lang]}</Link></main>;
  }
  if(failed)return <main className="mx-auto max-w-xl p-6"><h1 className="text-2xl font-black">{t.fail}</h1></main>;
  const paid=data?.status==="paid";
  const until=paid?activeUntilLabel(data?.expires_at,lang):null;
  return <main className="mx-auto max-w-xl p-6"><div className="rounded-2xl border bg-white p-6 text-center shadow"><div className="text-4xl">{paid?"✅":"⏳"}</div><h1 className="mt-3 text-2xl font-black">{!data?t.wait:paid?t.ok:t.pending}</h1>{data?<p className="mt-2 text-slate-600">{packageDisplayName(data.tier,data.certification_name,lang)}</p>:null}{until?<p className="mt-1 text-sm font-semibold text-emerald-800">{until}</p>:null}<div className="mt-5 flex flex-wrap justify-center gap-3"><Link className="rounded-lg bg-blue-700 px-4 py-3 font-bold text-white" href={`${prefix}/profile#my-packages`}>{t.profile}</Link>{paid&&data?<Link className="rounded-lg border px-4 py-3 font-bold" href={`${prefix}/quiz/${data.certification_slug}`}>{t.study}</Link>:null}</div></div></main>}
