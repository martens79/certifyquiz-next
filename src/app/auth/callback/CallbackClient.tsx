"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function safeRedirectPath(p: string | null) {
  if (!p) return "/";
  if (!p.startsWith("/")) return "/";
  if (p.startsWith("//")) return "/";
  return p;
}

export default function CallbackClient() {
  const router = useRouter();
  const sp = useSearchParams();

  useEffect(() => {
    const token = sp.get("token");
    const redirect = safeRedirectPath(sp.get("redirect"));

    if (token) {
      localStorage.setItem("auth_token", token);
      router.replace(redirect);
    } else {
      router.replace("/login");
    }
  }, [router, sp]);

  return (
    <div className="mx-auto max-w-md p-6 text-center text-sm text-gray-600">
      Sto completando il login…
    </div>
  );
}
