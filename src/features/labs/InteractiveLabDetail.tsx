"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Locale } from "@/lib/paths";
import NetworkTroubleshootingLab from "./NetworkTroubleshootingLab";
import SpreadsheetFormulaLab from "./SpreadsheetFormulaLab";
import PhishingAnalysisLab from "./PhishingAnalysisLab";
import ScenarioChallengeLab, { scenarioChallenges } from "./ScenarioChallengeLab";
import type { LabSlug } from "./lab-config";
import GuidedCertificationLab from "./GuidedCertificationLab";

const back={it:"Torna a tutti i laboratori",en:"Back to all labs",fr:"Retour aux laboratoires",es:"Volver a los laboratorios"};
export default function InteractiveLabDetail({lang,lab}:{lang:Locale;lab:LabSlug}){const href=lang==="en"?"/interactive-labs":`/${lang}/interactive-labs`;const complete=()=>{};const guided=lab.startsWith("ccst-networking-");return <main id="main" className="min-h-[75vh] bg-slate-50 px-3 py-8 sm:px-4 sm:py-12"><div className="mx-auto max-w-6xl"><Link href={href} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-900"><ArrowLeft size={17}/>{back[lang]}</Link>{guided?<GuidedCertificationLab lang={lang} slug={lab}/>:lab==="spreadsheets"?<SpreadsheetFormulaLab lang={lang} onComplete={complete}/>:lab==="networking"?<NetworkTroubleshootingLab lang={lang} onComplete={complete}/>:lab==="phishing"?<PhishingAnalysisLab lang={lang} onComplete={complete}/>:scenarioChallenges[lab]?<ScenarioChallengeLab lang={lang} slug={lab} onComplete={complete}/>:null}</div></main>}
