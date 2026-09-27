import type { Metadata } from "next";
import OffensiveSecurityPathPage from "@/features/offensive-path/OffensiveSecurityPathPage";
import { buildOffensivePathMetadata } from "@/features/offensive-path/metadata";

// Live counts / CEH lab list are ISR-cached for 1h (see features/offensive-path/data.ts).
export const revalidate = 3600;

export const metadata: Metadata = buildOffensivePathMetadata("en");

export default function Page() {
  return <OffensiveSecurityPathPage lang="en" />;
}
