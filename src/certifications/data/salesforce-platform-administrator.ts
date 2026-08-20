import type { CertificationData } from "../types";

const D = {
  configuration: "Configuration and Setup",
  objects: "Object Manager and Lightning App Builder",
  sales: "Sales and Marketing Applications",
  service: "Service and Support Applications",
  productivity: "Productivity and Collaboration",
  data: "Data and Analytics Management",
  automation: "Automation",
  agentforce: "Agentforce",
} as const;

export const SALESFORCE_PLATFORM_ADMINISTRATOR_OBJECTIVES = [
  { id: "CS-01", domain: D.configuration, summary: "Company settings, fiscal year, business hours, currencies, and defaults", primaryTopicSlug: "platform-foundations-org-setup", secondaryTopicSlugs: [] },
  { id: "CS-02", domain: D.configuration, summary: "Declarative UI administration, app navigation, list views, actions, and Lightning pages", primaryTopicSlug: "objects-relationships-lightning-app-builder", secondaryTopicSlugs: ["platform-foundations-org-setup"] },
  { id: "CS-03", domain: D.configuration, summary: "User setup, maintenance, licenses, locale, activation state, and login methods", primaryTopicSlug: "users-authentication-access", secondaryTopicSlugs: [] },
  { id: "CS-04", domain: D.configuration, summary: "Organization security controls, identity verification, sessions, audit trail, and agent access", primaryTopicSlug: "users-authentication-access", secondaryTopicSlugs: ["permissions-record-sharing", "agentforce-fundamentals"] },
  { id: "CS-05", domain: D.configuration, summary: "Record access through organization defaults, hierarchy, groups, teams, sharing, and folders", primaryTopicSlug: "permissions-record-sharing", secondaryTopicSlugs: ["reports-dashboards"] },
  { id: "CS-06", domain: D.configuration, summary: "Profiles, permission sets, permission set groups, and muting", primaryTopicSlug: "permissions-record-sharing", secondaryTopicSlugs: ["users-authentication-access"] },
  { id: "OM-01", domain: D.objects, summary: "Standard objects and relationship architecture, including lookup, master-detail, and junction models", primaryTopicSlug: "objects-relationships-lightning-app-builder", secondaryTopicSlugs: [] },
  { id: "OM-02", domain: D.objects, summary: "Fields and page layouts, formulas, roll-ups, dependencies, and deletion implications", primaryTopicSlug: "objects-relationships-lightning-app-builder", secondaryTopicSlugs: ["validation-flow-automation"] },
  { id: "OM-03", domain: D.objects, summary: "Assign layouts, Lightning visibility, record types, business processes, and actions", primaryTopicSlug: "objects-relationships-lightning-app-builder", secondaryTopicSlugs: ["permissions-record-sharing"] },
  { id: "SM-01", domain: D.sales, summary: "Sales process capabilities and implications for leads, opportunities, and Path", primaryTopicSlug: "sales-marketing", secondaryTopicSlugs: [] },
  { id: "SM-02", domain: D.sales, summary: "Sales productivity, scoring, forecasting, territory management, dashboards, and assistants", primaryTopicSlug: "sales-marketing", secondaryTopicSlugs: ["reports-dashboards"] },
  { id: "SM-03", domain: D.sales, summary: "Lead automation, conversion, assignment rules, campaigns, and campaign members", primaryTopicSlug: "sales-marketing", secondaryTopicSlugs: ["validation-flow-automation"] },
  { id: "SS-01", domain: D.service, summary: "Case management, assignment rules, and queues", primaryTopicSlug: "service-support", secondaryTopicSlugs: [] },
  { id: "SS-02", domain: D.service, summary: "Support processes, auto-response, escalation, and Service automation", primaryTopicSlug: "service-support", secondaryTopicSlugs: ["validation-flow-automation"] },
  { id: "PC-01", domain: D.productivity, summary: "Task and event activity management", primaryTopicSlug: "productivity-collaboration", secondaryTopicSlugs: [] },
  { id: "PC-02", domain: D.productivity, summary: "Chatter groups and internal or external group access", primaryTopicSlug: "productivity-collaboration", secondaryTopicSlugs: ["permissions-record-sharing"] },
  { id: "PC-03", domain: D.productivity, summary: "Salesforce mobile app configuration, navigation, visibility, and branding", primaryTopicSlug: "productivity-collaboration", secondaryTopicSlugs: ["objects-relationships-lightning-app-builder"] },
  { id: "PC-04", domain: D.productivity, summary: "AppExchange use cases, package types, publishing constraints, prompts, and flows", primaryTopicSlug: "productivity-collaboration", secondaryTopicSlugs: ["agentforce-fundamentals", "validation-flow-automation"] },
  { id: "DA-01", domain: D.data, summary: "Import, update, transfer, mass delete, export, backup, and archival considerations", primaryTopicSlug: "data-quality-governance", secondaryTopicSlugs: [] },
  { id: "DA-02", domain: D.data, summary: "Duplicate, matching, and validation rules for data quality", primaryTopicSlug: "data-quality-governance", secondaryTopicSlugs: ["validation-flow-automation"] },
  { id: "DA-03", domain: D.data, summary: "Report types, report customization, formulas, buckets, joined reports, charts, and troubleshooting", primaryTopicSlug: "reports-dashboards", secondaryTopicSlugs: ["objects-relationships-lightning-app-builder"] },
  { id: "DA-04", domain: D.data, summary: "Impact of sharing and folder access on report visibility", primaryTopicSlug: "reports-dashboards", secondaryTopicSlugs: ["permissions-record-sharing"] },
  { id: "DA-05", domain: D.data, summary: "Dashboard components, data sources, filters, subscriptions, refresh, dynamic dashboards, and limits", primaryTopicSlug: "reports-dashboards", secondaryTopicSlugs: [] },
  { id: "AU-01", domain: D.automation, summary: "Choose an appropriate automation solution for the scenario", primaryTopicSlug: "validation-flow-automation", secondaryTopicSlugs: ["sales-marketing", "service-support"] },
  { id: "AU-02", domain: D.automation, summary: "Flow capabilities, use cases, configuration, types, and order of execution", primaryTopicSlug: "validation-flow-automation", secondaryTopicSlugs: ["objects-relationships-lightning-app-builder"] },
  { id: "AU-03", domain: D.automation, summary: "Approval process capabilities, criteria, approvals, and rejections", primaryTopicSlug: "validation-flow-automation", secondaryTopicSlugs: [] },
  { id: "AF-01", domain: D.agentforce, summary: "Agentforce capabilities, suitable use cases, security, and permission troubleshooting", primaryTopicSlug: "agentforce-fundamentals", secondaryTopicSlugs: ["users-authentication-access", "permissions-record-sharing", "data-quality-governance"] },
  { id: "AF-02", domain: D.agentforce, summary: "Maintain prompts and instructions in Agent Builder and use preview or light testing", primaryTopicSlug: "agentforce-fundamentals", secondaryTopicSlugs: ["validation-flow-automation"] },
] as const;

