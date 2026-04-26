"use client";

import { useState } from "react";

export default function LeadMagnetBox({ lang }: { lang: string }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const texts =
    lang === "it"
      ? {
          title: "Scopri il tuo livello",
          body: "Fai il test gratuito e ricevi il risultato direttamente via email.",
          cta: "Inizia il test gratuito",
          success: "Controlla la tua email 👇",
        }
      : lang === "es"
        ? {
            title: "Descubre tu nivel",
            body: "Haz el test gratuito y recibe el resultado por email.",
            cta: "Empieza el test gratis",
            success: "Revisa tu email 👇",
          }
        : lang === "fr"
          ? {
              title: "Découvre ton niveau",
              body: "Fais le test gratuit et reçois le résultat par email.",
              cta: "Commencer le test",
              success: "Vérifie ton email 👇",
            }
          : {
              title: "Discover your level",
              body: "Take the free test and get your result by email.",
              cta: "Start free test",
              success: "Check your email 👇",
            };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch("/api/newsletter", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });

      setDone(true);

      // 👉 redirect dopo 1 secondo
      setTimeout(() => {
        window.location.href = "/free-test";
      }, 1000);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="my-10 rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
      <h3 className="text-xl font-bold text-blue-900">{texts.title}</h3>
      <p className="mt-2 text-blue-800">{texts.body}</p>

      {done ? (
        <p className="mt-4 font-semibold text-green-600">{texts.success}</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 md:flex-row">
          <input
            type="email"
            required
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded-xl border px-4 py-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
          >
            {loading ? "..." : texts.cta}
          </button>
        </form>
      )}
    </div>
  );
}