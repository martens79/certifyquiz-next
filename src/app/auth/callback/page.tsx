// src/app/auth/callback/page.tsx
// Bridge OAuth: salva token e redirecta (no UI, solo fallback testo)

"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function safeRedirectPath(p: string | null) {
  if (!p) return "/";
  if (!p.startsWith("/")) return "/";
  if (p.startsWith("//")) return "/";
  return p;
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const sp = useSearchParams();

  useEffect(() => {
    const token = sp.get("token");
    const redirect = safeRedirectPath(sp.get("redirect"));

    if (token) {
      // ✅ Persist token (equivalente a login classico)
      localStorage.setItem("auth_token", token);
    }

    // Se manca token, vai comunque al login
    router.replace(token ? redirect : "/login");
  }, [router, sp]);

  return (
    <div className="mx-auto max-w-md p-6 text-center text-sm text-gray-600">
      Sto completando il login…
    </div>
  );
}
