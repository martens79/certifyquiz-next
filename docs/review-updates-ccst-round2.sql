-- Topic 226, 228, 233, 234, 232 CCST Networking: audit content gap fixes (seconda tranche)
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

-- Backup completo della tabella prima di qualsiasi UPDATE di questa tranche (eseguire una sola volta)
CREATE TABLE topic_review_pages_backup_ccst_round2_20260810
AS SELECT * FROM topic_review_pages;

-- Topic 226 -- Concetti base delle reti (confermato)
UPDATE topic_review_pages SET content_it = '## Cosa devi sapere davvero

Prima di parlare di modelli OSI, indirizzi IP o dispositivi specifici, il CCST Networking richiede di capire cosa sia davvero una rete e perché esiste. Questo topic copre il vocabolario e i concetti di base su cui si costruisce tutto il resto della certificazione.

Per l''esame devi conoscere a cosa serve una rete, come viaggiano i dati, e i termini che descrivono la qualità e la velocità di una connessione.

## Concetti chiave

- **Rete**: insieme di dispositivi collegati che condividono risorse e informazioni.
- **Nodo**: qualsiasi dispositivo collegato alla rete (PC, server, stampante, switch, router).
- **Modello client-server**: i client richiedono servizi o risorse, il server li fornisce.
- **Modello peer-to-peer (P2P)**: ogni dispositivo può fungere sia da client sia da server.
- **Banda passante (bandwidth)**: la capacità massima teorica di un collegamento, misurata in bit al secondo.
- **Throughput**: la quantità di dati effettivamente trasmessa in un certo periodo, spesso inferiore alla banda passante teorica.
- **Latenza**: il tempo che un dato impiega per andare da un punto all''altro della rete.
- **Pacchetto**: unità di dati trasmessa in rete, incapsulata con informazioni di instradamento.
- **Indirizzo MAC**: identificatore di livello 2 normalmente assegnato dal produttore all''interfaccia di rete, ma modificabile o virtualizzabile in alcuni sistemi.
- **Larghezza di banda condivisa vs dedicata**: alcune tecnologie di rete condividono la capacità tra più dispositivi, altre assegnano un canale dedicato.

- **LAN, WAN e PAN**: una LAN copre un''area ristretta (ufficio, edificio) con alte velocità; una WAN collega aree geografiche estese (città, stati, Internet stesso); una PAN collega dispositivi a corto raggio attorno a una persona (es. cuffie Bluetooth, smartwatch).
- **Intranet, Extranet e rete pubblica**: un''Intranet è una rete privata aziendale accessibile solo agli utenti interni; un''Extranet estende l''accesso controllato anche a partner o clienti esterni; una rete pubblica (come Internet) è aperta a chiunque, senza autorizzazioni specifiche.
- **VPN**: crea un canale sicuro e cifrato su una rete pubblica, permettendo a sedi remote o lavoratori da casa di collegarsi come se fossero in sede.
- **DHCP**: assegna automaticamente indirizzi IP e altri parametri di configurazione ai dispositivi che si collegano alla rete.
- **DNS**: traduce i nomi di dominio (es. www.esempio.com) in indirizzi IP numerici.
- **Gateway**: dispositivo che collega reti con protocolli differenti, traducendo i formati dei dati tra di esse.
- **Firewall**: controlla il traffico in entrata e in uscita in base a regole di sicurezza, per bloccare accessi non autorizzati.
- **Switch e Hub**: lo switch instrada i pacchetti solo verso la destinazione corretta e riduce le collisioni; l''hub inoltra i dati a tutte le porte, aumentando le collisioni e riducendo l''efficienza.
- **Access Point**: consente a dispositivi wireless di collegarsi a una rete cablata, estendendo la copertura Wi-Fi.
- **Modem**: converte i segnali provenienti dal provider Internet in un formato utilizzabile dalla rete locale.
- **MPLS**: tecnologia per collegamenti WAN che instrada i pacchetti tramite etichette, riducendo i tempi di elaborazione.
- **QoS (Quality of Service)**: insieme di tecniche che danno priorità a determinati tipi di traffico (es. voce, video) per garantire prestazioni costanti.
- **Topologie di rete**: stella (dispositivi collegati a un nodo centrale), bus (tutti su un unico cavo condiviso), anello (ogni nodo collegato al successivo in un anello chiuso), mesh (collegamenti multipli tra i nodi per ridondanza). Dettagli nel topic dedicato alle topologie.
- **Wi-Fi (IEEE 802.11)**: famiglia di standard per reti locali wireless (WLAN), permette la connessione senza cavi.
- **Rete convergente**: integra dati, voce e video sulla stessa infrastruttura di rete.

## Differenze da non confondere

| Concetto | Significato principale |
|---|---|
| Banda passante | Capacità massima teorica del collegamento |
| Throughput | Dati effettivamente trasmessi in pratica |
| Latenza | Tempo di percorrenza dei dati |
| Client-server | Ruoli distinti tra chi richiede e chi fornisce |
| Peer-to-peer | Ogni dispositivo è sia client che server |
| Nodo | Qualsiasi dispositivo collegato in rete |

