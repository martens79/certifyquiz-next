"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { CheckCircle2, Clock3, Lightbulb, RotateCcw, Terminal } from "lucide-react";
import type { Locale } from "@/lib/paths";

type Line = { command?: string; output: string; tone?: "good" | "bad" | "muted" };

const content = {
  it: { title: "Diagnostica una connessione", scenario: "L'utente può raggiungere il gateway, ma non riesce ad aprire example.com. Individua il problema usando il terminale.", objective: "Obiettivo", objectives: ["Controlla la configurazione IP", "Verifica il gateway", "Testa la risoluzione DNS", "Applica la correzione"], placeholder: "Digita un comando…", run: "Esegui", hint: "Suggerimento", reset: "Ricomincia", score: "Punteggio", complete: "Problema risolto!", summary: "Hai verificato rete locale e gateway, isolato il guasto DNS e configurato un server funzionante.", commands: "Comandi disponibili: ipconfig, ping, nslookup, set dns", hints: ["Usa ipconfig per leggere indirizzo, gateway e DNS.", "Prova: ping 192.168.1.1", "Interroga il dominio con: nslookup example.com", "Configura il DNS con: set dns 1.1.1.1"], unknown: "Comando non riconosciuto. Consulta i comandi disponibili.", order: "Prima completa l'obiettivo precedente.", restored: "Progresso ripristinato su questo dispositivo." },
  en: { title: "Diagnose a connection", scenario: "The user can reach the gateway but cannot open example.com. Find the problem using the terminal.", objective: "Objective", objectives: ["Inspect the IP configuration", "Verify the gateway", "Test DNS resolution", "Apply the fix"], placeholder: "Enter a command…", run: "Run", hint: "Hint", reset: "Start over", score: "Score", complete: "Problem solved!", summary: "You checked the local network and gateway, isolated the DNS failure, and configured a working server.", commands: "Available commands: ipconfig, ping, nslookup, set dns", hints: ["Use ipconfig to inspect the address, gateway, and DNS.", "Try: ping 192.168.1.1", "Query the domain with: nslookup example.com", "Configure DNS with: set dns 1.1.1.1"], unknown: "Command not recognized. Check the available commands.", order: "Complete the previous objective first.", restored: "Progress restored on this device." },
  fr: { title: "Diagnostiquer une connexion", scenario: "L'utilisateur atteint la passerelle mais ne peut pas ouvrir example.com. Trouvez le problème avec le terminal.", objective: "Objectif", objectives: ["Contrôler la configuration IP", "Vérifier la passerelle", "Tester la résolution DNS", "Appliquer la correction"], placeholder: "Saisissez une commande…", run: "Exécuter", hint: "Indice", reset: "Recommencer", score: "Score", complete: "Problème résolu !", summary: "Vous avez vérifié le réseau local, isolé la panne DNS et configuré un serveur fonctionnel.", commands: "Commandes disponibles : ipconfig, ping, nslookup, set dns", hints: ["Utilisez ipconfig pour voir l'adresse, la passerelle et le DNS.", "Essayez : ping 192.168.1.1", "Interrogez le domaine : nslookup example.com", "Configurez le DNS : set dns 1.1.1.1"], unknown: "Commande non reconnue. Consultez les commandes disponibles.", order: "Terminez d'abord l'objectif précédent.", restored: "Progression restaurée sur cet appareil." },
  es: { title: "Diagnostica una conexión", scenario: "El usuario alcanza la puerta de enlace, pero no puede abrir example.com. Encuentra el problema usando la terminal.", objective: "Objetivo", objectives: ["Comprueba la configuración IP", "Verifica la puerta de enlace", "Prueba la resolución DNS", "Aplica la solución"], placeholder: "Escribe un comando…", run: "Ejecutar", hint: "Pista", reset: "Reiniciar", score: "Puntuación", complete: "¡Problema resuelto!", summary: "Comprobaste la red local y la puerta de enlace, aislaste el fallo DNS y configuraste un servidor funcional.", commands: "Comandos disponibles: ipconfig, ping, nslookup, set dns", hints: ["Usa ipconfig para ver dirección, puerta de enlace y DNS.", "Prueba: ping 192.168.1.1", "Consulta el dominio: nslookup example.com", "Configura DNS con: set dns 1.1.1.1"], unknown: "Comando no reconocido. Consulta los comandos disponibles.", order: "Completa primero el objetivo anterior.", restored: "Progreso restaurado en este dispositivo." },
} as const;

const STORAGE_KEY = "certifyquiz-network-lab-v1";

