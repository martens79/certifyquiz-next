import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import React, { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import InteractiveLabDetail from "../src/features/labs/InteractiveLabDetail";
import { LabAuthPrompt, LabStepEvidence } from "../src/features/labs/GuidedCertificationLab";
import { labSlugs, type LabSlug } from "../src/features/labs/lab-config";
import type { GuidedLabStep } from "../src/features/labs/types";

// I componenti dei lab usano il runtime JSX automatico di Next e non importano React:
// sotto tsx (jsx: "preserve") serve il globale, altrimenti "React is not defined".
(globalThis as { React?: typeof React }).React = React;

const CEH_SLUGS = [
  "ceh-recon-service-enumeration",
  "ceh-web-evidence-analysis",
  "ceh-privilege-escalation-reasoning",
  "ceh-authorized-assessment-scope-reporting",
];

// Fixture CEH NON persistente: evidenze sintetiche su TEST-NET-3 / example.test.
const NMAP = [
  "$ sudo nmap -sS -sU -sV -p T:22,T:80,T:443,U:161 203.0.113.10",
  "Starting Nmap 7.94 ( https://nmap.org ) at 2026-09-21 10:02 UTC",
  "Nmap scan report for web01.example.test (203.0.113.10)",
  "",
  "PORT    STATE         SERVICE  VERSION",
  "22/tcp  open          ssh      OpenSSH 8.4p1 Debian 5+deb11u3 (protocol 2.0)",
  "80/tcp  open          http     nginx 1.22.1",
  "443/tcp filtered      https",
  "161/udp open|filtered snmp",
].join("\n");
const HTTP = [
  "GET /api/orders/10442 HTTP/1.1",
  "Host: shop.example.test",
  "Cookie: sid=REDACTED",
  "",
  "HTTP/1.1 200 OK",
  "Content-Type: application/json",
  "",
  '{"id":10442,"owner":"t1"}',
].join("\n");

const step = (overrides: Partial<GuidedLabStep> = {}): GuidedLabStep => ({
  id: "s1", title: "Read the scan", instruction: "Which statement is supported?", type: "single",
  options: [{ id: "a", label: "A" }, { id: "b", label: "B" }], ...overrides,
});

const evidenceHtml = (evidence: unknown) => renderToStaticMarkup(createElement(LabStepEvidence, { evidence }));

/* ----------------------------- routing / configuration ----------------------------- */

test("labSlugs contains exactly the four approved CEH lab slugs, no invented ones", () => {
  const ceh = labSlugs.filter((slug) => slug.startsWith("ceh-"));
  assert.deepEqual([...ceh].sort(), [...CEH_SLUGS].sort());
});

test("labSlugs stays unique and keeps every existing guided lab (CCST Networking 10, CCST Cybersecurity 9, CCNA 18)", () => {
  assert.equal(new Set(labSlugs).size, labSlugs.length, "no duplicate slugs");
  const count = (prefix: string) => labSlugs.filter((slug) => slug.startsWith(prefix)).length;
  assert.equal(count("ccst-networking-"), 10);
  assert.equal(count("ccst-cybersecurity-"), 9);
  assert.equal(count("ccna-"), 18);
  assert.equal(count("ceh-"), 4);
});

test("InteractiveLabDetail routes every ceh-* slug to the guided engine (it used to render nothing)", () => {
  for (const slug of CEH_SLUGS) {
    const html = renderToStaticMarkup(createElement(InteractiveLabDetail, { lang: "it", lab: slug as LabSlug }));
    assert.match(html, /Caricamento laboratorio/, `${slug} must reach GuidedCertificationLab`);
  }
});

test("InteractiveLabDetail keeps routing CCST Networking, CCST Cybersecurity and CCNA to the guided engine", () => {
  for (const slug of ["ccst-networking-ip-configuration", "ccst-cybersecurity-classify-the-incident", "ccna-static-routing"]) {
    const html = renderToStaticMarkup(createElement(InteractiveLabDetail, { lang: "en", lab: slug as LabSlug }));
    assert.match(html, /Loading lab/, slug);
  }
});

test("InteractiveLabDetail does not send legacy static labs to the guided engine", () => {
  const html = renderToStaticMarkup(createElement(InteractiveLabDetail, { lang: "en", lab: "spreadsheets" }));
  assert.doesNotMatch(html, /Loading lab/);
});

/* ------------------------------- evidence rendering -------------------------------- */

test("LabStepEvidence renders multiline Nmap output verbatim in a monospace, whitespace-preserving pre", () => {
  const html = evidenceHtml([{ title: "Nmap scan", kind: "cli", content: NMAP }]);
  assert.match(html, /<figure /);
  assert.match(html, /<figcaption[^>]*>Nmap scan<\/figcaption>/);
  assert.ok(html.includes(NMAP), "content must appear verbatim (newlines, blank line, column alignment)");
  assert.match(html, /<pre [^>]*font-mono/);
  assert.match(html, /<pre [^>]*whitespace-pre[ "]/);
  assert.match(html, /<pre [^>]*overflow-x-auto/);
});

test("LabStepEvidence renders HTTP request/response and any number of blocks, in order", () => {
  const html = evidenceHtml([
    { title: "Request/response", kind: "http", content: HTTP },
    { title: "Second block", content: "second" },
  ]);
  assert.equal((html.match(/<figure /g) ?? []).length, 2);
  // React scapa i doppi apici del JSON come &quot;: e' l'unica differenza col testo originale.
  assert.ok(html.includes(HTTP.replace(/"/g, "&quot;")));
  assert.ok(html.indexOf("Request/response") < html.indexOf("Second block"));
  assert.match(html, /data-lab-evidence/);
});

test("LabStepEvidence accepts a free-form kind string (not limited to the quiz exhibit kinds)", () => {
  assert.ok(evidenceHtml([{ kind: "scanner-report", content: "x" }]).includes(">x<"));
});

test("LabStepEvidence renders nothing when evidence is missing or malformed (existing labs unchanged)", () => {
  for (const evidence of [undefined, null, [], "text", 42, {}, [{}], [null], [{ title: "T" }], [{ content: "" }], [{ content: "   " }], [{ content: 7 }]]) {
    assert.equal(evidenceHtml(evidence), "", JSON.stringify(evidence));
  }
});

test("LabStepEvidence ignores malformed items but keeps the valid ones", () => {
  const html = evidenceHtml([{ content: "" }, { title: "Good", content: "ok" }, null]);
  assert.equal((html.match(/<figure /g) ?? []).length, 1);
  assert.match(html, /Good/);
});

test("LabStepEvidence escapes HTML in evidence: nothing from the lab content becomes markup", () => {
  const html = evidenceHtml([{ title: "<b>t</b>", content: '<script>alert(1)</script><img src=x onerror=alert(1)>' }]);
  assert.doesNotMatch(html, /<script>/);
  assert.doesNotMatch(html, /<img /);
  assert.doesNotMatch(html, /<b>t<\/b>/);
  assert.match(html, /&lt;script&gt;/);
});

test("GuidedLabStep.evidence is optional: a step without it type-checks and renders no evidence", () => {
  const plain = step();
  assert.equal(plain.evidence, undefined);
  assert.equal(evidenceHtml(plain.evidence), "");
  const withEvidence = step({ evidence: [{ content: NMAP }] });
  assert.ok(evidenceHtml(withEvidence.evidence).includes(NMAP));
});

/* --------------------------------- anonymous UX ---------------------------------- */

test("LabAuthPrompt shows a login/register CTA with a safe redirect back to the lab, in all four languages", () => {
  const cases = [
    { lang: "it", target: "%2Fit%2Finteractive-labs%2Fceh-recon-service-enumeration", title: "Accedi per verificare le risposte" },
    { lang: "en", target: "%2Finteractive-labs%2Fceh-recon-service-enumeration", title: "Sign in to check your answers" },
    { lang: "fr", target: "%2Ffr%2Finteractive-labs%2Fceh-recon-service-enumeration", title: "Connectez-vous pour vérifier vos réponses" },
    { lang: "es", target: "%2Fes%2Finteractive-labs%2Fceh-recon-service-enumeration", title: "Inicia sesión para verificar tus respuestas" },
  ] as const;
  for (const { lang, target, title } of cases) {
    const html = renderToStaticMarkup(createElement(LabAuthPrompt, { lang, slug: "ceh-recon-service-enumeration" }));
    assert.match(html, /role="alert"/, lang);
    assert.ok(html.includes(title), `${lang} title`);
    assert.ok(html.includes(`href="/${lang}/login?redirect=${target}"`), `${lang} login link`);
    assert.ok(html.includes(`href="/${lang}/register?redirect=${target}"`), `${lang} register link`);
    assert.doesNotMatch(html, /temporaneamente|temporarily|indisponible|disponible temporalmente/i, `${lang} must not look like the generic error`);
  }
});

/* ----------------------------- guard rails on the source ---------------------------- */

const source = readFileSync(path.join(__dirname, "..", "src/features/labs/GuidedCertificationLab.tsx"), "utf8");

test("GuidedCertificationLab never uses dangerouslySetInnerHTML", () => {
  assert.doesNotMatch(source, /dangerouslySetInnerHTML/);
});

test("final explanation preserves line breaks (whitespace-pre-line)", () => {
  assert.match(source, /<p className="[^"]*whitespace-pre-line[^"]*">\{result\.solution\.explanation\}<\/p>/);
});

test("401 is handled on attempts, check and complete; other failures still show the generic error", () => {
  assert.equal((source.match(/if\(r\.status===401\)throw new AuthRequiredError\(\)/g) ?? []).length, 3);
  assert.equal((source.match(/if\(e instanceof AuthRequiredError\)setAuthRequired\(true\);else setFatal\(true\)/g) ?? []).length, 2);
  assert.match(source, /catch\{if\(active\)setFatal\(true\);\}/, "loading errors keep the generic fatal state");
});
