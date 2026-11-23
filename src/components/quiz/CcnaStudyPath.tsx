"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { apiFetch } from "@/lib/auth";
import {
  studyCopy,
  type StudyLang,
  type StudyAttempt,
  type StudyAnswer,
} from "@/lib/ccna-study-path";

export default function CcnaStudyPath({ lang }: { lang: StudyLang }) {
  const c = studyCopy[lang];
  const { user, loading } = useAuth();
  const [attempt, setAttempt] = useState<StudyAttempt | null>(null);
  const [answers, setAnswers] = useState<StudyAnswer[]>([]);
  const [index, setIndex] = useState(0),
    [busy, setBusy] = useState(true),
    [error, setError] = useState("");
  const generation = useRef(0);
  async function request(path: string, method = "GET", body?: unknown) {
    const r = await apiFetch(
      `/study-path/ccna${path}?lang=${lang}`,
      {
        method,
        ...(body
          ? {
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            }
          : {}),
      },
      { redirectOnUnauthorized: false },
    );
    if (!r.ok)
      throw new Error(
        r.status === 404 || r.status === 503 ? c.unavailable : c.error,
      );
    return (await r.json()).attempt as StudyAttempt | null;
  }
  useEffect(() => {
    const g = ++generation.current;
    setAttempt(null);
    setAnswers([]);
    setIndex(0);
    setError("");
    if (loading) return;
    if (!user) {
      setBusy(false);
      return;
    }
    setBusy(true);
    request("")
      .then((a) => {
        if (g !== generation.current) return;
        setAttempt(a);
        setAnswers(a?.answers || []);
        setIndex(Math.min(a?.answers.length || 0, 29));
      })
      .catch((e) => {
        if (g === generation.current) setError(e.message);
      })
      .finally(() => {
        if (g === generation.current) setBusy(false);
      });
    const guard = generation;
    return () => {
      guard.current++;
    };
    // Reload whenever the authenticated identity or language changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, loading, lang]);
  async function act(kind: "start" | "restart" | "progress" | "finish") {
    const g = generation.current;
    setBusy(true);
    setError("");
    try {
      const a = await request(
        `/${kind}`,
        kind === "progress" ? "PUT" : "POST",
        { answers, attemptId: attempt?.id },
      );
      if (g !== generation.current) return;
      setAttempt(a);
      setAnswers(a?.answers || []);
      if (kind === "progress") setIndex(Math.min(index + 1, 29));
      else if (kind === "restart" || kind === "start") setIndex(0);
    } catch (e) {
      if (g === generation.current)
        setError(e instanceof Error ? e.message : c.error);
    } finally {
      if (g === generation.current) setBusy(false);
    }
  }
  const q = attempt?.questions[index],
    selected = answers.find((a) => a.question_id === q?.id)?.answer_id;
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold">{c.title}</h1>
      <p>{c.intro}</p>
      {error && (
        <div role="alert" className="rounded border border-red-300 p-4">
          <p>{error}</p>
          {user && !busy && (
            <button className="underline" onClick={() => act("restart")}>
              {c.restart}
            </button>
          )}
        </div>
      )}
      {loading || busy ? (
        <p role="status">{c.loading}</p>
      ) : !user ? (
        <Link
          className="underline"
          href={`/${lang}/login?redirect=${encodeURIComponent(`/${lang}/study-path/ccna`)}`}
        >
          {c.login}
        </Link>
      ) : !attempt ? (
        <button
          className="rounded bg-blue-700 px-5 py-3 text-white"
          onClick={() => act("start")}
        >
          {c.start}
        </button>
      ) : attempt.result ? (
        <>
          <h2 className="text-2xl font-semibold">{c.result}</h2>
          <p className="text-3xl">
            {attempt.result.percentage}% · {attempt.result.correct}/
            {attempt.result.total}
          </p>
          <h3 className="text-xl font-semibold">{c.priorities}</h3>
          <ol className="space-y-3">
            {attempt.result.topics.map((t, i) => (
              <li key={t.topicId} className="rounded border p-4">
                <p className="font-semibold">
                  {i + 1}. {t.title}
                  {i === 0 ? ` · ${c.first}` : ""}
                </p>
                <p>
                  {t.correct}/{t.total} {c.evidence}
                </p>
                <p>{c[t.evidence]}</p>
              </li>
            ))}
          </ol>
          <button className="underline" onClick={() => act("restart")}>
            {c.restart}
          </button>
          <p>{c.future}</p>
          <p>
            {c.readiness}{" "}
            <Link className="underline" href={`/${lang}/profile`}>
              {c.profile}
            </Link>
          </p>
        </>
      ) : q ? (
        <section className="space-y-4" aria-label={`${index + 1}/30`}>
          <p>
            {index + 1}/30 · {q.topic_title}
          </p>
          <fieldset disabled={busy}>
            <legend className="mb-4 text-xl font-semibold whitespace-pre-wrap">
              {q.question}
            </legend>
            {q.exhibit?.content && (
              <pre
                className="overflow-auto rounded bg-slate-100 p-4 text-sm"
                aria-label={q.exhibit.title || "Exhibit"}
              >
                {q.exhibit.content}
              </pre>
            )}
            <div className="space-y-3">
              {q.answers.map((a) => (
                <label key={a.id} className="flex gap-3 rounded border p-4">
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    checked={selected === a.id}
                    onChange={() =>
                      setAnswers((prev) => [
                        ...prev.filter((x) => x.question_id !== q.id),
                        { question_id: q.id, answer_id: a.id },
                      ])
                    }
                  />
                  <span className="whitespace-pre-wrap">{a.text}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="flex gap-4">
            <button
              disabled={index === 0 || busy}
              onClick={() => setIndex(index - 1)}
            >
              {c.back}
            </button>
            <button
              className="rounded bg-blue-700 px-5 py-3 text-white disabled:opacity-50"
              disabled={
                !selected || busy || (index === 29 && answers.length !== 30)
              }
              onClick={() => act(index === 29 ? "finish" : "progress")}
            >
              {index === 29 ? c.finish : c.next}
            </button>
          </div>
          <p className="text-sm text-slate-600">
            {JSON.stringify(answers) === JSON.stringify(attempt.answers)
              ? c.saved
              : c.next}
          </p>
        </section>
      ) : null}
    </main>
  );
}
