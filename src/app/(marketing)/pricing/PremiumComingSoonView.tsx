"use client";

import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

type Lang = "it" | "es" | "en" | "fr";

function getLangFromPathname(pathname: string): Lang {
  const seg = (pathname.split("/")[1] || "it").toLowerCase();
  if (seg === "it" || seg === "es" || seg === "en" || seg === "fr") return seg as Lang;
  return "it";
}

const COPY: Record<Lang, any> = {
  it: {
    badge: "Coming soon",
    title: "Premium in arrivo",
    subtitle:
      "Stiamo preparando un Premium pensato per chi vuole una preparazione più seria e orientata all’esame.",
    priceLine: "Prezzo previsto: 9,99€/mese",
    cta: "Iscriviti alla lista prioritaria",
    emailPlaceholder: "La tua email",
    consent: "Ti invieremo una sola email quando Premium sarà disponibile (niente spam).",
    successTitle: "Sei dentro ✅",
    successBody: "Perfetto. Ti avviseremo appena Premium sarà disponibile.",
    errorGeneric: "Qualcosa non va. Riprova tra poco.",
    invalidEmail: "Inserisci una email valida.",
    featuresTitle: "Cosa includerà Premium",
    features: [
      { h: "Ripasso errori avanzato", p: "Quiz mirati sulle domande sbagliate e sui punti deboli." },
      { h: "Report personalizzati", p: "Analisi dei pattern di errore e consigli di studio." },
      { h: "EXAM+ long scenario (in futuro)", p: "Simulazioni lunghe e realistiche stile esame." },
      { h: "Accesso anticipato ai contenuti", p: "Nuovi quiz e aggiornamenti disponibili prima." },
    ],
  },
  es: {
    badge: "Próximamente",
    title: "Premium próximamente",
    subtitle:
      "Estamos preparando un plan Premium para quien quiere una preparación más seria y orientada al examen.",
    priceLine: "Precio previsto: 9,99€/mes",
    cta: "Únete a la lista prioritaria",
    emailPlaceholder: "Tu email",
    consent: "Recibirás un solo email cuando Premium esté disponible (sin spam).",
    successTitle: "Listo ✅",
    successBody: "Perfecto. Te avisaremos cuando Premium esté disponible.",
    errorGeneric: "Algo salió mal. Inténtalo de nuevo.",
    invalidEmail: "Introduce un email válido.",
    featuresTitle: "Qué incluirá Premium",
    features: [
      { h: "Repaso avanzado de errores", p: "Quizzes enfocados en tus fallos y puntos débiles." },
      { h: "Reportes personalizados", p: "Patrones de error + consejos de estudio." },
      { h: "EXAM+ long scenario (futuro)", p: "Simulaciones largas estilo examen." },
      { h: "Acceso anticipado", p: "Nuevo contenido y mejoras antes que nadie." },
    ],
  },
  en: {
    badge: "Coming soon",
    title: "Premium coming soon",
    subtitle: "A Premium plan built for serious, exam-focused practice is coming.",
    priceLine: "Planned price: €9.99/month",
    cta: "Join the priority list",
    emailPlaceholder: "Your email",
    consent: "You’ll receive one email when Premium goes live (no spam).",
    successTitle: "You’re in ✅",
    successBody: "We’ll notify you when Premium is available.",
    errorGeneric: "Something went wrong. Try again.",
    invalidEmail: "Please enter a valid email.",
    featuresTitle: "What Premium will include",
    features: [
      { h: "Advanced error review", p: "Targeted quizzes based on your weak areas." },
      { h: "Personalized reports", p: "Error patterns + focused study suggestions." },
      { h: "EXAM+ long scenarios (future)", p: "Long, realistic exam-style simulations." },
      { h: "Early access", p: "New content and updates before everyone else." },
    ],
  },
  fr: {
    badge: "Bientôt",
    title: "Premium bientôt disponible",
    subtitle: "Un plan Premium orienté examen arrive.",
    priceLine: "Prix prévu : 9,99€/mois",
    cta: "Rejoindre la liste prioritaire",
    emailPlaceholder: "Votre email",
    consent: "Un seul email au lancement (pas de spam).",
    successTitle: "C’est bon ✅",
    successBody: "On te prévient dès que Premium est disponible.",
    errorGeneric: "Une erreur est survenue. Réessaie.",
    invalidEmail: "Entre un email valide.",
    featuresTitle: "Ce que Premium inclura",
    features: [
      { h: "Révision avancée des erreurs", p: "Quiz ciblés sur tes points faibles." },
      { h: "Rapports personnalisés", p: "Patterns d’erreurs + recommandations." },
      { h: "EXAM+ long scenario (futur)", p: "Simulations longues style examen." },
      { h: "Accès anticipé", p: "Nouveaux contenus avant tout le monde." },
    ],
  },
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function FeatureCard({
  title,
  desc,
  variant,
}: {
  title: string;
  desc: string;
  variant: "blue" | "purple" | "green" | "amber";
}) {
  const variantClass =
    variant === "blue"
      ? "border-blue-200 bg-gradient-to-br from-blue-50 to-white"
      : variant === "purple"
      ? "border-purple-200 bg-gradient-to-br from-purple-50 to-white"
      : variant === "green"
      ? "border-emerald-200 bg-gradient-to-br from-emerald-50 to-white"
      : "border-amber-200 bg-gradient-to-br from-amber-50 to-white";

  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${variantClass}`}>
      <div className="text-base font-semibold">{title}</div>
      <div className="mt-1 text-sm text-gray-700">{desc}</div>
    </div>
  );
}

export default function PremiumComingSoonView() {
  const pathname = usePathname();
  const lang = useMemo(() => getLangFromPathname(pathname), [pathname]);
  const t = COPY[lang] || COPY.it;

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    const clean = email.trim().toLowerCase();
    if (!isValidEmail(clean)) {
      setStatus("error");
      setErrorMsg(t.invalidEmail);
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/backend/premium-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: clean, source: "coming_soon", lang }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json().catch(() => null);
      if (!data?.ok) throw new Error("not ok");

      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg(t.errorGeneric);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="rounded-3xl border bg-white shadow-sm overflow-hidden">
        <div className="border-b bg-gradient-to-b from-gray-50 to-white px-6 py-6">
          <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs text-gray-700">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            {t.badge}
          </div>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight">{t.title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-700">{t.subtitle}</p>
          <p className="mt-2 text-sm font-medium">{t.priceLine}</p>
        </div>

        <div className="grid gap-6 px-6 py-6 lg:grid-cols-2">
          {/* LEFT: form */}
          <div className="rounded-2xl border p-6">
            <div className="text-sm text-gray-700">{t.consent}</div>

            {status !== "success" ? (
              <form onSubmit={onSubmit} className="mt-4 space-y-3">
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2"
                    type="email"
                    autoComplete="email"
                  />
                  <button
                    disabled={status === "loading"}
                    className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
                    type="submit"
                  >
                    {status === "loading" ? "..." : t.cta}
                  </button>
                </div>

                {status === "error" && <div className="text-sm text-red-600">{errorMsg}</div>}
              </form>
            ) : (
              <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="font-semibold">{t.successTitle}</div>
                <div className="mt-1 text-sm text-gray-700">{t.successBody}</div>
              </div>
            )}

            <div className="mt-6 text-xs text-gray-500">
              Prossimo step (Settimana 2): box nei risultati quiz con <code>source="quiz_results"</code>.
            </div>
          </div>

          {/* RIGHT: features */}
          <div>
            <div className="mb-3 text-lg font-semibold">{t.featuresTitle}</div>

            <div className="grid gap-3 sm:grid-cols-2">
              <FeatureCard title={t.features[0].h} desc={t.features[0].p} variant="blue" />
              <FeatureCard title={t.features[1].h} desc={t.features[1].p} variant="purple" />
              <FeatureCard title={t.features[2].h} desc={t.features[2].p} variant="amber" />
              <FeatureCard title={t.features[3].h} desc={t.features[3].p} variant="green" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}