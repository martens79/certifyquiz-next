import type { SalesforceEditorialQuestion } from "./salesforce-editorial-types";

type GoldenQuestion = SalesforceEditorialQuestion<
  "platform-foundations-org-setup",
  "CS-01"
>;

export const SALESFORCE_PLATFORM_ADMIN_TOPIC_01_SOURCES = [
  {
    title: "Salesforce Certified Platform Administrator Exam Guide",
    url: "https://help.salesforce.com/s/articleView?id=005298966&type=1&language=en_US",
    lastVerifiedAt: "2026-08-20",
    objectiveIds: ["CS-01"],
  },
  {
    title: "Regional Settings and Company Information",
    url: "https://trailhead.salesforce.com/content/learn/modules/company_wide_org_settings/org_settings_regional",
    lastVerifiedAt: "2026-08-20",
    objectiveIds: ["CS-01"],
  },
  {
    title: "Discover Multiple Currency Settings",
    url: "https://trailhead.salesforce.com/content/learn/modules/company_wide_org_settings/org_settings_currency",
    lastVerifiedAt: "2026-08-20",
    objectiveIds: ["CS-01"],
  },
  {
    title: "Service Cloud — Business Hours and Holidays",
    url: "https://resources.docs.salesforce.com/latest/latest/en-us/sfdc/pdf/support.pdf",
    lastVerifiedAt: "2026-08-20",
    objectiveIds: ["CS-01"],
  },
] as const;

