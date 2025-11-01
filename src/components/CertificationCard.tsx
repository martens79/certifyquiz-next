import Link from "next/link";
import Image from "next/image";


export function CertificationCard({
href,
title,
imageUrl,
level,
description,
badgeLabel,
}: {
href: string;
title: string;
imageUrl?: string | null;
level?: string | null;
description?: string | null;
badgeLabel?: string;
}) {
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
{badgeLabel ? (
<div className="mt-2 inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-900">
<span>{badgeLabel}</span>
</div>
) : null}
</div>
</div>
<div className="mt-3 text-sm font-semibold text-blue-600 group-hover:underline">Vai alla pagina →</div>
</Link>
);
}