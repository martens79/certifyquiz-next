import {test,expect} from '@playwright/test';
for(const width of [360,390,1280]){
 test(`weekly pricing at ${width}px: selection, disclosure, auth and consent`,async({page})=>{
  await page.setViewportSize({width,height:900});
  const outbound:string[]=[];const billing:string[]=[];
  await page.route('**/*',async route=>{
   const url=new URL(route.request().url());
   if(url.hostname!=='127.0.0.1'){outbound.push(url.hostname);return route.abort();}
   if(url.pathname.startsWith('/api/')){
    if(url.pathname.includes('/billing/'))billing.push(url.pathname);
    return route.fulfill({status:401,contentType:'application/json',body:'{}'});
   }
   return route.continue();
  });
  await page.goto('/it/prezzi');
  const reject=page.getByRole('button',{name:/rifiuta|reject|necessari|necessary/i});
  if(await reject.count())await reject.first().click();
  const weekly=page.getByRole('button',{name:/Settimanale/}).first();
  await expect(weekly).toBeVisible();await weekly.click();await expect(weekly).toHaveAttribute('aria-pressed','true');
  await expect(page.getByText(/Un solo trial gratuito di 3 giorni/).first()).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
  const monthly=page.getByRole('button',{name:/Mensile/}).first();await monthly.click();
  await expect(page.getByText(/Poi 9,99€ al mese/).first()).toBeVisible();
  await weekly.click();await page.getByRole('button',{name:'Accedi o registrati per continuare'}).first().click();
  await expect(page).toHaveURL(/login/);expect(decodeURIComponent(page.url())).toContain('premium_weekly');
  expect(billing).toEqual([]);expect(outbound.filter(h=>/google-analytics|analytics.google|facebook/.test(h))).toEqual([]);
 });
}
