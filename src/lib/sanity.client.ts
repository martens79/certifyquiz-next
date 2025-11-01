import { createClient } from "next-sanity";

export const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: process.env.SANITY_API_VERSION || "2024-10-01",
  useCdn: true,              // true: più veloce, ok per public content
  perspective: "published",
});
