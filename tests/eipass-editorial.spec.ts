import {test,expect,type Page} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {EIPASS_USER_COPY,EIPASS_USER_MODULES} from '../src/lib/eipass-user-release';
const topics=JSON.parse(readFileSync('tests/fixtures/eipass-user/topics-before.json','utf8'));
const origin='http://127.0.0.1:3459';
const roots={it:'/it/certificazioni',en:'/certifications',fr:'/fr/certifications',es:'/es/certificaciones'};
const badCopy=/official-like question count|nombre de questions proche de l.officiel|número de preguntas similar al oficial|numero domande realistico/;
type Role='anonymous'|'free'|'premium';

// Browser transport fixtures only. No accounts, credentials, writes or payments
// outside this disposable browser context; every external request is blocked.
async function fixture(page:Page,loginRole:Role='anonymous'){
  let user: null|{id:number;username:string;email:string;role:string;premium:boolean}=null;
  const counters={logins:0,checks:0,external:0,payments:0};
  const token='synthetic-eipass-access';
  const question=(id:number)=>({id,topic_id:17,certification_id:3,question:`Fixture EIPASS question ${id}`,question_type:'standard',answers:[1,2,3,4].map(n=>({id:id*10+n,text:`Fixture answer ${n}`}))});
  await page.addInitScript(()=>{localStorage.setItem('cq_cookie_consent',JSON.stringify({accepted:false}));localStorage.setItem('lang_banner_dismissed','1');});
  await page.route('**/*',async r=>{
    const url=new URL(r.request().url());
    if(url.origin!==origin){counters.external++;await r.abort();return;}
    if(!url.pathname.startsWith('/api/backend/')){await r.continue();return;}
    const p=url.pathname.slice('/api/backend'.length);
    const reply=(body:unknown,status=200)=>r.fulfill({status,json:body});
    if(/checkout|payment|stripe/.test(p)){counters.payments++;return reply({error:'NO_PAYMENTS_IN_TEST'},403);}
    if(p==='/auth/login'){
      counters.logins++;user={id:990165,username:`fixture-${loginRole}`,email:'eipass@example.test',role:'user',premium:loginRole==='premium'};
      return reply({ok:true,token,user});
    }
    if(p==='/auth/me')return user?reply({user}):reply({error:'UNAUTHORIZED'},401);
    if(p==='/auth/refresh')return user?reply({ok:true,token,user}):reply({error:'NO_REFRESH'},401);
    if(p==='/auth/logout'){user=null;return reply({ok:true});}
    if(p.includes('/certifications/by-slug/'))return reply({id:3,slug:'eipass',name:'EIPASS',questionCountByLang:{it:1248,en:993,fr:31,es:105}});
    if(p.startsWith('/question-pool/'))return reply({poolTotal:142});
    if(p.startsWith('/topics/meta/'))return reply({topic:topics.find((t:{id:number})=>t.id===17),certification:{id:3,name:'EIPASS'}});
    if(p==='/topics/3')return reply(topics);
    if(p.startsWith('/questions/')||p.startsWith('/questions-mixed/'))return reply({poolTotal:142,questions:[question(990001),question(990002)]});
    if(p.startsWith('/mock-exam/questions/'))return reply({poolTotal:142,purpose:'mock_exam',spec:{questions:2,served:2,durationSec:3600},questions:[question(990003),question(990004)]});
    if(p==='/answers/check'){
      counters.checks++;const body=r.request().postDataJSON();const id=Number(body.question_id);const correct=Number(body.answer_id)===id*10+1;
      const granted=loginRole!=='free'||correct;
      return reply({question_id:id,correct,correct_answer_id:id*10+1,explanation:granted?`Fixture explanation ${id}`:null,explanation_access:{granted,reason:granted?'unlimited':'quota_exhausted',unlimited:!!user?.premium,remaining:granted?null:0,consumed:false,limit:10}});
    }
    if(p.startsWith('/me/explanation-status'))return reply({unlimited:!!user?.premium,remaining:loginRole==='free'?0:10,limit:10,postGate:{hardLocked:false,used:0,limit:5}});
    if(p.startsWith('/me/quiz-progress/'))return reply({row:null});
    if(p.startsWith('/packages/offers/'))return reply({offers:[],premium:!!user?.premium,darkLaunch:false});
    if(p==='/push/inbox')return reply({items:[],unread:0});
    return reply({});
  });
  return counters;
}

async function noOverflow(page:Page){expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);}
async function readyQuestion(page:Page){await expect(page.getByText(/Fixture EIPASS question \d+/, {exact:true})).toBeVisible();}

