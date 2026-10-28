// Production-mode smoke for the EIPASS Standard "coming soon" release (read-only HTTP against a local `next start`).
// Expectation: ONLY /it/certificazioni/eipass-standard is public (200, index/follow, self canonical, no hreflang, no
// link to any module/quiz page). Every other Standard surface, in every language, is 404, and nothing in the public
// discovery surfaces mentions it except the one contextual link on the Italian EIPASS 7 Moduli User landing.
import assert from 'node:assert/strict';
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
  assert.ok(text.includes('Quiz di preparazione in arrivo'), 'coming-soon message');
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
  assert.deepEqual(mainHrefs.filter((h) => /\/quiz\/|\/ripass|\/scenari|mock-exam|\/ripasso/.test(h)), [], 'no quiz/review/scenario/mock link in the landing content');
  assert.deepEqual(mainHrefs.filter((h) => h.startsWith('/') || h.includes('certifyquiz.com')).sort(), ['/it/certificazioni/eipass'], 'the only internal link in the content is EIPASS 7 Moduli User');
  assert.doesNotMatch(html, /\/images\/certifications\/eipass\.png/, 'the EIPASS logo is not used');
  assert.ok(html.includes('/images/certifications/eipass-standard.svg') || html.includes('eipass-standard.svg'), 'original illustration');
  assert.doesNotMatch(visible(main), /Inizia il quiz|Avvia (il )?quiz|Simulazione d.esame|Premium|Materiale di studio/i, 'no quiz/premium/study-material CTA in the landing content (the site header has its own generic nav)');
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

// 3) discovery surfaces: nothing, except the single contextual link on the Italian User landing
for (const path of ['/', '/it', '/it/certificazioni', '/certifications', '/fr/certifications', '/es/certificaciones', '/robots.txt']) {
  const res = await get(path);
  assert.ok(res.status === 200 || (res.status >= 300 && res.status < 400), `${path}: ${res.status}`);
  const body = res.status === 200 ? await res.text() : '';
  assert.ok(!body.includes(SLUG), `${path}: must not mention ${SLUG}`);
  checked++;
}
{
  const it = await (await get('/it/certificazioni/eipass')).text();
  const text = visible(it);
  assert.ok(it.includes(`href="${LANDING}"`), 'the Italian EIPASS 7 Moduli User landing links to the Standard landing');
  assert.match(text, /In preparazione/);
  assert.match(text, /percorso distinto da EIPASS 7 Moduli User/);
  assert.match(it, /<meta name="robots" content="index, follow"|<meta name="robots" content="noindex/, 'User robots untouched (whatever it was)');
  checked++;
  for (const path of ['/certifications/eipass', '/fr/certifications/eipass', '/es/certificaciones/eipass']) {
    const res = await get(path);
    if (res.status === 200) assert.ok(!(await res.text()).includes(SLUG), `${path}: only the Italian landing carries the pointer`);
    checked++;
  }
}
console.log(`PASS ${checked} checks; only ${LANDING} is public (200, index/follow, self canonical, no hreflang, no module/quiz link); every other Standard URL is 404 in four languages; discovery surfaces clean; one contextual link on the Italian EIPASS 7 Moduli User landing`);
