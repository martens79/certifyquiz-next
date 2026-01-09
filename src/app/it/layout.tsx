import type { ReactNode } from "react";
import LayoutShellClient from "@/components/layout/LayoutShellClient";

export default function Layout({ children }: { children: ReactNode }) {
  return <LayoutShellClient lang="it">{children}</LayoutShellClient>;
}
