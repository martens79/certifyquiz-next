"use client";

// Landing-only status block of EIPASS Standard (coming soon) and the contextual pointer shown on the
// Italian EIPASS 7 Moduli User landing. Only links that really exist: the official EIPASS page, the
// EIPASS 7 Moduli User landing, and the Standard landing. No form, no email capture, no quiz.
// GA4 goes through trackEvent, which already honours the analytics consent and the privacy scrubbing.

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import {
  EIPASS_STANDARD_COMING_SOON_LABEL,
  EIPASS_STANDARD_LANDING_PATH,
  EIPASS_STANDARD_LINK_EVENT,
  EIPASS_STANDARD_OFFICIAL_URL,
  EIPASS_USER_LANDING_PATH,
} from "@/lib/eipass-standard";

const linkClass = "font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-900";

export function EipassStandardComingSoonPanel() {
  const track = (link: "official_eipass_standard" | "eipass_user_landing") =>
    trackEvent(EIPASS_STANDARD_LINK_EVENT, { link_target: link, source_page: "eipass_standard_coming_soon" });

  return (
    <section
      aria-labelledby="eipass-standard-coming-soon"
      className="mx-auto mt-4 max-w-5xl rounded-xl border border-amber-300 bg-amber-50 p-5 text-amber-950"
    >
      <h2 id="eipass-standard-coming-soon" className="text-lg font-bold">
        {EIPASS_STANDARD_COMING_SOON_LABEL}
      </h2>
      <p className="mt-2 text-sm leading-6">
        Stiamo preparando i quiz di allenamento per EIPASS Standard. Per ora questa pagina è solo informativa: non sono
        ancora disponibili quiz, simulazioni, ripassi né pagine per singolo modulo. CertifyQuiz offre preparazione
        indipendente e non rilascia la certificazione.
      </p>
      <ul className="mt-3 space-y-1 text-sm">
        <li>
          <a
            href={EIPASS_STANDARD_OFFICIAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
            onClick={() => track("official_eipass_standard")}
          >
            Pagina ufficiale di EIPASS Standard
          </a>{" "}
          (sito dell&apos;ente certificatore)
        </li>
        <li>
          <Link href={EIPASS_USER_LANDING_PATH} className={linkClass} onClick={() => track("eipass_user_landing")}>
            EIPASS 7 Moduli User
          </Link>{" "}
          — un percorso distinto, con programma ed esami propri, già presente su CertifyQuiz
        </li>
      </ul>
    </section>
  );
}

/** Contextual pointer on the Italian EIPASS 7 Moduli User landing: "In preparazione". */
export function EipassStandardPointer() {
  return (
    <p className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800">
      <span className="mr-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900">In preparazione</span>
      <Link
        href={EIPASS_STANDARD_LANDING_PATH}
        className={linkClass}
        onClick={() =>
          trackEvent(EIPASS_STANDARD_LINK_EVENT, { link_target: "standard_coming_soon", source_page: "eipass_user_landing" })
        }
      >
        EIPASS Standard (DigComp 2.2)
      </Link>{" "}
      è un percorso distinto da EIPASS 7 Moduli User. Per ora è disponibile solo la pagina informativa.
    </p>
  );
}