export const SALESFORCE_PLATFORM_ADMINISTRATOR_TOPIC_CONTRACT = [
  { order: 1, slug: "platform-foundations-org-setup", titleEn: "Platform Foundations and Org Setup", purpose: "Establish the org-level context and settings required by every later administration task.", blueprintDomains: [D.configuration], officialObjectiveIds: ["CS-01"], prerequisites: [], coreConcepts: ["org settings", "fiscal year", "business hours", "currency", "navigation context"], commonMistakes: ["confusing org defaults with user preferences", "changing foundational settings without impact analysis"], crossTopicDependencies: ["users-authentication-access", "objects-relationships-lightning-app-builder"], mvpQuizCount: 14, targetExpandedQuizCount: 30, predominantDifficulty: "foundational", allocationRationale: "Small primary scope but foundational context recurs across configuration scenarios.", reviewRequired: true, scenarioPriority: "medium", scenarioCount: 2, futureLabSuitability: "medium" },
  { order: 2, slug: "users-authentication-access", titleEn: "Users, Authentication, and Access Foundations", purpose: "Administer user lifecycle, licenses, login methods, sessions, and identity controls.", blueprintDomains: [D.configuration, D.agentforce], officialObjectiveIds: ["CS-03", "CS-04"], prerequisites: ["platform-foundations-org-setup"], coreConcepts: ["users", "licenses", "authentication", "sessions", "identity verification"], commonMistakes: ["deleting instead of deactivating users", "mixing authentication controls with record authorization"], crossTopicDependencies: ["permissions-record-sharing", "agentforce-fundamentals"], mvpQuizCount: 20, targetExpandedQuizCount: 42, predominantDifficulty: "intermediate", allocationRationale: "High operational frequency and prerequisite for security and Agentforce administration.", reviewRequired: true, scenarioPriority: "high", scenarioCount: 3, futureLabSuitability: "high" },
  { order: 3, slug: "permissions-record-sharing", titleEn: "Permissions and Record Sharing", purpose: "Select the correct object, field, record, team, and folder access mechanism.", blueprintDomains: [D.configuration, D.data, D.productivity, D.agentforce], officialObjectiveIds: ["CS-05", "CS-06"], prerequisites: ["users-authentication-access"], coreConcepts: ["profiles", "permission sets", "organization-wide defaults", "role hierarchy", "sharing rules"], commonMistakes: ["using profiles for every exception", "confusing object permission with record access"], crossTopicDependencies: ["reports-dashboards", "agentforce-fundamentals"], mvpQuizCount: 24, targetExpandedQuizCount: 55, predominantDifficulty: "advanced", allocationRationale: "Dense decision space with broad cross-domain impact and many plausible distractors.", reviewRequired: true, scenarioPriority: "high", scenarioCount: 4, futureLabSuitability: "high" },
  { order: 4, slug: "objects-relationships-lightning-app-builder", titleEn: "Objects, Relationships, and Lightning App Builder", purpose: "Design the data model and declarative user experience for standard and custom applications.", blueprintDomains: [D.objects, D.configuration, D.data], officialObjectiveIds: ["CS-02", "OM-01", "OM-02", "OM-03"], prerequisites: ["platform-foundations-org-setup", "permissions-record-sharing"], coreConcepts: ["objects", "relationships", "fields", "record types", "page layouts", "Lightning pages"], commonMistakes: ["choosing the wrong relationship type", "confusing page layout and Lightning page visibility"], crossTopicDependencies: ["data-quality-governance", "validation-flow-automation"], mvpQuizCount: 22, targetExpandedQuizCount: 50, predominantDifficulty: "intermediate", allocationRationale: "Four primary objectives and strong links to validation, analytics, and automation.", reviewRequired: true, scenarioPriority: "high", scenarioCount: 3, futureLabSuitability: "high" },
  { order: 5, slug: "sales-marketing", titleEn: "Sales and Marketing Applications", purpose: "Apply Sales Cloud processes, productivity features, lead automation, and campaign capabilities.", blueprintDomains: [D.sales, D.automation], officialObjectiveIds: ["SM-01", "SM-02", "SM-03"], prerequisites: ["objects-relationships-lightning-app-builder"], coreConcepts: ["leads", "opportunities", "Path", "forecasting", "territories", "campaigns"], commonMistakes: ["confusing lead assignment with conversion", "selecting analytics features as transaction automation"], crossTopicDependencies: ["reports-dashboards", "validation-flow-automation"], mvpQuizCount: 18, targetExpandedQuizCount: 40, predominantDifficulty: "intermediate", allocationRationale: "Covers the complete 10% sales domain plus automation and reporting decisions.", reviewRequired: true, scenarioPriority: "high", scenarioCount: 3, futureLabSuitability: "medium" },
  { order: 6, slug: "service-support", titleEn: "Service and Support Applications", purpose: "Configure case management and select the correct service automation mechanism.", blueprintDomains: [D.service, D.automation], officialObjectiveIds: ["SS-01", "SS-02"], prerequisites: ["objects-relationships-lightning-app-builder"], coreConcepts: ["cases", "queues", "assignment", "auto-response", "escalation", "support processes"], commonMistakes: ["confusing assignment and escalation", "overlooking queue ownership"], crossTopicDependencies: ["validation-flow-automation"], mvpQuizCount: 18, targetExpandedQuizCount: 40, predominantDifficulty: "intermediate", allocationRationale: "Two broad scenario objectives cover the full 10% service domain.", reviewRequired: true, scenarioPriority: "high", scenarioCount: 2, futureLabSuitability: "medium" },
  { order: 7, slug: "productivity-collaboration", titleEn: "Productivity and Collaboration", purpose: "Administer activities, collaboration, mobile experiences, and package selection.", blueprintDomains: [D.productivity, D.configuration], officialObjectiveIds: ["PC-01", "PC-02", "PC-03", "PC-04"], prerequisites: ["users-authentication-access"], coreConcepts: ["activities", "Chatter", "mobile app", "AppExchange", "packages"], commonMistakes: ["assuming group access follows record access", "confusing managed and unmanaged package implications"], crossTopicDependencies: ["permissions-record-sharing", "objects-relationships-lightning-app-builder"], mvpQuizCount: 14, targetExpandedQuizCount: 28, predominantDifficulty: "foundational", allocationRationale: "Four bounded objectives with lower configuration depth than security or automation.", reviewRequired: true, scenarioPriority: "low", scenarioCount: 0, futureLabSuitability: "low" },
{ order: 8, slug: "data-quality-governance", titleEn: "Data Quality and Governance", purpose: "Protect data quality and choose safe lifecycle operations for enterprise records.", blueprintDomains: [D.data, D.agentforce], officialObjectiveIds: ["DA-01", "DA-02"], prerequisites: ["objects-relationships-lightning-app-builder"], coreConcepts: ["import", "Data Loader", "Import Wizard", "export", "backup", "duplicates", "validation"], commonMistakes: ["choosing tools without volume and rollback constraints", "mixing duplicate prevention with field validation"], crossTopicDependencies: ["reports-dashboards", "validation-flow-automation", "agentforce-fundamentals"], mvpQuizCount: 15, targetExpandedQuizCount: 50, predominantDifficulty: "intermediate", allocationRationale: "High blueprint weight and foundational relevance to analytics, automation, and trusted AI.", reviewRequired: true, scenarioPriority: "high", scenarioCount: 4, futureLabSuitability: "high" },
  { order: 9, slug: "reports-dashboards", titleEn: "Reports and Dashboards", purpose: "Build, secure, and troubleshoot reporting and dashboard solutions.", blueprintDomains: [D.data, D.configuration, D.sales], officialObjectiveIds: ["DA-03", "DA-04", "DA-05"], prerequisites: ["data-quality-governance", "permissions-record-sharing"], coreConcepts: ["report types", "filters", "formulas", "joined reports", "folders", "dynamic dashboards"], commonMistakes: ["ignoring sharing when troubleshooting visibility", "confusing running user with folder access"], crossTopicDependencies: ["sales-marketing"], mvpQuizCount: 12, targetExpandedQuizCount: 35, predominantDifficulty: "intermediate", allocationRationale: "Three analytics objectives with exact configuration and troubleshooting choices.", reviewRequired: true, scenarioPriority: "medium", scenarioCount: 2, futureLabSuitability: "high" },
  { order: 10, slug: "validation-flow-automation", titleEn: "Validation, Flow, and Automation", purpose: "Choose and configure declarative automation while respecting validation and execution behavior.", blueprintDomains: [D.automation, D.data, D.sales, D.service, D.objects], officialObjectiveIds: ["AU-01", "AU-02", "AU-03"], prerequisites: ["objects-relationships-lightning-app-builder", "data-quality-governance", "permissions-record-sharing"], coreConcepts: ["automation selection", "Flow types", "order of execution", "approval processes", "validation rules"], commonMistakes: ["using Flow when a purpose-built rule is clearer", "ignoring order of execution and recursion"], crossTopicDependencies: ["sales-marketing", "service-support", "agentforce-fundamentals"], mvpQuizCount: 28, targetExpandedQuizCount: 60, predominantDifficulty: "advanced", allocationRationale: "Large 15% domain plus cross-domain automation decisions and the highest expansion capacity.", reviewRequired: true, scenarioPriority: "high", scenarioCount: 5, futureLabSuitability: "high" },
  { order: 11, slug: "agentforce-fundamentals", titleEn: "Agentforce Administration Fundamentals", purpose: "Recognize appropriate agent use cases and administer permissions, prompts, instructions, and basic testing.", blueprintDomains: [D.agentforce, D.configuration, D.data], officialObjectiveIds: ["AF-01", "AF-02"], prerequisites: ["users-authentication-access", "permissions-record-sharing", "data-quality-governance", "validation-flow-automation"], coreConcepts: ["use-case fit", "trusted data", "agent permissions", "prompts", "instructions", "conversation preview"], commonMistakes: ["treating Agentforce as an expert implementation domain", "ignoring data access and guardrails"], crossTopicDependencies: ["users-authentication-access", "permissions-record-sharing", "data-quality-governance"], mvpQuizCount: 15, targetExpandedQuizCount: 20, predominantDifficulty: "foundational", allocationRationale: "Dedicated 8% domain with a deliberately bounded administrator-level scope.", reviewRequired: true, scenarioPriority: "high", scenarioCount: 2, futureLabSuitability: "medium" },
] as const;

