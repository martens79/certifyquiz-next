# EIPASS Standard — Moduli 3, 4 e 5: attivazione frontend

Con questa PR il registro `EIPASS_STANDARD_MODULES` (`src/lib/eipass-standard.ts`) porta M3, M4 e M5 a `status: "available"` con `topicId` 571, 572 e 573, seguendo lo stesso modello già usato per M2 (570) e M7 (575). M1 (topic 569) resta `coming_soon` finché il P4 del database non è eseguito; M6 resta `coming_soon`.

- `publicationStatus` non cambia (governa solo instradamento e indicizzazione).
- I testi dinamici (pannello, descrizione, FAQ, metadata, richiamo in EIPASS User, sottotitolo OG, pillola del catalogo) seguono la disponibilità tramite `eipassStandardCopy`. Con più di due moduli disponibili l'elenco è «i moduli 2, 3, 4, 5 e 7» (prima: «2 e 3 e 4…»).
- Non toccati: database, GA4, consenso, backend, altri moduli.
- Prerequisito già soddisfatto in Production: topic 571, 572 e 573 attivi con 50 domande attive ciascuno. Il link `/it/quiz/topic/<id>` fallisce comunque chiuso («non disponibile») se il topic fosse nascosto.

## Per attivare M1 (dopo il P4 del topic 569)
Una modifica di due campi nel registro: `status: "available", topicId: 569`, più l'aggiornamento dei test che elencano i moduli disponibili.
