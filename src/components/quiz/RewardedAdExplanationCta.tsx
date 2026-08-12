// src/components/quiz/RewardedAdExplanationCta.tsx
//
// Sblocco della spiegazione via rewarded ad, per gli utenti Free del Gruppo
// B che hanno esaurito le spiegazioni gratuite. Renderizza null a meno che
// il backend non risponda eligible:true (REWARDED_ADS_ENABLED=true, utente
// in "treatment", cap non raggiunti): per il 100% del traffico oggi
// (feature disattivata) questo componente è invisibile, esattamente come il
// placeholder vuoto che sostituisce.
//
// La CTA "Guarda un annuncio" è l'unica azione con peso visivo pieno.
// Octopus/Dolphin sono link testuali secondari; Premium resta il link già
// renderizzato dal chiamante sopra questo componente (non duplicato qui).

"use client";

import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import {
  fetchRewardedAdsState,
  createRewardIntent,
  markAdStarted,
  markAdCompleted,
  markAdFailed,
  consumeRewardGrant,
  type RewardedAdsState,
} from "@/lib/rewarded-ads";
import type { Locale } from "@/lib/paths";

type Props = {
  lang: Locale;
  certificationId: number | null;
  certificationSlug: string | null;
  questionId: number;
  sessionId?: string | null;
  onUnlocked: () => void;
};

const CERT_PATH_PREFIX: Record<Locale, string> = {
  it: "/it/certificazioni",
  fr: "/fr/certifications",
  es: "/es/certificaciones",
  en: "/certifications",
};

const TEXT = {
  it: {
    primary: "Guarda un annuncio e sblocca questa spiegazione",
    watching: "Annuncio in corso (test)…",
    failed: "Annuncio non disponibile, riprova più tardi.",
    octopus: "Oppure sblocca tutto con Octopus Complete",
    dolphin: "Oppure sblocca la teoria con Dolphin Study",
  },
  en: {
    primary: "Watch an ad to unlock this explanation",
    watching: "Ad playing (test)…",
    failed: "Ad unavailable, try again later.",
    octopus: "Or unlock everything with Octopus Complete",
    dolphin: "Or unlock the theory with Dolphin Study",
  },
  fr: {
    primary: "Regardez une pub pour débloquer cette explication",
    watching: "Publicité en cours (test)…",
    failed: "Publicité indisponible, réessayez plus tard.",
    octopus: "Ou débloquez tout avec Octopus Complete",
    dolphin: "Ou débloquez la théorie avec Dolphin Study",
  },
  es: {
    primary: "Mira un anuncio para desbloquear esta explicación",
    watching: "Anuncio en curso (test)…",
    failed: "Anuncio no disponible, inténtalo más tarde.",
    octopus: "O desbloquea todo con Octopus Complete",
    dolphin: "O desbloquea la teoría con Dolphin Study",
  },
} as const;

export default function RewardedAdExplanationCta({
  lang,
  certificationId,
  certificationSlug,
  questionId,
  sessionId,
  onUnlocked,
}: Props) {
  const t = TEXT[lang] ?? TEXT.en;
  const [state, setState] = useState<RewardedAdsState | null>(null);
  const [phase, setPhase] = useState<"idle" | "loading" | "watching" | "failed">("idle");
  const viewedRef = useRef(false);

  useEffect(() => {
    let alive = true;
    fetchRewardedAdsState(certificationId).then((s) => {
      if (alive) setState(s);
    });
    return () => {
      alive = false;
    };
  }, [certificationId]);

  useEffect(() => {
    if (state?.eligible && !viewedRef.current) {
      viewedRef.current = true;
      trackEvent("reward_offer_viewed", {
        certification_id: certificationId,
        question_id: questionId,
        experiment_variant: state.variant,
        product_type: "rewarded_ad",
      });
    }
  }, [state, certificationId, questionId]);

  if (!certificationId || !state?.eligible) return null;

  const eventParams = {
    certification_id: certificationId,
    question_id: questionId,
    experiment_variant: state.variant,
    product_type: "rewarded_ad",
  };

  const watchAd = async () => {
    setPhase("loading");
    let intentId: string | null = null;
    try {
      const intent = await createRewardIntent({
        certificationId,
        questionId,
        sessionId,
        placement: "locked_wrong_explanation",
      });
      intentId = intent.intentId;
      await markAdStarted(intent.intentId);
      trackEvent("reward_ad_started", eventParams);
      setPhase("watching");

      // Nessun provider pubblicitario reale collegato ancora (Google Ad Manager
      // + GPT restano da approvare). Questa attesa simula il rewarded slot e
      // verrà sostituita 1:1 dal callback "rewardedSlotGranted" di GPT quando
      // il provider verrà attivato: il resto del flusso (ad-completed -> grant
      // -> consume) non cambierà.
      await new Promise((resolve) => setTimeout(resolve, 2500));

      const completion = await markAdCompleted(intent.intentId, { simulated: true });
      trackEvent("reward_ad_completed", eventParams);
      trackEvent("reward_granted", eventParams);

      await consumeRewardGrant(completion.grantId, questionId);
      trackEvent("reward_consumed", eventParams);
      trackEvent("explanation_unlocked_by_ad", eventParams);

      setPhase("idle");
      onUnlocked();
    } catch (err) {
      setPhase("failed");
      if (intentId) await markAdFailed(intentId, "client_error");
      trackEvent("reward_ad_failed", { ...eventParams, reason: err instanceof Error ? err.message : "unknown" });
    }
  };

  const certPrefix = CERT_PATH_PREFIX[lang] ?? CERT_PATH_PREFIX.en;
  const certUrl = certificationSlug ? `${certPrefix}/${certificationSlug}#package-title` : null;

  return (
    <div className="mt-3 rounded-xl border border-amber-300/40 bg-amber-500/10 p-3">
      <button
        type="button"
        onClick={watchAd}
        disabled={phase === "loading" || phase === "watching"}
        className="w-full rounded-lg bg-amber-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-amber-300 disabled:opacity-60"
      >
        {phase === "watching" ? t.watching : t.primary}
      </button>
      {phase === "failed" ? <p className="mt-2 text-xs text-red-200">{t.failed}</p> : null}
      {certUrl ? (
        <div className="mt-2 flex flex-col gap-1 text-xs text-white/70">
          <a
            href={certUrl}
            onClick={() => trackEvent("octopus_clicked", { ...eventParams, product_type: "octopus_complete" })}
            className="underline"
          >
            {t.octopus}
          </a>
          <a
            href={certUrl}
            onClick={() => trackEvent("dolphin_clicked", { ...eventParams, product_type: "dolphin_study" })}
            className="underline"
          >
            {t.dolphin}
          </a>
        </div>
      ) : null}
    </div>
  );
}
