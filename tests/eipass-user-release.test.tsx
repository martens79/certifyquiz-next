import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import Module from "node:module";
import path from "node:path";
import test from "node:test";
import React from "react";
import { act, create, type ReactTestRenderer } from "react-test-renderer";
import EIPASS from "../src/certifications/data/EIPASS";
import { EIPASS_USER_COPY, EIPASS_USER_MODULES, eipassLocalizedText, eipassTopicRow, orderEipassTopics } from "../src/lib/eipass-user-release";
import { practiceTopicLimit } from "../src/lib/practice-topic-coverage";
import { isTopicIndexable } from "../src/lib/seo/topic-indexability";
import { pricingPath } from "../src/lib/paths";
import { clientComponent } from "./helpers/client-component";

const langs = ["it", "en", "fr", "es"] as const;
const req = Module.createRequire(path.resolve(process.cwd(), "package.json"));
const only = req.resolve("server-only");
req.cache[only] = { id: only, filename: only, loaded: true, exports: {} } as NodeJS.Module;
(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;
process.env.API_BASE_URL = "http://127.0.0.1:9/api";

test("all seven existing module identities and multilingual URLs survive the editorial order", () => {
  const baseline = JSON.parse(readFileSync(new URL("./fixtures/eipass-user/topics-before.json", import.meta.url), "utf8"));
  const transformed = orderEipassTopics(baseline.map(eipassTopicRow));
  assert.deepEqual(transformed.map((x: {id: number}) => x.id), [17,20,19,18,23,22,21]);
  assert.equal(practiceTopicLimit("eipass"), 7);
  for (const old of baseline) {
    const row = transformed.find((t) => t.id === old.id)!;
    assert.equal(row.certification_id, old.certification_id);
    for (const lang of langs) {
      assert.equal(row[`slug_${lang}`], old[`slug_${lang}`]);
      assert.equal(row[`title_${lang}`], EIPASS_USER_MODULES.find((m) => m.id === old.id)!.title[lang]);
    }
  }
  assert.equal(EIPASS.slug, "eipass");
  assert.equal(EIPASS.topics.length, 7);
  for (const lang of langs) {
    assert.equal(EIPASS.quizRoute[lang], `/${lang}/quiz/eipass`);
    assert.match(EIPASS.metaTitle[lang], /EIPASS 7 Moduli User/);
    assert.doesNotMatch(EIPASS.metaDescription[lang], /Basic|ufficial|official|officiel|oficial/);
  }
  assert.match(EIPASS.officialUrl, /7-moduli-user/);
});

test("adapter does not mutate input, change questions, affect foreign certificates or lose unknown topics", () => {
  const original = { id:17, certification_id:3, slug:'retained', questions:[{id:1073, answerIds:[4055,4056,4057,4058]}], access_tier:null };
  const before = structuredClone(original);
  const row = eipassTopicRow(original);
  assert.deepEqual(original, before);
  assert.equal(row.questions, original.questions);
  assert.equal(row.slug, original.slug);
  assert.equal(row.access_tier, original.access_tier);
  const foreign = {...original, certification_id:99};
  assert.equal(eipassTopicRow(foreign), foreign);
  const unknown = {id:999, certification_id:3};
  assert.equal(eipassTopicRow(unknown), unknown);
  assert.equal(orderEipassTopics([unknown, original]).length, 2);
});

test("localized JSON never reaches visible copy; HTML and plain strings remain intact", () => {
  for (const lang of langs) {
    const value = JSON.stringify({it:'italiano',en:'English',fr:'français',es:'español'});
    assert.equal(eipassLocalizedText(value, lang), JSON.parse(value)[lang]);
    assert.equal(eipassLocalizedText({[lang]:'localized'},lang), 'localized');
    assert.equal(eipassLocalizedText('{invalid', lang), '');
    assert.equal(eipassLocalizedText('<p>Plain content</p>',lang), '<p>Plain content</p>');
  }
});

for (const lang of langs) {
  test(`${lang}: real topic response normalizes JSON and metadata, preserves content, canonical inputs and inventory`, async () => {
    const original = JSON.parse(readFileSync(new URL('./fixtures/eipass-user/page-17-before.json', import.meta.url),'utf8'));
    globalThis.fetch = async () => new Response(JSON.stringify(original), {status:200});
    const { getTopicPageData } = await import('../src/lib/server/topic-page');
    const data = await getTopicPageData({certSlug:'eipass',topicSlug:original.topic.slug,lang});
    assert.ok(data);
    assert.equal(data.topic.description, JSON.parse(original.topic.description)[lang]);
    for (const key of ['id','slug','quiz_id','intro','content','faq'] as const) assert.deepEqual(data.topic[key], original.topic[key], key);
    assert.equal(data.questionCount, original.questionCount);
    assert.equal(data.certification.id,3);
    assert.equal(data.certification.slug, original.certification.slug);
    assert.equal(data.certification.title,'EIPASS 7 Moduli User');
    assert.equal(data.reviewAvailable,false);
    assert.equal(isTopicIndexable({...data.topic,certificationSlug:'eipass',questionCount:data.questionCount}), isTopicIndexable({...original.topic,certificationSlug:'eipass',questionCount:original.questionCount}));
    assert.doesNotMatch(data.topic.description,/^\s*\{/);
    assert.match(data.topic.seoTitle!,/EIPASS 7 Moduli User/);
  });

  for (const status of ['anonymous','free','premium','loading'] as const) {
    test(`${lang}: ${status} Premium card advertises available practice, keeps pricing and emits the existing click event`, async () => {
      const events: unknown[] = [];
      const Component = clientComponent('../../src/components/certification/PremiumResourcesCta.tsx', {
        'next/link': {__esModule:true,default:(props: Record<string,unknown>) => React.createElement('a',props)},
        '@/components/auth/AuthProvider': {useAuth:() => ({loading:status==='loading',user:status==='anonymous'?null:{premium:status==='premium'}})},
        '@/lib/eipass-user-release': {EIPASS_USER_COPY},
        '@/lib/paths': {pricingPath},
        '@/lib/commercial-origin': {withCtaParam:(p:string,c:string)=>`${p}?cta=${c}`,premiumClickMetadata:(x:string)=>({cta_id:x})},
        '@/lib/analytics': {trackEvent:()=>{},trackFunnelEvent:(x:unknown)=>events.push(x),userStatusFrom:()=>status},
      });
      let renderer!: ReactTestRenderer;
      await act(async()=>{renderer=create(<Component lang={lang} certificationName="EIPASS" certificationId={3} certificationSlug="eipass" hasGuide={false} hasMaps={false} hasScenarios={false}/>);});
      const rendered=JSON.stringify(renderer.toJSON());
      if(status==='loading') assert.equal(renderer.toJSON(),null);
      else {
        assert.ok(rendered.includes(EIPASS_USER_COPY.premiumNotice[lang]));
        assert.doesNotMatch(rendered,/PDF|complete preparation|Préparation complète|Preparación completa|Preparazione completa/i);
        const links=renderer.root.findAllByType('a');
        if(status==='premium') assert.equal(links.length,0);
        else {
          assert.equal(links.length,1);
          assert.equal(links[0].props.href,`${pricingPath(lang)}?cta=certification_card`);
          links[0].props.onClick();
          assert.equal(events.length,1);
          assert.deepEqual(JSON.parse(JSON.stringify(events[0])),{event:'premium_clicked',cert_slug:'eipass',topic_slug:null,lang,metadata:{cta_id:'certification_card'}});
        }
      }
      await act(async()=>renderer.unmount());
    });
  }
}

test("mock SEO stays noindex at its existing canonical in every language",async()=>{
  const {generateMetadata}=await import('../src/app/[lang]/quiz/[slug]/mock-exam/layout');
  for(const lang of langs){
    const metadata=await generateMetadata({params:Promise.resolve({lang,slug:'eipass'})});
    assert.ok(String(metadata.title).includes(EIPASS_USER_COPY.practiceTitle[lang]));
    assert.equal(metadata.description,EIPASS_USER_COPY.practiceNotice[lang]);
    assert.equal((metadata.robots as {index:boolean}).index,false);
    assert.equal(metadata.alternates?.canonical,`https://www.certifyquiz.com/${lang}/quiz/eipass/mock-exam`);
  }
});

test("all 1248 audited IDs, 19 priority items and 34 pairs remain separate and accounted for",()=>{
  const manifest=JSON.parse(readFileSync(new URL('../docs/eipass-release1/catalogue-integrity.json',import.meta.url),'utf8'));
  assert.equal(manifest.questions.length,1248);
  const ids=new Set(manifest.questions.map((q:{id:number})=>q.id));
  assert.equal(ids.size,1248);
  assert.equal(manifest.priority_item_ids.length,19);
  assert.equal(manifest.normalized_duplicate_pairs.length,34);
  assert.ok(manifest.priority_item_ids.every((id:number)=>ids.has(id)));
  assert.ok(manifest.normalized_duplicate_pairs.flat().every((id:number)=>ids.has(id)));
  for(const q of manifest.questions){ assert.equal(q.certification_id,3); assert.ok([17,18,19,20,21,22,23].includes(q.topic_id)); assert.match(q.sha256,/^[a-f0-9]{64}$/); }
});

for(const id of [17,18,19,20,21,22,23]) for(const lang of langs){
  test(`${id}/${lang}: preserved topic identity, long-form content and indexability on an API fixture`,async()=>{
    const original=JSON.parse(readFileSync(new URL(`./fixtures/eipass-user/page-${id}-before.json`,import.meta.url),'utf8'));
    // Synthetic localized response uses the observed per-language pool, including zeros.
    // This asserts adapter behavior; it does not pretend the Italian prose is translated.
    original.questionCount=original.questionCountByLang[lang];
    globalThis.fetch=async()=>new Response(JSON.stringify(original),{status:200});
    const {getTopicPageData}=await import('../src/lib/server/topic-page');
    const data=await getTopicPageData({certSlug:'eipass',topicSlug:original.topic.slug,lang});
    assert.ok(data);
    assert.equal(data.topic.id,id);
    assert.equal(data.topic.slug,original.topic.slug);
    assert.equal(data.topic.title,EIPASS_USER_MODULES.find(m=>m.id===id)!.title[lang]);
    assert.equal(data.topic.content,original.topic.content);
    assert.equal(data.topic.intro,original.topic.intro);
    assert.deepEqual(data.topic.faq,original.topic.faq);
    assert.equal(data.questionCount,original.questionCount);
    const before=isTopicIndexable({...original.topic,certificationSlug:'eipass',questionCount:original.questionCount});
    const after=isTopicIndexable({...data.topic,certificationSlug:'eipass',questionCount:data.questionCount});
    assert.equal(after,before);
    if(original.questionCount===0) assert.equal(after,false);
  });
}
