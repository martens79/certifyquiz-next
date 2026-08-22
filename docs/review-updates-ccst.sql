-- Topic 226-235 CCST Networking: audit content gap fixes
-- Generato da Claude, revisionato e confermato da Lorenzo prima di ogni riga
--
-- ORDINE DI ESECUZIONE:
-- 1) Eseguire PER PRIMA la CREATE TABLE di backup qui sotto (una tantum, prima di qualsiasi UPDATE).
-- 2) Eseguire gli UPDATE UNO ALLA VOLTA, non tutto il file in un colpo.
--    Ogni UPDATE riscrive l'intero campo content_it (non solo la parte nuova) -- e' l'approccio
--    corretto per MySQL, ma un errore di trascrizione sovrascriverebbe tutto il Review: per questo
--    va verificato sul sito che il Review si veda bene dopo ogni singolo UPDATE, prima di passare
--    al successivo. Il file non e' pensato per essere idempotente rispetto a modifiche fatte nel
--    frattempo sulla stessa riga.
-- 3) A fine sessione (tutti i topic previsti), eseguire la query di verifica lunghezza content_it
--    che verra' aggiunta in fondo a questo file confrontando con la tabella di backup.

-- Backup completo della tabella prima di qualsiasi UPDATE (eseguire una sola volta)
CREATE TABLE topic_review_pages_backup_20260810
AS SELECT * FROM topic_review_pages;

-- Topic 230 -- Tipi di reti e topologie (confermato)
UPDATE topic_review_pages SET content_it = '## Cosa devi sapere davvero

Le reti si classificano sia per estensione geografica (LAN, WAN, ecc.) sia per il modo in cui i dispositivi sono collegati fisicamente o logicamente tra loro (topologia). Il CCST richiede di riconoscere entrambe le classificazioni ed i loro vantaggi/svantaggi tipici.

## Concetti chiave

- **LAN (Local Area Network)**: rete che copre un''area limitata, come un ufficio o un edificio.
- **WAN (Wide Area Network)**: rete che copre un''area geografica ampia, collegando più LAN a distanza.
- **WLAN (Wireless LAN)**: rete locale che usa connessioni wireless invece di cavi.
- **MAN (Metropolitan Area Network)**: rete che copre l''area di una città.
- **PAN (Personal Area Network)**: rete a corto raggio tra dispositivi personali (es. Bluetooth).
- **Topologia a stella**: tutti i dispositivi si collegano a un punto centrale (es. switch).
- **Topologia a bus**: tutti i dispositivi condividono lo stesso cavo principale.
- **Topologia ad anello**: ogni dispositivo è collegato al successivo, formando un anello chiuso.
- **Topologia a mesh**: ogni dispositivo è collegato a più altri dispositivi, offrendo ridondanza.
- **Topologia ibrida**: combinazione di più topologie diverse nella stessa rete.
- **Topologia ad albero**: struttura gerarchica che collega più topologie a stella tra loro (più switch collegati a uno switch principale), molto scalabile e utile per organizzare reparti o edifici in modo ordinato nelle grandi reti aziendali e nei campus.

## Differenze da non confondere

| Tipo di rete | Area coperta |
|---|---|
| PAN | Pochi metri, dispositivi personali |
| LAN | Un edificio o un ufficio |
| MAN | Un''area urbana/cittadina |
| WAN | Area geografica ampia, anche globale |

| Topologia | Caratteristica principale |
|---|---|
| Stella | Punto centrale, guasto di un cavo isola un solo dispositivo |
| Bus | Cavo condiviso, un guasto può bloccare l''intera rete |
| Anello | Collegamento circolare tra dispositivi |
| Mesh | Collegamenti multipli, alta ridondanza |
| Albero | Struttura gerarchica di più stelle collegate tra loro, molto scalabile |

## Tipi di rete per estensione

Le reti si classificano in base a quanto territorio coprono. Una **LAN** collega dispositivi vicini, come in un ufficio o in un''abitazione. Una **WAN** collega reti distanti tra loro, spesso attraverso Internet o linee dedicate: la stessa Internet è l''esempio più grande di WAN. Una **MAN** ha una scala intermedia, tipica di un''area cittadina. Una **PAN** è la rete più piccola, limitata a pochi metri, come una connessione Bluetooth tra smartphone e auricolari.

Una **WLAN** non è definita dalla sua estensione ma dalla tecnologia: è semplicemente una LAN che usa il wireless invece dei cavi.

## Topologie fisiche e logiche

La topologia descrive come i dispositivi sono collegati tra loro, fisicamente o logicamente.

Nella **topologia a stella**, ogni dispositivo si collega direttamente a un punto centrale, tipicamente uno switch. È la topologia più comune nelle reti moderne perché un guasto a un singolo cavo isola solo quel dispositivo, senza bloccare l''intera rete.