export const SALESFORCE_PLATFORM_ADMINISTRATOR_DOMAIN_QUIZ_ALLOCATION = [
  { domain: D.configuration, quizCount: 30 }, { domain: D.objects, quizCount: 30 },
  { domain: D.sales, quizCount: 20 }, { domain: D.service, quizCount: 20 },
  { domain: D.productivity, quizCount: 20 }, { domain: D.data, quizCount: 34 },
  { domain: D.automation, quizCount: 30 }, { domain: D.agentforce, quizCount: 16 },
] as const;

export const SALESFORCE_PLATFORM_ADMINISTRATOR_SCENARIO_GROUPS = [
  { id: "access-authentication", topicSlug: "users-authentication-access", blueprintObjectiveIds: ["CS-03", "CS-04"], count: 3, competency: "Administer user access and authentication", difficulty: "intermediate", requiresRationale: true },
  { id: "permissions-sharing", topicSlug: "permissions-record-sharing", blueprintObjectiveIds: ["CS-05", "CS-06"], count: 4, competency: "Select least-privilege access controls", difficulty: "advanced", requiresRationale: true },
  { id: "objects-ui", topicSlug: "objects-relationships-lightning-app-builder", blueprintObjectiveIds: ["CS-02", "OM-01", "OM-02", "OM-03"], count: 3, competency: "Design declarative data and UI solutions", difficulty: "intermediate", requiresRationale: true },
  { id: "data-management", topicSlug: "data-quality-governance", blueprintObjectiveIds: ["DA-01", "DA-02"], count: 4, competency: "Choose safe data operations and quality controls", difficulty: "intermediate", requiresRationale: true },
  { id: "flow-validation", topicSlug: "validation-flow-automation", blueprintObjectiveIds: ["AU-01", "AU-02", "AU-03", "DA-02"], count: 5, competency: "Choose and troubleshoot declarative automation", difficulty: "advanced", requiresRationale: true },
  { id: "reports", topicSlug: "reports-dashboards", blueprintObjectiveIds: ["DA-03", "DA-04", "DA-05"], count: 2, competency: "Design and troubleshoot analytics access", difficulty: "intermediate", requiresRationale: true },
  { id: "sales", topicSlug: "sales-marketing", blueprintObjectiveIds: ["SM-01", "SM-02", "SM-03"], count: 3, competency: "Apply Sales Cloud processes and tools", difficulty: "intermediate", requiresRationale: true },
  { id: "service", topicSlug: "service-support", blueprintObjectiveIds: ["SS-01", "SS-02"], count: 2, competency: "Configure case management and automation", difficulty: "intermediate", requiresRationale: true },
  { id: "troubleshooting", topicSlug: "platform-foundations-org-setup", blueprintObjectiveIds: ["CS-01", "CS-02", "AU-01"], count: 2, competency: "Diagnose cross-feature administration issues", difficulty: "advanced", requiresRationale: true },
  { id: "agentforce", topicSlug: "agentforce-fundamentals", blueprintObjectiveIds: ["AF-01", "AF-02"], count: 2, competency: "Apply Agentforce guardrails and basic administration", difficulty: "intermediate", requiresRationale: true },
] as const;

