import assert from "node:assert/strict";
import test from "node:test";
import { evaluateReviewClusterIndexability, evaluateReviewIndexability, selectIndexableReviewClusterItems, type ReviewIndexabilityInput } from "../src/lib/review-indexability.ts";

const substantialSection=Array.from({length:90},(_,i)=>`concept${i} is explained with a practical technical example`).join(" ");
function review(overrides:Partial<ReviewIndexabilityInput>={}):ReviewIndexabilityInput{return {
  certificationSlug:"ccna",topicId:81,access:"free",topicTitle:"Cisco hardware",title:"Cisco network hardware",
  metaTitle:"Cisco network hardware | CertifyQuiz",metaDescription:"Routers, switches, cabling and physical network interfaces.",
  intro:"A technical guide to Cisco network devices and physical interfaces.",content:`## Devices\n\n${substantialSection}\n\n## Interfaces\n\n${substantialSection}`,...overrides,
}}

test("distinct technical intent with sufficient content can be indexed",()=>assert.equal(evaluateReviewIndexability(review()).indexable,true));
test("certification-level intent is noindex even when substantial",()=>{const r=evaluateReviewIndexability(review({topicId:83}));assert.equal(r.indexable,false);assert.ok(r.reasons.includes("seo_intent_certification"))});
test("borderline intent fails closed",()=>assert.equal(evaluateReviewIndexability(review({topicId:84})).indexable,false));
test("unclassified new reviews fail closed",()=>assert.equal(evaluateReviewIndexability(review({topicId:99999})).indexable,false));
test("FREE does not imply index",()=>assert.equal(evaluateReviewIndexability(review({topicId:83,access:"free"})).indexable,false));
test("Premium does not imply noindex when its public preview is autonomous",()=>assert.equal(evaluateReviewIndexability(review({access:"premium"})).indexable,true));
test("thin Premium preview is noindex",()=>{const r=evaluateReviewIndexability(review({access:"premium",content:"## Preview\n\nShort.\n\n## More\n\nShort."}));assert.equal(r.indexable,false);assert.ok(r.reasons.includes("premium_preview_below_300_words"))});
test("Spanish ordinary use of todo is not treated as a TODO placeholder",()=>assert.equal(evaluateReviewIndexability(review({intro:"Todo el hardware necesario para una red Cisco."})).indexable,true));
test("an actual standalone TODO marker remains noindex",()=>assert.equal(evaluateReviewIndexability(review({content:`## Devices\n\n${substantialSection}\n\nTODO`})).indexable,false));
test("locale cluster is indexable only when all four equivalents pass",()=>{const cluster=[review(),review(),review(),review()];assert.equal(evaluateReviewClusterIndexability(cluster).indexable,true);cluster[3]=review({content:"short"});assert.equal(evaluateReviewClusterIndexability(cluster).indexable,false)});
test("incomplete hreflang cluster fails closed",()=>assert.equal(evaluateReviewClusterIndexability([review(),review(),review()]).indexable,false));
test("sitemap selector includes index clusters and excludes noindex clusters",()=>{const indexed=[0,1,2,3].map(i=>({href:`/index-${i}`,review:review()}));const blocked=[0,1,2,3].map(i=>({href:`/blocked-${i}`,review:review({topicId:83})}));assert.deepEqual(selectIndexableReviewClusterItems([indexed,blocked]).map(x=>x.href),indexed.map(x=>x.href))});