Nella **topologia a bus**, tutti i dispositivi condividono lo stesso cavo principale. È economica ma fragile: un guasto al cavo principale può bloccare l''intera rete, ed è ormai una topologia obsoleta.

Nella **topologia ad anello**, ogni dispositivo è collegato al successivo fino a chiudere un cerchio. I dati viaggiano lungo l''anello in una direzione predefinita.

Nella **topologia a mesh**, ogni dispositivo ha collegamenti multipli verso altri dispositivi, offrendo massima ridondanza: se un collegamento si guasta, i dati possono sempre trovare un percorso alternativo. È tipica di reti che richiedono alta affidabilità, come le dorsali di Internet.

Molte reti reali usano una **topologia ibrida**, combinando più modelli in aree diverse della stessa infrastruttura.

## Topologia ad albero, Campus LAN e mesh parziale

La **topologia ad albero** è una struttura gerarchica che collega più topologie a stella tra loro attraverso nodi centrali di livello superiore (più switch collegati a uno switch principale). Ha due vantaggi principali: è molto scalabile, perché si possono aggiungere nuovi segmenti di rete senza dover riprogettare l''infrastruttura esistente; ed è facile da organizzare e gestire, perché la struttura gerarchica permette di raggruppare reparti, edifici o gruppi di dispositivi in modo ordinato, semplificando manutenzione e troubleshooting. È per questo la scelta tipica delle grandi aziende e dei campus con più edifici o reparti.

Una **Campus LAN** è una LAN estesa che collega più edifici vicini tra loro (un''università, un ospedale, una sede aziendale con più palazzine), tipicamente tramite collegamenti in fibra ottica ad alta velocità. Rispetto a una WAN è più semplice, più veloce e resta sotto un unico controllo amministrativo, perché copre un''area geografica limitata.

Nella topologia a mesh esiste anche una distinzione importante: nella **mesh completa** ogni dispositivo è collegato direttamente a tutti gli altri, con la massima ridondanza possibile ma anche il numero più alto di cavi e costi. Nella **mesh parziale**, invece, solo alcuni dispositivi sono collegati direttamente tra loro, mentre gli altri comunicano passando attraverso nodi intermedi: si riducono così i costi e la complessità di cablaggio, mantenendo comunque un buon livello di ridondanza. È lo schema più comune nelle WAN aziendali che collegano più sedi, dove non conviene collegare direttamente ogni sede con tutte le altre.

## Errori comuni nei quiz

- Confondere LAN e WAN in base al numero di dispositivi invece che all''estensione geografica.
- Pensare che una WLAN sia un tipo di rete diverso da una LAN, invece di una variante wireless della stessa.
- Confondere topologia a stella e topologia a bus.
- Pensare che nella topologia a stella un guasto centrale (switch) non abbia impatto sull''intera rete.
- Dimenticare che la topologia a mesh offre ridondanza proprio grazie ai collegamenti multipli.
- Confondere MAN e WAN.

## Mini scenario d''esame

Un''azienda con sedi in tre città diverse le collega tramite linee dedicate e Internet, permettendo agli uffici di scambiarsi dati come se fossero sulla stessa rete locale. Questa infrastruttura che collega reti geograficamente distanti è una **WAN**.

## Mini checklist prima del quiz

Prima di iniziare il quiz dovresti saper spiegare:

- la differenza tra PAN, LAN, MAN e WAN;
- cos''è una WLAN;
- le caratteristiche delle topologie a stella, bus, anello e mesh;
- quale topologia offre più ridondanza e perché;
- cosa succede in ogni topologia quando un cavo o un dispositivo si guasta.' WHERE topic_id = 230;

-- Topic 227 -- Modelli OSI e TCP/IP (confermato)
UPDATE topic_review_pages SET content_it = '## Cosa devi sapere davvero

I modelli OSI e TCP/IP sono il modo standard di descrivere come i dati viaggiano in una rete, dividendo il processo in livelli con compiti specifici. Sono probabilmente l''argomento più citato in tutto il networking, e il CCST li richiede a livello di riconoscimento: sapere cosa fa ogni livello e riconoscere esempi pratici.

## Concetti chiave

- **Modello OSI**: modello di riferimento a 7 livelli che descrive le funzioni di una rete.
- **Livello Fisico (1)**: trasmissione di bit grezzi su un mezzo fisico (cavo, fibra, onde radio).
- **Livello Data Link (2)**: trasferimento di dati tra dispositivi sullo stesso segmento, usa indirizzi MAC.
- **Livello Network (3)**: instradamento dei pacchetti tra reti diverse, usa indirizzi IP.
- **Livello Transport (4)**: consegna affidabile o veloce dei dati, gestisce porte e connessioni (TCP/UDP).
- **Livello Session (5)**: apertura, gestione e chiusura delle sessioni di comunicazione.
- **Livello Presentation (6)**: formattazione, cifratura e compressione dei dati.
- **Livello Application (7)**: interfaccia con le applicazioni che l''utente usa direttamente.
- **Modello TCP/IP**: modello pratico a 4 livelli (Accesso alla rete, Internet, Trasporto, Applicazione) su cui si basa Internet.
- **Incapsulamento**: processo per cui ogni livello aggiunge la propria intestazione ai dati ricevuti dal livello superiore.

