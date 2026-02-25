// src/content/hubs/registry.ts

import type { HubData } from "./vendor-domains/google-cloud";

/* ======================================================
   Vendor hubs (central pages)
   ====================================================== */
import { googleVendorHub } from "./vendors/google";
import { awsVendorHub } from "./vendors/aws";
import { microsoftVendorHub } from "./vendors/microsoft";
import { ciscoVendorHub } from "./vendors/cisco";
import { ibmVendorHub } from "./vendors/ibm";
import { oracleVendorHub } from "./vendors/oracle";
import { comptiaVendorHub } from "./vendors/comptia";
import { isc2VendorHub } from "./vendors/isc2"; // ✅ NEW

/* ======================================================
   Google – vendor domains
   ====================================================== */
import { googleCloudHub } from "./vendor-domains/google-cloud";
import { googleAiHub } from "./vendor-domains/google-ai";
import { googleCareerHub } from "./vendor-domains/google-career";
import { googleMarketingHub } from "./vendor-domains/google-marketing";
import { googleEducationHub } from "./vendor-domains/google-education";

/* ======================================================
   AWS – vendor domains
   ====================================================== */
import { awsCloudHub } from "./vendor-domains/aws-cloud";
import { awsArchitectureHub } from "./vendor-domains/aws-architecture";
import { awsDevOpsHub } from "./vendor-domains/aws-devops";
import { awsSecurityHub } from "./vendor-domains/aws-security";
import { awsDataHub } from "./vendor-domains/aws-data";

/* ======================================================
   Microsoft – vendor domains
   ====================================================== */
import { microsoftAzureHub } from "./vendor-domains/microsoft-azure";
import { microsoftSecurityHub } from "./vendor-domains/microsoft-security";
import { microsoftDataHub } from "./vendor-domains/microsoft-data";
import { microsoftDevHub } from "./vendor-domains/microsoft-dev";
import { microsoftAiHub } from "./vendor-domains/microsoft-ai";

/* ======================================================
   Cisco – vendor domains
   ====================================================== */
import { ciscoNetworkingHub } from "./vendor-domains/cisco-networking";
import { ciscoCcsTHub } from "./vendor-domains/cisco-ccst";
import { ciscoSecurityHub } from "./vendor-domains/cisco-security";

/* ======================================================
   CompTIA – vendor domains
   ====================================================== */
import { comptiaFoundationsHub } from "./vendor-domains/comptia-foundations";
import { comptiaSecurityHub } from "./vendor-domains/comptia-security";
import { comptiaNetworkingHub } from "./vendor-domains/comptia-networking";
import { comptiaCloudHub } from "./vendor-domains/comptia-cloud";

/* ======================================================
   IBM – vendor domains
   ====================================================== */
import { ibmCloudHub } from "./vendor-domains/ibm-cloud";

/* ======================================================
   Oracle – vendor domains
   ====================================================== */
import { oracleDatabaseHub } from "./vendor-domains/oracle-database";

/* ======================================================
   ISC2 – vendor domains
   ====================================================== */
import { isc2SecurityHub } from "./vendor-domains/isc2-security"; // ✅ NEW

/**
 * HUBS
 * - include BOTH vendor hubs and vendor-domain hubs
 * - order does not matter, slug mapping is used
 */
export const HUBS = [
  /* ---------------- Vendor hubs ---------------- */
  googleVendorHub,
  awsVendorHub,
  microsoftVendorHub,
  ciscoVendorHub,
  comptiaVendorHub,
  ibmVendorHub,
  oracleVendorHub,
  isc2VendorHub, // ✅ NEW

  /* ---------------- Google domains ---------------- */
  googleCloudHub,
  googleAiHub,
  googleCareerHub,
  googleMarketingHub,
  googleEducationHub,

  /* ---------------- AWS domains ---------------- */
  awsCloudHub,
  awsArchitectureHub,
  awsDevOpsHub,
  awsSecurityHub,
  awsDataHub,

  /* ---------------- Microsoft domains ---------------- */
  microsoftAzureHub,
  microsoftSecurityHub,
  microsoftDataHub,
  microsoftDevHub,
  microsoftAiHub,

  /* ---------------- Cisco domains ---------------- */
  ciscoNetworkingHub,
  ciscoCcsTHub,
  ciscoSecurityHub,

  /* ---------------- CompTIA domains ---------------- */
  comptiaFoundationsHub,
  comptiaSecurityHub,
  comptiaNetworkingHub,
  comptiaCloudHub,

  /* ---------------- IBM domains ---------------- */
  ibmCloudHub,

  /* ---------------- Oracle domains ---------------- */
  oracleDatabaseHub,

  /* ---------------- ISC2 domains ---------------- */
  isc2SecurityHub, // ✅ NEW
] as const;

/**
 * HUBS_BY_SLUG
 * - lookup rapido per /hub/[slug]
 * - supporta vendor hub e vendor-domain hub
 */
export const HUBS_BY_SLUG: Record<string, HubData | (typeof HUBS)[number]> =
  Object.fromEntries(HUBS.map((h) => [h.hubSlug, h]));