"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { backendUrl, setToken, authHeader, setUser } from "@/lib/auth";

function safeRedirectPath(p: string | null) {
  if (!p) return "/";
  if (!p.startsWith("/")) return "/";
  if (p.startsWith("//")) return "/";

  // ✅ alias profilo -> profile
  if (p === "/it/profilo") return "/it/profile";
  if (p === "/profilo") return "/profile";

  return p;
}

function loginPathFromRedirect(r: string) {
  const m = r.match(/^\/(it|fr|es)\b/);
  return m ? `/${m[1]}/login` : "/login";
}

export default function CallbackClient() {
  const router = useRouter();
  const sp = useSearchParams();

  useEffect(() => {
    const token = sp.get("token");
    const redirect = safeRedirectPath(sp.get("redirect"));
    const remember = (sp.get("remember") ?? "1") === "1";


    (async () => {
      if (!token) {
        router.replace(loginPathFromRedirect(redirect));
        return;
      }

      setToken(token, remember);

      // ✅ pulisci URL (evita token in history)
      window.history.replaceState(null, "", "/auth/callback");

      try {
        const meRes = await fetch(backendUrl("/auth/me"), {
          method: "GET",
          headers: { Accept: "application/json", ...authHeader() },
          credentials: "include",
          cache: "no-store",
        });
        if (meRes.ok) {
          const me = await meRes.json();
          setUser(me, remember);
        }
      } catch {}

      router.replace(redirect);
    })();
  }, [router, sp]);

  return (
    <div className="mx-auto max-w-md p-6 text-center text-sm text-gray-600">
      Sto completando il login…
    </div>
  );
}
