// Production-mode isolation smoke for the planned EIPASS Standard (read-only HTTP against a local `next start`).
// Expectation: every Standard surface is 404 in every language, and nothing in the public discovery
// surfaces mentions it. The EIPASS 7 Moduli User contract is covered by verify-eipass-editorial-ssr.mjs.
import assert from 'node:assert/strict';
const base = process.env.SMOKE_BASE || 'http://127.0.0.1:3460';
const SLUG = 'eipass-standard';
const modules = [
  'modulo-1-fondamenti-ict', 'modulo-2-navigare-cercare-informazioni-web', 'modulo-3-comunicare-collaborare-rete',
  'modulo-4-sicurezza-informatica', 'modulo-5-creare-documenti-elettronici', 'modulo-6-creare-gestire-fogli-di-lavoro',
  'modulo-7-creare-presentazioni-multimediali',
];
const certRoot = { it: '/it/certificazioni', en: '/certifications', fr: '/fr/certifications', es: '/es/certificaciones' };
let checked = 0;
const get = (path) => fetch(`${base}${path}`, { redirect: 'manual', signal: AbortSignal.timeout(30000) });
for (const [lang, root] of Object.entries(certRoot)) {
  const paths = [`${root}/${SLUG}`, ...modules.map((m) => `${root}/${SLUG}/${m}`), `/${lang}/quiz/${SLUG}`, `/${lang}/quiz/${SLUG}/mixed`, `/${lang}/quiz/${SLUG}/mock-exam`];
  for (const path of paths) {
    const res = await get(path);
    assert.equal(res.status, 404, `${path} must be 404, got ${res.status}`);
    const body = await res.text();
    assert.doesNotMatch(body, /EIPASS Standard/, `${path}: no Standard copy on the 404`);
    assert.doesNotMatch(body, /dati dimostrativi/i, `${path}: no demo banner`);
    checked++;
  }
}
for (const path of ['/', '/it', '/it/certificazioni', '/certifications', '/fr/certifications', '/es/certificaciones', '/robots.txt']) {
  const res = await get(path);
  assert.ok(res.status === 200 || (res.status >= 300 && res.status < 400), `${path}: ${res.status}`);
  const body = res.status === 200 ? await res.text() : '';
  assert.ok(!body.includes(SLUG), `${path}: must not mention ${SLUG}`);
  assert.ok(!body.includes('EIPASS Standard'), `${path}: must not mention EIPASS Standard`);
  checked++;
}
console.log(`PASS ${checked} requests; EIPASS Standard is 404 in four languages (landing, 7 topics, 3 quiz routes) and absent from lists, home and robots (sitemap needs the real backend inventory: covered by the unit contract)`);
