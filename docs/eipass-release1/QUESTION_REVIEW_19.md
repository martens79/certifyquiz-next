# EIPASS Release 1 — Revisione separata dei19 item

Stato: proposta editoriale NON applicata. Nessun UPDATE, import o modifica di chiave eseguiti. La PR del catalogo non modifica questi quesiti.

Gli ID restano invariati. L’API pubblica non espone chiavi corrette né spiegazioni: tutte le proposte richiedono accesso read-only a questi dati, confronto degli answer ID e seconda revisione. Le riscritture che cambiano la decisione valutata devono essere approvate separatamente; non attribuire nuovi livelli o cambiare associazioni.

## Controlli prima del pacchetto domande

1. Esportare in sola lettura i19 record, quattro traduzioni, alternative ordinate per ID, chiave e spiegazione; conservare hash e timestamp.
2. Riprodurre gli item UI su prodotto/versione dichiarati. Per ogni lingua preparare before/after completo e risposta semanticamente corretta; non indovinare answer ID dalla posizione.
3. Approvare ogni diff con revisore tecnico e, per traduzioni, revisore linguistico. Nessun cambiamento del topic o del certification ID.
4. Se in futuro si autorizzeranno dati: preparare transazione con precondizioni su ID+hash BEFORE, aggiornamento delle sole colonne approvate, conteggi invarianti e rollback con precondizioni sull’hash AFTER. Se una riga diverge, interrompere. Questo documento non contiene SQL eseguibile né autorizza il rilascio.

## Fonti e prove da allegare