export default function NetworkTroubleshootingLab({ lang, onComplete }: { lang: Locale; onComplete: () => void }) {
  const t = content[lang];
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(100);
  const [seconds, setSeconds] = useState(0);
  const [command, setCommand] = useState("");
  const [lines, setLines] = useState<Line[]>([{ output: t.commands, tone: "muted" }]);
  const [restored, setRestored] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") as { step?: number; score?: number; seconds?: number } | null;
      if (saved?.step && saved.step > 0 && saved.step < 4) { setStep(saved.step); setScore(saved.score ?? 100); setSeconds(saved.seconds ?? 0); setRestored(true); }
    } catch { /* Ignore invalid local state. */ }
  }, []);

  useEffect(() => {
    if (step >= 4) return;
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [step]);

  useEffect(() => {
    if (step > 0 && step < 4) localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, score, seconds }));
  }, [step, score, seconds]);

  useEffect(() => outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight }), [lines]);

  const advance = (next: number, output: string) => {
    setLines((current) => [...current, { command, output, tone: "good" }]);
    setStep(next);
    if (next === 4) { localStorage.removeItem(STORAGE_KEY); onComplete(); }
  };

  const run = (event: FormEvent) => {
    event.preventDefault();
    const raw = command.trim();
    const value = raw.toLowerCase().replace(/\s+/g, " ");
    if (!value) return;
    if (value === "ipconfig") {
      if (step === 0) advance(1, "IPv4: 192.168.1.24\nMask: 255.255.255.0\nGateway: 192.168.1.1\nDNS: 192.168.1.254");
      else setLines((x) => [...x, { command: raw, output: "IPv4: 192.168.1.24 | Gateway: 192.168.1.1 | DNS: 192.168.1.254" }]);
    } else if (value === "ping 192.168.1.1") {
      if (step === 1) advance(2, "Reply from 192.168.1.1: bytes=32 time=2ms TTL=64\nPackets: Sent=4, Received=4, Lost=0");
      else setLines((x) => [...x, { command: raw, output: step < 1 ? t.order : "Gateway reachable: 0% packet loss", tone: step < 1 ? "bad" : "good" }]);
    } else if (value === "nslookup example.com") {
      if (step === 2) advance(3, "DNS request timed out.\nServer: 192.168.1.254\n*** No response from server");
      else setLines((x) => [...x, { command: raw, output: step < 2 ? t.order : "DNS request timed out: 192.168.1.254", tone: "bad" }]);
    } else if (value === "set dns 1.1.1.1") {
      if (step === 3) advance(4, "DNS server updated to 1.1.1.1\nTest: example.com -> 93.184.216.34");
      else setLines((x) => [...x, { command: raw, output: t.order, tone: "bad" }]);
    }
    else { setScore((x) => Math.max(0, x - 5)); setLines((x) => [...x, { command: raw, output: t.unknown, tone: "bad" }]); }
    setCommand("");
  };

  const showHint = () => { setScore((x) => Math.max(0, x - 10)); setLines((x) => [...x, { output: `💡 ${t.hints[Math.min(step, 3)]}`, tone: "muted" }]); };
  const reset = () => { localStorage.removeItem(STORAGE_KEY); setStep(0); setScore(100); setSeconds(0); setLines([{ output: t.commands, tone: "muted" }]); setRestored(false); };

  return <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 text-slate-100 shadow-2xl">
    <header className="border-b border-slate-700 bg-gradient-to-r from-slate-950 to-blue-950 p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[.2em] text-cyan-300"><Terminal size={15}/> Network Lab</p><h2 className="mt-2 text-2xl font-bold sm:text-3xl">{t.title}</h2></div><div className="flex gap-2 text-xs font-semibold"><span className="rounded-full bg-slate-800 px-3 py-2">{t.score}: {score}</span><span className="flex items-center gap-1 rounded-full bg-slate-800 px-3 py-2"><Clock3 size={14}/>{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}</span></div></div>
      <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">{t.scenario}</p>
      {restored && <p className="mt-3 text-xs text-cyan-300">{t.restored}</p>}
    </header>

    <div className="grid lg:grid-cols-[280px_1fr]">
      <aside className="border-b border-slate-700 p-5 lg:border-b-0 lg:border-r">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{t.objective}</p>
        <ol className="mt-4 space-y-3">{t.objectives.map((item, index) => <li key={item} className={`flex gap-3 text-sm ${index < step ? "text-emerald-300" : index === step ? "text-white" : "text-slate-500"}`}><span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold ${index < step ? "bg-emerald-900" : index === step ? "bg-blue-600" : "bg-slate-800"}`}>{index < step ? <CheckCircle2 size={15}/> : index + 1}</span><span className="pt-0.5">{item}</span></li>)}</ol>
        <button onClick={showHint} disabled={step >= 4} className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-amber-700/60 px-3 py-2 text-sm text-amber-300 hover:bg-amber-950 disabled:opacity-40"><Lightbulb size={16}/>{t.hint} (-10)</button>
      </aside>

      <div className="min-w-0 p-4 sm:p-6">
        <div ref={outputRef} className="h-72 overflow-y-auto rounded-t-xl bg-black p-4 font-mono text-sm leading-6" aria-live="polite">{lines.map((line, index) => <div key={index} className="mb-3 whitespace-pre-wrap"><>{line.command && <div className="text-cyan-300">C:\Users\student&gt; {line.command}</div>}</><div className={line.tone === "good" ? "text-emerald-300" : line.tone === "bad" ? "text-rose-300" : "text-slate-400"}>{line.output}</div></div>)}</div>
        {step < 4 ? <form onSubmit={run} className="flex rounded-b-xl border-t border-slate-800 bg-slate-900"><label htmlFor="lab-command" className="sr-only">{t.placeholder}</label><span className="py-3 pl-4 font-mono text-cyan-300">&gt;</span><input id="lab-command" value={command} onChange={(e) => setCommand(e.target.value)} placeholder={t.placeholder} autoComplete="off" className="min-w-0 flex-1 bg-transparent px-3 py-3 font-mono text-sm text-white outline-none placeholder:text-slate-600"/><button className="m-1 rounded-lg bg-blue-600 px-4 text-sm font-semibold hover:bg-blue-500">{t.run}</button></form> : <div className="rounded-b-xl bg-emerald-950 p-5 text-emerald-200"><p className="flex items-center gap-2 text-lg font-bold"><CheckCircle2/>{t.complete}</p><p className="mt-2 text-sm leading-6">{t.summary}</p></div>}
        <button onClick={reset} className="mt-4 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"><RotateCcw size={15}/>{t.reset}</button>
      </div>
    </div>
  </div>;
}
