// Regression di compatibilità, non un test runtime: se questo file smette di
// compilare, un cambiamento a review-module-types.ts ha rotto la forma del
// JSON REALE già live in produzione per CCST Networking topic 229 (structure_it,
// sql_pending/ccst-networking-229-review-structure-seed.sql nel repo backend,
// pre-riscrittura Review Structure v1). Vedi Review Structure v1 §"Traduzioni"
// e la nota su topicId/certificationId opzionali: questo file è la prova che
// tenerli required avrebbe rotto il pilota.
import type { ReviewModuleStructure } from "../review-module-types";

const pilot229Structure: ReviewModuleStructure = {
  version: 1,
  sections: [
    {
      id: "intro",
      type: "intro",
      title: "Introduzione all'indirizzamento IP",
      body: "Ogni dispositivo su una rete IP ha bisogno di un indirizzo univoco...",
    },
    {
      id: "ipv4-struttura",
      type: "lesson",
      title: "IPv4 e struttura dell'indirizzo",
      body: "Un indirizzo IPv4 e' composto da 32 bit...\n\n**Indirizzo IPv4**: identificatore a 32 bit.",
    },
    {
      id: "caso-pratico",
      type: "practice",
      title: "Caso pratico",
      body: "Un tecnico deve configurare 4 dispositivi in una piccola rete...",
      microQuiz: { topicId: 229 },
    },
    {
      id: "assessment",
      type: "assessment",
      title: "Valutazione",
      topicId: 229,
      certificationId: 33,
      questionLimit: 10,
    },
    {
      id: "summary",
      type: "summary",
      title: "Riepilogo del modulo",
      keyPoints: ["La struttura di un indirizzo IPv4", "Cosa fa una subnet mask"],
      commonMistakes: ["Confondere indirizzo di rete e indirizzo di broadcast."],
      keyTerms: [{ term: "Subnet mask", definition: "Separa parte di rete e parte di host" }],
    },
  ],
};

// Forma v1 target (Review Structure v1 §2.4): "concept"/"comparison" al posto
// di "lesson", nessun topicId/certificationId tecnico nel JSON, derivati dal
// contesto pagina. Se questo blocco smette di compilare, la compatibilità in
// avanti (non solo quella con il pilota sopra) si è rotta.
const v1Structure: ReviewModuleStructure = {
  version: 1,
  sections: [
    { id: "intro", type: "intro", title: "Introduzione", body: "..." },
    { id: "subnet-mask", type: "concept", title: "Subnet mask", body: "...", microQuiz: {} },
    {
      id: "tcp-vs-udp",
      type: "comparison",
      title: "TCP e UDP",
      leftLabel: "TCP",
      rightLabel: "UDP",
      rows: [{ aspect: "Affidabilità", left: "Conferma la consegna", right: "Nessuna conferma" }],
    },
    { id: "assessment", type: "assessment", title: "Valutazione", questionLimit: 10 },
    { id: "summary", type: "summary", title: "Riepilogo", keyPoints: ["..."] },
  ],
};

export default pilot229Structure;
export { v1Structure };
