-- Traduzioni EN/FR/ES delle aggiunte fatte in tranche 1 (230,227,229,231,235) e tranche 2 (226,228,233,234,232)
-- Generato da Claude, revisionato e confermato da Lorenzo prima di ogni topic
--
-- ORDINE DI ESECUZIONE:
-- 1) Nessuna nuova CREATE TABLE di backup necessaria: le colonne content_en/fr/es
--    non sono mai state toccate prima, quindi content_it (con relativi backup gia'
--    esistenti: topic_review_pages_backup_20260810 e topic_review_pages_backup_ccst_round2_20260810)
--    resta il riferimento per gli score di lunghezza; qui serve solo un check pre/post
--    diretto sulle colonne EN/FR/ES via query di verifica in fondo al file.
-- 2) Eseguire gli UPDATE UNO ALLA VOLTA (3 per topic: EN poi FR poi ES), verificando
--    il rendering sul sito dopo ogni singolo UPDATE prima di passare al successivo.
-- 3) Ogni UPDATE riscrive l'intero campo content_<lang> (non solo la parte nuova).
--
-- Metodo: per ciascun topic, il testo aggiunto in italiano e' stato individuato con un
-- diff esatto tra content_it attuale e la relativa tabella di backup (nessuna stima),
-- poi tradotto mantenendo lo stile piu' sintetico gia' in uso nelle colonne EN/FR/ES
-- esistenti (non una traduzione letterale dei bullet italiani, spesso piu' lunghi).

-- Topic 226 -- EN
UPDATE topic_review_pages SET content_en = '## What you really need to know

Before studying OSI, IP addressing or specific devices, you need to understand what a network is and why it exists. This topic covers the vocabulary and concepts on which the rest of CCST Networking is built.

## Key concepts

- **Network**: a group of connected devices that share resources and information.
- **Node**: any device connected to a network.
- **Client-server model**: clients request services and servers provide them.
- **Peer-to-peer model**: each device can act as both client and server.
- **Bandwidth**: the theoretical maximum capacity of a link.
- **Throughput**: the amount of data actually transferred.
- **Latency**: the time required for data to travel between two points.
- **Packet**: a unit of data transmitted across a network.
- **MAC address**: a Layer 2 identifier normally assigned to a network interface by its manufacturer; it can be changed or virtualized in some systems.

- **LAN, WAN and PAN**: a LAN covers a small area (office, building) with high speeds; a WAN connects large geographic areas (cities, countries, the Internet itself); a PAN connects short-range devices around a single person (e.g. Bluetooth headphones, smartwatches).
- **Intranet, extranet and public network**: an intranet is a private company network for internal users only; an extranet extends controlled access to external partners or clients; a public network (such as the Internet) is open to anyone, without specific authorization.
- **VPN**: creates a secure, encrypted channel over a public network, letting remote sites or remote workers connect as if they were on the local network.
- **DHCP**: automatically assigns IP addresses and other network settings to devices joining the network.
- **DNS**: translates domain names (e.g. www.example.com) into numeric IP addresses.
- **Gateway**: a device that connects networks using different protocols, translating data formats between them.
- **Firewall**: controls inbound and outbound traffic based on security rules, blocking unauthorized access.
- **Switch and hub**: a switch forwards packets only to the correct destination port and reduces collisions; a hub forwards data to every port, increasing collisions and reducing efficiency.
- **Access point**: lets wireless devices connect to a wired network, extending Wi-Fi coverage.
- **Modem**: converts signals from the internet provider into a format usable by the local network.
- **MPLS**: a WAN technology that routes packets using labels, reducing processing time.
- **QoS (Quality of Service)**: techniques that prioritize certain types of traffic (e.g. voice, video) over generic traffic.
- **Network topologies**: star (devices connected to a central node), bus (all devices on a single shared cable), ring (each node connected to the next in a closed loop), mesh (multiple links between nodes for redundancy).
- **Wi-Fi (IEEE 802.11)**: a family of standards for wireless local area networks (WLANs), allowing cable-free connections.
- **Converged network**: combines data, voice and video on the same network infrastructure.

## Do not confuse

| Concept | Main meaning |
|---|---|
| Bandwidth | Maximum theoretical capacity |
| Throughput | Real data transfer rate |
| Latency | Delay experienced by data |
| Client-server | Separate provider and requester roles |
| Peer-to-peer | Devices share resources as equals |

## Client-server and peer-to-peer

A client-server network uses centralized systems to provide files, email, websites or other services. A peer-to-peer network has no dedicated central server and devices share resources directly.

## Bandwidth, throughput and latency

A 100 Mbps link describes bandwidth, not guaranteed throughput. Congestion, interference and protocol overhead reduce actual performance. A connection may also have high bandwidth but high latency, making interactive applications feel slow.

## Packets and addresses

Data is divided into packets. Each packet contains control information that helps devices deliver it to the correct destination. MAC addresses are used mainly for local Layer 2 communication, while IP addresses identify devices across larger networks.

## Common exam mistakes

- Treating bandwidth and throughput as identical.
- Ignoring latency when evaluating performance.
- Confusing client-server with peer-to-peer.
- Assuming a MAC address is assigned dynamically like an IP address.
- Thinking that only computers can be network nodes.

## Mini exam scenario

Four computers share files and a printer directly without a dedicated server. This is a **peer-to-peer** network because every device can provide and consume resources.

## Checklist

You should be able to explain network purpose, nodes, packets, client-server, peer-to-peer, bandwidth, throughput, latency and MAC addressing.' WHERE topic_id = 226;

-- Topic 226 -- FR
UPDATE topic_review_pages SET content_fr = '## Ce qu’il faut vraiment savoir

Avant d’étudier les modèles OSI, l’adressage IP ou les équipements, il faut comprendre ce qu’est un réseau et pourquoi il existe.

## Concepts clés

- **Réseau** : ensemble d’équipements connectés qui partagent des ressources.
- **Nœud** : tout équipement connecté au réseau.
- **Client-serveur** : les clients demandent des services, le serveur les fournit.
- **Pair à pair** : chaque équipement peut être client et serveur.
- **Bande passante** : capacité maximale théorique d’une liaison.
- **Débit réel** : quantité de données réellement transmise.
- **Latence** : temps nécessaire aux données pour parcourir le réseau.
- **Paquet** : unité de données transmise sur le réseau.
- **Adresse MAC** : identifiant de couche 2 généralement attribué à une interface par le fabricant, mais modifiable ou virtualisable dans certains systèmes.

- **LAN, WAN et PAN** : un LAN couvre une zone restreinte (bureau, bâtiment) à haut débit ; un WAN relie des zones géographiques étendues (villes, pays, Internet lui-même) ; un PAN relie des équipements à très courte portée autour d''une personne (écouteurs Bluetooth, montre connectée).
- **Intranet, extranet et réseau public** : un intranet est un réseau privé d''entreprise réservé aux utilisateurs internes ; un extranet étend un accès contrôlé à des partenaires ou clients externes ; un réseau public (comme Internet) est ouvert à tous, sans autorisation particulière.
- **VPN** : crée un canal sécurisé et chiffré sur un réseau public, permettant à des sites distants ou des télétravailleurs de se connecter comme s''ils étaient sur le réseau local.
- **DHCP** : attribue automatiquement des adresses IP et d''autres paramètres réseau aux équipements qui se connectent.
- **DNS** : traduit les noms de domaine (ex. www.exemple.com) en adresses IP numériques.
- **Passerelle (gateway)** : équipement qui relie des réseaux utilisant des protocoles différents, en traduisant les formats de données entre eux.
- **Pare-feu** : contrôle le trafic entrant et sortant selon des règles de sécurité, pour bloquer les accès non autorisés.
- **Commutateur et concentrateur (switch et hub)** : le switch achemine les trames uniquement vers le bon port et réduit les collisions ; le hub diffuse les données sur tous les ports, augmentant les collisions et réduisant l''efficacité.
- **Point d''accès** : permet à des équipements sans fil de se connecter à un réseau filaire, en étendant la couverture Wi-Fi.
- **Modem** : convertit les signaux du fournisseur d''accès Internet dans un format utilisable par le réseau local.
- **MPLS** : technologie WAN qui achemine les paquets à l''aide d''étiquettes, réduisant les temps de traitement.
- **QoS (qualité de service)** : ensemble de techniques qui donnent la priorité à certains types de trafic (voix, vidéo) par rapport au trafic générique.
- **Topologies réseau** : étoile (équipements reliés à un nœud central), bus (tous les équipements sur un même câble partagé), anneau (chaque nœud relié au suivant en boucle fermée), maillage (liaisons multiples entre les nœuds pour la redondance).
- **Wi-Fi (IEEE 802.11)** : famille de normes pour les réseaux locaux sans fil (WLAN), permettant une connexion sans câble.
- **Réseau convergent** : combine données, voix et vidéo sur la même infrastructure réseau.

## À ne pas confondre

| Concept | Signification |
|---|---|
| Bande passante | Capacité maximale théorique |
| Débit réel | Quantité effectivement transmise |
| Latence | Délai de transmission |
| Client-serveur | Rôles centralisés |
| Pair à pair | Partage direct entre équipements |

## Client-serveur et pair à pair

Dans un réseau client-serveur, des serveurs centralisent les fichiers, la messagerie ou les applications. Dans un réseau pair à pair, les équipements partagent directement leurs ressources.

## Bande passante, débit et latence

Une liaison de 100 Mbit/s indique une capacité théorique. Le débit réel peut être inférieur à cause de la congestion, des interférences et de l’overhead. Une forte bande passante n’empêche pas une latence élevée.

## Erreurs fréquentes

- Confondre bande passante et débit réel.
- Ignorer la latence.
- Confondre client-serveur et pair à pair.
- Croire qu’une adresse MAC est attribuée comme une adresse IP.
- Penser qu’un nœud est uniquement un ordinateur.

## Mini scénario

Quatre ordinateurs partagent directement des fichiers et une imprimante sans serveur dédié : il s’agit d’un réseau **pair à pair**.

## Checklist

Sachez expliquer le rôle d’un réseau, les nœuds, les paquets, les modèles client-serveur et pair à pair, la bande passante, le débit, la latence et l’adresse MAC.' WHERE topic_id = 226;

-- Topic 226 -- ES
UPDATE topic_review_pages SET content_es = '## Lo que realmente debes saber

Antes de estudiar OSI, direccionamiento IP o dispositivos concretos, debes entender qué es una red y por qué existe.

## Conceptos clave

- **Red**: conjunto de dispositivos conectados que comparten recursos.
- **Nodo**: cualquier dispositivo conectado a la red.
- **Cliente-servidor**: los clientes solicitan servicios y el servidor los proporciona.
- **Peer-to-peer**: cada dispositivo puede actuar como cliente y servidor.
- **Ancho de banda**: capacidad máxima teórica de un enlace.
- **Throughput**: cantidad de datos transferida realmente.
- **Latencia**: tiempo que tardan los datos en viajar.
- **Paquete**: unidad de datos transmitida por la red.
- **Dirección MAC**: identificador de capa 2 normalmente asignado a una interfaz por el fabricante, aunque puede modificarse o virtualizarse.

- **LAN, WAN y PAN**: una LAN cubre un área reducida (oficina, edificio) con alta velocidad; una WAN conecta áreas geográficas amplias (ciudades, países, Internet); una PAN conecta dispositivos de muy corto alcance alrededor de una persona (auriculares Bluetooth, smartwatch).
- **Intranet, extranet y red pública**: una intranet es una red privada empresarial solo para usuarios internos; una extranet amplía el acceso controlado a socios o clientes externos; una red pública (como Internet) está abierta a cualquiera, sin autorización específica.
- **VPN**: crea un canal seguro y cifrado sobre una red pública, permitiendo que sedes remotas o teletrabajadores se conecten como si estuvieran en la red local.
- **DHCP**: asigna automáticamente direcciones IP y otros parámetros de red a los dispositivos que se conectan.
- **DNS**: traduce nombres de dominio (ej. www.ejemplo.com) en direcciones IP numéricas.
- **Gateway (puerta de enlace)**: dispositivo que conecta redes con protocolos diferentes, traduciendo los formatos de datos entre ellas.
- **Firewall**: controla el tráfico entrante y saliente según reglas de seguridad, bloqueando accesos no autorizados.
- **Switch y hub**: el switch reenvía los paquetes solo al puerto correcto y reduce las colisiones; el hub envía los datos a todos los puertos, aumentando las colisiones y reduciendo la eficiencia.
- **Punto de acceso**: permite que dispositivos inalámbricos se conecten a una red cableada, ampliando la cobertura Wi-Fi.
- **Módem**: convierte las señales del proveedor de Internet en un formato utilizable por la red local.
- **MPLS**: tecnología WAN que enruta paquetes mediante etiquetas, reduciendo los tiempos de procesamiento.
- **QoS (calidad de servicio)**: conjunto de técnicas que priorizan ciertos tipos de tráfico (voz, vídeo) frente al tráfico genérico.
- **Topologías de red**: estrella (dispositivos conectados a un nodo central), bus (todos los dispositivos en un único cable compartido), anillo (cada nodo conectado al siguiente en un bucle cerrado), malla (conexiones múltiples entre nodos para redundancia).
- **Wi-Fi (IEEE 802.11)**: familia de estándares para redes locales inalámbricas (WLAN), que permite la conexión sin cables.
- **Red convergente**: combina datos, voz y vídeo en la misma infraestructura de red.

## Diferencias importantes

| Concepto | Significado |
|---|---|
| Ancho de banda | Capacidad máxima teórica |
| Throughput | Transferencia real |
| Latencia | Retardo |
| Cliente-servidor | Funciones centralizadas |
| Peer-to-peer | Dispositivos con funciones equivalentes |

## Cliente-servidor y peer-to-peer

En cliente-servidor, sistemas centrales proporcionan archivos, correo o aplicaciones. En peer-to-peer, los dispositivos comparten recursos directamente sin un servidor dedicado.

## Ancho de banda, throughput y latencia

Un enlace de 100 Mbps indica capacidad teórica. La congestión, las interferencias y la sobrecarga reducen el rendimiento real. También puede existir mucho ancho de banda y alta latencia.

## Errores frecuentes

- Confundir ancho de banda y throughput.
- Ignorar la latencia.
- Confundir cliente-servidor y peer-to-peer.
- Creer que la dirección MAC se asigna dinámicamente como una IP.
- Pensar que solo los ordenadores son nodos.

## Mini escenario

Cuatro equipos comparten archivos e impresora sin servidor dedicado. Es una red **peer-to-peer**.

## Checklist

Debes explicar la función de una red, nodos, paquetes, cliente-servidor, peer-to-peer, ancho de banda, throughput, latencia y direcciones MAC.' WHERE topic_id = 226;

-- Topic 228 -- EN
UPDATE topic_review_pages SET content_en = '## What you really need to know

Every network is made up of devices with specific roles: some connect devices to each other, others route traffic between different networks, others protect the network or provide wireless access. CCST requires you to recognize the role of each device and know at which OSI layer it operates.

## Key concepts

- **Hub**: a Layer 1 device that repeats the signal to every port without distinguishing the destination.
- **Switch**: a Layer 2 device that forwards frames only to the correct port, based on the MAC address.
- **Router**: a Layer 3 device that routes packets between different networks, based on the IP address.
- **Access point (AP)**: a device that lets wireless clients connect to a wired network.
- **Firewall**: a device or software that filters traffic based on security rules.
- **Modem**: a device that adapts or converts the local network signal into the format required by the provider''s access technology, and vice versa.
- **Repeater**: a device that regenerates a signal to extend its range.
- **Bridge**: a device that connects two network segments at Layer 2, similar to a switch but simpler.
- **Gateway**: a device or access point that connects networks using different protocols, often the exit point to the Internet.

- **DHCP server**: a device or service that automatically assigns IP addresses and other network settings to clients.
- **DNS server**: a device or service that translates domain names into IP addresses.
- **Proxy server**: a device that mediates client requests to the Internet, often caching visited pages; a transparent proxy intercepts traffic without needing any client-side configuration.
- **Load balancer**: a device that distributes incoming traffic across multiple servers, avoiding overload and ensuring high availability.
- **IDS/IPS**: devices that monitor traffic to detect suspicious activity; an IDS detects and reports, an IPS can also block malicious traffic.
- **NAS (Network Attached Storage)**: a network-connected storage device that lets multiple users save and share files.
- **Patch panel**: a panel that organizes network cable terminations, simplifying connections via patch cords.
- **ODF (Optical Distribution Frame)**: a distribution frame that organizes and protects fiber optic connections.
- **Media converter**: a device that converts the signal between different cabling types, for example from fiber optic to copper.
- **WLAN controller**: a device that centralizes the management of multiple access points in enterprise wireless networks.
- **Rack**: a standardized structure that houses and organizes network devices and servers.
- **Network TAP**: a device that passively duplicates traffic on a link for analysis and monitoring, without interrupting it.
- **VLAN on switch/router**: a feature that segments a physical network into multiple virtual subnetworks, isolating traffic and improving security and efficiency (covered in more detail in the dedicated topic).
- **QoS on switch/router**: a feature that assigns priority to certain types of traffic (e.g. voice, video) over generic traffic.
- **Wireless bridge**: connects two separate networks or segments over a Wi-Fi link, useful when a cable connection between sites isn''t possible.

## Do not confuse

| Device | OSI layer | Main function |
|---|---|---|
| Hub | 1 | Repeats the signal to every port |
| Switch | 2 | Forwards frames based on MAC address |
| Router | 3 | Routes packets based on IP address |
| Access point | 1-2 | Connects wireless clients to the network |
| Firewall | Variable | Filters traffic according to rules |
| Modem | 1 | Adapts the signal to the provider''s access technology |

## Hub vs switch

A **hub** is a simple device that receives a signal on one port and repeats it on every other port, without knowing which device should actually receive it. This creates unnecessary traffic and collisions, which is why hubs are now obsolete.

A **switch**, on the other hand, learns which MAC address is on which port and forwards each frame only to the correct port, reducing unnecessary traffic and collisions. For the exam: if a question describes a device that "learns" MAC addresses and forwards traffic in a targeted way, it''s a switch.

## Router

A router routes traffic between different networks, deciding the best path based on the destination IP address. It''s the device that connects, for example, a local network to the Internet, and it''s typically where the default gateway for network devices is configured.

## Access points and wireless connectivity

An access point extends a wired network, letting wireless devices (laptops, smartphones, tablets) connect without a cable. Many home devices combine router, switch, access point and sometimes modem functions in a single unit: it''s important to be able to distinguish the functions even when they''re packed into one physical device.

## Firewall

A firewall filters inbound and outbound traffic based on predefined rules, blocking anything not explicitly allowed (or vice versa, depending on the configuration). It can be a dedicated device, a function built into a router, or software installed on a single computer.

## Modem

A modem adapts or converts the signal from the local network into the format required by the provider''s access technology, such as DSL or cable. On fiber connections this function may be performed by an optical terminal called an ONT. In many home setups, the modem or ONT then provides the router with access to the provider''s network.

## Common exam mistakes

- Confusing hub and switch.
- Thinking a router operates at the same OSI layer as a switch.
- Forgetting that an access point connects wireless devices, not routes between different networks.
- Confusing modem and router: the modem connects to the provider, the router routes traffic within the local network and outward.
- Thinking a firewall is always a separate physical device.
- Confusing repeater and bridge.

## Mini exam scenario

A technician notices that connecting several PCs to an old hub makes the network slow and full of collisions when many devices transmit at once. Replacing the hub with a **switch** fixes the problem, because the switch forwards traffic only to the correct port instead of repeating it on every port.

## Checklist

Before starting the quiz you should be able to explain:

- the difference between hub and switch;
- what a router is for compared to a switch;
- the role of an access point;
- the difference between modem and router;
- what a firewall is for;
- at which OSI layer each device operates.' WHERE topic_id = 228;

-- Topic 228 -- FR
UPDATE topic_review_pages SET content_fr = '## Ce qu''il faut vraiment savoir

Chaque réseau est composé d''équipements ayant des rôles spécifiques : certains relient les équipements entre eux, d''autres acheminent le trafic entre différents réseaux, d''autres encore protègent le réseau ou fournissent un accès sans fil. Le CCST exige de savoir reconnaître le rôle de chaque équipement et de connaître à quelle couche OSI il opère.

## Concepts clés

- **Hub (concentrateur)** : équipement de couche 1 qui répète le signal sur tous les ports sans distinguer les destinataires.
- **Switch (commutateur)** : équipement de couche 2 qui transmet les trames uniquement vers le bon port, selon l''adresse MAC.
- **Router (routeur)** : équipement de couche 3 qui achemine les paquets entre différents réseaux, selon l''adresse IP.
- **Point d''accès (AP)** : équipement qui permet à des clients sans fil de se connecter à un réseau filaire.
- **Pare-feu** : équipement ou logiciel qui filtre le trafic selon des règles de sécurité.
- **Modem** : équipement qui adapte ou convertit le signal du réseau local dans le format requis par la technologie d''accès du fournisseur, et inversement.
- **Répéteur** : équipement qui régénère un signal pour en étendre la portée.
- **Bridge (pont)** : équipement qui relie deux segments de réseau au niveau de la couche 2, semblable à un switch mais plus simple.
- **Passerelle (gateway)** : équipement ou point d''accès qui relie des réseaux utilisant des protocoles différents, souvent le point de sortie vers Internet.

- **Serveur DHCP** : équipement ou service qui attribue automatiquement des adresses IP et d''autres paramètres réseau aux clients.
- **Serveur DNS** : équipement ou service qui traduit les noms de domaine en adresses IP.
- **Serveur proxy** : équipement qui relaie les requêtes des clients vers Internet, souvent en mettant en cache les pages visitées ; un proxy transparent intercepte le trafic sans nécessiter de configuration côté client.
- **Répartiteur de charge (load balancer)** : équipement qui répartit le trafic entrant entre plusieurs serveurs, évitant les surcharges et garantissant une haute disponibilité.
- **IDS/IPS** : équipements qui surveillent le trafic pour détecter des activités suspectes ; l''IDS détecte et signale, l''IPS peut aussi bloquer le trafic malveillant.
- **NAS (Network Attached Storage)** : équipement de stockage connecté au réseau qui permet à plusieurs utilisateurs d''enregistrer et de partager des fichiers.
- **Panneau de brassage (patch panel)** : panneau qui organise les terminaisons des câbles réseau, simplifiant les connexions via des cordons de brassage.
- **ODF (Optical Distribution Frame)** : répartiteur qui organise et protège les connexions en fibre optique.
- **Convertisseur de média** : équipement qui convertit le signal entre différents types de câblage, par exemple de la fibre optique vers le cuivre.
- **Contrôleur WLAN** : équipement qui centralise la gestion de plusieurs points d''accès dans les réseaux sans fil d''entreprise.
- **Baie (rack)** : structure normalisée qui accueille et organise les équipements réseau et les serveurs.
- **TAP réseau** : équipement qui duplique passivement le trafic sur une liaison à des fins d''analyse et de surveillance, sans l''interrompre.
- **VLAN sur switch/routeur** : fonctionnalité qui segmente un réseau physique en plusieurs sous-réseaux virtuels, isolant le trafic et améliorant la sécurité et l''efficacité (approfondi dans le thème dédié).
- **QoS sur switch/routeur** : fonctionnalité qui donne la priorité à certains types de trafic (voix, vidéo) par rapport au trafic générique.
- **Pont sans fil (bridge wireless)** : relie deux réseaux ou segments séparés via une liaison Wi-Fi, utile quand une connexion filaire entre deux sites n''est pas possible.

## À ne pas confondre

| Équipement | Couche OSI | Fonction principale |
|---|---|---|
| Hub | 1 | Répète le signal sur tous les ports |
| Switch | 2 | Transmet les trames selon l''adresse MAC |
| Router | 3 | Achemine les paquets selon l''adresse IP |
| Point d''accès | 1-2 | Relie les clients sans fil au réseau |
| Pare-feu | Variable | Filtre le trafic selon des règles |
| Modem | 1 | Adapte le signal à la technologie d''accès du fournisseur |

## Hub et switch

Un **hub** est un équipement simple qui reçoit un signal sur un port et le répète sur tous les autres ports, sans savoir quel équipement doit réellement le recevoir. Cela génère du trafic inutile et des collisions, ce qui explique pourquoi les hubs sont aujourd''hui obsolètes.

Un **switch**, en revanche, apprend quelle adresse MAC se trouve sur quel port et transmet chaque trame uniquement vers le bon port, réduisant le trafic inutile et les collisions. Pour l''examen : si une question décrit un équipement qui « apprend » les adresses MAC et transmet le trafic de façon ciblée, il s''agit d''un switch.

## Routeur

Le routeur achemine le trafic entre différents réseaux, en choisissant le meilleur chemin selon l''adresse IP de destination. C''est l''équipement qui relie, par exemple, un réseau local à Internet, et c''est généralement là qu''est configurée la passerelle par défaut des équipements du réseau.

## Points d''accès et connectivité sans fil

Un point d''accès étend un réseau filaire en permettant à des équipements sans fil (ordinateurs portables, smartphones, tablettes) de se connecter sans câble. De nombreux équipements domestiques combinent dans un seul boîtier les fonctions de routeur, switch, point d''accès et parfois modem : il est important de savoir distinguer les fonctions même lorsqu''elles sont regroupées dans un seul équipement physique.

## Pare-feu

Un pare-feu filtre le trafic entrant et sortant selon des règles prédéfinies, en bloquant ce qui n''est pas explicitement autorisé (ou l''inverse, selon la configuration). Il peut s''agir d''un équipement dédié, d''une fonction intégrée au routeur, ou d''un logiciel installé sur un seul ordinateur.

## Modem

Le modem adapte ou convertit le signal provenant du réseau local dans le format requis par la technologie d''accès utilisée par le fournisseur, comme le DSL ou le câble. Sur les connexions en fibre, cette fonction peut être assurée par un terminal optique appelé ONT. Dans de nombreuses installations domestiques, le modem ou l''ONT fournit ensuite au routeur l''accès au réseau du fournisseur.

## Erreurs fréquentes

- Confondre hub et switch.
- Penser qu''un routeur opère à la même couche OSI qu''un switch.
- Oublier qu''un point d''accès sert à connecter des équipements sans fil, pas à acheminer le trafic entre différents réseaux.
- Confondre modem et routeur : le modem se connecte au fournisseur, le routeur achemine le trafic à l''intérieur du réseau local et vers l''extérieur.
- Penser qu''un pare-feu est toujours un équipement physique séparé.
- Confondre répéteur et bridge.

## Mini scénario

Un technicien constate qu''en connectant plusieurs PC à un ancien hub, le réseau devient lent et sujet à de nombreuses collisions lorsque plusieurs équipements transmettent en même temps. En remplaçant le hub par un **switch**, le problème est résolu, car le switch n''achemine le trafic que vers le bon port au lieu de le répéter sur tous les ports.

## Checklist

Avant de commencer le quiz, vous devez savoir expliquer :

- la différence entre hub et switch ;
- à quoi sert un routeur par rapport à un switch ;
- le rôle d''un point d''accès ;
- la différence entre modem et routeur ;
- à quoi sert un pare-feu ;
- à quelle couche OSI opère chaque équipement.' WHERE topic_id = 228;

-- Topic 228 -- ES
UPDATE topic_review_pages SET content_es = '## Lo que realmente debes saber

Toda red está compuesta por dispositivos con funciones específicas: algunos conectan dispositivos entre sí, otros enrutan tráfico entre redes diferentes, otros protegen la red o proporcionan acceso inalámbrico. El CCST exige reconocer la función de cada dispositivo y saber en qué capa OSI opera.

## Conceptos clave

- **Hub**: dispositivo de capa 1 que repite la señal en todos los puertos sin distinguir los destinatarios.
- **Switch**: dispositivo de capa 2 que reenvía las tramas solo al puerto correcto, según la dirección MAC.
- **Router**: dispositivo de capa 3 que enruta paquetes entre redes diferentes, según la dirección IP.
- **Punto de acceso (AP)**: dispositivo que permite a los clientes inalámbricos conectarse a una red cableada.
- **Firewall**: dispositivo o software que filtra el tráfico según reglas de seguridad.
- **Módem**: dispositivo que adapta o convierte la señal de la red local al formato requerido por la tecnología de acceso del proveedor, y viceversa.
- **Repetidor**: dispositivo que regenera una señal para extender su alcance.
- **Bridge (puente)**: dispositivo que conecta dos segmentos de red en la capa 2, similar a un switch pero más simple.
- **Gateway (puerta de enlace)**: dispositivo o punto de acceso que conecta redes con protocolos diferentes, a menudo el punto de salida hacia Internet.

- **Servidor DHCP**: dispositivo o servicio que asigna automáticamente direcciones IP y otros parámetros de red a los clientes.
- **Servidor DNS**: dispositivo o servicio que traduce nombres de dominio en direcciones IP.
- **Servidor proxy**: dispositivo que intermedia las solicitudes de los clientes hacia Internet, a menudo almacenando en caché las páginas visitadas; un proxy transparente intercepta el tráfico sin necesitar configuración en el cliente.
- **Balanceador de carga**: dispositivo que distribuye el tráfico entrante entre varios servidores, evitando sobrecargas y garantizando alta disponibilidad.
- **IDS/IPS**: dispositivos que monitorizan el tráfico para detectar actividad sospechosa; el IDS detecta y notifica, el IPS también puede bloquear el tráfico malicioso.
- **NAS (Network Attached Storage)**: dispositivo de almacenamiento conectado a la red que permite a varios usuarios guardar y compartir archivos.
- **Patch panel**: panel que organiza las terminaciones de los cables de red, simplificando las conexiones mediante cordones de parcheo.
- **ODF (Optical Distribution Frame)**: repartidor que organiza y protege las conexiones de fibra óptica.
- **Conversor de medios**: dispositivo que convierte la señal entre distintos tipos de cableado, por ejemplo de fibra óptica a cobre.
- **Controlador WLAN**: dispositivo que centraliza la gestión de varios puntos de acceso en redes inalámbricas empresariales.
- **Rack**: estructura estandarizada que aloja y organiza dispositivos de red y servidores.
- **TAP de red**: dispositivo que duplica pasivamente el tráfico en un enlace para su análisis y monitorización, sin interrumpirlo.
- **VLAN en switch/router**: función que segmenta una red física en varias subredes virtuales, aislando el tráfico y mejorando la seguridad y la eficiencia (se profundiza en el tema dedicado).
- **QoS en switch/router**: función que asigna prioridad a determinados tipos de tráfico (voz, vídeo) frente al tráfico genérico.
- **Bridge inalámbrico**: conecta dos redes o segmentos separados mediante un enlace Wi-Fi, útil cuando no es posible una conexión por cable entre sedes.

## Diferencias importantes

| Dispositivo | Capa OSI | Función principal |
|---|---|---|
| Hub | 1 | Repite la señal en todos los puertos |
| Switch | 2 | Reenvía las tramas según la dirección MAC |
| Router | 3 | Enruta los paquetes según la dirección IP |
| Punto de acceso | 1-2 | Conecta clientes inalámbricos a la red |
| Firewall | Variable | Filtra el tráfico según reglas |
| Módem | 1 | Adapta la señal a la tecnología de acceso del proveedor |

## Hub y switch

Un **hub** es un dispositivo simple que recibe una señal en un puerto y la repite en todos los demás puertos, sin saber qué dispositivo debe recibirla realmente. Esto genera tráfico innecesario y colisiones, por lo que los hubs ya están obsoletos.

Un **switch**, en cambio, aprende qué dirección MAC está en qué puerto y reenvía cada trama solo al puerto correcto, reduciendo el tráfico innecesario y las colisiones. Para el examen: si una pregunta describe un dispositivo que "aprende" direcciones MAC y reenvía el tráfico de forma dirigida, es un switch.

## Router

El router enruta el tráfico entre redes diferentes, eligiendo la mejor ruta según la dirección IP de destino. Es el dispositivo que conecta, por ejemplo, una red local a Internet, y suele ser el punto donde se configura la puerta de enlace predeterminada de los dispositivos de la red.

## Puntos de acceso y conectividad inalámbrica

Un punto de acceso extiende una red cableada permitiendo que dispositivos inalámbricos (portátiles, smartphones, tablets) se conecten sin cable. Muchos dispositivos domésticos combinan en un único equipo las funciones de router, switch, punto de acceso y a veces módem: es importante saber distinguir las funciones incluso cuando están integradas en un solo dispositivo físico.

## Firewall

Un firewall filtra el tráfico entrante y saliente según reglas predefinidas, bloqueando lo que no está explícitamente permitido (o al revés, según la configuración). Puede ser un dispositivo dedicado, una función integrada en el router, o un software instalado en un solo ordenador.

## Módem

El módem adapta o convierte la señal procedente de la red local al formato requerido por la tecnología de acceso utilizada por el proveedor, como DSL o cable. En las conexiones de fibra, esta función puede realizarla un terminal óptico llamado ONT. En muchas instalaciones domésticas, el módem o el ONT proporciona entonces al router el acceso a la red del proveedor.

## Errores frecuentes

- Confundir hub y switch.
- Pensar que un router opera en la misma capa OSI que un switch.
- Olvidar que un punto de acceso sirve para conectar dispositivos inalámbricos, no para enrutar entre redes diferentes.
- Confundir módem y router: el módem se conecta al proveedor, el router enruta el tráfico dentro de la red local y hacia el exterior.
- Pensar que un firewall siempre es un dispositivo físico separado.
- Confundir repetidor y bridge.

## Mini escenario

Un técnico observa que, al conectar varios PC a un hub antiguo, la red se vuelve lenta y con muchas colisiones cuando varios dispositivos transmiten a la vez. Al sustituir el hub por un **switch**, el problema se resuelve, porque el switch reenvía el tráfico solo al puerto correcto en lugar de repetirlo en todos los puertos.

## Checklist

Antes de empezar el cuestionario deberías saber explicar:

- la diferencia entre hub y switch;
- para qué sirve un router frente a un switch;
- la función de un punto de acceso;
- la diferencia entre módem y router;
- para qué sirve un firewall;
- en qué capa OSI opera cada dispositivo.' WHERE topic_id = 228;

-- Topic 233 -- EN
UPDATE topic_review_pages SET content_en = '## What you really need to know

CCST Networking requires an introductory understanding of network security: what protects a network, which tools are commonly used, and some basic concepts of authentication and common threats. The depth expected of a dedicated security certification is not required.

## Key concepts

- **Firewall**: filters network traffic based on predefined rules.
- **VPN (Virtual Private Network)**: creates an encrypted connection over an untrusted network.
- **Authentication**: verifying the identity of a user or device.
- **Authorization**: defining what an authenticated user is allowed to do.
- **Password policy**: rules for creating and managing secure passwords.
- **Malware**: malicious software, including viruses, worms, ransomware and spyware.
- **Phishing**: an attempt to trick a user into revealing credentials or data.
- **Security updates (patches)**: fixes that resolve known vulnerabilities.
- **Secure Wi-Fi (WPA2/WPA3)**: encryption standards for protecting wireless networks.
- **Network segmentation**: dividing a network to limit the spread of an attack.

- **DoS and DDoS**: a DoS (Denial of Service) attack makes a service unavailable by overwhelming it from a single source; a DDoS (Distributed) attack uses multiple devices at once, making it harder to block.
- **Vulnerability and exploit**: a vulnerability is a weakness in a system that can be taken advantage of; an exploit is the code or technique used to actually take advantage of it.
- **IDS and IPS**: an IDS (Intrusion Detection System) detects and reports suspicious activity; an IPS (Intrusion Prevention System) can also block it automatically.
- **Least privilege and RBAC**: the principle of least privilege gives each user only the permissions strictly needed; RBAC (Role-Based Access Control) assigns those permissions based on job role.
- **Antivirus vs antimalware**: traditional antivirus mainly detects viruses; modern antimalware also protects against ransomware, spyware and other broader threats.
- **Man-in-the-Middle (MITM) / on-path attack**: an attack where an attacker positions themselves between two communicating parties to intercept or alter data without either party noticing; Cisco increasingly uses "on-path attack" as the more current term for the same attack.
- **Hashing and salt**: hashing turns a password into a non-reversible string; a salt is a random value added before hashing to make precomputed-table attacks harder.
- **SSL/TLS digital certificate**: a document that authenticates a website''s identity and enables an encrypted connection.
- **Honeypot**: a deliberately vulnerable system used as bait to attract and study attackers.
- **Zero Trust**: a security model that does not trust any user or device by default, inside or outside the network.
- **IPsec**: a set of protocols that encrypt and authenticate IP communications, often used in VPNs.
- **End-to-end encryption**: ensures only the sender and recipient can read the data, preventing access even by intermediaries along the transmission path.
- **Social engineering**: a category of attacks that exploits people''s trust or inattention, not technical vulnerabilities, to obtain sensitive information; phishing is one example.
- **Packet sniffer**: a tool (e.g. Wireshark) that captures and analyzes packets crossing a network, for diagnostic purposes or, if misused, to intercept data.
- **Backdoor**: a hidden way into a system, created intentionally or installed by malware, that bypasses normal authentication mechanisms.
- **Brute-force attack**: an automated attempt to guess a password by systematically trying every possible combination.
- **Security logs**: records of relevant events (logins, errors, intrusion attempts) used to detect suspicious activity.
- **2FA/MFA**: requires two or more distinct factors to verify identity (e.g. password + OTP code or fingerprint), reducing risk even if a password is compromised.
- **Patch management**: the organizational process of planning, testing and installing security updates, to systematically reduce exploit risk.

## Do not confuse

| Concept | Main meaning |
|---|---|
| Authentication | Verifying identity |
| Authorization | Defining what you''re allowed to do |
| Firewall | Filters traffic according to rules |
| VPN | Encrypts the connection over an untrusted network |
| Malware | Malicious software in general |
| Phishing | A trick used to steal credentials or data |

## Firewall and VPN

A **firewall** filters inbound and outbound traffic on a network, blocking anything that doesn''t meet configured rules. It can protect an entire network or a single device.

A **VPN** creates an encrypted tunnel between two points, letting data be exchanged securely even over a public or untrusted network, such as a free Wi-Fi connection. It''s widely used to provide secure remote access to company resources.

## Authentication vs authorization

**Authentication** verifies that a user really is who they claim to be, typically via a password, but also with other factors like tokens or biometric data. **Authorization** happens after authentication and determines which actions or resources that user can actually use.

For the exam: if a question is about verifying identity, it''s authentication. If it''s about determining what a user is allowed to do, it''s authorization.

## Common threats

**Malware** is a general term for any malicious software: viruses (spread by infecting other files), worms (spread on their own across a network), ransomware (encrypts data and demands a ransom) and spyware (collects information without consent).

**Phishing** is not a type of malware but a deception technique: an attacker pretends to be a trusted entity (a bank, a company, a colleague) to convince the victim to reveal credentials or sensitive data, often via email or fake websites.

## Security best practices

An effective **password policy** requires long, unique passwords for each service, ideally also protected with multi-factor authentication. Passwords should be changed if compromise is suspected or as required by organizational policy, avoiding arbitrary periodic changes that can encourage weaker passwords. **Security updates** fix known vulnerabilities in operating systems and applications: delaying patch installation leaves systems exposed to already-known exploits.

For wireless networks, using **WPA2 or WPA3** instead of the older, insecure WEP is essential to protect the connection from eavesdropping.

**Network segmentation** (for example via VLANs) limits the damage from a compromise, preventing an attacker who has breached one segment from easily reaching the rest of the network.

## Common exam mistakes

- Confusing authentication and authorization.
- Thinking phishing is a type of malware instead of a deception technique.
- Confusing viruses and worms.
- Thinking a VPN completely replaces the need for a firewall.
- Forgetting that WEP is now an insecure wireless standard.
- Thinking security updates are optional or can be safely postponed.

## Mini exam scenario

An employee receives an email that appears to come from their bank, asking them to click a link and enter their credentials to "verify the account." The linked site is fake and designed to steal credentials. This is a classic example of **phishing**, a deception technique that exploits user trust more than a technical vulnerability.

## Checklist

Before starting the quiz you should be able to explain:

- what a firewall is for and what a VPN is for;
- the difference between authentication and authorization;
- the difference between viruses, worms, ransomware and spyware;
- what phishing is;
- why WPA2/WPA3 are preferable to WEP;
- why security updates matter.' WHERE topic_id = 233;

-- Topic 233 -- FR
UPDATE topic_review_pages SET content_fr = '## Ce qu''il faut vraiment savoir

Le CCST Networking exige une connaissance introductive de la sécurité réseau : ce qui protège un réseau, les outils couramment utilisés, et quelques notions de base sur l''authentification et les menaces courantes. La profondeur attendue d''une certification dédiée à la sécurité n''est pas requise.

## Concepts clés

- **Pare-feu** : filtre le trafic réseau selon des règles prédéfinies.
- **VPN (Virtual Private Network)** : crée une connexion chiffrée sur un réseau non fiable.
- **Authentification** : vérification de l''identité d''un utilisateur ou d''un équipement.
- **Autorisation** : définition de ce qu''un utilisateur authentifié est autorisé à faire.
- **Politique de mots de passe** : règles pour créer et gérer des mots de passe sécurisés.
- **Malware** : logiciel malveillant, incluant virus, vers, ransomwares et spywares.
- **Phishing** : tentative de tromper un utilisateur pour lui voler des identifiants ou des données.
- **Mises à jour de sécurité (patchs)** : correctifs qui résolvent des vulnérabilités connues.
- **Wi-Fi sécurisé (WPA2/WPA3)** : normes de chiffrement pour protéger les réseaux sans fil.
- **Segmentation réseau** : division du réseau pour limiter la propagation d''une attaque.

- **DoS et DDoS** : une attaque DoS (Denial of Service) rend un service indisponible en le surchargeant depuis une seule source ; une attaque DDoS (Distributed) utilise plusieurs équipements simultanément, ce qui la rend plus difficile à bloquer.
- **Vulnérabilité et exploit** : une vulnérabilité est une faiblesse d''un système qui peut être exploitée ; un exploit est le code ou la technique utilisée pour l''exploiter concrètement.
- **IDS et IPS** : un IDS (Intrusion Detection System) détecte et signale les activités suspectes ; un IPS (Intrusion Prevention System) peut aussi les bloquer automatiquement.
- **Moindre privilège et RBAC** : le principe du moindre privilège n''accorde à chaque utilisateur que les autorisations strictement nécessaires ; le RBAC (Role-Based Access Control) attribue ces autorisations en fonction du rôle dans l''organisation.
- **Antivirus contre antimalware** : l''antivirus traditionnel détecte principalement les virus ; l''antimalware moderne protège aussi contre les ransomwares, les spywares et d''autres menaces plus larges.
- **Man-in-the-Middle (MITM) / on-path attack** : attaque dans laquelle un attaquant s''insère entre deux parties qui communiquent pour intercepter ou modifier les données à leur insu ; Cisco utilise de plus en plus « on-path attack » comme terme plus récent pour désigner la même attaque.
- **Hashing et salt** : le hashing transforme un mot de passe en une chaîne non réversible ; le salt est une valeur aléatoire ajoutée avant le hashing pour rendre plus difficiles les attaques par tables précalculées.
- **Certificat numérique SSL/TLS** : document qui authentifie l''identité d''un site web et active le chiffrement de la connexion.
- **Honeypot** : système volontairement vulnérable utilisé comme leurre pour attirer et étudier les attaquants.
- **Zero Trust** : modèle de sécurité qui ne fait par défaut confiance à aucun utilisateur ni équipement, à l''intérieur comme à l''extérieur du réseau.
- **IPsec** : ensemble de protocoles qui chiffrent et authentifient les communications IP, souvent utilisés dans les VPN.
- **Chiffrement de bout en bout** : garantit que seuls l''expéditeur et le destinataire peuvent lire les données, empêchant l''accès même aux intermédiaires de la transmission.
- **Ingénierie sociale (social engineering)** : catégorie d''attaques qui exploite la confiance ou l''inattention des personnes, et non des vulnérabilités techniques, pour obtenir des informations sensibles ; le phishing en est un exemple.
- **Analyseur de paquets (packet sniffer)** : outil (ex. Wireshark) qui capture et analyse les paquets qui traversent un réseau, à des fins de diagnostic ou, en cas d''usage malveillant, pour intercepter des données.
- **Porte dérobée (backdoor)** : accès caché à un système, créé intentionnellement ou installé par un malware, qui permet de contourner les mécanismes d''authentification normaux.
- **Attaque par force brute** : tentative automatisée de deviner un mot de passe en essayant systématiquement toutes les combinaisons possibles.
- **Journaux de sécurité** : enregistrements des événements pertinents (connexions, erreurs, tentatives d''intrusion) utilisés pour détecter une activité suspecte.
- **2FA/MFA** : exige deux facteurs distincts ou plus pour vérifier l''identité (ex. mot de passe + code OTP ou empreinte digitale), réduisant le risque même en cas de mot de passe compromis.
- **Gestion des correctifs (patch management)** : processus organisationnel de planification, de test et d''installation des mises à jour de sécurité, pour réduire systématiquement le risque d''exploit.

## À ne pas confondre

| Concept | Signification principale |
|---|---|
| Authentification | Vérification de l''identité |
| Autorisation | Définition de ce qu''on est autorisé à faire |
| Pare-feu | Filtre le trafic selon des règles |
| VPN | Chiffre la connexion sur un réseau non fiable |
| Malware | Logiciel malveillant en général |
| Phishing | Tromperie visant à voler des identifiants ou des données |

## Pare-feu et VPN

Un **pare-feu** filtre le trafic entrant et sortant d''un réseau, en bloquant ce qui ne respecte pas les règles configurées. Il peut protéger un réseau entier ou un seul équipement.

Un **VPN** crée un tunnel chiffré entre deux points, permettant d''échanger des données en toute sécurité même sur un réseau public ou non fiable, comme une connexion Wi-Fi gratuite. Il est très utilisé pour permettre un accès distant sécurisé aux ressources de l''entreprise.

## Authentification contre autorisation

L''**authentification** vérifie qu''un utilisateur est bien celui qu''il prétend être, généralement via un mot de passe, mais aussi avec d''autres facteurs comme un jeton ou des données biométriques. L''**autorisation** intervient après l''authentification et détermine quelles actions ou ressources cet utilisateur peut réellement utiliser.

Pour l''examen : si une question parle de vérifier l''identité, il s''agit d''authentification. Si elle parle de déterminer ce qu''un utilisateur peut faire, il s''agit d''autorisation.

## Menaces courantes

Le **malware** est un terme général désignant tout logiciel malveillant : le virus (se propage en infectant d''autres fichiers), le ver (se propage de manière autonome sur le réseau), le ransomware (chiffre les données et exige une rançon) et le spyware (collecte des informations sans consentement).

Le **phishing** n''est pas un type de malware mais une technique de tromperie : un attaquant se fait passer pour une entité de confiance (banque, entreprise, collègue) pour convaincre la victime de révéler des identifiants ou des données sensibles, souvent par email ou via de faux sites.

## Bonnes pratiques de sécurité

Une **politique de mots de passe** efficace exige des mots de passe longs et uniques pour chaque service, idéalement aussi protégés par une authentification multifacteur. Les mots de passe doivent être changés en cas de compromission suspectée ou selon les règles de l''organisation, en évitant les changements périodiques arbitraires qui peuvent favoriser des mots de passe plus faibles. Les **mises à jour de sécurité** corrigent des vulnérabilités connues dans les systèmes d''exploitation et les applications : retarder l''installation des correctifs laisse les systèmes exposés à des exploits déjà connus.

Pour les réseaux sans fil, utiliser **WPA2 ou WPA3** plutôt que l''ancien WEP, moins sûr, est essentiel pour protéger la connexion contre les interceptions.

La **segmentation réseau** (par exemple via des VLAN) limite les dégâts d''une compromission, empêchant un attaquant ayant violé un segment d''atteindre facilement le reste du réseau.

## Erreurs fréquentes

- Confondre authentification et autorisation.
- Penser que le phishing est un type de malware plutôt qu''une technique de tromperie.
- Confondre virus et ver.
- Penser qu''un VPN remplace complètement la nécessité d''un pare-feu.
- Oublier que le WEP est désormais un standard sans fil non sécurisé.
- Penser que les mises à jour de sécurité sont facultatives ou peuvent être reportées sans risque.

## Mini scénario

Un employé reçoit un email semblant provenir de sa banque, lui demandant de cliquer sur un lien et de saisir ses identifiants pour « vérifier le compte ». Le site lié est faux et conçu pour voler les identifiants. Il s''agit d''un exemple classique de **phishing**, une technique de tromperie qui exploite la confiance de l''utilisateur plus qu''une vulnérabilité technique.

## Checklist

Avant de commencer le quiz, vous devez savoir expliquer :

- à quoi sert un pare-feu et à quoi sert un VPN ;
- la différence entre authentification et autorisation ;
- la différence entre virus, ver, ransomware et spyware ;
- ce qu''est le phishing ;
- pourquoi WPA2/WPA3 sont préférables au WEP ;
- pourquoi les mises à jour de sécurité sont importantes.' WHERE topic_id = 233;

-- Topic 233 -- ES
UPDATE topic_review_pages SET content_es = '## Lo que realmente debes saber

El CCST Networking exige un conocimiento introductorio de la seguridad de red: qué protege una red, qué herramientas se usan habitualmente, y algunos conceptos básicos de autenticación y amenazas comunes. No se requiere la profundidad de una certificación dedicada a la seguridad.

## Conceptos clave

- **Firewall**: filtra el tráfico de red según reglas predefinidas.
- **VPN (Virtual Private Network)**: crea una conexión cifrada sobre una red no confiable.
- **Autenticación**: verificación de la identidad de un usuario o dispositivo.
- **Autorización**: definición de lo que un usuario autenticado puede hacer.
- **Política de contraseñas**: reglas para crear y gestionar contraseñas seguras.
- **Malware**: software malicioso, incluye virus, gusanos, ransomware y spyware.
- **Phishing**: intento de engañar a un usuario para robarle credenciales o datos.
- **Actualizaciones de seguridad (parches)**: correcciones que resuelven vulnerabilidades conocidas.
- **Wi-Fi seguro (WPA2/WPA3)**: estándares de cifrado para proteger las redes inalámbricas.
- **Segmentación de red**: división de la red para limitar la propagación de un ataque.

- **DoS y DDoS**: un ataque DoS (Denial of Service) deja un servicio no disponible sobrecargándolo desde una única fuente; un DDoS (Distributed) usa varios dispositivos a la vez, lo que hace el ataque más difícil de bloquear.
- **Vulnerabilidad y exploit**: una vulnerabilidad es una debilidad de un sistema que puede aprovecharse; un exploit es el código o la técnica usada para aprovecharla realmente.
- **IDS e IPS**: un IDS (Intrusion Detection System) detecta y notifica actividad sospechosa; un IPS (Intrusion Prevention System) también puede bloquearla automáticamente.
- **Privilegio mínimo y RBAC**: el principio de privilegio mínimo concede a cada usuario solo los permisos estrictamente necesarios; el RBAC (Role-Based Access Control) asigna esos permisos según el rol dentro de la organización.
- **Antivirus frente a antimalware**: el antivirus tradicional detecta principalmente virus; el antimalware moderno protege también frente a ransomware, spyware y otras amenazas más amplias.
- **Man-in-the-Middle (MITM) / on-path attack**: ataque en el que un atacante se sitúa entre dos partes que se comunican para interceptar o alterar los datos sin que ninguna de ellas lo note; Cisco usa cada vez más "on-path attack" como término más reciente para el mismo ataque.
- **Hashing y salt**: el hashing convierte una contraseña en una cadena no reversible; el salt es un valor aleatorio añadido antes del hashing para dificultar los ataques con tablas precalculadas.
- **Certificado digital SSL/TLS**: documento que autentica la identidad de un sitio web y habilita el cifrado de la conexión.
- **Honeypot**: sistema deliberadamente vulnerable usado como señuelo para atraer y estudiar a los atacantes.
- **Zero Trust**: modelo de seguridad que no confía por defecto en ningún usuario o dispositivo, dentro o fuera de la red.
- **IPsec**: conjunto de protocolos que cifran y autentican las comunicaciones IP, usado a menudo en las VPN.
- **Cifrado de extremo a extremo**: garantiza que solo el emisor y el receptor puedan leer los datos, impidiendo el acceso incluso a los intermediarios de la transmisión.
- **Ingeniería social (social engineering)**: categoría de ataques que explota la confianza o el descuido de las personas, no las vulnerabilidades técnicas, para obtener información confidencial; el phishing es un ejemplo.
- **Packet sniffer**: herramienta (ej. Wireshark) que captura y analiza los paquetes que atraviesan una red, con fines de diagnóstico o, si se usa de forma maliciosa, para interceptar datos.
- **Backdoor (puerta trasera)**: acceso oculto a un sistema, creado intencionadamente o instalado por un malware, que permite eludir los mecanismos normales de autenticación.
- **Ataque de fuerza bruta**: intento automatizado de adivinar una contraseña probando sistemáticamente todas las combinaciones posibles.
- **Registros de seguridad (logs)**: registro de eventos relevantes (accesos, errores, intentos de intrusión) usado para detectar actividad sospechosa.
- **2FA/MFA**: requiere dos o más factores distintos para verificar la identidad (ej. contraseña + código OTP o huella digital), reduciendo el riesgo incluso si la contraseña se ve comprometida.
- **Gestión de parches (patch management)**: proceso organizativo de planificación, prueba e instalación de actualizaciones de seguridad, para reducir sistemáticamente el riesgo de exploits.

## Diferencias importantes

| Concepto | Significado principal |
|---|---|
| Autenticación | Verificación de la identidad |
| Autorización | Definición de lo que se puede hacer |
| Firewall | Filtra el tráfico según reglas |
| VPN | Cifra la conexión sobre una red no confiable |
| Malware | Software malicioso en general |
| Phishing | Engaño para robar credenciales o datos |

## Firewall y VPN

Un **firewall** filtra el tráfico entrante y saliente de una red, bloqueando lo que no cumple las reglas configuradas. Puede proteger toda una red o un solo dispositivo.

Una **VPN** crea un túnel cifrado entre dos puntos, permitiendo intercambiar datos de forma segura incluso sobre una red pública o no confiable, como una conexión Wi-Fi gratuita. Se usa mucho para permitir el acceso remoto seguro a los recursos de la empresa.

## Autenticación frente a autorización

La **autenticación** verifica que un usuario es realmente quien dice ser, normalmente mediante una contraseña, pero también con otros factores como tokens o datos biométricos. La **autorización** ocurre después de la autenticación y establece qué acciones o recursos puede usar realmente ese usuario.

Para el examen: si una pregunta habla de verificar la identidad, es autenticación. Si habla de establecer qué puede hacer un usuario, es autorización.

## Amenazas comunes

El **malware** es un término general para cualquier software malicioso: el virus (se propaga infectando otros archivos), el gusano (se propaga de forma autónoma por la red), el ransomware (cifra los datos exigiendo un rescate) y el spyware (recopila información sin consentimiento).

El **phishing** no es un tipo de malware sino una técnica de engaño: un atacante se hace pasar por una entidad de confianza (banco, empresa, compañero) para convencer a la víctima de revelar credenciales o datos sensibles, a menudo mediante correo electrónico o sitios falsos.

## Buenas prácticas de seguridad

Una **política de contraseñas** eficaz exige contraseñas largas y únicas para cada servicio, preferiblemente protegidas también con autenticación multifactor. Las contraseñas deben cambiarse en caso de sospecha de compromiso o cuando lo indiquen las políticas de la organización, evitando cambios periódicos arbitrarios que pueden favorecer contraseñas más débiles. Las **actualizaciones de seguridad** corrigen vulnerabilidades conocidas en los sistemas operativos y las aplicaciones: retrasar la instalación de los parches deja los sistemas expuestos a exploits ya conocidos.

Para las redes inalámbricas, usar **WPA2 o WPA3** en lugar del más antiguo e inseguro WEP es fundamental para proteger la conexión frente a interceptaciones.

La **segmentación de red** (por ejemplo mediante VLAN) limita los daños de una vulneración, impidiendo que un atacante que ha vulnerado un segmento alcance fácilmente el resto de la red.

## Errores frecuentes

- Confundir autenticación y autorización.
- Pensar que el phishing es un tipo de malware en lugar de una técnica de engaño.
- Confundir virus y gusano.
- Pensar que una VPN sustituye por completo la necesidad de un firewall.
- Olvidar que el WEP es un estándar inalámbrico ya inseguro.
- Pensar que las actualizaciones de seguridad son opcionales o pueden posponerse sin riesgo.

## Mini escenario

Un empleado recibe un correo que parece provenir de su banco, pidiéndole que haga clic en un enlace e introduzca sus credenciales para "verificar la cuenta". El sitio enlazado es falso y está diseñado para robar las credenciales. Este es un ejemplo clásico de **phishing**, una técnica de engaño que explota la confianza del usuario más que una vulnerabilidad técnica.

## Checklist

Antes de empezar el cuestionario deberías saber explicar:

- para qué sirve un firewall y para qué sirve una VPN;
- la diferencia entre autenticación y autorización;
- la diferencia entre virus, gusano, ransomware y spyware;
- qué es el phishing;
- por qué WPA2/WPA3 son preferibles a WEP;
- por qué son importantes las actualizaciones de seguridad.' WHERE topic_id = 233;

-- Topic 234 -- EN
UPDATE topic_review_pages SET content_en = '## What you really need to know

When a network isn''t working as it should, you need a method and tools to identify the problem. CCST requires knowing basic diagnostic commands and a systematic approach to troubleshooting.

## Key concepts

- **ping**: checks whether a device is reachable and measures response time.
- **traceroute (or tracert)**: shows the path packets take to a destination, hop by hop.
- **ipconfig / ifconfig**: shows the local device''s IP configuration.
- **nslookup**: queries a DNS server to check name resolution.
- **Layered troubleshooting method**: an approach that checks a problem starting from one OSI layer (often the physical layer) and moving upward.
- **Problem isolation**: determining whether a problem affects a single device, a network segment, or the entire network.
- **Documentation**: recording what was checked and what changes were made during troubleshooting.
- **Baseline**: normal reference behavior, useful for recognizing an anomaly.
- **Faulty network cable**: one of the most common causes of physical-layer problems.
- **IP address conflict**: when two devices on the same network have the same IP address.

- **netstat**: shows active network connections and listening ports on the device.
- **Wireshark**: a packet sniffer that captures and analyzes network traffic in detail.
- **MTU**: the maximum packet size that can be transmitted on an interface without fragmentation; an incorrect MTU can cause slowdowns or malfunctions (covered in more detail in the OSI/TCP-IP models topic).
- **arp -a**: shows the ARP table, which maps IP addresses to MAC addresses on the local network.
- **Continuous ping (ping -t)**: sends ICMP packets indefinitely, useful for monitoring connection stability and detecting intermittent disconnections.
- **Loopback test**: verifies that the TCP/IP stack is working correctly on the local device (e.g. pinging 127.0.0.1), independent of the external network; a loopback cable does the same at the physical layer, redirecting the signal back to the port itself.
- **Speed test**: checks whether actual download/upload speed matches what the provider advertises.
- **ip addr**: a newer Linux command, an alternative to ifconfig, that shows the same information about network interfaces.
- **ipconfig /all and /flushdns**: /all shows the full network configuration (IP, gateway, DNS, MAC); /flushdns clears the local DNS cache, forcing new name resolutions.
- **Bottleneck**: a point in the network where transfer capacity is lower than the rest, slowing down the whole flow of data.
- **Packet loss**: can be caused by congestion, interference, faulty cables or overloaded devices.
- **Firmware update**: as a troubleshooting technique, it fixes bugs and vulnerabilities that can cause stability or compatibility issues.
- **Factory reset**: as a troubleshooting technique, it restores a device to its original settings when misconfigurations prevent it from working (command details covered in the basic configuration topic).
- **Real-time monitoring**: dedicated tools that continuously observe network status, letting you quickly detect traffic spikes, abnormal latency or disconnections before they become critical problems.
- **System logs**: record events such as errors and configuration changes, useful for identifying the cause of a malfunction.
- **"Request timed out"**: a message indicating that an ICMP packet received no reply within the time limit, often due to network problems or a firewall blocking ICMP.
- **Cross-testing**: connecting another device to the same network to determine whether the problem lies with the original device or the network itself.
- **Comparing against a configuration backup**: comparing the current configuration with a previously working version helps identify changes that introduced the error.

## Do not confuse

| Tool | What it shows |
|---|---|
| ping | Whether a host is reachable and the response time |
| traceroute | The hop-by-hop path to a destination |
| ipconfig/ifconfig | The local device''s IP configuration |
| nslookup | Name resolution via DNS |

## The layered troubleshooting method

An effective and widely cited approach in CCST is to check problems starting from the **physical layer** (is the cable connected? is the port working? is the link light on?) and moving progressively upward: Data Link layer (does the switch see the device?), Network layer (is the IP address correct?), up to the higher layers (does the application service respond?).

This approach avoids jumping straight to complex hypotheses when the cause could be something simple, like an unplugged cable.

## Basic diagnostic tools

The **ping** command sends test packets to an IP address or domain name and checks whether a reply arrives, also measuring round-trip time. It''s the first tool to use to check whether a device is reachable.

The **traceroute** command (or tracert on Windows) shows every "hop" (router) the packets pass through before reaching the destination, useful for finding out exactly where along the path a problem occurs.

The **ipconfig** (Windows) or **ifconfig** (Linux/Mac) command shows the device''s current IP configuration: IP address, subnet mask, gateway. It''s the first step in checking whether the device has received a valid network configuration.

The **nslookup** command lets you check whether a domain name resolves correctly to an IP address, useful for isolating DNS problems.

## Isolating the problem

A key troubleshooting step is figuring out whether a problem affects a single device, an entire network segment, or just a specific service. For example, if one PC can''t browse the web but other PCs on the same network work normally, the problem is probably local to that device, not the network as a whole.

## Documentation and baseline

Knowing a network''s normal behavior (**baseline**) helps you recognize an anomaly more quickly. Documenting what was checked during troubleshooting helps avoid repeating the same checks and makes it easier to collaborate with other technicians.

## Common exam mistakes

- Confusing ping and traceroute.
- Thinking ipconfig changes the network configuration instead of just displaying it.
- Skipping physical-layer checks to jump straight to more complex hypotheses.
- Failing to isolate whether the problem affects a single device or the entire network.
- Forgetting to check for an IP address conflict as a possible cause.
- Ignoring the importance of documentation during troubleshooting.

## Mini exam scenario

A user reports being unable to reach a website. The technician pings the server''s IP address and gets a reply, but pinging the domain name fails. This points to a likely **DNS resolution** problem, not a general connectivity problem, because communication via IP address works correctly.

## Checklist

Before starting the quiz you should be able to explain:

- what the ping command is for;
- what traceroute is for;
- what ipconfig/ifconfig is for;
- the layered troubleshooting method, starting from the physical layer;
- how to isolate whether a problem affects one device or the entire network;
- why documentation is useful during troubleshooting.' WHERE topic_id = 234;

-- Topic 234 -- FR
UPDATE topic_review_pages SET content_fr = '## Ce qu''il faut vraiment savoir

Lorsqu''un réseau ne fonctionne pas comme il devrait, il faut une méthode et des outils pour identifier le problème. Le CCST exige de connaître les commandes de diagnostic de base et une approche systématique de la résolution de problèmes.

## Concepts clés

- **ping** : vérifie l''accessibilité d''un équipement et mesure le temps de réponse.
- **traceroute (ou tracert)** : affiche le chemin emprunté par les paquets vers une destination, saut par saut.
- **ipconfig / ifconfig** : affiche la configuration IP de l''équipement local.
- **nslookup** : interroge un serveur DNS pour vérifier la résolution d''un nom de domaine.
- **Méthode de dépannage par couches** : approche qui examine un problème en partant d''une couche OSI (souvent la couche physique) et en remontant progressivement.
- **Isolement du problème** : déterminer si le problème concerne un seul équipement, un segment de réseau ou l''ensemble du réseau.
- **Documentation** : enregistrement de ce qui a été vérifié et des modifications effectuées pendant la résolution.
- **Baseline (référence)** : comportement normal de référence, utile pour reconnaître une anomalie.
- **Câble réseau défectueux** : l''une des causes les plus courantes de problèmes au niveau physique.
- **Conflit d''adresse IP** : lorsque deux équipements du même réseau ont la même adresse IP.

- **netstat** : affiche les connexions réseau actives et les ports en écoute sur l''équipement.
- **Wireshark** : analyseur de paquets qui capture et analyse en détail le trafic réseau.
- **MTU** : taille maximale d''un paquet transmissible sur une interface sans fragmentation ; un MTU incorrect peut provoquer des ralentissements ou des dysfonctionnements (approfondi dans le thème sur les modèles OSI/TCP-IP).
- **arp -a** : affiche la table ARP, qui associe les adresses IP aux adresses MAC sur le réseau local.
- **Ping continu (ping -t)** : envoie des paquets ICMP indéfiniment, utile pour surveiller la stabilité d''une connexion et détecter des déconnexions intermittentes.
- **Test de bouclage (loopback)** : vérifie que la pile TCP/IP fonctionne correctement sur l''équipement local (ex. ping vers 127.0.0.1), indépendamment du réseau externe ; un câble de bouclage fait de même au niveau physique, en redirigeant le signal vers le port lui-même.
- **Test de vitesse** : vérifie si la vitesse réelle de téléchargement/envoi correspond à celle annoncée par le fournisseur.
- **ip addr** : commande Linux plus récente, alternative à ifconfig, qui affiche les mêmes informations sur les interfaces réseau.
- **ipconfig /all et /flushdns** : /all affiche la configuration réseau complète (IP, passerelle, DNS, MAC) ; /flushdns vide le cache DNS local, forçant de nouvelles résolutions de noms.
- **Goulot d''étranglement (bottleneck)** : point du réseau où la capacité de transfert est inférieure au reste, ralentissant l''ensemble du flux de données.
- **Perte de paquets** : peut être causée par de la congestion, des interférences, des câbles défectueux ou des équipements surchargés.
- **Mise à jour du firmware** : en tant que technique de dépannage, elle corrige des bugs et des vulnérabilités pouvant causer des problèmes de stabilité ou de compatibilité.
- **Réinitialisation d''usine** : en tant que technique de dépannage, elle rétablit les paramètres d''origine d''un équipement lorsque des erreurs de configuration en empêchent le fonctionnement (détails de la commande dans le thème sur la configuration de base).
- **Surveillance en temps réel** : outils dédiés qui observent en permanence l''état du réseau, permettant de détecter rapidement des pics de trafic, une latence anormale ou des déconnexions avant qu''ils ne deviennent des problèmes critiques.
- **Journaux système** : enregistrent des événements comme des erreurs et des modifications de configuration, utiles pour identifier la cause d''un dysfonctionnement.
- **« Request timed out »** : message indiquant qu''un paquet ICMP n''a reçu aucune réponse dans le délai imparti, souvent en raison de problèmes réseau ou d''un pare-feu bloquant l''ICMP.
- **Test croisé** : connecter un autre équipement au même réseau pour déterminer si le problème vient de l''équipement d''origine ou du réseau lui-même.
- **Comparaison avec une sauvegarde de configuration** : comparer la configuration actuelle avec une version précédente fonctionnelle aide à identifier les modifications ayant introduit l''erreur.

## À ne pas confondre

| Outil | Ce qu''il affiche |
|---|---|
| ping | Si un hôte est accessible et le temps de réponse |
| traceroute | Le chemin saut par saut vers une destination |
| ipconfig/ifconfig | La configuration IP de l''équipement local |
| nslookup | La résolution d''un nom de domaine via DNS |

## La méthode de dépannage par couches

Une approche efficace et très citée dans le CCST consiste à vérifier les problèmes en partant de la **couche physique** (le câble est-il branché ? le port fonctionne-t-il ? le voyant de liaison est-il allumé ?) et en remontant progressivement : couche liaison de données (le switch voit-il l''équipement ?), couche réseau (l''adresse IP est-elle correcte ?), jusqu''aux couches supérieures (le service applicatif répond-il ?).

Cette approche évite de sauter directement à des hypothèses complexes quand la cause peut être quelque chose de simple, comme un câble débranché.

## Outils de diagnostic de base

La commande **ping** envoie des paquets de test vers une adresse IP ou un nom de domaine et vérifie si une réponse arrive, en mesurant aussi le temps aller-retour. C''est le premier outil à utiliser pour savoir si un équipement est accessible.

La commande **traceroute** (ou tracert sous Windows) affiche chaque « saut » (routeur) traversé par les paquets avant d''atteindre la destination, utile pour savoir précisément où le long du trajet un problème se produit.

La commande **ipconfig** (Windows) ou **ifconfig** (Linux/Mac) affiche la configuration IP actuelle de l''équipement : adresse IP, masque de sous-réseau, passerelle. C''est la première étape pour vérifier si l''équipement a reçu une configuration réseau valide.

La commande **nslookup** permet de vérifier si un nom de domaine est correctement résolu en une adresse IP, utile pour isoler les problèmes de DNS.

## Isoler le problème

Une étape clé du dépannage consiste à comprendre si le problème concerne un seul équipement, tout un segment de réseau, ou seulement un service spécifique. Par exemple, si un seul PC ne parvient pas à naviguer mais que les autres PC du même réseau fonctionnent normalement, le problème est probablement local à cet équipement, et non lié au réseau dans son ensemble.

## Documentation et baseline

Connaître le comportement normal d''un réseau (**baseline**) aide à reconnaître plus rapidement une anomalie. Documenter ce qui a été vérifié pendant la résolution d''un problème permet d''éviter de répéter les mêmes contrôles et facilite la collaboration avec d''autres techniciens.

## Erreurs fréquentes

- Confondre ping et traceroute.
- Penser qu''ipconfig modifie la configuration réseau au lieu de simplement l''afficher.
- Sauter les vérifications de la couche physique pour envisager immédiatement des causes plus complexes.
- Ne pas isoler si le problème concerne un seul équipement ou l''ensemble du réseau.
- Oublier de vérifier un conflit d''adresse IP comme cause possible.
- Ignorer l''importance de la documentation pendant la résolution d''un problème.

## Mini scénario

Un utilisateur signale qu''il ne parvient pas à atteindre un site web. Le technicien effectue un ping vers l''adresse IP du serveur et obtient une réponse, mais le ping vers le nom de domaine échoue. Cela indique un probable problème de **résolution DNS**, et non un problème général de connectivité réseau, car la communication via l''adresse IP fonctionne correctement.

## Checklist

Avant de commencer le quiz, vous devez savoir expliquer :

- à quoi sert la commande ping ;
- à quoi sert traceroute ;
- à quoi sert ipconfig/ifconfig ;
- la méthode de dépannage par couches, en partant de la couche physique ;
- comment isoler si un problème concerne un équipement ou l''ensemble du réseau ;
- pourquoi la documentation est utile pendant le dépannage.' WHERE topic_id = 234;

-- Topic 234 -- ES
UPDATE topic_review_pages SET content_es = '## Lo que realmente debes saber

Cuando una red no funciona como debería, se necesitan un método y unas herramientas para identificar el problema. El CCST exige conocer los comandos de diagnóstico básicos y un enfoque sistemático para la resolución de problemas.

## Conceptos clave

- **ping**: verifica la accesibilidad de un dispositivo y mide el tiempo de respuesta.
- **traceroute (o tracert)**: muestra el camino que siguen los paquetes hacia un destino, salto a salto.
- **ipconfig / ifconfig**: muestra la configuración IP del dispositivo local.
- **nslookup**: consulta un servidor DNS para verificar la resolución de un nombre de dominio.
- **Método de resolución de problemas por capas**: enfoque que examina un problema empezando por una capa OSI (a menudo la capa física) y avanzando progresivamente hacia arriba.
- **Aislamiento del problema**: determinar si el problema afecta a un solo dispositivo, a un segmento de red o a toda la red.
- **Documentación**: registro de lo verificado y de los cambios realizados durante la resolución.
- **Baseline (referencia)**: comportamiento normal de referencia, útil para reconocer una anomalía.
- **Cable de red defectuoso**: una de las causas más comunes de problemas a nivel físico.
- **Conflicto de direcciones IP**: cuando dos dispositivos de la misma red tienen la misma dirección IP.

- **netstat**: muestra las conexiones de red activas y los puertos en escucha del dispositivo.
- **Wireshark**: analizador de paquetes que captura y analiza en detalle el tráfico de red.
- **MTU**: tamaño máximo de un paquete transmisible en una interfaz sin fragmentación; un MTU incorrecto puede causar ralentizaciones o fallos (se profundiza en el tema de los modelos OSI/TCP-IP).
- **arp -a**: muestra la tabla ARP, que asocia direcciones IP con direcciones MAC en la red local.
- **Ping continuo (ping -t)**: envía paquetes ICMP de forma indefinida, útil para monitorizar la estabilidad de una conexión y detectar desconexiones intermitentes.
- **Prueba de loopback**: verifica que la pila TCP/IP funciona correctamente en el dispositivo local (ej. ping a 127.0.0.1), independientemente de la red externa; un cable de loopback hace lo mismo a nivel físico, redirigiendo la señal de vuelta al propio puerto.
- **Prueba de velocidad**: verifica si la velocidad real de descarga/subida coincide con la anunciada por el proveedor.
- **ip addr**: comando de Linux más reciente, alternativo a ifconfig, que muestra la misma información sobre las interfaces de red.
- **ipconfig /all y /flushdns**: /all muestra la configuración de red completa (IP, gateway, DNS, MAC); /flushdns vacía la caché DNS local, forzando nuevas resoluciones de nombres.
- **Cuello de botella (bottleneck)**: punto de la red donde la capacidad de transferencia es inferior al resto, ralentizando todo el flujo de datos.
- **Pérdida de paquetes**: puede deberse a congestión, interferencias, cables defectuosos o dispositivos sobrecargados.
- **Actualización de firmware**: como técnica de resolución de problemas, corrige errores y vulnerabilidades que pueden causar problemas de estabilidad o compatibilidad.
- **Restablecimiento de fábrica**: como técnica de resolución de problemas, devuelve un dispositivo a su configuración original cuando configuraciones erróneas impiden su funcionamiento (detalles del comando en el tema de configuración básica).
- **Monitorización en tiempo real**: herramientas dedicadas que observan constantemente el estado de la red, permitiendo detectar rápidamente picos de tráfico, latencia anómala o desconexiones antes de que se conviertan en problemas críticos.
- **Registros del sistema**: registran eventos como errores y cambios de configuración, útiles para identificar la causa de un fallo.
- **"Request timed out"**: mensaje que indica que un paquete ICMP no recibió respuesta dentro del tiempo límite, a menudo por problemas de red o un firewall que bloquea ICMP.
- **Prueba cruzada**: conectar otro dispositivo a la misma red para determinar si el problema es del dispositivo original o de la red misma.
- **Comparación con una copia de seguridad de la configuración**: comparar la configuración actual con una versión anterior que funcionaba ayuda a identificar los cambios que introdujeron el error.

## Diferencias importantes

| Herramienta | Qué muestra |
|---|---|
| ping | Si un host es accesible y el tiempo de respuesta |
| traceroute | El camino salto a salto hacia un destino |
| ipconfig/ifconfig | La configuración IP del dispositivo local |
| nslookup | La resolución de un nombre de dominio mediante DNS |

## El método de resolución de problemas por capas

Un enfoque eficaz y muy citado en el CCST consiste en verificar los problemas empezando por la **capa física** (¿está conectado el cable? ¿funciona el puerto? ¿está encendida la luz de enlace?) y avanzando progresivamente: capa de enlace de datos (¿ve el switch el dispositivo?), capa de red (¿es correcta la dirección IP?), hasta las capas superiores (¿responde el servicio de la aplicación?).

Este enfoque evita saltar directamente a hipótesis complejas cuando la causa puede ser algo simple, como un cable desconectado.

## Herramientas de diagnóstico básicas

El comando **ping** envía paquetes de prueba a una dirección IP o un nombre de dominio y verifica si llega una respuesta, midiendo también el tiempo de ida y vuelta. Es la primera herramienta que se debe usar para saber si un dispositivo es accesible.

El comando **traceroute** (o tracert en Windows) muestra cada "salto" (router) por el que pasan los paquetes antes de llegar al destino, útil para saber exactamente dónde a lo largo del camino se produce un problema.

El comando **ipconfig** (Windows) o **ifconfig** (Linux/Mac) muestra la configuración IP actual del dispositivo: dirección IP, máscara de subred, gateway. Es el primer paso para verificar si el dispositivo ha recibido una configuración de red válida.

El comando **nslookup** permite verificar si un nombre de dominio se resuelve correctamente en una dirección IP, útil para aislar problemas de DNS.

## Aislar el problema

Un paso clave en la resolución de problemas es entender si el problema afecta a un solo dispositivo, a todo un segmento de red o solo a un servicio específico. Por ejemplo, si un solo PC no puede navegar pero otros PC de la misma red funcionan con normalidad, el problema probablemente sea local a ese dispositivo, no a la red en su conjunto.

## Documentación y baseline

Conocer el comportamiento normal de una red (**baseline**) ayuda a reconocer una anomalía más rápidamente. Documentar lo verificado durante la resolución de un problema ayuda a evitar repetir las mismas comprobaciones y facilita la colaboración con otros técnicos.

## Errores frecuentes

- Confundir ping y traceroute.
- Pensar que ipconfig modifica la configuración de red en lugar de solo mostrarla.
- Saltarse las comprobaciones de capa física para pasar directamente a hipótesis más complejas.
- No aislar si el problema afecta a un solo dispositivo o a toda la red.
- Olvidar comprobar un conflicto de direcciones IP como posible causa.
- Ignorar la importancia de la documentación durante la resolución de un problema.

## Mini escenario

Un usuario informa de que no puede acceder a un sitio web. El técnico hace ping a la dirección IP del servidor y obtiene respuesta, pero el ping al nombre de dominio falla. Esto indica un probable problema de **resolución DNS**, no de conectividad de red en general, porque la comunicación mediante dirección IP funciona correctamente.

## Checklist

Antes de empezar el cuestionario deberías saber explicar:

- para qué sirve el comando ping;
- para qué sirve traceroute;
- para qué sirve ipconfig/ifconfig;
- el método de resolución de problemas por capas, empezando por la capa física;
- cómo aislar si un problema afecta a un dispositivo o a toda la red;
- por qué la documentación es útil durante la resolución de problemas.' WHERE topic_id = 234;

-- Topic 232 -- EN
UPDATE topic_review_pages SET content_en = '## What you really need to know

CCST requires knowing the fundamental concepts for accessing and configuring a network device, without the depth required by more advanced certifications. You need to understand how to access a device, what interfaces are, and the basic concept of VLANs.

## Key concepts

- **Console**: direct, local access to a device via a dedicated cable, used for initial configuration.
- **Management interface**: a dedicated IP address for administering the device remotely.
- **Interface (port)**: a physical or logical connection point on a router or switch.
- **Running and startup configuration**: the active configuration in memory (running) and the one saved permanently (startup).
- **VLAN (Virtual LAN)**: logical segmentation of a physical network into multiple separate networks.
- **Trunk port**: a port that carries traffic for multiple VLANs at once.
- **Access port**: a port assigned to a single VLAN, used to connect end devices.
- **Firmware**: the base software that runs a network device.
- **Configuration backup**: saving the configuration so it can be restored if something goes wrong.
- **Factory reset**: an operation that restores a device to its original settings.

## Do not confuse

| Concept | Main meaning |
|---|---|
| Running configuration | Active configuration in memory, lost on reboot if not saved |
| Startup configuration | Permanently saved configuration, loaded at boot |
| Access port | Connected to a single VLAN |
| Trunk port | Carries multiple VLANs at once |
| Console | Direct local access |
| Management interface | Remote access via a dedicated IP |

## Accessing a network device

Initial configuration of a router or switch is typically done via the **console port**, a direct connection that doesn''t require an already-working network. After initial configuration, remote access can be enabled by configuring a **management interface** with a dedicated IP address, reachable via protocols like SSH.

## Running and startup configuration

When you change a device''s configuration, the changes are applied immediately to the **running configuration**, active in volatile memory. If the device is rebooted without saving, these changes are lost. To make them permanent, the running configuration must be copied to the **startup configuration**, saved in non-volatile memory and loaded automatically on every reboot.

## VLAN: logical segmentation

A **VLAN** lets you logically divide a physical network into multiple separate networks, as if each VLAN were an independent network, even though the devices share the same physical switch. This improves security and organization, for example by separating administrative department traffic from technical department traffic.

An **access** port is assigned to a single VLAN and is typically used to connect an end device like a PC. A **trunk** port, on the other hand, carries traffic for multiple VLANs at once, and is typically used to connect two switches together or a switch to a router.

## Essential CLI commands (Cisco IOS)

| Command | Function |
|---|---|
| `configure terminal` | Enters global configuration mode (from privileged mode, after `enable`) |
| `hostname <name>` | Sets the device''s name |
| `line console 0` + `password <pwd>` + `login` | Configures the console access password |
| `enable secret <pwd>` | Sets the encrypted password for privileged mode |
| `interface <type/number>` (e.g. `interface g0/1`) | Enters configuration mode for a specific interface |
| `no shutdown` | Enables an interface. On **routers** interfaces are disabled by default and this must always be run; on **switches** ports are already enabled by default (only needed if someone disabled them manually) |
| `show ip interface brief` | Summary of IP address, physical and administrative status for all interfaces |
| `description <text>` | Adds a descriptive comment to the interface |
| `ip default-gateway <address>` | Sets the default gateway on a Layer 2 switch |
| `ip route 0.0.0.0 0.0.0.0 <next-hop>` | Configures the default route |
| `show ip route` | Shows the routing table |
| `switchport mode access` | Assigns the port to a single VLAN |
| `switchport mode trunk` | Configures the port to carry multiple VLANs (802.1Q trunking protocol) |
| `copy running-config startup-config` (or `write memory`) | Saves the active configuration to NVRAM |
| `copy startup-config running-config` | Loads the configuration saved in NVRAM into the active memory |
| `erase startup-config` | Erases the configuration saved in NVRAM |
| `reload` | Restarts the device |
| `ip domain-name <domain>` + `crypto key generate rsa` | Sets the domain and generates the RSA keys needed for SSH (after configuring the hostname) |
| `username <user> secret <pwd>` | Creates a local user for authentication |
| `line vty 0 4` + `transport input ssh` | Enables remote access on the VTY lines, restricting it to SSH |
| `banner motd` | Displays a message before login |
| `ping` / `traceroute` | Test reachability and the path to a destination, respectively |

## Backup and recovery

Periodically saving a copy of a device''s configuration lets you restore it quickly in case of failure, hardware replacement, or configuration error. A **factory reset**, on the other hand, restores the device to its original settings, erasing any custom configuration: it should be used with caution.

## Common exam mistakes

- Confusing running and startup configuration.
- Forgetting to save the running configuration as startup after a change.
- Confusing access and trunk ports.
- Thinking a VLAN requires separate physical switches instead of logical segmentation on the same switch.
- Confusing console access with remote management interface access.
- Thinking a factory reset is reversible without a prior backup.

## Mini exam scenario

A technician configures a new switch via console cable, creates two VLANs to separate administrative traffic from guest traffic, and connects the switches on two different floors with a port configured to carry both VLANs. This connecting port between the two switches must be configured as a **trunk** port, because it needs to carry traffic for multiple VLANs.

## Checklist

Before starting the quiz you should be able to explain:

- how to access a network device for initial configuration;
- the difference between running and startup configuration;
- what a VLAN is and why it''s used;
- the difference between access and trunk ports;
- why it''s important to save a configuration backup.' WHERE topic_id = 232;

-- Topic 232 -- FR
UPDATE topic_review_pages SET content_fr = '## Ce qu''il faut vraiment savoir

Le CCST exige de connaître les concepts fondamentaux pour accéder à un équipement réseau et le configurer, sans le niveau de détail approfondi requis par des certifications plus avancées. Vous devez comprendre comment accéder à un équipement, ce que sont les interfaces, et le concept de base des VLAN.

## Concepts clés

- **Console** : accès direct et local à un équipement via un câble dédié, utilisé pour la configuration initiale.
- **Interface de gestion** : adresse IP dédiée pour administrer l''équipement à distance.
- **Interface (port)** : point de connexion physique ou logique sur un routeur ou un switch.
- **Configuration running et startup** : la configuration active en mémoire (running) et celle sauvegardée de façon permanente (startup).
- **VLAN (Virtual LAN)** : segmentation logique d''un réseau physique en plusieurs réseaux distincts.
- **Port trunk** : port qui transporte le trafic de plusieurs VLAN simultanément.
- **Port access** : port assigné à un seul VLAN, utilisé pour connecter des équipements terminaux.
- **Firmware** : logiciel de base qui fait fonctionner l''équipement réseau.
- **Sauvegarde de la configuration** : enregistrement de la configuration afin de pouvoir la restaurer en cas de problème.
- **Réinitialisation d''usine** : opération qui restaure les paramètres d''origine d''un équipement.

## À ne pas confondre

| Concept | Signification principale |
|---|---|
| Configuration running | Configuration active en mémoire, perdue au redémarrage si non sauvegardée |
| Configuration startup | Configuration sauvegardée en permanence, chargée au démarrage |
| Port access | Relié à un seul VLAN |
| Port trunk | Transporte plusieurs VLAN simultanément |
| Console | Accès local direct |
| Interface de gestion | Accès distant via une IP dédiée |

## Accéder à un équipement réseau

La configuration initiale d''un routeur ou d''un switch se fait généralement via le **port console**, une connexion directe qui ne nécessite pas de réseau déjà fonctionnel. Après la configuration initiale, il est possible d''activer l''accès à distance en configurant une **interface de gestion** avec une adresse IP dédiée, accessible via des protocoles comme SSH.

## Configuration running et startup

Lorsque vous modifiez la configuration d''un équipement, les changements sont appliqués immédiatement à la **configuration running**, active en mémoire volatile. Si l''équipement est redémarré sans sauvegarde, ces changements sont perdus. Pour les rendre permanents, la configuration running doit être copiée vers la **configuration startup**, sauvegardée en mémoire non volatile et chargée automatiquement à chaque redémarrage.

## VLAN : segmentation logique

Un **VLAN** permet de diviser logiquement un réseau physique en plusieurs réseaux distincts, comme si chaque VLAN était un réseau indépendant, même si les équipements partagent le même switch physique. Cela améliore la sécurité et l''organisation, en séparant par exemple le trafic du service administratif de celui du service technique.

Un port **access** est assigné à un seul VLAN et sert généralement à connecter un équipement terminal comme un PC. Un port **trunk**, au contraire, transporte le trafic de plusieurs VLAN simultanément, et sert généralement à relier deux switches entre eux ou un switch à un routeur.

## Commandes CLI essentielles (Cisco IOS)

| Commande | Fonction |
|---|---|
| `configure terminal` | Entre en mode de configuration globale (depuis le mode privilégié, après `enable`) |
| `hostname <nom>` | Définit le nom de l''équipement |
| `line console 0` + `password <pwd>` + `login` | Configure le mot de passe d''accès via console |
| `enable secret <pwd>` | Définit le mot de passe chiffré pour le mode privilégié |
| `interface <type/numéro>` (ex. `interface g0/1`) | Entre dans la configuration d''une interface spécifique |
| `no shutdown` | Active une interface. Sur les **routeurs**, les interfaces sont désactivées par défaut et cette commande doit toujours être exécutée ; sur les **switches**, les ports sont déjà actifs par défaut (nécessaire seulement si quelqu''un les a désactivés manuellement) |
| `show ip interface brief` | Récapitulatif de l''adresse IP, de l''état physique et administratif de toutes les interfaces |
| `description <texte>` | Ajoute un commentaire descriptif à l''interface |
| `ip default-gateway <adresse>` | Définit la passerelle par défaut sur un switch de niveau 2 |
| `ip route 0.0.0.0 0.0.0.0 <next-hop>` | Configure la route par défaut |
| `show ip route` | Affiche la table de routage |
| `switchport mode access` | Assigne le port à un seul VLAN |
| `switchport mode trunk` | Configure le port pour transporter plusieurs VLAN (protocole de trunking 802.1Q) |
| `copy running-config startup-config` (ou `write memory`) | Sauvegarde la configuration active dans la NVRAM |
| `copy startup-config running-config` | Charge la configuration sauvegardée en NVRAM dans la mémoire active |
| `erase startup-config` | Efface la configuration sauvegardée en NVRAM |
| `reload` | Redémarre l''équipement |
| `ip domain-name <domaine>` + `crypto key generate rsa` | Définit le domaine et génère les clés RSA nécessaires pour SSH (après avoir configuré le hostname) |
| `username <user> secret <pwd>` | Crée un utilisateur local pour l''authentification |
| `line vty 0 4` + `transport input ssh` | Active l''accès distant sur les lignes VTY en le limitant au SSH |
| `banner motd` | Affiche un message avant la connexion |
| `ping` / `traceroute` | Testent respectivement l''accessibilité et le chemin vers une destination |

## Sauvegarde et restauration

Sauvegarder périodiquement une copie de la configuration d''un équipement permet de la restaurer rapidement en cas de panne, de remplacement matériel ou d''erreur de configuration. Une **réinitialisation d''usine**, en revanche, restaure les paramètres d''origine de l''équipement, effaçant toute configuration personnalisée : elle doit être utilisée avec prudence.

## Erreurs fréquentes

- Confondre configuration running et startup.
- Oublier de sauvegarder la configuration running en tant que startup après une modification.
- Confondre port access et port trunk.
- Penser qu''un VLAN nécessite des switches physiques séparés au lieu d''une segmentation logique sur le même switch.
- Confondre l''accès via console avec l''accès via interface de gestion à distance.
- Penser qu''une réinitialisation d''usine est réversible sans sauvegarde préalable.

## Mini scénario

Un technicien configure un nouveau switch via un câble console, crée deux VLAN pour séparer le trafic administratif du trafic invités, et relie les switches de deux étages différents avec un port configuré pour transporter les deux VLAN. Ce port de liaison entre les deux switches doit être configuré en port **trunk**, car il doit transporter le trafic de plusieurs VLAN.

## Checklist

Avant de commencer le quiz, vous devez savoir expliquer :

- comment accéder à un équipement réseau pour la configuration initiale ;
- la différence entre configuration running et startup ;
- ce qu''est un VLAN et pourquoi on l''utilise ;
- la différence entre port access et port trunk ;
- pourquoi il est important de sauvegarder la configuration.' WHERE topic_id = 232;

-- Topic 232 -- ES
UPDATE topic_review_pages SET content_es = '## Lo que realmente debes saber

El CCST exige conocer los conceptos fundamentales para acceder a un dispositivo de red y configurarlo, sin el nivel de detalle avanzado requerido por certificaciones más avanzadas. Debes entender cómo se accede a un dispositivo, qué son las interfaces y el concepto básico de VLAN.

## Conceptos clave

- **Consola**: acceso directo y local a un dispositivo mediante un cable dedicado, usado para la configuración inicial.
- **Interfaz de gestión**: dirección IP dedicada para administrar el dispositivo de forma remota.
- **Interfaz (puerto)**: punto de conexión físico o lógico en un router o switch.
- **Configuración running y startup**: la configuración activa en memoria (running) y la guardada de forma permanente (startup).
- **VLAN (Virtual LAN)**: segmentación lógica de una red física en varias redes separadas.
- **Puerto trunk**: puerto que transporta el tráfico de varias VLAN simultáneamente.
- **Puerto access**: puerto asignado a una sola VLAN, usado para conectar dispositivos finales.
- **Firmware**: software base que gestiona el funcionamiento del dispositivo de red.
- **Copia de seguridad de la configuración**: guardar la configuración para poder restaurarla en caso de problemas.
- **Restablecimiento de fábrica**: operación que devuelve un dispositivo a su configuración original.

## Diferencias importantes

| Concepto | Significado principal |
|---|---|
| Configuración running | Configuración activa en memoria, se pierde al reiniciar si no se guarda |
| Configuración startup | Configuración guardada de forma permanente, cargada al arrancar |
| Puerto access | Conectado a una sola VLAN |
| Puerto trunk | Transporta varias VLAN simultáneamente |
| Consola | Acceso local directo |
| Interfaz de gestión | Acceso remoto mediante una IP dedicada |

## Acceder a un dispositivo de red

La configuración inicial de un router o switch se realiza normalmente mediante el **puerto de consola**, una conexión directa que no requiere una red ya en funcionamiento. Tras la configuración inicial, es posible habilitar el acceso remoto configurando una **interfaz de gestión** con una dirección IP dedicada, accesible mediante protocolos como SSH.

## Configuración running y startup

Cuando se modifica la configuración de un dispositivo, los cambios se aplican inmediatamente a la **configuración running**, activa en memoria volátil. Si el dispositivo se reinicia sin guardar, esos cambios se pierden. Para hacerlos permanentes, la configuración running debe copiarse a la **configuración startup**, guardada en memoria no volátil y cargada automáticamente en cada reinicio.

## VLAN: segmentación lógica

Una **VLAN** permite dividir lógicamente una red física en varias redes separadas, como si cada VLAN fuera una red independiente, aunque los dispositivos compartan el mismo switch físico. Esto mejora la seguridad y la organización, separando por ejemplo el tráfico del departamento administrativo del departamento técnico.

Un puerto **access** se asigna a una sola VLAN y normalmente se usa para conectar un dispositivo final como un PC. Un puerto **trunk**, en cambio, transporta el tráfico de varias VLAN simultáneamente, y normalmente se usa para conectar dos switches entre sí o un switch a un router.

## Comandos CLI esenciales (Cisco IOS)

| Comando | Función |
|---|---|
| `configure terminal` | Entra en el modo de configuración global (desde el modo privilegiado, después de `enable`) |
| `hostname <nombre>` | Establece el nombre del dispositivo |
| `line console 0` + `password <pwd>` + `login` | Configura la contraseña de acceso por consola |
| `enable secret <pwd>` | Establece la contraseña cifrada para el modo privilegiado |
| `interface <tipo/número>` (ej. `interface g0/1`) | Entra en la configuración de una interfaz específica |
| `no shutdown` | Activa una interfaz. En los **routers** las interfaces están desactivadas por defecto y siempre hay que ejecutarlo; en los **switches** los puertos ya están activos por defecto (solo hace falta si alguien los desactivó manualmente) |
| `show ip interface brief` | Resumen de la dirección IP, el estado físico y administrativo de todas las interfaces |
| `description <texto>` | Añade un comentario descriptivo a la interfaz |
| `ip default-gateway <dirección>` | Establece la puerta de enlace predeterminada en un switch de capa 2 |
| `ip route 0.0.0.0 0.0.0.0 <next-hop>` | Configura la ruta predeterminada |
| `show ip route` | Muestra la tabla de enrutamiento |
| `switchport mode access` | Asigna el puerto a una sola VLAN |
| `switchport mode trunk` | Configura el puerto para transportar varias VLAN (protocolo de trunking 802.1Q) |
| `copy running-config startup-config` (o `write memory`) | Guarda la configuración activa en la NVRAM |
| `copy startup-config running-config` | Carga la configuración guardada en NVRAM en la memoria activa |
| `erase startup-config` | Borra la configuración guardada en NVRAM |
| `reload` | Reinicia el dispositivo |
| `ip domain-name <dominio>` + `crypto key generate rsa` | Establece el dominio y genera las claves RSA necesarias para SSH (tras configurar el hostname) |
| `username <user> secret <pwd>` | Crea un usuario local para la autenticación |
| `line vty 0 4` + `transport input ssh` | Habilita el acceso remoto en las líneas VTY, limitándolo a SSH |
| `banner motd` | Muestra un mensaje antes del acceso |
| `ping` / `traceroute` | Prueban respectivamente la accesibilidad y la ruta hacia un destino |

## Copia de seguridad y restauración

Guardar periódicamente una copia de la configuración de un dispositivo permite restaurarla rápidamente en caso de avería, sustitución de hardware o error de configuración. Un **restablecimiento de fábrica**, en cambio, devuelve el dispositivo a su configuración original, borrando cualquier configuración personalizada: debe usarse con precaución.

## Errores frecuentes

- Confundir configuración running y startup.
- Olvidar guardar la configuración running como startup tras un cambio.
- Confundir puerto access y puerto trunk.
- Pensar que una VLAN requiere switches físicos separados en lugar de una segmentación lógica en el mismo switch.
- Confundir el acceso por consola con el acceso mediante interfaz de gestión remota.
- Pensar que un restablecimiento de fábrica es reversible sin una copia de seguridad previa.

## Mini escenario

Un técnico configura un nuevo switch mediante cable de consola, crea dos VLAN para separar el tráfico administrativo del de invitados, y conecta los switches de dos plantas diferentes con un puerto configurado para transportar ambas VLAN. Este puerto de conexión entre los dos switches debe configurarse como puerto **trunk**, porque debe transportar el tráfico de varias VLAN.

## Checklist

Antes de empezar el cuestionario deberías saber explicar:

- cómo se accede a un dispositivo de red para la configuración inicial;
- la diferencia entre configuración running y startup;
- qué es una VLAN y por qué se usa;
- la diferencia entre puerto access y puerto trunk;
- por qué es importante guardar una copia de seguridad de la configuración.' WHERE topic_id = 232;

-- Topic 230 -- EN
UPDATE topic_review_pages SET content_en = '## What you really need to know

Networks are classified both by geographic extent (LAN, WAN, etc.) and by how devices are physically or logically connected to each other (topology). CCST requires recognizing both classifications and their typical advantages/disadvantages.

## Key concepts

- **LAN (Local Area Network)**: a network covering a limited area, like an office or a building.
- **WAN (Wide Area Network)**: a network covering a wide geographic area, connecting multiple LANs at a distance.
- **WLAN (Wireless LAN)**: a local network that uses wireless connections instead of cables.
- **MAN (Metropolitan Area Network)**: a network covering the area of a city.
- **PAN (Personal Area Network)**: a short-range network between personal devices (e.g. Bluetooth).
- **Star topology**: all devices connect to a central point (e.g. a switch).
- **Bus topology**: all devices share the same main cable.
- **Ring topology**: each device is connected to the next, forming a closed loop.
- **Mesh topology**: each device is connected to multiple other devices, providing redundancy.
- **Hybrid topology**: a combination of multiple topologies within the same network.
- **Tree topology**: a hierarchical structure that links multiple star topologies together (several switches connected to a main switch), highly scalable and useful for organizing departments or buildings in large enterprise networks and campuses.

## Do not confuse

| Network type | Coverage area |
|---|---|
| PAN | A few meters, personal devices |
| LAN | A building or an office |
| MAN | An urban/city area |
| WAN | A wide geographic area, even global |

| Topology | Main feature |
|---|---|
| Star | Central point; a cable fault isolates only one device |
| Bus | Shared cable; a fault can bring down the whole network |
| Ring | Circular connection between devices |
| Mesh | Multiple links, high redundancy |
| Tree | A hierarchical structure of multiple interconnected stars, highly scalable |

## Network types by coverage

Networks are classified by how much territory they cover. A **LAN** connects nearby devices, such as in an office or a home. A **WAN** connects distant networks to each other, often via the Internet or dedicated lines: the Internet itself is the largest example of a WAN. A **MAN** is an intermediate scale, typical of a city area. A **PAN** is the smallest network, limited to a few meters, like a Bluetooth connection between a smartphone and earbuds.

A **WLAN** isn''t defined by its size but by its technology: it''s simply a LAN that uses wireless instead of cables.

## Physical and logical topologies

Topology describes how devices are connected to each other, physically or logically.

In a **star topology**, each device connects directly to a central point, typically a switch. It''s the most common topology in modern networks because a fault in a single cable isolates only that device, without bringing down the whole network.

In a **bus topology**, all devices share the same main cable. It''s cheap but fragile: a fault in the main cable can bring down the entire network, and it''s now an obsolete topology.

In a **ring topology**, each device is connected to the next until the circle is closed. Data travels around the ring in a predefined direction.

In a **mesh topology**, each device has multiple links to other devices, offering maximum redundancy: if one link fails, data can always find an alternative path. It''s typical of networks that require high reliability, such as Internet backbones.

Many real-world networks use a **hybrid topology**, combining multiple models in different areas of the same infrastructure.

## Tree topology, Campus LAN and partial mesh

A **tree topology** is a hierarchical structure that links multiple star topologies together through higher-level central nodes (several switches connected to a main switch). It has two main advantages: it''s highly scalable, because new network segments can be added without having to redesign the existing infrastructure; and it''s easy to organize and manage, because the hierarchical structure lets you group departments, buildings or groups of devices in an orderly way, simplifying maintenance and troubleshooting. This is why it''s the typical choice for large companies and campuses with multiple buildings or departments.

A **Campus LAN** is an extended LAN that connects several nearby buildings (a university, a hospital, a company site with multiple blocks), typically via high-speed fiber optic links. Compared to a WAN, it''s simpler, faster and remains under a single administrative control, because it covers a limited geographic area.

Within mesh topology there''s also an important distinction: in a **full mesh**, every device is connected directly to every other device, giving maximum possible redundancy but also the highest number of cables and costs. In a **partial mesh**, on the other hand, only some devices are connected directly to each other, while the others communicate by passing through intermediate nodes: this reduces cabling costs and complexity while still maintaining a good level of redundancy. It''s the most common scheme in enterprise WANs connecting multiple sites, where it doesn''t make sense to directly connect every site to every other one.

## Common exam mistakes

- Confusing LAN and WAN based on the number of devices instead of geographic extent.
- Thinking a WLAN is a different type of network from a LAN, rather than a wireless variant of the same thing.
- Confusing star topology and bus topology.
- Thinking that in a star topology, a central (switch) failure has no impact on the entire network.
- Forgetting that mesh topology provides redundancy precisely because of its multiple links.
- Confusing MAN and WAN.

## Mini exam scenario

A company with sites in three different cities connects them via dedicated lines and the Internet, letting the offices exchange data as if they were on the same local network. This infrastructure connecting geographically distant networks is a **WAN**.

## Checklist

Before starting the quiz you should be able to explain:

- the difference between PAN, LAN, MAN and WAN;
- what a WLAN is;
- the characteristics of star, bus, ring and mesh topologies;
- which topology offers the most redundancy and why;
- what happens in each topology when a cable or device fails.' WHERE topic_id = 230;

-- Topic 230 -- FR
UPDATE topic_review_pages SET content_fr = '## Ce qu''il faut vraiment savoir

Les réseaux se classent à la fois par étendue géographique (LAN, WAN, etc.) et par la manière dont les équipements sont connectés physiquement ou logiquement entre eux (topologie). Le CCST exige de reconnaître les deux classifications ainsi que leurs avantages/inconvénients typiques.

## Concepts clés

- **LAN (Local Area Network)** : réseau couvrant une zone limitée, comme un bureau ou un bâtiment.
- **WAN (Wide Area Network)** : réseau couvrant une vaste zone géographique, reliant plusieurs LAN à distance.
- **WLAN (Wireless LAN)** : réseau local qui utilise des connexions sans fil au lieu de câbles.
- **MAN (Metropolitan Area Network)** : réseau couvrant l''étendue d''une ville.
- **PAN (Personal Area Network)** : réseau à courte portée entre équipements personnels (ex. Bluetooth).
- **Topologie en étoile** : tous les équipements se connectent à un point central (ex. un switch).
- **Topologie en bus** : tous les équipements partagent le même câble principal.
- **Topologie en anneau** : chaque équipement est relié au suivant, formant une boucle fermée.
- **Topologie maillée (mesh)** : chaque équipement est relié à plusieurs autres, offrant de la redondance.
- **Topologie hybride** : combinaison de plusieurs topologies différentes au sein du même réseau.
- **Topologie en arbre** : structure hiérarchique qui relie plusieurs topologies en étoile entre elles (plusieurs switches reliés à un switch principal), très évolutive et utile pour organiser des services ou des bâtiments de façon ordonnée dans les grands réseaux d''entreprise et les campus.

## À ne pas confondre

| Type de réseau | Zone couverte |
|---|---|
| PAN | Quelques mètres, équipements personnels |
| LAN | Un bâtiment ou un bureau |
| MAN | Une zone urbaine/une ville |
| WAN | Vaste zone géographique, voire mondiale |

| Topologie | Caractéristique principale |
|---|---|
| Étoile | Point central, une panne de câble isole un seul équipement |
| Bus | Câble partagé, une panne peut bloquer tout le réseau |
| Anneau | Connexion circulaire entre les équipements |
| Maillée | Liaisons multiples, haute redondance |
| Arbre | Structure hiérarchique de plusieurs étoiles reliées entre elles, très évolutive |

## Types de réseaux par étendue

Les réseaux se classent selon le territoire qu''ils couvrent. Un **LAN** relie des équipements proches, comme dans un bureau ou un logement. Un **WAN** relie des réseaux distants entre eux, souvent via Internet ou des lignes dédiées : Internet lui-même est le plus grand exemple de WAN. Un **MAN** a une échelle intermédiaire, typique d''une zone urbaine. Un **PAN** est le plus petit réseau, limité à quelques mètres, comme une connexion Bluetooth entre un smartphone et des écouteurs.

Un **WLAN** n''est pas défini par son étendue mais par sa technologie : c''est simplement un LAN qui utilise le sans-fil au lieu de câbles.

## Topologies physiques et logiques

La topologie décrit la façon dont les équipements sont reliés entre eux, physiquement ou logiquement.

Dans une **topologie en étoile**, chaque équipement se connecte directement à un point central, typiquement un switch. C''est la topologie la plus courante dans les réseaux modernes, car une panne sur un seul câble isole uniquement cet équipement, sans bloquer l''ensemble du réseau.

Dans une **topologie en bus**, tous les équipements partagent le même câble principal. Elle est économique mais fragile : une panne sur le câble principal peut bloquer tout le réseau, et il s''agit désormais d''une topologie obsolète.

Dans une **topologie en anneau**, chaque équipement est relié au suivant jusqu''à fermer un cercle. Les données circulent le long de l''anneau dans une direction prédéfinie.

Dans une **topologie maillée**, chaque équipement dispose de liaisons multiples vers d''autres équipements, offrant une redondance maximale : si une liaison tombe en panne, les données peuvent toujours trouver un chemin alternatif. C''est typique des réseaux nécessitant une haute fiabilité, comme les dorsales d''Internet.

De nombreux réseaux réels utilisent une **topologie hybride**, combinant plusieurs modèles dans différentes zones de la même infrastructure.

## Topologie en arbre, Campus LAN et maillage partiel

La **topologie en arbre** est une structure hiérarchique qui relie plusieurs topologies en étoile entre elles via des nœuds centraux de niveau supérieur (plusieurs switches reliés à un switch principal). Elle présente deux avantages principaux : elle est très évolutive, car on peut ajouter de nouveaux segments de réseau sans devoir reconcevoir l''infrastructure existante ; et elle est facile à organiser et à gérer, car la structure hiérarchique permet de regrouper des services, des bâtiments ou des groupes d''équipements de façon ordonnée, simplifiant la maintenance et le dépannage. C''est pourquoi c''est le choix typique des grandes entreprises et des campus comportant plusieurs bâtiments ou services.

Un **Campus LAN** est un LAN étendu qui relie plusieurs bâtiments proches entre eux (une université, un hôpital, un site d''entreprise avec plusieurs bâtiments), généralement via des liaisons en fibre optique à haut débit. Comparé à un WAN, il est plus simple, plus rapide et reste sous un seul contrôle administratif, car il couvre une zone géographique limitée.

Au sein de la topologie maillée, il existe aussi une distinction importante : dans un **maillage complet**, chaque équipement est relié directement à tous les autres, offrant la redondance maximale possible mais aussi le plus grand nombre de câbles et de coûts. Dans un **maillage partiel**, en revanche, seuls certains équipements sont reliés directement entre eux, tandis que les autres communiquent en passant par des nœuds intermédiaires : cela réduit les coûts et la complexité du câblage, tout en maintenant un bon niveau de redondance. C''est le schéma le plus courant dans les WAN d''entreprise reliant plusieurs sites, où il n''est pas rentable de relier directement chaque site à tous les autres.

## Erreurs fréquentes

- Confondre LAN et WAN en se basant sur le nombre d''équipements plutôt que sur l''étendue géographique.
- Penser qu''un WLAN est un type de réseau différent d''un LAN, plutôt qu''une variante sans fil du même réseau.
- Confondre topologie en étoile et topologie en bus.
- Penser que dans une topologie en étoile, une panne centrale (switch) n''a aucun impact sur l''ensemble du réseau.
- Oublier que la topologie maillée offre de la redondance justement grâce à ses liaisons multiples.
- Confondre MAN et WAN.

## Mini scénario

Une entreprise ayant des sites dans trois villes différentes les relie via des lignes dédiées et Internet, permettant aux bureaux d''échanger des données comme s''ils étaient sur le même réseau local. Cette infrastructure reliant des réseaux géographiquement distants est un **WAN**.

## Checklist

Avant de commencer le quiz, vous devez savoir expliquer :

- la différence entre PAN, LAN, MAN et WAN ;
- ce qu''est un WLAN ;
- les caractéristiques des topologies en étoile, en bus, en anneau et maillée ;
- quelle topologie offre le plus de redondance et pourquoi ;
- ce qui se passe dans chaque topologie lorsqu''un câble ou un équipement tombe en panne.' WHERE topic_id = 230;

-- Topic 230 -- ES
UPDATE topic_review_pages SET content_es = '## Lo que realmente debes saber

Las redes se clasifican tanto por extensión geográfica (LAN, WAN, etc.) como por la forma en que los dispositivos están conectados física o lógicamente entre sí (topología). El CCST exige reconocer ambas clasificaciones y sus ventajas/desventajas típicas.

## Conceptos clave

- **LAN (Local Area Network)**: red que cubre un área limitada, como una oficina o un edificio.
- **WAN (Wide Area Network)**: red que cubre un área geográfica amplia, conectando varias LAN a distancia.
- **WLAN (Wireless LAN)**: red local que usa conexiones inalámbricas en lugar de cables.
- **MAN (Metropolitan Area Network)**: red que cubre el área de una ciudad.
- **PAN (Personal Area Network)**: red de corto alcance entre dispositivos personales (ej. Bluetooth).
- **Topología en estrella**: todos los dispositivos se conectan a un punto central (ej. un switch).
- **Topología en bus**: todos los dispositivos comparten el mismo cable principal.
- **Topología en anillo**: cada dispositivo está conectado al siguiente, formando un anillo cerrado.
- **Topología en malla (mesh)**: cada dispositivo está conectado a varios otros dispositivos, ofreciendo redundancia.
- **Topología híbrida**: combinación de varias topologías diferentes en la misma red.
- **Topología en árbol**: estructura jerárquica que conecta entre sí varias topologías en estrella (varios switches conectados a un switch principal), muy escalable y útil para organizar departamentos o edificios de forma ordenada en grandes redes empresariales y campus.

## Diferencias importantes

| Tipo de red | Área cubierta |
|---|---|
| PAN | Pocos metros, dispositivos personales |
| LAN | Un edificio o una oficina |
| MAN | Un área urbana/ciudad |
| WAN | Área geográfica amplia, incluso global |

| Topología | Característica principal |
|---|---|
| Estrella | Punto central, un fallo en un cable aísla solo un dispositivo |
| Bus | Cable compartido, un fallo puede bloquear toda la red |
| Anillo | Conexión circular entre dispositivos |
| Malla | Conexiones múltiples, alta redundancia |
| Árbol | Estructura jerárquica de varias estrellas conectadas entre sí, muy escalable |

## Tipos de red por extensión

Las redes se clasifican según cuánto territorio cubren. Una **LAN** conecta dispositivos cercanos, como en una oficina o una vivienda. Una **WAN** conecta redes distantes entre sí, a menudo a través de Internet o líneas dedicadas: la propia Internet es el mayor ejemplo de WAN. Una **MAN** tiene una escala intermedia, típica de un área urbana. Una **PAN** es la red más pequeña, limitada a pocos metros, como una conexión Bluetooth entre un smartphone y unos auriculares.

Una **WLAN** no se define por su extensión sino por su tecnología: es simplemente una LAN que usa conexión inalámbrica en lugar de cables.

## Topologías físicas y lógicas

La topología describe cómo están conectados los dispositivos entre sí, física o lógicamente.

En la **topología en estrella**, cada dispositivo se conecta directamente a un punto central, normalmente un switch. Es la topología más común en las redes modernas porque un fallo en un solo cable aísla únicamente ese dispositivo, sin bloquear toda la red.

En la **topología en bus**, todos los dispositivos comparten el mismo cable principal. Es económica pero frágil: un fallo en el cable principal puede bloquear toda la red, y actualmente es una topología obsoleta.

En la **topología en anillo**, cada dispositivo está conectado al siguiente hasta cerrar un círculo. Los datos viajan a lo largo del anillo en una dirección predefinida.

En la **topología en malla**, cada dispositivo tiene conexiones múltiples con otros dispositivos, ofreciendo la máxima redundancia: si una conexión falla, los datos siempre pueden encontrar una ruta alternativa. Es típica de redes que requieren alta fiabilidad, como las troncales de Internet.

Muchas redes reales usan una **topología híbrida**, combinando varios modelos en distintas áreas de la misma infraestructura.

## Topología en árbol, Campus LAN y malla parcial

La **topología en árbol** es una estructura jerárquica que conecta entre sí varias topologías en estrella a través de nodos centrales de nivel superior (varios switches conectados a un switch principal). Tiene dos ventajas principales: es muy escalable, porque se pueden añadir nuevos segmentos de red sin tener que rediseñar la infraestructura existente; y es fácil de organizar y gestionar, porque la estructura jerárquica permite agrupar departamentos, edificios o grupos de dispositivos de forma ordenada, simplificando el mantenimiento y la resolución de problemas. Por eso es la opción típica de las grandes empresas y los campus con varios edificios o departamentos.

Un **Campus LAN** es una LAN extendida que conecta varios edificios cercanos entre sí (una universidad, un hospital, una sede empresarial con varios pabellones), normalmente mediante enlaces de fibra óptica de alta velocidad. Comparado con una WAN, es más simple, más rápida y permanece bajo un único control administrativo, porque cubre un área geográfica limitada.

Dentro de la topología en malla existe también una distinción importante: en una **malla completa**, cada dispositivo está conectado directamente a todos los demás, ofreciendo la máxima redundancia posible pero también el mayor número de cables y costes. En una **malla parcial**, en cambio, solo algunos dispositivos están conectados directamente entre sí, mientras que los demás se comunican pasando por nodos intermedios: esto reduce los costes y la complejidad del cableado, manteniendo aun así un buen nivel de redundancia. Es el esquema más común en las WAN empresariales que conectan varias sedes, donde no conviene conectar directamente cada sede con todas las demás.

## Errores frecuentes

- Confundir LAN y WAN según el número de dispositivos en lugar de la extensión geográfica.
- Pensar que una WLAN es un tipo de red diferente de una LAN, en lugar de una variante inalámbrica de la misma.
- Confundir topología en estrella y topología en bus.
- Pensar que en la topología en estrella un fallo central (switch) no afecta a toda la red.
- Olvidar que la topología en malla ofrece redundancia precisamente gracias a sus conexiones múltiples.
- Confundir MAN y WAN.

## Mini escenario

Una empresa con sedes en tres ciudades diferentes las conecta mediante líneas dedicadas e Internet, permitiendo que las oficinas intercambien datos como si estuvieran en la misma red local. Esta infraestructura que conecta redes geográficamente distantes es una **WAN**.

## Checklist

Antes de empezar el cuestionario deberías saber explicar:

- la diferencia entre PAN, LAN, MAN y WAN;
- qué es una WLAN;
- las características de las topologías en estrella, bus, anillo y malla;
- qué topología ofrece más redundancia y por qué;
- qué ocurre en cada topología cuando falla un cable o un dispositivo.' WHERE topic_id = 230;

-- Topic 227 -- EN
UPDATE topic_review_pages SET content_en = '## What you really need to know

The OSI and TCP/IP models are the standard way of describing how data travels across a network, splitting the process into layers with specific tasks. They''re probably the most cited topic in all of networking, and CCST requires recognition-level knowledge: knowing what each layer does and recognizing practical examples.

## Key concepts

- **OSI model**: a 7-layer reference model that describes the functions of a network.
- **Physical layer (1)**: transmission of raw bits over a physical medium (cable, fiber, radio waves).
- **Data Link layer (2)**: data transfer between devices on the same segment, uses MAC addresses.
- **Network layer (3)**: routing packets between different networks, uses IP addresses.
- **Transport layer (4)**: reliable or fast delivery of data, manages ports and connections (TCP/UDP).
- **Session layer (5)**: opening, managing and closing communication sessions.
- **Presentation layer (6)**: formatting, encryption and compression of data.
- **Application layer (7)**: the interface with the applications a user directly interacts with.
- **TCP/IP model**: a practical 4-layer model (Network Access, Internet, Transport, Application) that the Internet is based on.
- **Encapsulation**: the process by which each layer adds its own header to the data received from the layer above.

## Do not confuse

| OSI layer | Main function | Example |
|---|---|---|
| Physical (1) | Bit transmission | Cables, connectors, signals |
| Data Link (2) | Local communication, MAC addresses | Switch |
| Network (3) | Routing between networks, IP addresses | Router |
| Transport (4) | Data delivery, ports | TCP, UDP |
| Session (5) | Session management | Opening/closing connections |
| Presentation (6) | Format, encryption, compression | SSL/TLS, file formats |
| Application (7) | User-facing interface | HTTP, FTP, email |

## The OSI model in detail

The OSI (Open Systems Interconnection) model splits network communication into 7 layers, each with a precise task, independent of the others. This separation lets different vendors build devices and software that are compatible with each other, because each layer only communicates with the ones immediately above and below it.

A common way to remember the order of the layers, from lowest to highest, is a mnemonic phrase where each word starts with the layer''s initial (in English, "Please Do Not Throw Sausage Pizza Away" is often used, for Physical, Data Link, Network, Transport, Session, Presentation, Application).

For the exam, the most useful trick is to associate each layer with a concrete example: a network cable is Layer 1, a switch works at Layer 2, a router at Layer 3, and a web browser at Layer 7.

## The TCP/IP model

The TCP/IP model is the one Internet actually uses, and it''s simpler, with only 4 layers that group together the functions of the 7 OSI layers:

- **Network Access**: corresponds to the Physical and Data Link layers of OSI.
- **Internet**: corresponds to the Network layer of OSI, handles IP addressing and routing.
- **Transport**: corresponds to the Transport layer of OSI, handles TCP and UDP.
- **Application**: groups together the Session, Presentation and Application layers of OSI.

For the CCST exam it''s important to be able to map OSI layers to their equivalent TCP/IP layers.

## Encapsulation

When data is sent over a network, each layer adds its own header before passing it to the next layer: this process is called encapsulation. At the Application layer the data is still a message; at the Transport layer it becomes a segment with port information; at the Network layer it becomes a packet with IP addresses; at the Data Link layer it becomes a frame with MAC addresses.

Upon receipt, the process happens in reverse: each layer removes its own header, a process called decapsulation.

## Other common protocols and their layer

- **ARP** (between Data Link and Network): translates an IP address into the corresponding MAC address of a device on the same local network; an ARP reply returns the MAC address associated with an IP.
- **ICMP** (Network layer): carries control and error messages between IP devices; it''s the protocol used by tools like **ping** to check whether a host is reachable.
- **SNMP** (Application layer): used to monitor and administer network devices (interface status, traffic), typically by a network monitoring system.
- **DNS** (Application layer): translates a domain name into the corresponding IP address; it''s the protocol a browser uses to locate a server before contacting it.
- **SMTP, POP3, IMAP** (Application layer): SMTP sends email; for receiving it, it''s combined with POP3 or IMAP.
- **HTTPS** (Application layer, on top of TCP): the secure version of HTTP, protected with **TLS/SSL** encryption. It runs over TCP, not UDP, because the transmission needs to be reliable and ordered.

## TCP, UDP and flow control

The **TCP** protocol establishes a connection before it starts transmitting, through a brief exchange of messages known as the **three-way handshake** (SYN, SYN-ACK, ACK). Thanks to this, TCP guarantees reliability: it confirms receipt of data and retransmits it if lost. The **UDP** protocol, by contrast, doesn''t establish any connection before sending data: it''s faster but guarantees neither order nor delivery — this is the fundamental difference between the two.

**Flow control** (preventing a sender from overwhelming a slower receiver, causing data loss) isn''t an exclusive function of the Transport layer: it can also be implemented at the **Data Link layer**, in addition to the Transport layer, where TCP handles it with more advanced mechanisms.

## MTU and packet fragmentation

When an IP packet is larger than the maximum size that can be transmitted over a link (**MTU**, Maximum Transmission Unit), it''s split into smaller fragments to fit the transmission limits of the network it crosses. This happens at the **Network layer (3)**, and it''s the **IP** protocol that handles it; the fragments are reassembled at the destination.

## Common exam mistakes

- Confusing the order of the 7 OSI layers.
- Thinking the TCP/IP model has 7 layers like OSI.
- Confusing the layer a switch works at (2) with that of a router (3).
- Thinking the IP address is handled at the Data Link layer instead of the Network layer.
- Forgetting that TCP and UDP work at the Transport layer.
- Confusing encapsulation and decapsulation.

## Mini exam scenario

A technician needs to explain why a switch can''t route traffic between two different IP networks, while a router can. The correct answer refers to the OSI layer: the switch works at the **Data Link layer (2)** and only uses MAC addresses within the same segment, while the router works at the **Network layer (3)** and uses IP addresses to route traffic between different networks.

## Checklist

Before starting the quiz you should be able to explain:

- the 7 layers of the OSI model in order;
- what each OSI layer is for;
- the 4 layers of the TCP/IP model and how they map to OSI;
- what encapsulation means;
- an example device or protocol for each layer.' WHERE topic_id = 227;

-- Topic 227 -- FR
UPDATE topic_review_pages SET content_fr = '## Ce qu''il faut vraiment savoir

Les modèles OSI et TCP/IP sont la façon standard de décrire comment les données circulent dans un réseau, en divisant le processus en couches ayant des tâches spécifiques. C''est probablement le sujet le plus cité dans tout le domaine du réseau, et le CCST l''exige au niveau de la reconnaissance : savoir ce que fait chaque couche et reconnaître des exemples pratiques.

## Concepts clés

- **Modèle OSI** : modèle de référence à 7 couches qui décrit les fonctions d''un réseau.
- **Couche Physique (1)** : transmission de bits bruts sur un support physique (câble, fibre, ondes radio).
- **Couche Liaison de données (2)** : transfert de données entre équipements du même segment, utilise les adresses MAC.
- **Couche Réseau (3)** : acheminement des paquets entre différents réseaux, utilise les adresses IP.
- **Couche Transport (4)** : livraison fiable ou rapide des données, gère les ports et les connexions (TCP/UDP).
- **Couche Session (5)** : ouverture, gestion et fermeture des sessions de communication.
- **Couche Présentation (6)** : mise en forme, chiffrement et compression des données.
- **Couche Application (7)** : interface avec les applications utilisées directement par l''utilisateur.
- **Modèle TCP/IP** : modèle pratique à 4 couches (Accès réseau, Internet, Transport, Application) sur lequel repose Internet.
- **Encapsulation** : processus par lequel chaque couche ajoute son propre en-tête aux données reçues de la couche supérieure.

## À ne pas confondre

| Couche OSI | Fonction principale | Exemple |
|---|---|---|
| Physique (1) | Transmission de bits | Câbles, connecteurs, signaux |
| Liaison de données (2) | Communication locale, adresses MAC | Switch |
| Réseau (3) | Acheminement entre réseaux, adresses IP | Routeur |
| Transport (4) | Livraison des données, ports | TCP, UDP |
| Session (5) | Gestion des sessions | Ouverture/fermeture de connexions |
| Présentation (6) | Format, chiffrement, compression | SSL/TLS, formats de fichiers |
| Application (7) | Interface avec l''utilisateur | HTTP, FTP, email |

## Le modèle OSI en détail

Le modèle OSI (Open Systems Interconnection) divise la communication réseau en 7 couches, chacune ayant une tâche précise et indépendante des autres. Cette séparation permet à différents fabricants de construire des équipements et des logiciels compatibles entre eux, car chaque couche ne communique qu''avec celles situées immédiatement au-dessus et en dessous.

Un moyen courant de retenir l''ordre des couches, de la plus basse à la plus haute, consiste à utiliser une phrase mnémotechnique dont chaque mot commence par l''initiale de la couche (en anglais, on utilise souvent « Please Do Not Throw Sausage Pizza Away »).

Pour l''examen, l''astuce la plus utile consiste à associer chaque couche à un exemple concret : un câble réseau est de couche 1, un switch travaille au niveau de la couche 2, un routeur au niveau de la couche 3, et un navigateur web au niveau de la couche 7.

## Le modèle TCP/IP

Le modèle TCP/IP est celui réellement utilisé par Internet et il est plus simple, avec seulement 4 couches qui regroupent les fonctions des 7 couches OSI :

- **Accès réseau** : correspond aux couches Physique et Liaison de données d''OSI.
- **Internet** : correspond à la couche Réseau d''OSI, gère l''adressage IP et l''acheminement.
- **Transport** : correspond à la couche Transport d''OSI, gère TCP et UDP.
- **Application** : regroupe les couches Session, Présentation et Application d''OSI.

Pour l''examen CCST, il est important de savoir faire correspondre les couches OSI aux couches TCP/IP équivalentes.

## Encapsulation

Lorsqu''une donnée est envoyée sur le réseau, chaque couche ajoute son propre en-tête avant de la transmettre à la couche suivante : ce processus s''appelle l''encapsulation. Au niveau de la couche Application, la donnée est encore un message ; au niveau de la couche Transport, elle devient un segment avec des informations de port ; au niveau de la couche Réseau, elle devient un paquet avec des adresses IP ; au niveau de la couche Liaison de données, elle devient une trame avec des adresses MAC.

À la réception, le processus se déroule dans l''ordre inverse : chaque couche retire son propre en-tête, un processus appelé décapsulation.

## Autres protocoles courants et leur couche

- **ARP** (entre Liaison de données et Réseau) : traduit une adresse IP en l''adresse MAC correspondante de l''équipement sur le même réseau local ; une réponse ARP renvoie l''adresse MAC associée à une IP.
- **ICMP** (couche Réseau) : transporte des messages de contrôle et d''erreur entre équipements IP ; c''est le protocole utilisé par des outils comme **ping** pour vérifier si un hôte est accessible.
- **SNMP** (couche Application) : utilisé pour surveiller et administrer les équipements réseau (état des interfaces, trafic), typiquement par un système de supervision réseau.
- **DNS** (couche Application) : traduit un nom de domaine en l''adresse IP correspondante ; c''est le protocole qu''un navigateur utilise pour localiser un serveur avant de le contacter.
- **SMTP, POP3, IMAP** (couche Application) : SMTP envoie les emails ; pour la réception, il est combiné avec POP3 ou IMAP.
- **HTTPS** (couche Application, au-dessus de TCP) : c''est la version sécurisée de HTTP, protégée par le chiffrement **TLS/SSL**. Il circule sur TCP, pas sur UDP, car la transmission doit être fiable et ordonnée.

## TCP, UDP et contrôle de flux

Le protocole **TCP** établit une connexion avant de commencer à transmettre, via un bref échange de messages appelé **three-way handshake** (SYN, SYN-ACK, ACK). Grâce à cela, TCP garantit la fiabilité : il confirme la réception des données et les retransmet en cas de perte. Le protocole **UDP**, au contraire, n''établit aucune connexion avant d''envoyer les données : il est plus rapide mais ne garantit ni l''ordre ni la livraison — c''est la différence fondamentale entre les deux.

Le **contrôle de flux** (empêcher qu''un émetteur ne submerge un destinataire plus lent, causant une perte de données) n''est pas une fonction exclusive de la couche Transport : il peut aussi être implémenté au niveau de la **couche Liaison de données**, en plus de la couche Transport, où TCP le gère avec des mécanismes avancés.

## MTU et fragmentation des paquets

Lorsqu''un paquet IP est plus grand que la taille maximale transmissible sur une liaison (**MTU**, Maximum Transmission Unit), il est divisé en fragments plus petits pour s''adapter aux limites de transmission du réseau traversé. Cela se produit au niveau de la **couche Réseau (3)**, et c''est le protocole **IP** qui s''en charge ; les fragments sont réassemblés à destination.

## Erreurs fréquentes

- Confondre l''ordre des 7 couches OSI.
- Penser que le modèle TCP/IP compte 7 couches comme OSI.
- Confondre la couche à laquelle travaille un switch (2) avec celle d''un routeur (3).
- Penser que l''adresse IP est gérée au niveau de la couche Liaison de données au lieu de la couche Réseau.
- Oublier que TCP et UDP travaillent au niveau de la couche Transport.
- Confondre encapsulation et décapsulation.

## Mini scénario

Un technicien doit expliquer pourquoi un switch ne peut pas acheminer du trafic entre deux réseaux IP différents, alors qu''un routeur le peut. La bonne réponse fait référence à la couche OSI : le switch travaille au niveau de la **couche Liaison de données (2)** et n''utilise que des adresses MAC au sein du même segment, tandis que le routeur travaille au niveau de la **couche Réseau (3)** et utilise des adresses IP pour acheminer le trafic entre différents réseaux.

## Checklist

Avant de commencer le quiz, vous devez savoir expliquer :

- les 7 couches du modèle OSI dans l''ordre ;
- à quoi sert chaque couche OSI ;
- les 4 couches du modèle TCP/IP et leur correspondance avec OSI ;
- ce que signifie l''encapsulation ;
- un exemple d''équipement ou de protocole pour chaque couche.' WHERE topic_id = 227;

-- Topic 227 -- ES
UPDATE topic_review_pages SET content_es = '## Lo que realmente debes saber

Los modelos OSI y TCP/IP son la forma estándar de describir cómo viajan los datos por una red, dividiendo el proceso en capas con tareas específicas. Es probablemente el tema más citado de todo el networking, y el CCST lo exige a nivel de reconocimiento: saber qué hace cada capa y reconocer ejemplos prácticos.

## Conceptos clave

- **Modelo OSI**: modelo de referencia de 7 capas que describe las funciones de una red.
- **Capa Física (1)**: transmisión de bits en bruto por un medio físico (cable, fibra, ondas de radio).
- **Capa de Enlace de datos (2)**: transferencia de datos entre dispositivos del mismo segmento, usa direcciones MAC.
- **Capa de Red (3)**: enrutamiento de paquetes entre redes diferentes, usa direcciones IP.
- **Capa de Transporte (4)**: entrega fiable o rápida de datos, gestiona puertos y conexiones (TCP/UDP).
- **Capa de Sesión (5)**: apertura, gestión y cierre de sesiones de comunicación.
- **Capa de Presentación (6)**: formateo, cifrado y compresión de datos.
- **Capa de Aplicación (7)**: interfaz con las aplicaciones que el usuario usa directamente.
- **Modelo TCP/IP**: modelo práctico de 4 capas (Acceso a la red, Internet, Transporte, Aplicación) en el que se basa Internet.
- **Encapsulación**: proceso mediante el cual cada capa añade su propia cabecera a los datos recibidos de la capa superior.

## Diferencias importantes

| Capa OSI | Función principal | Ejemplo |
|---|---|---|
| Física (1) | Transmisión de bits | Cables, conectores, señales |
| Enlace de datos (2) | Comunicación local, direcciones MAC | Switch |
| Red (3) | Enrutamiento entre redes, direcciones IP | Router |
| Transporte (4) | Entrega de datos, puertos | TCP, UDP |
| Sesión (5) | Gestión de sesiones | Apertura/cierre de conexiones |
| Presentación (6) | Formato, cifrado, compresión | SSL/TLS, formatos de archivo |
| Aplicación (7) | Interfaz con el usuario | HTTP, FTP, correo electrónico |

## El modelo OSI en detalle

El modelo OSI (Open Systems Interconnection) divide la comunicación de red en 7 capas, cada una con una tarea precisa e independiente de las demás. Esta separación permite que distintos fabricantes construyan dispositivos y software compatibles entre sí, porque cada capa se comunica solo con las que tiene inmediatamente por encima y por debajo.

Una forma habitual de recordar el orden de las capas, de la más baja a la más alta, es usar una frase mnemotécnica en la que cada palabra empieza por la inicial de la capa (en inglés se suele usar "Please Do Not Throw Sausage Pizza Away").

Para el examen, el truco más útil es asociar cada capa con un ejemplo concreto: un cable de red es la capa 1, un switch trabaja en la capa 2, un router en la capa 3, y un navegador web en la capa 7.

## El modelo TCP/IP

El modelo TCP/IP es el que realmente usa Internet y es más simple, con solo 4 capas que agrupan las funciones de las 7 capas OSI:

- **Acceso a la red**: corresponde a las capas Física y de Enlace de datos de OSI.
- **Internet**: corresponde a la capa de Red de OSI, gestiona el direccionamiento IP y el enrutamiento.
- **Transporte**: corresponde a la capa de Transporte de OSI, gestiona TCP y UDP.
- **Aplicación**: agrupa las capas de Sesión, Presentación y Aplicación de OSI.

Para el examen CCST es importante saber hacer corresponder las capas OSI con las capas TCP/IP equivalentes.

## Encapsulación

Cuando se envía un dato por la red, cada capa añade su propia cabecera antes de pasarlo a la capa siguiente: este proceso se llama encapsulación. En la capa de Aplicación el dato sigue siendo un mensaje; en la capa de Transporte se convierte en un segmento con información del puerto; en la capa de Red se convierte en un paquete con direcciones IP; en la capa de Enlace de datos se convierte en una trama con direcciones MAC.

Al recibirlo, el proceso ocurre a la inversa: cada capa elimina su propia cabecera, un proceso llamado desencapsulación.

## Otros protocolos comunes y su capa

- **ARP** (entre Enlace de datos y Red): traduce una dirección IP a la dirección MAC correspondiente del dispositivo en la misma red local; una respuesta ARP devuelve la dirección MAC asociada a una IP.
- **ICMP** (capa de Red): transporta mensajes de control y error entre dispositivos IP; es el protocolo que usan herramientas como **ping** para verificar si un host es accesible.
- **SNMP** (capa de Aplicación): se usa para monitorizar y administrar dispositivos de red (estado de las interfaces, tráfico), normalmente desde un sistema de monitorización de red.
- **DNS** (capa de Aplicación): traduce un nombre de dominio en la dirección IP correspondiente; es el protocolo que un navegador usa para localizar un servidor antes de contactarlo.
- **SMTP, POP3, IMAP** (capa de Aplicación): SMTP envía los correos; para la recepción se combina con POP3 o IMAP.
- **HTTPS** (capa de Aplicación, sobre TCP): es la versión segura de HTTP, protegida con cifrado **TLS/SSL**. Viaja sobre TCP, no sobre UDP, porque la transmisión debe ser fiable y ordenada.

## TCP, UDP y control de flujo

El protocolo **TCP** establece una conexión antes de empezar a transmitir, mediante un breve intercambio de mensajes conocido como **three-way handshake** (SYN, SYN-ACK, ACK). Gracias a esto, TCP garantiza fiabilidad: confirma la recepción de los datos y los retransmite si se pierden. El protocolo **UDP**, por el contrario, no establece ninguna conexión antes de enviar los datos: es más rápido pero no garantiza ni el orden ni la entrega — esta es la diferencia fundamental entre ambos.

El **control de flujo** (evitar que un emisor sature a un receptor más lento, causando pérdida de datos) no es una función exclusiva de la capa de Transporte: también puede implementarse en la **capa de Enlace de datos**, además de en la capa de Transporte, donde TCP lo gestiona con mecanismos avanzados.

## MTU y fragmentación de paquetes

Cuando un paquete IP es más grande que el tamaño máximo transmisible en un enlace (**MTU**, Maximum Transmission Unit), se divide en fragmentos más pequeños para adaptarse a los límites de transmisión de la red que atraviesa. Esto ocurre en la **capa de Red (3)**, y es el protocolo **IP** el que se encarga de ello; los fragmentos se reensamblan en el destino.

## Errores frecuentes

- Confundir el orden de las 7 capas OSI.
- Pensar que el modelo TCP/IP tiene 7 capas como OSI.
- Confundir la capa en la que trabaja un switch (2) con la de un router (3).
- Pensar que la dirección IP se gestiona en la capa de Enlace de datos en lugar de en la capa de Red.
- Olvidar que TCP y UDP trabajan en la capa de Transporte.
- Confundir encapsulación y desencapsulación.

## Mini escenario

Un técnico debe explicar por qué un switch no puede enrutar tráfico entre dos redes IP diferentes, mientras que un router sí. La respuesta correcta hace referencia a la capa OSI: el switch trabaja en la **capa de Enlace de datos (2)** y solo usa direcciones MAC dentro del mismo segmento, mientras que el router trabaja en la **capa de Red (3)** y usa direcciones IP para enrutar tráfico entre redes diferentes.

## Checklist

Antes de empezar el cuestionario deberías saber explicar:

- las 7 capas del modelo OSI en orden;
- para qué sirve cada capa OSI;
- las 4 capas del modelo TCP/IP y su correspondencia con OSI;
- qué significa la encapsulación;
- un ejemplo de dispositivo o protocolo para cada capa.' WHERE topic_id = 227;

-- Topic 229 -- EN
UPDATE topic_review_pages SET content_en = '## What you really need to know

Every device on an IP network needs a unique address to communicate. CCST requires understanding the structure of an IPv4 address, what a subnet mask does, and the difference between public and private addresses. Complex subnetting isn''t required to the extent it is in CCNA, but the basic concepts are.

## Key concepts

- **IPv4 address**: a 32-bit identifier, written in dotted-decimal notation (e.g. 192.168.1.10).
- **Subnet mask**: defines which part of the IP address identifies the network and which identifies the host.
- **CIDR notation**: indicates the number of network bits with a slash (e.g. /24 is equivalent to 255.255.255.0).
- **Network address**: the first address of a subnet, used to identify the network itself.
- **Broadcast address**: the last address of a subnet, used to send data to all devices on the subnet.
- **Private IP addresses**: ranges reserved for internal networks, not routable on the Internet.
- **Public IP addresses**: assigned and routable on the Internet.
- **DHCP**: a protocol that automatically assigns IP addresses to devices.
- **Static address**: an IP address configured manually that doesn''t change.
- **Default gateway**: the IP address of the device (usually a router) used to reach networks outside your own subnet.

## Do not confuse

| Concept | Main meaning |
|---|---|
| Network address | Identifies the subnet, not a specific host |
| Broadcast address | Reaches all devices on the subnet |
| Subnet mask | Separates the network part from the host part |
| Private IP | Used in internal networks, not routable on the Internet |
| Public IP | Routable on the Internet |
| DHCP | Automatic IP assignment |
| Static | Manual IP assignment |

## The structure of an IPv4 address

An IPv4 address consists of 32 bits, divided into 4 groups of 8 bits (octets) written in decimal and separated by dots, for example 192.168.1.10. Each octet can range from 0 to 255.

The **subnet mask** indicates how many bits of the address identify the network and how many identify the host within that network. For example, with subnet mask 255.255.255.0 (or /24), the first 24 bits identify the network and the last 8 bits identify the host, allowing up to 254 usable hosts.

## CIDR notation

CIDR (Classless Inter-Domain Routing) notation expresses the subnet mask as a number of network bits after a slash: /24 is equivalent to 255.255.255.0, /16 is equivalent to 255.255.0.0. The lower the number after the slash, the more hosts are available in that subnet.

## Network and broadcast addresses

In every subnet, the first address is reserved to identify the network itself (network address) and the last address is reserved for broadcast, used to send data to all devices on the subnet at once. Neither can be assigned to a single device as a host address.

## Public and private addresses

Private address ranges (defined by RFC 1918) are reserved for internal network use and are not routed on the Internet:

- 10.0.0.0 – 10.255.255.255
- 172.16.0.0 – 172.31.255.255
- 192.168.0.0 – 192.168.255.255

Public addresses, on the other hand, are globally unique and routable on the Internet. A home router typically translates the internal network''s private addresses into a single public address via NAT to access the Internet.

## DHCP vs static addressing

With **DHCP**, a server automatically assigns an IP address, subnet mask, gateway and other parameters to devices joining the network, simplifying management. With a **static address**, the address is configured manually on each device and doesn''t change: useful for servers, network printers, or devices that need to always have the same address.

## IPv6: the basics

**IPv6** was introduced to solve the exhaustion of available IPv4 addresses and to support a much larger number of connected devices. It uses **128-bit** addresses (versus IPv4''s 32 bits), written in hexadecimal notation (e.g. 2001:0db8::1), and also offers improved support for automatic host configuration.

Just as IPv4 has a loopback address (127.0.0.1), IPv6 has its own: **::1**. There''s also a category of IPv6 addresses dedicated to communication within the same network segment, the **link-local** addresses, identified by the **FE80::/10** prefix: they aren''t routable on the Internet, and are used only to communicate with devices on the same local network.

## Special IPv4 addresses to recognize

- **169.254.x.x (APIPA)**: a device automatically assigns itself an address in this range when it can''t reach a DHCP server. An APIPA address only allows communication with other devices on the same local network, not Internet access — so it''s a sign that DHCP isn''t working.
- **0.0.0.0**: represents a not-yet-configured host or a generic destination. In the context of a routing table, the **default route (0.0.0.0/0)** indicates the path to use for any destination that doesn''t match any other known route.
- **IP conflict**: occurs when two devices on the same network have the same IP address, disrupting communication for both until the conflict is resolved.

## Classful, CIDR, VLSM and wildcard mask

Before CIDR, IPv4 addresses were assigned using **classful addressing**: a historical method that divided addresses into fixed classes (A, B, C) with predefined subnet masks (a Class C network, for example, always uses 255.255.255.0). This system wasted a lot of addresses, because an organization had to take an entire class even if it didn''t need all the available hosts. **CIDR**, with its variable-length masks, solved this problem by letting subnets be sized according to the actual number of hosts needed.

**VLSM** (Variable Length Subnet Mask) applies the same principle within a single network: it lets you use subnet masks of different lengths for different subnets within the same infrastructure, avoiding wasting addresses by assigning the same mask to segments with very different needs.

The **wildcard mask** is the inverse of a subnet mask and is used in certain configurations, such as access control lists (ACLs), to define a range of IP addresses to which a rule should apply.

## Common exam mistakes

- Confusing the network address and the broadcast address.
- Thinking a shorter subnet mask (e.g. /16) offers fewer available hosts than a longer one (e.g. /24) — it''s the opposite.
- Confusing public and private addresses.
- Thinking an address assigned by DHCP is as permanent as a static one.
- Forgetting that the network address and the broadcast address can''t be used by a host.
- Confusing the default gateway with the device''s own IP address.

## Mini exam scenario

A technician needs to configure 4 devices on a small network with subnet 192.168.1.0/24. Valid host addresses must be assigned, avoiding the network address (192.168.1.0) and the broadcast address (192.168.1.255). The usable addresses therefore range from 192.168.1.1 to 192.168.1.254.

## Checklist

Before starting the quiz you should be able to explain:

- the structure of an IPv4 address;
- what a subnet mask does;
- what CIDR notation means (e.g. /24);
- the difference between the network address and the broadcast address;
- the difference between public and private addresses;
- the difference between DHCP and static addressing.' WHERE topic_id = 229;

-- Topic 229 -- FR
UPDATE topic_review_pages SET content_fr = '## Ce qu''il faut vraiment savoir

Chaque équipement d''un réseau IP a besoin d''une adresse unique pour pouvoir communiquer. Le CCST exige de comprendre la structure d''une adresse IPv4, le rôle d''un masque de sous-réseau, et la différence entre adresses publiques et privées. Le subnetting complexe n''est pas exigé autant que dans le CCNA, mais les concepts de base le sont.

## Concepts clés

- **Adresse IPv4** : identifiant de 32 bits, écrit en notation décimale pointée (ex. 192.168.1.10).
- **Masque de sous-réseau** : définit quelle partie de l''adresse IP identifie le réseau et laquelle identifie l''hôte.
- **Notation CIDR** : indique le nombre de bits réseau avec une barre oblique (ex. /24 équivaut à 255.255.255.0).
- **Adresse réseau** : la première adresse d''un sous-réseau, utilisée pour identifier le réseau lui-même.
- **Adresse de diffusion (broadcast)** : la dernière adresse d''un sous-réseau, utilisée pour envoyer des données à tous les équipements du sous-réseau.
- **Adresses IP privées** : plages réservées aux réseaux internes, non routables sur Internet.
- **Adresses IP publiques** : attribuées et routables sur Internet.
- **DHCP** : protocole qui attribue automatiquement des adresses IP aux équipements.
- **Adresse statique** : adresse IP configurée manuellement et qui ne change pas.
- **Passerelle par défaut (default gateway)** : l''adresse IP de l''équipement (généralement un routeur) utilisée pour atteindre des réseaux situés en dehors de son propre sous-réseau.

## À ne pas confondre

| Concept | Signification principale |
|---|---|
| Adresse réseau | Identifie le sous-réseau, pas un hôte spécifique |
| Adresse de diffusion | Atteint tous les équipements du sous-réseau |
| Masque de sous-réseau | Sépare la partie réseau de la partie hôte |
| IP privée | Utilisée dans les réseaux internes, non routable sur Internet |
| IP publique | Routable sur Internet |
| DHCP | Attribution automatique de l''IP |
| Statique | Attribution manuelle de l''IP |

## Structure d''une adresse IPv4

Une adresse IPv4 est composée de 32 bits, divisés en 4 groupes de 8 bits (octets) écrits en décimal et séparés par des points, par exemple 192.168.1.10. Chaque octet peut prendre une valeur de 0 à 255.

Le **masque de sous-réseau** indique combien de bits de l''adresse identifient le réseau et combien identifient l''hôte au sein de ce réseau. Par exemple, avec un masque 255.255.255.0 (ou /24), les 24 premiers bits identifient le réseau et les 8 derniers bits identifient l''hôte, ce qui permet jusqu''à 254 hôtes utilisables.

## Notation CIDR

La notation CIDR (Classless Inter-Domain Routing) exprime le masque de sous-réseau comme un nombre de bits réseau après une barre oblique : /24 équivaut à 255.255.255.0, /16 équivaut à 255.255.0.0. Plus le nombre après la barre est bas, plus il y a d''hôtes disponibles dans ce sous-réseau.

## Adresse réseau et adresse de diffusion

Dans chaque sous-réseau, la première adresse est réservée pour identifier le réseau lui-même (adresse réseau) et la dernière adresse est réservée pour la diffusion, utilisée pour envoyer des données à tous les équipements du sous-réseau en même temps. Aucune des deux ne peut être attribuée à un seul équipement comme adresse d''hôte.

## Adresses publiques et privées

Les plages d''adresses privées (définies par la RFC 1918) sont réservées à un usage interne aux réseaux et ne sont pas routées sur Internet :

- 10.0.0.0 – 10.255.255.255
- 172.16.0.0 – 172.31.255.255
- 192.168.0.0 – 192.168.255.255

Les adresses publiques, en revanche, sont uniques au niveau mondial et routables sur Internet. Un routeur domestique traduit généralement les adresses privées du réseau interne en une seule adresse publique via le NAT pour accéder à Internet.

## DHCP contre adressage statique

Avec **DHCP**, un serveur attribue automatiquement l''adresse IP, le masque de sous-réseau, la passerelle et d''autres paramètres aux équipements qui se connectent au réseau, simplifiant la gestion. Avec une **adresse statique**, l''adresse est configurée manuellement sur chaque équipement et ne change pas : utile pour les serveurs, les imprimantes réseau ou les équipements qui doivent toujours avoir la même adresse.

## IPv6 : les bases

**IPv6** a été introduit pour résoudre l''épuisement des adresses IPv4 disponibles et pour prendre en charge un nombre bien plus grand d''équipements connectés. Il utilise des adresses de **128 bits** (contre 32 bits pour IPv4), écrites en notation hexadécimale (ex. 2001:0db8::1), et offre également une meilleure prise en charge de la configuration automatique des hôtes.

Tout comme IPv4 possède une adresse de loopback (127.0.0.1), IPv6 a la sienne : **::1**. Il existe aussi une catégorie d''adresses IPv6 dédiée à la communication au sein du même segment de réseau, les adresses **link-local**, identifiées par le préfixe **FE80::/10** : elles ne sont pas routables sur Internet et servent uniquement à communiquer avec des équipements connectés au même réseau local.

## Adresses IPv4 spéciales à reconnaître

- **169.254.x.x (APIPA)** : un équipement s''attribue automatiquement une adresse dans cette plage lorsqu''il ne parvient pas à contacter un serveur DHCP. Une adresse APIPA ne permet la communication qu''avec d''autres équipements du même réseau local, pas l''accès à Internet — c''est donc le signe que le DHCP ne fonctionne pas.
- **0.0.0.0** : représente un hôte pas encore configuré ou une destination générique. Dans le contexte d''une table de routage, la **route par défaut (0.0.0.0/0)** indique le chemin à utiliser pour toute destination qui ne correspond à aucune autre route connue.
- **Conflit d''adresse IP** : se produit lorsque deux équipements du même réseau ont la même adresse IP, interrompant la communication des deux jusqu''à ce que le conflit soit résolu.

## Adressage classful, CIDR, VLSM et masque wildcard

Avant le CIDR, les adresses IPv4 étaient attribuées selon l''**adressage classful** : une méthode historique qui divisait les adresses en classes fixes (A, B, C) avec des masques de sous-réseau prédéfinis (un réseau de classe C, par exemple, utilise toujours 255.255.255.0). Ce système gaspillait beaucoup d''adresses, car une organisation devait prendre une classe entière même si elle n''avait pas besoin de tous les hôtes disponibles. Le **CIDR**, avec ses masques de longueur variable, a résolu ce problème en permettant de dimensionner les sous-réseaux selon le nombre réel d''hôtes nécessaires.

Le **VLSM** (Variable Length Subnet Mask) applique le même principe au sein d''un même réseau : il permet d''utiliser des masques de sous-réseau de longueurs différentes pour différents sous-réseaux au sein de la même infrastructure, évitant de gaspiller des adresses en attribuant le même masque à des segments ayant des besoins très différents.

Le **masque wildcard** est l''inverse d''un masque de sous-réseau et est utilisé dans certaines configurations, comme les listes de contrôle d''accès (ACL), pour définir une plage d''adresses IP auxquelles appliquer une règle.

## Erreurs fréquentes

- Confondre l''adresse réseau et l''adresse de diffusion.
- Penser qu''un masque de sous-réseau plus court (ex. /16) offre moins d''hôtes disponibles qu''un plus long (ex. /24) — c''est l''inverse.
- Confondre adresses publiques et privées.
- Penser qu''une adresse attribuée par DHCP est aussi permanente qu''une adresse statique.
- Oublier que l''adresse réseau et l''adresse de diffusion ne sont pas utilisables par un hôte.
- Confondre la passerelle par défaut avec l''adresse IP de l''équipement lui-même.

## Mini scénario

Un technicien doit configurer 4 équipements dans un petit réseau avec le sous-réseau 192.168.1.0/24. Il doit attribuer des adresses d''hôte valides, en évitant l''adresse réseau (192.168.1.0) et l''adresse de diffusion (192.168.1.255). Les adresses utilisables vont donc de 192.168.1.1 à 192.168.1.254.

## Checklist

Avant de commencer le quiz, vous devez savoir expliquer :

- la structure d''une adresse IPv4 ;
- le rôle d''un masque de sous-réseau ;
- ce que signifie la notation CIDR (ex. /24) ;
- la différence entre adresse réseau et adresse de diffusion ;
- la différence entre adresses publiques et privées ;
- la différence entre DHCP et adressage statique.' WHERE topic_id = 229;

-- Topic 229 -- ES
UPDATE topic_review_pages SET content_es = '## Lo que realmente debes saber

Todo dispositivo en una red IP necesita una dirección única para poder comunicarse. El CCST exige comprender la estructura de una dirección IPv4, qué hace una máscara de subred, y la diferencia entre direcciones públicas y privadas. El subnetting complejo no se exige tanto como en el CCNA, pero los conceptos básicos sí.

## Conceptos clave

- **Dirección IPv4**: identificador de 32 bits, escrito en notación decimal punteada (ej. 192.168.1.10).
- **Máscara de subred**: define qué parte de la dirección IP identifica la red y cuál el host.
- **Notación CIDR**: indica el número de bits de red con una barra (ej. /24 equivale a 255.255.255.0).
- **Dirección de red**: la primera dirección de una subred, usada para identificar la propia red.
- **Dirección de broadcast**: la última dirección de una subred, usada para enviar datos a todos los dispositivos de la subred.
- **Direcciones IP privadas**: rangos reservados para redes internas, no enrutables en Internet.
- **Direcciones IP públicas**: asignadas y enrutables en Internet.
- **DHCP**: protocolo que asigna automáticamente direcciones IP a los dispositivos.
- **Dirección estática**: dirección IP configurada manualmente y que no cambia.
- **Gateway predeterminado (default gateway)**: la dirección IP del dispositivo (normalmente un router) usada para alcanzar redes fuera de la propia subred.

## Diferencias importantes

| Concepto | Significado principal |
|---|---|
| Dirección de red | Identifica la subred, no un host específico |
| Dirección de broadcast | Alcanza a todos los dispositivos de la subred |
| Máscara de subred | Separa la parte de red y la parte de host |
| IP privada | Usada en redes internas, no enrutable en Internet |
| IP pública | Enrutable en Internet |
| DHCP | Asignación automática de la IP |
| Estática | Asignación manual de la IP |

## Estructura de una dirección IPv4

Una dirección IPv4 se compone de 32 bits, divididos en 4 grupos de 8 bits (octetos) escritos en decimal y separados por puntos, por ejemplo 192.168.1.10. Cada octeto puede tener un valor de 0 a 255.

La **máscara de subred** indica cuántos bits de la dirección identifican la red y cuántos identifican el host dentro de esa red. Por ejemplo, con la máscara 255.255.255.0 (o /24), los primeros 24 bits identifican la red y los últimos 8 bits identifican el host, permitiendo hasta 254 hosts utilizables.

## Notación CIDR

La notación CIDR (Classless Inter-Domain Routing) expresa la máscara de subred como un número de bits de red después de una barra: /24 equivale a 255.255.255.0, /16 equivale a 255.255.0.0. Cuanto más bajo es el número tras la barra, más hosts hay disponibles en esa subred.

## Dirección de red y de broadcast

En cada subred, la primera dirección está reservada para identificar la propia red (dirección de red) y la última dirección está reservada para el broadcast, usada para enviar datos a todos los dispositivos de la subred al mismo tiempo. Ninguna de las dos puede asignarse a un dispositivo individual como dirección de host.

## Direcciones públicas y privadas

Los rangos de direcciones privadas (definidos por la RFC 1918) están reservados para uso interno en las redes y no se enrutan en Internet:

- 10.0.0.0 – 10.255.255.255
- 172.16.0.0 – 172.31.255.255
- 192.168.0.0 – 192.168.255.255

Las direcciones públicas, en cambio, son únicas a nivel mundial y enrutables en Internet. Un router doméstico normalmente traduce las direcciones privadas de la red interna en una única dirección pública mediante NAT para acceder a Internet.

## DHCP frente a direccionamiento estático

Con **DHCP**, un servidor asigna automáticamente la dirección IP, la máscara de subred, el gateway y otros parámetros a los dispositivos que se conectan a la red, simplificando la gestión. Con una **dirección estática**, la dirección se configura manualmente en cada dispositivo y no cambia: útil para servidores, impresoras de red o dispositivos que deben tener siempre la misma dirección.

## IPv6: lo básico

**IPv6** se introdujo para resolver el agotamiento de las direcciones IPv4 disponibles y para admitir un número mucho mayor de dispositivos conectados. Usa direcciones de **128 bits** (frente a los 32 bits de IPv4), escritas en notación hexadecimal (ej. 2001:0db8::1), y también ofrece un soporte mejorado para la configuración automática de hosts.

Igual que IPv4 tiene una dirección de loopback (127.0.0.1), IPv6 tiene la suya: **::1**. También existe una categoría de direcciones IPv6 dedicada a la comunicación dentro del mismo segmento de red, las direcciones **link-local**, identificadas por el prefijo **FE80::/10**: no son enrutables en Internet, y solo sirven para comunicarse con dispositivos conectados a la misma red local.

## Direcciones IPv4 especiales que hay que reconocer

- **169.254.x.x (APIPA)**: un dispositivo se asigna automáticamente una dirección en este rango cuando no logra contactar con un servidor DHCP. Una dirección APIPA solo permite la comunicación con otros dispositivos de la misma red local, no el acceso a Internet — por lo que es una señal de que el DHCP no está funcionando.
- **0.0.0.0**: representa un host aún no configurado o un destino genérico. En el contexto de una tabla de enrutamiento, la **ruta predeterminada (0.0.0.0/0)** indica la ruta a usar para cualquier destino que no coincida con ninguna otra ruta conocida.
- **Conflicto de IP**: se produce cuando dos dispositivos de la misma red tienen la misma dirección IP, interrumpiendo la comunicación de ambos hasta que se resuelve el conflicto.

## Direccionamiento classful, CIDR, VLSM y máscara wildcard

Antes del CIDR, las direcciones IPv4 se asignaban con el **direccionamiento classful**: un método histórico que dividía las direcciones en clases fijas (A, B, C) con máscaras de subred predefinidas (una red de clase C, por ejemplo, usa siempre 255.255.255.0). Este sistema desperdiciaba muchas direcciones, porque una organización tenía que tomar una clase entera aunque no necesitara todos los hosts disponibles. El **CIDR**, con sus máscaras de longitud variable, resolvió este problema permitiendo dimensionar las subredes según el número real de hosts necesarios.

El **VLSM** (Variable Length Subnet Mask) aplica el mismo principio dentro de una sola red: permite usar máscaras de subred de longitud diferente para distintas subredes dentro de la misma infraestructura, evitando desperdiciar direcciones al asignar la misma máscara a segmentos con necesidades muy diferentes.

La **máscara wildcard** es la inversa de una máscara de subred y se usa en algunas configuraciones, como las listas de control de acceso (ACL), para definir un rango de direcciones IP a las que aplicar una regla.

## Errores frecuentes

- Confundir la dirección de red y la dirección de broadcast.
- Pensar que una máscara de subred más corta (ej. /16) ofrece menos hosts disponibles que una más larga (ej. /24) — es al contrario.
- Confundir direcciones públicas y privadas.
- Pensar que una dirección asignada por DHCP es tan permanente como una estática.
- Olvidar que la dirección de red y la de broadcast no pueden ser usadas por un host.
- Confundir el gateway predeterminado con la dirección IP del propio dispositivo.

## Mini escenario

Un técnico debe configurar 4 dispositivos en una pequeña red con la subred 192.168.1.0/24. Debe asignar direcciones de host válidas, evitando la dirección de red (192.168.1.0) y la de broadcast (192.168.1.255). Las direcciones utilizables van, por tanto, de 192.168.1.1 a 192.168.1.254.

## Checklist

Antes de empezar el cuestionario deberías saber explicar:

- la estructura de una dirección IPv4;
- qué hace una máscara de subred;
- qué significa la notación CIDR (ej. /24);
- la diferencia entre dirección de red y dirección de broadcast;
- la diferencia entre direcciones públicas y privadas;
- la diferencia entre DHCP y direccionamiento estático.' WHERE topic_id = 229;

-- Topic 231 -- EN
UPDATE topic_review_pages SET content_en = '## What you really need to know

Every network service relies on a protocol that defines the rules of communication, and often on a specific port that identifies that service. CCST requires recognizing the most common protocols, the difference between TCP and UDP, and the ports associated with the main services.

## Key concepts

- **TCP (Transmission Control Protocol)**: a connection-oriented, reliable protocol, verifies data delivery.
- **UDP (User Datagram Protocol)**: a connectionless protocol, faster but with no delivery guarantee.
- **Port**: a number that identifies a specific service on a device.
- **HTTP**: the protocol for web browsing, unencrypted.
- **HTTPS**: the encrypted version of HTTP, uses TLS/SSL.
- **DNS**: translates domain names into IP addresses.
- **DHCP**: automatically assigns IP addresses and other network parameters.
- **FTP**: a protocol for transferring files.
- **SSH**: a protocol for secure, encrypted remote access.
- **Telnet**: a protocol for unencrypted remote access, now discouraged.

## Do not confuse

| Protocol | Port | Transport | Function |
|---|---|---|---|
| HTTP | 80 | TCP | Unencrypted web browsing |
| HTTPS | 443 | TCP | Encrypted web browsing |
| DNS | 53 | TCP/UDP | Domain name resolution |
| DHCP | 67/68 | UDP | Automatic IP assignment |
| FTP | 20/21 | TCP | File transfer |
| SSH | 22 | TCP | Encrypted remote access |
| Telnet | 23 | TCP | Unencrypted remote access |
| SMTP | 25 | TCP | Sending email |
| NTP | 123 | UDP | Time synchronization between devices |
| SNMP | 161/162 | UDP | Monitoring and managing network devices |
| RDP | 3389 | TCP | Graphical remote access |
| POP3 | 110 (995 encrypted) | TCP | Receives email by downloading it from the server to the client |
| IMAP | 143 (993 encrypted) | TCP | Receives email by syncing it, keeping it on the server |
| SFTP | 22 | TCP | Secure file transfer, uses the SSH channel |
| TFTP | 69 | UDP | Simple file transfer, without authentication |

## TCP vs UDP

**TCP** establishes a connection before sending data (three-way handshake), verifies that each packet arrives correctly and reorders them if needed. It''s used when reliability matters more than speed, such as in web browsing or file transfer.

**UDP**, on the other hand, sends data without establishing a connection and without verifying delivery. It''s faster and has less overhead, and is used when speed matters more than total reliability, such as in video streaming or VoIP calls, where losing a few packets is less of a problem than delays.

For the exam: if a question is about reliability, an established connection, or error checking, the answer is TCP. If it''s about speed, low overhead, or tolerance for some data loss, the answer is UDP.

## The concept of a port

A port is a number (from 0 to 65535) that identifies a specific service or application on a device. While the IP address identifies the device, the port identifies which service on that device should receive the data. For example, a server can run a web service (port 80/443) and an email service (port 25) at the same time, distinguishing them by port.

## Common application protocols

**HTTP** and **HTTPS** are used for web browsing: HTTPS adds encryption via TLS/SSL, protecting the data exchanged between client and server.

**DNS** translates readable domain names (like certifyquiz.com) into IP addresses, which are what devices actually use to communicate.

**DHCP** automatically assigns an IP address, subnet mask, gateway and other parameters to devices connecting to a network.

**FTP** lets you transfer files between client and server, while **SSH** provides secure, encrypted remote access to a device, replacing the older, insecure **Telnet**.

## ICMP, ARP and NAT: they don''t have a port like the others

**ICMP** and **ARP** are fundamental protocols for network operation but don''t use a TCP/UDP port number like the application protocols in the table above: ICMP carries control and error messages (it''s the protocol used by the **ping** command to check connectivity), while ARP translates an IP address into the corresponding MAC address on the local network.

**NAT** (Network Address Translation) isn''t an application protocol but a technique: it lets multiple devices with private IP addresses share a single public IP address to access the Internet, translating addresses on outbound and inbound traffic at the edge router.

## Common exam mistakes

- Confusing TCP and UDP in terms of reliability and speed.
- Not remembering the ports associated with the most common protocols.
- Confusing HTTP and HTTPS.
- Thinking DNS assigns IP addresses instead of translating domain names.
- Confusing DNS and DHCP.
- Thinking SSH and Telnet offer the same level of security.

## Mini exam scenario

A video call application occasionally drops a few frames but keeps working without noticeable interruptions, prioritizing smoothness over the perfect delivery of every single packet. This behavior is typical of applications that use **UDP**, which doesn''t guarantee delivery of every packet but reduces delays.

## Checklist

Before starting the quiz you should be able to explain:

- the difference between TCP and UDP;
- what a port is and what it''s for;
- the ports of the most common protocols (HTTP, HTTPS, DNS, DHCP, FTP, SSH);
- the difference between HTTP and HTTPS;
- the difference between DNS and DHCP;
- why SSH is preferable to Telnet.' WHERE topic_id = 231;

-- Topic 231 -- FR
UPDATE topic_review_pages SET content_fr = '## Ce qu''il faut vraiment savoir

Chaque service réseau repose sur un protocole qui définit les règles de communication, et souvent sur un port spécifique qui identifie ce service. Le CCST exige de reconnaître les protocoles les plus courants, la différence entre TCP et UDP, et les ports associés aux principaux services.

## Concepts clés

- **TCP (Transmission Control Protocol)** : protocole orienté connexion, fiable, vérifie la livraison des données.
- **UDP (User Datagram Protocol)** : protocole sans connexion, plus rapide mais sans garantie de livraison.
- **Port** : numéro qui identifie un service spécifique sur un équipement.
- **HTTP** : protocole de navigation web, non chiffré.
- **HTTPS** : version chiffrée de HTTP, utilise TLS/SSL.
- **DNS** : traduit les noms de domaine en adresses IP.
- **DHCP** : attribue automatiquement des adresses IP et d''autres paramètres réseau.
- **FTP** : protocole de transfert de fichiers.
- **SSH** : protocole d''accès distant sécurisé et chiffré.
- **Telnet** : protocole d''accès distant non chiffré, aujourd''hui déconseillé.

## À ne pas confondre

| Protocole | Port | Transport | Fonction |
|---|---|---|---|
| HTTP | 80 | TCP | Navigation web non chiffrée |
| HTTPS | 443 | TCP | Navigation web chiffrée |
| DNS | 53 | TCP/UDP | Résolution de noms de domaine |
| DHCP | 67/68 | UDP | Attribution automatique d''IP |
| FTP | 20/21 | TCP | Transfert de fichiers |
| SSH | 22 | TCP | Accès distant chiffré |
| Telnet | 23 | TCP | Accès distant non chiffré |
| SMTP | 25 | TCP | Envoi d''emails |
| NTP | 123 | UDP | Synchronisation de l''horloge entre équipements |
| SNMP | 161/162 | UDP | Surveillance et gestion des équipements réseau |
| RDP | 3389 | TCP | Accès distant graphique |
| POP3 | 110 (995 chiffré) | TCP | Reçoit les emails en les téléchargeant du serveur vers le client |
| IMAP | 143 (993 chiffré) | TCP | Reçoit les emails en les synchronisant, ils restent sur le serveur |
| SFTP | 22 | TCP | Transfert de fichiers sécurisé, utilise le canal SSH |
| TFTP | 69 | UDP | Transfert de fichiers simple, sans authentification |

## TCP contre UDP

**TCP** établit une connexion avant d''envoyer des données (three-way handshake), vérifie que chaque paquet arrive correctement et les réordonne si nécessaire. Il est utilisé lorsque la fiabilité est plus importante que la vitesse, comme pour la navigation web ou le transfert de fichiers.

**UDP**, quant à lui, envoie les données sans établir de connexion et sans vérifier leur livraison. Il est plus rapide et a moins d''overhead, et est utilisé lorsque la vitesse est plus importante que la fiabilité totale, comme pour le streaming vidéo ou les appels VoIP, où perdre quelques paquets est moins grave que d''avoir des délais.

Pour l''examen : si une question parle de fiabilité, de connexion établie, de contrôle des erreurs, la réponse est TCP. Si elle parle de vitesse, de faible overhead, de tolérance à une certaine perte de données, la réponse est UDP.

## La notion de port

Un port est un numéro (de 0 à 65535) qui identifie un service ou une application spécifique sur un équipement. Alors que l''adresse IP identifie l''équipement, le port identifie quel service sur cet équipement doit recevoir les données. Par exemple, un serveur peut exécuter simultanément un service web (port 80/443) et un service email (port 25), en les distinguant par le port.

## Protocoles applicatifs courants

**HTTP** et **HTTPS** servent à la navigation web : HTTPS ajoute le chiffrement via TLS/SSL, protégeant les données échangées entre client et serveur.

**DNS** traduit les noms de domaine lisibles (comme certifyquiz.com) en adresses IP, qui sont ce que les équipements utilisent réellement pour communiquer.

**DHCP** attribue automatiquement l''adresse IP, le masque de sous-réseau, la passerelle et d''autres paramètres aux équipements qui se connectent à un réseau.

**FTP** permet de transférer des fichiers entre client et serveur, tandis que **SSH** permet un accès distant sécurisé et chiffré à un équipement, remplaçant le plus ancien et non sécurisé **Telnet**.

## ICMP, ARP et NAT : pas de port comme les autres

**ICMP** et **ARP** sont des protocoles fondamentaux pour le fonctionnement du réseau mais n''utilisent pas de numéro de port TCP/UDP comme les protocoles applicatifs du tableau ci-dessus : ICMP transporte des messages de contrôle et d''erreur (c''est le protocole utilisé par la commande **ping** pour vérifier la connectivité), tandis qu''ARP traduit une adresse IP en l''adresse MAC correspondante sur le réseau local.

Le **NAT** (Network Address Translation) n''est pas un protocole applicatif mais une technique : il permet à plusieurs équipements ayant des adresses IP privées de partager une seule adresse IP publique pour accéder à Internet, en traduisant les adresses en sortie et en entrée sur le routeur de bordure.

## Erreurs fréquentes

- Confondre TCP et UDP en termes de fiabilité et de vitesse.
- Ne pas se souvenir des ports associés aux protocoles les plus courants.
- Confondre HTTP et HTTPS.
- Penser que le DNS attribue des adresses IP au lieu de traduire des noms de domaine.
- Confondre DNS et DHCP.
- Penser que SSH et Telnet offrent le même niveau de sécurité.

## Mini scénario

Une application de visioconférence perd occasionnellement quelques images mais continue de fonctionner sans interruptions notables, privilégiant la fluidité par rapport à la livraison parfaite de chaque paquet. Ce comportement est typique des applications qui utilisent **UDP**, qui ne garantit pas la livraison de chaque paquet mais réduit les délais.

## Checklist

Avant de commencer le quiz, vous devez savoir expliquer :

- la différence entre TCP et UDP ;
- ce qu''est un port et à quoi il sert ;
- les ports des protocoles les plus courants (HTTP, HTTPS, DNS, DHCP, FTP, SSH) ;
- la différence entre HTTP et HTTPS ;
- la différence entre DNS et DHCP ;
- pourquoi SSH est préférable à Telnet.' WHERE topic_id = 231;

-- Topic 231 -- ES
UPDATE topic_review_pages SET content_es = '## Lo que realmente debes saber

Todo servicio de red se basa en un protocolo que define las reglas de comunicación, y a menudo en un puerto específico que identifica ese servicio. El CCST exige reconocer los protocolos más comunes, la diferencia entre TCP y UDP, y los puertos asociados a los principales servicios.

## Conceptos clave

- **TCP (Transmission Control Protocol)**: protocolo orientado a conexión, fiable, verifica la entrega de los datos.
- **UDP (User Datagram Protocol)**: protocolo sin conexión, más rápido pero sin garantía de entrega.
- **Puerto**: número que identifica un servicio específico en un dispositivo.
- **HTTP**: protocolo de navegación web, sin cifrar.
- **HTTPS**: versión cifrada de HTTP, usa TLS/SSL.
- **DNS**: traduce nombres de dominio en direcciones IP.
- **DHCP**: asigna automáticamente direcciones IP y otros parámetros de red.
- **FTP**: protocolo para transferir archivos.
- **SSH**: protocolo para acceso remoto seguro y cifrado.
- **Telnet**: protocolo para acceso remoto sin cifrar, actualmente desaconsejado.

## Diferencias importantes

| Protocolo | Puerto | Transporte | Función |
|---|---|---|---|
| HTTP | 80 | TCP | Navegación web sin cifrar |
| HTTPS | 443 | TCP | Navegación web cifrada |
| DNS | 53 | TCP/UDP | Resolución de nombres de dominio |
| DHCP | 67/68 | UDP | Asignación automática de IP |
| FTP | 20/21 | TCP | Transferencia de archivos |
| SSH | 22 | TCP | Acceso remoto cifrado |
| Telnet | 23 | TCP | Acceso remoto sin cifrar |
| SMTP | 25 | TCP | Envío de correo |
| NTP | 123 | UDP | Sincronización horaria entre dispositivos |
| SNMP | 161/162 | UDP | Monitorización y gestión de dispositivos de red |
| RDP | 3389 | TCP | Acceso remoto gráfico |
| POP3 | 110 (995 cifrado) | TCP | Recibe el correo descargándolo del servidor al cliente |
| IMAP | 143 (993 cifrado) | TCP | Recibe el correo sincronizándolo, permanece en el servidor |
| SFTP | 22 | TCP | Transferencia de archivos segura, usa el canal SSH |
| TFTP | 69 | UDP | Transferencia de archivos simple, sin autenticación |

## TCP frente a UDP

**TCP** establece una conexión antes de enviar datos (three-way handshake), verifica que cada paquete llegue correctamente y los reordena si es necesario. Se usa cuando la fiabilidad importa más que la velocidad, como en la navegación web o la transferencia de archivos.

**UDP**, en cambio, envía los datos sin establecer una conexión y sin verificar su entrega. Es más rápido y tiene menos overhead, y se usa cuando la velocidad importa más que la fiabilidad total, como en el streaming de vídeo o las llamadas VoIP, donde perder algún paquete es menos grave que sufrir retrasos.

Para el examen: si una pregunta habla de fiabilidad, conexión establecida o control de errores, la respuesta es TCP. Si habla de velocidad, bajo overhead o tolerancia a cierta pérdida de datos, la respuesta es UDP.

## El concepto de puerto

Un puerto es un número (de 0 a 65535) que identifica un servicio o aplicación específica en un dispositivo. Mientras que la dirección IP identifica el dispositivo, el puerto identifica qué servicio de ese dispositivo debe recibir los datos. Por ejemplo, un servidor puede ejecutar simultáneamente un servicio web (puerto 80/443) y un servicio de correo (puerto 25), distinguiéndolos por el puerto.

## Protocolos de aplicación comunes

**HTTP** y **HTTPS** sirven para la navegación web: HTTPS añade cifrado mediante TLS/SSL, protegiendo los datos intercambiados entre cliente y servidor.

**DNS** traduce los nombres de dominio legibles (como certifyquiz.com) en direcciones IP, que es lo que los dispositivos usan realmente para comunicarse.

**DHCP** asigna automáticamente la dirección IP, la máscara de subred, el gateway y otros parámetros a los dispositivos que se conectan a una red.

**FTP** permite transferir archivos entre cliente y servidor, mientras que **SSH** permite el acceso remoto seguro y cifrado a un dispositivo, sustituyendo al más antiguo e inseguro **Telnet**.

## ICMP, ARP y NAT: no tienen puerto como los demás

**ICMP** y **ARP** son protocolos fundamentales para el funcionamiento de la red, pero no usan un número de puerto TCP/UDP como los protocolos de aplicación de la tabla anterior: ICMP transporta mensajes de control y error (es el protocolo usado por el comando **ping** para verificar la conectividad), mientras que ARP traduce una dirección IP en la dirección MAC correspondiente en la red local.

**NAT** (Network Address Translation) no es un protocolo de aplicación sino una técnica: permite que varios dispositivos con direcciones IP privadas compartan una única dirección IP pública para acceder a Internet, traduciendo las direcciones de salida y entrada en el router de borde.

## Errores frecuentes

- Confundir TCP y UDP en términos de fiabilidad y velocidad.
- No recordar los puertos asociados a los protocolos más comunes.
- Confundir HTTP y HTTPS.
- Pensar que el DNS asigna direcciones IP en lugar de traducir nombres de dominio.
- Confundir DNS y DHCP.
- Pensar que SSH y Telnet ofrecen el mismo nivel de seguridad.

## Mini escenario

Una aplicación de videollamada pierde ocasionalmente algún fotograma pero sigue funcionando sin interrupciones evidentes, priorizando la fluidez frente a la entrega perfecta de cada paquete. Este comportamiento es típico de aplicaciones que usan **UDP**, que no garantiza la entrega de cada paquete pero reduce los retrasos.

## Checklist

Antes de empezar el cuestionario deberías saber explicar:

- la diferencia entre TCP y UDP;
- qué es un puerto y para qué sirve;
- los puertos de los protocolos más comunes (HTTP, HTTPS, DNS, DHCP, FTP, SSH);
- la diferencia entre HTTP y HTTPS;
- la diferencia entre DNS y DHCP;
- por qué SSH es preferible a Telnet.' WHERE topic_id = 231;

-- Topic 235 -- EN
UPDATE topic_review_pages SET content_en = '## What you really need to know

Unlike the other, more technical topics, this one covers the professional context of networking: what roles exist, how a certification path is structured, and why CCST is designed as a first step. CCST includes this topic because it''s also intended for students and people at the very start of their career.

## Key concepts

- **CCST (Cisco Certified Support Technician)**: an entry-level certification designed as a first step into networking, with no prerequisites.
- **CCNA (Cisco Certified Network Associate)**: an associate-level certification, more in-depth than CCST.
- **Professional certifications**: an intermediate-to-advanced level (e.g. CCNP), requiring more experience and in-depth knowledge.
- **Expert certifications**: the highest level (e.g. CCIE), requiring years of hands-on experience.
- **Help desk / technical support**: a typical entry-level role for those starting out in IT and network support.
- **Network technician**: a technician who installs, configures and maintains network equipment.
- **Network administrator**: manages and administers more complex enterprise networks.
- **Network engineer**: designs and implements network solutions, a more advanced role.
- **Soft skills**: communication and problem-solving abilities, as important as technical skills in support roles.
- **Continuous learning**: the need to keep updating your skills due to the rapid evolution of networking technologies.

## Do not confuse

| Certification level | Cisco example | Typical audience |
|---|---|---|
| Entry | CCST | Beginners, no prior experience |
| Associate | CCNA | Technicians with solid foundations |
| Professional | CCNP | Experienced professionals |
| Expert | CCIE | Top experts in the field |

## The Cisco certification path

Cisco structures its certifications into increasing levels of competence. **CCST** is designed as an entry point, requiring no prior experience, and is suitable for students or anyone approaching the IT and networking world for the first time.

Moving up a level, there''s **CCNA**, which goes deeper into concepts like routing, advanced switching, basic security and automation, requiring a more solid understanding than CCST.

At the **professional** level (like CCNP), certifications require significant hands-on experience and specialized knowledge in areas like enterprise networking, security or collaboration.

At the top are the **expert** certifications (like CCIE), reserved for professionals with years of experience and very in-depth skills, often required for complex network design and architecture roles.

## Professional roles in networking

Those starting a career in networking often begin in **help desk** or first-level technical support roles, dealing with common user issues. With experience, one can move on to **network technician**, physically installing and maintaining network equipment, and then to **network administrator**, managing more complex enterprise networks. The **network engineer** role is typically more advanced, focused on designing network solutions. At the top of this path is often the **network architect** role, which handles the strategic design of the overall network architecture, beyond a single technical solution.

## Cisco specialization paths

Beyond the four levels (entry, associate, professional, expert), Cisco offers **specialization** paths by technology area, especially at the professional level:

- **CCNP Enterprise**: complex, distributed enterprise networks, for those working with advanced network technologies at scale.
- **CCNP Security**: advanced protection of enterprise networks.
- **CCNP Collaboration**: IP telephony and videoconferencing systems.
- **CCNP Data Center**: managing enterprise data center infrastructure.
- **CCNA Security**: a historical path (retired by Cisco in 2020) related to network protection and cybersecurity at the associate level; the equivalent path today is **CyberOps Associate**.
- **DevNet Associate**: a path designed for those who develop and automate applications for Cisco networks, more oriented toward programming than traditional configuration.

## Cisco Networking Academy and vendor-specific certifications

The **Cisco Networking Academy** is Cisco''s educational program offering courses and hands-on labs on networking technologies, often the starting point for those preparing for CCST or CCNA.

A certification like Cisco''s is said to be **vendor-specific**: it focuses on the proprietary technologies of a single manufacturer (in this case Cisco), as opposed to a vendor-neutral certification, which covers general concepts valid regardless of device brand.

## Technical skills and soft skills

In technical support and networking, technical skills alone aren''t enough: communicating clearly with non-technical users, documenting resolved issues, and collaborating with other teams are equally important skills, especially in roles with direct user contact.

## Why continuous learning matters

Networking technologies evolve rapidly: new standards, protocols and security threats emerge constantly. Keeping your skills up to date, even after earning a certification, is essential to staying relevant in the field.

## Common exam mistakes

- Confusing the order of Cisco certification levels (entry, associate, professional, expert).
- Thinking CCST requires prior experience in the field.
- Confusing the roles of network technician and network administrator.
- Underestimating the importance of soft skills in technical support roles.
- Thinking that once a certification is earned, there''s no more need to keep learning.

## Mini exam scenario

A student with no prior IT experience wants to start a career in networking. They''re advised to start with **CCST**, the entry-level certification designed precisely for those without experience yet, before tackling more advanced certifications like CCNA.

## Checklist

Before starting the quiz you should be able to explain:

- the four levels of Cisco certifications (entry, associate, professional, expert);
- why CCST is designed as a first step;
- the difference between the roles of help desk, network technician, network administrator and network engineer;
- why soft skills matter in technical roles;
- why continuous learning is necessary in networking.' WHERE topic_id = 235;

-- Topic 235 -- FR
UPDATE topic_review_pages SET content_fr = '## Ce qu''il faut vraiment savoir

Contrairement aux autres sujets plus techniques, celui-ci porte sur le contexte professionnel du networking : quels rôles existent, comment se structure un parcours de certification, et pourquoi le CCST est conçu comme une première étape. Le CCST inclut ce sujet car il est aussi pensé pour les étudiants et les personnes en tout début de carrière.

## Concepts clés

- **CCST (Cisco Certified Support Technician)** : certification de niveau entrée, conçue comme première étape dans le networking, sans prérequis.
- **CCNA (Cisco Certified Network Associate)** : certification de niveau associate, plus approfondie que le CCST.
- **Certifications professional** : niveau intermédiaire-avancé (ex. CCNP), nécessite plus d''expérience et de connaissances approfondies.
- **Certifications expert** : le niveau le plus élevé (ex. CCIE), nécessite des années d''expérience pratique.
- **Help desk / support technique** : rôle de niveau entrée typique pour ceux qui débutent dans le support IT et réseau.
- **Network technician** : technicien qui installe, configure et maintient les équipements réseau.
- **Network administrator** : gère et administre des réseaux d''entreprise plus complexes.
- **Network engineer** : conçoit et met en œuvre des solutions réseau, un rôle plus avancé.
- **Soft skills** : capacités de communication et de résolution de problèmes, aussi importantes que les compétences techniques dans les rôles de support.
- **Formation continue** : nécessité de se mettre constamment à jour en raison de l''évolution rapide des technologies réseau.

## À ne pas confondre

| Niveau de certification | Exemple Cisco | Public typique |
|---|---|---|
| Entrée | CCST | Débutants, sans expérience préalable |
| Associate | CCNA | Techniciens ayant des bases solides |
| Professional | CCNP | Professionnels expérimentés |
| Expert | CCIE | Experts de haut niveau du secteur |

## Le parcours de certification Cisco

Cisco structure ses certifications par niveaux de compétence croissants. Le **CCST** est conçu comme un point d''entrée, sans exiger d''expérience préalable, et convient aux étudiants ou à ceux qui découvrent pour la première fois le monde de l''IT et du networking.

En montant de niveau, on trouve le **CCNA**, qui approfondit des concepts comme le routage, le switching avancé, la sécurité de base et l''automatisation, exigeant une compréhension plus solide que le CCST.

Au niveau **professional** (comme le CCNP), les certifications exigent une expérience pratique significative et des connaissances spécialisées dans des domaines comme le réseau d''entreprise, la sécurité ou la collaboration.

Au sommet se trouvent les certifications **expert** (comme le CCIE), réservées aux professionnels ayant des années d''expérience et des compétences très approfondies, souvent exigées pour des rôles de conception et d''architecture réseau complexes.

## Rôles professionnels dans le networking

Ceux qui débutent une carrière dans le networking commencent souvent par des rôles de **help desk** ou de support technique de premier niveau, traitant les problèmes courants des utilisateurs. Avec l''expérience, on peut évoluer vers **network technician**, qui installe et maintient physiquement les équipements réseau, puis vers **network administrator**, qui gère des réseaux d''entreprise plus complexes. Le rôle de **network engineer** est généralement plus avancé, axé sur la conception de solutions réseau. Au sommet de ce parcours se trouve souvent le rôle de **network architect**, qui s''occupe de la conception stratégique de l''architecture réseau globale, au-delà de la solution technique isolée.

## Parcours de spécialisation Cisco

Au-delà des quatre niveaux (entrée, associate, professional, expert), Cisco propose des parcours de **spécialisation** par domaine technologique, surtout aux niveaux professional :

- **CCNP Enterprise** : réseaux d''entreprise complexes et distribués, pour ceux qui travaillent avec des technologies réseau avancées à grande échelle.
- **CCNP Security** : protection avancée des réseaux d''entreprise.
- **CCNP Collaboration** : téléphonie IP et systèmes de visioconférence.
- **CCNP Data Center** : gestion des infrastructures de data center d''entreprise.
- **CCNA Security** : parcours historique (retiré par Cisco en 2020) lié à la protection des réseaux et à la cybersécurité au niveau associate ; le parcours équivalent aujourd''hui est **CyberOps Associate**.
- **DevNet Associate** : parcours conçu pour ceux qui développent et automatisent des applications pour les réseaux Cisco, davantage orienté vers la programmation que vers la configuration traditionnelle.

## Cisco Networking Academy et certifications vendor-specific

La **Cisco Networking Academy** est le programme éducatif de Cisco offrant des cours et des travaux pratiques sur les technologies réseau, souvent le point de départ pour ceux qui préparent le CCST ou le CCNA.

On dit qu''une certification comme celles de Cisco est **vendor-specific** : elle se concentre sur les technologies propriétaires d''un seul fabricant (ici Cisco), contrairement à une certification vendor-neutral, qui couvre des concepts généraux valables indépendamment de la marque des équipements.

## Compétences techniques et soft skills

Dans le support technique et le networking, les compétences techniques seules ne suffisent pas : communiquer clairement avec des utilisateurs non techniques, documenter les problèmes résolus et collaborer avec d''autres équipes sont des compétences tout aussi importantes, surtout dans les rôles en contact direct avec les utilisateurs.

## Pourquoi la formation continue est importante

Les technologies réseau évoluent rapidement : de nouveaux standards, protocoles et menaces de sécurité apparaissent constamment. Maintenir ses compétences à jour, même après avoir obtenu une certification, est essentiel pour rester pertinent dans le secteur.

## Erreurs fréquentes

- Confondre l''ordre des niveaux de certification Cisco (entrée, associate, professional, expert).
- Penser que le CCST exige une expérience préalable dans le secteur.
- Confondre les rôles de network technician et network administrator.
- Sous-estimer l''importance des soft skills dans les rôles de support technique.
- Penser qu''une certification, une fois obtenue, élimine le besoin de se mettre à jour.

## Mini scénario

Un étudiant sans expérience préalable en IT souhaite débuter un parcours dans le networking. On lui conseille de commencer par le **CCST**, la certification de niveau entrée conçue précisément pour ceux qui n''ont pas encore d''expérience, avant d''aborder des certifications plus avancées comme le CCNA.

## Checklist

Avant de commencer le quiz, vous devez savoir expliquer :

- les quatre niveaux des certifications Cisco (entrée, associate, professional, expert) ;
- pourquoi le CCST est conçu comme une première étape ;
- la différence entre les rôles de help desk, network technician, network administrator et network engineer ;
- pourquoi les soft skills sont importantes dans les rôles techniques ;
- pourquoi la formation continue est nécessaire dans le networking.' WHERE topic_id = 235;

-- Topic 235 -- ES
UPDATE topic_review_pages SET content_es = '## Lo que realmente debes saber

A diferencia de los demás temas, más técnicos, este trata del contexto profesional del networking: qué roles existen, cómo se estructura un itinerario de certificación, y por qué el CCST está pensado como primer paso. El CCST incluye este tema porque también está pensado para estudiantes y personas al inicio de su carrera.

## Conceptos clave

- **CCST (Cisco Certified Support Technician)**: certificación de nivel inicial pensada como primer paso en el networking, sin requisitos previos.
- **CCNA (Cisco Certified Network Associate)**: certificación de nivel associate, más profunda que el CCST.
- **Certificaciones professional**: nivel intermedio-avanzado (ej. CCNP), requiere más experiencia y conocimientos profundos.
- **Certificaciones expert**: el nivel más alto (ej. CCIE), requiere años de experiencia práctica.
- **Help desk / soporte técnico**: rol de nivel inicial típico para quienes empiezan en soporte de TI y redes.
- **Network technician**: técnico que instala, configura y mantiene equipos de red.
- **Network administrator**: gestiona y administra redes empresariales más complejas.
- **Network engineer**: diseña e implementa soluciones de red, un rol más avanzado.
- **Soft skills**: capacidad de comunicación y resolución de problemas, tan importantes como las competencias técnicas en los roles de soporte.
- **Formación continua**: necesidad de actualizarse constantemente debido a la rápida evolución de las tecnologías de red.

## Diferencias importantes

| Nivel de certificación | Ejemplo Cisco | Público típico |
|---|---|---|
| Inicial | CCST | Principiantes, sin experiencia previa |
| Associate | CCNA | Técnicos con bases consolidadas |
| Professional | CCNP | Profesionales con experiencia |
| Expert | CCIE | Máximos expertos del sector |

## El itinerario de certificación Cisco

Cisco estructura sus certificaciones en niveles crecientes de competencia. El **CCST** está pensado como punto de entrada, sin requerir experiencia previa, y es adecuado para estudiantes o para quienes se acercan por primera vez al mundo de TI y el networking.

Subiendo de nivel se encuentra el **CCNA**, que profundiza en conceptos como el enrutamiento, la conmutación avanzada, la seguridad básica y la automatización, exigiendo una comprensión más sólida que el CCST.

En el nivel **professional** (como el CCNP), las certificaciones requieren experiencia práctica significativa y conocimientos especializados en áreas como redes empresariales, seguridad o colaboración.

En la cima se encuentran las certificaciones **expert** (como el CCIE), reservadas a profesionales con años de experiencia y competencias muy profundas, a menudo requeridas para roles de diseño y arquitectura de red complejos.

## Roles profesionales en networking

Quienes empiezan su carrera en networking suelen comenzar en roles de **help desk** o soporte técnico de primer nivel, ocupándose de problemas comunes de los usuarios. Con la experiencia, se puede pasar a **network technician**, que instala y mantiene físicamente los equipos de red, y luego a **network administrator**, que gestiona redes empresariales más complejas. El rol de **network engineer** es normalmente más avanzado, centrado en el diseño de soluciones de red. En la cima de este itinerario suele estar el rol de **network architect**, que se ocupa del diseño estratégico de la arquitectura de red global, más allá de la solución técnica individual.

## Itinerarios de especialización Cisco

Además de los cuatro niveles (inicial, associate, professional, expert), Cisco ofrece itinerarios de **especialización** por área tecnológica, sobre todo en los niveles professional:

- **CCNP Enterprise**: redes empresariales complejas y distribuidas, para quienes trabajan con tecnologías de red avanzadas a gran escala.
- **CCNP Security**: protección avanzada de redes empresariales.
- **CCNP Collaboration**: telefonía IP y sistemas de videoconferencia.
- **CCNP Data Center**: gestión de infraestructuras de centros de datos empresariales.
- **CCNA Security**: itinerario histórico (retirado por Cisco en 2020) relacionado con la protección de redes y la ciberseguridad a nivel associate; hoy el itinerario equivalente es **CyberOps Associate**.
- **DevNet Associate**: itinerario pensado para quienes desarrollan y automatizan aplicaciones para redes Cisco, más orientado a la programación que a la configuración tradicional.

## Cisco Networking Academy y certificaciones vendor-specific

La **Cisco Networking Academy** es el programa educativo de Cisco que ofrece cursos y prácticas de laboratorio sobre tecnologías de red, a menudo el punto de partida para quienes se preparan para el CCST o el CCNA.

Se dice que una certificación como las de Cisco es **vendor-specific**: se centra en las tecnologías propietarias de un único fabricante (en este caso Cisco), a diferencia de una certificación vendor-neutral, que cubre conceptos generales válidos independientemente de la marca de los dispositivos.

## Competencias técnicas y soft skills

En el soporte técnico y el networking, las competencias técnicas por sí solas no bastan: comunicarse con claridad con usuarios no técnicos, documentar los problemas resueltos y colaborar con otros equipos son competencias igual de importantes, especialmente en los roles con contacto directo con los usuarios.

## Por qué es importante la formación continua

Las tecnologías de red evolucionan rápidamente: constantemente surgen nuevos estándares, protocolos y amenazas de seguridad. Mantener las competencias actualizadas, incluso después de obtener una certificación, es esencial para seguir siendo relevante en el sector.

## Errores frecuentes

- Confundir el orden de los niveles de certificación Cisco (inicial, associate, professional, expert).
- Pensar que el CCST requiere experiencia previa en el sector.
- Confundir los roles de network technician y network administrator.
- Subestimar la importancia de las soft skills en los roles de soporte técnico.
- Pensar que una certificación, una vez obtenida, elimina la necesidad de actualizarse.

## Mini escenario

Un estudiante sin experiencia previa en TI quiere iniciar un itinerario en networking. Se le recomienda empezar por el **CCST**, la certificación de nivel inicial pensada precisamente para quienes aún no tienen experiencia, antes de abordar certificaciones más avanzadas como el CCNA.

## Checklist

Antes de empezar el cuestionario deberías saber explicar:

- los cuatro niveles de las certificaciones Cisco (inicial, associate, professional, expert);
- por qué el CCST está pensado como primer paso;
- la diferencia entre los roles de help desk, network technician, network administrator y network engineer;
- por qué las soft skills son importantes en los roles técnicos;
- por qué la formación continua es necesaria en networking.' WHERE topic_id = 235;
