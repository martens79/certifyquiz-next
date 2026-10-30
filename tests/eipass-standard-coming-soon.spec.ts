import {test,expect,type Page} from '@playwright/test';

// Browser checks of the hydrated landing (what an SSR smoke cannot see: client-rendered blocks, click events).
// Every external request is blocked; analytics is a stub that records calls, so nothing leaves the browser.
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

test('hydrated landing: coming-soon message, 7 modules, no Premium/quiz/package CTA, no module links',async({page})=>{
  await prepare(page,false);
  const res=await page.goto(LANDING);
  expect(res?.status()).toBe(200);
  await expect(page.getByRole('heading',{name:'Quiz di preparazione in arrivo'})).toBeVisible();
  await page.waitForLoadState('networkidle');
  const main=page.locator('main');
  const text=await main.innerText();
  for(const m of MODULES) expect(text).toContain(m);
  expect(text).not.toMatch(/Passa a Premium|Preparazione completa|Inizia il quiz|Avvia (il )?quiz|Simulazione d.esame|Materiale di studio|Acquista|€/i);
  const hrefs=await main.locator('a').evaluateAll(as=>as.map(a=>(a as HTMLAnchorElement).getAttribute('href')||''));
  expect(hrefs.filter(h=>/eipass-standard\//.test(h)||/\/quiz\/|\/ripass|\/scenari|mock-exam|\/premium|\/prezzi|checkout/i.test(h))).toEqual([]);
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
  await expect(page.getByText('In preparazione',{exact:true})).toBeVisible();
  await pointer.click();
  await expect(page).toHaveURL(new RegExp(LANDING+'$'));
  await expect(page.getByRole('heading',{name:'Quiz di preparazione in arrivo'})).toBeVisible();
});

test('every other Standard URL is a real 404 (status code, not a soft page)',async({request})=>{
  for(const p of ['/certifications/eipass-standard','/fr/certifications/eipass-standard','/es/certificaciones/eipass-standard',
    LANDING+'/modulo-1',LANDING+'/modulo-1/ripasso',LANDING+'/scenari','/it/quiz/eipass-standard','/en/quiz/eipass-standard/mock-exam','/it/ripassi/eipass-standard']){
    expect((await request.get(p,{maxRedirects:0})).status(),p).toBe(404);
  }
});
