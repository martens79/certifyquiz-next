import type { Locale } from "@/lib/paths";

export const SAP_CERTIFICATIONS = [
  { slug: "sap-s4hana-financial-accounting", title: "SAP S/4HANA Financial Accounting", available: true },
  { slug: "sap-s4hana-sourcing-procurement", title: "SAP S/4HANA Sourcing and Procurement", available: true },
  { slug: "sap-s4hana-sales", title: "SAP S/4HANA Sales", available: true },
  { slug: "sap-s4hana-production-planning", title: "SAP S/4HANA Production Planning and Manufacturing" },
  { slug: "sap-abap-cloud-developer", title: "SAP Back-End Developer – ABAP Cloud" },
  { slug: "sap-business-technology-platform", title: "SAP Business Technology Platform" },
  { slug: "sap-successfactors", title: "SAP SuccessFactors" },
  { slug: "sap-analytics-cloud", title: "SAP Analytics Cloud" },
] as const;

export const getSapCertification = (slug: string) =>
  SAP_CERTIFICATIONS.find((cert) => cert.slug === slug);

export const getSapPlaceholderCertification = (slug: string) =>
  SAP_CERTIFICATIONS.find((cert) => cert.slug === slug && !("available" in cert && cert.available));

export const BUSINESS_ECOSYSTEMS = [
  { key: "sap", title: "SAP", badge: "ERP · Finance · HR · Analytics", available: true },
  { key: "microsoft-365", title: "Microsoft 365", badge: "Productivity · Collaboration", available: false },
  { key: "salesforce", title: "Salesforce", badge: "CRM · Sales · Service", available: false },
  { key: "oracle-business", title: "Oracle Business Applications", badge: "ERP · HCM · Finance", available: false },
  { key: "servicenow", title: "ServiceNow", badge: "Workflows · ITSM · Automation", available: false },
] as const;

const categorySegment = (lang: Locale) =>
  lang === "it" ? "categorie" : lang === "es" ? "categorias" : "categories";

export const sapHubPath = (lang: Locale) => {
  const prefix = lang === "en" ? "" : `/${lang}`;
  return `${prefix}/${categorySegment(lang)}/business-applications/sap`;
};
