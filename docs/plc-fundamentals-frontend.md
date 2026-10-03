# PLC Fundamentals · frontend integration (launched EN/IT, noindex)

PLC Fundamentals (area "Industrial Automation") is a CertifyQuiz training path, **not an official certification**. Launch languages: EN + IT.

## State of this change

**Launched in EN + IT, still noindex.** `publicationStatus: "planned"` is removed from the registry entry `plc-fundamentals` (production certification id 75 in `IDS_BY_SLUG`). The slug is **still** in `ROLLOUT_NOINDEX_CERTIFICATION_SLUGS`: noindex,follow in every language, topics noindex, absent from the sitemap. Removing that entry is a separate change after the production smoke test.

- Home: Industrial Automation card (with link) on a full-width row under Management, Business Applications, Data & Analytics and Operating Systems, before Foundations.
- Industrial Automation category (`/categories/industrial-automation`, `/it/categorie/automazione-industriale`), landing and quiz topics page: public in EN/IT; FR/ES always 404.
- Topic list: `TopicAccessBadge` shows Free / Premium / Locked from the backend contract (`access_tier` in the cached topic list; per-user `GET /topics/:certId/access`, never cached). Ordinary certifications are unaffected (no badge, no request).
- Quiz: `403 TOPIC_PREMIUM_REQUIRED` shows the Premium invitation, `404 TOPIC_NOT_AVAILABLE` the "not available" panel; mixed quiz and practice test show the free-pool notice (68 questions) to users without Premium access.
- Visibility is derived in one place, `src/lib/industrial-automation.ts` (`isIndustrialAutomationPublic`): public when the registry entry is not planned and the language is EN/IT. **Rollback switch:** putting `publicationStatus: "planned"` back hides everything again (the backend keeps serving nothing for topics with `is_active = 0`).

## Launch steps (each its own change, with explicit approval)

1. Backend: production import done (`00-PREFLIGHT` … `03-VERIFY`), topics activated (free topics first).
2. Add `"plc-fundamentals": <production certification id>` to `IDS_BY_SLUG` (`src/certifications/data/index.ts`). Without an id the quiz topics page cannot list topics.
3. Remove `publicationStatus: "planned"` from `plc-fundamentals.ts`. This turns on the home card, the category page, the landing and the quiz topics page (EN/IT). Update `tests/plc-fundamentals-planned-guard.test.ts`, which asserts the planned state.
4. Only then remove `plc-fundamentals` from `ROLLOUT_NOINDEX_CERTIFICATION_SLUGS` (indexing), after the production smoke test.
5. Re-check on the live site: sitemap, `noindex` state, Free/Locked badges for a guest and a Premium user, a locked topic quiz (403 `TOPIC_PREMIUM_REQUIRED` → upsell), all 70 exhibits rendering in EN/IT.

## Known follow-ups

- FR/ES strings in the registry entry repeat EN only to satisfy the type; they are never public.
- Done in the follow-up PR: `403 TOPIC_PREMIUM_REQUIRED` and `404 TOPIC_NOT_AVAILABLE` on the topic quiz (training and `?mode=assessment`) show a Premium invitation / "not available" panel instead of the engine (`src/lib/topic-access.ts`, `TopicPremiumRequired`). Verified in dev against a stub backend; to re-verify with the real backend after the import.
- Also in the follow-up PR: `FreePoolNotice` tells a non-entitled user, under the mixed quiz and the practice test, that these draw only from the 68 free questions (with a Premium link). Hidden for entitled users, while the status is unknown and on request errors.
- Exhibit rendering must be re-verified with the 70 exhibits of the current dataset (earlier check covered 56).
