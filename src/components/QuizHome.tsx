// src/components/QuizHome.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { GraduationCap, Lock, Network, Cloud, Database, Code, Server, Cpu } from 'lucide-react';
import QuizTitle from '@/components/QuizTitle';
import CategoryBox from '@/components/CategoryBox';
import BottomNavbar from '@/components/BottomNavbar';

type Locale = 'it' | 'en' | 'fr' | 'es';
type I18nText = Partial<Record<Locale, string>>;

const getLabel = (d: I18nText, lang: Locale) =>
  d[lang] ?? d.it ?? d.en ?? d.fr ?? d.es ?? '';

const slugFromLink = (link?: string | null) => {
  if (!link) return null;
  const i = link.indexOf('/certifications/');
  return i === -1 ? null : link.slice(i + '/certifications/'.length).replace(/\/+$/, '');
};

const translatedCountForLink = (availability: any, link?: string | null) => {
  const slug = slugFromLink(link);
  const rec = slug ? availability?.[slug] : undefined;
  if (rec && typeof rec === 'object') return Number(rec.translated || 0);
  return Number(rec || 0);
};

const smartBadgeLabel = (availability: any, link: string | null | undefined, lang: Locale) => {
  const slug = slugFromLink(link);
  const rec = slug ? availability?.[slug] : undefined;
  const translated = rec && typeof rec === 'object' ? Number(rec.translated || 0) : Number(rec || 0);
  const total = rec && typeof rec === 'object' ? Number(rec.total || 0) : 0;
  if (total > 0 && translated >= total) {
    const L = { en: 'All topics', fr: 'Tous les sujets', es: 'Todos los temas', it: 'Tutti i topic' };
    return `✓ ${L[lang] || L.en}`;
  }
  const L2 = {
    it: (n:number)=> n===1?'1 topic':`${n} topic`,
    en: (n:number)=> n===1?'1 topic':`${n} topics`,
    fr: (n:number)=> n===1?'1 sujet':`${n} sujets`,
    es: (n:number)=> n===1?'1 tema':`${n} temas`,
  };
  return `✔ ${(L2[lang]||L2.en)(translated)}`;
};

const AVAILABLE_TXT: Record<Locale, { title: string; lead: string }> = {
  en: { title: 'Available topics', lead: 'Already translated in this language:' },
  fr: { title: 'Sujets disponibles', lead: 'Déjà traduits dans cette langue :' },
  es: { title: 'Temas disponibles', lead: 'Ya traducidos en este idioma:' },
  it: { title: 'Topic disponibili', lead: 'Già disponibili in italiano:' },
};

