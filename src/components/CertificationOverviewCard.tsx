import Link from "next/link";

type OverviewItem = {
  id: number;
  title: string;
  href: string;
};

type Props = {
  certificationTitle: string;
  items: OverviewItem[];
  availableLabel: string;
  openLabel: string;
  moreLabel: string;
  accentClass: string;
};

function cleanTitle(title: string, certTitle: string) {
  const cleaned = title
    .replace(/^Ripasso rapido:\s*/i, "")
    .replace(/^Quick review:\s*/i, "")
    .replace(/^Révision rapide\s*:\s*/i, "")
    .replace(/^Repaso rápido:\s*/i, "")
    .replace(/^(?:Ripasso|Review|Révision|Repaso)\s+[^:]+\s*:\s*/i, "")
    .replace(new RegExp(`\\s*[–-]\\s*${certTitle}$`, "i"), "")
    .trim();
  if (!cleaned) return title;
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

export default function CertificationOverviewCard({
  certificationTitle,
  items,
  availableLabel,
  openLabel,
  moreLabel,
  accentClass,
}: Props) {
  const visibleItems = items.slice(0, 6);
  const hiddenCount = Math.max(items.length - visibleItems.length, 0);

  return (
    <article
      className={`flex min-h-[260px] flex-col rounded-2xl border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${accentClass}`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="line-clamp-2 text-lg font-extrabold text-slate-950">
            {certificationTitle}
          </h2>

          <p className="mt-1 text-sm font-semibold text-slate-600">
            {items.length} {availableLabel}
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-white/85 px-3 py-1 text-xs font-bold text-slate-700 shadow-sm">
          {items.length}
        </span>
      </div>

      <div className="flex-1 space-y-2">
        {visibleItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="group flex items-center justify-between gap-3 rounded-xl border border-white/80 bg-white/80 px-3 py-2 text-sm font-semibold text-slate-800 transition hover:border-blue-300 hover:bg-white"
          >
            <span className="line-clamp-1">
              {cleanTitle(item.title, certificationTitle)}
            </span>
            <span className="text-blue-700 group-hover:translate-x-0.5 transition">
              →
            </span>
          </Link>
        ))}

        {hiddenCount > 0 && (
          <p className="px-1 pt-1 text-xs font-bold text-slate-500">
            +{hiddenCount} {moreLabel}
          </p>
        )}
      </div>

      {visibleItems[0] && (
        <Link
          href={visibleItems[0].href}
          className="mt-4 inline-flex justify-end text-sm font-extrabold text-blue-700 hover:text-blue-900"
        >
          {openLabel} →
        </Link>
      )}
    </article>
  );
}