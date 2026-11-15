// Production-mode smoke for the EIPASS Standard "coming soon" release (read-only HTTP against a local `next start`).
// Expectation: ONLY /it/certificazioni/eipass-standard is public (200, index/follow, self canonical, no hreflang). Every
// other Standard surface, in every language, is 404, and nothing in the public discovery surfaces mentions it except the
// one contextual link on the Italian EIPASS 7 Moduli User landing.
// Two states, both asserted for real and derived from the module registry (tests/helpers/eipass-standard-expectation.ts):
//   dormant -> every module "Prossimamente", no link to any quiz/topic page;
//   partial -> only the available modules link to /it/quiz/topic/<id>, all the others stay disabled, and the copy says
//              "esercitazione breve", never an official exam simulation.
// Run through tsx (it imports the TypeScript registry): node --import tsx scripts/verify-eipass-standard-coming-soon.mjs
import assert from 'node:assert/strict';
// tsx loads the .ts helper as CommonJS (the package is not "type": "module"), so its named exports sit on `default`.
const expectationModule = await import('../tests/helpers/eipass-standard-expectation.ts');
const { eipassStandardExpectation } = expectationModule.eipassStandardExpectation ? expectationModule : expectationModule.default;
const base = process.env.SMOKE_BASE || 'http://127.0.0.1:3460';
const SITE = 'https://www.certifyquiz.com';
const SLUG = 'eipass-standard';
const LANDING = `/it/certificazioni/${SLUG}`;
const OFFICIAL = 'https://it.eipass.com/certificazioni-informatiche/eipass-standard-digcomp/';
const modules = [
  "I fondamenti dell'ICT", 'Navigare e cercare informazioni sul Web', 'Comunicare e collaborare in Rete',
  'Sicurezza informatica', 'Creare documenti elettronici', 'Creare e gestire fogli di lavoro', 'Creare presentazioni multimediali',
];
const certRoot = { it: '/it/certificazioni', en: '/certifications', fr: '/fr/certifications', es: '/es/certificaciones' };
const EXP = eipassStandardExpectation();
console.log(`registry state: ${EXP.dormant ? 'dormant (no module available)' : `partial (available: ${EXP.availableHrefs.join(', ')}; disabled: ${EXP.disabledCount})`}`);
// Sanity of the expectation itself: seven modules, the available ones have a numeric topic link, nothing else does.
assert.equal(EXP.modules.length, 7);
assert.deepEqual(EXP.modules.filter((m) => m.href).map((m) => m.href), EXP.availableHrefs);
assert.ok(EXP.availableHrefs.every((h) => /^\/it\/quiz\/topic\/[1-9]\d*$/.test(h)), 'available modules link only to /it/quiz/topic/<id>');
let checked = 0;
const get = (path) => fetch(`${base}${path}`, { redirect: 'manual', signal: AbortSignal.timeout(30000) });
const decode = (html) => html.replace(/&#x27;|&#39;/g, "'").replace(/&amp;/g, '&').replace(/&quot;/g, '"');
const visible = (html) => decode(html.replace(/<script\b[\s\S]*?<\/script>/gi, '').replace(/<style\b[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));

// 1) the landing
{
  const res = await get(LANDING);
  assert.equal(res.status, 200, `landing must be 200, got ${res.status}`);
  const html = await res.text();
  const text = visible(html);
  assert.match(html, /<meta name="robots" content="index, follow"/, 'landing must be index, follow');
  assert.doesNotMatch(html, /name="robots" content="[^"]*noindex/, 'no noindex anywhere');
  assert.ok(html.includes(`<link rel="canonical" href="${SITE}${LANDING}"`), 'self-referencing canonical');
  assert.doesNotMatch(html, /rel="alternate" hreflang=|hrefLang=/i, 'no hreflang');
  assert.ok(text.includes(EXP.statusHeading), `status heading "${EXP.statusHeading}"`);
  for (const re of EXP.mustSay) assert.match(text, re, `landing says ${re}`);
  for (const re of EXP.mustNotSay) assert.doesNotMatch(text, re, `landing must not say ${re}`);
  assert.match(text, /DigComp 2\.2/);
  assert.match(text, /Differenze rispetto a EIPASS 7 Moduli User/);
  assert.match(text, /non rilascia la certificazione/);
  for (const title of modules) assert.ok(text.includes(title), `module "${title}" listed`);
  assert.ok(html.includes(`href="${OFFICIAL}"`), 'official EIPASS link');
  assert.ok(html.includes('href="/it/certificazioni/eipass"'), 'link to EIPASS 7 Moduli User');
  // no link to a module, quiz, review, scenario, mock or other Standard page
  const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  // Only CertifyQuiz URLs count: the official EIPASS link and the header's login redirect (?redirect=...) are not Standard pages.
  const standardHrefs = hrefs.filter((h) => (h.startsWith('/') || h.startsWith(SITE)) && h.split('?')[0].includes(SLUG) && h !== `${SITE}${LANDING}`);
  assert.deepEqual(standardHrefs, [], 'no link to any other Standard URL');
  // The site header/footer legitimately link to the generic reviews/scenarios sections: only the landing CONTENT is checked.
  const main = (html.match(/<main[\s\S]*?<\/main>/i) || [''])[0];
  assert.ok(main.length > 500, 'landing content found');
  const mainHrefs = [...main.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(mainHrefs.filter((h) => /\/quiz\/|\/ripass|\/scenari|mock-exam|\/ripasso/.test(h)).sort(), [...EXP.availableHrefs].sort(), 'the only quiz link in the landing content is one /it/quiz/topic/<id> per available module (none when dormant); no review/scenario/mock link');
  assert.deepEqual(mainHrefs.filter((h) => h.startsWith('/') || h.includes('certifyquiz.com')).sort(), ['/it/certificazioni/eipass', ...EXP.availableHrefs].sort(), 'internal links in the content: EIPASS 7 Moduli User + the available modules');
  // module list: one <li data-module> per module; available <-> link, not available <-> disabled button without link
  for (const m of EXP.modules) {
    const li = (main.match(new RegExp(`<li[^>]*data-module="${m.number}"[\\s\\S]*?</li>`)) || [''])[0];
    assert.ok(li.length > 50, `module ${m.number} item found`);
    if (m.available) {
      assert.ok(li.includes(`href="${m.href}"`), `module ${m.number} links to ${m.href}`);
      assert.ok(!/<button/.test(li) && !/Prossimamente/.test(li), `module ${m.number} is not disabled`);
    } else {
      assert.ok(!/<a\b/.test(li) && /<button[^>]*disabled/.test(li) && /Prossimamente/.test(li), `module ${m.number} is a disabled "Prossimamente" without link`);
    }
  }
  assert.equal((main.match(/<button[^>]*disabled/g) || []).length, EXP.disabledCount, 'disabled buttons = modules not available');
  for (const re of EXP.neverSay) assert.doesNotMatch(visible(main), re, `landing never says ${re}`);
  assert.doesNotMatch(html, /\/images\/certifications\/eipass\.png/, 'the EIPASS logo is not used');
  assert.ok(html.includes('/images/certifications/eipass-standard.svg') || html.includes('eipass-standard.svg'), 'original illustration');
  assert.doesNotMatch(visible(main), /Inizia il quiz|Avvia (il )?quiz|Premium|Materiale di studio/i, 'no generic quiz/premium/study-material CTA in the landing content (the site header has its own generic nav)');
  assert.doesNotMatch(main, /<form\b|type="email"/i, 'no form, no email capture in the landing content (the site chrome has its own newsletter)');
  assert.ok(!/EIPASS Standard.{0,40}(è|e') disponibile/i.test(text), 'never declares the preparation available');
  checked++;
}

// 2) 404 everywhere else, in every language
for (const [lang, root] of Object.entries(certRoot)) {
  const paths = [
    ...(lang === 'it' ? [] : [`${root}/${SLUG}`]),
    ...[1, 2, 3, 4, 5, 6, 7].map((n) => `${root}/${SLUG}/modulo-${n}`),
    `${root}/${SLUG}/ripasso`, `${root}/${SLUG}/modulo-1/ripasso`, `${root}/${SLUG}/modulo-1/review`, `${root}/${SLUG}/scenari`, `${root}/${SLUG}/scenarios`, `${root}/${SLUG}/escenarios`,
    `/${lang}/quiz/${SLUG}`, `/${lang}/quiz/${SLUG}/mixed`, `/${lang}/quiz/${SLUG}/mock-exam`,
  ];
  for (const path of paths) {
    const res = await get(path);
    assert.equal(res.status, 404, `${path} must be 404, got ${res.status}`);
    const body = await res.text();
    assert.doesNotMatch(visible(body), /EIPASS Standard|in arrivo/, `${path}: no Standard copy on the 404`);
    checked++;
  }
}
for (const path of [`/it/ripassi/${SLUG}`, `/reviews/${SLUG}`, `/fr/revisions/${SLUG}`, `/es/repasos/${SLUG}`, `/it/hub/${SLUG}`, `/hub/${SLUG}`]) {
  const res = await get(path);
  assert.equal(res.status, 404, `${path} must be 404, got ${res.status}`);
  checked++;
}

// 3) discovery surfaces: nothing, except the Italian catalogue (one card to the landing) and the single contextual link on the Italian User landing
for (const path of ['/', '/it', '/certifications', '/fr/certifications', '/es/certificaciones', '/robots.txt']) {
  const res = await get(path);
  assert.ok(res.status === 200 || (res.status >= 300 && res.status < 400), `${path}: ${res.status}`);
  const body = res.status === 200 ? await res.text() : '';
  assert.ok(!body.includes(SLUG), `${path}: must not mention ${SLUG}`);
  checked++;
}
{
  const res = await get('/it/certificazioni');
  assert.equal(res.status, 200, '/it/certificazioni');
  const body = await res.text();
  const cardHrefs = [...body.matchAll(/href="([^"]*eipass-standard[^"]*)"/g)].map((m) => m[1]);
  assert.ok(cardHrefs.length >= 1 && cardHrefs.every((h) => h === LANDING), `the Italian catalogue links only to the landing, got ${JSON.stringify(cardHrefs)}`);
  assert.ok(visible(body).includes('EIPASS Standard'), 'catalogue card title');
  const card = (body.match(/<a[^>]*href="\/it\/certificazioni\/eipass-standard"[\s\S]*?<\/a>/) || [''])[0];
  assert.ok(card.length > 100, 'catalogue card found');
  assert.ok(visible(card).includes(EXP.cataloguePill), `the catalogue card says "${EXP.cataloguePill}"`);
  if (!EXP.dormant) assert.doesNotMatch(visible(card), /Prossimamente|in arrivo/i, 'a partial catalogue card no longer says it is all coming soon');
  assert.doesNotMatch(visible(card), /simulazione|garantit/i, 'the catalogue card promises no exam simulation or guarantee');
  assert.doesNotMatch(visible(card), /prova gratis|gratis|gratuit/i, 'the catalogue card promises nothing free or available');
  assert.doesNotMatch(body, /\/quiz\/eipass-standard|eipass-standard\/modulo/, 'no quiz or module link from the catalogue');
  assert.ok(!/href="\/it\/quiz\/topic\/\d+"/.test(card), 'the catalogue card links only to the landing');
  checked++;
}
{
  const it = await (await get('/it/certificazioni/eipass')).text();
  const text = visible(it);
  assert.ok(it.includes(`href="${LANDING}"`), 'the Italian EIPASS 7 Moduli User landing links to the Standard landing');
  assert.ok(text.includes(EXP.userPointerLabel), `User landing pointer says "${EXP.userPointerLabel}"`);
  assert.match(text, /percorso distinto da EIPASS 7 Moduli User/);
  if (EXP.dormant) assert.match(text, /disponibile solo la pagina informativa/); else assert.match(text, /esercitazione breve per il Modulo/);
  assert.doesNotMatch(text, /garantit[oi]|supererai/, 'the User pointer promises nothing');
  assert.match(it, /<meta name="robots" content="index, follow"|<meta name="robots" content="noindex/, 'User robots untouched (whatever it was)');
  checked++;
  for (const path of ['/certifications/eipass', '/fr/certifications/eipass', '/es/certificaciones/eipass']) {
    const res = await get(path);
    if (res.status === 200) assert.ok(!(await res.text()).includes(SLUG), `${path}: only the Italian landing carries the pointer`);
    checked++;
  }
}
console.log(`PASS ${checked} checks (${EXP.dormant ? 'dormant' : 'partial'} state); only ${LANDING} is public (200, index/follow, self canonical, no hreflang; ${EXP.availableCount} module link(s)); every other Standard URL is 404 in four languages; discovery surfaces clean; one contextual link on the Italian EIPASS 7 Moduli User landing`);
