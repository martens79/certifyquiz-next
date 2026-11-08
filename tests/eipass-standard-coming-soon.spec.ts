import {test,expect,type Page} from '@playwright/test';
import {eipassStandardExpectation} from './helpers/eipass-standard-expectation';

// Browser checks of the hydrated landing (what an SSR smoke cannot see: client-rendered blocks, click events).
// Every external request is blocked; analytics is a stub that records calls, so nothing leaves the browser.
// The expected state (dormant: all "Prossimamente"; partial: only the available modules are links, the others stay
// disabled) is derived from the module registry; see tests/helpers/eipass-standard-expectation.ts.
const EXP=eipassStandardExpectation();
const LANDING='/it/certificazioni/eipass-standard';
const OFFICIAL='https://it.eipass.com/certificazioni-informatiche/eipass-standard-digcomp/';
const MODULES=["I fondamenti dell'ICT",'Navigare e cercare informazioni sul Web','Comunicare e collaborare in Rete','Sicurezza informatica','Creare documenti elettronici','Creare e gestire fogli di lavoro','Creare presentazioni multimediali'];

async function prepare(page:Page,consent:boolean){
  await page.addInitScript((accepted)=>{
    localStorage.setItem('cq_cookie_consent',JSON.stringify({accepted}));localStorage.setItem('lang_banner_dismissed','1');
    (window as unknown as {__ga:unknown[][]}).__ga=[];
    (window as unknown as {gtag:(...a:unknown[])=>void}).gtag=(...a:unknown[])=>{(window as unknown as {__ga:unknown[][]}).__ga.push(a);};
  },consent);
  await page.route('**/*',async r=>{
    const url=new URL(r.request().url());
    if(url.hostname!=='127.0.0.1'&&url.hostname!=='localhost'){await r.abort();return;}
    if(url.pathname.startsWith('/api/backend/')){await r.fulfill({status:404,json:{error:'NOT_FOUND'}});return;}
    await r.continue();
  });
}