## A cosa serve una rete

Una rete permette a dispositivi diversi di comunicare, condividere risorse (file, stampanti, connessione a Internet) e centralizzare servizi. Senza una rete, ogni computer sarebbe isolato e non potrebbe scambiare dati con altri.

Le reti si differenziano per dimensione (da poche stanze a interi continenti), tecnologia di trasmissione (cavo, fibra, wireless) e modello di funzionamento.

## Client-server contro peer-to-peer

Nel modello **client-server**, alcuni dispositivi (i server) offrono servizi centralizzati — come file, posta elettronica o pagine web — mentre altri dispositivi (i client) li richiedono. Questo modello è tipico delle reti aziendali, dove la gestione centralizzata semplifica sicurezza e manutenzione.

Nel modello **peer-to-peer**, non esiste un server dedicato: ogni dispositivo può condividere risorse direttamente con gli altri. È tipico delle reti domestiche piccole o della condivisione file diretta tra pochi PC.

Per l''esame: se una domanda descrive un dispositivo centrale che fornisce un servizio a più utenti, è client-server. Se descrive dispositivi alla pari che condividono risorse tra loro senza un centro, è peer-to-peer.

## Banda passante, throughput e latenza

Questi tre termini vengono spesso confusi ma descrivono aspetti diversi delle prestazioni di rete:

- la **banda passante** è il limite massimo teorico di un collegamento (ad esempio 100 Mbps);
- il **throughput** è quello che si ottiene realmente, spesso inferiore a causa di congestione, interferenze o overhead del protocollo;
- la **latenza** misura il ritardo, non la quantità di dati: una connessione può avere banda passante alta ma latenza elevata (ad esempio via satellite).

Un collegamento con alta banda passante ma alta latenza può comunque risultare poco reattivo per applicazioni in tempo reale come videochiamate o gaming online.

## Come viaggiano i dati: pacchetti e indirizzi

I dati non viaggiano in un unico blocco: vengono suddivisi in **pacchetti**, ognuno con informazioni di intestazione che indicano mittente, destinatario e altri dettagli necessari per l''instradamento.

Ogni interfaccia di rete possiede normalmente un **indirizzo MAC** assegnato dal produttore, usato per la comunicazione all''interno dello stesso segmento di rete locale. In alcuni sistemi il MAC può tuttavia essere modificato, virtualizzato o sostituito temporaneamente. L''indirizzamento IP, che identifica i dispositivi a livello di rete più ampio, è trattato in un topic dedicato.

## Errori comuni nei quiz

- Confondere banda passante e throughput.
- Pensare che una connessione con banda passante alta sia sempre veloce da usare, ignorando la latenza.
- Confondere client-server con peer-to-peer.
- Pensare che l''indirizzo MAC venga assegnato automaticamente dalla rete come un indirizzo IP. Normalmente identifica l''interfaccia a livello 2, anche se può essere modificato o virtualizzato.
- Credere che un nodo sia solo un computer, dimenticando switch, router e stampanti di rete.
- Confondere pacchetto con l''intero file trasmesso.

## Mini scenario d''esame

Un piccolo ufficio con 4 PC condivide direttamente file e una stampante senza un server dedicato. Ogni PC può accedere alle risorse condivise degli altri. Questo è un esempio di modello **peer-to-peer**, perché non esiste un dispositivo centrale che fornisce servizi agli altri: tutti i nodi hanno lo stesso ruolo.

## Mini checklist prima del quiz

Prima di iniziare il quiz dovresti saper spiegare:

- cosa fa una rete e perché esiste;
- la differenza tra client-server e peer-to-peer;
- la differenza tra banda passante, throughput e latenza;
- cosa sono un nodo e un pacchetto;
- cos''è un indirizzo MAC e a cosa serve.' WHERE topic_id = 226;

-- Topic 228 -- Dispositivi di rete (confermato)
UPDATE topic_review_pages SET content_it = '## Cosa devi sapere davvero

Ogni rete è composta da dispositivi con ruoli specifici: alcuni collegano dispositivi tra loro, altri instradano traffico tra reti diverse, altri ancora proteggono la rete o forniscono accesso wireless. Il CCST richiede di riconoscere il ruolo di ciascun dispositivo e sapere a quale livello OSI opera.

## Concetti chiave

- **Hub**: dispositivo di livello 1 che ripete il segnale a tutte le porte senza distinguere i destinatari.
- **Switch**: dispositivo di livello 2 che inoltra i frame solo alla porta corretta, in base all''indirizzo MAC.
- **Router**: dispositivo di livello 3 che instrada pacchetti tra reti diverse, in base all''indirizzo IP.
- **Access point (AP)**: dispositivo che permette a client wireless di collegarsi a una rete cablata.
- **Firewall**: dispositivo o software che filtra il traffico in base a regole di sicurezza.
- **Modem**: dispositivo che adatta o converte il segnale della rete locale nel formato richiesto dalla tecnologia di accesso del provider, e viceversa.
- **Repeater**: dispositivo che rigenera un segnale per estenderne la portata.
- **Bridge**: dispositivo che collega due segmenti di rete a livello 2, simile a uno switch ma più semplice.
- **Gateway**: dispositivo o punto di accesso che collega reti con protocolli diversi, spesso il punto di uscita verso Internet.

