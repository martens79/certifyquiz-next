import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';
import { clientModule } from './helpers/client-component';

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

const require = createRequire(import.meta.url);
const { renderToStaticMarkup } = require('react-dom/server');
const React = require('react');
const fakeDocument = { body: { style: { overflow: '' } } };
const mod = clientModule('../../src/components/quiz/VerifiedSources.tsx', {}, { document: fakeDocument });
const VerifiedSources = mod.default;
const { SourcesList, usableSources, visibleSources } = mod;

const B = { id: 1, level: 'B', kind: 'explanation', title: 'IP Version 6 Addressing Architecture', publisher: 'IETF', language: 'en', url: 'https://www.rfc-editor.org/rfc/rfc4291', locator: '§2.2', version: 'RFC 4291' };
const A = { id: 2, level: 'A', kind: 'background', title: 'Campus design', publisher: 'Cisco', language: 'en', url: 'https://www.cisco.com/c/en/us/x', locator: 'Cap. 3' };
// Contenuto del pannello (stessa lista che si vede dopo aver toccato il pulsante).
const html = (sources: unknown, lang = 'it') => {
  const list = visibleSources(sources);
  return list.length === 0 ? '' : renderToStaticMarkup(React.createElement(SourcesList, { list, lang }));
};
const closedHtml = (sources: unknown, lang = 'it', explanationGranted?: boolean) =>
  renderToStaticMarkup(React.createElement(VerifiedSources, { sources, lang, explanationGranted }));

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

const engine = readFileSync(new URL('../src/components/quiz/QuizEngine.tsx', import.meta.url), 'utf8');

test('QuizEngine: componente fratello del blocco spiegazione, fuori da exam/assessment, senza toccare il paywall', () => {
  assert.equal((engine.match(/<VerifiedSources\b/g) || []).length, 1);
  const i = engine.indexOf('<VerifiedSources');
  const before = engine.slice(0, i);
  // inserito DOPO la chiusura dell'IIFE della spiegazione, non dentro
  assert.ok(before.lastIndexOf('})()}') > before.lastIndexOf('const isLocked'));
  assert.match(engine.slice(i - 140, i), /!isTestLike && chosen != null && serverResult/);
  assert.match(engine.slice(i, i + 260), /sources=\{serverResult\.sources\}/);
  assert.match(engine.slice(i, i + 260), /explanationGranted=\{serverResult\.explanation_access\?\.granted\}/);
});

test('apiClient: sources opzionale in AnswerCheckResult, nessun altro campo cambiato', () => {
  const api = readFileSync(new URL('../src/lib/apiClient.ts', import.meta.url), 'utf8');
  assert.match(api, /sources\?: Array</);
});

// ---------------------------------------------------------------------------------------------
// Pulsante «Consulta le fonti» + pannello (bottom sheet / dialog)
// ---------------------------------------------------------------------------------------------
const BUTTON_LABEL: Record<string, string> = { it: 'Consulta le fonti', en: 'View sources', fr: 'Consulter les sources', es: 'Consultar las fuentes' };

test('chiuso: solo il pulsante, nessun URL, nessuna fonte, nessun dialog nel DOM', () => {
  for (const lang of ['it', 'en', 'fr', 'es']) {
    const out = closedHtml([B, A], lang);
    assert.ok(out.includes(BUTTON_LABEL[lang]), lang);
    assert.doesNotMatch(out, /href=|https:\/\/|<dialog|IETF|Cisco|quiz-sources/);
  }
});

test('nessuna fonte utilizzabile: non rende nulla (comportamento del quiz invariato)', () => {
  for (const s of [undefined, null, [], 'x', {}, 5, [{ ...B, url: 'http://x.it' }]]) assert.equal(closedHtml(s), '');
});

test('pulsante accessibile: area tattile >= 44px, aria-haspopup, aria-expanded, focus visibile', () => {
  const out = closedHtml([B]);
  assert.match(out, /type="button"/);
  assert.match(out, /min-h-\[44px\]/);
  assert.match(out, /aria-haspopup="dialog"/);
  assert.match(out, /aria-expanded="false"/);
  assert.match(out, /focus-visible:outline/);
});

test('explanation_access.granted === false: le fonti B non sono mai visibili, le A restano come da backend', () => {
  const onlyB = visibleSources([B], false);
  assert.equal(onlyB.length, 0);
  assert.equal(closedHtml([B], 'it', false), '', 'solo B + spiegazione bloccata: nemmeno il pulsante');
  const mixed = visibleSources([B, A], false);
  assert.deepEqual(Array.from(mixed, (s: any) => s.id), [2]);
  assert.match(closedHtml([B, A], 'it', false), /Consulta le fonti/);
  // granted true o non indicato: nessun filtro lato client
  assert.equal(visibleSources([B, A], true).length, 2);
  assert.equal(visibleSources([B, A], undefined).length, 2);
});

function nodeMock(el: { type: string }) {
  if (el.type === 'dialog') return dialogMock;
  if (el.type === 'button') return triggerMock;
  return null;
}
let dialogMock: any;
let triggerMock: any;
const find = (r: ReactTestRenderer, type: string) => r.root.findAll((n) => n.type === type);
const text = (r: ReactTestRenderer) => JSON.stringify(r.toJSON());

async function mount(sources: unknown, lang = 'it', explanationGranted?: boolean) {
  dialogMock = { open: false, showModal() { this.open = true; }, setAttribute() {} };
  triggerMock = { focusCalls: 0, focus() { this.focusCalls += 1; } };
  fakeDocument.body.style.overflow = 'auto';
  let r!: ReactTestRenderer;
  await act(async () => { r = create(React.createElement(VerifiedSources, { sources, lang, explanationGranted }), { createNodeMock: nodeMock }); });
  return r;
}

