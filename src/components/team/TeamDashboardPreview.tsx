"use client";

import { useEffect, useState } from "react";

type Status = "in-progress" | "passed" | "behind";

type Member = {
  initials: string;
  name: string;
  cert: string;
  target: number;
  status: Status;
};

type Props = {
  teamLabel?: string;
  liveLabel?: string;
  members?: Member[];
  statusLabels?: Record<Status, string>;
};

const DEFAULT_MEMBERS: Member[] = [
  { initials: "MR", name: "Marco R.", cert: "AWS Solutions Architect", target: 92, status: "passed" },
  { initials: "GS", name: "Giulia S.", cert: "Cisco CCNA", target: 64, status: "in-progress" },
  { initials: "AF", name: "Andrea F.", cert: "Security+", target: 38, status: "behind" },
  { initials: "LC", name: "Laura C.", cert: "ISC2 CC", target: 100, status: "passed" },
];

const DEFAULT_STATUS_LABELS: Record<Status, string> = {
  passed: "Superato",
  "in-progress": "In corso",
  behind: "In ritardo",
};

const STATUS_STYLES: Record<Status, string> = {
  passed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "in-progress": "bg-amber-50 text-amber-700 border-amber-200",
  behind: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function TeamDashboardPreview({
  teamLabel = "Team DevOps · 8 membri",
  liveLabel = "Live",
  members = DEFAULT_MEMBERS,
  statusLabels = DEFAULT_STATUS_LABELS,
}: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0F1B2E] p-5 shadow-2xl shadow-black/40">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400">{teamLabel}</span>
        </div>
        <span className="font-mono text-[11px] text-slate-500">{liveLabel}</span>
      </div>

      <div className="space-y-3">
        {members.map((m) => (
          <div key={m.initials} className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1B2C47] font-mono text-[11px] font-semibold text-slate-200">
              {m.initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-[13px] font-medium text-slate-200">{m.name}</p>
                <span
                  className={`shrink-0 rounded-full border px-2 py-0.5 font-mono text-[10px] ${STATUS_STYLES[m.status]}`}
                >
                  {statusLabels[m.status]}
                </span>
              </div>
              <p className="truncate text-[11px] text-slate-500">{m.cert}</p>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-300 transition-all duration-1000 ease-out"
                  style={{ width: mounted ? `${m.target}%` : "0%" }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
