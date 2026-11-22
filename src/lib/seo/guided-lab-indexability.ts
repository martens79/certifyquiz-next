import type { Metadata } from "next";
import type { LabSlug } from "@/features/labs/lab-config";

/**
 * Guided certification labs render only a loading shell on the server and may
 * show a Premium preview to anonymous visitors. Do not index these thin pages.
 * Standalone public interactive labs keep their existing metadata behavior.
 */
export function isGuidedCertificationLab(lab: LabSlug): boolean {
  return lab.startsWith("ccst-networking-") ||
    lab.startsWith("ccst-cybersecurity-") ||
    lab.startsWith("ccna-") ||
    lab.startsWith("ceh-");
}

export function guidedLabRobotsMetadata(lab: LabSlug): Metadata {
  return isGuidedCertificationLab(lab)
    ? { robots: { index: false, follow: true } }
    : {};
}
