"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // 👇 Evita mismatch SSR/CSR: lo stato "attivo" viene usato solo dopo il mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive =
    !!pathname && (pathname === href || (href !== "/" && pathname.startsWith(href)));

  const active = mounted && isActive;

  return (
    <Link
      href={href}
      className={cn(
        "px-3 py-2 rounded-md text-sm font-medium transition",
        active ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"
      )}
      aria-current={active ? "page" : undefined}
    >
      {children}
    </Link>
  );
}

// utility locale (la tieni uguale)
function cn(...cls: Array<string | false | null | undefined>) {
  return cls.filter(Boolean).join(" ");
}
