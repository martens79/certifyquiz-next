# EIPASS Standard — Moduli 1, 3, 4 e 5: attivazione frontend

Con questa PR il registro `EIPASS_STANDARD_MODULES` (`src/lib/eipass-standard.ts`) porta M1, M3, M4 e M5 a `status: "available"` con `topicId` 569, 571, 572 e 573, come già M2 (570) e M7 (575). Solo M6 resta `coming_soon`. `publicationStatus` non cambia.

- Testi dinamici (pannello, descrizione, FAQ, metadata, richiamo in EIPASS User, OG, pillola catalogo) seguono `eipassStandardCopy`; l'elenco è «i moduli 1, 2, 3, 4, 5 e 7» (prima, con più di due moduli, «2 e 3 e 4…»).
- Non toccati: database, GA4, consenso, backend, altri moduli.
- **Ordine di rilascio:** topic 571, 572, 573 sono già attivi in Production. Il topic 569 diventa visibile solo con il P4 del database: NON mergiare né deployare questa PR prima che il P4 di M1 sia eseguito e verificato, altrimenti il link di M1 porta al pannello «non disponibile» (fallisce chiuso, ma è un link pubblico a un modulo non ancora online).
