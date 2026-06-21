"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type QA = { q: string; a: string };

type Props = {
  items?: QA[];
};

const DEFAULT_FAQS: QA[] = [
  {
    q: "Posso provarlo prima di pagare?",
    a: "Sì. Scrivici e attiviamo una prova gratuita di 7 giorni per il tuo team, le stesse condizioni del piano Premium individuale.",
  },
  {
    q: "Ogni persona del team ha un account separato?",
    a: "Sì, ogni membro ha login e progressi individuali. Il referente aziendale vede una dashboard aggregata con lo stato di tutto il team.",
  },
  {
    q: "Quali certificazioni sono incluse?",
    a: "Tutte le 33+ certificazioni disponibili su CertifyQuiz: AWS, Cisco, Microsoft, CompTIA, ISC2, CEH e molte altre, in italiano, inglese, francese e spagnolo.",
  },
  {
    q: "Come funziona la fatturazione?",
    a: "Una fattura unica per l'azienda, niente carte di credito multiple da gestire. Su richiesta è possibile fatturare annualmente.",
  },
];

export default function FaqAccordion({ items = DEFAULT_FAQS }: Props) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-slate-200">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
              aria-expanded={isOpen}
            >
              <span className="text-[15px] font-medium text-slate-900">{item.q}</span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`grid overflow-hidden transition-all duration-200 ${
                isOpen ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="min-h-0">
                <p className="text-[14px] leading-relaxed text-slate-600">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