export default function QuizHome({ lang }: { lang: Locale }) {
  const [availability, setAvailability] = useState<Record<string, { translated: number; total: number }>>({});

  useEffect(() => {
    if (lang === 'it') return;
    fetch(`/api/backend/quiz-translation-availability?lang=${lang}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data) => {
        const map: Record<string, { translated: number; total: number }> = {};
        (data?.items || []).forEach((it: any) => {
          if (!it?.slug) return;
          map[it.slug] = {
            translated: Number(it.topics_with_translations || 0),
            total: Number(it.topics_total || 0),
          };
        });
        setAvailability(map);
      })
      .catch((e) => console.error('availability fetch error:', e?.status, e?.message));
  }, [lang]);

  const certificationNames = {
    base: [
      { name: 'EIPASS', link: `/${lang}/certifications/eipass` },
      { name: 'ECDL', link: `/${lang}/certifications/ecdl` },
      { name: 'PEKIT', link: `/${lang}/certifications/pekit` },
      { name: 'A+', link: `/${lang}/certifications/comptia-a-plus` },
      { name: 'IC3', link: null },
      { name: 'CompTIA Tech+ (ex ITF+)', link: `/${lang}/certifications/comptia-itf-plus` },
    ],
    sicurezza: [
      { name: 'Security+', link: `/${lang}/certifications/security-plus` },
      { name: 'CEH', link: `/${lang}/certifications/ceh` },
      { name: 'CISSP', link: `/${lang}/certifications/cissp` },
      { name: 'CISM', link: null },
      { name: 'ISC2 CC', link: `/${lang}/certifications/isc2-cc` },
      { name: 'CCST Cybersecurity', link: `/${lang}/certifications/cisco-ccst-security` },
    ],
    reti: [
      { name: 'Network+', link: `/${lang}/certifications/network-plus` },
      { name: 'CCNA', link: `/${lang}/certifications/ccna` },
      { name: 'JNCIE', link: `/${lang}/certifications/jncie` },
      { name: 'CCST Networking', link: `/${lang}/certifications/cisco-ccst-networking` },
      { name: 'F5-CTS', link: `/${lang}/certifications/f5` },
    ],
    cloud: [
      { name: 'AWS Cloud Practitioner', link: `/${lang}/certifications/aws-cloud-practitioner` },
      { name: 'Azure', link: `/${lang}/certifications/microsoft-azure-fundamentals` },
      { name: 'Google Cloud', link: `/${lang}/certifications/google-cloud` },
      { name: 'CompTIA Cloud+', link: `/${lang}/certifications/comptia-cloud-plus` },
      { name: 'IBM Cloud v5', link: `/${lang}/certifications/ibm-cloud-v5` },
      { name: 'AWS Solutions Architect', link: `/${lang}/certifications/aws-solutions-architect` },
    ],
    database: [
      { name: 'Microsoft SQL Server', link: `/${lang}/certifications/microsoft-sql-server` },
      { name: 'Oracle', link: `/${lang}/certifications/oracle-database-sql` },
      { name: 'MySQL', link: `/${lang}/certifications/mysql` },
      { name: 'MongoDB', link: `/${lang}/certifications/mongodb-developer` },
    ],
    programmazione: [
      { name: 'Java SE', link: `/${lang}/certifications/java-se` },
      { name: 'Python', link: `/${lang}/certifications/python-developer` },
      { name: 'JavaScript', link: `/${lang}/certifications/javascript-developer` },
      { name: 'C#', link: `/${lang}/certifications/csharp` },
      { name: 'TypeScript', link: null, comingSoon: true as const },
      { name: 'Kotlin', link: null, comingSoon: true as const },
      { name: 'Go', link: null, comingSoon: true as const },
      { name: 'Rust', link: null, comingSoon: true as const },
      { name: 'Swift', link: null, comingSoon: true as const },
    ],
    virtualizzazione: [
      { name: 'VMware VCP', link: `/${lang}/certifications/vmware-vcp` },
      { name: 'Hyper-V', link: null },
      { name: 'Microsoft Virtualization', link: `/${lang}/certifications/microsoft-virtualization` },
    ],
    'intelligenza-artificiale': [
      { name: 'Google TensorFlow Developer', link: `/${lang}/certifications/tensorflow` },
      { name: 'PyTorch', link: null },
      { name: 'OpenAI', link: null },
      { name: 'Microsoft AI Fundamentals', link: `/${lang}/certifications/microsoft-ai-fundamentals` },
    ],
  };

  const allCerts = Object.values(certificationNames).flat();
  const translatedCertsForLang =
    lang !== 'it'
      ? allCerts
          .filter((c) => translatedCountForLink(availability, c.link) > 0)
          .sort((a, b) => {
            const cb = translatedCountForLink(availability, b.link);
            const ca = translatedCountForLink(availability, a.link);
            return cb !== ca ? cb - ca : (a.name || '').localeCompare(b.name || '');
          })
      : [];

  const quizCategories = [
    { key: 'base', route: '/base',
      name: getLabel({ it:'Base', en:'Fundamentals', es:'Básico', fr:'Base' }, lang),
      description: getLabel({
        it:'Concetti base di informatica e hardware.',
        en:'Basic IT and hardware concepts.',
        es:'Conceptos básicos de informática y hardware.',
        fr:'Notions de base en informatique et matériel.',
      }, lang),
      color:'blue', icon:<GraduationCap size={30} />, certifications: certificationNames.base },
    { key: 'sicurezza', route: '/sicurezza',
      name: getLabel({ it:'Sicurezza', en:'Security', es:'Seguridad', fr:'Sécurité' }, lang),
      description: getLabel({
        it:'Fondamenti di sicurezza informatica.',
        en:'Cybersecurity fundamentals.',
        es:'Fundamentos de ciberseguridad.',
        fr:'Principes de cybersécurité.',
      }, lang),
      color:'rose', icon:<Lock size={30} />, certifications: certificationNames.sicurezza },
    { key: 'reti', route: '/reti',
      name: getLabel({ it:'Reti', en:'Networking', es:'Redes', fr:'Réseaux' }, lang),
      description: getLabel({
        it:'Protocolli e infrastrutture di rete.',
        en:'Network protocols and infrastructure.',
        es:'Protocolos e infraestructura de red.',
        fr:'Protocoles et infrastructure réseau.',
      }, lang),
      color:'green', icon:<Network size={30} />, certifications: certificationNames.reti },
    { key: 'cloud', route: '/cloud',
      name: getLabel({ it:'Cloud', en:'Cloud', es:'Nube', fr:'Cloud' }, lang),
      description: getLabel({
        it:'Servizi e architetture cloud.',
        en:'Cloud services and architectures.',
        es:'Servicios y arquitecturas cloud.',
        fr:'Services et architectures cloud.',
      }, lang),
      color:'purple', icon:<Cloud size={30} />, certifications: certificationNames.cloud },
    { key: 'database', route: '/database',
      name: getLabel({ it:'Database', en:'Database', es:'Base de datos', fr:'Base de données' }, lang),
      description: getLabel({
        it:'Progettazione e gestione dei database.',
        en:'Database design and management.',
        es:'Diseño y gestión de bases de datos.',
        fr:'Conception et gestion de bases de données.',
      }, lang),
      color:'yellow', icon:<Database size={30} />, certifications: certificationNames.database },
    { key: 'programmazione', route: '/programmazione',
      name: getLabel({ it:'Programmazione', en:'Programming', es:'Programación', fr:'Programmation' }, lang),
      description: getLabel({
        it:'Linguaggi e sviluppo software.',
        en:'Languages and software development.',
        es:'Lenguajes y desarrollo de software.',
        fr:'Langages et développement logiciel.',
      }, lang),
      color:'teal', icon:<Code size={30} />, certifications: certificationNames.programmazione },
    { key: 'virtualizzazione', route: '/virtualizzazione',
      name: getLabel({ it:'Virtualizzazione', en:'Virtualization', es:'Virtualización', fr:'Virtualisation' }, lang),
      description: getLabel({
        it:'Tecnologie di virtualizzazione.',
        en:'Virtualization technologies.',
        es:'Tecnologías de virtualización.',
        fr:'Technologies de virtualisation.',
      }, lang),
      color:'orange', icon:<Server size={30} />, certifications: certificationNames.virtualizzazione },
    { key: 'intelligenza-artificiale', route: '/intelligenza-artificiale',
      name: getLabel({
        it:'Intelligenza Artificiale', en:'Artificial Intelligence', es:'Inteligencia Artificial', fr:'Intelligence Artificielle',
      }, lang),
      description: getLabel({
        it:'Machine learning e AI applicata.',
        en:'Machine learning and applied AI.',
        es:'Aprendizaje automático e IA aplicada.',
        fr:'Apprentissage automatique et IA appliquée.',
      }, lang),
      color:'cyan', icon:<Cpu size={30} />, certifications: certificationNames['intelligenza-artificiale'] },
  ];

  return (
    <div className="min-h-[100svh] bg-gray-100 text-gray-900 flex flex-col">
      <main className="flex-1 overflow-y-auto px-3 pt-10 pb-[96px]">
        <QuizTitle />

        {lang !== 'it' && translatedCertsForLang.length > 0 && (
          <div className="mx-auto max-w-[1380px] mb-4 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-900 p-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="text-sm">
                <div className="font-semibold">{AVAILABLE_TXT[lang]?.title || 'Available topics'}</div>
                <div className="opacity-80">{AVAILABLE_TXT[lang]?.lead || 'Already translated in this language:'}</div>
              </div>
              <div className="flex flex-wrap gap-2">
                {allCerts
                  .filter((c) => translatedCountForLink(availability, c.link) > 0)
                  .sort((a, b) => translatedCountForLink(availability, b.link) - translatedCountForLink(availability, a.link))
                  .map((c) => {
                    const label = smartBadgeLabel(availability, c.link, lang);
                    return (
                      <Link
                        key={c.link || c.name}
                        href={c.link || '#'}
                        onClick={(e) => { if (!c.link) e.preventDefault(); }}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm transition
                                    ${c.link ? 'bg-white border-emerald-300 hover:bg-emerald-100' : 'bg-gray-200 border-gray-300 cursor-not-allowed text-gray-500'}`}
                        title={label}
                      >
                        <span>{c.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 border border-emerald-400">
                          {label}
                        </span>
                      </Link>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        <div className="mx-auto max-w-[1380px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-2 auto-rows-[230px]">
          {quizCategories.map((cat) => (
            <CategoryBox
              key={cat.key}
              title={cat.name}
              icon={cat.icon}
              description={cat.description}
              route={cat.route}
              color={cat.color as any}
              certifications={cat.certifications as any}
              compact
            />
          ))}
        </div>
      </main>

      <BottomNavbar />
    </div>
  );
}
