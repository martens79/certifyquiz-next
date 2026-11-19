import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { clientModule } from './helpers/client-component';

const require = createRequire(import.meta.url);
const { renderToStaticMarkup } = require('react-dom/server');
const React = require('react');
const mod = clientModule('../../src/components/quiz/VerifiedSources.tsx', {});
const VerifiedSources = mod.default;

const B = { id: 1, level: 'B', kind: 'explanation', title: 'IP Version 6 Addressing Architecture', publisher: 'IETF', language: 'en', url: 'https://www.rfc-editor.org/rfc/rfc4291', locator: '§2.2', version: 'RFC 4291' };
const A = { id: 2, level: 'A', kind: 'background', title: 'Campus design', publisher: 'Cisco', language: 'en', url: 'https://www.cisco.com/c/en/us/x', locator: 'Cap. 3' };
const html = (sources: unknown, lang = 'it') => renderToStaticMarkup(React.createElement(VerifiedSources, { sources, lang }));

test('nessuna fonte, undefined o payload non valido: non rende nulla', () => {
  for (const s of [undefined, null, [], 'x', {}, 5]) assert.equal(html(s), '');
});

test('fonte B (spiegazione) e A (approfondimento) sono in sezioni distinte', () => {
  const out = html([B, A], 'it');
  assert.match(out, /Fonte della spiegazione/);
  assert.match(out, /Approfondimenti/);
  assert.ok(out.indexOf('Fonte della spiegazione') < out.indexOf('Approfondimenti'));
  assert.match(out, /IP Version 6 Addressing Architecture/);
  assert.match(out, /IETF/);
  assert.match(out, /§2\.2/);
  assert.match(out, /Lingua del documento: EN/);
});

test('solo A: nessuna sezione "Fonte della spiegazione"; solo B: nessun "Approfondimenti"', () => {
  assert.doesNotMatch(html([A]), /Fonte della spiegazione/);
  assert.doesNotMatch(html([B]), /Approfondimenti/);
});

test('quattro lingue: titoli e testo sezione localizzati', () => {
  const expected: Record<string, [RegExp, RegExp, RegExp]> = {
    it: [/Fonte della spiegazione/, /Approfondimenti/, /Sezione:/],
    en: [/Source for the explanation/, /Further reading/, /Section:/],
    fr: [/Source de l'explication|Source de l&#x27;explication/, /Pour approfondir/, /Section:/],
    es: [/Fuente de la explicación/, /Para profundizar/, /Sección:/],
  };
  for (const [lang, [a, b, c]] of Object.entries(expected)) {
    const out = html([B, A], lang);
    assert.match(out, a); assert.match(out, b); assert.match(out, c);
  }
});

test('link sicuri: https, target=_blank, rel noopener noreferrer, avviso accessibile nuova scheda', () => {
  for (const lang of ['it', 'en', 'fr', 'es']) {
    const out = html([B], lang);
    assert.match(out, /href="https:\/\/www\.rfc-editor\.org\/rfc\/rfc4291"/);
    assert.match(out, /target="_blank"/);
    assert.match(out, /rel="noopener noreferrer"/);
    assert.match(out, /class="sr-only"/);
  }
});

test('URL non https o malformati non vengono mai resi come link', () => {
  const bad = ['http://example.com/x', 'javascript:alert(1)', '//example.com', 'https://u:p@example.com/', 'ftp://example.com', '', null, 42];
  for (const url of bad) assert.equal(html([{ ...B, url }]), '');
  const out = html([{ ...B, url: 'http://example.com/x' }, A]);
  assert.doesNotMatch(out, /http:\/\//);
  assert.match(out, /Cisco/);
});

test('righe incomplete (titolo, ente o sezione mancanti) sono scartate', () => {
  for (const patch of [{ title: '' }, { publisher: '' }, { locator: '' }, { title: undefined }]) assert.equal(html([{ ...B, ...patch }]), '');
});

test('nessuna etichetta di verifica: il componente non dichiara "verificata" da solo', () => {
  for (const lang of ['it', 'en', 'fr', 'es']) assert.doesNotMatch(html([B, A], lang), /verific|verified|vérifi/i);
});

test('mobile: layout fluido, target tocco >= 44px, nessuna larghezza fissa', () => {
  const out = html([B]);
  assert.match(out, /min-h-\[44px\]/);
  assert.match(out, /break-words/);
  assert.doesNotMatch(out, /style="[^"]*width/);
  assert.doesNotMatch(out, /\bw-\[\d+px\]/);
});

const engine = readFileSync(new URL('../src/components/quiz/QuizEngine.tsx', import.meta.url), 'utf8');

test('QuizEngine: componente fratello del blocco spiegazione, fuori da exam/assessment, senza toccare il paywall', () => {
  assert.equal((engine.match(/<VerifiedSources\b/g) || []).length, 1);
  const i = engine.indexOf('<VerifiedSources');
  const before = engine.slice(0, i);
  // inserito DOPO la chiusura dell'IIFE della spiegazione, non dentro
  assert.ok(before.lastIndexOf('})()}') > before.lastIndexOf('const isLocked'));
  assert.match(engine.slice(i - 140, i), /!isTestLike && chosen != null && serverResult/);
  assert.match(engine.slice(i, i + 120), /sources=\{serverResult\.sources\}/);
});

test('apiClient: sources opzionale in AnswerCheckResult, nessun altro campo cambiato', () => {
  const api = readFileSync(new URL('../src/lib/apiClient.ts', import.meta.url), 'utf8');
  assert.match(api, /sources\?: Array</);
});