export const SALESFORCE_PLATFORM_ADMIN_TOPIC_01_REVIEW = {
  id: "SF-PA-T01-REVIEW-EN",
  language: "en",
  topicSlug: "platform-foundations-org-setup",
  title: "Platform Foundations and Org Setup — Exam Review",
  objectiveIds: ["CS-01"],
  blueprintDomains: ["Configuration and Setup"],
  lastVerifiedAt: "2026-08-20",
  sourceUrls: SALESFORCE_PLATFORM_ADMIN_TOPIC_01_SOURCES.map((source) => source.url),
  content: `## Learning objectives

After this review, you should be able to locate and interpret company-level settings, distinguish organization defaults from personal settings, choose an appropriate fiscal-year model, explain how business hours and holidays affect time-based support processes, and reason safely about single- and multiple-currency configuration.

This topic covers objective **CS-01: company settings, fiscal year, business hours, currency management, and organization defaults**. User provisioning and access belong to later topics. Detailed Lightning page configuration belongs primarily to Object Manager and Lightning App Builder.

## Company Information: know what the page tells you

Company Information is an organization-level reference point. It includes identity and contact information, default locale and time zone, currency information, storage usage, and license totals. An administrator should read it before changing it: the page helps answer whether a requirement is about the whole organization, an available entitlement, or an individual user preference.

Use Company Information when the question asks about an organization default, available licenses, storage consumption, corporate address, primary or security contact, default locale, default time zone, or currency setup. Do not treat it as the place to grant record access, configure a user's complete permissions, or redesign a Lightning page.

### Decision rule

- **Organization-wide starting value or capacity:** inspect Company Information or the related organization setting.
- **One user's display preference:** use the user's personal settings when Salesforce supports an override.
- **Authorization or record visibility:** move to users, permissions, and sharing—not company settings.

## Locale, language, and time zone are different decisions

Locale controls presentation conventions such as date, time, number, name, and address formats. Language controls interface language. Time zone controls how date/time values are presented to the user. These settings are related but not interchangeable.

The organization has defaults, while users can select personal locale, language, and time-zone settings when their work location or language differs. Changing a personal locale does not rewrite stored business data or change the organization default for everyone.

### Common confusion

If an employee sees dates in an unfamiliar format, the best first check is locale—not currency and not record ownership. If timestamps appear at unexpected local times for only one user, inspect that user's time zone. If labels and menus use the wrong language, inspect language.

## Fiscal year: reporting periods follow the business

Salesforce uses fiscal-year settings for reporting and forecasting periods. A standard fiscal year follows regular calendar months but can start in a month other than January. A custom fiscal year supports business calendars that cannot be represented by standard monthly periods, such as specialized week-based structures.

Choose the simplest model that represents the reporting calendar. Do not select a custom fiscal year merely because the year starts in July; a standard fiscal year can start in July. Treat a move to custom fiscal years as a consequential configuration decision and validate reporting requirements before making it.

### When to use what

| Requirement | Best fit |
|---|---|
| January through December | Standard fiscal year starting January |
| Regular months, July through June | Standard fiscal year starting July |
| Specialized week-based accounting periods | Evaluate a custom fiscal year |

## Business hours and holidays

Business hours define the working times used by supported time-dependent service processes. An organization has default business hours and can define additional business-hours records for teams with different schedules or time zones. Holidays identify dates or times that should be excluded where the associated process honors holidays.

Business hours are not user login hours. Business hours model service availability and elapsed working time; login hours restrict when users assigned through profiles can sign in. Likewise, changing the organization default time zone does not replace the need to configure the correct business-hours time zone and schedule.

### Decision rule

When an escalation or support timer should count only staffed periods, inspect the business-hours and holiday configuration used by that process. When a user cannot sign in at a particular time, investigate authentication and login-hour controls in the access topic.

## Currency management

A Salesforce organization starts as single currency unless multiple currencies are enabled. In a single-currency org, currency values use the organization currency configuration. In a multicurrency org, the administrator maintains a corporate currency, active currencies, and conversion rates relative to the corporate currency. Users can have a personal currency, and records that support currency can carry a record currency.

The corporate currency is the reference for conversion rates; it is not automatically the only currency users can enter after multicurrency is configured. Deactivating a currency prevents its use for new values but does not rewrite historical amounts. The corporate currency cannot simply be deactivated. Enabling multiple currencies is a consequential choice and should follow a confirmed business requirement.

Advanced Currency Management introduces dated exchange rates for supported opportunity-related currency behavior. Do not choose it merely because exchange rates change occasionally; first determine whether the requirement specifically needs rates effective for different dates and supported sales records.

### Currency distinctions

| Term | Meaning |
|---|---|
| Corporate currency | Reference currency used for organization conversion rates |
| Active currency | Currency available for new supported records and transactions |
| Personal currency | User's default currency in supported experiences |
| Record currency | Currency selected for an individual supported record |
| Dated exchange rate | Rate effective for a defined period where Advanced Currency Management applies |

## Mini-scenarios

**Global user:** A London employee sees US date formats, but colleagues should keep their current format. Change the employee's personal locale rather than the organization default.

**Non-calendar reporting year:** Finance reports July through June using ordinary months. Use a standard fiscal year starting in July; a custom fiscal year is unnecessary.

**Support closure:** A case escalation should pause during a regional holiday. Verify the applicable business-hours record and associated holiday behavior rather than changing user login hours.

**International sales:** Sales must enter opportunities in EUR and USD and report conversions to a reference currency. Confirm the requirement, then configure multicurrency, active currencies, corporate currency, and conversion rates. Do not solve it by changing locale alone.

## Common mistakes and exam traps

- Treating locale, language, time zone, and currency as the same setting.
- Changing an organization default to solve a single user's display issue.
- Choosing a custom fiscal year for any non-January start month.
- Confusing business hours with login hours.
- Assuming locale conversion changes stored currency values.
- Treating personal currency as the corporate conversion reference.
- Assuming an inactive currency rewrites existing records.
- Enabling an irreversible or high-impact organization feature before confirming requirements and downstream effects.

## Final checklist

- Can I distinguish organization defaults from user preferences?
- Can I identify what Company Information reveals about capacity and defaults?
- Can I separate locale, language, time zone, and currency?
- Can I choose standard versus custom fiscal year from the calendar requirement?
- Can I separate business hours and holidays from login-hour security?
- Can I distinguish corporate, active, personal, and record currencies?
- Can I explain when dated exchange rates are relevant?
- Before an organization-wide change, have I checked scope, dependencies, and reversibility?

## Related topics

Continue with **Users, Authentication, and Access Foundations** for user lifecycle, identity, sessions, and login controls. Continue with **Objects, Relationships, and Lightning App Builder** for declarative UI configuration, fields, layouts, record types, and Lightning pages.
`,
} as const;