- **Server DHCP**: dispositivo o servizio che assegna automaticamente indirizzi IP e altre impostazioni di rete ai client.
- **Server DNS**: dispositivo o servizio che traduce nomi di dominio in indirizzi IP.
- **Proxy server**: dispositivo che intermedia le richieste dei client verso Internet, spesso mettendo in cache le pagine visitate; un proxy trasparente intercetta il traffico senza bisogno di configurazione sui client.
- **Load balancer**: dispositivo che distribuisce il traffico in ingresso tra più server, evitando sovraccarichi e garantendo alta disponibilità.
- **IDS/IPS**: dispositivi che monitorano il traffico per individuare attività sospette; l''IDS rileva e segnala, l''IPS può anche bloccare il traffico malevolo.
- **NAS (Network Attached Storage)**: dispositivo di archiviazione collegato in rete che permette di salvare e condividere file tra più utenti.
- **Patch panel**: pannello che organizza le terminazioni dei cavi di rete, semplificando i collegamenti tramite patch cord.
- **ODF (Optical Distribution Frame)**: quadro di distribuzione che organizza e protegge le connessioni in fibra ottica.
- **Media converter**: dispositivo che converte il segnale tra tipi di cablaggio differenti, ad esempio da fibra ottica a rame.
- **Controller WLAN**: dispositivo che centralizza la gestione di più access point in reti wireless aziendali.
- **Rack**: struttura standardizzata che alloggia e organizza dispositivi di rete e server.
- **TAP di rete**: dispositivo che duplica passivamente il traffico su un collegamento per analisi e monitoraggio, senza interromperlo.
- **VLAN su switch/router**: funzionalità che segmenta una rete fisica in più sottoreti virtuali, isolando il traffico e migliorando sicurezza ed efficienza (approfondito nel topic dedicato).
- **QoS su switch/router**: funzionalità che assegna priorità a determinati tipi di traffico (es. voce, video) rispetto al traffico generico.
- **Bridge wireless**: collega due reti o segmenti separati tramite una connessione Wi-Fi, utile quando non è possibile un collegamento via cavo tra sedi.

## Differenze da non confondere

| Dispositivo | Livello OSI | Funzione principale |
|---|---|---|
| Hub | 1 | Ripete il segnale a tutte le porte |
| Switch | 2 | Inoltra i frame in base al MAC |
| Router | 3 | Instrada i pacchetti in base all''IP |
| Access point | 1-2 | Collega client wireless alla rete |
| Firewall | Variabile | Filtra il traffico secondo regole |
| Modem | 1 | Adatta il segnale alla tecnologia di accesso del provider |

## Hub contro switch

Un **hub** è un dispositivo semplice che riceve un segnale su una porta e lo ripete su tutte le altre porte, senza sapere quale dispositivo debba effettivamente riceverlo. Questo genera traffico inutile e collisioni, ed è per questo che gli hub sono ormai obsoleti.

Uno **switch** invece impara quale indirizzo MAC si trova su quale porta e inoltra ogni frame solo alla porta corretta, riducendo il traffico inutile e le collisioni. Per l''esame: se una domanda descrive un dispositivo che "impara" gli indirizzi MAC e inoltra il traffico in modo mirato, è uno switch.

## Router

Il router instrada il traffico tra reti diverse, decidendo il percorso migliore in base all''indirizzo IP di destinazione. È il dispositivo che collega, ad esempio, una rete locale a Internet, ed è tipicamente il punto in cui viene applicato il default gateway dei dispositivi della rete.

## Access point e connettività wireless

Un access point estende una rete cablata permettendo a dispositivi wireless (laptop, smartphone, tablet) di collegarsi senza cavo. Molti dispositivi domestici combinano in un unico apparecchio le funzioni di router, switch, access point e talvolta modem: è importante saper distinguere le funzioni anche quando sono racchiuse in un solo dispositivo fisico.

## Firewall

Un firewall filtra il traffico in ingresso e in uscita in base a regole predefinite, bloccando ciò che non è esplicitamente consentito (o viceversa, a seconda della configurazione). Può essere un dispositivo dedicato, una funzione integrata nel router, o un software installato su un singolo computer.

## Modem

Il modem adatta o converte il segnale proveniente dalla rete locale nel formato richiesto dalla tecnologia di accesso utilizzata dal provider, come DSL o rete via cavo. Nelle connessioni in fibra questa funzione può essere svolta da un terminale ottico chiamato ONT. In molte installazioni domestiche, il modem o l''ONT fornisce quindi al router l''accesso alla rete del provider.

## Errori comuni nei quiz

