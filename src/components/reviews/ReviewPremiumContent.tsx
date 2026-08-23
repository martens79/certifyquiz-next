"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { apiFetch } from "@/lib/auth";
import { analyticsUserStateFrom, trackEvent, trackFunnelEvent } from "@/lib/analytics";
import { useAuth } from "@/components/auth/AuthProvider";
import { certPath, pricingPath, type Locale } from "@/lib/paths";
import type { TopicReviewPage } from "@/lib/data";
import type { ReviewModuleStructure } from "@/lib/review-module-types";
import ReviewModuleShell from "@/components/reviews/module/ReviewModuleShell";
import { Lock } from "lucide-react";

const copy = {
  it: { badge:"Review Premium", title:"Continua con la Review completa", body:"Hai letto l'anteprima gratuita. Sblocca questa Review e gli altri contenuti di preparazione.", premium:"Sblocca con Premium", package:"Scopri il pacchetto Complete", unlocked:"Contenuto sbloccato" },
  en: { badge:"Premium Review", title:"Continue with the full Review", body:"You have read the free preview. Unlock this Review and the other preparation resources.", premium:"Unlock with Premium", package:"Explore the Complete package", unlocked:"Content unlocked" },
  fr: { badge:"Révision Premium", title:"Continuez avec la révision complète", body:"Vous avez lu l'aperçu gratuit. Débloquez cette révision et les autres ressources de préparation.", premium:"Débloquer avec Premium", package:"Découvrir le pack Complete", unlocked:"Contenu débloqué" },
  es: { badge:"Repaso Premium", title:"Continúa con el repaso completo", body:"Has leído la vista previa gratuita. Desbloquea este repaso y los demás recursos de preparación.", premium:"Desbloquear con Premium", package:"Ver el paquete Complete", unlocked:"Contenido desbloqueado" },
} as const;

const outlineLabel = { it: "Indice del modulo", en: "Module outline", fr: "Sommaire du module", es: "Índice del módulo" } as const;

type Props = {
  lang: Locale;
  certSlug: string;
  topicSlug: string;
  reviewId: number;
  preview: string;
  /** Outline redatta (id/type/title, niente body) di una review a moduli ancora locked: vedi publicStructurePreview lato backend. */
  structureOutline?: ReviewModuleStructure | null;
};

export default function ReviewPremiumContent({lang,certSlug,topicSlug,reviewId,preview,structureOutline}:Props) {
  const t=copy[lang];
  const { user, loading }=useAuth();
  const [full,setFull]=useState<TopicReviewPage|null>(null);
  const [checked,setChecked]=useState(false);
  const tracked=useRef(false);

  useEffect(()=>{
    if(loading) return;
    let alive=true;
    apiFetch(`/certifications/${encodeURIComponent(certSlug)}/topics/${encodeURIComponent(topicSlug)}/review?lang=${lang}`)
      .then(r=>r.ok?r.json():null).then((value:TopicReviewPage|null)=>{
        if(!alive)return;
        if(value&&!value.locked)setFull(value);
        if(value?.locked&&!tracked.current){
          tracked.current=true;
          trackEvent("paywall_viewed",{language:lang,user_state:analyticsUserStateFrom(user),paywall_type:"review",certification_slug:certSlug,review_id:reviewId,topic_slug:topicSlug,offer_type:"premium_or_certification_package"});
          trackFunnelEvent({event:"paywall_viewed",cert_slug:certSlug,topic_slug:topicSlug,lang});
        }
        setChecked(true);
      }).catch(()=>{if(alive)setChecked(true)});
    return()=>{alive=false};
  },[certSlug,lang,loading,reviewId,topicSlug,user]);

  if(full) return <>
    <p className="not-prose mb-4 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">✓ {t.unlocked}</p>
    {full.structure ? (
      <ReviewModuleShell lang={lang} review={full} certSlug={certSlug} />
    ) : (
      <>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{full.content || ""}</ReactMarkdown>
        {full.faq&&<ReactMarkdown remarkPlugins={[remarkGfm]}>{full.faq}</ReactMarkdown>}
      </>
    )}
  </>;

  function click(offerType:"premium"|"certification_package") {
    trackEvent("premium_cta_clicked",{language:lang,user_state:analyticsUserStateFrom(user),source_page:"review_gate",content_type:"review",certification_slug:certSlug,review_id:reviewId,topic_slug:topicSlug,offer_type:offerType});
    trackFunnelEvent({event:"premium_clicked_review_gate",cert_slug:certSlug,topic_slug:topicSlug,lang});
  }

  return <>
    {preview&&<ReactMarkdown remarkPlugins={[remarkGfm]}>{preview}</ReactMarkdown>}
    {!!structureOutline?.sections?.length && (
      <nav aria-label={outlineLabel[lang]} className="not-prose mt-6 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
        {structureOutline.sections.map((section, index) => (
          <div key={section.id} className="flex items-center gap-3 px-4 py-3 text-sm text-slate-500">
            <Lock className="h-4 w-4 shrink-0 text-slate-300" aria-hidden="true" />
            <span>{index + 1}. {section.title}</span>
          </div>
        ))}
      </nav>
    )}
    {!checked?null:
    <aside className="not-prose mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
      <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-black uppercase tracking-wide text-amber-900">🔒 {t.badge}</span>
      <h2 className="mt-3 text-xl font-black text-slate-950">{t.title}</h2><p className="mt-2 text-sm leading-6 text-slate-700">{t.body}</p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Link onClick={()=>click("premium")} href={`${pricingPath(lang)}?source=review_gate&cert_slug=${encodeURIComponent(certSlug)}&topic_slug=${encodeURIComponent(topicSlug)}`} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">{t.premium}</Link>
        <Link onClick={()=>click("certification_package")} href={`${certPath(lang,certSlug)}#package-title`} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-amber-300 bg-white px-5 py-3 text-sm font-bold text-slate-900">{t.package}</Link>
      </div>
    </aside>}
  </>;
}
