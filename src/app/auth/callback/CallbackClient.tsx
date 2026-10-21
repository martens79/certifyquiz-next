"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { backendUrl, setToken, authHeader, setUser } from "@/lib/auth";
import { safePostAuthRedirect } from "@/lib/conversion-context";

const safeRedirectPath = safePostAuthRedirect;

function loginPathFromRedirect(r: string) {
  const m = r.match(/^\/(it|fr|es)\b/);
  return m ? `/${m[1]}/login` : "/login";
}

export default function CallbackClient() {
  const router = useRouter();
  const sp = useSearchParams();
  // Il token viene tolto dall'URL (replaceState): senza guardia l'effetto ripartirebbe senza token
  // e rimanderebbe al login mentre l'accesso e' gia' avvenuto. Una sola esecuzione per visita.
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
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
