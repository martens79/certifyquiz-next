import assert from "node:assert/strict";
import test from "node:test";

const local = new Map<string,string>();
const session = new Map<string,string>();
const storage = (map: Map<string,string>) => ({getItem:(k:string)=>map.get(k)??null,setItem:(k:string,v:string)=>map.set(k,v),removeItem:(k:string)=>map.delete(k)});
Object.defineProperty(globalThis,"localStorage",{value:storage(local),configurable:true});
Object.defineProperty(globalThis,"sessionStorage",{value:storage(session),configurable:true});
const calls:unknown[][]=[];
const gtag=(...args:unknown[])=>{
  if(args[0]==="get") (args[3] as (value:string)=>void)(args[2]==="client_id"?"123.456":"1792494000");
  else calls.push(args);
};
(globalThis as any).window={location:{pathname:"/quiz/ccna"},gtag,fbq:(...args:unknown[])=>calls.push(args)};
(globalThis as any).document={cookie:"_fbp=fb.1.1792494000000.12345",referrer:""};
Object.defineProperty(globalThis,"navigator",{value:{userAgent:"fixture-browser",webdriver:false,sendBeacon:()=>{throw new Error("once events require acknowledgement");}},configurable:true});
process.env.NEXT_PUBLIC_GA_ID="G-FIXTURE";
const analytics=import("../src/lib/analytics.ts");
const checkout=import("../src/lib/checkout-analytics.ts");
const meta=import("../src/lib/metaPixel.ts");
const granted=()=>local.set("cq_cookie_consent",JSON.stringify({accepted:true}));

