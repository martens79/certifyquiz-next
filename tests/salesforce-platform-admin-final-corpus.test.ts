import test from "node:test";
import assert from "node:assert/strict";
import { SALESFORCE_PLATFORM_ADMINISTRATOR_OBJECTIVES, SALESFORCE_PLATFORM_ADMINISTRATOR_TOPIC_CONTRACT, SALESFORCE_PLATFORM_ADMINISTRATOR_DOMAIN_QUIZ_ALLOCATION } from "../src/certifications/data/salesforce-platform-administrator.ts";
import SalesforcePlatformAdministrator from "../src/certifications/data/salesforce-platform-administrator.ts";
import { BUSINESS_ECOSYSTEMS } from "../src/features/business-applications/data.ts";
import { SALESFORCE_PLATFORM_ADMIN_TOPIC_01_QUIZZES } from "../src/certifications/editorial/salesforce-platform-administrator-topic-01.en.ts";
import { SALESFORCE_PLATFORM_ADMIN_TOPIC_02_QUIZZES } from "../src/certifications/editorial/salesforce-platform-administrator-topic-02.en.ts";
import { SALESFORCE_PLATFORM_ADMIN_TOPIC_03_QUIZZES } from "../src/certifications/editorial/salesforce-platform-administrator-topic-03.en.ts";
import { SALESFORCE_PLATFORM_ADMIN_TOPIC_04_QUIZZES } from "../src/certifications/editorial/salesforce-platform-administrator-topic-04.en.ts";
import { SALESFORCE_PLATFORM_ADMIN_TOPIC_05_QUIZZES } from "../src/certifications/editorial/salesforce-platform-administrator-topic-05.en.ts";
import { SALESFORCE_PLATFORM_ADMIN_TOPIC_06_QUIZZES } from "../src/certifications/editorial/salesforce-platform-administrator-topic-06.en.ts";
import { SALESFORCE_PLATFORM_ADMIN_TOPIC_07_QUIZZES } from "../src/certifications/editorial/salesforce-platform-administrator-topic-07.en.ts";
import { SALESFORCE_PLATFORM_ADMIN_TOPIC_08_QUIZZES } from "../src/certifications/editorial/salesforce-platform-administrator-topic-08.en.ts";
import { SALESFORCE_PLATFORM_ADMIN_TOPIC_09_QUIZZES } from "../src/certifications/editorial/salesforce-platform-administrator-topic-09.en.ts";
import { SALESFORCE_PLATFORM_ADMIN_TOPIC_10_QUIZZES } from "../src/certifications/editorial/salesforce-platform-administrator-topic-10.en.ts";
import { SALESFORCE_PLATFORM_ADMIN_TOPIC_11_QUIZZES } from "../src/certifications/editorial/salesforce-platform-administrator-topic-11.en.ts";

const batches=[SALESFORCE_PLATFORM_ADMIN_TOPIC_01_QUIZZES,SALESFORCE_PLATFORM_ADMIN_TOPIC_02_QUIZZES,SALESFORCE_PLATFORM_ADMIN_TOPIC_03_QUIZZES,SALESFORCE_PLATFORM_ADMIN_TOPIC_04_QUIZZES,SALESFORCE_PLATFORM_ADMIN_TOPIC_05_QUIZZES,SALESFORCE_PLATFORM_ADMIN_TOPIC_06_QUIZZES,SALESFORCE_PLATFORM_ADMIN_TOPIC_07_QUIZZES,SALESFORCE_PLATFORM_ADMIN_TOPIC_08_QUIZZES,SALESFORCE_PLATFORM_ADMIN_TOPIC_09_QUIZZES,SALESFORCE_PLATFORM_ADMIN_TOPIC_10_QUIZZES,SALESFORCE_PLATFORM_ADMIN_TOPIC_11_QUIZZES];
const all=batches.flat();

test("final Salesforce corpus has 200 unique supported four-option questions",()=>{
 assert.equal(all.length,200);
 assert.equal(new Set(all.map(q=>q.id)).size,200);
 assert.equal(new Set(all.map(q=>q.prompt.trim().toLowerCase())).size,200);
 for(const q of all){assert.equal(q.answers.length,4);assert.equal(new Set(q.answers.map(a=>a.id)).size,4);assert.ok(q.answers.some(a=>a.id===q.correctAnswerId));assert.equal(q.supportStatus,"SUPPORTED");assert.ok(q.explanation.length>=150);}
});

test("all 28 objectives and the approved 11-topic budgets are covered",()=>{
 assert.deepEqual(batches.map(b=>b.length),SALESFORCE_PLATFORM_ADMINISTRATOR_TOPIC_CONTRACT.map(t=>t.mvpQuizCount));
 assert.deepEqual(new Set(all.map(q=>q.objectiveId)),new Set(SALESFORCE_PLATFORM_ADMINISTRATOR_OBJECTIVES.map(o=>o.id)));
});

test("final blueprint distribution is exactly the approved 200-question allocation",()=>{
 const counts=new Map<string,number>(); for(const q of all) counts.set(q.blueprintDomain,(counts.get(q.blueprintDomain)||0)+1);
 const expected={"configuration":30,"objects-app-builder":30,"sales-marketing":20,"service-support":20,"productivity-collaboration":20,"data-analytics":34,"automation":30,"agentforce":16};
 assert.deepEqual(Object.fromEntries(counts),expected);
 assert.deepEqual(SALESFORCE_PLATFORM_ADMINISTRATOR_DOMAIN_QUIZ_ALLOCATION.map(x=>x.quizCount),[30,30,20,20,20,34,30,16]);
});

test("published certification and Business Applications cards are wired",()=>{
 assert.equal(SalesforcePlatformAdministrator.publicationStatus,"published");
 assert.equal(SalesforcePlatformAdministrator.topics.length,11);
 assert.equal(SalesforcePlatformAdministrator.imageUrl,"/images/certifications/salesforce-platform-administrator.svg");
 assert.equal(BUSINESS_ECOSYSTEMS.find(x=>x.key==="salesforce")?.available,true);
 assert.deepEqual(BUSINESS_ECOSYSTEMS.find(x=>x.key==="microsoft-business-applications"),{key:"microsoft-business-applications",title:"Microsoft Dynamics 365 & Power Platform",badge:"CRM · ERP · Low-code · Automation",available:false});
});
