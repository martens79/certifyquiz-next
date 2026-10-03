# PLC Fundamentals · frontend integration (not launched)

PLC Fundamentals (area "Industrial Automation") is a CertifyQuiz training path, **not an official certification**. Launch languages: EN + IT.

## State of this change

Everything is wired but **nothing is public** yet. The registry entry `plc-fundamentals` is still `publicationStatus: "planned"` and still in `ROLLOUT_NOINDEX_CERTIFICATION_SLUGS`.

- Home: a text-only "Industrial Automation · PLC Fundamentals · In preparazione / Coming soon" card (EN/IT, no link) while the area is not public.
- Industrial Automation category (`/categories/industrial-automation`, `/it/categorie/automazione-industriale`): 404 and noindex until launch; FR/ES always 404.
- Landing and quiz topics page: 404 while planned; FR/ES 404 for PLC Fundamentals even after launch.
- Topic list: `TopicAccessBadge` shows Free / Premium / Locked from the backend contract (`access_tier` in the cached topic list; per-user `GET /topics/:certId/access`, never cached). Ordinary certifications are unaffected (no badge, no request).
- Visibility is derived in one place, `src/lib/industrial-automation.ts` (`isIndustrialAutomationPublic`): public only when the registry entry is not planned and the language is EN/IT. A local preview (`CERTIFYQUIZ_PLANNED_PREVIEW=1`, never in production) shows it like the planned landing.

## Launch steps (each its own change, with explicit approval)

1. Backend: production import done (`00-PREFLIGHT` … `03-VERIFY`), topics activated (free topics first).
2. Add `"plc-fundamentals": <production certification id>` to `IDS_BY_SLUG` (`src/certifications/data/index.ts`). Without an id the quiz topics page cannot list topics.
3. Remove `publicationStatus: "planned"` from `plc-fundamentals.ts`. This turns on the home card, the category page, the landing and the quiz topics page (EN/IT). Update `tests/plc-fundamentals-planned-guard.test.ts`, which asserts the planned state.
4. Only then remove `plc-fundamentals` from `ROLLOUT_NOINDEX_CERTIFICATION_SLUGS` (indexing), after the production smoke test.
5. Re-check on the live site: sitemap, `noindex` state, Free/Locked badges for a guest and a Premium user, a locked topic quiz (403 `TOPIC_PREMIUM_REQUIRED` → upsell), all 70 exhibits rendering in EN/IT.

## Known follow-ups

- FR/ES strings in the registry entry repeat EN only to satisfy the type; they are never public.
- Done in the follow-up PR: `403 TOPIC_PREMIUM_REQUIRED` and `404 TOPIC_NOT_AVAILABLE` on the topic quiz (training and `?mode=assessment`) show a Premium invitation / "not available" panel instead of the engine (`src/lib/topic-access.ts`, `TopicPremiumRequired`). Verified in dev against a stub backend; to re-verify with the real backend after the import.
- Still open: for a FREE user, the practice test and the mixed quiz draw only from the 68 free questions (the backend filters the pool); the UI does not say so yet and should offer the Premium upsell for the full pool.
- Exhibit rendering must be re-verified with the 70 exhibits of the current dataset (earlier check covered 56).
