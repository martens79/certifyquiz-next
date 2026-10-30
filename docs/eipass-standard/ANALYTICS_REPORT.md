# EIPASS Standard (coming soon) — misurazione della domanda

Obiettivo: capire se esiste domanda organica per EIPASS Standard prima di costruire i quiz, **senza** nuovi sistemi di raccolta dati, **senza** form e nel rispetto del consenso già in uso.

## Cosa viene misurato

| Segnale | Come | Note |
|---|---|---|
| **Visualizzazioni della landing** | `page_view` automatico di GA4: `GoogleAnalytics` configura `gtag` **solo dopo il consenso** (`anonymize_ip`, niente segnali Google/personalizzazione, URL ripulito). Il percorso `/it/certificazioni/eipass-standard` non è tra i percorsi sensibili esclusi | Verificato in Chrome con ID GA di prova e `gtag.js` simulato: con consenso `dataLayer` riceve `config` con `page_location` della landing; senza consenso non parte nulla. Parte anche l'evento **già esistente** `certification_viewed` con `certification_slug = eipass-standard` (utile per filtrare per certificazione) (vedi `COMING_SOON_RELEASE.md`). In produzione il dato reale lo vede solo chi ha il GA4 |
| **Interesse reale** | Evento `eipass_standard_link_click` su link che esistono davvero | Nessun form, nessun modulo email, nessun nuovo raccoglitore |
| Domanda organica "pura" | **Search Console** (impressioni, clic, query, posizione) filtrata sulla pagina | Non dipende dal consenso cookie: è la misura più affidabile della domanda |
| Controllo incrociato senza consenso | Cloudflare Web Analytics (già in uso, ~86 visite/giorno a fine settembre) | GA4 vede solo chi accetta i cookie: sottostima |

### Evento `eipass_standard_link_click`

Inviato con `trackEvent` (stesso helper di tutto il sito: rispetta consenso, scrubbing dei dati personali, `anonymous_session_id` casuale). Parametri:

| `link_target` | `source_page` | Dove | Significato |
|---|---|---|---|
| `official_eipass_standard` | `eipass_standard_coming_soon` | Landing Standard | Clic sulla pagina ufficiale dell'ente: intenzione di informarsi/iscriversi |
| `eipass_user_landing` | `eipass_standard_coming_soon` | Landing Standard | Clic verso EIPASS 7 Moduli User: l'utente cercava l'altro percorso |
| `standard_coming_soon` | `eipass_user_landing` | Landing EIPASS 7 Moduli User (solo italiano) | Clic sul link contestuale "In preparazione": scoperta interna di Standard |

Il nome del parametro è `link_target` (non `link`) per non confondersi con i parametri `link_*` della misurazione avanzata di GA4 (clic in uscita). **Da fare una volta in GA4** (Admin → Definizioni personalizzate): registrare `link_target` come dimensione personalizzata a livello di evento; `source_page` è già usato da altri eventi del sito.

## Come distinguere organico, referral e navigazione interna

Tutto nell'interfaccia GA4, senza codice nuovo. Landing page = `/it/certificazioni/eipass-standard`.

1. **Organico**: Rapporti → Acquisizione → Acquisizione del traffico, dimensione secondaria *Pagina di destinazione*; filtro *Gruppo di canali predefinito della sessione* = **Organic Search** e pagina di destinazione contiene `eipass-standard`. Per le **query** e le impressioni (che GA4 non ha): Search Console → Rendimento → filtro Pagina.
2. **Referral**: stesso rapporto, filtro *Mezzo della sessione* = **referral**; la dimensione *Origine della sessione* dice quale sito (per esempio un sito che cita la pagina).
3. **Diretto**: *Gruppo di canali* = Direct (link condivisi in chat, preferiti).
4. **Navigazione interna**: Esplora → forma libera → dimensione *Referrer pagina* (`page_referrer`), metrica *Visualizzazioni*, filtro *Percorso pagina* = `/it/certificazioni/eipass-standard`. I `page_referrer` che contengono `certifyquiz.com/it/certificazioni/eipass` sono ingressi dalla landing di EIPASS 7 Moduli User; in aggiunta l'evento `eipass_standard_link_click` con `link_target = standard_coming_soon` conta i clic sul link contestuale. Nessun parametro UTM sui link interni (falserebbe le sorgenti).
5. **Profondità/interesse**: sessioni con evento `eipass_standard_link_click` ÷ sessioni sulla landing, per `link_target`.

Nota: GA4 conta solo gli utenti che hanno accettato i cookie analitici; il canale e il referrer sono quindi un campione. Per la **domanda** fa fede Search Console; per il **traffico totale** il controllo incrociato è Cloudflare.

## Cosa NON è stato fatto
Nessun modulo "avvisami", nessuna raccolta email, nessun nuovo servizio di tracciamento, nessun evento per interazioni inesistenti (quiz, iscrizione).

## Lettura consigliata (non una soglia vincolante)
Settimanale, per 4–6 settimane: impressioni e clic della pagina in Search Console e le prime query; sessioni organiche in GA4; clic sul link ufficiale. Se le impressioni crescono ma i clic sono pochi, il problema è titolo/descrizione; se i clic ci sono ma l'interesse sul link ufficiale è nullo, la domanda è di semplice informazione.