test('hydrated landing: status message, 7 modules, no Premium/package CTA, module links only for available modules',async({page})=>{
  await prepare(page,false);
  const res=await page.goto(LANDING);
  expect(res?.status()).toBe(200);
  await expect(page.getByRole('heading',{name:EXP.statusHeading})).toBeVisible();
  await page.waitForLoadState('networkidle');
  const main=page.locator('main');
  const text=await main.innerText();
  for(const m of MODULES) expect(text).toContain(m);
  expect(text).not.toMatch(/Passa a Premium|Preparazione completa|Inizia il quiz|Avvia (il )?quiz|Materiale di studio|Acquista|€/i);
  for(const re of EXP.mustSay) expect(text,String(re)).toMatch(re);
  for(const re of EXP.mustNotSay) expect(text,String(re)).not.toMatch(re);
  for(const re of EXP.neverSay) expect(text,String(re)).not.toMatch(re);
  const hrefs=await main.locator('a').evaluateAll(as=>as.map(a=>(a as HTMLAnchorElement).getAttribute('href')||''));
  expect(hrefs.filter(h=>/eipass-standard\//.test(h)||/\/ripass|\/scenari|mock-exam|\/premium|\/prezzi|checkout/i.test(h))).toEqual([]);
  expect(hrefs.filter(h=>/\/quiz\//.test(h)).sort(),'quiz links = one topic link per available module (none when dormant)').toEqual([...EXP.availableHrefs].sort());
  expect(hrefs).toContain(OFFICIAL);
  expect(hrefs).toContain('/it/certificazioni/eipass');
  // the layout holds on a phone: no horizontal scroll
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  expect(await page.title()).toMatch(/EIPASS Standard/);
  expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toBe('https://www.certifyquiz.com'+LANDING);
  expect(await page.locator('meta[name="robots"]').getAttribute('content')).toBe('index, follow');
  expect(await page.locator('link[rel="alternate"][hreflang]').count()).toBe(0);
});

test('seven modules: available ones link to their topic, every other one is "Prossimamente" with a disabled button that starts nothing',async({page})=>{
  await prepare(page,true);
  const requests:string[]=[];
  page.on('request',r=>{const u=new URL(r.url());if(u.pathname.startsWith('/api/backend/')||/\/quiz\/|attempt|session/i.test(u.pathname))requests.push(r.method()+' '+u.pathname);});
  await page.goto(LANDING);
  await page.waitForLoadState('networkidle');
  const before=requests.length;
  const items=page.locator('li[data-module]');
  await expect(items).toHaveCount(7);
  for(let i=0;i<7;i++){
    const li=items.nth(i);
    const m=EXP.modules[i];
    await expect(li).toContainText(MODULES[i]);
    if(m.available){
      await expect(li.getByText('Disponibile',{exact:true})).toBeVisible();
      await expect(li.getByText('Prossimamente',{exact:true})).toHaveCount(0);
      await expect(li.getByRole('button')).toHaveCount(0);
      const link=li.getByRole('link',{name:"Inizia l'esercitazione breve"});
      await expect(link).toHaveAttribute('href',m.href as string);
      continue;
    }
    await expect(li.getByText('Prossimamente',{exact:true})).toBeVisible();
    await expect(li.getByRole('link')).toHaveCount(0);
    const btn=li.getByRole('button',{name:'Esercitazione non ancora disponibile'});
    await expect(btn).toBeDisabled();
    await expect(btn).toHaveAttribute('aria-disabled','true');
    await btn.dispatchEvent('click'); // dispatched on the element itself: a coordinate click on a phone could hit an overlay
  }
  await expect(page).toHaveURL(new RegExp(LANDING+'$'));
  expect(requests.slice(before),'clicking a disabled button sends nothing').toEqual([]);
  expect(await page.locator('main li[data-module] a').count()).toBe(EXP.availableCount);
  expect(await page.locator('main li[data-module] button[disabled]').count()).toBe(EXP.disabledCount);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test('the Italian catalogue lists EIPASS Standard once and it opens the landing; other languages do not list it',async({page,request})=>{
  await prepare(page,true);
  await page.goto('/it/certificazioni');
  const card=page.locator('a[href="'+LANDING+'"]');
  await expect(card.first()).toBeVisible();
  expect(await card.count()).toBeGreaterThanOrEqual(1);
  const cardText=await card.first().innerText(); // read before navigating away
  expect(cardText,'catalogue card pill').toContain(EXP.cataloguePill);
  expect(cardText).not.toMatch(/simulazione|garantit/i);
  await card.first().click();
  await expect(page).toHaveURL(new RegExp(LANDING+'$'));
  await expect(page.getByRole('heading',{name:EXP.statusHeading})).toBeVisible();
  for(const p of ['/certifications','/fr/certifications','/es/certificaciones','/it']){
    expect(await (await request.get(p)).text(),p).not.toContain('eipass-standard');
  }
});

test('no consent: clicking the links sends no analytics event',async({page})=>{
  await prepare(page,false);
  await page.goto(LANDING);
  await page.getByRole('link',{name:'Pagina ufficiale di EIPASS Standard'}).click({noWaitAfter:true}).catch(()=>{});
  const ga=await page.evaluate(()=>(window as unknown as {__ga:unknown[][]}).__ga).catch(()=>[]);
  expect(JSON.stringify(ga)).not.toContain('eipass_standard_link_click');
});

test('consent granted: the official link and the User link emit eipass_standard_link_click (no personal data)',async({page,context})=>{
  await prepare(page,true);
  await page.goto(LANDING);
  const popup=context.waitForEvent('page',{timeout:5000}).catch(()=>null);
  await page.getByRole('link',{name:'Pagina ufficiale di EIPASS Standard'}).click();
  (await popup)?.close().catch(()=>{});
  const events=await page.evaluate(()=>(window as unknown as {__ga:unknown[][]}).__ga.filter(a=>a[0]==='event'&&a[1]==='eipass_standard_link_click'));
  expect(events.length).toBe(1);
  const params=events[0][2] as Record<string,unknown>;
  expect(params.link_target).toBe('official_eipass_standard');
  expect(params.source_page).toBe('eipass_standard_coming_soon');
  expect(JSON.stringify(params)).not.toMatch(/@|email|token|password/i);
});

test('the Italian EIPASS 7 Moduli User landing carries the "In preparazione" pointer and it works',async({page})=>{
  await prepare(page,true);
  await page.goto('/it/certificazioni/eipass');
  const pointer=page.getByRole('link',{name:'EIPASS Standard (DigComp 2.2)'});
  await expect(pointer).toBeVisible();
  await expect(page.getByText(EXP.userPointerLabel,{exact:true})).toBeVisible();
  await pointer.click();
  await expect(page).toHaveURL(new RegExp(LANDING+'$'));
  await expect(page.getByRole('heading',{name:EXP.statusHeading})).toBeVisible();
});

test('every other Standard URL is a real 404 (status code, not a soft page)',async({request})=>{
  for(const p of ['/certifications/eipass-standard','/fr/certifications/eipass-standard','/es/certificaciones/eipass-standard',
    LANDING+'/modulo-1',LANDING+'/modulo-1/ripasso',LANDING+'/scenari','/it/quiz/eipass-standard','/en/quiz/eipass-standard/mock-exam','/it/ripassi/eipass-standard']){
    expect((await request.get(p,{maxRedirects:0})).status(),p).toBe(404);
  }
});