## Differenze da non confondere

| Livello OSI | Funzione principale | Esempio |
|---|---|---|
| Fisico (1) | Trasmissione di bit | Cavi, connettori, segnali |
| Data Link (2) | Comunicazione locale, indirizzi MAC | Switch |
| Network (3) | Instradamento tra reti, indirizzi IP | Router |
| Transport (4) | Consegna dati, porte | TCP, UDP |
| Session (5) | Gestione sessioni | Apertura/chiusura connessioni |
| Presentation (6) | Formato, cifratura, compressione | SSL/TLS, formati file |
| Application (7) | Interfaccia con l''utente | HTTP, FTP, email |

## Il modello OSI in dettaglio

Il modello OSI (Open Systems Interconnection) divide la comunicazione di rete in 7 livelli, ognuno con un compito preciso e indipendente dagli altri. Questa separazione permette a produttori diversi di costruire dispositivi e software compatibili tra loro, perché ogni livello comunica solo con quelli immediatamente sopra e sotto.

Un modo comune per ricordare l''ordine dei livelli, dal più basso al più alto, è una frase mnemonica come "Per Favore Non Toccare Se Piove Acqua" (Fisico, Data Link, Network, Transport, Session, Presentation, Application).

Per l''esame, il trucco più utile è associare ogni livello a un esempio concreto: un cavo di rete è livello 1, uno switch lavora al livello 2, un router al livello 3, e un browser web al livello 7.

## Il modello TCP/IP

Il modello TCP/IP è quello effettivamente usato da Internet ed è più semplice, con solo 4 livelli che raggruppano le funzioni dei 7 livelli OSI:

- **Accesso alla rete**: corrisponde ai livelli Fisico e Data Link di OSI.
- **Internet**: corrisponde al livello Network di OSI, gestisce l''indirizzamento IP e l''instradamento.
- **Trasporto**: corrisponde al livello Transport di OSI, gestisce TCP e UDP.
- **Applicazione**: raggruppa i livelli Session, Presentation e Application di OSI.

Per l''esame CCST è importante saper far corrispondere i livelli OSI ai livelli TCP/IP equivalenti.

## Incapsulamento

Quando un dato viene inviato in rete, ogni livello aggiunge la propria intestazione (header) prima di passarlo al livello successivo: questo processo si chiama incapsulamento. Al livello Application il dato è ancora un messaggio; al livello Transport diventa un segmento con informazioni sulla porta; al livello Network diventa un pacchetto con indirizzi IP; al livello Data Link diventa un frame con indirizzi MAC.

Al momento della ricezione, il processo avviene al contrario: ogni livello rimuove la propria intestazione, un processo chiamato decapsulamento.

## Altri protocolli comuni e il loro livello

- **ARP** (tra Data Link e Network): traduce un indirizzo IP nel corrispondente indirizzo MAC del dispositivo sulla stessa rete locale; una risposta ARP restituisce l''indirizzo MAC associato a un IP.
- **ICMP** (livello Network): trasporta messaggi di controllo ed errore tra dispositivi IP; è il protocollo usato da strumenti come **ping** per verificare se un host è raggiungibile.
- **SNMP** (livello Application): usato per monitorare e amministrare dispositivi di rete (stato delle interfacce, traffico), tipicamente da un sistema di monitoraggio di rete.
- **DNS** (livello Application): traduce un nome di dominio nell''indirizzo IP corrispondente; è il protocollo che un browser usa per localizzare un server prima di contattarlo.
- **SMTP, POP3, IMAP** (livello Application): SMTP invia le email; per la ricezione viene combinato con POP3 o IMAP.
- **HTTPS** (livello Application, sopra TCP): è la versione sicura di HTTP, protetta con crittografia **TLS/SSL**. Viaggia su TCP, non su UDP, perché la trasmissione deve essere affidabile e ordinata.

## TCP, UDP e controllo di flusso

Il protocollo **TCP** stabilisce una connessione prima di iniziare a trasmettere, attraverso un breve scambio di messaggi noto come **three-way handshake** (SYN, SYN-ACK, ACK). Grazie a questo, TCP garantisce affidabilità: conferma la ricezione dei dati e li ritrasmette se si perdono. Il protocollo **UDP**, al contrario, non stabilisce alcuna connessione prima di inviare i dati: è più veloce ma non garantisce né l''ordine né la consegna — questa è la differenza fondamentale tra i due.

Il **controllo di flusso** (evitare che un mittente sovraccarichi un destinatario più lento, causando perdita di dati) non è una funzione esclusiva del livello Transport: può essere implementato anche al **livello Data Link**, oltre che al livello Transport, dove TCP lo gestisce con meccanismi avanzati.

