# Domande CCST Networking da rivedere

Emerse durante la sessione di ampliamento Review del 2026-08-10 (topic 230, 227, 229, 231, 235), non risolte in quella sessione perché toccano `questions`, non `topic_review_pages`.

## Origine

Durante la verifica del Topic 235 ("Carriere e certificazioni nel networking"), il gap "CCNA Security" nell'audit (`docs/audit-ccst-networking.md`) risultava testato dalle domande id 3241, 14823, 14824, tutte con **CCNA Security come risposta corretta**.

Cisco ha ritirato la certificazione CCNA Security nel febbraio 2020, sostituendola con **CyberOps Associate**. Le tre `explanation` in DB trattano già correttamente la certificazione al passato/come retired:

- 3241: "La CCNA Security (**oggi sostituita** da percorsi più ampi nella sicurezza di rete) certificava..."
- 14823: "Il percorso CCNA Security **è stato creato**..." (stem già corretto: "storicamente legato")
- 14824: "La CCNA Security **insegnava**... **Era** una certificazione..."

Il problema non è la risposta corretta (resta l'unica sensata tra le opzioni proposte), ma lo **stem** (il testo della domanda) di due delle tre, che usa un tempo verbale al presente in contraddizione con la propria stessa spiegazione — ambiguo per un candidato che potrebbe leggerlo come un percorso ancora attivo.

## Le due domande

### ID 3241

- **Stem attuale:** "Quale certificazione Cisco è focalizzata sulla sicurezza delle reti?"
- **Problema:** presente indicativo ("è focalizzata"), mentre la explanation chiarisce che è stata sostituita.
- **Riformulazione proposta:** "Quale certificazione Cisco (oggi ritirata) era focalizzata sulla sicurezza delle reti?"
- Risposte e `is_correct` invariate (CCNA Security resta corretta).

### ID 14824

- **Stem attuale:** "Quale certificazione Cisco introduce concetti di firewall, VPN e protezione delle reti?"
- **Problema:** presente indicativo ("introduce"), mentre la explanation è interamente al passato ("insegnava... Era una certificazione").
- **Riformulazione proposta:** "Quale certificazione Cisco (oggi ritirata) introduceva concetti di firewall, VPN e protezione delle reti?"
- Risposte e `is_correct` invariate (CCNA Security resta corretta).

### ID 14823 — nessuna azione

Stem già corretto ("Quale percorso Cisco è **storicamente** legato alla protezione delle reti e alla cybersecurity?"), coerente con la propria explanation. Non richiede modifiche.

## Nota generale

Questo pattern (3 domande su 3 nello stesso gap con lo stesso difetto di tempo verbale) suggerisce che potrebbero esistere altre domande generate quando CCNA Security era ancora attuale, o comunque non verificate contro il blueprint Cisco corrente. Vale la pena tenerlo a mente durante il lavoro sui topic pesanti (226, 228, 233, 234, 232): non solo confronto Review-vs-domande, ma anche verifica contro il blueprint ufficiale attuale, specialmente su nomi di certificazioni/percorsi che Cisco può ritirare o rinominare nel tempo.

## Stato

Non eseguito nessun UPDATE. In attesa di conferma prima di modificare `questions.question` per i due ID sopra.
