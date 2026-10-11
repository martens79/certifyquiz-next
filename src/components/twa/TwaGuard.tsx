"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTwa } from "@/hooks/useTwa";
import {
  TWA_HIDE_ATTRIBUTE,
  TWA_HTML_ATTRIBUTE,
  isPurchaseHref,
  isPurchasePath,
  localeFromPathname,
} from "@/lib/twa";
import TwaNotice from "./TwaNotice";

function markAnchor(el: Element) {
  if (el.tagName === "A" && isPurchaseHref(el.getAttribute("href"), location.origin)) {
    el.setAttribute(TWA_HIDE_ATTRIBUTE, "");
  }
}

function markTree(root: ParentNode) {
  root.querySelectorAll("a[href]").forEach(markAnchor);
}

/**
 * Guardia "consumption-only" per l'app Android (TWA). Montata una volta nel
 * layout; fuori dalla TWA non fa nulla (nessun listener, nessun render).
 *
 * In TWA:
 *  1. nasconde ogni link verso pricing / listino B2B / pagine di esito pagamento,
 *     anche quelli dentro blog, MDX e contenuti CMS;
 *  2. blocca il click su quei link (difesa in profondita');
 *  3. se la pagina corrente e' una di quelle pagine (deep link, router.push),
 *     la copre con un avviso neutro.
 * I punti che avviano un checkout (pricing, pacchetti, guide, portale) hanno in
 * piu' una guardia a livello di componente.
 */
export default function TwaGuard() {
  const isTwa = useTwa();
  const pathname = usePathname() ?? "";

  useEffect(() => {
    if (!isTwa) return;
    document.documentElement.setAttribute(TWA_HTML_ATTRIBUTE, "1");

    markTree(document);

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "attributes" && m.target instanceof Element) {
          markAnchor(m.target);
          continue;
        }
        m.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          markAnchor(node);
          markTree(node);
        });
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["href"],
    });

    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (target && isPurchaseHref(target.getAttribute("href"), location.origin)) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    document.addEventListener("click", onClick, true);

    return () => {
      observer.disconnect();
      document.removeEventListener("click", onClick, true);
    };
  }, [isTwa]);

  if (!isTwa || !isPurchasePath(pathname)) return null;
  return <TwaNotice lang={localeFromPathname(pathname)} variant="section" overlay />;
}
