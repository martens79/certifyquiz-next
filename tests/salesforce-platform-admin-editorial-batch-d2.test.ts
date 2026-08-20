import assert from "node:assert/strict";
import test from "node:test";
import { SALESFORCE_PLATFORM_ADMIN_TOPIC_01_QUIZZES as t1 } from "../src/certifications/editorial/salesforce-platform-administrator-topic-01.en.ts";
import { SALESFORCE_PLATFORM_ADMIN_TOPIC_02_QUIZZES as t2 } from "../src/certifications/editorial/salesforce-platform-administrator-topic-02.en.ts";
import { SALESFORCE_PLATFORM_ADMIN_TOPIC_03_QUIZZES as t3 } from "../src/certifications/editorial/salesforce-platform-administrator-topic-03.en.ts";
import { SALESFORCE_PLATFORM_ADMIN_TOPIC_04_QUIZZES as t4, SALESFORCE_PLATFORM_ADMIN_TOPIC_04_REVIEW as r4, SALESFORCE_PLATFORM_ADMIN_TOPIC_04_SOURCES as s4 } from "../src/certifications/editorial/salesforce-platform-administrator-topic-04.en.ts";
import { SALESFORCE_PLATFORM_ADMIN_TOPIC_05_QUIZZES as t5, SALESFORCE_PLATFORM_ADMIN_TOPIC_05_REVIEW as r5, SALESFORCE_PLATFORM_ADMIN_TOPIC_05_SOURCES as s5 } from "../src/certifications/editorial/salesforce-platform-administrator-topic-05.en.ts";
import { SALESFORCE_PLATFORM_ADMIN_TOPIC_06_QUIZZES as t6, SALESFORCE_PLATFORM_ADMIN_TOPIC_06_REVIEW as r6, SALESFORCE_PLATFORM_ADMIN_TOPIC_06_SOURCES as s6 } from "../src/certifications/editorial/salesforce-platform-administrator-topic-06.en.ts";

type Questions = typeof t4 | typeof t5 | typeof t6;
type Review = typeof r4 | typeof r5 | typeof r6;
function validate(questions:Questions,review:Review,expected:{count:number;slug:string;objectives:string[];difficulty:Record<string,number>}) {
  assert.equal(questions.length,expected.count);
  assert.equal(review.topicSlug,expected.slug);
  assert.deepEqual([...review.objectiveIds].sort(),[...expected.objectives].sort());
  assert.ok(review.content.trim().split(/\s+/u).length>=900);
  assert.deepEqual(Object.fromEntries(["easy","medium","hard"].map(d=>[d,questions.filter(x=>x.difficulty===d).length])),expected.difficulty);
  for(const x of questions){
    assert.equal(x.topicSlug,expected.slug); assert.ok(expected.objectives.includes(x.objectiveId));
    assert.equal(x.answers.length,4); assert.equal(new Set(x.answers.map(a=>a.id)).size,4);
    assert.ok(x.answers.some(a=>a.id===x.correctAnswerId)); assert.equal(x.supportStatus,"SUPPORTED");
    assert.ok(review.content.includes(`## ${x.reviewSection}`)); assert.ok(x.explanation.length>=140);
  }
  for(const objective of expected.objectives) assert.ok(questions.some(x=>x.objectiveId===objective));
}

test("D2 topics meet frozen counts, difficulty, ownership, support, and source gates",()=>{
  validate(t4,r4,{count:22,slug:"objects-relationships-lightning-app-builder",objectives:["CS-02","OM-01","OM-02","OM-03"],difficulty:{easy:5,medium:11,hard:6}});
  validate(t5,r5,{count:18,slug:"sales-marketing",objectives:["SM-01","SM-02","SM-03"],difficulty:{easy:4,medium:10,hard:4}});
  validate(t6,r6,{count:18,slug:"service-support",objectives:["SS-01","SS-02"],difficulty:{easy:4,medium:10,hard:4}});
  for(const source of [...s4,...s5,...s6]) assert.ok(new URL(source.url).hostname.endsWith("salesforce.com"));
});

test("D2 and MVP corpus totals, ids, prompts, and near-duplicates pass",()=>{
  const d2=[...t4,...t5,...t6],corpus=[...t1,...t2,...t3,...d2];
  assert.equal(d2.length,58); assert.equal(corpus.length,116);
  assert.equal(new Set(corpus.map(x=>x.id)).size,116);
  const normalized=corpus.map(x=>x.prompt.toLowerCase().replace(/[^a-z0-9]+/g," ").trim());
  assert.equal(new Set(normalized).size,116);
  const tokens=normalized.map(x=>new Set(x.split(" ")));
  for(let i=0;i<tokens.length;i++) for(let j=i+1;j<tokens.length;j++) {
    const intersection=[...tokens[i]].filter(x=>tokens[j].has(x)).length;
    const union=new Set([...tokens[i],...tokens[j]]).size;
    assert.ok(intersection/union<0.8,`near-duplicate prompts: ${corpus[i].id} / ${corpus[j].id}`);
  }
});

test("answer keys are non-degenerate for every D2 topic, batch, and corpus",()=>{
  const d2=[...t4,...t5,...t6],corpus=[...t1,...t2,...t3,...d2];
  for(const questions of [t4,t5,t6,d2,corpus]) {
    const counts=["A","B","C","D"].map(id=>questions.filter(x=>x.correctAnswerId===id).length);
    assert.ok(counts.every(n=>n>0));
    assert.ok(Math.max(...counts)-Math.min(...counts)<=5,`answer distribution ${counts.join("/")}`);
  }
});

test("D2 preserves cross-topic boundaries and sensitive concepts are explicitly reviewed",()=>{
  assert.ok(t4.every(x=>["CS-02","OM-01","OM-02","OM-03"].includes(x.objectiveId)));
  assert.ok(t5.every(x=>["SM-01","SM-02","SM-03"].includes(x.objectiveId)));
  assert.ok(t6.every(x=>["SS-01","SS-02"].includes(x.objectiveId)));
  assert.match(r4.content,/component visibility.*not a security control/is);
  assert.match(r5.content,/Conversion changes the prospect/s);
  assert.match(r6.content,/Assignment answers.*Escalation answers/s);
});
