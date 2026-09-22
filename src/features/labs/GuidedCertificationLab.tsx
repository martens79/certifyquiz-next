"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Clock3, Loader2, LockKeyhole, RotateCcw, ShieldCheck } from "lucide-react";
import { apiFetch } from "@/lib/auth";
import type { Locale } from "@/lib/paths";
import type { GuidedLabEvidence, GuidedLabPayload, GuidedLabStep } from "./types";
import QuestionExhibit from "@/components/quiz/QuestionExhibit";
import { trackEvent, trackFunnelEventOnce } from "@/lib/analytics";

type Preview = { title:string; description:string; difficulty:string; estimatedMinutes:number; locked:boolean; accessReason:string };
// Etichetta della certificazione mostrata nell'header del lab sbloccato: punto di
// manutenzione noto, stesso pattern di DB_CERTIFICATION_CATEGORY in
// InteractiveLabsLanding.tsx. Va aggiornato per ogni nuova certificazione DB-backed.
const CERTIFICATION_LABELS: Record<string, string> = {
  "cisco-ccst-networking": "Cisco CCST Networking",
  "cisco-ccst-cybersecurity": "Cisco CCST Cybersecurity",
  "ccna": "Cisco CCNA",
  "ceh": "EC-Council CEH",
};
const copy = {
  it:{scenario:"Scenario",objective:"Obiettivo",prerequisites:"Prerequisiti",check:"Verifica",next:"Continua",finish:"Completa laboratorio",retry:"Riprova",loading:"Caricamento laboratorio…",locked:"Laboratorio Premium",lockedBody:"Puoi vedere l'anteprima, ma il contenuto completo richiede Premium o un pacchetto che includa questo laboratorio.",premium:"Scopri Premium",login:"Accedi",correct:"Risposta corretta",wrong:"Non ancora. Riesamina le prove e riprova.",result:"Risultato",passed:"Laboratorio superato",failed:"Laboratorio da ripetere",restart:"Nuovo tentativo",error:"Il laboratorio non è momentaneamente disponibile.",authTitle:"Accedi per verificare le risposte",authBody:"Puoi leggere questo laboratorio gratuitamente, ma per verificare le risposte e salvare i progressi serve un account.",register:"Registrati gratis"},
  en:{scenario:"Scenario",objective:"Objective",prerequisites:"Prerequisites",check:"Check",next:"Continue",finish:"Complete lab",retry:"Try again",loading:"Loading lab…",locked:"Premium lab",lockedBody:"You can view the preview, but full content requires Premium or a package that includes this lab.",premium:"Explore Premium",login:"Sign in",correct:"Correct answer",wrong:"Not yet. Review the evidence and try again.",result:"Result",passed:"Lab passed",failed:"Repeat the lab",restart:"New attempt",error:"The lab is temporarily unavailable.",authTitle:"Sign in to check your answers",authBody:"You can read this lab for free, but checking answers and saving your progress requires an account.",register:"Sign up free"},
  fr:{scenario:"Scénario",objective:"Objectif",prerequisites:"Prérequis",check:"Vérifier",next:"Continuer",finish:"Terminer le lab",retry:"Réessayer",loading:"Chargement du lab…",locked:"Lab Premium",lockedBody:"L'aperçu est visible, mais le contenu complet nécessite Premium ou un pack incluant ce lab.",premium:"Découvrir Premium",login:"Se connecter",correct:"Bonne réponse",wrong:"Pas encore. Réexaminez les indices.",result:"Résultat",passed:"Lab réussi",failed:"Lab à refaire",restart:"Nouvelle tentative",error:"Le lab est temporairement indisponible.",authTitle:"Connectez-vous pour vérifier vos réponses",authBody:"Vous pouvez lire ce lab gratuitement, mais la vérification des réponses et l'enregistrement de votre progression nécessitent un compte.",register:"S'inscrire gratuitement"},
  es:{scenario:"Escenario",objective:"Objetivo",prerequisites:"Requisitos",check:"Verificar",next:"Continuar",finish:"Completar laboratorio",retry:"Reintentar",loading:"Cargando laboratorio…",locked:"Laboratorio Premium",lockedBody:"La vista previa es pública, pero el contenido completo requiere Premium o un paquete que incluya este laboratorio.",premium:"Ver Premium",login:"Iniciar sesión",correct:"Respuesta correcta",wrong:"Todavía no. Revisa las pruebas e inténtalo de nuevo.",result:"Resultado",passed:"Laboratorio aprobado",failed:"Repite el laboratorio",restart:"Nuevo intento",error:"El laboratorio no está disponible temporalmente.",authTitle:"Inicia sesión para verificar tus respuestas",authBody:"Puedes leer este laboratorio gratis, pero para verificar las respuestas y guardar tu progreso se necesita una cuenta.",register:"Regístrate gratis"}
} as const;

