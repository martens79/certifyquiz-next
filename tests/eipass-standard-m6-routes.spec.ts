import {test,expect,type Page} from '@playwright/test';

// Module 6 (Excel, topic 574): Italian has 50 questions, EN/FR/ES have none (pool 0). Direct URL access in the four languages must show
// the questions in Italian and the "coming soon" box (no empty question, no Italian fallback) in the other three.
// Every external request is blocked and the backend is a browser-side mock that mirrors the real contract:
//   GET /question-pool/topics/:id?lang=  -> { poolTotal }   (it: 50, en/fr/es: 0, because the 50 questions have no translation)
//   GET /questions/:id?lang=..&strict=.. -> { questions }    (strict en/fr/es: every question without text in that language is dropped)
const TOPIC=574;
const LANDING='/it/certificazioni/eipass-standard';
const QUESTIONS=Array.from({length:50},(_,i)=>({id:29372+i,question:`Domanda di prova ${i+1} su Excel?`,answers:['A','B','C','D'].map((t,k)=>({id:121791+4*i+k,answer_text:`Risposta ${t} ${i+1}`,display_order:k+1})),topic_id:TOPIC}));
const BOX:Record<string,RegExp>={en:/Coming soon/,fr:/Bientôt disponible/,es:/Próximamente/};

async function mock(page:Page,seen:string[]){
  await page.addInitScript(()=>{localStorage.setItem('cq_cookie_consent',JSON.stringify({accepted:false}));localStorage.setItem('lang_banner_dismissed','1');});
  await page.route('**/*',async r=>{
    const url=new URL(r.request().url());
    if(url.hostname!=='127.0.0.1'&&url.hostname!=='localhost'){await r.abort();return;}
    const p=url.pathname;
    if(!p.startsWith('/api/backend/')){await r.continue();return;}
    seen.push(r.request().method()+' '+p+url.search);
    const lang=url.searchParams.get('lang')||'it';
    if(p===`/api/backend/question-pool/topics/${TOPIC}`){await r.fulfill({json:{poolTotal:lang==='it'?50:0}});return;}
    if(p===`/api/backend/topics/meta/by-topic/${TOPIC}`){await r.fulfill({json:{topic:{id:TOPIC,certification_id:79,title_it:'Creare e gestire fogli di lavoro',title_en:'',title_fr:'',title_es:''},certification:{id:79,name:'EIPASS Standard',name_it:'EIPASS Standard',name_en:'EIPASS Standard',name_fr:'EIPASS Standard',name_es:'EIPASS Standard'}}});return;}
    if(p===`/api/backend/questions/${TOPIC}`){await r.fulfill({json:{poolTotal:lang==='it'?50:0,questions:lang==='it'?QUESTIONS.slice(0,15):[]}});return;}
    await r.fulfill({status:404,json:{error:'NOT_FOUND'}});
  });
}

test('landing: module 6 is a link to /it/quiz/topic/574 and nothing is "Prossimamente" any more',async({page})=>{
  await mock(page,[]);
  const res=await page.goto(LANDING); expect(res?.status()).toBe(200);
  await page.waitForLoadState('networkidle');
  const main=page.locator('main');
  const hrefs=await main.locator('a').evaluateAll(as=>as.map(a=>(a as HTMLAnchorElement).getAttribute('href')||''));
  expect(hrefs.filter(h=>/\/quiz\//.test(h)).sort()).toEqual([569,570,571,572,573,574,575].map(n=>`/it/quiz/topic/${n}`));
  const text=await main.innerText();
  expect(text).not.toMatch(/Prossimamente|Esercitazione non ancora disponibile|Gli altri moduli sono in preparazione|Quiz di preparazione in arrivo/);
  expect(text).toMatch(/tutti e sette i moduli/);
  const li=main.locator('li[data-module="6"]');
  await expect(li).toContainText('Creare e gestire fogli di lavoro');
  expect(await li.locator('a').getAttribute('href')).toBe(`/it/quiz/topic/${TOPIC}`);
  expect(await li.locator('button').count()).toBe(0);
});

test('/it/quiz/topic/574: the Italian quiz loads its questions, no "coming soon" box',async({page})=>{
  const seen:string[]=[]; await mock(page,seen);
  const res=await page.goto(`/it/quiz/topic/${TOPIC}`); expect(res?.status()).toBe(200);
  await expect(page.getByText(/Domanda di prova \d+ su Excel\?/).first()).toBeVisible();
  const text=await page.locator('body').innerText();
  expect(text).not.toMatch(/Contenuto in arrivo|Coming soon|non è ancora disponibile|non disponibile/);
  expect(seen.some(s=>s.startsWith(`GET /api/backend/question-pool/topics/${TOPIC}?lang=it`))).toBe(true);
  expect(seen.filter(s=>s.includes(`/questions/${TOPIC}`)).every(s=>!/strict=1/.test(s)),'the Italian request is not strict').toBe(true);
});

for(const lang of ['en','fr','es']){
  test(`/${lang}/quiz/topic/574: direct access shows "coming soon", never an empty question, never the Italian questions`,async({page})=>{
    const seen:string[]=[]; await mock(page,seen);
    const res=await page.goto(`/${lang}/quiz/topic/${TOPIC}`); expect(res?.status()).toBe(200);
    await expect(page.getByText(BOX[lang]).first()).toBeVisible();
    await page.waitForLoadState('networkidle');
    const text=await page.locator('body').innerText();
    expect(text).not.toMatch(/Domanda di prova|Risposta A|Excel\?/);
    expect(await page.locator('[role="radio"],input[type="radio"],button:has-text("Risposta")').count()).toBe(0);
    expect(seen.some(s=>s.startsWith(`GET /api/backend/question-pool/topics/${TOPIC}?lang=${lang}`))).toBe(true);
    // any question request that reaches the backend is strict (the backend drops the untranslated questions, no fallback to Italian)
    expect(seen.filter(s=>s.includes(`/questions/${TOPIC}`)).every(s=>/strict=1/.test(s))).toBe(true);
    // the page offers no link into an Italian-only topic page of the Standard certification
    const hrefs=await page.locator('main a, body a').evaluateAll(as=>as.map(a=>(a as HTMLAnchorElement).getAttribute('href')||''));
    expect(hrefs.filter(h=>/^\/it\/quiz\/topic\//.test(h))).toEqual([]);
  });
}

test('the Standard certification pages stay Italian-only: /{en,fr,es} landing and quiz slug routes answer 404',async({request})=>{
  for(const lang of ['en','fr','es']){
    for(const path of [`/${lang}/quiz/eipass-standard`,`/${lang}/certifications/eipass-standard`,`/${lang}/certificazioni/eipass-standard`]){
      const r=await request.get(path,{maxRedirects:0}); expect([404,308,301,307,302],`${path} -> ${r.status()}`).toContain(r.status());
      if(r.status()===200) throw new Error(`${path} must not be 200`);
    }
  }
});
