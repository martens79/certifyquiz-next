# PEKIT / ICDL — correzioni dei claim (verificate il 2026-10-26)

Scopo: allineare le landing `/certificazioni/pekit` e `/certificazioni/icdl` alle fonti ufficiali. Nessuna modifica a domande, DB, URL, canonical, hreflang, metaTitle o slug dei topic.

| Affermazione nel testo | Fonte | Esito |
|---|---|---|
| PEKIT Expert: 4 esami da 36 domande, soglia 70% del punteggio massimo, certificato di 4 anni, livelli 1–8 per area DigComp | Schema di certificazione PEKIT Expert rev. 3.0 (nov. 2024), §2.3.4.1, 2.3.9, 2.3.12 | Verificato |
| PEKIT Expert accreditata Accredia dal 9/4/2025 (schema DigComp 2.2) | Allegato CSACI al certificato di accreditamento 02266 Persons, rev. 000, scadenza 8/4/2029 | Verificato |
| PEKIT indica Expert come CIAD per ATA (esclusi collaboratori scolastici) | Pagina PEKIT "PEKIT EXPERT – CIAD" | Fonte dell'ente |
| Le 4 fasi ufficiali: Cominciare le operazioni, Vivere in connessione, Esperienza multimediale, Diventare esperti | Schema rev. 3.0, parte seconda | Verificato; i topic CertifyQuiz non coincidono (audit su corpus locale: audio/video 2 domande, e-learning 0, reti avanzate 4) |
| GPS 2026/28: solo certificazioni Accredia + DigComp 2.2 / DigCompEdu; una per framework | O.M. 27/2026 (premessa), Allegati A tabelle A/2–A/4, FAQ MIM 69 e 82 | Verificato |
| ICDL Full Standard accreditata Accredia; AICA accreditata anche per DigComp 2.2 | Pagina AICA "DigComp 2.2 per utente qualificato del computer" | Verificato |
| AICA propone come CIAD la certificazione "DigComp 2.2 per utente qualificato di computer"; chi ha ICDL Full Standard valida sostiene un test di conformità | stessa pagina + FAQ AICA | Verificato; la pagina non presenta la sola Full Standard come CIAD |
| CIAD richiesta per l'accesso alle graduatorie ATA (esclusi collaboratori scolastici) | Pagina AICA graduatorie ATA 24 mesi 2026/27; PEKIT | Fonte degli enti, non testo ministeriale |

Rimossi perché non supportati: "molto cercata da chi prepara concorsi", "utile per personale ATA e candidati ai concorsi", "riconosciute a livello internazionale", "Sì" come risposta alle FAQ su ATA/concorsi, "competenze pratiche" verificate da quiz a risposta multipla, link "Percorso base" verso la home dell'ente.

Non toccato: titoli, URL, canonical, hreflang, topic, domande, `officialUrl`, EN/FR/ES salvo link ufficiali PEKIT e prima voce di `whyChoose` ICDL.
