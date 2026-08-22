# Audit didattico — Cisco CCST Networking (certification_id=33)

Data: 2026-08-10
Metodo: per ciascuno dei 10 topic, estrazione di tutte le domande (`questions.question`/`explanation`, colonna IT) via query dirette sul DB di produzione, lettura del Review associato (`topic_review_pages.content_it`/`intro_it`), individuazione dei concetti candidati e verifica di ciascuno con query REGEXP mirate sui termini esatti. Ogni gap riportato è accompagnato dalla lista completa degli ID domanda che lo testano (nessuna stima "circa N domande"). Falsi positivi (menzioni incidentali, match deboli) scartati a mano prima di includere una riga. Due claim (topic 230 "topologia ad albero", topic 232 "comandi di salvataggio config") sono stati verificati indipendentemente con query dirette e confermati esatti.

Legenda azione: **Nessuna** = già coperto bene · **Aggiungere spiegazione breve** = 1 riga/bullet nel Review · **Aggiungere sezione dedicata** = manca un intero blocco tematico. Il Review deve restare "ripasso rapido": gli interventi proposti sono quasi tutti a livello di singolo bullet, non di capitolo nuovo.

## Stato di avanzamento

**Contenuto IT: CHIUSO — tutti e 10 i topic coperti.**
- Tranche 1 (topic 230, 227, 229, 231, 235): scritta, confermata, eseguita in produzione in una sessione precedente. File: `review-updates-ccst.sql`.
- Tranche 2 (topic 226, 228, 233, 234, 232 — 2026-08-10): scritta, confermata, eseguita in produzione. File: `review-updates-ccst-round2.sql`.