export const SALESFORCE_PLATFORM_ADMIN_TOPIC_01_QUIZZES: ReadonlyArray<GoldenQuestion> = [
  {
id: "SF-PA-T01-Q01", topicSlug: "platform-foundations-org-setup", objectiveId: "CS-01", blueprintDomain: "configuration", concept: "Company Information", difficulty: "easy", type: "conceptual",
    prompt: "An administrator needs to check the organization's default locale, storage usage, and remaining Salesforce licenses. Where should the administrator look first?",
    answers: [{ id: "A", text: "Company Information" }, { id: "B", text: "Sharing Settings" }, { id: "C", text: "Lightning App Builder" }, { id: "D", text: "Permission Set Groups" }], correctAnswerId: "A",
    explanation: "Company Information exposes organization defaults and capacity information such as locale, storage, and license totals. Sharing Settings controls record access, Lightning App Builder controls pages, and permission set groups aggregate permissions. Remember: inspect Company Information for org identity, defaults, and capacity. Review: Company Information.", reviewSection: "Company Information: know what the page tells you", supportStatus: "SUPPORTED",
  },
  {
    id: "SF-PA-T01-Q02", topicSlug: "platform-foundations-org-setup", objectiveId: "CS-01", blueprintDomain: "configuration", concept: "Locale versus language", difficulty: "easy", type: "configuration-choice",
    prompt: "One user wants dates and decimal separators displayed according to French conventions without changing the interface language for everyone. What is the best action?",
    answers: [{ id: "A", text: "Change the organization's default language" }, { id: "B", text: "Update the user's personal locale" }, { id: "C", text: "Change the corporate currency" }, { id: "D", text: "Create a custom fiscal year" }], correctAnswerId: "B",
    explanation: "A personal locale changes supported display conventions for that user. Organization language would affect a broader requirement; currency and fiscal year do not control number/date presentation in this way. Remember: locale controls formats, language controls UI text. Review: Locale, language, and time zone.", reviewSection: "Locale, language, and time zone are different decisions", supportStatus: "SUPPORTED",
  },
  {
    id: "SF-PA-T01-Q03", topicSlug: "platform-foundations-org-setup", objectiveId: "CS-01", blueprintDomain: "data-analytics", blueprintDomainRationale: "Fiscal-year configuration is evaluated through its reporting-period impact.", concept: "Standard fiscal year", difficulty: "easy", type: "configuration-choice",
    prompt: "A company's reporting year runs from July through June using normal calendar months. Which fiscal-year configuration is the simplest fit?",
    answers: [{ id: "A", text: "A January-start standard fiscal year" }, { id: "B", text: "A custom week-based fiscal year" }, { id: "C", text: "A standard fiscal year starting in July" }, { id: "D", text: "Separate fiscal years for every user" }], correctAnswerId: "C",
    explanation: "A standard fiscal year can start in a month other than January, so July through June does not by itself require a custom fiscal year. A week-based structure may require custom periods, and fiscal year is not configured per user. Review: Fiscal year.", reviewSection: "Fiscal year: reporting periods follow the business", supportStatus: "SUPPORTED",
  },
  {
    id: "SF-PA-T01-Q04", topicSlug: "platform-foundations-org-setup", objectiveId: "CS-01", blueprintDomain: "service-support", blueprintDomainRationale: "The competency tested is the service schedule used by Case escalation.", concept: "Business hours versus login hours", difficulty: "easy", type: "conceptual",
    prompt: "Which setting represents the staffed schedule used by supported case escalation calculations?",
    answers: [{ id: "A", text: "User locale" }, { id: "B", text: "Profile login hours" }, { id: "C", text: "Fiscal year" }, { id: "D", text: "Business hours" }], correctAnswerId: "D",
    explanation: "Business hours model service availability for supported time-based processes. Login hours restrict sign-in, locale controls presentation, and fiscal year controls reporting periods. Remember not to confuse operational schedules with access restrictions. Review: Business hours and holidays.", reviewSection: "Business hours and holidays", supportStatus: "SUPPORTED",
  },
  {
    id: "SF-PA-T01-Q05", topicSlug: "platform-foundations-org-setup", objectiveId: "CS-01", blueprintDomain: "configuration", concept: "Personal time zone", difficulty: "medium", type: "troubleshooting",
    prompt: "Only one employee sees Salesforce timestamps several hours later than expected. Other users see the correct local times. What should the administrator inspect first?",
    answers: [{ id: "A", text: "The organization's fiscal-year start month" }, { id: "B", text: "The employee's personal time-zone setting" }, { id: "C", text: "The corporate currency conversion rate" }, { id: "D", text: "The default case business hours" }], correctAnswerId: "B",
    explanation: "A problem isolated to one user's local timestamp display points first to that user's time zone. Fiscal year, currency rates, and case business hours solve different problems. Review: Locale, language, and time zone.", reviewSection: "Locale, language, and time zone are different decisions", supportStatus: "SUPPORTED",
  },
  {
    id: "SF-PA-T01-Q06", topicSlug: "platform-foundations-org-setup", objectiveId: "CS-01", blueprintDomain: "data-analytics", blueprintDomainRationale: "The competency tested is reporting-period design and downstream analytics impact.", concept: "Custom fiscal year", difficulty: "medium", type: "administrative-decision",
    prompt: "Finance uses a 4-4-5 week-based accounting calendar that cannot be represented by regular calendar months. What should the administrator evaluate?",
    answers: [{ id: "A", text: "Changing every user's locale" }, { id: "B", text: "Creating additional business hours" }, { id: "C", text: "Using a custom fiscal year" }, { id: "D", text: "Enabling multiple currencies" }], correctAnswerId: "C",
    explanation: "A specialized week-based reporting calendar is the kind of requirement that can justify a custom fiscal year. Locale, business hours, and multicurrency do not define fiscal periods. Validate downstream reporting requirements before this consequential change. Review: Fiscal year.", reviewSection: "Fiscal year: reporting periods follow the business", supportStatus: "SUPPORTED",
  },
  {
    id: "SF-PA-T01-Q07", topicSlug: "platform-foundations-org-setup", objectiveId: "CS-01", blueprintDomain: "service-support", blueprintDomainRationale: "The question tests holiday handling in service-time calculations.", concept: "Holidays", difficulty: "medium", type: "short-scenario",
    prompt: "A support escalation should not count time during a regional public holiday. Which configuration should be reviewed first?",
    answers: [{ id: "A", text: "The holiday and the business-hours configuration used by the process" }, { id: "B", text: "The users' personal currencies" }, { id: "C", text: "The fiscal-year quarter labels" }, { id: "D", text: "The organization's default language" }], correctAnswerId: "A",
    explanation: "Supported service timers use business-hours schedules and applicable holiday exclusions. Currency, fiscal labels, and language are unrelated. Confirm the process uses the intended business-hours record and holiday behavior. Review: Business hours and holidays.", reviewSection: "Business hours and holidays", supportStatus: "SUPPORTED",
  },
  {
    id: "SF-PA-T01-Q08", topicSlug: "platform-foundations-org-setup", objectiveId: "CS-01", blueprintDomain: "sales-marketing", blueprintDomainRationale: "Corporate currency is tested as the monetary foundation for revenue records.", concept: "Corporate currency", difficulty: "medium", type: "conceptual",
    prompt: "In a multicurrency organization, what is the primary role of the corporate currency?",
    answers: [{ id: "A", text: "It forces every record to use one currency" }, { id: "B", text: "It controls each user's date format" }, { id: "C", text: "It replaces the need for conversion rates" }, { id: "D", text: "It serves as the reference for organization currency conversion rates" }], correctAnswerId: "D",
    explanation: "The corporate currency is the reference against which organization conversion rates are maintained. Multicurrency permits other active and record currencies; locale controls date formats; conversion rates remain necessary. Review: Currency management.", reviewSection: "Currency management", supportStatus: "SUPPORTED",
  },
  {
    id: "SF-PA-T01-Q09", topicSlug: "platform-foundations-org-setup", objectiveId: "CS-01", blueprintDomain: "data-analytics", blueprintDomainRationale: "The question tests currency-data lifecycle and historical record implications.", concept: "Currency deactivation", difficulty: "medium", type: "administrative-decision",
    prompt: "A currency is no longer used for new business, but historical records contain amounts in that currency. What is the expected effect of deactivating it?",
    answers: [{ id: "A", text: "Historical amounts are converted to the corporate currency" }, { id: "B", text: "All records using it are deleted" }, { id: "C", text: "It is unavailable for new values while existing amounts remain" }, { id: "D", text: "It becomes every user's personal currency" }], correctAnswerId: "C",
    explanation: "Deactivation prevents new use of the currency but does not rewrite historical amounts. Salesforce does not delete records or automatically convert their stored values. A deactivated personal currency can be reset to corporate currency, but it does not become a new default. Review: Currency management.", reviewSection: "Currency management", supportStatus: "SUPPORTED",
  },
  {
    id: "SF-PA-T01-Q10", topicSlug: "platform-foundations-org-setup", objectiveId: "CS-01", blueprintDomain: "data-analytics", blueprintDomainRationale: "The question distinguishes data-value conversion from display formatting.", concept: "Locale versus currency", difficulty: "medium", type: "short-scenario",
    prompt: "A company changes its default locale from United States to United Kingdom. Which outcome should the administrator expect?",
    answers: [{ id: "A", text: "Supported display formats change, but stored currency amounts are not automatically converted" }, { id: "B", text: "All opportunity amounts are converted from USD to GBP" }, { id: "C", text: "Multiple currencies are enabled automatically" }, { id: "D", text: "The fiscal year automatically starts in April" }], correctAnswerId: "A",
    explanation: "Locale affects presentation conventions; it does not convert business values, enable multicurrency, or redefine the fiscal calendar. Treat these as separate organization decisions. Review: Locale, language, and time zone.", reviewSection: "Locale, language, and time zone are different decisions", supportStatus: "SUPPORTED",
  },
  {
    id: "SF-PA-T01-Q11", topicSlug: "platform-foundations-org-setup", objectiveId: "CS-01", blueprintDomain: "data-analytics", blueprintDomainRationale: "The competency is evidence-based capacity and storage governance.", concept: "Organization capacity", difficulty: "medium", type: "best-practice",
    prompt: "Before purchasing more Salesforce user licenses, an administrator wants to confirm current allocation and availability. What is the best first step?",
    answers: [{ id: "A", text: "Review report folder sharing" }, { id: "B", text: "Create a permission set group" }, { id: "C", text: "Change the default locale" }, { id: "D", text: "Review license totals in Company Information" }], correctAnswerId: "D",
    explanation: "Company Information provides license totals and usage, making it the right first capacity check. Permission configuration cannot create licenses, and locale or report sharing is unrelated. Review: Company Information.", reviewSection: "Company Information: know what the page tells you", supportStatus: "SUPPORTED",
  },
  {
    id: "SF-PA-T01-Q12", topicSlug: "platform-foundations-org-setup", objectiveId: "CS-01", blueprintDomain: "sales-marketing", blueprintDomainRationale: "Dated exchange rates are tested in their supported opportunity context.", concept: "Advanced Currency Management", difficulty: "hard", type: "configuration-choice",
    prompt: "Sales operations needs opportunity conversion rates to vary according to defined effective-date periods. Which option most directly addresses the requirement?",
    answers: [{ id: "A", text: "A custom fiscal year" }, { id: "B", text: "Advanced Currency Management with dated exchange rates" }, { id: "C", text: "A different personal locale for each salesperson" }, { id: "D", text: "Additional case business hours" }], correctAnswerId: "B",
    explanation: "Advanced Currency Management supports dated exchange rates for supported opportunity-related currency behavior. A fiscal year groups reporting periods, locale formats values, and business hours govern service schedules. Use this feature only when date-effective rates are the real requirement. Review: Currency management.", reviewSection: "Currency management", supportStatus: "SUPPORTED",
  },
  {
    id: "SF-PA-T01-Q13", topicSlug: "platform-foundations-org-setup", objectiveId: "CS-01", blueprintDomain: "configuration", concept: "Org default versus personal preference", difficulty: "hard", type: "administrative-decision",
    prompt: "A global organization has headquarters in New York. A new team in Tokyo needs Japanese UI text, Japanese date formats, and local timestamp display, while headquarters users must remain unchanged. What is the best approach?",
    answers: [{ id: "A", text: "Set appropriate personal language, locale, and time zone values for the Tokyo users" }, { id: "B", text: "Change the organization default locale, language, and time zone to Japan" }, { id: "C", text: "Create Tokyo business hours and assume they control all three display preferences" }, { id: "D", text: "Change the corporate currency to JPY" }], correctAnswerId: "A",
    explanation: "The requirement is scoped to a set of users, and language, locale, and time zone are distinct personal settings. Changing organization defaults would affect the broader population; business hours do not control UI display; corporate currency is unrelated. Review: Locale, language, and time zone.", reviewSection: "Locale, language, and time zone are different decisions", supportStatus: "SUPPORTED",
  },
  {
    id: "SF-PA-T01-Q14", topicSlug: "platform-foundations-org-setup", objectiveId: "CS-01", blueprintDomain: "data-analytics", blueprintDomainRationale: "The question tests governance and reversibility of a consequential data configuration.", concept: "Change impact and reversibility", difficulty: "hard", type: "best-practice",
    prompt: "Leadership asks an administrator to enable multiple currencies immediately because one prospect requested a quote in EUR. What is the best administrative response?",
    answers: [{ id: "A", text: "Change the default locale to a European locale instead" }, { id: "B", text: "Enable Advanced Currency Management without enabling multiple currencies" }, { id: "C", text: "Confirm the sustained business requirement and assess downstream effects before enabling multicurrency" }, { id: "D", text: "Change every user's personal currency to EUR" }], correctAnswerId: "C",
    explanation: "Multicurrency is an organization-wide, consequential configuration. Confirm that the requirement is durable and assess reporting, integrations, active currencies, and rate ownership before enabling it. Locale only changes presentation, advanced currency management is not a substitute, and personal currency does not establish organization capability. Review: Currency management and the final change checklist.", reviewSection: "Currency management", supportStatus: "SUPPORTED",
  },
];
