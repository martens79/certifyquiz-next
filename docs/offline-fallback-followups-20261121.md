# Offline fallback: note e problemi fuori ambito (21/11/2026)

Documento separato dalla correzione di `public/sw.js` / `public/offline.html`.
Nulla qui è stato modificato. La causa del problema segnalato da un'utente (pagina
"You're offline" e `api.certifyquiz.com` nella barra) **non è accertata**: la correzione
migliora solo il comportamento *dopo* un fallimento di rete, non lo previene.

## Fuori ambito (richiedono decisione)
1. **Google OAuth con link diretto al dominio API** — `src/app/[lang]/login/login-client.tsx:57`
   e `src/components/quiz/RegistrationGate.tsx:89` navigano (top-level) a
   `https://api.certifyquiz.com/api/auth/google`. Se quel dominio non è raggiungibile Chrome
   mostra il suo errore nativo, **non** `offline.html` (il SW controlla solo l'origine del frontend).
2. **Testo fisso in italiano** nella callback OAuth: "Sto completando il login…"
   (`src/app/auth/callback/page.tsx`, `CallbackClient.tsx`), visibile anche a utenti ES/FR/EN.
3. **Recovery post-OAuth**: `buildPostAuthRecoveryHref` (`src/lib/conversion-context.ts`) porta a
   `/login` (EN) se il redirect non ha prefisso lingua. Non spiega un login italiano per un utente ES:
   serve l'URL esatto dello screenshot.
4. **Script `test:unit`**: il glob è `tests/*.test.tsx`, quindi i file `*.test.ts` non vengono eseguiti
   da `npm run test:unit`.
5. **`blog-audio.test.tsx`** richiede un browser Playwright installato (fallisce in ambienti senza).

## Osservazioni tecniche
- Chrome invia già **due richieste quasi simultanee** per una navigazione controllata da un SW
  (misurato con il vecchio v4, quindi non causato dal retry). Il retry del v5 aggiunge un solo tentativo
  distinto, ~350 ms dopo, solo per navigazioni e solo se il primo errore è rapido (<= 3 s) e il browser
  risulta online.
- Il SW non mette in cache le pagine (solo `offline.html`): il vecchio testo "Previously visited pages
  may still be available" era falso ed è stato rimosso.

## Verifiche ancora mancanti (non eseguibili senza accessi)
- DNS reale di `www`, apex e `api` (record proxied Cloudflare o diretti a Railway). L'avviso Railway
  "REQUIRES_UPDATE" è compatibile con un record proxied (il backend documenta Cloudflare → Railway →
  Express in `middleware/rateLimitClientKey.js`), ma non è verificato.
- Log Vercel e Cloudflare per la fascia 21:30–22:20 (ora italiana) del 21/11/2026.
- Riproduzione su Chrome desktop/mobile con SW già installato, e URL/ordine esatti degli screenshot.

## Come rieseguire la validazione sul quiz (solo locale)
1. Build: `NEXT_PUBLIC_SANITY_PROJECT_ID=e2edummy NEXT_PUBLIC_SANITY_DATASET=test NEXT_PUBLIC_TURNSTILE_SITE_KEY=fixture API_BASE_URL=http://127.0.0.1:9/api npm run build`
   (in un ambiente senza rete `next/font` non scarica Inter/Manrope: serve `NEXT_FONT_GOOGLE_MOCKED_RESPONSES`).
2. `npx next start --hostname 127.0.0.1 --port 3138` con le stesse variabili.
3. `E2E_BASE_URL=http://localhost:3138 npx playwright test tests/quiz-session-remediation.spec.ts tests/service-worker-quiz-progress.spec.ts`
   (`tests/service-worker-quiz-progress.spec.ts`: sessione quiz intatta durante SW v4→v5 e dopo navigazione fallita + retry).