**Traduzioni EN/FR/ES: SQL pronto, non ancora eseguito.**
Il 2026-08-10, dopo la chiusura della tranche 2, tutti e 10 i topic sono stati tradotti in EN/FR/ES (non solo i 5 di tranche 2). Scoperta rilevante durante il lavoro: solo i topic 226 e 228 avevano già traduzioni "vere" (sezioni tematiche a specchio dell'IT); gli altri 8 avevano un template generico auto-generato, identico per ogni topic e scollegato dal contenuto IT reale. Per questo si è deciso di ricostruire tutte e 10 le pagine per intero nelle 3 lingue (non un semplice innesto del delta), seguendo lo stile del topic 226. SQL in `review-updates-ccst-translations.sql` — 30 UPDATE (10 topic × 3 lingue), ciascuno una sostituzione completa di `content_<lang>`. Verificato: 0 apostrofi non escapati su tutti i 30 blocchi. Comandi Cisco IOS e termini tecnici universali (VPN, DHCP, VLAN, MAC, IDS/IPS, ecc.) lasciati non tradotti.

---

## Topic 226 — Concetti base delle reti (90 domande)

Review copre solo: definizione di rete, nodo, client-server, P2P, banda passante, throughput, latenza, pacchetto, indirizzo MAC.

| Concetto | ID domande | Nel Review | Azione proposta |
|---|---|---|---|
| Tipologie di rete per estensione (LAN/WAN/PAN) | 3266, 3270, 3280, 14088, 14089, 14096, 14097, 14116, 14117 | NO | Aggiungere bullet LAN/WAN/PAN con esempio |
| Intranet, Extranet, rete pubblica/privata | 3267, 3275, 3285, 14090, 14091, 14106, 14107, 14126, 14127 | NO | Aggiungere riga su Intranet vs Extranet vs pubblica |
| VPN | 3274, 14104, 14105 | NO | Una riga: VPN cifra il collegamento su rete non affidabile |
| DHCP | 3281, 14118, 14119 | NO | Aggiungere bullet DHCP (assegna IP automaticamente) |
| DNS | 3293, 14142, 14143 | NO | Aggiungere bullet DNS (traduce nomi in IP) |
| Gateway | 3269, 14094, 14095 | NO | Bullet: gateway collega reti/protocolli diversi |
| Firewall | 3272, 14100, 14101 | NO | Bullet: firewall filtra il traffico |
| Switch, Hub e collisioni di rete | 3282, 3291, 14120, 14121, 14138, 14139 | NO | Bullet su switch vs hub e dominio di collisione |
| Access Point | 3290, 14133, 14136, 14137 | NO | Bullet: AP collega client wireless alla LAN |
| Modem | 3286, 14128, 14129 | NO | Bullet: modem converte segnale provider |
| MPLS | 3292, 14140, 14141 | NO | Bullet MPLS per WAN aziendali |
| QoS | 3284, 14124, 14125, 14145 | NO | Bullet QoS: priorità al traffico sensibile |
| Topologie (stella/bus/anello/mesh, nomi specifici) | 3271, 3283, 14098, 14099, 14122, 14123 | NO | Bullet coi 4 nomi (dettagli nel topic 230) |
| Wi-Fi / IEEE 802.11 | 3277, 3288, 14110, 14111, 14132, 14133 | NO | Bullet Wi-Fi/802.11 |
| Rete convergente | 3294, 14144, 14145 | NO | Bullet: rete convergente unisce dati/voce/video |

**Gap: 15**

---

## Topic 227 — Modelli OSI e TCP/IP (138 domande)

Review copre bene i 7 livelli OSI, i 4 livelli TCP/IP, tabella livello/funzione/esempio, incapsulamento.

| Concetto | ID domande | Nel Review | Azione proposta |
|---|---|---|---|
| ARP | 3394, 14193, 14194, 14195 | NO | Bullet ARP (mappa IP→MAC) |
| ICMP | 3401, 14180, 14214, 14215, 14216 | NO | Bullet ICMP (ping/traceroute) |
| SNMP | 3408, 14234, 14235, 14236 | NO | Bullet SNMP (monitoraggio dispositivi) |
| MTU / frammentazione IP | 3407, 14231, 14232, 14233 | NO | Bullet MTU e frammentazione a livello Network |
| Three-way handshake TCP | 14176, 14186, 14213 | NO | Riga sul three-way handshake nella sezione TCP |
| Controllo di flusso | 3399, 14208, 14209, 14210 | NO | Riga: controllo di flusso a livello 2 e 4 |
| DNS (nominato come protocollo) | 3406, 14203, 14211, 14228, 14229, 14230 | NO | Aggiungere DNS come esempio di livello Application |
| Protocolli email (SMTP, POP3, IMAP) | 3398, 14205, 14206, 14207, 14244 | NO | Nominare POP3/IMAP oltre a SMTP nella tabella esempi |
| HTTPS/TLS (dettagli oltre il nome) | 3412, 14177, 14224, 14238, 14245, 14246, 14247 | PARZIALE — tabella cita solo "SSL/TLS, formati file" come esempio Presentation | Aggiungere 2 righe su HTTPS/TLS |

**Gap: 9**

---

## Topic 228 — Dispositivi di rete (100 domande)

Review copre bene: Hub, Switch, Router, Access Point, Firewall, Modem, Repeater, Bridge, Gateway.

| Concetto | ID domande | Nel Review | Azione proposta |
|---|---|---|---|
| Server DHCP (dispositivo) | 3332, 14274, 14275, 14303 | NO | Bullet server DHCP come dispositivo dedicato |
| Proxy server | 3333, 3344, 14276, 14277, 14278, 14300, 14301 | NO | Bullet proxy (cache, trasparente) |
| Load balancer | 3336, 14284, 14285 | NO | Bullet load balancer |
| IDS/IPS | 3337, 14286, 14287 | NO | Bullet IDS/IPS |
| NAS | 3340, 14292, 14293 | NO | Bullet NAS |
| Server DNS (dispositivo) | 3341, 14275, 14294, 14295 | NO | Bullet server DNS |
| Patch panel | 3342, 14296, 14297 | NO | Bullet patch panel |
| ODF (distribuzione ottica) | 3343, 14298, 14299 | NO | Bullet ODF |
| Media converter | 3346, 14304, 14305 | NO | Bullet media converter |
| Controller WLAN | 3347, 14306, 14307 | NO | Bullet controller WLAN |
| Rack | 3348, 14297, 14308, 14309 | NO | Bullet rack |
| TAP di rete | 3351, 14314, 14315 | NO | Bullet TAP (vs port mirroring) |
| VLAN (come funzione switch) | 3354, 14321, 14322, 14323 | NO | Bullet VLAN (rimanda al topic 232) |
| QoS su switch/router | 3350, 14312, 14313 | NO | Bullet QoS |
| Bridge wireless (collega sedi) | 3353, 14319, 14320 | NO | Riga aggiuntiva sotto "Bridge" |

**Gap: 15**

---

## Topic 229 — Indirizzamento IP e subnetting (100 domande)

Review copre bene: IPv4, subnet mask, CIDR, indirizzo di rete/broadcast, IP pubblici/privati (RFC1918), DHCP vs statico, default gateway, cenno NAT.

| Concetto | ID domande | Nel Review | Azione proposta |
|---|---|---|---|
| IPv6 (concetto generale, 128 bit) | 3356, 14407, 14409, 14412, 14414 | NO | Aggiungere sezione breve IPv6 |
| Loopback/localhost (127.0.0.1, ::1) | 3360, 3381, 14418, 14421, 14423, 14425, 14466, 14470 | NO | Bullet loopback |
| APIPA (169.254.x.x) | 3378, 14459, 14464 | NO | Bullet APIPA |
| Indirizzamento classful (classi A/B/C) | 3358, 3359, 3368, 14416, 14417, 14420, 14424, 14437, 14442 | NO | Bullet breve su classful vs CIDR |
| VLSM | 3372, 14446, 14449, 14452, 14455 | NO | Bullet VLSM |
| Wildcard mask | 3377, 14458, 14463 | NO | Bullet wildcard mask |
| Conflitto IP | 3384, 14469, 14473, 14475 | NO | Bullet conflitto IP |
| Indirizzo 0.0.0.0 / route predefinita | 3371, 14440, 14445 | NO | Bullet 0.0.0.0/0 |
| IPv6 link-local (FE80::/10) | 3373, 14447, 14450, 14453 | NO | Bullet FE80::/10 |

**Gap: 9**

---

## Topic 230 — Tipi di reti e topologie (112 domande)

| Concetto | ID domande | Nel Review | Azione proposta |
|---|---|---|---|
| **Topologia ad albero** ⚠️ | 3483, 3491, 3501, 14344, 14345, 14346, 14347, 14348, 14349, 14350, 14351, 14352, 14353, 14354, 14355, 14366, 14367, 14368, 14395, 14396, 14397 (21) | NO — la tabella "Topologia / Caratteristica" elenca solo stella, bus, anello, mesh | Aggiungere riga "Topologia ad albero: struttura gerarchica di più stelle" |
| Campus LAN | 3498, 14386, 14387, 14388 | NO | Bullet Campus LAN |
| Mesh parziale vs completa (distinzione) | 3496, 14380, 14381, 14382 | NO | Aggiungere distinzione parziale/completa sotto "mesh" |

**Gap: 3** (ma il primo da solo copre 21 domande — il gap più concentrato di tutto l'audit)

---

## Topic 231 — Protocolli di rete e porte comuni (111 domande)

Review copre bene (con tabella porte): TCP/UDP, porta, HTTP(80)/HTTPS(443)/DNS(53)/DHCP(67-68)/FTP(20-21)/SSH(22)/Telnet(23)/SMTP(25).

| Concetto | ID domande | Nel Review | Azione proposta |
|---|---|---|---|
| NTP (porta UDP 123) | 3422, 14496, 14497, 14498 | NO | Aggiungere riga NTP in tabella |
| SNMP (porte UDP 161/162) | 3423, 3433, 14499, 14500, 14501, 14528, 14529 | NO | Aggiungere riga SNMP |
| ICMP | 3425, 3440, 14505, 14506, 14507, 14544, 14545 | NO | Aggiungere riga ICMP |
| ARP | 3426, 14508, 14509, 14510 | NO | Aggiungere riga ARP |
| RDP (porta 3389) | 3427, 14511, 14512, 14513 | NO | Aggiungere riga RDP |
| POP3/IMAP (porte 110/143/993/995) | 3428, 3431, 3443, 14514, 14515, 14516, 14523, 14524, 14525, 14552, 14553, 14554 (12) | NO | Aggiungere righe POP3 e IMAP in tabella |
| SFTP (porta 22 via SSH) | 3429, 3439, 14517, 14518, 14519, 14543 | NO | Aggiungere riga SFTP |
| TFTP (porta UDP 69) | 3430, 3442, 14520, 14521, 14522, 14549, 14550, 14551 | NO | Aggiungere riga TFTP |
| NAT | 3437, 14537, 14538, 14539 | NO | Bullet NAT (già nel topic 229, non qui) |

**Gap: 9**

---

## Topic 232 — Configurazione base router e switch (110 domande)

Review copre solo i concetti (console, running/startup, VLAN, trunk/access, backup, reset) ma **non mostra mai una sintassi di comando reale**. La maggior parte delle domande testa proprio la sintassi Cisco IOS.

| Concetto | ID domande | Nel Review | Azione proposta |
|---|---|---|---|
| Accesso a config (configure terminal, hostname) | 3296, 3298, 14572, 14573, 14574 | NO | Box "comandi essenziali" con sintassi |
| Sicurezza accessi (enable secret, line console 0) | 3302, 3321, 14625, 14626, 14627 | NO | Comandi enable secret / line console 0 |
| Interfacce (interface X, no shutdown, show ip int brief) | 3303, 3304, 3305, 3312, 3320, 14581, 14582, 14583, 14584, 14585, 14601, 14602, 14622, 14623, 14624 (15) | NO | Blocco comandi interfaccia + stato |
| Salvataggio config (copy running/startup, write memory, erase) ⚠️ | 3300, 3317, 3318, 3322, 14560, 14561, 14562, 14578, 14580, 14614, 14616, 14617, 14618, 14628, 14629, 14630 (16, verificato manualmente) | NO — verificato: Review non menziona nessuno di questi comandi | Sintassi esatta dei comandi di salvataggio |
| Comando reload | 3308, 14591, 14592 | NO | Aggiungere reload |
| ip default-gateway (switch L2) | 3307, 14588, 14589, 14590 | NO | Comando ip default-gateway |
| Attivazione SSH (crypto key generate rsa, ip domain-name, VTY) | 3309, 3310, 14593, 14594, 14596, 14597, 14598 | NO | Procedura di attivazione SSH |
| Comando banner motd | 3311, 14599, 14600 | NO | Aggiungere banner motd |
| Comando description | 3313, 14604, 14605, 14606 | NO | Aggiungere comando description |
| Sintassi VLAN (switchport mode access/trunk, 802.1Q) | 3314, 3315, 14607, 14608, 14611 | PARZIALE — concetto trunk/access coperto, sintassi e 802.1Q no | Sintassi switchport mode + citare 802.1Q |
| Comando show ip route | 3319, 14566, 14567, 14568, 14619, 14620, 14621 | NO | Aggiungere show ip route |
| Comandi diagnostici (ping/traceroute) | 3323, 3324, 14569, 14570, 14571, 14631, 14632, 14633, 14634, 14635, 14636 (11) | NO | Cenno ping/traceroute (o rimando a topic 234) |
| Route di default (ip route 0.0.0.0 0.0.0.0) | 3299, 14575, 14576, 14577 | NO | Comando route di default |

**Gap: 12** — topic più critico dell'audit: manca ogni comando CLI reale

---

## Topic 233 — Sicurezza di rete (118 domande)

Review copre: Firewall, VPN, Autenticazione/Autorizzazione, Password policy, Malware, Phishing, Patch, WPA2/WPA3 vs WEP, Segmentazione.

| Concetto | ID domande | Nel Review | Azione proposta |
|---|---|---|---|
| DoS/DDoS | 3449, 14649, 14650, 14651 | NO | Bullet DoS vs DDoS |
| Vulnerability / Exploit (terminologia) | 3450, 3470, 14652, 14653, 14654, 14710, 14711, 14712 | NO | Bullet vulnerabilità/exploit |
| IDS/IPS | 3451, 14655, 14656, 14657 | NO | Bullet IDS/IPS |
| Privilegio minimo / RBAC | 3453, 3469, 14661, 14662, 14663, 14707, 14708, 14709 | NO | Bullet privilegio minimo + RBAC |
| Antivirus vs Antimalware moderno | 3454, 14664, 14665, 14666 | NO | Bullet differenza antivirus/antimalware |
| Man-in-the-Middle (MITM) | 3455, 14667, 14668 | NO | Bullet MITM |
| Hashing e salt password | 3456, 14669, 14670, 14671 | NO | Bullet hashing/salt |
| Certificati SSL/TLS | 3457, 14672, 14673, 14674 | NO | Bullet certificato digitale |
| Honeypot ⚠️ possibile fuori scope | 3459, 14678, 14679, 14680 | NO | Valutare se rivedere la domanda invece di espandere il Review |
| Zero Trust ⚠️ possibile fuori scope | 3461, 14684, 14685, 14686 | NO | Valutare se rivedere la domanda invece di espandere il Review |
| IPsec ⚠️ possibile fuori scope | 3462, 14687, 14688, 14689 | NO | Valutare se rivedere la domanda invece di espandere il Review |
| Crittografia end-to-end | 3464, 14693, 14694, 14695 | NO | Bullet crittografia end-to-end |
| Social Engineering (termine generale) | 3465, 14696, 14697, 14698 | NO | Bullet social engineering come categoria |
| Packet sniffer / Wireshark | 3466, 14699, 14700, 14701 | NO | Bullet packet sniffer |
| Backdoor | 3467, 14702, 14703 | NO | Bullet backdoor |
| Brute force (attacco) | 3468, 14704, 14705, 14706 | NO | Bullet attacco brute force |
| Log di sicurezza | 3474, 14722, 14723, 14724 | NO | Bullet log di sicurezza |
| 2FA/MFA | 3446, 14640, 14641, 14642, 14706, 14721 | PARZIALE — citato di sfuggita, mai spiegato | Bullet dedicato con esempio fattori |
| Patch management (processo formale) | 3463, 14690, 14691, 14692, 14716, 14717, 14718 | PARZIALE — concetto di patch coperto, processo no | Righe sul processo di patch management |

**Gap: 18** (di cui 3 marcati "possibile fuori scope" — da valutare lato domande, non lato Review)

---

## Topic 234 — Troubleshooting e diagnostica (116 domande)

Review copre: ping, traceroute, ipconfig/ifconfig, nslookup, metodo a livelli OSI, isolamento problema, documentazione, baseline, cavo difettoso, conflitto IP.

| Concetto | ID domande | Nel Review | Azione proposta |
|---|---|---|---|
| netstat | 3515, 14753, 14754, 14755 | NO | Bullet netstat |
| Wireshark | 3511, 14742, 14743, 14744 | NO | Bullet Wireshark |
| MTU | 3522, 14773, 14774, 14775 | NO | Bullet MTU (rimanda a topic 227) |
| arp -a / tabella ARP | 3523, 14776, 14777, 14778 | NO | Bullet arp -a |
| ping continuo (-t) | 3518, 14762, 14763, 14764 | NO | Bullet ping -t |
| Loopback test / cavo di loopback | 3513, 3526, 14748, 14749, 14750, 14785, 14786, 14787 | NO | Bullet loopback test/cavo |
| Speed test | 3520, 14767, 14768, 14769 | NO | Bullet speed test |
| ip addr (comando Linux moderno) | 3521, 14770, 14771, 14772 | PARZIALE — Review cita solo "ifconfig" | Aggiungere ip addr accanto a ifconfig |
| ipconfig /all e /flushdns | 3512, 3532, 14745, 14746, 14747, 14802, 14803, 14804 | PARZIALE — ipconfig generico coperto, switch no | Aggiungere /all e /flushdns |
| Bottleneck | 3533, 14805, 14806, 14807 | NO | Bullet bottleneck |
| Packet loss | 3516, 14756, 14757, 14758 | NO | Bullet perdita di pacchetti |
| Aggiornamento firmware (come tecnica) | 3527, 14788, 14789 | NO | Bullet firmware update |
| Reset di fabbrica (come tecnica) | 3530, 14796, 14797, 14798 | NO | Bullet reset di fabbrica (già nel Review del topic 232, non qui) |
| Monitoraggio real-time (Nagios/PRTG/Zabbix) | 3531, 14799, 14800, 14801 | NO | Bullet monitoraggio in tempo reale |
| Log di sistema | 3529, 14793, 14794, 14795 | NO | Bullet log di sistema |
| "Request timed out" (messaggio diagnostico) | 3524, 14732, 14779, 14780 | NO | Riga su interpretazione timeout ping |
| Test incrociato con altro dispositivo | 3525, 14782, 14783, 14784 | NO | Bullet test incrociato |
| Backup configurazione (confronto attuale/precedente) | 3517, 14759, 14760, 14761 | NO | Bullet confronto con backup |

**Gap: 18**

---

## Topic 235 — Carriere e certificazioni nel networking (90 domande)

Review copre: CCST, CCNA, CCNP (generico), CCIE, Help desk, Network technician, Network administrator, Network engineer, soft skill, formazione continua.

| Concetto | ID domande | Nel Review | Azione proposta |
|---|---|---|---|
| CCNA Security | 3241, 14823, 14824 | NO | Riga CCNA Security nella tabella percorsi |
| CCNP Data Center | 3248, 14837, 14838 | NO | Riga CCNP Data Center |
| CCNP Collaboration | 3251, 14843, 14844 | NO | Riga CCNP Collaboration |
| CCNP Security | 3255, 14851, 14852 | NO | Riga CCNP Security |
| CCNP Enterprise | 3253, 3261, 14847, 14848, 14863, 14864 | NO | Riga CCNP Enterprise |
| DevNet Associate | 3244, 3257, 14829, 14830, 14855, 14856 | NO | Riga DevNet Associate |
| Cisco Networking Academy | 3240, 14821, 14822 | NO | Bullet Networking Academy |
| Vendor-specific (concetto) | 3256, 14853, 14854 | NO | Bullet certificazione vendor-specific |
| Network Architect (ruolo) | 3263, 14868 | NO | Aggiungere ruolo tra quelli elencati |

**Gap: 9**

---

## Riepilogo generale

**Totale gap solidi (tutti con ID verificati via query): 119**, su 10 topic. Due claim ad alto impatto (topic 230 "ad albero", topic 232 "salvataggio config") verificati indipendentemente con query dirette, esito confermato esatto.

### Gap per topic

| Topic | Nome | N. domande | Gap trovati |
|---|---|---|---|
| 226 | Concetti base delle reti | 90 | 15 |
| 227 | Modelli OSI e TCP/IP | 138 | 9 |
| 228 | Dispositivi di rete | 100 | 15 |
| 229 | Indirizzamento IP e subnetting | 100 | 9 |
| 230 | Tipi di reti e topologie | 112 | 3 |
| 231 | Protocolli di rete e porte comuni | 111 | 9 |
| 232 | Configurazione base router e switch | 110 | 12 |
| 233 | Sicurezza di rete | 118 | 18 |
| 234 | Troubleshooting e diagnostica | 116 | 18 |
| 235 | Carriere e certificazioni nel networking | 90 | 9 |

### I 3 più gravi

1. **Topic 232 — Configurazione base router e switch**: il Review non contiene un solo comando Cisco IOS, mentre decine di domande chiedono sintassi esatta (salvataggio config: 16 domande; interfacce: 15; diagnostica: 11). Gap strutturale, non di dettaglio.
2. **Topic 230 — Tipi di reti e topologie**: un solo concetto mancante ma il più concentrato di tutto l'audit — la **topologia ad albero**, testata da **21 domande**, non è mai nominata nella tabella delle topologie.
3. **Topic 233 e 234 (pari merito, 18 gap ciascuno)**: sicurezza e troubleshooting hanno il maggior numero di concetti singoli non coperti (terminologia di attacco, strumenti da riga di comando), anche se ogni singolo gap coinvolge poche domande. Nel topic 233, 3 dei 18 gap sono segnalati come possibile contenuto fuori scope CCST (Zero Trust, IPsec, honeypot) — da valutare lato domande più che lato Review.

### Possibili domande fuori scope CCST
Topic 233: Zero Trust (3461, 14684-14686), IPsec (3462, 14687-14689), Honeypot (3459, 14678-14680).
