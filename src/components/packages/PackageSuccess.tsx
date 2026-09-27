"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
  const[data,setData]=useState<Order|null>(null);const[failed,setFailed]=useState(false);
  const paidRef=useRef(false);
  useEffect(()=>{
    if(!id){setFailed(true);return}
    let alive=true;
    const load=()=>apiFetch(`/packages/orders/${encodeURIComponent(id)}`).then(r=>r.ok?r.json():Promise.reject()).then(v=>{if(!alive)return;setData(v.order);if(v.order?.status==="paid"){paidRef.current=true;clearInterval(timer)}}).catch(()=>{if(alive)setFailed(true)});
    load();
    // Polling solo finche' il webhook non ha segnato l'ordine pagato.
    const timer=setInterval(()=>{if(!paidRef.current)load()},2500);
    return()=>{alive=false;clearInterval(timer)}
  },[id]);
  useEffect(()=>{
    // Il purchase_completed autorevole e' scritto dal webhook in funnel_events;
    // qui solo il riscontro GA4, una volta per ordine.
    if(data?.status!=="paid"||!id)return;
    trackEventOnce(`package_purchase_viewed:${id}`,"package_purchase_viewed",{language:lang,certification_slug:data.certification_slug,product_type:data.tier});
  },[data,id,lang]);
  const t=T[lang];const prefix=lang==="en"?"":`/${lang}`;
  if(failed)return <main className="mx-auto max-w-xl p-6"><h1 className="text-2xl font-black">{t.fail}</h1></main>;
  const paid=data?.status==="paid";
  const until=paid?activeUntilLabel(data?.expires_at,lang):null;
  return <main className="mx-auto max-w-xl p-6"><div className="rounded-2xl border bg-white p-6 text-center shadow"><div className="text-4xl">{paid?"✅":"⏳"}</div><h1 className="mt-3 text-2xl font-black">{!data?t.wait:paid?t.ok:t.pending}</h1>{data?<p className="mt-2 text-slate-600">{packageDisplayName(data.tier,data.certification_name,lang)}</p>:null}{until?<p className="mt-1 text-sm font-semibold text-emerald-800">{until}</p>:null}<div className="mt-5 flex flex-wrap justify-center gap-3"><Link className="rounded-lg bg-blue-700 px-4 py-3 font-bold text-white" href={`${prefix}/profile#my-packages`}>{t.profile}</Link>{paid&&data?<Link className="rounded-lg border px-4 py-3 font-bold" href={`${prefix}/quiz/${data.certification_slug}`}>{t.study}</Link>:null}</div></div></main>}
