// src/components/CategoryBox.tsx
"use client";

import React, {
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import Link from "next/link";
import { getLabel } from "@/utils/langUtils";

type ColorKey =
  | "red"
  | "rose"
  | "green"
  | "purple"
  | "yellow"
  | "indigo"
  | "orange"
  | "cyan"
  | "blue"
  | "teal";

const borderColors: Record<ColorKey, string> = {
  red: "border-red-300",
  rose: "border-rose-300",
  green: "border-green-300",
  purple: "border-purple-300",
  yellow: "border-yellow-300",
  indigo: "border-indigo-300",
  orange: "border-orange-300",
  cyan: "border-cyan-300",
  blue: "border-blue-300",
  teal: "border-teal-300",
};
const bgColor: Record<ColorKey, string> = {
  red: "bg-red-100",
  rose: "bg-rose-100",
  green: "bg-green-100",
  purple: "bg-purple-100",
  yellow: "bg-yellow-100",
  indigo: "bg-indigo-100",
  orange: "bg-orange-100",
  cyan: "bg-cyan-100",
  blue: "bg-blue-100",
  teal: "bg-teal-100",
};
const iconBg: Record<ColorKey, string> = {
  red: "bg-red-100 text-red-600",
  rose: "bg-rose-100 text-rose-600",
  green: "bg-green-100 text-green-600",
  purple: "bg-purple-100 text-purple-600",
  yellow: "bg-yellow-100 text-yellow-600",
  indigo: "bg-indigo-100 text-indigo-600",
  orange: "bg-orange-100 text-orange-600",
  cyan: "bg-cyan-100 text-cyan-600",
  blue: "bg-blue-100 text-blue-600",
  teal: "bg-teal-100 text-teal-600",
};
const textColor: Record<ColorKey, string> = {
  red: "text-red-700",
  rose: "text-rose-700",
  green: "text-green-700",
  purple: "text-purple-700",
  yellow: "text-yellow-700",
  indigo: "text-indigo-700",
  orange: "text-orange-700",
  cyan: "text-cyan-700",
  blue: "text-blue-700",
  teal: "text-teal-700",
};

type I18nDict = Record<string, string>;

type CertificationChip = {
  name: string;
  link: string | null;
};

type Props = {
  title: string | I18nDict;
  description?: string | I18nDict;
  icon: React.ReactNode;
  /** se string → Link Next; se function → onClick custom */
  route?: string | (() => void);
  color?: ColorKey;
  certifications?: CertificationChip[];
  compact?: boolean;
  className?: string;
};

export default function CategoryBox({
  title,
  description,
  icon,
  route,
  color = "blue",
  certifications = [],
  compact = false,
  className = "",
}: Props) {
  const colorKey: ColorKey = color;

  // classi derivate dal colore (fallback di sicurezza)
  const border = borderColors[colorKey] ?? "border-gray-300";
  const iconClass = iconBg[colorKey] ?? "bg-gray-100 text-gray-600";
  const textClass = textColor[colorKey] ?? "text-gray-700";
  const background = bgColor[colorKey] ?? "bg-white";

  // layout
  const pad = "p-4";
  const titleSize = "text-base";
  const descSize = "text-sm";
  const chipText = compact ? "text-[11px]" : "text-xs";
  const chipPad = compact ? "px-2 py-0.5" : "px-2 py-1";
  const chipsMaxH = compact ? "max-h-[105px]" : "max-h-none";

  // stringhe i18n garantite come string
  const titleStr: string =
    typeof title === "string" ? title : (getLabel(title) as string);
  const descStr: string =
    typeof description === "string"
      ? description
      : description
      ? (getLabel(description) as string)
      : "";

  // interazioni
  const handleCardClick = (_e?: ReactMouseEvent<HTMLDivElement>) => {
    if (typeof route === "function") route();
  };
  const handleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick();
    }
  };

  const btnClasses =
    "rounded-md font-semibold text-xs py-1.5 px-3 bg-blue-600 text-white hover:bg-blue-700 transition";

  const cardBase = [
    "group rounded-xl",
    pad,
    "shadow-md border",
    border,
    background,
    className,
    "cursor-pointer transition-transform duration-200 ease-out",
    "hover:-translate-y-1 hover:shadow-lg",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-blue-400 focus-visible:ring-offset-2",
  ].join(" ");

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={titleStr}
      className={cardBase}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
    >
      <div className="flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${iconClass} shrink-0 transition-transform group-hover:scale-110`}
          >
            {icon}
          </div>
          <div className={`${titleSize} font-semibold ${textClass}`}>
            {titleStr}
          </div>
        </div>

        {/* Descrizione */}
        {descStr && (
          <p
            className={[
              descSize,
              "text-gray-600 leading-snug mt-2",
              compact ? "line-clamp-2" : "whitespace-normal",
            ].join(" ")}
          >
            {descStr}
          </p>
        )}

        {/* Chips */}
        {certifications.length > 0 && (
          <div
            className={[
              "mt-3 relative",
              compact
                ? "overflow-hidden [mask-image:linear-gradient(to_bottom,black_85%,transparent)]"
                : "overflow-visible",
              chipsMaxH,
            ].join(" ")}
          >
            <div className="flex flex-wrap gap-2">
              {certifications.map((cert, i) =>
                cert.link ? (
                  <Link
                    key={`${cert.name}-${i}`}
                    href={cert.link}
                    onClick={(e) => e.stopPropagation()}
                    className={`${chipText} ${chipPad} bg-white border border-blue-100 text-blue-600 rounded-full hover:underline hover:bg-blue-50 truncate max-w-full`}
                    title={cert.name}
                  >
                    {cert.name}
                  </Link>
                ) : (
                  <span
                    key={`${cert.name}-${i}`}
                    onClick={(e) => e.stopPropagation()}
                    className={`${chipText} ${chipPad} bg-gray-200 border border-gray-300 text-gray-500 rounded-full italic cursor-not-allowed truncate max-w-full`}
                    title="In arrivo"
                  >
                    {cert.name} 🚧
                  </span>
                )
              )}
            </div>
          </div>
        )}

        {/* CTA (se route è string usa Link, altrimenti button) */}
        <div className="flex justify-end mt-3">
          {typeof route === "string" ? (
            <Link
              href={route}
              onClick={(e) => e.stopPropagation()}
              className={btnClasses}
            >
              {getLabel({ it: "Quiz", en: "Quiz", es: "Quiz", fr: "Quiz" })}
            </Link>
          ) : (
            <button
              className={btnClasses}
              onClick={(e) => {
                e.stopPropagation();
                if (typeof route === "function") route();
              }}
            >
              {getLabel({ it: "Quiz", en: "Quiz", es: "Quiz", fr: "Quiz" })}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
