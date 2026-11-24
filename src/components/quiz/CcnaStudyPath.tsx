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
  type StudyProgress,
} from "@/lib/ccna-study-path";

export default function CcnaStudyPath({ lang }: { lang: StudyLang }) {
  const c = studyCopy[lang];
  const { user, loading } = useAuth();
  const [attempt, setAttempt] = useState<StudyAttempt | null>(null);
  const [answers, setAnswers] = useState<StudyAnswer[]>([]);
  const [index, setIndex] = useState(0),
    [busy, setBusy] = useState(true),
    [error, setError] = useState(""),
    // What to repeat after a failure. A temporary error never discards the attempt.
    [failed, setFailed] = useState<{
      kind: "load" | "start" | "restart" | "progress" | "finish";
      conflict: boolean;
    } | null>(null),
    [confirmRestart, setConfirmRestart] = useState(false),
    [resumed, setResumed] = useState(false),
    // Read-only progress after the diagnostic; null = unavailable (older backend, error, no data): C1 view.
    [progress, setProgress] = useState<StudyProgress | null>(null);
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
      throw Object.assign(
        new Error(
          r.status === 404 || r.status === 503
            ? c.unavailable
            : r.status === 409
              ? c.conflict
              : c.error,
        ),
        { status: r.status },
      );
    return (await r.json()).attempt as StudyAttempt | null;
  }
  function load(g: number) {
    return request("")
      .then((a) => {
        if (g !== generation.current) return;
        setAttempt(a);
        setAnswers(a?.answers || []);
        setIndex(Math.min(a?.answers.length || 0, 29));
        setResumed(Boolean(a && !a.result && a.answers.length > 0));
      })
      .catch((e) => {
        if (g !== generation.current) return;
        setError(e.message || c.error);
        setFailed({ kind: "load", conflict: e?.status === 409 });
      })
      .finally(() => {
        if (g === generation.current) setBusy(false);
      });
  }
  useEffect(() => {
    const g = ++generation.current;
    setAttempt(null);
    setAnswers([]);
    setIndex(0);
    setError("");
    setFailed(null);
    setConfirmRestart(false);
    setResumed(false);
    if (loading) return;
    if (!user) {
      setBusy(false);
      return;
    }
    setBusy(true);
    load(g);
    const guard = generation;
    return () => {
      guard.current++;
    };
    // Reload whenever the authenticated identity or language changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, loading, lang]);
  const finished = Boolean(attempt?.result);
  const uid = user?.id;
  useEffect(() => {
    setProgress(null);
    if (!finished || !uid) return;
    let cancelled = false;
    const refresh = () =>
      apiFetch(
        `/study-path/ccna/progress?lang=${lang}`,
        { method: "GET" },
        { redirectOnUnauthorized: false },
      )
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (!cancelled) setProgress(d && Array.isArray(d.topics) ? d : null);
        })
        .catch(() => {});
    refresh();
    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [finished, uid, lang]);
  function retry() {
    if (!failed) return;
    if (failed.kind === "load" || failed.conflict) {
      // Reload the server copy: local selections are kept only if the attempt is unchanged.
      const g = ++generation.current;
      setBusy(true);
      setError("");
      setFailed(null);
      load(g);
    } else void act(failed.kind);
  }
  async function act(kind: "start" | "restart" | "progress" | "finish") {
    const g = generation.current;
    setBusy(true);
    setError("");
    setFailed(null);
    setConfirmRestart(false);
    setResumed(false);
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
      if (g === generation.current) {
        setError(e instanceof Error ? e.message : c.error);
        setFailed({ kind, conflict: (e as { status?: number })?.status === 409 });
      }
    } finally {
      if (g === generation.current) setBusy(false);
    }
  }
  const fill = (t: string, n: number) =>
    t.replace("{n}", String(n)).replace("{total}", "30");
  const correctText = (n: number, total: number) =>
    (n === 1 ? c.correctOfOne : c.correctOf)
      .replace("{n}", String(n))
      .replace("{total}", String(total));
  const q = attempt?.questions[index],
    selected = answers.find((a) => a.question_id === q?.id)?.answer_id;
  const isSaved = JSON.stringify(answers) === JSON.stringify(attempt?.answers);
  const primary =
    "scroll-mb-44 inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-3.5 text-base font-bold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-50";
  const ghost =
    "scroll-mb-44 inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3.5 text-base font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-40";
  const trainPrimary =
    "inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-base font-bold !text-white no-underline shadow-sm transition hover:bg-blue-700 hover:no-underline focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 sm:w-auto";
  const trainGhost =
    "inline-flex w-full items-center justify-center rounded-2xl border border-blue-300 bg-white px-5 py-3 text-base font-semibold !text-blue-700 no-underline transition hover:bg-blue-50 hover:no-underline focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 sm:w-auto";
  // Existing FREE topic training route; topicId is the real questions.topic_id from the result.
  const trainHref = (topicId: number) => `/${lang}/quiz/topic/${topicId}`;
  const linkBtn =
    "text-sm font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-900";
  const topics = attempt?.result?.topics ?? [];
  const live = progress && progress.next && progress.topics.length ? progress : null;
  type Key = "weak" | "insufficient" | "consolidate" | "strong";
  type Row = { topicId: number; title: string; key: Key; correct: number; total: number; p?: StudyProgress["topics"][number] };
  const rows: Row[] = live
    ? live.topics.map((p) => ({
        topicId: p.topicId,
        title: p.title,
        key: (p.strong ? "strong" : p.status) as Key,
        correct: p.initial?.correct ?? 0,
        total: p.initial?.total ?? 0,
        p,
      }))
    : topics.map((t) => ({
        topicId: t.topicId,
        title: t.title,
        key: (t.evidence === "consolidate" && t.correct / t.total >= 0.7 ? "strong" : t.evidence) as Key,
        correct: t.correct,
        total: t.total,
      }));
  const groups = [
    { key: "weak", title: c.gaps, hint: "", list: rows.filter((r) => r.key === "weak"), tone: "rose" },
    { key: "insufficient", title: c.unclear, hint: c.unclearHint, list: rows.filter((r) => r.key === "insufficient"), tone: "amber" },
    { key: "consolidate", title: c.consolidate, hint: "", list: rows.filter((r) => r.key === "consolidate"), tone: "sky" },
    { key: "strong", title: c.strengths, hint: "", list: rows.filter((r) => r.key === "strong"), tone: "emerald" },
  ] as const;
  const trainingText = (p: StudyProgress["topics"][number]) =>
    p.lastFirstAnswers.accuracy === null
      ? c.recentNone
      : c.recentValue.replace("{p}", String(p.lastFirstAnswers.accuracy)).replace("{n}", String(p.lastFirstAnswers.answered));
  const coverageText = (p: StudyProgress["topics"][number]) =>
    c.coverageValue.replace("{a}", String(p.coverage.answered)).replace("{b}", String(p.coverage.available));
  const rowText = (r: Row) =>
    r.p ? (
      <dl className="mt-2 grid gap-1 text-sm text-slate-600">
        {r.p.initial && (
          <div className="flex flex-wrap justify-between gap-x-3">
            <dt>{c.initialLabel}</dt>
            <dd className="font-medium text-slate-800">{correctText(r.p.initial.correct, r.p.initial.total)}</dd>
          </div>
        )}
        <div className="flex flex-wrap justify-between gap-x-3">
          <dt>{c.recentLabel}</dt>
          <dd data-testid="last-first-answers" className="font-medium text-slate-800">{trainingText(r.p)}</dd>
        </div>
        <div className="flex flex-wrap justify-between gap-x-3">
          <dt>{c.coverageLabel}</dt>
          <dd data-testid="coverage" className="font-medium text-slate-800">{coverageText(r.p)}</dd>
        </div>
      </dl>
    ) : (
      <p className="mt-1 text-sm text-slate-600">{correctText(r.correct, r.total)}</p>
    );
  const barPct = (r: Row) =>
    r.p
      ? Math.round((r.p.coverage.ratio ?? 0) * 100)
      : r.total
        ? Math.round((r.correct / r.total) * 100)
        : 0;
  const tones = {
    rose: { bar: "bg-rose-500", badge: "bg-rose-100 text-rose-800" },
    amber: { bar: "bg-amber-500", badge: "bg-amber-100 text-amber-900" },
    sky: { bar: "bg-sky-500", badge: "bg-sky-100 text-sky-800" },
    emerald: { bar: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-800" },
  } as const;
  const first = live ? rows.find((r) => r.topicId === live.next?.topicId) : rows[0];
  const showBody = !loading && !busy && failed?.kind !== "load";
  // Mobile: the fixed bottom nav (64px) and the site chat button (80-136px from the
  // bottom) sit over the page end, so keep clear space below the last action (pb-40).
  return (
    <div className="mx-auto w-full max-w-3xl px-3 pb-40 pt-6 sm:px-4 sm:pt-10 md:pb-10">
      <div
        data-testid="ccna-study-path"
        className="space-y-6 rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-5 text-slate-900 shadow-sm sm:p-8"
      >
        <header className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-700">
            {c.eyebrow}
          </p>
          <h1 className="text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
            {c.title}
          </h1>
          {!attempt?.result && (
            <p className="max-w-2xl text-base leading-7 text-slate-700 sm:text-lg">
              {c.intro}
            </p>
          )}
        </header>
        {error && (
          <div
            role="alert"
            className="space-y-3 rounded-2xl border border-rose-200 bg-rose-50 p-4"
          >
            <p className="text-sm font-medium leading-6 text-rose-900">{error}</p>
            {user && !busy && failed && (
              <div className="flex flex-wrap gap-3">
                <button className={ghost} onClick={retry}>
                  {c.retry}
                </button>
                {failed.conflict && attempt && (
                  <button className={ghost} onClick={() => setConfirmRestart(true)}>
                    {c.restart}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
        {confirmRestart && !busy && (
          <div
            role="alertdialog"
            aria-label={c.restartConfirm}
            className="space-y-3 rounded-2xl border border-amber-300 bg-amber-50 p-4"
          >
            <p className="text-sm font-medium leading-6 text-amber-950">
              {c.restartConfirm}
            </p>
            <div className="flex flex-wrap gap-3">
              <button className={primary} onClick={() => act("restart")}>
                {c.restartYes}
              </button>
              <button className={ghost} onClick={() => setConfirmRestart(false)}>
                {c.cancel}
              </button>
            </div>
          </div>
        )}
        {loading || busy ? (
          <p role="status" className="py-6 text-center text-base text-slate-600">
            {c.loading}
          </p>
        ) : !showBody ? null : !user ? (
          <div className="space-y-4">
            <ul className="space-y-3">
              {c.steps.map((t, i) => (
                <li key={t} className="flex items-start gap-3 text-base leading-6 text-slate-800">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <Link
              className="inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-6 py-3.5 text-base font-bold !text-white no-underline shadow-sm transition hover:bg-blue-700 hover:no-underline sm:w-auto"
              href={`/${lang}/login?redirect=${encodeURIComponent(`/${lang}/study-path/ccna`)}`}
            >
              {c.login}
            </Link>
            <p className="text-sm leading-6 text-slate-600">{c.loginHint}</p>
            <p className="text-xs leading-5 text-slate-500">{c.note}</p>
          </div>
        ) : !attempt ? (
          <div className="space-y-5">
            <ul className="space-y-3">
              {c.steps.map((t, i) => (
                <li key={t} className="flex items-start gap-3 text-base leading-6 text-slate-800">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <button className={`${primary} w-full sm:w-auto`} onClick={() => act("start")}>
              {c.start}
            </button>
            <p className="text-xs leading-5 text-slate-500">{c.note}</p>
          </div>
        ) : attempt.result ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{c.result}</h2>
              <p className="mt-1 text-base leading-7 text-slate-700">{c.resultIntro}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-end justify-between gap-4">
                <p
                  data-testid="score-percentage"
                  className="text-5xl font-extrabold leading-none text-blue-700"
                >
                  {attempt.result.percentage}%
                </p>
                <p data-testid="score-detail" className="pb-1 text-right text-sm font-medium text-slate-600">
                  {attempt.result.correct}/{attempt.result.total} {c.scoreCaption}
                </p>
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200" aria-hidden="true">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{ width: `${attempt.result.percentage}%` }}
                />
              </div>
            </div>
            {first && (
              <div className="rounded-2xl border border-blue-300 bg-blue-600 p-5 text-white shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-100">
                  {c.startHere}
                </p>
                <p className="mt-1 text-xl font-bold leading-snug text-white">{first.title}</p>
                {first.p ? (
                  <p className="mt-1 text-sm font-medium text-blue-100">
                    {c.coverageLabel}: {coverageText(first.p)}
                  </p>
                ) : (
                  <p className="mt-1 text-sm font-medium text-blue-100">
                    {correctText(first.correct, first.total)}
                  </p>
                )}
                <p className="mt-2 text-sm leading-6 text-blue-50">
                  {c.startHereText[first.key === "strong" ? "consolidate" : first.key]}
                </p>
                <Link
                  data-testid="train-start-here"
                  className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-white px-5 py-3 text-base font-bold !text-blue-700 no-underline shadow-sm transition hover:bg-blue-50 hover:no-underline focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 sm:w-auto"
                  href={trainHref(first.topicId)}
                >
                  {live ? c.continueNext : c.train}
                </Link>
              </div>
            )}
            {groups
              .filter((g) => g.list.length)
              .map((g) => (
                <section key={g.key} className="space-y-3" aria-label={g.title}>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{g.title}</h3>
                    {g.hint && <p className="text-sm leading-6 text-slate-600">{g.hint}</p>}
                  </div>
                  <ul className="space-y-3">
                    {g.list.map((t) => (
                      <li key={t.topicId} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <p className="text-base font-semibold leading-snug text-slate-900">{t.title}</p>
                          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${tones[g.tone].badge}`}>
                            {c.badge[g.key]}
                          </span>
                        </div>
                        {rowText(t)}
                        <div
                          {...(t.p
                            ? { role: "progressbar", "aria-label": c.coverageLabel, "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": barPct(t), "aria-valuetext": coverageText(t.p) }
                            : { "aria-hidden": true })}
                          className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200"
                        >
                          <div
                            className={`h-full rounded-full ${t.p ? "bg-slate-500" : tones[g.tone].bar}`}
                            style={{ width: `${barPct(t)}%` }}
                          />
                        </div>
                        {g.key !== "strong" && (
                          <Link
                            data-testid={`train-${g.key}`}
                            className={`mt-4 ${g.key === "weak" ? trainPrimary : trainGhost}`}
                            href={trainHref(t.topicId)}
                          >
                            {c.train}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            <div className="space-y-3 border-t border-slate-200 pt-5">
              <button className={ghost} onClick={() => setConfirmRestart(true)}>
                {c.restart}
              </button>
              <p className="text-sm leading-6 text-slate-600">{live ? c.progressNote : c.afterTrain}</p>
              <p className="text-sm leading-6 text-slate-600">
                {c.readiness}{" "}
                <Link className={linkBtn} href={`/${lang}/profile`}>
                  {c.profile}
                </Link>
              </p>
              <p className="text-xs leading-5 text-slate-500">{c.note}</p>
            </div>
          </div>
        ) : q ? (
          <section className="space-y-5" aria-label={fill(c.question, index + 1)}>
            {resumed && (
              <p className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium leading-6 text-emerald-900">
                {fill(c.resumed, index + 1)}
              </p>
            )}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-bold text-slate-900">{fill(c.question, index + 1)}</p>
                <p className="text-sm font-medium text-slate-600">
                  {Math.round(((index + 1) / 30) * 100)}%
                </p>
              </div>
              <div
                role="progressbar"
                aria-label={c.progress}
                aria-valuemin={1}
                aria-valuemax={30}
                aria-valuenow={index + 1}
                aria-valuetext={`${index + 1}/30`}
                className="h-3 overflow-hidden rounded-full bg-slate-200"
              >
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${((index + 1) / 30) * 100}%` }}
                />
              </div>
              <p className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800">
                {q.topic_title}
              </p>
            </div>
            <fieldset disabled={busy} className="min-w-0 space-y-4">
              <legend className="mb-4 whitespace-pre-wrap text-xl font-bold leading-snug text-slate-900 sm:text-2xl">
                {q.question}
              </legend>
              {q.exhibit?.content && (
                <pre
                  className="max-w-full overflow-auto rounded-2xl bg-slate-900 p-4 text-sm leading-6 text-slate-100"
                  aria-label={q.exhibit.title || "Exhibit"}
                >
                  {q.exhibit.content}
                </pre>
              )}
              <div className="space-y-3">
                {q.answers.map((a, i) => (
                  <label
                    key={a.id}
                    className="group flex cursor-pointer items-start gap-3 rounded-2xl border-2 border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-blue-200"
                  >
                    <input
                      type="radio"
                      className="sr-only"
                      name={`question-${q.id}`}
                      checked={selected === a.id}
                      onChange={() =>
                        setAnswers((prev) => [
                          ...prev.filter((x) => x.question_id !== q.id),
                          { question_id: q.id, answer_id: a.id },
                        ])
                      }
                    />
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700 group-has-[:checked]:bg-blue-600 group-has-[:checked]:text-white">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="whitespace-pre-wrap pt-0.5 text-base leading-6 text-slate-900">
                      {a.text}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button className={ghost} disabled={index === 0 || busy} onClick={() => setIndex(index - 1)}>
                {c.back}
              </button>
              <button
                className={primary}
                disabled={!selected || busy || (index === 29 && answers.length !== 30)}
                onClick={() => act(index === 29 ? "finish" : "progress")}
              >
                {index === 29 ? c.finish : c.next}
              </button>
            </div>
            <div className="space-y-1 text-sm leading-6">
              {(answers.length > 0 || !isSaved) && (
                <p className={isSaved ? "font-medium text-emerald-700" : "text-slate-600"}>
                  {isSaved ? `✓ ${c.saved}` : c.unsaved}
                </p>
              )}
              <p className="text-slate-600">{fill(c.answered, answers.length)}</p>
              {index === 29 && answers.length !== 30 && (
                <p className="font-medium text-amber-800">{fill(c.finishHint, 0)}</p>
              )}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
