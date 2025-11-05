// src/components/NewsletterForm.jsx
import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function NewsletterForm({ className = "" }) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [hp, setHp] = useState(""); // honeypot
  const [isSubscribed, setIsSubscribed] = useState(
    typeof window !== "undefined" && localStorage.getItem("newsletter_subscribed") === "true"
  );

  // se già iscritto in passato, non mostrare il form
  useEffect(() => {
    const onStorage = () =>
      setIsSubscribed(localStorage.getItem("newsletter_subscribed") === "true");
    window.addEventListener("storage", onStorage);
    window.addEventListener("newsletter-subscribed", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("newsletter-subscribed", onStorage);
    };
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!consent) return; // blocca senza consenso
    if (hp) return;       // honeypot pieno => bot

    setStatus("loading");
    try {
      await api.post("/newsletter/subscribe", { email }); // baseURL = "/api"

      // ✅ flag persistente + evento per la navbar
      localStorage.setItem("newsletter_subscribed", "true");
      window.dispatchEvent(new Event("newsletter-subscribed"));

      setStatus("success");
      setEmail("");
      setConsent(false);

      // ⏳ dopo 2 secondi, nascondi completamente il componente
      setTimeout(() => setIsSubscribed(true), 2000);
    } catch (err) {
      setStatus("error");
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Errore di rete";
      console.error("newsletter subscribe error:", msg);
    }
  };

  // 🔥 se già iscritto in passato → non renderizzare nulla
  if (isSubscribed) return null;

  return (
    <div className={`bg-white rounded-2xl shadow p-6 ${className}`}>
      <h3 className="text-xl font-semibold mb-2">Iscriviti alla newsletter</h3>
      <p className="text-sm text-neutral-600 mb-4">
        Ricevi aggiornamenti su nuove certificazioni, quiz e articoli.
      </p>

      <form onSubmit={onSubmit} className="space-y-3">
        {/* Honeypot nascosto per bot */}
        <input
          type="text"
          value={hp}
          onChange={(e) => setHp(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            required
            placeholder="La tua email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
          <button
            type="submit"
            disabled={status === "loading" || !consent}
            className="rounded-lg bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition disabled:opacity-60"
          >
            {status === "loading" ? "Invio…" : "Iscriviti"}
          </button>
        </div>

        <label className="flex items-start gap-2 text-sm text-neutral-600">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 rounded border-gray-300"
            required
          />
          Accetto il trattamento dei dati secondo la{" "}
          <a href="/privacy" className="underline hover:no-underline" target="_self" rel="noreferrer">
            Privacy Policy
          </a>.
        </label>

        {status === "success" && (
          <p className="text-green-600 text-sm">Iscrizione completata. Controlla la tua email 📬</p>
        )}
        {status === "error" && (
          <p className="text-red-600 text-sm">Errore durante l’iscrizione. Riprova più tardi.</p>
        )}
      </form>
    </div>
  );
}
