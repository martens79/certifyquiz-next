import assert from 'node:assert/strict';
import fs from 'node:fs';
const base='http://127.0.0.1:3459';
const topics=JSON.parse(fs.readFileSync(new URL('../tests/fixtures/eipass-user/topics-before.json',import.meta.url),'utf8'));
const expected=[17,20,19,18,23,22,21];
const paths={it:'/it/certificazioni',en:'/certifications',fr:'/fr/certifications',es:'/es/certificaciones'};
const mixedDescriptions={it:'Il percorso comprende sette moduli',en:'The path has seven modules',fr:'Le parcours comporte sept modules',es:'El itinerario tiene siete módulos'};
let checked=0;
for(const [lang,root] of Object.entries(paths)){
  const landing=await fetch(`${base}${root}/eipass`);
  assert.equal(landing.status,200,`${lang} landing`);
  const html=await landing.text();
  assert.ok(html.includes('EIPASS 7 Moduli User'));
  assert.ok(html.includes(`rel="canonical" href="https://www.certifyquiz.com${root}/eipass"`));
  assert.ok(html.includes(`/${lang}/quiz/eipass`));
  for(const alternate of Object.values(paths)) assert.ok(html.includes(`href="https://www.certifyquiz.com${alternate}/eipass"`),`${lang}: alternate${alternate}`);
  checked++;
  for(const kind of ['mixed','mock-exam']){
    const response=await fetch(`${base}/${lang}/quiz/eipass/${kind}`);
    assert.equal(response.status,200,`${lang}/${kind}`);
    const body=await response.text();
    const visible=body.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ');
    assert.ok(body.includes(`rel="canonical" href="https://www.certifyquiz.com/${lang}/quiz/eipass/${kind}"`));
    assert.ok(body.includes('noindex, follow'));
    if(kind==='mixed'){
      assert.ok(visible.includes(mixedDescriptions[lang]));
      assert.doesNotMatch(visible,/official-like question count|nombre de questions proche de l.officiel|número de preguntas similar al oficial|numero domande realistico/);
    }
    checked++;
  }
  const quiz=await fetch(`${base}/${lang}/quiz/eipass`);
  assert.equal(quiz.status,200);
  const quizHtml=await quiz.text();
  let position=-1;
  for(const id of expected){
    const topic=topics.find(t=>t.id===id);
    const at=quizHtml.indexOf(`${root}/eipass/${topic[`slug_${lang}`]}`,position+1);
    assert.ok(at>position,`${lang}: module${id} order`);position=at;
  }
  assert.ok(!quizHtml.includes('Real exam simulation'));
  checked++;
  for(const row of topics){
    const url=`${root}/eipass/${row[`slug_${lang}`]}`;
    const response=await fetch(`${base}${url}`);
    assert.equal(response.status,200,url);
    const body=await response.text();
    assert.ok(body.includes('EIPASS 7 Moduli User'),url);
    assert.ok(body.includes(`rel="canonical" href="https://www.certifyquiz.com${url}"`),url);
    // Check visible paragraphs, not legitimate JSON-LD or Next's hydration payload.
    assert.ok(!/<p[^>]*>\s*\{(?:&quot;|")(?:it|en|fr|es)(?:&quot;|")\s*:/.test(body),url);
    assert.ok(!/href="[^"]*\/(?:ripasso|review|revision|repaso)"/.test(body),`${url}: no unverified review CTA`);
    checked++;
  }
}
const state=await (await fetch('http://127.0.0.1:8459/api/test-status')).json();
assert.equal(state.forbiddenWrites,0);
console.log(`PASS ${checked} SSR routes; four languages, preserved canonical paths, module order, no visible JSON or unverified review links; zero API writes`);