for(const lang of ['it','en','fr','es'] as const){
  const root=roots[lang];
  test(`${lang}: landing, seven topic links, available quiz actions and catalogue navigation`,async({page},info)=>{
    const counters=await fixture(page);
    await page.goto(`${root}/eipass`);
    await expect(page.getByRole('heading',{level:1,name:'EIPASS 7 Moduli User',exact:true})).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href',`https://www.certifyquiz.com${root}/eipass`);
    await noOverflow(page);await page.screenshot({path:info.outputPath(`${lang}-landing.png`),fullPage:true});
    for(const mod of EIPASS_USER_MODULES){
      const row=topics.find((t:{id:number})=>t.id===mod.id);
      const path=`${root}/eipass/${row[`slug_${lang}`]}`;
      await page.locator(`a[href="${path}"]`).first().click();
      await expect(page.getByRole('heading',{level:1,name:mod.title[lang],exact:true})).toBeVisible();
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href',`https://www.certifyquiz.com${path}`);
      await expect(page.locator('a[href$="/ripasso"], a[href$="/review"], a[href$="/revision"], a[href$="/repaso"]')).toHaveCount(0);
      expect(await page.locator('body').innerText()).not.toMatch(/\{\s*"(?:it|en|fr|es)"\s*:/);
      const inventory=JSON.parse(readFileSync(`tests/fixtures/eipass-user/page-${mod.id}-before.json`,'utf8')).questionCountByLang[lang];
      const quizAction=page.locator(`a[href$="/quiz/topic/${mod.id}"]`);
      if(inventory>0)await expect(quizAction.first()).toBeVisible();else await expect(quizAction).toHaveCount(0);
      await noOverflow(page);
      if(mod.id===17)await page.screenshot({path:info.outputPath(`${lang}-topic17.png`),fullPage:true});
      await page.goBack();
      await expect(page.getByRole('heading',{level:1,name:'EIPASS 7 Moduli User',exact:true})).toBeVisible();
    }
    await page.locator(`a[href="/${lang}/quiz/eipass"]`).first().click();
    await expect(page).toHaveURL(`${origin}/${lang}/quiz/eipass`);
    const paths=await page.locator('main a').evaluateAll(as=>as.map(a=>a.getAttribute('href')).filter((h):h is string=>!!h));
    const ordered=paths.filter(h=>h.startsWith(`${root}/eipass/`));
    expect(ordered).toEqual(EIPASS_USER_MODULES.map(m=>`${root}/eipass/${topics.find((t:{id:number})=>t.id===m.id)[`slug_${lang}`]}`));
    await noOverflow(page);expect(counters.payments).toBe(0);
  });
  test(`${lang}: anonymous topic quiz, explanation, mixed practice and timed practice`,async({page},info)=>{
    const counters=await fixture(page);
    await page.goto(`/${lang}/quiz/topic/17`);await readyQuestion(page);
    await page.getByRole('button',{name:'Fixture answer 2',exact:true}).click();
    await expect(page.getByText(/Fixture explanation \d+/)).toBeVisible();expect(counters.checks).toBe(1);
    await page.goto(`/${lang}/quiz/eipass/mixed`);await readyQuestion(page);
    await expect(page.getByText(EIPASS_USER_COPY.mixedDescription[lang],{exact:true})).toBeVisible();
    expect(await page.locator('body').innerText()).not.toMatch(badCopy);await noOverflow(page);
    await page.screenshot({path:info.outputPath(`${lang}-mixed.png`),fullPage:true});
    await page.goto(`/${lang}/quiz/eipass/mock-exam`);await readyQuestion(page);
    await expect(page.getByRole('heading',{level:1})).toContainText(EIPASS_USER_COPY.practiceTitle[lang]);
    await expect(page.getByText(EIPASS_USER_COPY.practiceNotice[lang],{exact:true}).first()).toBeVisible();
    await noOverflow(page);await page.screenshot({path:info.outputPath(`${lang}-timed.png`),fullPage:true});
    expect(counters.logins).toBe(0);expect(counters.payments).toBe(0);
  });
  for(const role of ['free','premium'] as const){
    test(`${lang}: synthetic ${role} login returns to quiz and respects explanation access`,async({page})=>{
      const counters=await fixture(page,role);const target=`/${lang}/quiz/eipass/mixed`;
      await page.goto(`/${lang}/login?redirect=${encodeURIComponent(target)}`);
      const loginForm=page.locator('form').filter({has:page.locator('input[type="password"]')});
      await loginForm.locator('#email').fill('eipass@example.test');
      await loginForm.locator('#password').fill('synthetic-not-a-real-password');
      await loginForm.locator('button[type="submit"]').click();
      await expect(page).toHaveURL(`${origin}${target}`);await readyQuestion(page);expect(counters.logins).toBe(1);
      await page.getByRole('button',{name:'Fixture answer 2',exact:true}).click();
      if(role==='premium')await expect(page.getByText(/Fixture explanation \d+/)).toBeVisible();
      else {await expect(page.getByText(/Fixture explanation \d+/)).toHaveCount(0);const gate={it:'Hai esaurito le 10 spiegazioni gratuite.',en:"You've used all 10 free explanations.",fr:'Vous avez épuisé vos 10 explications gratuites.',es:'Has agotado tus 10 explicaciones gratuitas.'};await expect(page.getByText(gate[lang],{exact:true})).toBeVisible();}
      expect(counters.checks).toBe(1);expect(counters.payments).toBe(0);
    });
  }
}
