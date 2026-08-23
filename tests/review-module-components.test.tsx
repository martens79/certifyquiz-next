import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import ReviewModuleProgressHeader from "../src/components/reviews/module/ReviewModuleProgressHeader";
import ReviewModuleNav from "../src/components/reviews/module/ReviewModuleNav";
import type { ReviewModuleSection, ReviewModuleSectionOutline } from "../src/lib/review-module-types";

const SECTIONS: ReviewModuleSection[] = [
  { id: "intro", type: "intro", title: "Introduzione all'indirizzamento IP", body: "..." },
  { id: "ipv4-struttura", type: "lesson", title: "IPv4 e struttura dell'indirizzo", body: "..." },
  { id: "subnet-mask", type: "lesson", title: "Subnet mask", body: "..." },
  { id: "assessment", type: "assessment", title: "Valutazione", topicId: 229, certificationId: 33, questionLimit: 10 },
  { id: "summary", type: "summary", title: "Riepilogo del modulo" },
];

test("ReviewModuleProgressHeader shows the X di Y counter and a matching percent bar", () => {
  const html = renderToStaticMarkup(createElement(ReviewModuleProgressHeader, { lang: "it", completed: 3, total: 9 }));
  assert.match(html, /3 di 9 sezioni completate/);
  assert.match(html, /33%/);
  assert.match(html, /width:33%/);
  assert.match(html, /role="progressbar"/);
  assert.match(html, /aria-valuenow="33"/);
});

test("ReviewModuleProgressHeader never divides by zero for an empty module", () => {
  const html = renderToStaticMarkup(createElement(ReviewModuleProgressHeader, { lang: "it", completed: 0, total: 0 }));
  assert.match(html, /0 di 0 sezioni completate/);
  assert.match(html, /width:0%/);
});

test("ReviewModuleNav renders every section as a real <button>, in order, with a stable status beyond color alone", () => {
  const html = renderToStaticMarkup(
    createElement(ReviewModuleNav, {
      lang: "it",
      sections: SECTIONS,
      activeId: "subnet-mask",
      completedIds: new Set(["intro", "ipv4-struttura"]),
      onSelect: () => {},
    })
  );

  // Ogni voce è un vero <button>, mai un div cliccabile (requisito accessibilità FASE 11).
  const buttonCount = (html.match(/<button/g) ?? []).length;
  assert.equal(buttonCount, SECTIONS.length);

  // Ordine preservato.
  const introIndex = html.indexOf("Introduzione all&#x27;indirizzamento IP");
  const summaryIndex = html.indexOf("Riepilogo del modulo");
  assert.ok(introIndex >= 0 && summaryIndex > introIndex);

  // Stato completato non affidato solo al colore: c'è testo screen-reader dedicato.
  assert.match(html, /completata/);
  assert.match(html, /in corso/);
  assert.match(html, /da iniziare/);

  // La sezione attiva è marcata semanticamente, non solo via classe CSS.
  assert.match(html, /aria-current="step"/);
});

test("ReviewModuleNav renders a locked outline (no body leaked) the same way it renders a full section", () => {
  const outline: ReviewModuleSectionOutline[] = SECTIONS.map(({ id, type, title }) => ({ id, type, title }));
  const html = renderToStaticMarkup(
    createElement(ReviewModuleNav, {
      lang: "it",
      sections: outline,
      activeId: "intro",
      completedIds: new Set(),
      onSelect: () => {},
    })
  );
  assert.match(html, /IPv4 e struttura dell&#x27;indirizzo/);
  assert.equal((html.match(/<button/g) ?? []).length, outline.length);
});