- Confondere hub e switch.
- Pensare che un router lavori allo stesso livello OSI di uno switch.
- Dimenticare che un access point serve a collegare dispositivi wireless, non a instradare tra reti diverse.
- Confondere modem e router: il modem si collega al provider, il router instrada il traffico all''interno della rete locale e verso l''esterno.
- Pensare che un firewall sia sempre un dispositivo fisico separato.
- Confondere repeater e bridge.

## Mini scenario d''esame

Un tecnico nota che, collegando più PC a un vecchio hub, la rete diventa lenta e piena di collisioni quando molti dispositivi trasmettono insieme. Sostituendo l''hub con uno **switch**, il problema si risolve, perché lo switch inoltra il traffico solo alla porta corretta invece di ripeterlo su tutte le porte.

## Mini checklist prima del quiz

Prima di iniziare il quiz dovresti saper spiegare:

- la differenza tra hub e switch;
- a cosa serve un router rispetto a uno switch;
- il ruolo di un access point;
- la differenza tra modem e router;
- a cosa serve un firewall;
- a quale livello OSI lavora ciascun dispositivo.' WHERE topic_id = 228;

-- Topic 233 -- Sicurezza di rete (confermato)
UPDATE topic_review_pages SET content_it = '## Cosa devi sapere davvero

Il CCST Networking richiede una conoscenza introduttiva della sicurezza di rete: cosa protegge una rete, quali strumenti si usano comunemente, e alcuni concetti base di autenticazione e minacce comuni. Non è richiesta la profondità di una certificazione dedicata alla sicurezza.

## Concetti chiave

- **Firewall**: filtra il traffico di rete in base a regole predefinite.
- **VPN (Virtual Private Network)**: crea un collegamento cifrato su una rete non affidabile.
- **Autenticazione**: verifica dell''identità di un utente o dispositivo.
- **Autorizzazione**: definizione di cosa un utente autenticato può fare.
- **Password policy**: regole per creare e gestire password sicure.
- **Malware**: software dannoso, include virus, worm, ransomware e spyware.
- **Phishing**: tentativo di ingannare un utente per rubare credenziali o dati.
- **Aggiornamenti di sicurezza (patch)**: correzioni che risolvono vulnerabilità note.
- **Wi-Fi sicuro (WPA2/WPA3)**: standard di cifratura per proteggere le reti wireless.
- **Segmentazione di rete**: divisione della rete per limitare la diffusione di un attacco.

- **DoS e DDoS**: un attacco DoS (Denial of Service) rende un servizio indisponibile sovraccaricandolo da una singola fonte; un DDoS (Distributed) usa più dispositivi contemporaneamente, rendendo l''attacco più difficile da bloccare.
- **Vulnerabilità ed exploit**: una vulnerabilità è una debolezza di un sistema che può essere sfruttata; un exploit è il codice o la tecnica usata per sfruttarla concretamente.
- **IDS e IPS**: un IDS (Intrusion Detection System) rileva e segnala attività sospette; un IPS (Intrusion Prevention System) può anche bloccarle automaticamente.
- **Privilegio minimo e RBAC**: il principio del privilegio minimo assegna a ogni utente solo i permessi strettamente necessari; l''RBAC (Role-Based Access Control) assegna questi permessi in base al ruolo aziendale.
- **Antivirus vs antimalware**: l''antivirus tradizionale rileva principalmente virus; l''antimalware moderno protegge anche da ransomware, spyware e altre minacce più ampie.
- **Man-in-the-Middle (MITM) / on-path attack**: attacco in cui un aggressore si inserisce tra due parti comunicanti per intercettare o alterare i dati senza che se ne accorgano; Cisco usa sempre più spesso "on-path attack" come termine più recente per lo stesso attacco.
- **Hashing e salt**: l''hashing trasforma una password in una stringa non reversibile; il salt è un valore casuale aggiunto prima dell''hashing per rendere più difficili gli attacchi con tabelle precalcolate.
- **Certificato digitale SSL/TLS**: documento che autentica l''identità di un sito web e abilita la cifratura della connessione.
- **Honeypot**: sistema volutamente vulnerabile usato come esca per attirare e studiare gli attaccanti.
- **Zero Trust**: modello di sicurezza che non si fida per default di alcun utente o dispositivo, dentro o fuori la rete.
- **IPsec**: insieme di protocolli che cifrano e autenticano le comunicazioni IP, usato spesso nelle VPN.
- **Crittografia end-to-end**: garantisce che solo mittente e destinatario possano leggere i dati, impedendo l''accesso anche agli intermediari della trasmissione.
- **Social engineering**: categoria di attacchi che sfrutta la fiducia o la disattenzione delle persone, non le vulnerabilità tecniche, per ottenere informazioni riservate; il phishing ne è un esempio.
- **Packet sniffer**: strumento (es. Wireshark) che cattura e analizza i pacchetti che attraversano una rete, a scopo diagnostico o, se usato in modo malevolo, per intercettare dati.
- **Backdoor**: accesso nascosto a un sistema, creato intenzionalmente o installato da un malware, che permette di aggirare i normali meccanismi di autenticazione.
- **Attacco brute force**: tentativo automatizzato di indovinare una password provando sistematicamente tutte le combinazioni possibili.
- **Log di sicurezza**: registrazione degli eventi rilevanti (accessi, errori, tentativi di intrusione) usata per individuare attività sospette.
- **2FA/MFA**: richiede due o più fattori distinti per verificare l''identità (es. password + codice OTP o impronta digitale), riducendo il rischio anche in caso di password compromessa.
- **Patch management**: processo organizzativo di pianificazione, test e installazione degli aggiornamenti di sicurezza, per ridurre sistematicamente il rischio di exploit.

