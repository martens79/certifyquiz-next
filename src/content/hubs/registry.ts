// src/content/hubs/registry.ts
import type { HubData } from "./vendor-domains/google-cloud";

import { googleVendorHub } from "./vendors/google";

import { googleCloudHub } from "./vendor-domains/google-cloud";
import { googleAiHub } from "./vendor-domains/google-ai";
import { googleCareerHub } from "./vendor-domains/google-career";
import { googleMarketingHub } from "./vendor-domains/google-marketing";
import { googleEducationHub } from "./vendor-domains/google-education";

/**
 * Registry hubs:
 * - include both vendor hub (googleVendorHub) and vendorDomain hubs (HubData)
 * - vendor hub is NOT HubData, so we keep the array flexible.
 */
export const HUBS = [
  googleVendorHub,
  googleCloudHub,
  googleAiHub,
  googleCareerHub,
  googleMarketingHub,
  googleEducationHub,
] as const;

export const HUBS_BY_SLUG: Record<string, HubData | typeof googleVendorHub> =
  Object.fromEntries(HUBS.map((h) => [h.hubSlug, h]));
