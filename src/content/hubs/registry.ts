// src/content/hubs/registry.ts
import type { HubData } from "./vendor-domains/google-cloud";

import { googleCloudHub } from "./vendor-domains/google-cloud";
import { googleVendorHub } from "./vendors/google";

export const HUBS: HubData[] = [
  googleVendorHub,
  googleCloudHub,
];

export const HUBS_BY_SLUG: Record<string, HubData> = Object.fromEntries(
  HUBS.map((h) => [h.hubSlug, h])
);
