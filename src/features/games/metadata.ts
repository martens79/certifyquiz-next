import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { binaryRushPath, gamesPath } from "@/lib/paths";

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
