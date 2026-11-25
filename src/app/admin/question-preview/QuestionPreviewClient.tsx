"use client";
// Anteprima amministrativa di UNA domanda per ID. Riusa QuizEngine (stesso rendering di spiegazione e fonti verificabili)
// in modalita' `previewCheckAnswer`: sola lettura, nessun tentativo/statistica/progresso/quota/analytics.
// L'autorizzazione vera e' lato backend (/api/admin/question-preview, 404 ai non-admin); il controllo qui e' solo di UX.
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import QuizEngine from "@/components/quiz/QuizEngine";
import { useAuth } from "@/components/auth/AuthProvider";
import { apiFetch } from "@/lib/auth";
import type { AnswerCheckResult } from "@/lib/apiClient";
import type { Locale, Question } from "@/lib/quiz-types";

const LANGS: Locale[] = ["it", "en", "fr", "es"];

type PreviewMeta = {
  lang: string;
  is_active: boolean;
  topic_is_active: boolean;
  has_text_in_lang: boolean;
  answers_in_lang: number;
  has_explanation_in_lang: boolean;
};
type PreviewPayload = {
  question: Question & { topic_title?: string | null; certification_name?: string | null; topic_id?: number };
  preview: PreviewMeta;
};

const parseLang = (v: string | null): Locale => (LANGS.includes(v as Locale) ? (v as Locale) : "it");

export default function QuestionPreviewClient() {
  const router = useRouter();
  const params = useSearchParams();
  const { isAdmin, user } = useAuth();
  const idParam = params.get("id") ?? "";
  const lang = parseLang(params.get("lang"));
  const [draftId, setDraftId] = useState(idParam);
  const [data, setData] = useState<PreviewPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => setDraftId(idParam), [idParam]);

  useEffect(() => {
    if (!isAdmin || !/^\d+$/.test(idParam)) { setData(null); setError(null); return; }
    let alive = true;
    setLoading(true); setError(null); setData(null);
    apiFetch(`/admin/question-preview/${idParam}?lang=${lang}`, { cache: "no-store" })
      .then(async (r) => {
        if (!alive) return;
        if (r.status === 404) throw new Error("Domanda non trovata (oppure accesso non consentito).");
        if (!r.ok) throw new Error(`Errore ${r.status}`);
        setData((await r.json()) as PreviewPayload);
      })
      .catch((e) => alive && setError(e?.message || "Errore di rete"))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [isAdmin, idParam, lang]);

  const go = (id: string, l: Locale) => router.replace(`/admin/question-preview?id=${encodeURIComponent(id.trim())}&lang=${l}`);

  const previewCheckAnswer = useCallback(async (questionId: number, answerId: number, l: Locale): Promise<AnswerCheckResult> => {
    const r = await apiFetch(`/admin/question-preview/${questionId}/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer_id: answerId, lang: l }),
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return (await r.json()) as AnswerCheckResult;
  }, []);

  const fetchQuestions = useCallback(async () => (data ? [data.question as Question] : []), [data]);
  const scope = useMemo(() => `admin-preview:${idParam}:${lang}`, [idParam, lang]);

  if (!user) return <main className="mx-auto max-w-3xl p-6">Accedi con un account amministratore.</main>;
  if (!isAdmin) return <main className="mx-auto max-w-3xl p-6">Pagina riservata agli amministratori.</main>;

  const meta = data?.preview;
  return (
    <main className="mx-auto max-w-3xl p-4 sm:p-6">
      <h1 className="text-xl font-bold">Anteprima domanda (admin)</h1>
      <p className="mt-1 text-sm text-gray-600">
        Sola lettura: nessun tentativo, statistica, progresso o consumo di quota viene registrato.
      </p>
      <form className="mt-4 flex flex-wrap items-end gap-2" onSubmit={(e) => { e.preventDefault(); if (/^\d+$/.test(draftId.trim())) go(draftId, lang); }}>
        <label className="text-sm">ID domanda
          <input value={draftId} onChange={(e) => setDraftId(e.target.value)} inputMode="numeric" className="mt-1 block w-32 rounded border px-2 py-1" aria-label="ID domanda" />
        </label>
        <label className="text-sm">Lingua
          <select value={lang} onChange={(e) => go(draftId || idParam, e.target.value as Locale)} className="mt-1 block rounded border px-2 py-1">
            {LANGS.map((l) => <option key={l} value={l}>{l.toUpperCase()}</option>)}
          </select>
        </label>
        <button type="submit" className="rounded bg-blue-700 px-3 py-1.5 text-sm font-semibold text-white">Apri</button>
      </form>

      {idParam && !/^\d+$/.test(idParam) && <p className="mt-4 text-sm text-red-700">ID non valido.</p>}
      {loading && <p className="mt-4 text-sm">Caricamento…</p>}
      {error && <p className="mt-4 text-sm text-red-700" role="alert">{error}</p>}

      {meta && (
        <ul className="mt-4 flex flex-wrap gap-2 text-xs" aria-label="Stato della domanda">
          <li className={`rounded px-2 py-1 ${meta.is_active ? "bg-green-100 text-green-900" : "bg-red-100 text-red-900"}`}>{meta.is_active ? "Attiva" : "INATTIVA (ritirata)"}</li>
          {!meta.topic_is_active && <li className="rounded bg-red-100 px-2 py-1 text-red-900">Topic non attivo</li>}
          <li className="rounded bg-gray-100 px-2 py-1">Risposte in {meta.lang.toUpperCase()}: {meta.answers_in_lang}</li>
          {!meta.has_text_in_lang && <li className="rounded bg-yellow-100 px-2 py-1 text-yellow-900">Testo mancante in {meta.lang.toUpperCase()}</li>}
          {!meta.has_explanation_in_lang && <li className="rounded bg-yellow-100 px-2 py-1 text-yellow-900">Spiegazione mancante in {meta.lang.toUpperCase()}</li>}
          <li className="rounded bg-gray-100 px-2 py-1">ID {data?.question.id} · topic {data?.question.topic_id}</li>
        </ul>
      )}

      {data && (
        <div className="mt-4">
          <QuizEngine
            key={scope}
            lang={lang}
            storageScope={scope}
            mode="training"
            hideModeSwitch
            limitsByMode={{ training: 1 }}
            fetchQuestions={fetchQuestions}
            previewCheckAnswer={previewCheckAnswer}
          />
        </div>
      )}
    </main>
  );
}
