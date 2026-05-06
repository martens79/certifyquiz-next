"use client";

import React from "react";
import Link from "next/link";
import { getLabel } from "@/utils/langUtils";
import { categoryPath, type CategoryKey, type Locale } from "@/lib/paths";

/* ----------------------------- UI COLORS ----------------------------- */

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

/* ----------------------------- TYPES ----------------------------- */

type I18nDict = Record<string, string>;

type CertificationChip = {
  name: string;
  link: string | null;
};

type RoadmapKey = "cybersecurity" | "cloud" | "networking" | "devops";

type Props = {
  title: string | I18nDict;
  description?: string | I18nDict;
  icon: React.ReactNode;

  categoryKey: CategoryKey;
  lang: Locale;

  roadmapKey?: RoadmapKey;
  roadmapLabel?: string | I18nDict;

  color?: ColorKey;
  certifications?: CertificationChip[];
  compact?: boolean;
  className?: string;

  /**
   * default = card normale della griglia
   * wide = card orizzontale per sezioni larghe tipo Management
   */
  variant?: "default" | "wide";
};

/* ----------------------------- COMPONENT ----------------------------- */

export default function CategoryBox({
  title,
  description,
  icon,
  categoryKey,
  lang,
  roadmapKey,
  roadmapLabel,
  color = "blue",
  certifications = [],
  compact = false,
  className = "",
  variant = "default",
}: Props) {
  const border = borderColors[color];
  const iconClass = iconBg[color];
  const textClass = textColor[color];
  const background = bgColor[color];

  const isWide = variant === "wide";

  const pad = "p-4";
  const titleSize = "text-base";
  const descSize = "text-sm";
  const chipText = compact ? "text-[11px]" : "text-xs";
  const chipPad = compact ? "px-2 py-0.5" : "px-2 py-1";
  const chipsMaxH = compact ? "max-h-[86px]" : "max-h-none";

  const titleStr =
    typeof title === "string" ? title : (getLabel(title) as string);

  const descStr =
    typeof description === "string"
      ? description
      : description
      ? (getLabel(description) as string)
      : "";

  const roadmapHref = roadmapKey
    ? lang === "en"
      ? `/roadmap-${roadmapKey}`
      : `/${lang}/roadmap-${roadmapKey}`
    : null;

  const roadmapText =
    typeof roadmapLabel === "string"
      ? roadmapLabel
      : roadmapLabel
      ? (getLabel(roadmapLabel) as string)
      : (getLabel({
          it: "Guida: Roadmap →",
          en: "Guide: Roadmap →",
          fr: "Guide : Roadmap →",
          es: "Guía: Roadmap →",
        }) as string);

  const btnClasses =
    "rounded-md font-semibold text-xs py-1.5 px-3 bg-blue-600 text-white hover:bg-blue-700 transition";

  const cardBase = [
    "group rounded-xl",
    pad,
    "shadow-md border",
    border,
    background,
    className,
    "h-full flex flex-col",
    "transition-transform duration-200 ease-out hover:-translate-y-1 hover:shadow-lg",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2",
  ].join(" ");

  return (
    <div className={cardBase}>
      <div
        className={
          isWide
            ? "grid h-full grid-cols-1 items-center gap-4 md:grid-cols-[1.4fr_1fr_auto]"
            : "flex h-full flex-col"
        }
      >
        {/* Colonna sinistra: header, descrizione, roadmap e chips */}
        <div>
          {/* Header */}
          <div className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${iconClass} transition-transform group-hover:scale-110`}
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
                "mt-2 leading-snug text-gray-600",
                compact && !isWide ? "line-clamp-2" : "whitespace-normal",
              ].join(" ")}
            >
              {descStr}
            </p>
          )}

          {/* Roadmap CTA opzionale */}
          {roadmapHref && (
            <div className="mt-3">
              <Link
                href={roadmapHref}
                prefetch={false}
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:underline"
              >
                {roadmapText}
              </Link>
            </div>
          )}

          {/* Chips certificazioni */}
          {certifications.length > 0 && (
            <div
                className={[
                  "relative mt-3",
                  compact && !isWide
                    ? "overflow-y-auto pr-1"
                    : "overflow-visible",
                  compact && !isWide ? chipsMaxH : "max-h-none",
                ].join(" ")}
              >
              <div className="flex flex-wrap gap-2">
                {certifications.map((cert, i) =>
                  cert.link ? (
                    <Link
                      key={`${cert.name}-${i}`}
                      href={cert.link}
                      prefetch={false}
                      className={`${chipText} ${chipPad} max-w-full truncate rounded-full border border-blue-100 bg-white text-blue-600 hover:bg-blue-50 hover:underline`}
                      title={cert.name}
                    >
                      {cert.name}
                    </Link>
                  ) : (
                    <span
                      key={`${cert.name}-${i}`}
                      className={`${chipText} ${chipPad} max-w-full cursor-not-allowed truncate rounded-full border border-gray-300 bg-gray-200 italic text-gray-500`}
                      title="Coming soon"
                    >
                      {cert.name} 🚧
                    </span>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* Colonna centrale: claim visibile solo nella card larga */}
        {isWide && (
          <div className="hidden px-4 text-center md:block">
            <p className={`text-lg font-semibold ${textClass}`}>
              {getLabel({
                it: "Dal tecnico al ruolo di guida.",
                en: "From technical skills to leadership.",
                fr: "Des compétences techniques au leadership.",
                es: "De las habilidades técnicas al liderazgo.",
              })}
            </p>

            <p className="mt-1 text-sm text-gray-600">
              {getLabel({
                it: "Percorsi pensati per crescere in carriera, guidare team e gestire progetti reali.",
                en: "Paths designed to grow your career, lead teams and manage real projects.",
                fr: "Des parcours pour faire évoluer votre carrière, diriger des équipes et gérer des projets réels.",
                es: "Rutas pensadas para crecer profesionalmente, liderar equipos y gestionar proyectos reales.",
              })}
            </p>
          </div>
        )}

        {/* CTA */}
        <div
          className={
            isWide ? "flex justify-end md:self-end" : "mt-auto flex justify-end pt-3"
          }
        >
          <Link
            href={categoryPath(lang, categoryKey)}
            prefetch={false}
            className={btnClasses}
          >
            {getLabel({ it: "Quiz", en: "Quiz", fr: "Quiz", es: "Quiz" })}
          </Link>
        </div>
      </div>
    </div>
  );
}