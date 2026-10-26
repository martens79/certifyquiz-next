'use client';
import { useEffect, useRef, useState } from 'react';
import { certPath, type Locale } from '@/lib/paths';
import { trackEvent } from '@/lib/analytics';
import { COUNTRIES, COUNTRY_KEY, GEO_CERTS, GEO_COPY, normalizeCountry, type Country } from '@/lib/home-geo';

const TITLES: Record<string, string> = {
  ccna: 'Cisco CCNA',
  'aws-ai-practitioner': 'AWS AI Practitioner',
  'cisco-ccst-cybersecurity': 'Cisco CCST Cybersecurity',
  'security-plus': 'CompTIA Security+',
};
const COUNTRY_NAMES: Record<Locale, readonly string[]> = {
  it: ['Italia', 'Stati Uniti', 'Spagna', 'Messico'],
  en: ['Italy', 'United States', 'Spain', 'Mexico'],
  fr: ['Italie', 'États-Unis', 'Espagne', 'Mexique'],
  es: ['Italia', 'Estados Unidos', 'España', 'México'],
};
export default function GeoRecommendations({ lang }: { lang: Locale }) {
  const [country, setCountry] = useState<Country>('general');
  const [ready, setReady] = useState(false);
  const root = useRef<HTMLElement>(null);
  const copy = GEO_COPY[lang];
  useEffect(() => {
    try { setCountry(normalizeCountry(localStorage.getItem(COUNTRY_KEY))); } catch { /* Storage optional. */ }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready || !root.current || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      trackEvent('home_geo_impression', { country, language: lang, certification_slugs: GEO_CERTS[country].join(','), source_page: 'home' });
      observer.disconnect();
    }, { threshold: 0.5 });
    observer.observe(root.current);
    return () => observer.disconnect();
  }, [country, lang, ready]);
  return (
    <section ref={root} aria-label={copy.title} className="mx-auto my-6 w-full max-w-6xl rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">{copy.title}</h2>
        <label className="flex items-center gap-2 text-sm">
          {copy.change}
          <select disabled={!ready} value={country} onChange={event => {
            const next = normalizeCountry(event.target.value);
            setCountry(next);
            try { localStorage.setItem(COUNTRY_KEY, next); } catch { /* Continue in memory. */ }
            trackEvent('home_geo_country_changed', { country: next, previous_country: country, language: lang, source_page: 'home' });
          }} className="max-w-44 rounded border border-slate-300 bg-white p-2">
            <option value="general">{copy.general}</option>
            {COUNTRIES.slice(1).map((code, index) => <option key={code} value={code}>{COUNTRY_NAMES[lang][index]}</option>)}
          </select>
        </label>
      </div>
      <p className="mt-2 min-h-10 text-sm text-slate-600">{copy.note}</p>
      <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {GEO_CERTS[country].map(slug => <li key={slug}>
          <a href={certPath(lang, slug)} className="flex min-h-16 items-center rounded-xl border border-slate-200 bg-white p-4 font-semibold text-blue-700 hover:underline" onClick={() => trackEvent('home_geo_clicked', { country, language: lang, certification_slug: slug, source_page: 'home' })}>{TITLES[slug]}</a>
        </li>)}
      </ul>
    </section>
  );
}
