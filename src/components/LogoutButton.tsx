"use client";
import { useRouter, usePathname } from "next/navigation";
import { clearToken } from "@/lib/auth";

export default function LogoutButton({ label = "Logout" }: { label?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const lang = pathname?.match(/^\/(it|en|fr|es)(?:\/|$)/)?.[1] || "it";

  return (
    <button
      onClick={() => {
        clearToken();
        router.push(`/${lang}/login`);
      }}
      className="px-4 py-2 rounded-xl border hover:bg-neutral-50"
    >
      {label}
    </button>
  );
}
