// src/content/hubs/registry.ts

import type { HubData } from "./vendor-domains/google-cloud";

/* ======================================================
   Vendor hubs (central pages)
   ====================================================== */
import { googleVendorHub } from "./vendors/google";
import { awsVendorHub } from "./vendors/aws";
import { microsoftVendorHub } from "./vendors/microsoft";
import { ciscoVendorHub } from "./vendors/cisco";

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
// (creali anche vuoti se serve, ma lo slug deve esistere)
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

/* ======================================================
   Cisco – vendor domains
   ====================================================== */
import { ciscoNetworkingHub } from "./vendor-domains/cisco-networking";
import { ciscoCcsTHub } from "./vendor-domains/cisco-ccst";
import { ciscoSecurityHub } from "./vendor-domains/cisco-security";

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

  /* ---------------- Cisco domains ---------------- */
  ciscoNetworkingHub,
  ciscoCcsTHub,
  ciscoSecurityHub,
] as const;

/**
 * HUBS_BY_SLUG
 * - lookup rapido per /hub/[slug]
 * - supporta vendor hub e vendor-domain hub
 */
export const HUBS_BY_SLUG: Record<
  string,
  HubData | (typeof HUBS)[number]
> = Object.fromEntries(HUBS.map((h) => [h.hubSlug, h]));