## MTU e frammentazione dei pacchetti

Quando un pacchetto IP è più grande della dimensione massima trasmissibile su un collegamento (**MTU**, Maximum Transmission Unit), viene diviso in frammenti più piccoli per adattarsi ai limiti di trasmissione della rete attraversata. Questo avviene al **livello Network (3)**, ed è il protocollo **IP** a occuparsene; i frammenti vengono riassemblati a destinazione.

## Errori comuni nei quiz

- Confondere l''ordine dei 7 livelli OSI.
- Pensare che il modello TCP/IP abbia 7 livelli come OSI.
- Confondere il livello a cui lavora uno switch (2) con quello di un router (3).
- Pensare che l''indirizzo IP sia gestito al livello Data Link invece che al livello Network.
- Dimenticare che TCP e UDP lavorano al livello Transport.
- Confondere incapsulamento e decapsulamento.

## Mini scenario d''esame

Un tecnico deve spiegare perché uno switch non può instradare traffico tra due reti IP diverse, mentre un router sì. La risposta corretta fa riferimento al livello OSI: lo switch lavora al **livello Data Link (2)** e usa solo indirizzi MAC all''interno dello stesso segmento, mentre il router lavora al **livello Network (3)** e usa indirizzi IP per instradare traffico tra reti diverse.

## Mini checklist prima del quiz

Prima di iniziare il quiz dovresti saper spiegare:

- i 7 livelli del modello OSI in ordine;
- a cosa serve ciascun livello OSI;
- i 4 livelli del modello TCP/IP e la loro corrispondenza con OSI;
- cosa significa incapsulamento;
- un esempio di dispositivo o protocollo per ogni livello.' WHERE topic_id = 227;

-- Topic 229 -- Indirizzamento IP e subnetting (confermato)
UPDATE topic_review_pages SET content_it = '## Cosa devi sapere davvero

Ogni dispositivo su una rete IP ha bisogno di un indirizzo univoco per poter comunicare. Il CCST richiede di capire la struttura di un indirizzo IPv4, cosa fa una subnet mask, e la differenza tra indirizzi pubblici e privati. Il subnetting complesso non è richiesto quanto in CCNA, ma i concetti di base sì.

## Concetti chiave

- **Indirizzo IPv4**: identificatore a 32 bit, scritto in notazione decimale puntata (es. 192.168.1.10).
- **Subnet mask**: definisce quale parte dell''indirizzo IP identifica la rete e quale l''host.
- **Notazione CIDR**: indica il numero di bit di rete con una barra (es. /24 equivale a 255.255.255.0).
- **Indirizzo di rete**: il primo indirizzo di una subnet, usato per identificare la rete stessa.
- **Indirizzo di broadcast**: l''ultimo indirizzo di una subnet, usato per inviare dati a tutti i dispositivi della subnet.
- **Indirizzi IP privati**: intervalli riservati per reti interne, non instradabili su Internet.
- **Indirizzi IP pubblici**: assegnati e instradabili su Internet.
- **DHCP**: protocollo che assegna automaticamente indirizzi IP ai dispositivi.
- **Indirizzo statico**: indirizzo IP configurato manualmente e che non cambia.
- **Default gateway**: l''indirizzo IP del dispositivo (di solito un router) usato per raggiungere reti esterne alla propria subnet.

## Differenze da non confondere

| Concetto | Significato principale |
|---|---|
| Indirizzo di rete | Identifica la subnet, non un host specifico |
| Indirizzo di broadcast | Raggiunge tutti i dispositivi della subnet |
| Subnet mask | Separa parte di rete e parte di host |
| IP privato | Usato in reti interne, non instradabile su Internet |
| IP pubblico | Instradabile su Internet |
| DHCP | Assegnazione automatica dell''IP |
| Statico | Assegnazione manuale dell''IP |

## Struttura di un indirizzo IPv4

Un indirizzo IPv4 è composto da 32 bit, divisi in 4 gruppi di 8 bit (ottetti) scritti in decimale e separati da punti, ad esempio 192.168.1.10. Ogni ottetto può assumere un valore da 0 a 255.

La **subnet mask** indica quanti bit dell''indirizzo identificano la rete e quanti identificano l''host all''interno di quella rete. Ad esempio, con subnet mask 255.255.255.0 (o /24), i primi 24 bit identificano la rete e gli ultimi 8 bit identificano l''host, permettendo fino a 254 host utilizzabili.

## Notazione CIDR

La notazione CIDR (Classless Inter-Domain Routing) esprime la subnet mask come numero di bit di rete dopo una barra: /24 equivale a 255.255.255.0, /16 equivale a 255.255.0.0. Più basso è il numero dopo la barra, più host sono disponibili in quella subnet.

## Indirizzo di rete e di broadcast

