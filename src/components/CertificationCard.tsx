import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/lib/i18n";


export function CertificationCard({
href,
title,
imageUrl,
level,
description,
badgeLabel,
comingSoon,
lang,
}: {
href: string;
title: string;
imageUrl?: string | null;
level?: string | null;
description?: string | null;
badgeLabel?: string;
/** Landing-only certification (no quiz yet): no "try for free" promise, an explicit "coming soon" pill. */
comingSoon?: boolean;
lang: Locale;
}) {
const soonCta = lang === "it" ? "Scopri di più →" : lang === "fr" ? "En savoir plus →" : lang === "es" ? "Saber más →" : "Learn more →";
const soonPill = lang === "it" ? "Prossimamente" : lang === "fr" ? "Bientôt disponible" : lang === "es" ? "Próximamente" : "Coming soon";
const cta = comingSoon
? soonCta
: lang === "it"
? "Scopri e prova gratis →"
: lang === "fr"
? "Découvrir et essayer gratuitement →"
: lang === "es"
? "Descubrir y probar gratis →"
: "Explore and try free →";
return (
<Link
href={href}
className="group block rounded-xl p-4 shadow-md border border-blue-300 bg-white
transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg
dark:border-neutral-800 dark:bg-neutral-900"
>
<div className="flex items-start gap-4">
{imageUrl ? (
<div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-blue-300 bg-blue-100">
<Image src={imageUrl} alt="" fill sizes="56px" className="object-cover" />
</div>
) : (
<div className="h-14 w-14 shrink-0 rounded-xl border border-blue-300 bg-blue-100" />
)}
<div className="min-w-0 flex-1">
<h3 className="truncate text-base font-semibold leading-tight">{title}</h3>
{level ? <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">{level}</p> : null}
{description ? (
<p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-neutral-300">{description}</p>
) : null}
{comingSoon ? (
<span className="mt-2 inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-900">{soonPill}</span>
) : null}
{badgeLabel ? (
<div className="mt-2 inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-900">
<span>{badgeLabel}</span>
</div>
) : null}
</div>
</div>
<div className="mt-3 text-sm font-semibold text-blue-600 group-hover:underline">{cta}</div>
</Link>
);
}
