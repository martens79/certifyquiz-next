import type { ReactNode } from "react";
import LayoutShellClient from "@/components/layout/LayoutShellClient";

export default function ProfileLayout({ children }: { children: ReactNode }) {
  // EN root route (/profile)
  return <LayoutShellClient lang="en">{children}</LayoutShellClient>;
}
