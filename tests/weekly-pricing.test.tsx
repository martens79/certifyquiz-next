import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {clientComponent} from './helpers/client-component';
import {buildResumePath, normalizePlan} from '../src/lib/checkout-intent';
const noop=()=>null;
const mocks:Record<string,unknown>={
 'next/navigation':{usePathname:()=>'/it/prezzi'},
 '@/components/analytics/ConsentProvider':{useConsent:()=>({status:'denied'})},
 '@/lib/checkout-analytics':{},'@/lib/auth':{},
 '@/components/auth/AuthProvider':{useAuth:()=>({user:null,loading:false,isPremiumUser:false})},
 '@/lib/metaPixel':{},'@/lib/analytics':{},'@/lib/post-gate-tracking':{},'@/lib/commercial-origin':{},
 '@/lib/checkout-intent':{},'./PackagesUpsell':noop,
 '@/hooks/useTwa':{useTwa:()=>false},'@/lib/billing-recovery':{},
 '@/components/billing/AlreadyPremiumNotice':noop,
 '@/components/billing/PaymentRecoveryNotice':noop,
 '@/lib/twa':{},'@/components/twa/TwaNotice':noop,
};
test('weekly survives authentication redirect',()=>{
 assert.equal(normalizePlan('premium_weekly'),'premium_weekly');
 assert.match(buildResumePath('/it/prezzi','', 'premium_weekly')!,/plan=premium_weekly/);
});
test('weekly is hidden by default and visible in all four locales only when enabled',()=>{
 for(const enabled of ['0','1']){
  const C=clientComponent('../../src/app/(marketing)/pricing/PremiumComingSoonView.tsx',mocks,{process:{env:{NEXT_PUBLIC_PREMIUM_WEEKLY_ENABLED:enabled}}});
  for(const lang of ['it','en','fr','es']){
   const html=renderToStaticMarkup(React.createElement(C as React.ComponentType<{forceLang:string}>,{forceLang:lang}));
   assert.equal(/3[,.]99/.test(html),enabled==='1');
   assert.match(html,/9[,.]99/);assert.match(html,/59[,.]90/);
   assert.match(html,/3 (giorni|days|días|jours)/);
   assert.doesNotMatch(html,/7gg|7 days free|7 días gratis|7 jours gratuits/);
   assert.doesNotMatch(html,/59,90€ addebitati oggi|59.90 was charged/);
   if(enabled==='1')assert.match(html,/sm:grid-cols-3/);
  }
 }
});
