// src/components/newsletter/FreeTestForm.tsx

"use client";

import { useState } from "react";
import Link from "next/link";

type Lang = "it" | "en" | "fr" | "es";

type Props = {
  lang?: Lang;
  cert?: string;
  topic?: string;
  source?: string;
  quizHref?: string;
};

const COPY: Record<
  Lang,
  {
    emailLabel: string;
    placeholder: string;
    button: string;
    loading: string;
    fallbackError: string;
  }
> = {
  it: {
    emailLabel: "Indirizzo email",
    placeholder: "tu@email.com",
    button: "Inizia il test gratuito",
    loading: "Invio...",
    fallbackError: "Qualcosa è andato storto. Riprova tra poco.",
  },
  en: {
    emailLabel: "Email address",
    placeholder: "you@example.com",
    button: "Start free test",
    loading: "Sending...",
    fallbackError: "Something went wrong. Please try again.",
  },
  fr: {
    emailLabel: "Adresse email",
    placeholder: "vous@email.com",
    button: "Faire le test gratuit",
    loading: "Envoi...",
    fallbackError: "Une erreur s’est produite. Réessayez dans un instant.",
  },
  es: {
    emailLabel: "Correo electrónico",
    placeholder: "tu@email.com",
    button: "Empezar el test gratuito",
    loading: "Enviando...",
    fallbackError: "Algo salió mal. Inténtalo de nuevo.",
  },
};

export default function FreeTestForm({
  lang = "en",
  cert = "general",
  topic = "general",
  source = "free-test",
  quizHref = "",
}: Props) {
  const safeLang: Lang = COPY[lang] ? lang : "en";
  const t = COPY[safeLang];

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setStatus("loading");
    setMessage("");

    try {
      const enrichedSource = `${source}|cert:${cert}|topic:${topic}`;

      const res = await fetch("/api/backend/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          lang: safeLang,
          gdprConsent: true,
          source: enrichedSource,
          quizHref: quizHref,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        throw new Error(data?.message || t.fallbackError);
      }

      setStatus("ok");
      setMessage(data.message);
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : t.fallbackError);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <div>
        <label
          htmlFor="free-test-email"
          className="block text-sm font-semibold text-slate-800 mb-2"
        >
          {t.emailLabel}
        </label>

        <input
          id="free-test-email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.placeholder}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? t.loading : t.button}
      </button>

      {message && (
        <p
          className={`text-sm font-medium ${
            status === "ok" ? "text-green-700" : "text-red-700"
          }`}
        >
          {message}
        </p>
      )}
      {status === "ok" && quizHref && (
  <Link
    href={quizHref}
    className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-yellow-400 px-5 py-3 text-sm font-bold text-slate-900 shadow-sm hover:bg-yellow-300"
  >
    Start quiz now 🚀
  </Link>
)}
    </form>
  );
}