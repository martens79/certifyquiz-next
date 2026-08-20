import assert from "node:assert/strict";
import test from "node:test";
import {
  SALESFORCE_BLUEPRINT_TARGET as target,
  SALESFORCE_OBJECTIVE_PRIMARY_DOMAIN as objectiveDomains,
  SALESFORCE_REMAINING_BLUEPRINT_PLAN as plan,
} from "../src/certifications/editorial/salesforce-blueprint-allocation.ts";
import { SALESFORCE_BLUEPRINT_DOMAINS as domains } from "../src/certifications/editorial/salesforce-editorial-types.ts";
import { SALESFORCE_PLATFORM_ADMINISTRATOR_TOPIC_CONTRACT as topics } from "../src/certifications/data/salesforce-platform-administrator.ts";
import { SALESFORCE_PLATFORM_ADMIN_TOPIC_01_QUIZZES as t1 } from "../src/certifications/editorial/salesforce-platform-administrator-topic-01.en.ts";
import { SALESFORCE_PLATFORM_ADMIN_TOPIC_02_QUIZZES as t2 } from "../src/certifications/editorial/salesforce-platform-administrator-topic-02.en.ts";
import { SALESFORCE_PLATFORM_ADMIN_TOPIC_03_QUIZZES as t3 } from "../src/certifications/editorial/salesforce-platform-administrator-topic-03.en.ts";
import { SALESFORCE_PLATFORM_ADMIN_TOPIC_04_QUIZZES as t4 } from "../src/certifications/editorial/salesforce-platform-administrator-topic-04.en.ts";
import { SALESFORCE_PLATFORM_ADMIN_TOPIC_05_QUIZZES as t5 } from "../src/certifications/editorial/salesforce-platform-administrator-topic-05.en.ts";
import { SALESFORCE_PLATFORM_ADMIN_TOPIC_06_QUIZZES as t6 } from "../src/certifications/editorial/salesforce-platform-administrator-topic-06.en.ts";

const corpus = [...t1, ...t2, ...t3, ...t4, ...t5, ...t6];
const countDomains = (questions: typeof corpus) => Object.fromEntries(
  domains.map((domain) => [domain, questions.filter((question) => question.blueprintDomain === domain).length]),
);

test("all 116 questions have one valid blueprint domain independent from objective ownership", () => {
  assert.equal(corpus.length, 116);
  for (const question of corpus) {
    assert.ok(domains.includes(question.blueprintDomain));
    assert.ok(question.objectiveId in objectiveDomains);
    const primaryDomain = objectiveDomains[question.objectiveId as keyof typeof objectiveDomains];
    if (primaryDomain !== question.blueprintDomain) {
      assert.ok(question.blueprintDomainRationale && question.blueprintDomainRationale.length >= 45);
    } else {
      assert.equal(question.blueprintDomainRationale, undefined);
    }
  }
  assert.equal(corpus.filter((question) => objectiveDomains[question.objectiveId as keyof typeof objectiveDomains] === question.blueprintDomain).length, 83);
  assert.equal(corpus.filter((question) => objectiveDomains[question.objectiveId as keyof typeof objectiveDomains] !== question.blueprintDomain).length, 33);
});

test("existing allocation stays below every target and leaves exactly 84 slots", () => {
  const current = countDomains(corpus);
  assert.deepEqual(current, {
    configuration: 30, "objects-app-builder": 30, "sales-marketing": 20,
    "service-support": 20, "productivity-collaboration": 6, "data-analytics": 7,
    automation: 2, agentforce: 1,
  });
  for (const domain of domains) assert.ok(current[domain] <= target[domain]);
  assert.equal(domains.reduce((sum, domain) => sum + target[domain] - current[domain], 0), 84);
});

test("D3/D4 plan respects frozen topic budgets and reaches the exact 200-question target", () => {
  const current = countDomains(corpus);
  const planned = Object.fromEntries(domains.map((domain) => [domain, 0]));
  for (const row of plan) {
    const topic = topics.find((candidate) => candidate.slug === row.topicSlug);
    assert.ok(topic);
    assert.equal(Object.values(row.domains).reduce((sum, count) => sum + (count ?? 0), 0), row.quizCount);
    for (const domain of domains) planned[domain] += row.domains[domain] ?? 0;
  }
  assert.equal(plan.reduce((sum, row) => sum + row.quizCount, 0), 84);
  for (const domain of domains) assert.equal(current[domain] + planned[domain], target[domain]);
  assert.equal(corpus.length + plan.reduce((sum, row) => sum + row.quizCount, 0), 200);
});
