// src/components/layout/HeaderAuthSlot.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import type { Locale } from "@/lib/i18n";
import { withLang } from "@/lib/i18n";

import { authMe } from "@/lib/apiClient";
import {
  getToken,
  getUser,
  setUser,
  onUserChange,
  onTokenChange,
  logout,
  type MinimalUser,
} from "@/lib/auth";

type UI = {
  profile: string;
  login: string;
  logout: string;
  start: string;
};

export default function HeaderAuthSlot({
  lang,
  ui,
  isProfile,
  variant = "desktop",
  onNavigate,
}: {
  lang: Locale;
  ui: UI;
  isProfile: boolean;
  variant?: "desktop" | "drawer";
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const pathname =
    usePathname() || (lang === "en" ? "/" : withLang(lang, "/"));

  // ✅ MOUNT GATE: evita hydration mismatch (SSR==first client render)
  const [mounted, setMounted] = useState(false);

  // Stato auth SOLO lato client (inizialmente null per SSR match)
  const [user, setUserState] = useState<MinimalUser | null>(null);
  const [loading, setLoading] = useState(false);

  // Dropdown (desktop)
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // Evita doppie chiamate /me
  const refreshInFlight = useRef<Promise<void> | null>(null);

  const loginHref = useMemo(() => {
    return withLang(lang, `/login?redirect=${encodeURIComponent(pathname)}`);
  }, [lang, pathname]);

  const profileHref = useMemo(() => withLang(lang, "/profile"), [lang]);

  const isAdmin = user?.role === "admin";
  const isAuthed = !!user;

  const userLabel = useMemo(() => {
    return user?.username?.trim() || user?.email?.trim() || "Account";
  }, [user]);

  const initials = useMemo(() => {
    const p = String(userLabel).trim().split(/\s+/);
    return `${(p[0]?.[0] || "U").toUpperCase()}${(p[1]?.[0] || "").toUpperCase()}`.slice(
      0,
      2
    );
  }, [userLabel]);

  async function refreshMe() {
    if (refreshInFlight.current) return refreshInFlight.current;

    refreshInFlight.current = (async () => {
      const t = getToken();
      if (!t) {
        setUserState(null);
        return;
      }

      // Se ho già user in cache, UI stabile subito. Poi eventualmente /me aggiorna.
      const cached = getUser();
      if (cached) setUserState(cached);

      setLoading(true);
      try {
        const me = await authMe(); // { user }
        const u: MinimalUser = {
          id: me.user.id,
          email: me.user.email,
          username: me.user.username,
          role: me.user.role,
          premium: me.user.premium,
        };

        // Cache locale + event -> aggiorna header ovunque
        setUser(u, true);
        setUserState(u);
      } catch (e: any) {
        const status = e?.status ?? e?.response?.status;

        // Logout SOLO se token non valido
        if (status === 401 || status === 403) {
          logout();
          setUserState(null);
        } else {
          // rete/502: non distruggere sessione
        }
      } finally {
        setLoading(false);
        refreshInFlight.current = null;
      }
    })();

    return refreshInFlight.current;
  }

  // ✅ mount: ora possiamo leggere storage senza hydration mismatch
  useEffect(() => {
    setMounted(true);

    // dopo mount: bootstrap da cache, poi valida se serve
    const cached = getUser();
    if (cached) setUserState(cached);

    // Se ho token ma niente cached user -> chiamata /me
    const t = getToken();
    if (t && !cached) {
      refreshMe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ reattivo a login/logout: cq:token
  useEffect(() => {
    const offTok = onTokenChange((t) => {
      if (!t) {
        setUserState(null);
        return;
      }

      // token nuovo -> prova a leggere user cache subito + /me
      const cached = getUser();
      if (cached) setUserState(cached);
      refreshMe();
    });

    const offUser = onUserChange((u) => {
      setUserState(u);
    });

    return () => {
      offTok();
      offUser();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // click fuori (solo desktop)
  useEffect(() => {
    if (variant !== "desktop") return;

    function onDown(e: MouseEvent) {
      const t = e.target as Node;
      if (open && ref.current && !ref.current.contains(t)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open, variant]);

  // ---------- RENDER HELPERS ----------
  const RenderLoggedOutDesktop = () => (
    <>
      <Link
        href={loginHref}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100"
        onClick={onNavigate}
      >
        {ui.login}
      </Link>

      <Link
        href={withLang(lang, "/inizia")}
        className="rounded-md bg-gray-900 px-3 py-2 text-sm text-white hover:opacity-90"
        onClick={onNavigate}
      >
        {ui.start} 🚀
      </Link>
    </>
  );

  const RenderLoggedOutDrawer = () => (
    <div className="flex items-center gap-2">
      <Link
        href={loginHref}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100"
        onClick={onNavigate}
      >
        {ui.login}
      </Link>
      <Link
        href={withLang(lang, "/inizia")}
        className="rounded-md bg-gray-900 px-3 py-2 text-sm text-white hover:opacity-90"
        onClick={onNavigate}
      >
        {ui.start} 🚀
      </Link>
    </div>
  );

  // ✅ SSR/first-render MUST MATCH: sempre “logged out” finché non mounted
  if (!mounted) {
    return variant === "drawer" ? <RenderLoggedOutDrawer /> : <RenderLoggedOutDesktop />;
  }

  // Skeletonino mentre valida /me (solo se non c'è user)
  if (loading && !user) {
    if (variant === "drawer") {
      return <div className="h-10 w-full rounded-md border border-gray-200 bg-gray-50 animate-pulse" />;
    }
    return <div className="h-9 w-[160px] rounded-md border border-gray-200 bg-gray-50 animate-pulse" />;
  }

  // Drawer: semplice (niente dropdown)
  if (variant === "drawer") {
    if (!isAuthed) return <RenderLoggedOutDrawer />;

    return (
      <div className="flex items-center gap-2">
        <Link
          href={profileHref}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100"
          onClick={onNavigate}
        >
          {ui.profile}
        </Link>

        {isAdmin && (
          <Link
            href="/admin/feedback"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100"
            onClick={onNavigate}
          >
            Admin
          </Link>
        )}

        <button
          type="button"
          onClick={() => {
            logout();
            onNavigate?.();
            router.push(withLang(lang, "/login"));
          }}
          className="rounded-md border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          {ui.logout}
        </button>
      </div>
    );
  }

  // Desktop: non loggato
  if (!isAuthed) return <RenderLoggedOutDesktop />;

  // Desktop: loggato
  return (
    <div ref={ref} className="relative flex items-center">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-2 py-1.5 text-sm hover:bg-gray-50"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white">
          {initials}
        </div>
        <span className="max-w-[140px] truncate text-xs md:text-sm">
          {userLabel}
        </span>
        <span aria-hidden className="text-xs">
          ▾
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-10 w-44 rounded-md border bg-white shadow-lg"
        >
          {!isProfile && (
            <Link
              href={profileHref}
              className="block px-3 py-2 text-sm hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              {ui.profile}
            </Link>
          )}

          {isAdmin && (
            <>
              <div className="my-1 h-px bg-gray-200" />
              <Link
                href="/admin/feedback"
                className="block px-3 py-2 text-sm hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                Admin · Feedback
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={() => {
              logout();
              setOpen(false);
              router.push(withLang(lang, "/login"));
            }}
            className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
          >
            <span>{ui.logout}</span>
          </button>
        </div>
      )}
    </div>
  );
}