- Syllabus User già verificato nel Piano EIPASS Scuola Italia del 26/10/2026; associare pagina/obiettivo a ciascun item.
- [Microsoft: Posta, Calendario e Persone](https://support.microsoft.com/it-it/outlook/outlook-for-windows-the-future-of-mail-calendar-and-people-on-windows-11): fine supporto e operatività al 31/12/2024, verificata nell’audit.
- Per MFA: acquisire riferimento primario sui fattori distinti; per formule: documentazione della versione Excel su riferimenti relativi/assoluti; per ROM: riferimento sulla tecnologia trattata.
- Per copyright: licenza e condizioni di riuso della fonte; per PDF: documentazione del prodotto su esportazione e protezioni. I riferimenti puntuali ancora da acquisire sono un gate, non una verifica già superata.

## ID 1015 — topic23

**Rilievo:** P2: distinguere fine paragrafo da interruzione di riga

**Testo attuale:** In un documento Word, cosa indica il simbolo ¶ visibile attivando la formattazione?

**Testo proposto:** In Word, quale struttura termina in corrispondenza del segno ¶ mostrato con i caratteri non stampabili?

**Risposta semantica proposta, non chiave DB:** Un paragrafo.

**Spiegazione / verifica:** Distinguere Invio da Maiusc+Invio; evitare di chiamare entrambi genericamente «a capo».

**Alternative attuali da revisionare:** 3823: Un errore ortografico / 3824: Un'interruzione di pagina / 3825: Un segno di paragrafo (a capo) / 3826: Un campo nascosto

**Stato:** PENDING chiave, spiegazione, traduzioni, fonte e revisione indipendente.

## ID 1050 — topic22

**Rilievo:** P1: specificare riferimenti relativi; distinguere assoluti e misti

**Testo attuale:** Cosa succede se trasciniamo il quadratino nell’angolo di una cella con una formula verso il basso?

**Testo proposto:** Una cella contiene =A1+B1 con riferimenti relativi. Che cosa accade trascinando la maniglia di riempimento di una riga verso il basso?

**Risposta semantica proposta, non chiave DB:** =A2+B2.

**Spiegazione / verifica:** Spiegare la variazione di riferimenti relativi e il diverso comportamento di $A$1 e A$1; allineare tutte le alternative.

**Alternative attuali da revisionare:** 3963: Copia il contenuto come testo / 3964: Duplica la formula senza modificarla / 3965: Applica la formula adattando i riferimenti / 3966: Elimina la formula originaria

**Stato:** PENDING chiave, spiegazione, traduzioni, fonte e revisione indipendente.

## ID 1080 — topic17

**Rilievo:** P1: assoluto «ROM non modificabile»: precisare tecnologia e contesto

**Testo attuale:** Che cos’è la ROM in un computer?

**Testo proposto:** Quale caratteristica descrive la ROM tradizionale, distinguendola dalla RAM e dalle memorie flash riscrivibili?

**Risposta semantica proposta, non chiave DB:** Memoria non volatile destinata alla lettura; evitare un assoluto esteso a tutte le tecnologie di firmware.

**Spiegazione / verifica:** Separare ROM, EEPROM e flash; verificare il distrattore che usa «non modificabile». Non equiparare automaticamente questa versione a 12887.

**Alternative attuali da revisionare:** 4083: Una memoria volatile / 4084: Una memoria di sola lettura, non modificabile / 4085: Un programma antivirus / 4086: Un componente della tastiera

**Stato:** PENDING chiave, spiegazione, traduzioni, fonte e revisione indipendente.

## ID 1169 — topic18

**Rilievo:** P1: due metodi non garantiscono due fattori distinti

**Testo attuale:** Cosa rappresenta l'autenticazione a due fattori (2FA)?

**Testo proposto:** Quale procedura usa due fattori di autenticazione distinti, ad esempio password e chiave di sicurezza fisica?

**Risposta semantica proposta, non chiave DB:** Un fattore di conoscenza e uno di possesso, non due password.

**Spiegazione / verifica:** Mantenere distinti fattori e passaggi; la chiave persistita va letta prima di cambiare alternative.

**Alternative attuali da revisionare:** 4439: Un sistema di backup / 4440: Una password composta da due parole / 4441: Una procedura che richiede due metodi di verifica dell'identità / 4442: Un firewall avanzato

**Stato:** PENDING chiave, spiegazione, traduzioni, fonte e revisione indipendente.

## ID 13093 — topic22

**Rilievo:** P1: specificare riferimenti relativi; distinguere assoluti e misti

**Testo attuale:** Cosa succede se trasciniamo il quadratino nell'angolo di una cella con una formula verso il basso?

**Testo proposto:** Copiando verso il basso di una riga una formula con soli riferimenti relativi, come cambiano i riferimenti?

**Risposta semantica proposta, non chiave DB:** Si aggiornano rispetto alla nuova posizione.

**Spiegazione / verifica:** Coppia con 1050: differenziare lo scenario prima di proporre consolidamento; nessuna cancellazione.

**Alternative attuali da revisionare:** 53044: Elimina la formula originaria e lascia la cella vuota / 53045: Duplica la formula in modo identico senza alcuna modifica ai riferimenti / 53046: Copia il contenuto della cella come testo semplice nelle celle sottostanti / 53047: Applica la formula adattando i riferimenti riga per riga

**Stato:** PENDING chiave, spiegazione, traduzioni, fonte e revisione indipendente.

## ID 13110 — topic22

**Rilievo:** P1: specificare riferimenti relativi; distinguere assoluti e misti

**Testo attuale:** Cosa accade trascinando verso il basso la maniglia di riempimento di una cella contenente una formula?

**Testo proposto:** Copiando =A1+$B$1 dalla riga1 alla riga2 con la maniglia di riempimento, quale formula si ottiene?

**Risposta semantica proposta, non chiave DB:** =A2+$B$1.

**Spiegazione / verifica:** Proposta di differenziazione con riferimenti misti; sostituzione della domanda soggetta a revisione separata.

**Alternative attuali da revisionare:** 53112: La formula viene eliminata dalle celle originali / 53113: Excel copia la formula aggiornando automaticamente i riferimenti / 53114: Il contenuto viene trasformato in testo semplice / 53115: Le celle sottostanti vengono bloccate automaticamente

**Stato:** PENDING chiave, spiegazione, traduzioni, fonte e revisione indipendente.

## ID 25218 — topic22

**Rilievo:** P1: comando icone senza testo non dimostrato; verificare versione Excel

**Testo attuale:** Come si può personalizzare la barra multifunzione di Excel per mostrare solo le icone senza il testo dei comandi?

**Testo proposto:** Dove configuri i comandi visualizzati nella barra multifunzione di Excel nella versione desktop dichiarata?

**Risposta semantica proposta, non chiave DB:** Opzioni di personalizzazione della barra multifunzione, se coerenti con la versione riprodotta.

**Spiegazione / verifica:** Prima riprodurre il comando originario «sole icone»; se non esiste nella versione, sostituire il compito. Screenshot e versione obbligatori.

**Alternative attuali da revisionare:** 101672: Non è possibile modificare l'aspetto della barra multifunzione / 101673: Tramite le opzioni di visualizzazione della barra multifunzione / 101674: Solo reinstallando Excel / 101675: Modificando le impostazioni di Windows Update

**Stato:** PENDING chiave, spiegazione, traduzioni, fonte e revisione indipendente.

## ID 25228 — topic22

**Rilievo:** P1: modalità compatta da verificare nella versione Excel dichiarata

**Testo attuale:** Come si passa da uno stile di visualizzazione dettagliato a uno compatto per i comandi della barra multifunzione di Excel?

**Testo proposto:** Quale impostazione modifica la visualizzazione della barra multifunzione nella versione Excel indicata?

**Risposta semantica proposta, non chiave DB:** Da determinare soltanto con prova sulla versione dichiarata.

**Spiegazione / verifica:** Non approvare una modalità compatta generica senza riscontro; scegliere un controllo riproducibile.

**Alternative attuali da revisionare:** 101712: Tramite le opzioni di personalizzazione della barra multifunzione / 101713: Disinstallando e reinstallando Excel / 101714: Modificando la risoluzione dello schermo / 101715: Non è possibile personalizzare lo stile dei comandi

**Stato:** PENDING chiave, spiegazione, traduzioni, fonte e revisione indipendente.

## ID 25267 — topic22

**Rilievo:** P1: confusione tra foglio e intervallo di celle

**Testo attuale:** Come si può spostare un intero foglio di dati in una posizione diversa della stessa riga o colonna senza usare il mouse?

**Testo proposto:** Come sposti un intervallo di celle in un’altra posizione del foglio Excel usando soltanto la tastiera?

**Risposta semantica proposta, non chiave DB:** Selezione, taglio, spostamento alla destinazione e incolla.

**Spiegazione / verifica:** Rimuovere «intero foglio ... della stessa riga o colonna»: intervallo e foglio sono oggetti differenti.

**Alternative attuali da revisionare:** 101868: Selezionando, tagliando con CTRL+X, spostandosi con le frecce e incollando con CTRL+V / 101869: Non è possibile spostare dati senza il mouse / 101870: Solo riscrivendo manualmente ogni valore / 101871: Chiudendo e riaprendo Excel

**Stato:** PENDING chiave, spiegazione, traduzioni, fonte e revisione indipendente.

## ID 25367 — topic22

**Rilievo:** P1: esportazione PDF non garantisce immodificabilità dei dati

**Testo attuale:** Come si esporta una cartella di lavoro Excel in formato PDF, ad esempio per condividerla senza permettere modifiche ai dati?

**Testo proposto:** Come esporti una cartella Excel in PDF per distribuire una versione impaginata dei dati?

**Risposta semantica proposta, non chiave DB:** Esportazione o salvataggio nel formato PDF.

**Spiegazione / verifica:** Non promettere che i dati non possano essere modificati; distinguere copia impaginata, protezione e file di origine.

**Alternative attuali da revisionare:** 102268: Non è possibile esportare un file Excel in PDF / 102269: Solo tramite uno scanner / 102270: Facendo uno screenshot di ogni foglio / 102271: Da File > Esporta o Salva con nome, scegliendo PDF come tipo di file

**Stato:** PENDING chiave, spiegazione, traduzioni, fonte e revisione indipendente.

## ID 25465 — topic20

**Rilievo:** P2: home page/pagina iniziale ambigue; specificare browser e impostazione

**Testo attuale:** Qual è la differenza tra la "pagina iniziale" e la "home page" impostata su un browser?

**Testo proposto:** In un browser e una versione specificati, come differiscono le pagine aperte all’avvio e la pagina richiamata dal pulsante Home?

**Risposta semantica proposta, non chiave DB:** Dipende dalle due impostazioni distinte del browser dichiarato.

**Spiegazione / verifica:** Evitare di opporre home page e pagina iniziale come definizioni universali; fissare browser, versione e impostazioni reali.

**Alternative attuali da revisionare:** 102660: Sono sempre esattamente la stessa cosa in ogni browser / 102661: La home page si apre solo su dispositivi mobili / 102662: Sono impostazioni distinte: una si apre all'avvio, l'altra tramite il pulsante Home / 102663: La pagina iniziale esiste solo in modalità incognito

**Stato:** PENDING chiave, spiegazione, traduzioni, fonte e revisione indipendente.

## ID 25508 — topic20

**Rilievo:** P1: licenza di riuso non significa assenza di copyright

**Testo attuale:** Come si esegue una ricerca di immagini utilizzabili e condivisibili (cioè non protette da diritto d'autore) su Google Immagini?

**Testo proposto:** Come individui immagini con una licenza che consente il riuso previsto e quali condizioni controlli prima di pubblicarle?

**Risposta semantica proposta, non chiave DB:** Filtro sui diritti di utilizzo e verifica della licenza presso la fonte.

**Spiegazione / verifica:** Rimuovere l’equivalenza tra riutilizzabile e non protetto da copyright; includere attribuzione, modifiche e usi consentiti.

**Alternative attuali da revisionare:** 102832: Tutte le immagini trovate online possono sempre essere riutilizzate liberamente / 102833: Filtrando i risultati per "diritti di utilizzo" nella ricerca avanzata di Google Immagini / 102834: Non esiste alcun modo per verificare i diritti di un'immagine / 102835: Solo scaricando immagini da siti a pagamento

**Stato:** PENDING chiave, spiegazione, traduzioni, fonte e revisione indipendente.

## ID 25551 — topic20

**Rilievo:** P1: Posta di Windows fuori supporto e non operativa dal 31/12/2024

**Testo attuale:** Come si aggiunge un account di posta elettronica esistente (ad esempio Gmail) all'app "Posta" di Windows, per gestirlo direttamente dal computer?

**Testo proposto:** Come aggiungi un account email esistente a un client attualmente supportato, nella versione indicata?

**Risposta semantica proposta, non chiave DB:** Usare la procedura di aggiunta account del client scelto, da riprodurre.

**Spiegazione / verifica:** Ritirare soltanto il riferimento operativo a Posta di Windows; scegliere nuovo Outlook o altro client supportato, senza cancellare ID o record.

**Alternative attuali da revisionare:** 103004: Non è possibile collegare account esterni all'app Posta di Windows / 103005: Da "Aggiungi account" nell'app Posta, scegliendo il provider e accedendo con le credenziali / 103006: Solo reinstallando Windows da zero / 103007: Cambiando la password dell'account Google ogni volta

**Stato:** PENDING chiave, spiegazione, traduzioni, fonte e revisione indipendente.

## ID 25634 — topic17

**Rilievo:** P2: spiegare backup cartelle OneDrive, sincronizzazione e ripristino

**Testo attuale:** Come si archivia una copia di sicurezza (backup) dei propri file importanti direttamente su OneDrive da Windows 11?

**Testo proposto:** Quale funzione OneDrive consente di proteggere le cartelle supportate e quali limiti devi conoscere?

**Risposta semantica proposta, non chiave DB:** Backup delle cartelle supportate, con sincronizzazione e strumenti di ripristino da spiegare.

**Spiegazione / verifica:** Il comando Backup esiste: non classificarlo come falso. Spiegare propagazione delle modifiche/cancellazioni, versioni e limiti di recupero.

**Alternative attuali da revisionare:** 103336: Non è possibile fare il backup su OneDrive da Windows / 103337: Solo stampando ogni file su carta / 103338: Formattando il computer prima del backup / 103339: Dalle impostazioni dell'app OneDrive, attivando il backup delle cartelle desiderate

**Stato:** PENDING chiave, spiegazione, traduzioni, fonte e revisione indipendente.

## ID 25741 — topic18

**Rilievo:** P2: chiarire limiti del backup tramite sincronizzazione OneDrive

**Testo attuale:** Come si esegue una copia di backup dei propri dati direttamente su OneDrive, sfruttando la sincronizzazione automatica del cloud?

**Testo proposto:** Qual è la differenza tra sincronizzare una cartella con OneDrive e conservare una copia indipendente recuperabile?

**Risposta semantica proposta, non chiave DB:** La sincronizzazione replica modifiche; una strategia di backup deve prevedere recupero e conservazione adeguati.

**Spiegazione / verifica:** Proposta di differenziazione rispetto a 25634; niente rimozione automatica e nessuna falsa negazione del backup cartelle OneDrive.

**Alternative attuali da revisionare:** 103764: Non è possibile eseguire backup automatici su OneDrive / 103765: Solo copiando manualmente ogni file uno per uno ogni giorno / 103766: Formattando il computer prima di ogni backup / 103767: Attivando l'opzione "Backup" nelle impostazioni dell'app OneDrive

**Stato:** PENDING chiave, spiegazione, traduzioni, fonte e revisione indipendente.

## ID 25753 — topic23

**Rilievo:** P1: comando icone senza testo non dimostrato; verificare versione Word

**Testo attuale:** Come si può personalizzare la barra multifunzione di Word per mostrare solo le icone senza il testo dei comandi?

**Testo proposto:** Come personalizzi una scheda della barra multifunzione di Word nella versione desktop indicata?

**Risposta semantica proposta, non chiave DB:** Tramite le opzioni supportate di personalizzazione.

**Spiegazione / verifica:** Verificare il requisito «sole icone senza testo»; distinguere personalizzazione dei comandi e collasso della barra.

**Alternative attuali da revisionare:** 103812: Tramite le opzioni di visualizzazione della barra multifunzione / 103813: Non è possibile modificare l'aspetto della barra multifunzione / 103814: Solo reinstallando Word / 103815: Modificando le impostazioni di Windows Update

**Stato:** PENDING chiave, spiegazione, traduzioni, fonte e revisione indipendente.

## ID 25754 — topic23

**Rilievo:** P1: opzioni interfaccia da verificare nella versione Word dichiarata

**Testo attuale:** Come si può scegliere lo stile con cui vengono descritti i comandi nella barra multifunzione di Word (icone grandi, compatte, con o senza testo)?

**Testo proposto:** Quale procedura permette di mostrare o nascondere la barra multifunzione di Word nella versione indicata?

**Risposta semantica proposta, non chiave DB:** Controllo di visualizzazione supportato dalla versione, da verificare.

**Spiegazione / verifica:** Riscrivere dopo prova; non equiparare icone grandi, interfaccia semplificata e comando universale.

**Alternative attuali da revisionare:** 103816: Non è possibile personalizzare lo stile dei comandi / 103817: Solo modificando la risoluzione dello schermo / 103818: Dal menu di personalizzazione della barra multifunzione / 103819: Disinstallando e reinstallando Word

**Stato:** PENDING chiave, spiegazione, traduzioni, fonte e revisione indipendente.

## ID 25828 — topic23

**Rilievo:** P1: esportazione PDF non garantisce immodificabilità

**Testo attuale:** Come si esporta un documento Word in formato PDF, per condividerlo senza permettere modifiche dirette al testo?

**Testo proposto:** Come esporti un documento Word in PDF mantenendo una presentazione adatta alla condivisione?

**Risposta semantica proposta, non chiave DB:** File > Esporta oppure Salva con nome, scegliendo PDF, secondo la versione.

**Spiegazione / verifica:** Il formato non rende il file intrinsecamente immodificabile; la protezione richiede misure ulteriori e ha limiti.

**Alternative attuali da revisionare:** 104112: Da File > Esporta o Salva con nome, scegliendo PDF come tipo di file / 104113: Non è possibile esportare un documento Word in PDF / 104114: Solo tramite uno scanner / 104115: Facendo uno screenshot di ogni pagina

**Stato:** PENDING chiave, spiegazione, traduzioni, fonte e revisione indipendente.

## ID 25853 — topic21

**Rilievo:** P1: comando icone senza testo non dimostrato; verificare versione PowerPoint

**Testo attuale:** Come si può personalizzare la barra multifunzione di PowerPoint per mostrare solo le icone senza il testo dei comandi?

**Testo proposto:** Come mostri o nascondi la barra multifunzione di PowerPoint nella versione indicata?

**Risposta semantica proposta, non chiave DB:** Opzioni di visualizzazione effettivamente disponibili.

**Spiegazione / verifica:** Riprodurre prima la richiesta «icone senza testo»; poi fissare titolo, alternative e spiegazione della sola versione supportata.

**Alternative attuali da revisionare:** 104212: Tramite le opzioni di visualizzazione della barra multifunzione / 104213: Non è possibile modificare l'aspetto della barra multifunzione / 104214: Solo reinstallando PowerPoint / 104215: Modificando le impostazioni di Windows Update

**Stato:** PENDING chiave, spiegazione, traduzioni, fonte e revisione indipendente.