// 401 su POST /attempts|check|complete: il lab FREE e' leggibile da anonimi, ma
// registrare tentativi richiede autenticazione (policy backend invariata). Non e'
// un guasto: si mostra un invito al login invece dell'errore generico.
class AuthRequiredError extends Error {}

// Evidenza tecnica di uno step (Nmap/HTTP/log/CLI multilinea): riusa
// QuestionExhibit (monospace, whitespace preservato, scroll orizzontale, testo
// scapato da React). Tollera un campo assente o malformato senza rompere il lab.
export function LabStepEvidence({evidence}:{evidence?:unknown}) {
  if (!Array.isArray(evidence)) return null;
  const items = evidence.filter((item): item is GuidedLabEvidence => !!item && typeof (item as GuidedLabEvidence).content === "string" && (item as GuidedLabEvidence).content.trim() !== "");
  if (!items.length) return null;
  return <div className="mt-4" data-lab-evidence>{items.map((item,i)=><QuestionExhibit key={i} exhibit={item}/>)}</div>;
}

export function LabAuthPrompt({lang,slug}:{lang:Locale;slug:string}) {
  const t=copy[lang]; const target=encodeURIComponent(lang==="en"?`/interactive-labs/${slug}`:`/${lang}/interactive-labs/${slug}`);
  return <div role="alert" data-lab-auth-required className="mt-5 rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-950"><p className="flex items-center gap-2 font-bold"><LockKeyhole size={16}/>{t.authTitle}</p><p className="mt-1 leading-6">{t.authBody}</p><div className="mt-3 flex flex-col gap-2 sm:flex-row"><Link href={`/${lang}/login?redirect=${target}`} className="rounded-xl bg-indigo-700 px-4 py-2 text-center font-bold text-white">{t.login}</Link><Link href={`/${lang}/register?redirect=${target}`} className="rounded-xl border border-indigo-300 bg-white px-4 py-2 text-center font-bold text-indigo-800">{t.register}</Link></div></div>;
}

