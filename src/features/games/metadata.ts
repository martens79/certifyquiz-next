import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { binaryRushPath, gamesPath, packetDefenderPath } from "@/lib/paths";
import { portHunterPath } from "@/lib/paths";

const SITE = "https://www.certifyquiz.com";
const seo = {
 it:{index:["Giochi informatici educativi gratuiti | CertifyQuiz","Mini-giochi informatici gratuiti per imparare reti, numeri binari e concetti IT divertendosi."], game:["Binary Rush: gioco sui numeri binari | CertifyQuiz","Esercizi di conversione binario-decimale in un gioco gratuito di 60 secondi."]},
 en:{index:["Free IT learning games | CertifyQuiz","Short, free IT games for learning networking, binary numbers and technical concepts."], game:["Binary Rush: binary conversion game | CertifyQuiz","Practice binary-to-decimal conversion in a fast, free 60-second binary number game."]},
 fr:{index:["Jeux informatiques éducatifs gratuits | CertifyQuiz","Des mini-jeux gratuits pour apprendre le binaire, les réseaux et l’informatique."], game:["Binary Rush : jeu pour apprendre le binaire | CertifyQuiz","Apprenez le binaire avec des conversions binaire-décimal dans un jeu gratuit de 60 secondes."]},
 es:{index:["Juegos educativos de informática gratis | CertifyQuiz","Mini juegos gratuitos para aprender redes, números binarios e informática."], game:["Binary Rush: juego de números binarios | CertifyQuiz","Practica la conversión binario-decimal con un juego gratuito de 60 segundos."]},
} as const;

export function gamesMetadata(lang: Locale, detail=false): Metadata {
 const item=detail?seo[lang].game:seo[lang].index; const path=detail?binaryRushPath:gamesPath;
 const hreflang: Record<Locale, string> = { it: "it-IT", en: "en-US", fr: "fr-FR", es: "es-ES" };
 const languages=Object.fromEntries((["it","en","fr","es"] as Locale[]).map(l=>[hreflang[l],`${SITE}${path(l)}`]));
 languages["x-default"] = `${SITE}${path("en")}`;
 const url=`${SITE}${path(lang)}`;
 return {title:item[0],description:item[1],alternates:{canonical:url,languages},openGraph:{title:item[0],description:item[1],url,siteName:"CertifyQuiz",locale:lang==="en"?"en_US":`${lang}_${lang.toUpperCase()}`,type:"website"},twitter:{card:"summary_large_image",title:item[0],description:item[1]}};
}

export function packetDefenderMetadata(lang:Locale):Metadata{const copy={it:["Packet Defender: gioco cybersecurity e firewall | CertifyQuiz","Proteggi un server in un gioco cybersecurity gratuito: analizza traffico, porte e contesto nel simulatore firewall."],en:["Packet Defender: cybersecurity firewall game | CertifyQuiz","Protect a server in a free cybersecurity game: inspect traffic, ports and context in this firewall training game."],fr:["Packet Defender : jeu cybersécurité et pare-feu | CertifyQuiz","Protégez un serveur dans un jeu cybersécurité gratuit en analysant trafic, ports et contexte."],es:["Packet Defender: juego de ciberseguridad y firewall | CertifyQuiz","Protege un servidor en un juego de ciberseguridad gratis analizando tráfico, puertos y contexto."]}as const;const[title,description]=copy[lang],url=`${SITE}${packetDefenderPath(lang)}`,codes:Record<Locale,string>={it:"it-IT",en:"en-US",fr:"fr-FR",es:"es-ES"};const languages=Object.fromEntries((Object.keys(codes)as Locale[]).map(l=>[codes[l],`${SITE}${packetDefenderPath(l)}`]));languages["x-default"]=`${SITE}${packetDefenderPath("en")}`;return{title,description,alternates:{canonical:url,languages},openGraph:{title,description,url,siteName:"CertifyQuiz",locale:lang==="en"?"en_US":`${lang}_${lang.toUpperCase()}`,type:"website"},twitter:{card:"summary_large_image",title,description}}}

export function portHunterMetadata(lang: Locale): Metadata {
 const copy={it:["Port Hunter: gioco sulle porte di rete | CertifyQuiz","Ripassa porte TCP e UDP, servizi e protocolli con un quiz di rete gratuito da 60 secondi."],en:["Port Hunter: network ports game | CertifyQuiz","Practice TCP and UDP ports, services and protocols with a free 60-second network port quiz."],fr:["Port Hunter : jeu sur les ports réseau | CertifyQuiz","Révisez les ports TCP et UDP, services et protocoles avec un jeu réseau gratuit de 60 secondes."],es:["Port Hunter: juego de puertos de red | CertifyQuiz","Repasa puertos TCP y UDP, servicios y protocolos con un juego de redes gratuito de 60 segundos."]} as const;
 const [title,description]=copy[lang],url=`${SITE}${portHunterPath(lang)}`,codes:Record<Locale,string>={it:"it-IT",en:"en-US",fr:"fr-FR",es:"es-ES"};
 const languages=Object.fromEntries((["it","en","fr","es"] as Locale[]).map(l=>[codes[l],`${SITE}${portHunterPath(l)}`]));languages["x-default"]=`${SITE}${portHunterPath("en")}`;
 return{title,description,alternates:{canonical:url,languages},openGraph:{title,description,url,siteName:"CertifyQuiz",locale:lang==="en"?"en_US":`${lang}_${lang.toUpperCase()}`,type:"website"},twitter:{card:"summary_large_image",title,description}};
}
