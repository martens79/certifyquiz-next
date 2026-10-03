// src/components/topics/FreePoolNotice.tsx
// For a certification with a topic gate (PLC Fundamentals): tells a user who is NOT entitled that the
// mixed quiz and the practice test draw only from the free questions, and offers the Premium upsell.
// Nothing is rendered for entitled users, while the status is unknown, or if the request fails.
"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { loadTopicAccess } from "@/lib/topic-access-client";
import { premiumHref, type TopicAccessLang } from "@/lib/topic-access";

export function freePoolMessage(lang: TopicAccessLang, freeQuestions: number) {
  const n = String(freeQuestions);
  const text: Record<TopicAccessLang, { body: string; cta: string }> = {
    it: { body: `Con l'account gratuito questo quiz usa solo le ${n} domande gratuite dei 3 argomenti Free. Il pool completo è incluso nel Premium.`, cta: "Passa a Premium" },
    en: { body: `With a free account this quiz uses only the ${n} free questions from the 3 Free topics. The full pool is included in Premium.`, cta: "Go Premium" },
    fr: { body: `Avec un compte gratuit, ce quiz utilise uniquement les ${n} questions gratuites des 3 sujets Free. Le pool complet est inclus dans Premium.`, cta: "Passer à Premium" },
    es: { body: `Con una cuenta gratuita, este quiz usa solo las ${n} preguntas gratuitas de los 3 temas Free. El pool completo está incluido en Premium.`, cta: "Pasar a Premium" },
  };
  return text[lang] ?? text.en;
}

export default function FreePoolNotice({
  certId,
  lang,
  freeQuestions,
}: {
  certId: number;
  lang: TopicAccessLang;
  freeQuestions: number;
}) {
  const [entitled, setEntitled] = useState<boolean | null>(null);

  useEffect(() => {
    let alive = true;
    loadTopicAccess(certId).then((s) => {
      if (alive) setEntitled(s.entitled);
    });
    return () => {
      alive = false;
    };
  }, [certId]);

  if (entitled !== false) return null;

  const t = freePoolMessage(lang, freeQuestions);
  return (
    <p data-free-pool-notice className="mt-2 text-xs text-slate-700">
      {t.body}{" "}
      <Link href={premiumHref(lang)} className="font-semibold text-blue-700 underline">
        {t.cta}
      </Link>
    </p>
  );
}