In ogni subnet, il primo indirizzo è riservato per identificare la rete stessa (indirizzo di rete) e l''ultimo indirizzo è riservato per il broadcast, usato per inviare dati a tutti i dispositivi della subnet contemporaneamente. Nessuno dei due può essere assegnato a un singolo dispositivo come indirizzo host.

## Indirizzi pubblici e privati

Gli intervalli di indirizzi privati (definiti dalla RFC 1918) sono riservati per l''uso interno alle reti e non vengono instradati su Internet:

- 10.0.0.0 – 10.255.255.255
- 172.16.0.0 – 172.31.255.255
- 192.168.0.0 – 192.168.255.255

Gli indirizzi pubblici, invece, sono univoci a livello globale e instradabili su Internet. Un router domestico traduce tipicamente gli indirizzi privati della rete interna in un unico indirizzo pubblico tramite NAT per accedere a Internet.

## DHCP contro indirizzamento statico

Con **DHCP**, un server assegna automaticamente indirizzo IP, subnet mask, gateway e altri parametri ai dispositivi che si collegano alla rete, semplificando la gestione. Con un **indirizzo statico**, l''indirizzo viene configurato manualmente su ogni dispositivo e non cambia: utile per server, stampanti di rete o dispositivi che devono avere sempre lo stesso indirizzo.

## IPv6: le basi

**IPv6** è stato introdotto per risolvere l''esaurimento degli indirizzi IPv4 disponibili e per supportare un numero molto più grande di dispositivi connessi. Usa indirizzi a **128 bit** (contro i 32 bit di IPv4), scritti in notazione esadecimale (es. 2001:0db8::1), e offre anche un supporto migliorato per la configurazione automatica degli host.

Come IPv4 ha un indirizzo di loopback (127.0.0.1), IPv6 ha il suo: **::1**. Esiste anche una categoria di indirizzi IPv6 dedicata alla comunicazione all''interno dello stesso segmento di rete, gli indirizzi **link-local**, identificati dal prefisso **FE80::/10**: non sono instradabili su Internet, servono solo per comunicare con dispositivi collegati alla stessa rete locale.

## Indirizzi IPv4 speciali da riconoscere

- **169.254.x.x (APIPA)**: un dispositivo si assegna automaticamente un indirizzo in questo intervallo quando non riesce a contattare un server DHCP. Un indirizzo APIPA permette la comunicazione solo con altri dispositivi sulla stessa rete locale, non l''accesso a Internet — è quindi un segnale che il DHCP non sta funzionando.
- **0.0.0.0**: rappresenta un host non ancora configurato o una destinazione generica. Nel contesto di una tabella di routing, la **route predefinita (0.0.0.0/0)** indica il percorso da usare per qualsiasi destinazione che non corrisponde a nessun''altra route conosciuta.
- **Conflitto IP**: si verifica quando due dispositivi sulla stessa rete hanno lo stesso indirizzo IP, interrompendo la comunicazione di entrambi finché il conflitto non viene risolto.

## Classful, CIDR, VLSM e maschera wildcard

Prima di CIDR, gli indirizzi IPv4 venivano assegnati con l''**indirizzamento classful**: un metodo storico che divideva gli indirizzi in classi fisse (A, B, C) con subnet mask predefinite (una rete di classe C, ad esempio, usa sempre 255.255.255.0). Questo sistema sprecava molti indirizzi, perché un''organizzazione doveva prendere un''intera classe anche se non le servivano tutti gli host disponibili. Il **CIDR**, con le sue maschere di lunghezza variabile, ha risolto questo problema permettendo di dimensionare le subnet in base al reale numero di host necessari.

Il **VLSM** (Variable Length Subnet Mask) applica lo stesso principio all''interno di una singola rete: permette di usare subnet mask di lunghezza diversa per sottoreti diverse nella stessa infrastruttura, evitando di sprecare indirizzi assegnando la stessa maschera a segmenti con esigenze molto diverse.

La **maschera wildcard** è l''inverso di una subnet mask ed è usata in alcune configurazioni, come le liste di accesso (ACL), per definire un intervallo di indirizzi IP a cui applicare una regola.

## Errori comuni nei quiz

- Confondere indirizzo di rete e indirizzo di broadcast.
- Pensare che una subnet mask più corta (es. /16) offra meno host disponibili di una più lunga (es. /24) — è il contrario.
- Confondere indirizzi pubblici e privati.
- Pensare che un indirizzo assegnato da DHCP sia permanente come uno statico.
- Dimenticare che l''indirizzo di rete e quello di broadcast non sono utilizzabili da un host.
- Confondere il default gateway con l''indirizzo IP del dispositivo stesso.

## Mini scenario d''esame

Un tecnico deve configurare 4 dispositivi in una piccola rete con subnet 192.168.1.0/24. Deve assegnare indirizzi host validi, evitando l''indirizzo di rete (192.168.1.0) e quello di broadcast (192.168.1.255). Gli indirizzi utilizzabili vanno quindi da 192.168.1.1 a 192.168.1.254.

