// src/components/CategoryBox.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { KeyboardEvent, MouseEvent, useMemo } from 'react';

type Locale = 'it' | 'en' | 'fr' | 'es';
type I18nText = string | Partial<Record<Locale, string>>;

type Chip =
  | { name: string; link: string }    // cliccabile
  | { name: string; link?: undefined } // “in arrivo”

type Props = {
  title: I18nText;
  description?: I18nText;
  icon?: React.ReactNode;
  /** string = path (router.push) | function = onClick custom */
  route?: string | (() => void);
  color?:
    | 'red' | 'rose' | 'green' | 'purple' | 'yellow'
    | 'indigo' | 'orange' | 'cyan' | 'blue' | 'teal';
  certifications?: Chip[];
  compact?: boolean;
  className?: string;
};

const borderColors = { red:'border-red-300', rose:'border-rose-300', green:'border-green-300', purple:'border-purple-300', yellow:'border-yellow-300', indigo:'border-indigo-300', orange:'border-orange-300', cyan:'border-cyan-300', blue:'border-blue-300', teal:'border-teal-300' };
const bgColor      = { red:'bg-red-100',   rose:'bg-rose-100',   green:'bg-green-100',   purple:'bg-purple-100',   yellow:'bg-yellow-100',   indigo:'bg-indigo-100',   orange:'bg-orange-100',   cyan:'bg-cyan-100',   blue:'bg-blue-100',   teal:'bg-teal-100' };
const iconBg       = { red:'bg-red-100 text-red-600', rose:'bg-rose-100 text-rose-600', green:'bg-green-100 text-green-600', purple:'bg-purple-100 text-purple-600', yellow:'bg-yellow-100 text-yellow-600', indigo:'bg-indigo-100 text-indigo-600', orange:'bg-orange-100 text-orange-600', cyan:'bg-cyan-100 text-cyan-600', blue:'bg-blue-100 text-blue-600', teal:'bg-teal-100 text-teal-600' };
const textColor    = { red:'text-red-700', rose:'text-rose-700', green:'text-green-700', purple:'text-purple-700', yellow:'text-yellow-700', indigo:'text-indigo-700', orange:'text-orange-700', cyan:'text-cyan-700', blue:'text-blue-700', teal:'text-teal-700' };

const ALL: Locale[] = ['it','en','fr','es'];
const langFromPath = (p: string): Locale => {
  const m = p.match(/^\/(it|en|fr|es)(?:\/|$)/i);
  return (m?.[1]?.toLowerCase() || 'it') as Locale;
};
const getLabel = (val: I18nText, lang: Locale): string =>
  typeof val === 'string'
    ? val
    : (val[lang] ??
       val.it ?? val.en ?? val.fr ?? val.es ??
       '');

export default function CategoryBox({
  title,
  description,
  icon,
  route,
  color,
  certifications = [],
  compact = false,
  className = '',
}: Props) {
  const router = useRouter();
  const pathname = usePathname() || '/it';
  const lang = useMemo(() => langFromPath(pathname), [pathname]);

  const border = (borderColors as any)[color] || 'border-gray-300';
  const iconClass = (iconBg as any)[color] || 'bg-gray-100 text-gray-600';
  const textClass = (textColor as any)[color] || 'text-gray-700';
  const background = (bgColor as any)[color] || 'bg-white';

  const pad = 'p-4';
  const titleSize = 'text-base';
  const descSize = 'text-sm';
  const chipText = compact ? 'text-[11px]' : 'text-xs';
  const chipPad = compact ? 'px-2 py-0.5' : 'px-2 py-1';
  const chipsMaxH = compact ? 'max-h-[105px]' : 'max-h-none';

  const handleCardClick = () => {
    if (!route) return;
    if (typeof route === 'string') router.push(route);
    else route();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  const btnClasses =
    `rounded-md font-semibold text-xs py-1.5 px-3
     bg-blue-600 text-white hover:bg-blue-700 transition`;

  const cardBase =
    `group rounded-xl ${pad} shadow-md border ${border} ${background} ${className}
     cursor-pointer transition-transform duration-200 ease-out
     hover:-translate-y-1 hover:shadow-lg
     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2`;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={getLabel(title, lang)}
      className={cardBase}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
    >
      <div className="flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${iconClass} shrink-0 transition-transform group-hover:scale-110`}>
            {icon}
          </div>
          <div className={`${titleSize} font-semibold ${textClass}`}>
            {getLabel(title, lang)}
          </div>
        </div>

        {/* Descrizione */}
        {!!description && (
          <p
            className={[
              descSize,
              'text-gray-600 leading-snug mt-2',
              compact ? 'line-clamp-2' : 'whitespace-normal',
            ].join(' ')}
          >
            {getLabel(description, lang)}
          </p>
        )}

        {/* Chips */}
        {certifications.length > 0 && (
          <div
            className={[
              'mt-3 relative',
              compact
                ? 'overflow-hidden [mask-image:linear-gradient(to_bottom,black_85%,transparent)]'
                : 'overflow-visible',
              chipsMaxH,
            ].join(' ')}
          >
            <div className="flex flex-wrap gap-2">
              {certifications.map((cert, i) =>
                cert.link ? (
                  <Link
                    key={i}
                    href={cert.link}
                    onClick={(e: MouseEvent) => e.stopPropagation()} // evita click sulla card
                    className={`${chipText} ${chipPad} bg-white border border-blue-100 text-blue-600 rounded-full hover:underline hover:bg-blue-50 truncate max-w-full`}
                    title={cert.name}
                  >
                    {cert.name}
                  </Link>
                ) : (
                  <span
                    key={i}
                    onClick={(e: MouseEvent) => e.stopPropagation()}
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

        {/* CTA (opzionale: tutta la card è cliccabile) */}
        <div className="flex justify-end mt-3">
          <button
            className={btnClasses}
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
          >
            {getLabel({ it: 'Quiz', en: 'Quiz', es: 'Quiz', fr: 'Quiz' }, lang)}
          </button>
        </div>
      </div>
    </div>
  );
}
