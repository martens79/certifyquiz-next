"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { certPath } from "@/lib/paths";
import { trackEvent } from "@/lib/analytics";
import { gameText } from "../content";
import { binaryExplanation, decimalExplanation, GAME_DURATION_MS, generateQuestion, isCorrect, scoreAnswer } from "./logic";
import { loadGameStorage, saveLastMode, saveResult } from "./storage";
import type { GameMode, GameResult, Question } from "./types";

type Phase = "intro" | "playing" | "finished";
type Feedback = { ok: boolean; explanation: string } | null;

export default function BinaryRushGame({ lang }: { lang: Locale }) {
  const t = gameText[lang];
  const [phase,setPhase]=useState<Phase>("intro"); const [mode,setMode]=useState<GameMode>("mixed");
  const [best,setBest]=useState(0); const [question,setQuestion]=useState<Question|null>(null); const [answer,setAnswer]=useState("");
  const [remaining,setRemaining]=useState(GAME_DURATION_MS); const [score,setScore]=useState(0); const [combo,setCombo]=useState(0);
  const [correct,setCorrect]=useState(0); const [wrong,setWrong]=useState(0); const [maxCombo,setMaxCombo]=useState(0);
  const [feedback,setFeedback]=useState<Feedback>(null); const [result,setResult]=useState<GameResult|null>(null); const [shared,setShared]=useState(false);
  const endAt=useRef(0); const startedAt=useRef(0); const questionAt=useRef(0); const locked=useRef(false); const inputRef=useRef<HTMLInputElement>(null);

  useEffect(()=>{const stored=loadGameStorage(); setBest(stored.bestOverall); setMode(stored.lastMode); trackEvent("game_viewed",{game_name:"binary_rush"});},[]);

  const finish=useCallback(()=>{
    if (phase!=="playing") return;
    const saved=saveResult(mode,score); const total=correct+wrong; const accuracy=total?Math.round(correct/total*100):0;
    const final={score,correct,wrong,maxCombo,mode,isNewRecord:saved.isNewRecord}; setResult(final); setBest(saved.data.bestOverall); setRemaining(0); setPhase("finished"); locked.current=true;
    trackEvent("game_completed",{game_name:"binary_rush",mode,score,accuracy,correct_answers:correct,max_combo:maxCombo,is_new_record:saved.isNewRecord});
  },[phase,mode,score,correct,wrong,maxCombo]);

  useEffect(()=>{if(phase!=="playing")return; const tick=()=>{const left=Math.max(0,endAt.current-Date.now());setRemaining(left);if(left===0)finish();};tick();const id=window.setInterval(tick,100);return()=>window.clearInterval(id);},[phase,finish]);

  function start(restarted=false){const now=Date.now(); startedAt.current=now;endAt.current=now+GAME_DURATION_MS;questionAt.current=now;locked.current=false;setScore(0);setCombo(0);setCorrect(0);setWrong(0);setMaxCombo(0);setFeedback(null);setAnswer("");setRemaining(GAME_DURATION_MS);setResult(null);setQuestion(generateQuestion(mode,0));setPhase("playing");saveLastMode(mode);trackEvent(restarted?"game_restarted":"game_started",{game_name:"binary_rush",mode});setTimeout(()=>inputRef.current?.focus(),0);}

  function submit(){if(!question||locked.current||!answer.trim()||Date.now()>=endAt.current)return;locked.current=true;const ok=isCorrect(question,answer);const nextCombo=ok?combo+1:0;const explanation=question.direction==="binary-to-decimal"?binaryExplanation(question.value):decimalExplanation(question.value);setFeedback({ok,explanation});if(ok){setCorrect(v=>v+1);setCombo(nextCombo);setMaxCombo(v=>Math.max(v,nextCombo));setScore(v=>v+scoreAnswer(nextCombo,Date.now()-questionAt.current));}else{setWrong(v=>v+1);setCombo(0);}window.setTimeout(()=>{if(Date.now()>=endAt.current)return;const elapsed=Date.now()-startedAt.current;setQuestion(q=>generateQuestion(mode,elapsed,q??undefined));setAnswer("");setFeedback(null);questionAt.current=Date.now();locked.current=false;inputRef.current?.focus();},650);}

  async function share(){if(!result)return;const text=`${t.shareText(result.score)} ${window.location.href}`;try{if(navigator.share)await navigator.share({title:"Binary Rush",text,url:window.location.href});else await navigator.clipboard.writeText(text);setShared(true);trackEvent("game_result_shared",{game_name:"binary_rush",mode:result.mode,score:result.score});}catch{/* share cancelled */}}
  const modeLabel=(m:GameMode)=>m==="mixed"?t.mixed:m==="binary-to-decimal"?t.b2d:t.d2b;
  const accuracy=result&&result.correct+result.wrong?Math.round(result.correct/(result.correct+result.wrong)*100):0;

  return <main id="main" className="mx-auto max-w-4xl px-4 py-8 sm:py-12"><div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-950">
    <header className="border-b border-slate-200 bg-gradient-to-r from-slate-950 to-blue-950 p-6 text-white"><p className="font-mono text-xs uppercase tracking-[.25em] text-cyan-300">CertifyQuiz Labs</p><h1 className="mt-2 font-mono text-3xl font-bold sm:text-4xl">Binary Rush</h1><p className="mt-2 text-slate-200">{t.intro}</p></header>
    {phase==="intro"&&<section className="p-6 sm:p-8"><h2 className="text-xl font-bold">{t.rules}</h2><fieldset className="mt-6"><legend className="mb-3 font-semibold">{t.mode}</legend><div className="grid gap-3 sm:grid-cols-3">{(["mixed","binary-to-decimal","decimal-to-binary"] as GameMode[]).map(m=><label key={m} className={`cursor-pointer rounded-xl border p-4 text-center font-semibold ${mode===m?"border-blue-600 bg-blue-50 ring-2 ring-blue-200 dark:bg-blue-950":"hover:bg-gray-50 dark:hover:bg-slate-900"}`}><input className="sr-only" type="radio" name="mode" value={m} checked={mode===m} onChange={()=>setMode(m)}/>{modeLabel(m)}</label>)}</div></fieldset><div className="mt-7 flex flex-wrap items-center gap-4"><button onClick={()=>start()} className="min-h-12 rounded-lg bg-blue-600 px-7 py-3 font-bold text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">{t.start}</button>{best>0&&<p><span className="text-gray-500">{t.best}:</span> <strong>{best}</strong></p>}</div></section>}
    {phase==="playing"&&question&&<section className="p-4 sm:p-8"><div className="grid grid-cols-4 gap-2 text-center">{[[t.time,Math.ceil(remaining/1000)], [t.score,score],[t.combo,`×${combo}`],[t.correct,correct]].map(([label,value])=><div key={String(label)} className="rounded-lg bg-slate-100 p-2 dark:bg-slate-900"><div className="text-xs text-gray-500">{label}</div><div className="font-mono text-xl font-bold">{value}</div></div>)}</div><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200" role="progressbar" aria-label={t.time} aria-valuemin={0} aria-valuemax={60} aria-valuenow={Math.ceil(remaining/1000)}><div className="h-full bg-cyan-500 transition-[width] duration-100 motion-reduce:transition-none" style={{width:`${remaining/GAME_DURATION_MS*100}%`}}/></div><div className="mt-8 min-h-44 text-center"><p className="text-sm font-semibold uppercase tracking-wide text-gray-500">{question.direction==="binary-to-decimal"?t.questionB2d:t.questionD2b}</p><div className="my-5 font-mono text-5xl font-black tracking-wider sm:text-6xl">{question.prompt}<sub className="text-lg">{question.direction==="binary-to-decimal"?"2":"10"}</sub></div><form onSubmit={e=>{e.preventDefault();submit();}} className="mx-auto flex max-w-md gap-2"><label className="sr-only" htmlFor="binary-answer">{t.answer}</label><input ref={inputRef} id="binary-answer" inputMode="numeric" pattern={question.direction==="decimal-to-binary"?"[01]*":"[0-9]*"} value={answer} onChange={e=>setAnswer(question.direction==="decimal-to-binary"?e.target.value.replace(/[^01]/g,""):e.target.value.replace(/\D/g,""))} disabled={!!feedback} autoComplete="off" className="min-h-12 min-w-0 flex-1 rounded-lg border-2 px-4 text-center font-mono text-2xl focus:border-blue-500 focus:outline-none"/><button disabled={!!feedback||!answer} className="min-h-12 rounded-lg bg-blue-600 px-5 font-bold text-white disabled:opacity-50">{t.submit}</button></form><div aria-live="polite" className="mt-4 min-h-14">{feedback&&<p className={`font-semibold ${feedback.ok?"text-emerald-700":"text-red-700"}`}><span aria-hidden>{feedback.ok?"✓":"✕"}</span> {feedback.ok?t.right:`${t.wrong}. ${t.correctAnswer}: ${question.answer}`}<br/><span className="font-mono text-sm text-gray-600 dark:text-gray-300">{feedback.explanation}</span></p>}</div></div></section>}
    {phase==="finished"&&result&&<section className="p-6 text-center sm:p-8"><h2 className="text-2xl font-bold">{t.final}</h2>{result.isNewRecord&&<p className="mt-2 font-bold text-emerald-600">★ {t.newRecord}</p>}<p className="mt-5 font-mono text-5xl font-black">{result.score}</p><div className="mx-auto mt-6 grid max-w-lg grid-cols-2 gap-3 sm:grid-cols-4">{[[t.correct,result.correct],[t.errors,result.wrong],[t.accuracy,`${accuracy}%`],[t.maxCombo,result.maxCombo]].map(([l,v])=><div key={String(l)} className="rounded-lg bg-slate-100 p-3 dark:bg-slate-900"><div className="text-xs text-gray-500">{l}</div><strong>{v}</strong></div>)}</div><div className="mt-7 flex flex-wrap justify-center gap-3"><button onClick={()=>start(true)} className="min-h-11 rounded-lg bg-blue-600 px-5 font-bold text-white">{t.again}</button><button onClick={()=>setPhase("intro")} className="min-h-11 rounded-lg border px-5 font-semibold">{t.change}</button><button onClick={share} className="min-h-11 rounded-lg border px-5 font-semibold">{t.share}</button></div>{shared&&<p role="status" className="mt-3 text-sm text-emerald-700">{t.copied}</p>}<div className="mt-8 border-t pt-6"><p>{t.cta}</p><Link onClick={()=>trackEvent("game_cta_clicked",{game_name:"binary_rush",destination:"ccna"})} href={certPath(lang,"ccna")} className="mt-3 inline-block font-bold text-blue-600 underline underline-offset-4">{t.ctaButton} →</Link></div></section>}
  </div></main>;
}