## Differenze da non confondere

| Concetto | Significato principale |
|---|---|
| Autenticazione | Verifica dell''identità |
| Autorizzazione | Definizione di cosa si può fare |
| Firewall | Filtra il traffico secondo regole |
| VPN | Cifra il collegamento su rete non affidabile |
| Malware | Software dannoso in generale |
| Phishing | Inganno per rubare credenziali o dati |

## Firewall e VPN

Un **firewall** filtra il traffico in ingresso e in uscita da una rete, bloccando ciò che non rispetta le regole configurate. Può proteggere una rete intera o un singolo dispositivo.

Una **VPN** crea un tunnel cifrato tra due punti, permettendo di scambiare dati in modo sicuro anche su una rete pubblica o non affidabile, come una connessione Wi-Fi gratuita. È molto usata per permettere l''accesso remoto sicuro alle risorse aziendali.

## Autenticazione contro autorizzazione

L''**autenticazione** verifica che un utente sia davvero chi dichiara di essere, tipicamente tramite password, ma anche con altri fattori come token o dati biometrici. L''**autorizzazione** avviene dopo l''autenticazione e stabilisce quali azioni o risorse quell''utente può effettivamente usare.

Per l''esame: se una domanda parla di verificare l''identità, è autenticazione. Se parla di stabilire cosa un utente può fare, è autorizzazione.

## Minacce comuni

Il **malware** è un termine generale per qualsiasi software dannoso: virus (si diffonde infettando altri file), worm (si diffonde autonomamente in rete), ransomware (cifra i dati chiedendo un riscatto) e spyware (raccoglie informazioni senza consenso).

Il **phishing** non è un tipo di malware ma una tecnica di inganno: un attaccante si finge un ente affidabile (banca, azienda, collega) per convincere la vittima a rivelare credenziali o dati sensibili, spesso tramite email o siti falsi.

## Buone pratiche di sicurezza

Una **password policy** efficace richiede password lunghe e univoche per ogni servizio, preferibilmente protette anche tramite autenticazione multifattore. Le password devono essere cambiate in caso di sospetta compromissione o quando previsto dalle policy organizzative, evitando cambi periodici arbitrari che possono favorire password più deboli. Gli **aggiornamenti di sicurezza** correggono vulnerabilità note nei sistemi operativi e nelle applicazioni: ritardare l''installazione delle patch lascia i sistemi esposti a exploit già conosciuti.

Per le reti wireless, usare **WPA2 o WPA3** invece del più vecchio e insicuro WEP è fondamentale per proteggere la connessione da intercettazioni.

La **segmentazione di rete** (ad esempio tramite VLAN) limita i danni di una compromissione, impedendo a un attaccante che ha violato un segmento di raggiungere facilmente il resto della rete.

## Errori comuni nei quiz

- Confondere autenticazione e autorizzazione.
- Pensare che phishing sia un tipo di malware invece di una tecnica di inganno.
- Confondere virus e worm.
- Pensare che una VPN sostituisca completamente la necessità di un firewall.
- Dimenticare che WEP è uno standard wireless ormai insicuro.
- Pensare che gli aggiornamenti di sicurezza siano opzionali o rimandabili senza rischio.

## Mini scenario d''esame

Un dipendente riceve un''email che sembra provenire dalla propria banca, che chiede di cliccare un link e inserire le credenziali per "verificare l''account". Il sito collegato è falso e progettato per rubare le credenziali. Questo è un classico esempio di **phishing**, una tecnica di inganno che sfrutta la fiducia dell''utente più che una vulnerabilità tecnica.

## Mini checklist prima del quiz

Prima di iniziare il quiz dovresti saper spiegare:

- a cosa serve un firewall e a cosa serve una VPN;
- la differenza tra autenticazione e autorizzazione;
- la differenza tra virus, worm, ransomware e spyware;
- cos''è il phishing;
- perché WPA2/WPA3 sono preferibili a WEP;
- perché gli aggiornamenti di sicurezza sono importanti.' WHERE topic_id = 233;

-- Topic 234 -- Troubleshooting e diagnostica (confermato)
UPDATE topic_review_pages SET content_it = '## Cosa devi sapere davvero

Quando una rete non funziona come dovrebbe, servono un metodo e degli strumenti per individuare il problema. Il CCST richiede di conoscere i comandi diagnostici di base e un approccio sistematico alla risoluzione dei problemi.

## Concetti chiave

