# CertifyQuiz — Contesto progetto

## Panoramica

CertifyQuiz (certifyquiz.com) è una piattaforma multilingua (IT/EN/FR/ES) di quiz per certificazioni IT, sviluppata e mantenuta in solitaria da Lorenzo. Copre 50+ certificazioni (AWS, Cisco, Microsoft, CompTIA, ISC2, CEH, CISSP, ecc.) con modello freemium (Premium €9.99/mese) e piano B2B/Team.

## Stack tecnico

- **Frontend:** Next.js, deployato su Vercel (piano Pro)
- **Backend:** Express/Node.js, deployato su Railway
- **Database:** MySQL (gestito su Railway, operazioni manuali via MySQL Workbench)
- **Ambiente dev:** Windows / PowerShell
- **CDN/DNS:** Cloudflare (DNS-only per record DKIM Brevo, SSL Full, Bot Fight Mode disabilitato per problemi con SSR Vercel)

## Convenzioni di codice

- Preferisco **diff di codice espliciti o riscritture complete di file**, non spiegazioni testuali generiche.
- Le modifiche vanno proposte come diff prima di essere applicate — chiedi conferma sulle modifiche più invasive.

## Struttura contenuti quiz

- Le domande sono organizzate per certificazione → topic, in `uploader/domandexcertificazione/[CATEGORIA]/[NN_certificazione]/[NNN_topic]/`
- Formato standard: **30 domande per file**, A/B/C/D con una sola risposta corretta (marcata con ✅ nell'opzione e "Risposta corretta: X" sotto), spiegazione dettagliata di 4-8 righe.
- Ogni topic ha file separati per lingua: IT (default, nessun suffisso), EN (`_en`), FR (`_fr`), ES (`_es`).
- Le domande in lingue diverse traducono lo stesso set di quesiti nello stesso ordine (utile per allineare gli ID durante l'inserimento SQL).

## Pipeline SQL

- Le UPDATE per popolare le colonne multilingua toccano 8 colonne di lingua per tabella.
- Escaping con `''` per apostrofi nelle stringhe SQL.
- Le FAQ nelle pagine topic seguono un formato JSON con 4 sezioni `##` per lingua.
- Validazione automatizzata via script Python (esecuzione SQLite di prova + controlli strutturali) prima dell'inserimento in produzione.

## Exam Scenarios (feature avanzata)

Tabelle: `scenarios` (title/intro_text per lingua, difficulty ENUM `base`/`advanced`/`exam`, `is_premium`, `is_active`, `topic_id` obbligatorio) + `scenario_questions` (question_text/explanation per lingua, order_index) + `scenario_answers` (answer_text per lingua, is_correct, FK `scenario_question_id`).

Flusso: genera in IT a batch di 5 → INSERT con `topic_id` e difficulty corretti → UPDATE EN/FR/ES per ID → attiva con `is_active=1`.

`scenarioRoutes_v4.js` richiede `intro_text_[lang]` non nullo per rendere visibile la lingua. La cache Vercel impiega 30-60 minuti a rinfrescarsi dopo un deploy.

## Aree di lavoro attive

1. **SEO / 404 remediation**: redirect rules in `next.config.ts`, dati da Google Search Console coverage CSV.
2. **Conversione Premium**: gate su `free_wrong_explanations_used` (soglia attuale: 10), verifiche via query SQL su tabella `users`.
3. **Produzione contenuti multilingua**: traduzioni quiz e generazione nuove domande su AWS, ITF+, e certificazioni AI in arrivo.
4. **B2B**: landing page `/business`, `/it/aziende`, `/fr/entreprises`, `/es/empresas`; tabella `organizations`, `users.organization_id`/`is_org_admin`.

## Cosa NON fare senza chiedere

- Non eseguire query DELETE o UPDATE su produzione senza conferma esplicita.
- Non pushare direttamente su `main` — lavorare su branch dedicati.
- Non modificare le regole del rate limiter (`questionsLimiter`, `ANTI_ABUSE_CAP`, `scenariosLimiter`) senza discuterne, dato che sono state introdotte per anti-scraping e hanno già causato falsi positivi sull'admin panel.