test('tocco sul pulsante: si apre il dialog modale con le due sezioni distinte, scroll pagina bloccato', async () => {
  const r = await mount([B, A], 'it');
  assert.equal(find(r, 'dialog').length, 0);
  await act(async () => { find(r, 'button')[0].props.onClick(); });
  const [dlg] = find(r, 'dialog');
  assert.ok(dlg, 'dialog montato');
  assert.equal(dialogMock.open, true, 'showModal() chiamato (focus trap, Escape e sfondo inerte nativi)');
  assert.equal(fakeDocument.body.style.overflow, 'hidden');
  assert.ok(dlg.props['aria-labelledby']);
  const out = text(r);
  assert.ok(out.indexOf('Fonte della spiegazione') < out.indexOf('Approfondimenti'));
  assert.match(out, /rfc4291/);
  assert.match(out, /Cisco/);
  assert.equal(find(r, 'button')[0].props['aria-expanded'], true);
  // bottom sheet su mobile, dialog compatto centrato da sm:
  assert.match(dlg.props.className, /bottom-0/);
  assert.match(dlg.props.className, /rounded-t-2xl/);
  assert.match(dlg.props.className, /max-h-\[85dvh\]/);
  assert.match(dlg.props.className, /sm:max-w-lg/);
  assert.match(dlg.props.className, /sm:m-auto/);
  assert.doesNotMatch(dlg.props.className, /\bw-\[\d+px\]/);
  await act(async () => r.unmount());
});

test('chiusura con Escape (evento close nativo): dialog rimosso, scroll ripristinato, focus al pulsante', async () => {
  const r = await mount([B], 'en');
  await act(async () => { find(r, 'button')[0].props.onClick(); });
  assert.equal(triggerMock.focusCalls, 0);
  await act(async () => { find(r, 'dialog')[0].props.onClose(); });
  assert.equal(find(r, 'dialog').length, 0);
  assert.equal(fakeDocument.body.style.overflow, 'auto');
  assert.equal(triggerMock.focusCalls, 1);
  assert.doesNotMatch(text(r), /rfc-editor/);
  await act(async () => r.unmount());
});

test('chiusura esplicita («Chiudi» localizzato, >= 44px) e click sullo sfondo, non sul contenuto', async () => {
  const CLOSE: Record<string, string> = { it: 'Chiudi', en: 'Close', fr: 'Fermer', es: 'Cerrar' };
  for (const lang of ['it', 'en', 'fr', 'es']) {
    const r = await mount([B, A], lang);
    await act(async () => { find(r, 'button')[0].props.onClick(); });
    const closeBtn = find(r, 'button').find((b) => text(r) && b.props.children === CLOSE[lang]);
    assert.ok(closeBtn, 'pulsante di chiusura ' + lang);
    assert.match(closeBtn!.props.className, /min-h-\[44px\]/);
    await act(async () => { closeBtn!.props.onClick(); });
    assert.equal(find(r, 'dialog').length, 0);
    assert.equal(triggerMock.focusCalls, 1);
    await act(async () => r.unmount());
  }
  const r = await mount([B]);
  await act(async () => { find(r, 'button')[0].props.onClick(); });
  const dlg = find(r, 'dialog')[0];
  const inner = {};
  await act(async () => { dlg.props.onClick({ target: inner, currentTarget: dlg }); });
  assert.equal(find(r, 'dialog').length, 1, 'click sul contenuto: resta aperto');
  await act(async () => { dlg.props.onClick({ target: dlg, currentTarget: dlg }); });
  assert.equal(find(r, 'dialog').length, 0, 'click sullo sfondo: chiude');
  await act(async () => r.unmount());
});

test('nel pannello i link restano HTTPS in nuova scheda e mostrano titolo, ente, versione, sezione, lingua', async () => {
  const r = await mount([B, A], 'it');
  await act(async () => { find(r, 'button')[0].props.onClick(); });
  const links = find(r, 'a');
  assert.equal(links.length, 2);
  for (const l of links) {
    assert.match(l.props.href, /^https:\/\//);
    assert.equal(l.props.target, '_blank');
    assert.equal(l.props.rel, 'noopener noreferrer');
  }
  const out = text(r);
  for (const piece of ['IP Version 6 Addressing Architecture', 'IETF', 'RFC 4291', '§2.2', 'Lingua del documento', 'EN']) assert.ok(out.includes(piece), piece);
  await act(async () => r.unmount());
});

test('con spiegazione FREE bloccata e solo fonti B: nessun pulsante, nessun URL nel DOM', async () => {
  const r = await mount([B], 'it', false);
  assert.equal(find(r, 'button').length, 0);
  assert.equal(text(r), 'null');
  await act(async () => r.unmount());
});

test('unmount con pannello aperto ripristina lo scroll della pagina', async () => {
  const r = await mount([B]);
  await act(async () => { find(r, 'button')[0].props.onClick(); });
  assert.equal(fakeDocument.body.style.overflow, 'hidden');
  await act(async () => r.unmount());
  assert.equal(fakeDocument.body.style.overflow, 'auto');
});

test('usableSources e SOURCES_COPY: quattro lingue complete per i nuovi testi', () => {
  for (const lang of ['it', 'en', 'fr', 'es']) {
    const c = mod.SOURCES_COPY[lang];
    for (const k of ['open', 'close', 'panelTitle']) assert.ok(c[k] && c[k].length > 2, lang + '.' + k);
    assert.equal(c.open, BUTTON_LABEL[lang]);
  }
  assert.equal(usableSources([B]).length, 1);
});