- **ping**: verifica la raggiungibilità di un dispositivo e misura il tempo di risposta.
- **traceroute (o tracert)**: mostra il percorso che i pacchetti seguono verso una destinazione, salto per salto.
- **ipconfig / ifconfig**: mostra la configurazione IP del dispositivo locale.
- **nslookup**: interroga un server DNS per verificare la risoluzione di un nome di dominio.
- **Metodo di troubleshooting a livelli**: approccio che verifica un problema partendo da un livello OSI (spesso il livello fisico) e procedendo verso l''alto.
- **Isolamento del problema**: determinare se il problema riguarda un singolo dispositivo, un segmento di rete o l''intera rete.
- **Documentazione**: registrazione di cosa è stato verificato e delle modifiche apportate durante la risoluzione.
- **Baseline**: comportamento normale di riferimento, utile per riconoscere un''anomalia.
- **Cavo di rete difettoso**: una delle cause più comuni di problemi a livello fisico.
- **Conflitto di indirizzo IP**: quando due dispositivi hanno lo stesso indirizzo IP nella stessa rete.

- **netstat**: mostra le connessioni di rete attive e le porte in ascolto sul dispositivo.
- **Wireshark**: packet sniffer che cattura e analizza in dettaglio il traffico di rete.
- **MTU**: dimensione massima di un pacchetto trasmettibile su un''interfaccia senza frammentazione; un MTU non corretto può causare rallentamenti o malfunzionamenti (approfondito nel topic sui modelli OSI/TCP-IP).
- **arp -a**: mostra la tabella ARP, che associa indirizzi IP a indirizzi MAC nella rete locale.
- **ping continuo (ping -t)**: invia pacchetti ICMP in modo indefinito, utile per monitorare la stabilità di una connessione e individuare disconnessioni intermittenti.
- **Loopback test**: verifica che lo stack TCP/IP funzioni correttamente sul dispositivo locale (es. ping verso 127.0.0.1), indipendentemente dalla rete esterna; un cavo di loopback fa lo stesso a livello fisico, reindirizzando il segnale verso la porta stessa.
- **Speed test**: verifica se la velocità di download/upload reale corrisponde a quella dichiarata dal provider.
- **ip addr**: comando Linux più recente, alternativo a ifconfig, che mostra le stesse informazioni sulle interfacce di rete.
- **ipconfig /all e /flushdns**: /all mostra la configurazione di rete completa (IP, gateway, DNS, MAC); /flushdns svuota la cache DNS locale forzando nuove risoluzioni dei nomi.
- **Bottleneck**: punto della rete dove la capacità di trasferimento è inferiore al resto, che rallenta l''intero flusso di dati.
- **Perdita di pacchetti (packet loss)**: può essere causata da congestione, interferenze, cavi difettosi o dispositivi sovraccarichi.
- **Aggiornamento firmware**: come tecnica di troubleshooting, corregge bug e vulnerabilità che possono causare problemi di stabilità o compatibilità.
- **Reset di fabbrica**: come tecnica di troubleshooting, riporta un dispositivo alle impostazioni originali quando configurazioni errate ne impediscono il funzionamento (dettagli sul comando nel topic sulla configurazione base).
- **Monitoraggio in tempo reale**: strumenti dedicati che osservano costantemente lo stato della rete, permettendo di rilevare rapidamente picchi di traffico, latenza anomala o disconnessioni prima che diventino problemi critici.
- **Log di sistema**: registrano eventi come errori e modifiche di configurazione, utili per individuare la causa di un malfunzionamento.
- **"Request timed out"**: messaggio che indica che un pacchetto ICMP non ha ricevuto risposta entro il tempo limite, spesso per problemi di rete o firewall che bloccano ICMP.
- **Test incrociato**: collegare un altro dispositivo alla stessa rete per capire se il problema è del dispositivo originale o della rete stessa.
- **Confronto con backup della configurazione**: confrontare la configurazione attuale con una versione precedente funzionante aiuta a individuare modifiche che hanno introdotto l''errore.

## Differenze da non confondere

| Strumento | Cosa mostra |
|---|---|
| ping | Se un host è raggiungibile e il tempo di risposta |
| traceroute | Il percorso salto per salto verso una destinazione |
| ipconfig/ifconfig | La configurazione IP del dispositivo locale |
| nslookup | La risoluzione di un nome di dominio tramite DNS |

## Il metodo di troubleshooting a livelli

Un approccio efficace e molto citato nel CCST è verificare i problemi partendo dal **livello fisico** (il cavo è collegato? la porta funziona? la luce del link è accesa?) e risalendo progressivamente: livello Data Link (lo switch vede il dispositivo?), livello Network (l''indirizzo IP è corretto?), fino ai livelli superiori (il servizio applicativo risponde?).

Questo approccio evita di saltare direttamente a ipotesi complesse quando la causa può essere qualcosa di semplice, come un cavo scollegato.

## Strumenti diagnostici di base

Il comando **ping** invia pacchetti di test verso un indirizzo IP o un nome di dominio e verifica se arriva una risposta, misurando anche il tempo di andata e ritorno. È il primo strumento da usare per capire se un dispositivo è raggiungibile.

