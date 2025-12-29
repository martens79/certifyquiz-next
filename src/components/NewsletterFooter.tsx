// src/components/NewsletterFooter.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { langFromPathname, legalPath, type Locale } from "@/lib/i18n";

type Status = "idle" | "loading" | "ok" | "exists" | "error";

type Props = {
  className?: string;
};

export default function NewsletterFooter({ className }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const pathname = usePathname();
  const lang: Locale = langFromPathname(pathname);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const cleanEmail = email.trim();
    if (!cleanEmail) return;

    try {
      setStatus("loading");

      const res = await fetch("/api/backend/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        status?: string;
        error?: string;
      };

      if (res.ok) {
        setStatus(data?.status === "already" ? "exists" : "ok");
        if (data?.status !== "already") setEmail("");
      } else {
        setStatus(data?.status === "already" ? "exists" : "error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className={className} noValidate>
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={
            lang === "it"
              ? "La tua email"
              : lang === "fr"
              ? "Votre email"
              : lang === "es"
              ? "Tu correo electrónico"
              : "Your email"
          }
          className="min-w-0 flex-1 rounded-md border px-3 py-2 text-sm outline-none dark:bg-neutral-900"
          aria-label="Email"
          disabled={status === "loading"}
        />

        {/* Honeypot anti-spam */}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />

        <button
          type="submit"
          disabled={status === "loading"}
          aria-busy={status === "loading"}
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {status === "loading"
            ? lang === "it"
              ? "Invio..."
              : "Sending..."
            : lang === "it"
            ? "Iscriviti"
            : "Subscribe"}
        </button>
      </div>

      <p className="mt-2 text-xs text-gray-600 dark:text-neutral-400">
        {lang === "it" ? "Iscrivendoti accetti la nostra " : "By subscribing you accept our "}
        <Link href={legalPath(lang, "privacy")} className="underline">
          Privacy Policy
        </Link>
        .
      </p>

      {status === "ok" && (
        <p className="mt-2 text-sm text-green-600">
          🎉 {lang === "it" ? "Iscrizione completata!" : "Subscription completed!"}
        </p>
      )}

      {status === "exists" && (
        <p className="mt-2 text-sm text-amber-600">
          {lang === "it"
            ? "Sei già iscritto con questa email."
            : "You are already subscribed with this email."}
        </p>
      )}

      {status === "error" && (
        <p className="mt-2 text-sm text-red-600">
          {lang === "it"
            ? "Errore nell’iscrizione. Riprova."
            : "Subscription error. Please try again."}
        </p>
      )}
    </form>
  );
}