## Mini checklist prima del quiz

Prima di iniziare il quiz dovresti saper spiegare:

- la struttura di un indirizzo IPv4;
- cosa fa una subnet mask;
- cosa significa la notazione CIDR (es. /24);
- la differenza tra indirizzo di rete e indirizzo di broadcast;
- la differenza tra indirizzi pubblici e privati;
- la differenza tra DHCP e indirizzamento statico.' WHERE topic_id = 229;

-- Topic 231 -- Protocolli di rete e porte comuni (confermato)
UPDATE topic_review_pages SET content_it = '## Cosa devi sapere davvero

Ogni servizio di rete si basa su un protocollo che definisce le regole di comunicazione, e spesso su una porta specifica che identifica quel servizio. Il CCST richiede di riconoscere i protocolli più comuni, la differenza tra TCP e UDP, e le porte associate ai servizi principali.

## Concetti chiave

- **TCP (Transmission Control Protocol)**: protocollo orientato alla connessione, affidabile, verifica la consegna dei dati.
- **UDP (User Datagram Protocol)**: protocollo senza connessione, più veloce ma senza garanzia di consegna.
- **Porta**: numero che identifica un servizio specifico su un dispositivo.
- **HTTP**: protocollo per la navigazione web, non cifrato.
- **HTTPS**: versione cifrata di HTTP, usa TLS/SSL.
- **DNS**: traduce nomi di dominio in indirizzi IP.
- **DHCP**: assegna automaticamente indirizzi IP e altri parametri di rete.
- **FTP**: protocollo per il trasferimento di file.
- **SSH**: protocollo per l''accesso remoto sicuro e cifrato.
- **Telnet**: protocollo per l''accesso remoto non cifrato, ormai sconsigliato.

## Differenze da non confondere

| Protocollo | Porta | Trasporto | Funzione |
|---|---|---|---|
| HTTP | 80 | TCP | Navigazione web non cifrata |
| HTTPS | 443 | TCP | Navigazione web cifrata |
| DNS | 53 | TCP/UDP | Risoluzione nomi di dominio |
| DHCP | 67/68 | UDP | Assegnazione automatica IP |
| FTP | 20/21 | TCP | Trasferimento file |
| SSH | 22 | TCP | Accesso remoto cifrato |
| Telnet | 23 | TCP | Accesso remoto non cifrato |
| SMTP | 25 | TCP | Invio email |
| NTP | 123 | UDP | Sincronizzazione dell''orario tra dispositivi |
| SNMP | 161/162 | UDP | Monitoraggio e gestione di dispositivi di rete |
| RDP | 3389 | TCP | Accesso remoto grafico |
| POP3 | 110 (995 cifrata) | TCP | Riceve le email scaricandole dal server al client |
| IMAP | 143 (993 cifrata) | TCP | Riceve le email sincronizzandole, restano sul server |
| SFTP | 22 | TCP | Trasferimento file sicuro, sfrutta il canale SSH |
| TFTP | 69 | UDP | Trasferimento file semplice, senza autenticazione |

## TCP contro UDP

**TCP** stabilisce una connessione prima di inviare dati (handshake a tre vie), verifica che ogni pacchetto arrivi correttamente e li riordina se necessario. È usato quando l''affidabilità è più importante della velocità, come nella navigazione web o nel trasferimento file.

**UDP** invece invia i dati senza stabilire una connessione e senza verificarne la consegna. È più veloce e ha meno overhead, ed è usato quando la velocità è più importante dell''affidabilità totale, come nello streaming video o nelle chiamate VoIP, dove perdere qualche pacchetto è meno grave che avere ritardi.

Per l''esame: se una domanda parla di affidabilità, connessione stabilita, controllo degli errori, la risposta è TCP. Se parla di velocità, basso overhead, tolleranza a qualche perdita di dati, la risposta è UDP.

## Il concetto di porta

Una porta è un numero (da 0 a 65535) che identifica uno specifico servizio o applicazione su un dispositivo. Mentre l''indirizzo IP identifica il dispositivo, la porta identifica quale servizio su quel dispositivo deve ricevere i dati. Ad esempio, un server può eseguire contemporaneamente un servizio web (porta 80/443) e un servizio email (porta 25), distinguendoli tramite la porta.

## Protocolli applicativi comuni

**HTTP** e **HTTPS** servono per la navigazione web: HTTPS aggiunge cifratura tramite TLS/SSL, proteggendo i dati scambiati tra client e server.

**DNS** traduce i nomi di dominio leggibili (come certifyquiz.com) in indirizzi IP, che sono ciò che i dispositivi usano realmente per comunicare.

**DHCP** assegna automaticamente indirizzo IP, subnet mask, gateway e altri parametri ai dispositivi che si collegano a una rete.