test("unknown or denied consent creates no tracking identifiers and sends no product or purchase event",async()=>{
  const a=await analytics;const c=await checkout;const m=await meta;
  for(const consent of [undefined,false]){
    local.clear();session.clear();calls.length=0;
    if(consent===false)local.set("cq_cookie_consent",'{"accepted":false}');
    a.trackEvent("study_started");a.trackFunnelEvent({event:"study_engaged"});m.trackMetaPixel("InitiateCheckout");
    assert.equal(a.getAnonymousSessionId(),undefined);assert.equal(a.getAnonymousVisitorId(),undefined);
    assert.deepEqual(await c.checkoutAnalyticsContext(),{analytics_consent:false,marketing_consent:false});
    assert.equal(calls.length,0);assert.equal(session.size,0);
  }
});
test("checkout reuses Google client/session identifiers after consent without any email or account id",async()=>{
  granted();const c=await checkout;const result=await c.checkoutAnalyticsContext();
  assert.equal(result.ga_client_id,"123.456");assert.equal(result.ga_session_id,"1792494000");
  assert.equal(result.analytics_consent,true);assert.ok(result.consent_id);assert.equal(result.email,undefined);assert.equal(result.user_id,undefined);
  assert.equal(result.marketing_consent,false);assert.equal(result.fbp,null);
});
test("legacy consent stays compatible and a current denial overrides an old acceptance",async()=>{
  const c=await checkout;local.clear();local.set("cookie-consent","accepted");
  assert.equal(c.analyticsConsentGranted(),true);
  local.set("cq_cookie_consent",'{"accepted":false}');assert.equal(c.analyticsConsentGranted(),false);
  granted();
});
test("a checkout retry retains its idempotency request key; another product has another key",async()=>{
  const {checkoutRequestId}=await checkout;
  assert.equal(checkoutRequestId("premium:monthly"),checkoutRequestId("premium:monthly"));
  assert.notEqual(checkoutRequestId("premium:monthly"),checkoutRequestId("package:ccna"));
});
test("checkout retries freeze optional metadata; changing consent creates a fresh intent",async()=>{
  granted();const c=await checkout;
  const first=await c.checkoutRequest("stable-parameters");
  (globalThis as any).document.cookie="_fbp=fb.1.1792494000000.99999";
  const second=await c.checkoutRequest("stable-parameters");
  assert.deepEqual(second,first);
  local.set("cq_cookie_consent",'{"accepted":false}');
  const denied=await c.checkoutRequest("stable-parameters");
  assert.notEqual(denied.requestId,first.requestId);assert.equal(denied.analytics.analytics_consent,false);
  granted();
});
test("a broken analytics tag cannot prevent checkout context creation or product actions",async()=>{
  granted();const c=await checkout;const a=await analytics;const m=await meta;
  (globalThis as any).window.gtag=()=>{throw new Error('fixture tag failure');};
  (globalThis as any).window.fbq=()=>{throw new Error('fixture pixel failure');};
  const context=await c.checkoutAnalyticsContext();assert.equal(context.ga_client_id,null);
  assert.doesNotThrow(()=>a.trackEvent("checkout_attempted"));assert.doesNotThrow(()=>m.trackMetaPixel("InitiateCheckout"));
  (globalThis as any).window.gtag=gtag;
  (globalThis as any).window.fbq=(...args:unknown[])=>calls.push(args);
});
test("begin_checkout requires a created session and survives a confirmation/retry reload without duplication",async()=>{
  granted();calls.length=0;const a=await analytics;
  a.trackCheckoutCreated(undefined,{purchase_type:"subscription"});assert.equal(calls.length,0);
  a.trackCheckoutCreated("cs_fixture",{purchase_type:"subscription"});
  a.trackCheckoutCreated("cs_fixture",{purchase_type:"subscription"});
  assert.equal(calls.length,1);assert.equal(calls[0][1],"begin_checkout");
  assert.deepEqual((calls[0][2] as any).items,[{item_id:"subscription"}]);
});
test("analytics consent cannot send Meta events even with a loaded Pixel",async()=>{
  granted();calls.length=0;const m=await meta;m.trackMetaPixel("Purchase",{value:9.99,currency:"EUR"});assert.equal(calls.length,0);
  m.trackMetaPixel("InitiateCheckout",{currency:"EUR"});assert.equal(calls.length,0);
});
test("pre-policy advertising metadata is not restored under the old checkout idempotency key",async()=>{
  granted();const c=await checkout;const old="pre-policy-request";
  session.set("cq_checkout_request:legacy-ad",JSON.stringify({id:old,consent:"granted",expires:Date.now()+60000}));
  session.set(`cq_checkout_context:${old}`,JSON.stringify({analytics_consent:true,marketing_consent:true,fbp:"old-pixel-id"}));
  const current=await c.checkoutRequest("legacy-ad");
  assert.notEqual(current.requestId,old);
  assert.equal(current.analytics.marketing_consent,false);assert.equal(current.analytics.fbp,null);
});
test("a long-lived browser tab can record actual study on another day for retention",async()=>{
  const {studyEngagementKey}=await analytics;
  const first=studyEngagementKey("ccna","training",new Date("2026-10-20T10:00:00Z"));
  assert.equal(first,studyEngagementKey("ccna","training",new Date("2026-10-20T18:00:00Z")));
  assert.notEqual(first,studyEngagementKey("ccna","training",new Date("2026-10-21T10:00:00Z")));
});
test("failed funnel delivery can retry with the same event_id; only acknowledged delivery is marked done",async()=>{
  granted();const a=await analytics;const sent:Record<string,unknown>[]=[];let status=503;
  Object.defineProperty(globalThis,"fetch",{configurable:true,value:async(_url:string,init:RequestInit)=>{
    sent.push(JSON.parse(String(init.body)));return new Response(null,{status});
  }});
  a.trackFunnelEventOnce("retry-fixture",{event:"study_engaged",cert_slug:"ccna"});
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(session.get("cq_funnel_once:retry-fixture"),undefined);
  status=202;a.trackFunnelEventOnce("retry-fixture",{event:"study_engaged",cert_slug:"ccna"});
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(sent.length,2);assert.equal(sent[0].event_id,sent[1].event_id);
  assert.equal(session.get("cq_funnel_once:retry-fixture"),"1");
  a.trackFunnelEventOnce("retry-fixture",{event:"study_engaged"});assert.equal(sent.length,2);
});
test("admin checkout totals do not add the request and the created session; trial aliases are not purchases",async()=>{
  const {businessStepCounts}=await import("../src/lib/admin-analytics.ts");
  const rows=["checkout_started","checkout_attempted","checkout_created","premium_converted","trial_started"].map((event,id)=>({id,event,email:null,cert_slug:"ccna",topic_slug:null,lang:"en",score:null,created_at:new Date().toISOString()}));
  const counts=businessStepCounts(rows);assert.equal(counts.checkout_started,1);assert.equal(counts.purchase_completed,0);
});
