// src/components/NewsletterFooter.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { langFromPathname, legalPath, type Locale } from "@/lib/i18n";

type Props = {
  className?: string;
};

export default function NewsletterFooter({ className }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "exists" | "error">("idle");

  // lingua corrente dal pathname (it/en/fr/es)
  const pathname = usePathname();
  const lang: Locale = langFromPathname(pathname);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;

    try {
      setStatus("loading");
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        const data = (await res.json().catch(() => ({}))) as { status?: string };
        setStatus(data?.status === "already" ? "exists" : "ok");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className={className}>
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="La tua email"
          className="min-w-0 flex-1 rounded-md border px-3 py-2 text-sm outline-none dark:bg-neutral-900"
          aria-label="Email"
        />
        {/* honeypot */}
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
          {status === "loading" ? "Invio..." : "Iscriviti"}
        </button>
      </div>

      <p className="mt-2 text-xs text-gray-600 dark:text-neutral-400">
        Iscrivendoti accetti la nostra{" "}
        <Link href={legalPath(lang, "privacy")} className="underline">
          Privacy Policy
        </Link>
        .
      </p>

      {status === "ok" && (
        <p className="mt-2 text-sm text-green-600">🎉 Iscrizione completata!</p>
      )}
      {status === "exists" && (
        <p className="mt-2 text-sm text-amber-600">Sei già iscritto con questa email.</p>
      )}
      {status === "error" && (
        <p className="mt-2 text-sm text-red-600">Errore nell’iscrizione. Riprova.</p>
      )}
    </form>
  );
}