**FTP** permette di trasferire file tra client e server, mentre **SSH** permette l''accesso remoto sicuro e cifrato a un dispositivo, sostituendo il più vecchio e non sicuro **Telnet**.

## ICMP, ARP e NAT: non hanno una porta come gli altri

**ICMP** e **ARP** sono protocolli fondamentali per il funzionamento della rete ma non usano un numero di porta TCP/UDP come i protocolli applicativi della tabella sopra: ICMP trasporta messaggi di controllo ed errore (è il protocollo usato dal comando **ping** per verificare la connettività), mentre ARP traduce un indirizzo IP nel corrispondente indirizzo MAC sulla rete locale.

**NAT** (Network Address Translation) non è un protocollo applicativo ma una tecnica: permette a più dispositivi con indirizzi IP privati di condividere un unico indirizzo IP pubblico per accedere a Internet, traducendo gli indirizzi in uscita e in ingresso sul router di bordo.

## Errori comuni nei quiz

- Confondere TCP e UDP in termini di affidabilità e velocità.
- Non ricordare le porte associate ai protocolli più comuni.
- Confondere HTTP e HTTPS.
- Pensare che DNS assegni indirizzi IP invece di tradurre nomi di dominio.
- Confondere DNS e DHCP.
- Pensare che SSH e Telnet offrano lo stesso livello di sicurezza.

## Mini scenario d''esame

Un''applicazione di videochiamata perde occasionalmente qualche fotogramma ma continua a funzionare senza interruzioni evidenti, privilegiando la fluidità rispetto alla perfezione di ogni singolo pacchetto. Questo comportamento è tipico di applicazioni che usano **UDP**, che non garantisce la consegna di ogni pacchetto ma riduce i ritardi.

## Mini checklist prima del quiz

Prima di iniziare il quiz dovresti saper spiegare:

- la differenza tra TCP e UDP;
- cos''è una porta e a cosa serve;
- le porte dei protocolli più comuni (HTTP, HTTPS, DNS, DHCP, FTP, SSH);
- la differenza tra HTTP e HTTPS;
- la differenza tra DNS e DHCP;
- perché SSH è preferibile a Telnet.' WHERE topic_id = 231;

-- Topic 235 -- Carriere e certificazioni nel networking (confermato, con correzione CCNA Security ritirato)
UPDATE topic_review_pages SET content_it = '## Cosa devi sapere davvero

A differenza degli altri topic più tecnici, questo argomento riguarda il contesto professionale del networking: che ruoli esistono, come si struttura un percorso di certificazione, e perché il CCST è pensato come primo passo. Il CCST include questo argomento perché è pensato anche per studenti e persone all''inizio della carriera.

## Concetti chiave

- **CCST (Cisco Certified Support Technician)**: certificazione entry-level pensata come primo passo nel networking, senza prerequisiti.
- **CCNA (Cisco Certified Network Associate)**: certificazione di livello associate, più approfondita del CCST.
- **Certificazioni professional**: livello intermedio-avanzato (es. CCNP), richiede più esperienza e conoscenze approfondite.
- **Certificazioni expert**: il livello più alto (es. CCIE), richiede anni di esperienza pratica.
- **Help desk / supporto tecnico**: ruolo entry-level tipico per chi inizia nel supporto IT e reti.
- **Network technician**: tecnico che installa, configura e mantiene apparati di rete.
- **Network administrator**: gestisce e amministra reti aziendali più complesse.
- **Network engineer**: progetta e implementa soluzioni di rete, ruolo più avanzato.
- **Soft skill**: capacità di comunicazione e problem solving, importanti quanto le competenze tecniche nei ruoli di supporto.
- **Formazione continua**: necessità di aggiornarsi costantemente per via della rapida evoluzione delle tecnologie di rete.

## Differenze da non confondere

| Livello certificazione | Esempio Cisco | Pubblico tipico |
|---|---|---|
| Entry | CCST | Chi inizia, senza esperienza pregressa |
| Associate | CCNA | Tecnici con basi consolidate |
| Professional | CCNP | Professionisti con esperienza |
| Expert | CCIE | Massimi esperti del settore |

## Il percorso di certificazione Cisco

Cisco struttura le proprie certificazioni per livelli crescenti di competenza. Il **CCST** è pensato come punto di ingresso, senza richiedere esperienza pregressa, ed è adatto a studenti o a chi si affaccia per la prima volta al mondo IT e networking.

Salendo di livello si trova il **CCNA**, che approfondisce concetti come routing, switching avanzato, sicurezza di base e automazione, richiedendo una comprensione più solida rispetto al CCST.

A livello **professional** (come il CCNP) le certificazioni richiedono esperienza pratica significativa e conoscenze specialistiche in aree come enterprise networking, sicurezza o collaborazione.

Al vertice si trovano le certificazioni **expert** (come il CCIE), riservate a professionisti con anni di esperienza e competenze molto approfondite, spesso richieste per ruoli di progettazione e architettura di rete complessi.