Il comando **traceroute** (o tracert su Windows) mostra ogni "salto" (router) attraversato dai pacchetti prima di raggiungere la destinazione, utile per capire dove esattamente lungo il percorso si verifica un problema.

Il comando **ipconfig** (Windows) o **ifconfig** (Linux/Mac) mostra la configurazione IP corrente del dispositivo: indirizzo IP, subnet mask, gateway. È il primo passo per verificare se il dispositivo ha ricevuto una configurazione di rete valida.

Il comando **nslookup** permette di verificare se un nome di dominio viene risolto correttamente in un indirizzo IP, utile per isolare problemi di DNS.

## Isolare il problema

Un passaggio chiave del troubleshooting è capire se il problema riguarda un singolo dispositivo, un intero segmento di rete o solo un servizio specifico. Ad esempio, se un solo PC non riesce a navigare ma altri PC sulla stessa rete funzionano normalmente, il problema è probabilmente locale a quel dispositivo, non alla rete nel suo complesso.

## Documentazione e baseline

Conoscere il comportamento normale di una rete (**baseline**) aiuta a riconoscere più rapidamente un''anomalia. Documentare cosa è stato verificato durante la risoluzione di un problema aiuta a evitare di ripetere gli stessi controlli e facilita la collaborazione con altri tecnici.

## Errori comuni nei quiz

- Confondere ping e traceroute.
- Pensare che ipconfig modifichi la configurazione di rete invece di mostrarla soltanto.
- Saltare i controlli di livello fisico per ipotizzare subito cause più complesse.
- Non isolare se il problema riguarda un singolo dispositivo o l''intera rete.
- Dimenticare di verificare un conflitto di indirizzo IP come possibile causa.
- Ignorare l''importanza della documentazione durante la risoluzione di un problema.

## Mini scenario d''esame

Un utente segnala che non riesce a raggiungere un sito web. Il tecnico esegue ping verso l''indirizzo IP del server e ottiene risposta, ma il ping verso il nome di dominio fallisce. Questo indica un probabile problema di **risoluzione DNS**, non di connettività di rete generale, perché la comunicazione tramite indirizzo IP funziona correttamente.

## Mini checklist prima del quiz

Prima di iniziare il quiz dovresti saper spiegare:

- a cosa serve il comando ping;
- a cosa serve traceroute;
- a cosa serve ipconfig/ifconfig;
- il metodo di troubleshooting a livelli, partendo dal livello fisico;
- come isolare se un problema riguarda un dispositivo o l''intera rete;
- perché la documentazione è utile durante il troubleshooting.' WHERE topic_id = 234;

-- Topic 232 -- Configurazione base router e switch (confermato)
UPDATE topic_review_pages SET content_it = '## Cosa devi sapere davvero

Il CCST richiede di conoscere i concetti fondamentali per accedere e configurare un dispositivo di rete, senza il livello di dettaglio approfondito richiesto in certificazioni più avanzate. Devi capire come si accede a un dispositivo, cosa sono le interfacce, e il concetto base di VLAN.

## Concetti chiave

- **Console**: accesso diretto e locale a un dispositivo tramite cavo dedicato, usato per la configurazione iniziale.
- **Interfaccia di gestione**: indirizzo IP dedicato per amministrare il dispositivo da remoto.
- **Interfaccia (porta)**: punto fisico o logico di connessione su router o switch.
- **Configurazione running e startup**: la configurazione attiva in memoria (running) e quella salvata permanentemente (startup).
- **VLAN (Virtual LAN)**: segmentazione logica di una rete fisica in più reti separate.
- **Porta trunk**: porta che trasporta il traffico di più VLAN contemporaneamente.
- **Porta access**: porta assegnata a una singola VLAN, usata per collegare dispositivi finali.
- **Firmware**: software di base che gestisce il funzionamento del dispositivo di rete.
- **Backup della configurazione**: salvataggio della configurazione per poterla ripristinare in caso di problemi.
- **Reset di fabbrica**: operazione che riporta un dispositivo alle impostazioni originali.

## Differenze da non confondere

| Concetto | Significato principale |
|---|---|
| Configurazione running | Configurazione attiva in memoria, si perde al riavvio se non salvata |
| Configurazione startup | Configurazione salvata permanentemente, caricata all''avvio |
| Porta access | Collegata a una singola VLAN |
| Porta trunk | Trasporta più VLAN contemporaneamente |
| Console | Accesso locale diretto |
| Interfaccia di gestione | Accesso remoto tramite IP dedicato |

## Accesso a un dispositivo di rete

La configurazione iniziale di un router o switch avviene tipicamente tramite **porta console**, un collegamento diretto che non richiede una rete già funzionante. Dopo la configurazione iniziale, è possibile abilitare l''accesso da remoto configurando un''**interfaccia di gestione** con un indirizzo IP dedicato, raggiungibile tramite protocolli come SSH.

## Configurazione running e startup

