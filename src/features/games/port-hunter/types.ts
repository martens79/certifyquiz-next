import type { Locale } from "@/lib/i18n";

export type PortDifficulty = "basic" | "intermediate" | "advanced";
export type PortMode = "mixed" | "service-to-port" | "port-to-service";
export type Transport = "TCP" | "UDP";
export type PortEntry = {
  id: string; service: string; ports: readonly number[]; transports: readonly Transport[];
  difficulty: PortDifficulty; aliases?: readonly string[]; description: Record<Locale, string>;
};
export type PortQuestion = { id: string; direction: Exclude<PortMode,"mixed">; entry: PortEntry; options: readonly PortEntry[] };