## Ruoli professionali nel networking

Chi inizia la carriera nel networking parte spesso da ruoli di **help desk** o supporto tecnico di primo livello, occupandosi di problemi comuni degli utenti. Con l''esperienza, si può passare a **network technician**, che installa e mantiene fisicamente gli apparati di rete, e poi a **network administrator**, che gestisce reti aziendali più complesse. Il ruolo di **network engineer** è tipicamente più avanzato, focalizzato sulla progettazione di soluzioni di rete. Al vertice di questo percorso si trova spesso il ruolo di **network architect**, che si occupa della progettazione strategica dell''architettura di rete complessiva, oltre alla singola soluzione tecnica.

## Percorsi di specializzazione Cisco

Oltre ai quattro livelli (entry, associate, professional, expert), Cisco offre percorsi di **specializzazione** per area tecnologica, soprattutto ai livelli professional:

- **CCNP Enterprise**: reti aziendali complesse e distribuite, per chi lavora con tecnologie di rete avanzate su larga scala.
- **CCNP Security**: protezione avanzata delle reti aziendali.
- **CCNP Collaboration**: telefonia IP e sistemi di videoconferenza.
- **CCNP Data Center**: gestione di infrastrutture di data center aziendali.
- **CCNA Security**: percorso storico (ritirato da Cisco nel 2020) legato alla protezione delle reti e alla cybersecurity a livello associate; oggi il percorso equivalente è **CyberOps Associate**.
- **DevNet Associate**: percorso pensato per chi sviluppa e automatizza applicazioni per reti Cisco, più orientato alla programmazione che alla configurazione tradizionale.

## Cisco Networking Academy e certificazioni vendor-specific

La **Cisco Networking Academy** è il programma didattico di Cisco che offre corsi e laboratori pratici sulle tecnologie di rete, spesso il punto di partenza per chi si prepara al CCST o al CCNA.

Si dice che una certificazione come quelle Cisco sia **vendor-specific**: è focalizzata sulle tecnologie proprietarie di un singolo produttore (in questo caso Cisco), a differenza di una certificazione vendor-neutral che copre concetti generali validi indipendentemente dalla marca dei dispositivi.

## Competenze tecniche e soft skill

Nel supporto tecnico e nel networking, le competenze tecniche da sole non bastano: comunicare in modo chiaro con utenti non tecnici, documentare i problemi risolti e collaborare con altri team sono competenze altrettanto importanti, specialmente nei ruoli a contatto diretto con gli utenti.

## Perché la formazione continua è importante

Le tecnologie di rete evolvono rapidamente: nuovi standard, protocolli e minacce di sicurezza emergono costantemente. Mantenere le proprie competenze aggiornate, anche dopo aver ottenuto una certificazione, è essenziale per rimanere rilevanti nel settore.

## Errori comuni nei quiz

- Confondere l''ordine dei livelli di certificazione Cisco (entry, associate, professional, expert).
- Pensare che il CCST richieda esperienza pregressa nel settore.
- Confondere i ruoli di network technician e network administrator.
- Sottovalutare l''importanza delle soft skill nei ruoli di supporto tecnico.
- Pensare che una certificazione, una volta ottenuta, elimini la necessità di aggiornarsi.

## Mini scenario d''esame

Uno studente senza esperienza pregressa nell''IT vuole iniziare un percorso nel networking. Gli viene consigliato di partire dal **CCST**, la certificazione entry-level pensata proprio per chi non ha ancora esperienza, prima di affrontare certificazioni più avanzate come il CCNA.

## Mini checklist prima del quiz

Prima di iniziare il quiz dovresti saper spiegare:

- i quattro livelli delle certificazioni Cisco (entry, associate, professional, expert);
- perché il CCST è pensato come primo passo;
- la differenza tra i ruoli di help desk, network technician, network administrator e network engineer;
- perché le soft skill sono importanti nei ruoli tecnici;
- perché la formazione continua è necessaria nel networking.' WHERE topic_id = 235;


-- ============================================================
-- FINE SESSIONE (topic 230, 227, 229, 231, 235)
-- Query di verifica da eseguire DOPO aver lanciato tutti gli UPDATE sopra,
-- confrontando con la tabella di backup creata a inizio file.
-- Ogni riga deve avere delta > 0 (le modifiche sono solo additive):
-- un delta <= 0 indica una sovrascrittura andata male su quel topic.
-- ============================================================
SELECT
  b.topic_id,
  LENGTH(b.content_it) AS len_prima,
  LENGTH(t.content_it) AS len_dopo,
  LENGTH(t.content_it) - LENGTH(b.content_it) AS delta
FROM topic_review_pages_backup_20260810 b
JOIN topic_review_pages t ON t.topic_id = b.topic_id
WHERE b.topic_id IN (230, 227, 229, 231, 235)
ORDER BY b.topic_id;