const REVIEW_CONTRACT = {
  requiredSections: ["learning objectives", "concepts", "exam traps", "common mistakes", "decision rules", "comparisons", "mini-scenarios", "checklist", "related topics", "blueprint objectives covered"],
  requiresLastVerifiedAt: true,
} as const;

/**
 * Phase A contract only. `planned` keeps the slug and blueprint resolvable in
 * the registry while CertificationDetailView prevents a thin public page.
 */
const SalesforcePlatformAdministrator: CertificationData = {
  slug: "salesforce-platform-administrator",
  publicationStatus: "published",
  imageUrl: "/images/certifications/salesforce-platform-administrator.svg",
  officialUrl:
    "https://trailhead.salesforce.com/en/credentials/platformadministrator",
  lifecycleStatus: "active",

  title: {
    it: "Salesforce Certified Platform Administrator",
    en: "Salesforce Certified Platform Administrator",
    fr: "Salesforce Certified Platform Administrator",
    es: "Salesforce Certified Platform Administrator",
  },
  level: { it: "Associate", en: "Associate", fr: "Associé", es: "Asociado" },
  description: {
    it: "Preparazione completa per Salesforce Certified Platform Administrator: configurazione, sicurezza, dati, vendite, assistenza, collaborazione, analytics, Flow e Agentforce.",
    en: "Complete preparation for Salesforce Certified Platform Administrator: configuration, security, data, sales, service, collaboration, analytics, Flow, and Agentforce.",
    fr: "Préparation complète à Salesforce Certified Platform Administrator : configuration, sécurité, données, ventes, service, collaboration, analytique, Flow et Agentforce.",
    es: "Preparación completa para Salesforce Certified Platform Administrator: configuración, seguridad, datos, ventas, servicio, colaboración, analítica, Flow y Agentforce.",
  },
  metaTitle: {
    it: "Salesforce Platform Administrator — Quiz e preparazione esame",
    en: "Salesforce Platform Administrator — Practice Quiz and Exam Prep",
    fr: "Salesforce Platform Administrator — Quiz et préparation à l'examen",
    es: "Salesforce Platform Administrator — Quiz y preparación del examen",
  },
  metaDescription: {
    it: "Allenati con 200 domande organizzate sugli otto domini ufficiali dell'esame Salesforce Platform Administrator.",
    en: "Practice with 200 questions organized around the eight official Salesforce Platform Administrator exam domains.",
    fr: "Entraînez-vous avec 200 questions organisées selon les huit domaines officiels de l'examen Salesforce Platform Administrator.",
    es: "Practica con 200 preguntas organizadas según los ocho dominios oficiales del examen Salesforce Platform Administrator.",
  },

  examBlueprint: {
    provider: "Salesforce",
    examName: "Salesforce Certified Platform Administrator",
    examVersion: null,
    officialSourceName:
      "What the Salesforce Certified Platform Administrator Exam Update Means for Admins",
    officialSourceUrl:
      "https://admin.salesforce.com/blog/2026/what-the-salesforce-certified-platform-administrator-exam-update-means-for-admins",
    officialExamPageUrl:
      "https://trailhead.salesforce.com/en/credentials/platformadministrator",
    lastVerifiedAt: "2026-08-20",
    note: "Blueprint refresh effective 2025-12-15; verify again before publication.",
    domains: [
      { name: "Configuration and Setup", percentage: 15 },
      { name: "Object Manager and Lightning App Builder", percentage: 15 },
      { name: "Sales and Marketing Applications", percentage: 10 },
      { name: "Service and Support Applications", percentage: 10 },
      { name: "Productivity and Collaboration", percentage: 10 },
      { name: "Data and Analytics Management", percentage: 17 },
      { name: "Automation", percentage: 15 },
      { name: "Agentforce", percentage: 8 },
    ],
  },

  taxonomy: {
    officialObjectives: SALESFORCE_PLATFORM_ADMINISTRATOR_OBJECTIVES,
    topics: SALESFORCE_PLATFORM_ADMINISTRATOR_TOPIC_CONTRACT,
    domainQuizAllocation: SALESFORCE_PLATFORM_ADMINISTRATOR_DOMAIN_QUIZ_ALLOCATION,
    scenarioGroups: SALESFORCE_PLATFORM_ADMINISTRATOR_SCENARIO_GROUPS,
    reviewContract: REVIEW_CONTRACT,
  },

  topics: SALESFORCE_PLATFORM_ADMINISTRATOR_TOPIC_CONTRACT.map((topic) => ({
    title: {
      en: topic.titleEn,
      it: ({
        "platform-foundations-org-setup":"Fondamenti della piattaforma e configurazione dell'organizzazione","users-authentication-access":"Utenti, autenticazione e accesso","permissions-record-sharing":"Autorizzazioni e condivisione dei record","objects-relationships-lightning-app-builder":"Oggetti, relazioni e Lightning App Builder","sales-marketing":"Applicazioni di vendita e marketing","service-support":"Applicazioni di assistenza e supporto","productivity-collaboration":"Produttività e collaborazione","data-quality-governance":"Qualità e governance dei dati","reports-dashboards":"Report e dashboard","validation-flow-automation":"Convalida, Flow e automazione","agentforce-fundamentals":"Fondamenti di amministrazione Agentforce"} as Record<string,string>)[topic.slug],
      fr: ({
        "platform-foundations-org-setup":"Fondements de la plateforme et configuration de l'organisation","users-authentication-access":"Utilisateurs, authentification et accès","permissions-record-sharing":"Autorisations et partage des enregistrements","objects-relationships-lightning-app-builder":"Objets, relations et Lightning App Builder","sales-marketing":"Applications de vente et marketing","service-support":"Applications de service et d'assistance","productivity-collaboration":"Productivité et collaboration","data-quality-governance":"Qualité et gouvernance des données","reports-dashboards":"Rapports et tableaux de bord","validation-flow-automation":"Validation, Flow et automatisation","agentforce-fundamentals":"Fondements de l'administration Agentforce"} as Record<string,string>)[topic.slug],
      es: ({
        "platform-foundations-org-setup":"Fundamentos de la plataforma y configuración de la organización","users-authentication-access":"Usuarios, autenticación y acceso","permissions-record-sharing":"Permisos y uso compartido de registros","objects-relationships-lightning-app-builder":"Objetos, relaciones y Lightning App Builder","sales-marketing":"Aplicaciones de ventas y marketing","service-support":"Aplicaciones de servicio y soporte","productivity-collaboration":"Productividad y colaboración","data-quality-governance":"Calidad y gobierno de datos","reports-dashboards":"Informes y paneles","validation-flow-automation":"Validación, Flow y automatización","agentforce-fundamentals":"Fundamentos de administración de Agentforce"} as Record<string,string>)[topic.slug],
    },
    slug: { it: topic.slug, en: topic.slug, fr: topic.slug, es: topic.slug },
  })),
  quizRoute: {
    it: "/it/quiz/salesforce-platform-administrator",
    en: "/en/quiz/salesforce-platform-administrator",
    fr: "/fr/quiz/salesforce-platform-administrator",
    es: "/es/quiz/salesforce-platform-administrator",
  },
  backRoute: {
    it: "/it/certificazioni",
    en: "/certifications",
    fr: "/fr/certifications",
    es: "/es/certificaciones",
  },
};

export default SalesforcePlatformAdministrator;
