"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { CheckCircle2, ChevronRight, Lightbulb, Network, RotateCcw, ShieldCheck, Table2, XCircle } from "lucide-react";
import type { Locale } from "@/lib/paths";
import NetworkTroubleshootingLab from "./NetworkTroubleshootingLab";

type Lab = {
  title: string;
  category: string;
  duration: string;
  scenario: string;
  task: string;
  options: string[];
  correct: number;
  hint: string;
  explanation: string;
};

const copy = {
  it: {
    subtitle: "Impara facendo, un'attività alla volta",
    body: "Tre brevi simulazioni per prendere confidenza con il formato dei laboratori. Non servono account esterni o software da installare.",
    badge: "3 lab disponibili", start: "Inizia il lab", task: "Attività", check: "Verifica risposta", hint: "Mostra suggerimento",
    correct: "Ottimo lavoro!", wrong: "Non ancora. Riprova o usa il suggerimento.", reset: "Ricomincia", completed: "Lab completati", min: "min",
    labs: [
      { title: "La prima formula", category: "Fogli di calcolo", duration: "3 min", scenario: "Hai un foglio con le vendite mensili nelle celle da B2 a B5.", task: "Quale formula calcola correttamente il totale?", options: ["=SUM(B2:B5)", "=B2-B5", "=COUNT(B2:B5)"], correct: 0, hint: "La funzione deve sommare un intervallo continuo di celle.", explanation: "SUM somma tutti i valori compresi nell'intervallo B2:B5." },
      { title: "Controlla la connessione", category: "Networking", duration: "4 min", scenario: "Un computer non riesce a raggiungere il gateway 192.168.1.1.", task: "Qual è il primo comando utile per verificare se il gateway risponde?", options: ["ping 192.168.1.1", "format 192.168.1.1", "mkdir 192.168.1.1"], correct: 0, hint: "Cerca il comando che invia richieste ICMP di test.", explanation: "ping verifica rapidamente la raggiungibilità e mostra latenza o perdita di pacchetti." },
      { title: "Riconosci il phishing", category: "Cybersecurity", duration: "4 min", scenario: "Ricevi un'email urgente che chiede di reimpostare subito la password tramite un link abbreviato.", task: "Qual è l'azione iniziale più sicura?", options: ["Aprire il link e controllare", "Verificare mittente e richiesta da un canale ufficiale", "Rispondere inviando la password attuale"], correct: 1, hint: "Non interagire con il contenuto sospetto prima di averne verificato l'origine.", explanation: "La verifica indipendente riduce il rischio di consegnare credenziali a un sito o mittente fraudolento." },
    ],
  },
  en: {
    subtitle: "Learn by doing, one task at a time", body: "Three short simulations to get familiar with the lab format. No external account or software is required.", badge: "3 labs available", start: "Start lab", task: "Task", check: "Check answer", hint: "Show hint", correct: "Great work!", wrong: "Not yet. Try again or use the hint.", reset: "Start over", completed: "Labs completed", min: "min",
    labs: [
      { title: "Your first formula", category: "Spreadsheets", duration: "3 min", scenario: "A worksheet contains monthly sales in cells B2 through B5.", task: "Which formula correctly calculates the total?", options: ["=SUM(B2:B5)", "=B2-B5", "=COUNT(B2:B5)"], correct: 0, hint: "The function must add a continuous range of cells.", explanation: "SUM adds every value in the B2:B5 range." },
      { title: "Check connectivity", category: "Networking", duration: "4 min", scenario: "A computer cannot reach its gateway at 192.168.1.1.", task: "Which command should you use first to see whether the gateway responds?", options: ["ping 192.168.1.1", "format 192.168.1.1", "mkdir 192.168.1.1"], correct: 0, hint: "Look for the command that sends ICMP test requests.", explanation: "ping quickly tests reachability and reports latency or packet loss." },
      { title: "Spot the phishing", category: "Cybersecurity", duration: "4 min", scenario: "An urgent email asks you to reset your password immediately using a shortened link.", task: "What is the safest first action?", options: ["Open the link and inspect it", "Verify the sender and request through an official channel", "Reply with your current password"], correct: 1, hint: "Do not interact with suspicious content before verifying its source.", explanation: "Independent verification reduces the risk of giving credentials to a fraudulent sender or website." },
    ],
  },
  fr: {
    subtitle: "Apprenez par la pratique, une tâche à la fois", body: "Trois courtes simulations pour découvrir le format des laboratoires. Aucun compte externe ni logiciel n'est requis.", badge: "3 labs disponibles", start: "Commencer", task: "Tâche", check: "Vérifier la réponse", hint: "Afficher l'indice", correct: "Bravo !", wrong: "Pas encore. Réessayez ou utilisez l'indice.", reset: "Recommencer", completed: "Labs terminés", min: "min",
    labs: [
      { title: "Votre première formule", category: "Tableurs", duration: "3 min", scenario: "Une feuille contient les ventes mensuelles dans les cellules B2 à B5.", task: "Quelle formule calcule correctement le total ?", options: ["=SUM(B2:B5)", "=B2-B5", "=COUNT(B2:B5)"], correct: 0, hint: "La fonction doit additionner une plage continue de cellules.", explanation: "SUM additionne toutes les valeurs de la plage B2:B5." },
      { title: "Tester la connexion", category: "Réseau", duration: "4 min", scenario: "Un ordinateur ne parvient pas à joindre la passerelle 192.168.1.1.", task: "Quelle commande utiliser d'abord pour vérifier si elle répond ?", options: ["ping 192.168.1.1", "format 192.168.1.1", "mkdir 192.168.1.1"], correct: 0, hint: "Cherchez la commande qui envoie des requêtes de test ICMP.", explanation: "ping teste rapidement l'accessibilité et indique la latence ou la perte de paquets." },
      { title: "Repérer le phishing", category: "Cybersécurité", duration: "4 min", scenario: "Un e-mail urgent vous demande de réinitialiser votre mot de passe via un lien raccourci.", task: "Quelle est la première action la plus sûre ?", options: ["Ouvrir le lien", "Vérifier l'expéditeur et la demande par un canal officiel", "Répondre avec son mot de passe"], correct: 1, hint: "N'interagissez pas avec un contenu suspect avant d'en vérifier la source.", explanation: "Une vérification indépendante évite de transmettre ses identifiants à un site frauduleux." },
    ],
  },
  es: {
    subtitle: "Aprende haciendo, una tarea a la vez", body: "Tres simulaciones breves para conocer el formato de los laboratorios. No necesitas cuentas externas ni instalar software.", badge: "3 labs disponibles", start: "Iniciar lab", task: "Tarea", check: "Comprobar respuesta", hint: "Mostrar pista", correct: "¡Buen trabajo!", wrong: "Todavía no. Inténtalo de nuevo o usa la pista.", reset: "Reiniciar", completed: "Labs completados", min: "min",
    labs: [
      { title: "Tu primera fórmula", category: "Hojas de cálculo", duration: "3 min", scenario: "Una hoja contiene las ventas mensuales en las celdas B2 a B5.", task: "¿Qué fórmula calcula correctamente el total?", options: ["=SUM(B2:B5)", "=B2-B5", "=COUNT(B2:B5)"], correct: 0, hint: "La función debe sumar un rango continuo de celdas.", explanation: "SUM suma todos los valores del rango B2:B5." },
      { title: "Comprueba la conexión", category: "Redes", duration: "4 min", scenario: "Un equipo no puede alcanzar la puerta de enlace 192.168.1.1.", task: "¿Qué comando usarías primero para comprobar si responde?", options: ["ping 192.168.1.1", "format 192.168.1.1", "mkdir 192.168.1.1"], correct: 0, hint: "Busca el comando que envía solicitudes de prueba ICMP.", explanation: "ping comprueba rápidamente la conectividad e informa de latencia o pérdida de paquetes." },
      { title: "Detecta el phishing", category: "Ciberseguridad", duration: "4 min", scenario: "Un correo urgente pide restablecer tu contraseña mediante un enlace acortado.", task: "¿Cuál es la primera acción más segura?", options: ["Abrir el enlace", "Verificar el remitente y la solicitud por un canal oficial", "Responder con la contraseña actual"], correct: 1, hint: "No interactúes con contenido sospechoso antes de verificar su origen.", explanation: "La verificación independiente reduce el riesgo de entregar credenciales a un sitio fraudulento." },
    ],
  },
} satisfies Record<Locale, Record<string, unknown>>;