function Answer({step,value,onChange}:{step:GuidedLabStep;value:unknown;onChange:(value:unknown)=>void}) {
  if (step.type === "text") return <input value={String(value || "")} onChange={e=>onChange(e.target.value)} placeholder={step.placeholder} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"/>;
  if (step.type === "multi") {
    const selected=Array.isArray(value)?value.map(String):[];
    return <div className="grid gap-3">{step.options?.map(option=><label key={option.id} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border bg-white p-3 text-sm sm:text-base"><input type="checkbox" checked={selected.includes(option.id)} onChange={()=>onChange(selected.includes(option.id)?selected.filter(x=>x!==option.id):[...selected,option.id])}/><span>{option.label}</span></label>)}</div>;
  }
  return <div className="grid gap-3">{step.options?.map(option=><label key={option.id} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border bg-white p-3 text-sm sm:text-base"><input type="radio" name={step.id} checked={value===option.id} onChange={()=>onChange(option.id)}/><span>{option.label}</span></label>)}</div>;
}

export default function GuidedCertificationLab({lang,slug}:{lang:Locale;slug:string}) {
  const t=copy[lang]; const [preview,setPreview]=useState<Preview|null>(null); const [lab,setLab]=useState<GuidedLabPayload|null>(null);
  const [attempt,setAttempt]=useState<number|null>(null); const [index,setIndex]=useState(0); const [answers,setAnswers]=useState<Record<string,unknown>>({});
  const [feedback,setFeedback]=useState<"correct"|"wrong"|null>(null); const [busy,setBusy]=useState(true); const [fatal,setFatal]=useState(false);
  const [result,setResult]=useState<{score:number;passed:boolean;solution?:{explanation?:string}}|null>(null);
  const lifecycleTrackedRef=useRef<"study"|"paywall"|null>(null);
  const [authRequired,setAuthRequired]=useState(false);
  const step=lab?.content.steps[index]; const answered=useMemo(()=>step ? (Array.isArray(answers[step.id]) ? (answers[step.id] as unknown[]).length>0 : String(answers[step.id]??"").trim().length>0) : false,[answers,step]);

  useEffect(()=>{let active=true;(async()=>{setBusy(true);try{
    const p=await apiFetch(`/labs/${slug}/preview?lang=${lang}`); if(!p.ok) throw new Error(); const pj=await p.json(); if(active)setPreview(pj.lab);
    const r=await apiFetch(`/labs/${slug}/content?lang=${lang}`); if(r.ok){const j=await r.json();if(active)setLab(j.lab);} else if(r.status!==401&&r.status!==403) throw new Error();
  }catch{if(active)setFatal(true);}finally{if(active)setBusy(false);}})();return()=>{active=false};},[lang,slug]);

  useEffect(()=>{
    if(busy||fatal||lifecycleTrackedRef.current)return;
    if(lab){lifecycleTrackedRef.current="study";trackEvent("study_started",{language:lang,study_type:"interactive_lab",lab_slug:slug,certification_slug:lab.certificationSlug});trackFunnelEventOnce(`study_started:interactive_lab:${lang}:${slug}`,{event:"study_started",cert_slug:lab.certificationSlug,topic_slug:null,lang,metadata:{study_type:"interactive_lab",lab_slug:slug}});return;}
    if(preview){lifecycleTrackedRef.current="paywall";trackEvent("paywall_viewed",{language:lang,paywall_type:"interactive_lab",lab_slug:slug});trackFunnelEventOnce(`paywall_viewed:interactive_lab:${lang}:${slug}`,{event:"paywall_viewed",cert_slug:null,topic_slug:null,lang,paywall_type:"interactive_lab",metadata:{lab_slug:slug}});}
  },[busy,fatal,lab,preview,lang,slug]);

  async function ensureAttempt(){if(attempt)return attempt;const r=await apiFetch(`/labs/${slug}/attempts?lang=${lang}`,{method:"POST",body:"{}"});if(r.status===401)throw new AuthRequiredError();if(!r.ok)throw new Error();const j=await r.json();setAttempt(j.attemptId);return Number(j.attemptId);}
  async function check(){if(!step||!answered)return;setBusy(true);setAuthRequired(false);try{const id=await ensureAttempt();const r=await apiFetch(`/labs/${slug}/attempts/${id}/check?lang=${lang}`,{method:"POST",body:JSON.stringify({stepId:step.id,response:answers[step.id]})});if(r.status===401)throw new AuthRequiredError();if(!r.ok)throw new Error();const j=await r.json();setFeedback(j.correct?"correct":"wrong");}catch(e){if(e instanceof AuthRequiredError)setAuthRequired(true);else setFatal(true);}finally{setBusy(false);}}
  async function advance(){if(!lab||!step)return;if(index<lab.content.steps.length-1){setIndex(x=>x+1);setFeedback(null);return;}setBusy(true);try{const id=await ensureAttempt();const r=await apiFetch(`/labs/${slug}/attempts/${id}/complete?lang=${lang}`,{method:"POST",body:"{}"});if(r.status===401)throw new AuthRequiredError();if(!r.ok)throw new Error();setResult(await r.json());}catch(e){if(e instanceof AuthRequiredError)setAuthRequired(true);else setFatal(true);}finally{setBusy(false);}}
  function restart(){setAttempt(null);setIndex(0);setAnswers({});setFeedback(null);setResult(null);setFatal(false);setAuthRequired(false);}

  if(busy&&!preview&&!lab)return <div className="flex min-h-64 items-center justify-center gap-3 rounded-2xl border bg-white"><Loader2 className="animate-spin"/>{t.loading}</div>;
  if(fatal)return <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-800">{t.error}</div>;
  if(!lab){const labPath=lang==="en"?`/interactive-labs/${slug}`:`/${lang}/interactive-labs/${slug}`;const pricingPath=lang==="it"?"/it/prezzi":lang==="es"?"/es/precios":lang==="fr"?"/fr/tarifs":"/pricing";return <section className="overflow-hidden rounded-2xl border bg-white shadow-sm"><div className="bg-gradient-to-r from-slate-950 to-indigo-950 p-6 text-white sm:p-8"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-300"><LockKeyhole size={16}/>{t.locked}</p><h1 className="mt-3 text-2xl font-black sm:text-4xl">{preview?.title}</h1><p className="mt-3 max-w-2xl text-slate-200">{preview?.description}</p></div><div className="p-6 sm:p-8"><p className="max-w-2xl text-slate-700">{t.lockedBody}</p><div className="mt-6 flex flex-col gap-3 sm:flex-row"><Link href={pricingPath} className="rounded-xl bg-indigo-700 px-5 py-3 text-center font-bold text-white">{t.premium}</Link><Link href={`/${lang}/login?redirect=${encodeURIComponent(labPath)}`} className="rounded-xl border px-5 py-3 text-center font-bold">{t.login}</Link></div></div></section>}
  if(result)return <section className="rounded-2xl border bg-white p-6 text-center shadow-sm sm:p-10"><CheckCircle2 className={`mx-auto h-14 w-14 ${result.passed?"text-emerald-600":"text-amber-600"}`}/><p className="mt-4 text-sm font-bold uppercase tracking-wider text-slate-500">{t.result}</p><h2 className="mt-2 text-3xl font-black">{result.score}% — {result.passed?t.passed:t.failed}</h2>{result.solution?.explanation&&<p className="mx-auto mt-4 max-w-2xl whitespace-pre-line leading-7 text-slate-600">{result.solution.explanation}</p>}<button onClick={restart} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-indigo-700 px-5 py-3 font-bold text-white"><RotateCcw size={17}/>{t.restart}</button></section>;

  return <article className="overflow-hidden rounded-2xl border bg-white shadow-xl"><header className="bg-gradient-to-r from-slate-950 to-indigo-950 p-5 text-white sm:p-8"><div className="flex flex-wrap items-center justify-between gap-3"><span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-300"><ShieldCheck size={16}/>{CERTIFICATION_LABELS[lab.certificationSlug] ?? lab.certificationSlug}</span><span className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm"><Clock3 size={15}/>{lab.estimatedMinutes} min</span></div><h1 className="mt-4 text-2xl font-black sm:text-4xl">{lab.title}</h1><p className="mt-3 max-w-3xl text-slate-200">{lab.description}</p><div className="mt-6 h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full bg-cyan-400 transition-all" style={{width:`${((index+(feedback==="correct"?1:0))/lab.content.steps.length)*100}%`}}/></div></header><div className="grid lg:grid-cols-[300px_1fr]"><aside className="border-b bg-slate-50 p-5 lg:border-b-0 lg:border-r sm:p-6"><h2 className="text-xs font-black uppercase tracking-wider text-slate-500">{t.scenario}</h2><p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">{lab.content.scenario}</p><h2 className="mt-6 text-xs font-black uppercase tracking-wider text-slate-500">{t.objective}</h2><p className="mt-2 text-sm leading-6 text-slate-700">{lab.content.objective}</p><h2 className="mt-6 text-xs font-black uppercase tracking-wider text-slate-500">{t.prerequisites}</h2><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">{lab.content.prerequisites.map(x=><li key={x}>{x}</li>)}</ul></aside><section className="min-w-0 p-5 sm:p-8"><p className="text-sm font-bold text-indigo-700">{index+1} / {lab.content.steps.length}</p><h2 className="mt-2 text-xl font-black sm:text-2xl">{step?.title}</h2><p className="mt-3 leading-7 text-slate-600">{step?.instruction}</p><LabStepEvidence evidence={step?.evidence}/>{step&&<div className="mt-6"><Answer step={step} value={answers[step.id]} onChange={value=>{setAnswers(a=>({...a,[step.id]:value}));setFeedback(null)}}/></div>}{feedback&&<div className={`mt-5 rounded-xl p-4 text-sm font-semibold ${feedback==="correct"?"bg-emerald-50 text-emerald-800":"bg-amber-50 text-amber-900"}`}>{feedback==="correct"?t.correct:t.wrong}</div>}{authRequired&&<LabAuthPrompt lang={lang} slug={slug}/>}<div className="mt-7 flex justify-end">{feedback==="correct"?<button onClick={advance} className="rounded-xl bg-emerald-700 px-5 py-3 font-bold text-white">{index===lab.content.steps.length-1?t.finish:t.next}</button>:<button disabled={!answered||busy} onClick={check} className="rounded-xl bg-indigo-700 px-5 py-3 font-bold text-white disabled:opacity-40">{busy?<Loader2 className="animate-spin"/>:feedback==="wrong"?t.retry:t.check}</button>}</div></section></div></article>;
}
