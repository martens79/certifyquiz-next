// The seven EIPASS Standard modules of the Italian landing, each "Prossimamente" with a DISABLED button.
//
// Purely presentational and server-renderable: no link, no handler, no form, no navigation. A disabled <button>
// cannot start anything, so no attempt, session or request can be created from here, and no module has a page
// that could answer 404. Titles, order and DigComp areas come from EIPASS_STANDARD_MODULES (programma rev. 02/2024);
// the topic/activity lists of the programme are not reproduced.

import {
  EIPASS_STANDARD_MODULES,
  EIPASS_STANDARD_MODULES_HEADING,
  EIPASS_STANDARD_MODULE_BUTTON_LABEL,
  EIPASS_STANDARD_MODULE_SOON_LABEL,
} from "@/lib/eipass-standard";

export default function EipassStandardModules() {
  return (
    <section aria-labelledby="eipass-standard-modules" className="rounded-xl bg-blue-100 p-4 shadow">
      <h2 id="eipass-standard-modules" className="mb-1 text-lg font-semibold text-blue-800">
        {EIPASS_STANDARD_MODULES_HEADING}
      </h2>
      <p className="mb-3 text-sm text-gray-700">
        Titoli e ordine seguono il programma ufficiale (rev. 02/2024). Per ora nessun modulo ha esercitazioni
        disponibili: lo segnaleremo qui, modulo per modulo.
      </p>
      <ol className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {EIPASS_STANDARD_MODULES.map((m) => (
          <li
            key={m.number}
            data-module={m.number}
            data-status={m.status}
            className="flex flex-col justify-between rounded-lg border border-blue-200 bg-white p-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Modulo {m.number}</p>
                <h3 className="text-base font-semibold text-slate-900">{m.title}</h3>
                <p className="mt-0.5 text-xs text-slate-600">Area DigComp 2.2: {m.digcompArea.name}</p>
              </div>
              <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900">
                {EIPASS_STANDARD_MODULE_SOON_LABEL}
              </span>
            </div>
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="mt-3 w-full cursor-not-allowed rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-500 sm:w-auto"
            >
              {EIPASS_STANDARD_MODULE_BUTTON_LABEL}
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}