const icons = [Table2, Network, ShieldCheck];

export default function InteractiveLabsLanding({ lang }: { lang: Locale }) {
  const t = copy[lang] as typeof copy.it;
  const [active, setActive] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [hint, setHint] = useState(false);
  const [done, setDone] = useState<number[]>([]);
  const [isDesktop, setIsDesktop] = useState(false);
  const networkLabRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (active !== 1) return;
    const frame = window.requestAnimationFrame(() => {
      networkLabRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [active, isDesktop]);

  const openLab = (index: number) => { setActive(index); setSelected(null); setResult(null); setHint(false); };
  const check = () => {
    if (active === null || selected === null) return;
    const ok = selected === t.labs[active].correct;
    setResult(ok ? "correct" : "wrong");
    if (ok) setDone((current) => current.includes(active) ? current : [...current, active]);
  };

  return <main className="min-h-[70vh] bg-gradient-to-b from-indigo-50 via-white to-white px-4 py-14 sm:py-16">
    <div className="mx-auto max-w-6xl">
      <header className="mx-auto max-w-3xl text-center">
        <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800">{t.badge}</span>
        <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">Interactive Labs</h1>
        <p className="mt-4 text-xl font-medium text-indigo-700">{t.subtitle}</p>
        <p className="mt-5 text-base leading-7 text-slate-600">{t.body}</p>
        <p className="mt-4 text-sm font-semibold text-slate-700">{t.completed}: {done.length}/3</p>
      </header>

      <section className="mt-12 grid gap-5 md:grid-cols-3" aria-label="Introductory interactive labs">
        {t.labs.map((lab: Lab, index: number) => {
          const Icon = icons[index];
          return <Fragment key={lab.title}>
            <article className={`rounded-2xl border bg-white p-6 shadow-sm transition ${done.includes(index) ? "border-emerald-300" : "border-slate-200 hover:-translate-y-0.5 hover:shadow-md"}`}>
              <div className="flex items-start justify-between"><span className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-50 text-indigo-700"><Icon aria-hidden="true" size={22}/></span><span className="text-xs font-semibold text-slate-500">{lab.duration}</span></div>
              <p className="mt-5 text-xs font-bold uppercase tracking-wider text-indigo-700">{lab.category}</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-950">{lab.title}</h2>
              <p className="mt-3 min-h-20 text-sm leading-6 text-slate-600">{lab.scenario}</p>
              <button onClick={() => openLab(index)} aria-expanded={active === index} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">{done.includes(index) ? t.reset : t.start}<ChevronRight size={17}/></button>
            </article>
            {index === 1 && active === 1 && !isDesktop && <div ref={networkLabRef} className="scroll-mt-20">
              <NetworkTroubleshootingLab lang={lang} onComplete={() => setDone((current) => current.includes(1) ? current : [...current, 1])}/>
            </div>}
          </Fragment>;
        })}
      </section>

      {active === 1 && isDesktop && <section ref={networkLabRef} className="mx-auto mt-10 max-w-5xl scroll-mt-24" aria-label={t.labs[1].title}>
        <NetworkTroubleshootingLab lang={lang} onComplete={() => setDone((current) => current.includes(1) ? current : [...current, 1])}/>
      </section>}

      {active !== null && active !== 1 && <section className="mx-auto mt-10 max-w-3xl rounded-2xl border border-indigo-200 bg-white p-6 shadow-lg sm:p-8" aria-live="polite">
        <div className="flex items-center justify-between gap-4"><div><p className="text-sm font-bold text-indigo-700">{t.labs[active].category}</p><h2 className="mt-1 text-2xl font-bold text-slate-950">{t.labs[active].title}</h2></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{active + 1}/3</span></div>
        <div className="mt-6 rounded-xl bg-slate-50 p-4 text-slate-700">{t.labs[active].scenario}</div>
        <h3 className="mt-6 font-semibold text-slate-950">{t.task}: {t.labs[active].task}</h3>
        <div className="mt-4 space-y-3">{t.labs[active].options.map((option: string, index: number) => <label key={option} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${selected === index ? "border-indigo-500 bg-indigo-50" : "border-slate-200 hover:bg-slate-50"}`}><input type="radio" name={`lab-${active}`} checked={selected === index} onChange={() => { setSelected(index); setResult(null); }} className="h-4 w-4 accent-indigo-600"/><span className="font-mono text-sm text-slate-800">{option}</span></label>)}</div>
        <div className="mt-5 flex flex-wrap gap-3"><button onClick={check} disabled={selected === null} className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50">{t.check}</button><button onClick={() => setHint(true)} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"><Lightbulb size={17}/>{t.hint}</button></div>
        {hint && !result && <p className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-900"><Lightbulb className="mr-2 inline" size={17}/>{t.labs[active].hint}</p>}
        {result && <div className={`mt-5 rounded-xl p-4 ${result === "correct" ? "bg-emerald-50 text-emerald-900" : "bg-rose-50 text-rose-900"}`}>{result === "correct" ? <CheckCircle2 className="mr-2 inline" size={20}/> : <XCircle className="mr-2 inline" size={20}/>}<strong>{result === "correct" ? t.correct : t.wrong}</strong>{result === "correct" && <p className="mt-2 text-sm leading-6">{t.labs[active].explanation}</p>}</div>}
        {result === "correct" && <button onClick={() => openLab((active + 1) % 3)} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-900">{active === 2 ? t.reset : t.start}<RotateCcw size={16}/></button>}
      </section>}
    </div>
  </main>;
}
