import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {clientComponent,clientModule} from './helpers/client-component';
const noop=()=>null;
const mocks:Record<string,unknown>={
 'next/navigation':{usePathname:()=>'/it/prezzi'},'@/components/analytics/ConsentProvider':{useConsent:()=>({status:'denied'})},
 '@/lib/checkout-analytics':{},'@/lib/auth':{},'@/components/auth/AuthProvider':{useAuth:()=>({user:null,loading:false,isPremiumUser:false})},
 '@/lib/metaPixel':{},'@/lib/analytics':{},'@/lib/post-gate-tracking':{},'@/lib/commercial-origin':{},'@/lib/checkout-intent':{},'./PackagesUpsell':noop,
 '@/hooks/useTwa':{useTwa:()=>false},'@/lib/billing-recovery':{},'@/components/billing/AlreadyPremiumNotice':noop,
 '@/components/billing/PaymentRecoveryNotice':noop,'@/components/billing/PlanChangePanel':noop,'@/lib/twa':{},'@/components/twa/TwaNotice':noop,
};
test('quarterly flag, exact price, three month interval, immediate payment (no trial) in four languages',()=>{
 for(const flag of ['0','1']){const C=clientComponent('../../src/app/(marketing)/pricing/PremiumComingSoonView.tsx',mocks,{process:{env:{NEXT_PUBLIC_PREMIUM_WEEKLY_ENABLED:'1',NEXT_PUBLIC_PREMIUM_QUARTERLY_ENABLED:flag}}});for(const lang of ['it','en','fr','es']){const html=renderToStaticMarkup(React.createElement(C,{forceLang:lang}));assert.equal(/19[,.]90/.test(html),flag==='1');assert.match(html,/3 (giorni|days|días|jours)/);if(flag==='1'){assert.match(html,{it:/19,90€ addebitati subito/,en:/19.90 charged today/,fr:/19,90€ débités aujourd’hui/,es:/19,90€ cobrados hoy/}[lang as 'it'|'en'|'fr'|'es']);assert.match(html,/3 (mesi|months|mois|meses)/);assert.match(html,/xl:grid-cols-4/);}assert.match(html,/59[,.]90/);assert.match(html,/9[,.]99/);assert.match(html,/3[,.]99/);assert.doesNotMatch(html,/23[,.]90/);}}
});
test('analytics plan values match definitive quarterly price and preserve other plans',()=>{
 const mod=clientModule('../../src/lib/metaPixel.ts',{'./consent-mode':{marketingConsentGranted:()=>false}});
 for(const [plan,value] of Object.entries({premium_weekly:3.99,premium_monthly:9.99,premium_quarterly:19.90,premium_annual:59.90}))assert.equal(mod.PREMIUM_PLAN_VALUES[plan],value);
});
