# Complete Pass 90 giorni — ISC2 CC, CCST, EIPASS, ICDL

Replica per altre certificazioni di quanto fatto per **CCNA Complete** (offerta `octopus-complete-ccna`,
90 giorni, pagamento unico). Il frontend è già generico (`CertificationPackageOffers` è montato su ogni
`CertificationPage`, copy e durata arrivano dall'offerta): **servono solo dati nel DB e un price Stripe per
certificazione**. Nessuna modifica di codice.

## Cosa crea

| Certificazione (slug) | Offerta | Note |
|---|---|---|
| `isc2-cc` | `octopus-complete-isc2-cc` | nuova |
| `cisco-ccst-cybersecurity` | `octopus-complete-cisco-ccst-cybersecurity` | nuova (oggi esiste solo Study) |
| `icdl` | `octopus-complete-icdl` | nuova |
| `eipass` | `octopus-complete-eipass` | nuova, senza guida/mappe (non esistono PDF) |
| `cisco-ccst-networking` | già esistente, attiva | opzionale `02b`: durata 90 giorni |

Capability di ogni pass: le 7 del Complete CCNA indipendenti dai contenuti (quiz, spiegazioni, simulazioni
d'esame, progresso, ripassi, ripasso errori, Mock Review) + guida/mappe dove il PDF esiste + lab e scenari
**solo se la certificazione ne ha** (letti dal DB in `02-data.sql`). La card mostra comunque solo ciò che
esiste. Un pass ISC2 CC/ICDL/EIPASS sarà quindi più "leggero" di CCNA finché mancano lab e scenari.

## Ordine di esecuzione (MySQL Workbench, produzione)

1. `01-precheck.sql` — sola lettura. Controlla slug, prezzo CCNA di riferimento, contenuti per cert.
2. `02-data.sql` — crea le 4 offerte **inactive**, senza Stripe: non parte nessuna vendita.
   Prezzo di default = quello di CCNA Complete; modificabile per cert nella tabella `pass_seed`.
3. `03-postcheck.sql` — sola lettura.
4. Stripe: per ogni offerta crea Product + Price one-time EUR con **lo stesso importo** di `amount_minor`
   (il webhook rifiuta la concessione se l'importo pagato è diverso).
5. Anteprima admin della card (`?include_inactive=1`).
6. `04-activate.sql` — inserisci gli ID Stripe e attiva (una cert per volta, le righe NULL sono saltate).
7. Opzionale: `02b-optional-ccst-networking-90d.sql`.

`05-rollback.sql` annulla `02-data.sql` solo per offerte senza ordini.

## Stato di verifica

Gli script **non sono stati eseguiti** (nessun MySQL disponibile in sessione, nessun accesso al DB):
seguono i pattern delle migration CCNA (`2026-09-27-ccna-complete-offer.*`, `2026-09-25-mock-review-inclusions.*`)
e dello schema `2026-08-08-add-certification-packages.up.sql` nel backend. Il precheck serve proprio a
confermare slug e prezzi prima del dato.

## Decisioni aperte

- Prezzo per ciascuna cert (default: stesso di CCNA).
- Verificare col precheck [5] che il numero di domande di ogni cert giustifichi il prezzo (per ISC2 CC gli ID
  in `review-indexability.ts` fanno pensare a 8 topic nel DB, contro i 5 della landing: da confermare).
- Rinnovo: il checkout somma il nuovo periodo a quello attuale (già implementato, vedi `renewNote`).
