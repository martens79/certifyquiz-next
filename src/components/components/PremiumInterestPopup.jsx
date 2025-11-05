// ✅ src/components/PremiumInterestPopup.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getLabel } from "../utils/langUtils";
import { api } from "../services/api";
import { useLocation } from "react-router-dom";

const getLangFromPath = (pathname) => {
  const m = pathname.match(/^\/(it|en|fr|es)(\/|$)/i);
  return m ? m[1].toLowerCase() : "it";
};

export default function PremiumInterestPopup() {
  const { isLoggedIn, user } = useAuth();
  const { pathname } = useLocation();
  const lang = getLangFromPath(pathname);

  const [showPopup, setShowPopup] = useState(false);
  const [responseSent, setResponseSent] = useState(false);
  const [answer, setAnswer] = useState(null); // "si" | "no" | "piu_info"
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem("premiumPopupShown");
    if (!alreadyShown && isLoggedIn) {
      setShowPopup(true);
      sessionStorage.setItem("premiumPopupShown", "true");
    }
  }, [isLoggedIn]);

  // Chiudi con ESC
  useEffect(() => {
    if (!showPopup) return;
    const onKey = (e) => e.key === "Escape" && setShowPopup(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showPopup]);

  async function handleSubmit() {
    if (!answer || sending) return;
    try {
      setSending(true);
      await api.post("/premium-interest", {
        answer,
        email: (email || user?.email || "").trim() || null,
        feedback: feedback?.trim() || null,
        userId: user?.id || null,
        lang,
      });
      setResponseSent(true); // nasconde il popup dopo invio
    } catch (err) {
      console.error("❌ Errore invio interesse:", err?.response?.data || err);
      alert(getLabel({ it: "Errore durante l'invio, riprova.", en: "Submit failed, please try again." }));
    } finally {
      setSending(false);
    }
  }

  if (!isLoggedIn || !showPopup || responseSent) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full space-y-4">
        <h2 className="text-xl font-bold text-gray-800 text-center">
          {getLabel({
            it: "Versione Premium – Offerta limitata",
            en: "Premium Version – Limited Offer",
            fr: "Version Premium – Offre limitée",
            es: "Versión Premium – Oferta limitada",
          })}
        </h2>

        <p className="text-sm text-gray-700 text-center">
          {getLabel({
            it: "Il sito è gratuito per un periodo di test. Tra poco le risposte dettagliate e alcuni quiz diventeranno a pagamento. Se sei interessato alla versione Premium, solo per poco tempo potrai avere uno sconto del 50% sul primo mese.",
            en: "The site is free for a testing period. Soon, detailed answers and some quizzes will require payment. If you're interested in Premium, you can get 50% off your first month for a limited time.",
            fr: "Le site est gratuit pendant une période d'essai. Bientôt, les réponses détaillées et certains quiz seront payants. Si vous êtes intéressé par la version Premium, profitez de 50 % de réduction sur le premier mois (offre limitée).",
            es: "El sitio es gratuito por un periodo de prueba. Pronto, las respuestas detalladas y algunos cuestionarios serán de pago. Si te interesa Premium, tendrás un 50 % de descuento el primer mes por tiempo limitado.",
          })}
        </p>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {getLabel({
              it: "Seleziona una risposta:",
              en: "Select an answer:",
              fr: "Choisissez une réponse :",
              es: "Selecciona una respuesta:",
            })}
          </label>
          <div className="flex gap-3 flex-wrap justify-center">
            {["si", "no", "piu_info"].map((opt) => (
              <button
                key={opt}
                onClick={() => setAnswer(opt)}
                className={`px-3 py-1 rounded-full text-sm ${
                  answer === opt ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
                }`}
              >
                {{
                  si: getLabel({
                    it: "Sì, mi interessa",
                    en: "Yes, I'm interested",
                    fr: "Oui, ça m'intéresse",
                    es: "Sí, me interesa",
                  }),
                  no: getLabel({
                    it: "No, grazie",
                    en: "No, thanks",
                    fr: "Non, merci",
                    es: "No, gracias",
                  }),
                  piu_info: getLabel({
                    it: "Voglio più informazioni",
                    en: "I want more info",
                    fr: "Je veux plus d'infos",
                    es: "Quiero más información",
                  }),
                }[opt]}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm text-gray-700">
            {getLabel({
              it: "Email (opzionale):",
              en: "Email (optional):",
              fr: "Email (facultatif) :",
              es: "Correo electrónico (opcional):",
            })}
          </label>
          <input
            type="email"
            className="w-full border rounded px-2 py-1 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={user?.email || "you@example.com"}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-gray-700">
            {getLabel({
              it: "Hai un suggerimento o feedback?",
              en: "Any suggestions or feedback?",
              fr: "Des suggestions ou remarques ?",
              es: "¿Alguna sugerencia o comentario?",
            })}
          </label>
          <textarea
            className="w-full border rounded px-2 py-1 text-sm"
            rows={2}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </div>

        <div className="flex justify-between items-center mt-3">
          <button
            onClick={handleSubmit}
            disabled={!answer || sending}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {sending
              ? getLabel({ it: "Invio...", en: "Submitting..." })
              : getLabel({ it: "Invia", en: "Submit", fr: "Envoyer", es: "Enviar" })}
          </button>
          <button
            onClick={() => setShowPopup(false)}
            className="text-xs text-gray-500 hover:underline"
          >
            {getLabel({ it: "Chiudi", en: "Close", fr: "Fermer", es: "Cerrar" })}
          </button>
        </div>
      </div>
    </div>
  );
}