Quando si modifica la configurazione di un dispositivo, le modifiche vengono applicate immediatamente alla **configurazione running**, attiva in memoria volatile. Se il dispositivo viene riavviato senza salvare, queste modifiche vengono perse. Per renderle permanenti, la configurazione running deve essere copiata nella **configurazione startup**, salvata in memoria non volatile e caricata automaticamente a ogni riavvio.

## VLAN: segmentazione logica

Una **VLAN** permette di dividere logicamente una rete fisica in più reti separate, come se ogni VLAN fosse una rete indipendente, anche se i dispositivi condividono lo stesso switch fisico. Questo migliora sicurezza e organizzazione, separando ad esempio il traffico del reparto amministrativo da quello del reparto tecnico.

Una porta **access** viene assegnata a una singola VLAN ed è tipicamente usata per collegare un dispositivo finale come un PC. Una porta **trunk** invece trasporta il traffico di più VLAN contemporaneamente, ed è tipicamente usata per collegare tra loro due switch o uno switch a un router.

## Comandi CLI essenziali (Cisco IOS)

| Comando | Funzione |
|---|---|
| `configure terminal` | Entra in modalità di configurazione globale (da modalità privilegiata, dopo `enable`) |
| `hostname <nome>` | Imposta il nome del dispositivo |
| `line console 0` + `password <pwd>` + `login` | Configura la password di accesso via console |
| `enable secret <pwd>` | Imposta la password cifrata per la modalità privilegiata |
| `interface <tipo/numero>` (es. `interface g0/1`) | Entra nella configurazione di una specifica interfaccia |
| `no shutdown` | Attiva un''interfaccia. Sui **router** le interfacce sono disattivate di default e va sempre eseguito; sugli **switch** le porte sono già attive di default (serve solo se qualcuno le ha disattivate manualmente) |
| `show ip interface brief` | Riepilogo di indirizzo IP, stato fisico e amministrativo di tutte le interfacce |
| `description <testo>` | Aggiunge un commento descrittivo all''interfaccia |
| `ip default-gateway <indirizzo>` | Imposta il gateway predefinito su uno switch layer 2 |
| `ip route 0.0.0.0 0.0.0.0 <next-hop>` | Configura la route di default |
| `show ip route` | Mostra la tabella di routing |
| `switchport mode access` | Assegna la porta a una singola VLAN |
| `switchport mode trunk` | Configura la porta per trasportare più VLAN (protocollo di trunking 802.1Q) |
| `copy running-config startup-config` (o `write memory`) | Salva la configurazione attiva in NVRAM |
| `copy startup-config running-config` | Carica la configurazione salvata in NVRAM nella memoria attiva |
| `erase startup-config` | Cancella la configurazione salvata in NVRAM |
| `reload` | Riavvia il dispositivo |
| `ip domain-name <dominio>` + `crypto key generate rsa` | Imposta il dominio e genera le chiavi RSA necessarie per SSH (dopo aver configurato l''hostname) |
| `username <user> secret <pwd>` | Crea un utente locale per l''autenticazione |
| `line vty 0 4` + `transport input ssh` | Abilita l''accesso remoto sulle linee VTY limitandolo a SSH |
| `banner motd` | Mostra un messaggio prima dell''accesso al dispositivo |
| `ping` / `traceroute` | Testano rispettivamente la raggiungibilità e il percorso verso una destinazione |

## Backup e ripristino

Salvare periodicamente una copia della configurazione di un dispositivo permette di ripristinarla rapidamente in caso di guasto, sostituzione hardware o errore di configurazione. Un **reset di fabbrica** riporta invece il dispositivo alle impostazioni originali, cancellando qualsiasi configurazione personalizzata: va usato con cautela.

## Errori comuni nei quiz

- Confondere configurazione running e startup.
- Dimenticare di salvare la configurazione running come startup dopo una modifica.
- Confondere porta access e porta trunk.
- Pensare che una VLAN richieda switch fisici separati invece di una segmentazione logica sullo stesso switch.
- Confondere l''accesso via console con l''accesso via interfaccia di gestione remota.
- Pensare che un reset di fabbrica sia reversibile senza un backup precedente.

## Mini scenario d''esame

Un tecnico configura un nuovo switch tramite cavo console, crea due VLAN per separare il traffico amministrativo da quello ospiti, e collega gli switch di due piani diversi con una porta configurata per trasportare entrambe le VLAN. Questa porta di collegamento tra i due switch deve essere configurata come porta **trunk**, perché deve trasportare il traffico di più VLAN.

## Mini checklist prima del quiz

Prima di iniziare il quiz dovresti saper spiegare:

- come si accede a un dispositivo di rete per la prima configurazione;
- la differenza tra configurazione running e startup;
- cos''è una VLAN e perché si usa;
- la differenza tra porta access e porta trunk;
- perché è importante salvare un backup della configurazione.' WHERE topic_id = 232;


-- ============================================================
-- FINE SESSIONE (topic 226, 228, 233, 234, 232)
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
FROM topic_review_pages_backup_ccst_round2_20260810 b
JOIN topic_review_pages t ON t.topic_id = b.topic_id
WHERE b.topic_id IN (226, 228, 233, 234, 232)
ORDER BY b.topic_id;
